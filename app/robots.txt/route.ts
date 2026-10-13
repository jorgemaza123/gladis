import { readSite } from '@/repositories/site';
export async function GET() {
  const { settings: s } = await readSite();
  const enabled = s.indexable && !s.demo && !s.seo.noindex && s.origin;
  return new Response(
    enabled
      ? `User-agent: Googlebot\nAllow: /\nDisallow: /admin\n\nUser-agent: Bingbot\nAllow: /\nDisallow: /admin\n\nUser-agent: OAI-SearchBot\nAllow: /\nDisallow: /admin\n\nUser-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${s.origin.replace(/\/$/, '')}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
