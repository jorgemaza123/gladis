import { demoContent } from '@/data/demo';
import type { ContentEntry, SiteContent } from '@/models/content';

// The public site is intentionally static. Content changes are made in source
// files and published with a normal deployment; no database is read at runtime.
export async function readSite(): Promise<SiteContent> {
  return structuredClone(demoContent);
}

export async function resolveRedirect(_path: string) {
  return null;
}

export async function listEntries(
  options: { kind?: string; status?: string; page?: number; pageSize?: number } = {},
) {
  const site = await readSite();
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize || 24));
  const entries = site.entries.filter(
    (entry) =>
      (!options.kind || entry.kind === options.kind) &&
      (!options.status || entry.status === options.status),
  );
  return {
    items: entries.slice((page - 1) * pageSize, page * pageSize) as ContentEntry[],
    total: entries.length,
    page,
    pageSize,
  };
}
