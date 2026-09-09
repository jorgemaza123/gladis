import { readSite } from '@/repositories/site';
export async function GET() {
  const { settings: s } = await readSite();
  const enabled = s.indexable && !s.demo && !s.seo.noindex && s.origin;
  return new Response(
    enabled
      ? `User-agent: *\nAllow: /\nAllow: /api/media/\nDisallow: /admin\nDisallow: /preview/\nDisallow: /api/\nSitemap: ${s.origin.replace(/\/$/, '')}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
