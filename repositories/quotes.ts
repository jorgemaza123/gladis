import { env } from 'cloudflare:workers';
import { digest } from '@/lib/auth';
import { readSite } from '@/repositories/site';
import { quoteSchema } from '@/lib/quote-validation';
import type { QuoteRequest, QuoteStatus } from '@/models/content';
type QuoteRow = {
  id: string;
  reference: string;
  created_at: string;
  updated_at: string;
  status: QuoteStatus;
  notes: string;
  version: number;
  demo: number;
  input: string;
  snapshot: string;
  request_hash: string;
};
export const decodeQuote = (r: QuoteRow): QuoteRequest => ({
  id: r.id,
  reference: r.reference,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  status: r.status,
  notes: r.notes,
  version: r.version,
  demo: !!r.demo,
  input: JSON.parse(r.input),
  snapshot: JSON.parse(r.snapshot),
});
export async function getQuote(id: string) {
  const row = await env.DB.prepare('SELECT * FROM quotes WHERE id=?')
    .bind(id)
    .first<QuoteRow>();
  return row ? decodeQuote(row) : null;
}
export async function createQuote(raw: unknown, ip: string) {
  const input = quoteSchema.parse(raw);
  if (Date.now() - input.startedAt < 1200)
    throw new Error('Espera un momento antes de enviar.');
  const requestHash = await digest(JSON.stringify(input));
  const existing = await env.DB.prepare(
    'SELECT reference,request_hash,demo FROM quotes WHERE id=?',
  )
    .bind(input.requestId)
    .first<{ reference: string; request_hash: string; demo: number }>();
  if (existing) {
    if (existing.request_hash !== requestHash)
      throw new Error(
        'La referencia de este envío ya se usó con otros datos. Recarga para una nueva solicitud.',
      );
    return { reference: existing.reference, demo: !!existing.demo };
  }
  const site = await readSite();
  const live = site.entries.filter((e) => e.status === 'published');
  const selected = input.selectionId
    ? live.find(
        (e) =>
          e.id === input.selectionId &&
          ['servicios', 'menus', 'paquetes'].includes(e.kind),
      )
    : undefined;
  if (input.selectionId && !selected)
    throw new Error(
      'La propuesta elegida ya no está disponible. Vuelve al paso 2.',
    );
  if (selected?.minimumGuests && input.people < selected.minimumGuests)
    throw new Error(
      `Esta propuesta requiere al menos ${selected.minimumGuests} personas.`,
    );
  const modality = input.modalityId
    ? live.find((e) => e.id === input.modalityId && e.kind === 'modalidades')
    : undefined;
  if (
    input.modalityId &&
    (!modality ||
      (selected?.modalityIds.length &&
        !selected.modalityIds.includes(input.modalityId)))
  )
    throw new Error('La modalidad no es compatible con la propuesta.');
  const addons = Array.from(new Set(input.addOnIds)).map((id) =>
    live.find((e) => e.id === id && e.kind === 'complementos'),
  );
  if (
    addons.some(
      (e) =>
        !e || (selected?.addOnIds.length && !selected.addOnIds.includes(e.id)),
    )
  )
    throw new Error('Revisa los complementos seleccionados.');
  const event = input.eventTypeId
    ? live.find((e) => e.id === input.eventTypeId && e.kind === 'tipos-evento')
    : undefined;
  if (input.eventTypeId && !event) throw new Error('Revisa el tipo de evento.');
  const now = Date.now();
  const key = await digest(`quote:${ip}:${Math.floor(now / 3600000)}`);
  await env.DB.prepare('DELETE FROM submission_limits WHERE expires<?')
    .bind(now)
    .run();
  const rate = await env.DB.prepare(
    'INSERT INTO submission_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count<20 RETURNING count',
  )
    .bind(key, now + 3600000)
    .first();
  if (!rate) throw new Error('RATE_LIMIT');
  const reference = `CG-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${input.requestId.slice(0, 8).toUpperCase()}`;
  const snapshot = {
    selection: selected?.title || 'Necesito orientación',
    modality: modality?.title || '',
    addOns: addons.map((e) => e!.title),
    eventType: event?.title || input.eventTypeOther,
    price: selected?.price || null,
    consentText: site.settings.copy.consent,
  };
  const stamp = new Date().toISOString();
  const result = await env.DB.prepare(
    'INSERT INTO quotes(id,reference,created_at,updated_at,status,notes,version,demo,input,snapshot,request_hash) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING',
  )
    .bind(
      input.requestId,
      reference,
      stamp,
      stamp,
      'new',
      '',
      1,
      site.settings.demo ? 1 : 0,
      JSON.stringify(input),
      JSON.stringify(snapshot),
      requestHash,
    )
    .run();
  if (!result.meta.changes) {
    const duplicate = await env.DB.prepare(
      'SELECT request_hash,reference,demo FROM quotes WHERE id=?',
    )
      .bind(input.requestId)
      .first<{ request_hash: string; reference: string; demo: number }>();
    if (duplicate?.request_hash !== requestHash)
      throw new Error('El envío ya existe con otros datos.');
    return { reference: duplicate.reference, demo: !!duplicate.demo };
  }
  return { reference, demo: site.settings.demo };
}
export async function listQuotes(page: number, status: string, q: string) {
  const pageSize = 20;
  const clauses = ['1=1'];
  const args: string[] = [];
  if (status) {
    clauses.push('status=?');
    args.push(status);
  }
  if (q) {
    clauses.push('(reference LIKE ? OR input LIKE ?)');
    args.push(`%${q}%`, `%${q}%`);
  }
  const where = clauses.join(' AND ');
  const total = await env.DB.prepare(
    `SELECT COUNT(*) AS total FROM quotes WHERE ${where}`,
  )
    .bind(...args)
    .first<{ total: number }>();
  const rows = await env.DB.prepare(
    `SELECT * FROM quotes WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
  )
    .bind(...args, pageSize, (page - 1) * pageSize)
    .all<QuoteRow>();
  return {
    items: rows.results.map(decodeQuote),
    total: total?.total || 0,
    page,
    pageSize,
  };
}
