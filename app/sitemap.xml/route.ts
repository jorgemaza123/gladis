import { readSite } from '@/repositories/site';
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export async function GET(){const site=await readSite();const s=site.settings;const paths=s.origin&&s.indexable&&!s.demo?[...(s.seo.noindex?[]:['/']),...Array.from(new Set(site.entries.filter(e=>e.status==='published'&&!e.seo.noindex).map(e=>`/${e.kind}`))),...site.entries.filter(e=>e.status==='published'&&!e.seo.noindex).map(e=>`/${e.kind}/${e.slug}`)]:[];return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p=>`<url><loc>${escape(s.origin.replace(/\/$/,'')+p)}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});}

