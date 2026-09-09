import { notFound } from 'next/navigation';
import { readSite } from '@/repositories/site';
import { metadataFor } from '@/lib/seo';
import { Shell } from '@/components/public';
import { Photo } from '@/components/photo';
type Props={params:Promise<{kind:string;slug:string}>};
async function resolve(params:Props['params']) {const {kind,slug}=await params;const site=await readSite();const entry=site.entries.find(e=>e.kind===kind&&e.slug===slug&&e.status==='published');if(!entry)notFound();return {site,entry};}
export async function generateMetadata({params}:Props){const {site,entry:e}=await resolve(params);return metadataFor(site,e.seo,`/${e.kind}/${e.slug}`,e.imageId);}
export default async function Detail({params}:Props){const {site,entry:e}=await resolve(params);return <Shell site={site}><section className="section wrap"><nav className="breadcrumbs" aria-label="Ruta de navegación"><a href="/">Inicio</a><span>/</span><a href={`/${e.kind}`}>{e.kind==='menus'?'Menús':e.kind}</a><span>/</span><span>{e.title}</span></nav><div className="detail-grid"><div><p className="eyebrow">{site.settings.tagline}</p><h1 className="page-title">{e.title}</h1><p className="lead">{e.description}</p><p className="prose">{e.body!==e.description?e.body:''}</p>{e.details.length>0&&<ul className="included">{e.details.map((d,i)=><li key={i}>{d}</li>)}</ul>}<a className="button" href={`/cotizar?seleccion=${encodeURIComponent(e.id)}`}>Consultar esta propuesta ↗</a></div><Photo asset={site.media.find(m=>m.id===e.imageId)} priority/></div></section></Shell>}
