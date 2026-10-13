import { readSite } from '@/repositories/site';
import { Shell } from '@/components/public';
import { SeoHub } from '@/components/seo-hub';
import { seoHubPages } from '@/data/seo-hubs';
import { metadataFor } from '@/lib/seo';

const config = seoHubPages.fotoVideo;
export async function generateMetadata() {
  const site = await readSite();
  return metadataFor(site, config.seo, config.path);
}
export default async function FotoVideoPage() {
  const site = await readSite();
  return <Shell site={site}><SeoHub site={site} config={config} /></Shell>;
}
