import { readSite } from '@/repositories/site';
export async function GET(){const {settings:s}=await readSite();const enabled=s.indexable&&!s.demo&&s.origin;return new Response(enabled?`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${s.origin.replace(/\/$/,'')}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}});}
