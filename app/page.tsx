import { readSite } from '@/repositories/site';
import { metadataFor } from '@/lib/seo';
import { Shell, Sections } from '@/components/public';
export async function generateMetadata(){const site=await readSite();return metadataFor(site,site.settings.seo,'/',site.sections.find(s=>s.type==='hero')?.imageId);}
export default async function Home(){const site=await readSite();return <Shell site={site}><Sections site={site}/></Shell>}
