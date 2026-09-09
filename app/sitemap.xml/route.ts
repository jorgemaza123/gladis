import { readSite } from '@/repositories/site';
import { canonicalFor, absoluteUrl } from '@/lib/seo';
import { publicEntries } from '@/components/public';
const escape = (s: string) =>
  s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
export async function GET() {
  const site = await readSite(),
    s = site.settings;
  const urls: { url: string; updated?: string }[] = [];
  if (s.origin && s.indexable && !s.demo && !s.seo.noindex) {
    const add = (path: string, fields: typeof s.seo, updated?: string) => {
      const url = absoluteUrl(site, path);
      if (url && !fields.noindex && canonicalFor(site, fields, path) === url)
        urls.push({ url, updated });
    };
    add('/', s.seo);
    const entries = publicEntries(site).filter((e) => !e.seo.noindex);
    for (const kind of new Set(entries.map((e) => e.kind)))
      add(`/${kind}`, s.catalogs[kind].seo);
    for (const e of entries) add(`/${e.kind}/${e.slug}`, e.seo, e.updatedAt);
  }
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(({ url, updated }) => `<url><loc>${escape(url)}</loc>${updated && !Number.isNaN(Date.parse(updated)) ? `<lastmod>${new Date(updated).toISOString()}</lastmod>` : ''}</url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
