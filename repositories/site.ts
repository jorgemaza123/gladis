import { env } from 'cloudflare:workers';
import { demoContent } from '@/data/demo';
import type { SiteContent } from '@/models/content';
import { siteSchema } from '@/lib/validation';

export async function readSite(): Promise<SiteContent> {
  const row = await env.DB.prepare('SELECT content, version FROM documents WHERE id = ?').bind('site').first<{content:string;version:number}>();
  return row ? { ...JSON.parse(row.content), version: row.version } : structuredClone(demoContent);
}
export async function saveSite(value: unknown): Promise<SiteContent> {
  const content = siteSchema.parse(value);
  const next = { ...content, version: content.version + 1 };
  const result = await env.DB.prepare(`INSERT INTO documents (id, content, version) VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET content=excluded.content, version=excluded.version WHERE documents.version = ?`)
    .bind('site', JSON.stringify(next), next.version, content.version).run();
  if (!result.meta.changes) throw new Error('CONFLICT');
  return next;
}
