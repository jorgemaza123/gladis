import { env } from 'cloudflare:workers';
import { demoContent } from '@/data/demo';
import { normalizeSite } from '@/data/defaults';
import type { SiteContent, ContentEntry } from '@/models/content';
import { siteSchema } from '@/lib/validation';

type Stored = { id: string; collection: string; body: string };
export async function readSite(): Promise<SiteContent> {
  const meta = await env.DB.prepare(
    'SELECT version, settings FROM site_state WHERE id=?',
  )
    .bind('site')
    .first<{ version: number; settings: string }>();
  if (!meta) {
    const legacy = await env.DB.prepare(
      'SELECT content,version FROM documents WHERE id=?',
    )
      .bind('site')
      .first<{ content: string; version: number }>();
    return legacy
      ? normalizeSite({
          ...JSON.parse(legacy.content),
          version: legacy.version,
        })
      : structuredClone(demoContent);
  }
  const { results } = await env.DB.prepare(
    'SELECT id,collection,body FROM content_records ORDER BY sort_order,id',
  ).all<Stored>();
  const pick = (collection: string) =>
    results
      .filter((r) => r.collection === collection)
      .map((r) => JSON.parse(r.body));
  return normalizeSite({
    version: meta.version,
    settings: JSON.parse(meta.settings),
    entries: pick('entries'),
    media: pick('media'),
    sections: pick('sections'),
    faqs: pick('faqs'),
  });
}
function rows(site: SiteContent): Stored[] {
  return (['entries', 'media', 'sections', 'faqs'] as const).flatMap(
    (collection) =>
      site[collection].map((value) => ({
        id: value.id,
        collection,
        body: JSON.stringify(value),
      })),
  );
}
export async function saveSite(
  value: unknown,
  actor = 'administrador',
): Promise<SiteContent> {
  const content = siteSchema.parse(normalizeSite(value));
  const previous = await readSite();
  if (previous.version !== content.version) throw new Error('CONFLICT');
  const existing = await env.DB.prepare('SELECT id FROM site_state WHERE id=?')
    .bind('site')
    .first();
  const now = new Date().toISOString();
  content.entries = content.entries.map((entry) => {
    const old = previous.entries.find((e) => e.id === entry.id);
    const changed = !old || JSON.stringify(old) !== JSON.stringify(entry);
    return {
      ...entry,
      createdAt: old?.createdAt || entry.createdAt || now,
      updatedAt: changed ? now : old.updatedAt || now,
    };
  });
  const next = { ...content, version: content.version + 1 };
  const token = crypto.randomUUID();
  const reserved = await env.DB.prepare(
    'SELECT path, entry_id FROM redirects',
  ).all<{ path: string; entry_id: string }>();
  for (const e of next.entries) {
    if (
      reserved.results.some(
        (r) => r.path === `/${e.kind}/${e.slug}` && r.entry_id !== e.id,
      )
    )
      throw new Error(
        'Esta URL tiene una redirección de otro contenido. Elige otra dirección.',
      );
  }
  const statements: D1PreparedStatement[] = [
    env.DB.prepare(
      `INSERT INTO site_state(id,version,settings,write_token,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET version=excluded.version,settings=excluded.settings,write_token=excluded.write_token,updated_at=excluded.updated_at WHERE site_state.version=?`,
    ).bind(
      'site',
      next.version,
      JSON.stringify(next.settings),
      token,
      now,
      content.version,
    ),
  ];
  const gate =
    "EXISTS(SELECT 1 FROM site_state WHERE id='site' AND write_token=?)";
  const oldRows = new Map(
    (existing ? rows(previous) : []).map((r) => [r.id, r]),
  );
  const newRows = rows(next);
  const ids = new Set(newRows.map((r) => r.id));
  for (const row of newRows) {
    if (oldRows.get(row.id)?.body === row.body) continue;
    const entry = JSON.parse(row.body);
    statements.push(
      env.DB.prepare(
        `INSERT INTO content_records(id,collection,kind,slug,status,sort_order,body) SELECT ?,?,?,?,?,?,? WHERE ${gate} ON CONFLICT(id) DO UPDATE SET collection=excluded.collection,kind=excluded.kind,slug=excluded.slug,status=excluded.status,sort_order=excluded.sort_order,body=excluded.body`,
      ).bind(
        row.id,
        row.collection,
        entry.kind || '',
        entry.slug || '',
        entry.status || 'published',
        entry.sortOrder || 0,
        row.body,
        token,
      ),
    );
  }
  for (const [id] of oldRows) {
    if (!ids.has(id))
      statements.push(
        env.DB.prepare(
          `DELETE FROM content_records WHERE id=? AND ${gate}`,
        ).bind(id, token),
      );
  }
  for (const old of previous.entries) {
    const current = next.entries.find((e) => e.id === old.id);
    if (
      current &&
      old.status === 'published' &&
      (current.slug !== old.slug || current.kind !== old.kind)
    ) {
      statements.push(
        env.DB.prepare(
          `INSERT INTO redirects(path,entry_id,created_at) SELECT ?,?,? WHERE ${gate} ON CONFLICT(path) DO UPDATE SET entry_id=excluded.entry_id`,
        ).bind(`/${old.kind}/${old.slug}`, old.id, now, token),
      );
    }
  }
  const summary = `${newRows.filter((r) => oldRows.get(r.id)?.body !== r.body).length} contenidos actualizados`;
  statements.push(
    env.DB.prepare(
      `INSERT INTO content_history(id,version,created_at,actor,summary,snapshot) SELECT ?,?,?,?,?,? WHERE ${gate}`,
    ).bind(
      crypto.randomUUID(),
      previous.version,
      now,
      actor,
      summary,
      JSON.stringify(previous),
      token,
    ),
  );
  statements.push(
    env.DB.prepare(
      `DELETE FROM content_history WHERE id NOT IN(SELECT id FROM content_history ORDER BY created_at DESC LIMIT 30) AND ${gate}`,
    ).bind(token),
  );
  // D1 batch is one transaction: a failure rolls back metadata, records and history.
  const results = await env.DB.batch(statements);
  if (!results[0].meta.changes) throw new Error('CONFLICT');
  return next;
}
export async function resolveRedirect(path: string): Promise<string | null> {
  const row = await env.DB.prepare(
    'SELECT entry_id FROM redirects WHERE path=?',
  )
    .bind(path)
    .first<{ entry_id: string }>();
  if (!row) return null;
  const e = await env.DB.prepare(
    'SELECT kind,slug FROM content_records WHERE id=? AND status=?',
  )
    .bind(row.entry_id, 'published')
    .first<{ kind: string; slug: string }>();
  return e ? `/${e.kind}/${e.slug}` : null;
}
export async function listEntries(
  options: {
    kind?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  const page = Math.max(1, options.page || 1),
    pageSize = Math.min(100, Math.max(1, options.pageSize || 24));
  const clauses = ['collection=?'];
  const values: string[] = ['entries'];
  if (options.kind) {
    clauses.push('kind=?');
    values.push(options.kind);
  }
  if (options.status) {
    clauses.push('status=?');
    values.push(options.status);
  }
  const where = clauses.join(' AND ');
  const total = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM content_records WHERE ${where}`,
  )
    .bind(...values)
    .first<{ total: number }>();
  const result = await env.DB.prepare(
    `SELECT body FROM content_records WHERE ${where} ORDER BY sort_order,id LIMIT ? OFFSET ?`,
  )
    .bind(...values, pageSize, (page - 1) * pageSize)
    .all<{ body: string }>();
  return {
    items: result.results.map((r) => JSON.parse(r.body) as ContentEntry),
    total: total?.total || 0,
    page,
    pageSize,
  };
}
