import { readSite } from '@/repositories/site';
import { Shell } from '@/components/public';
import { Quote } from '@/components/quote';
export const metadata={title:'Cotiza tu evento',robots:{index:false,follow:true}};
export default async function QuotePage({searchParams}:{searchParams:Promise<{seleccion?:string}>}){const site=await readSite();const {seleccion}=await searchParams;const selection=site.entries.some(e=>e.id===seleccion&&e.status==='published')?seleccion!:'';return <Shell site={site}><section className="section wrap"><p className="eyebrow">Conversemos</p><h1 className="page-title">Organicemos tu próximo evento.</h1><Quote site={{...site,entries:site.entries.filter(e=>e.status==='published')}} selection={selection}/></section></Shell>}
