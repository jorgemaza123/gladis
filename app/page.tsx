import { readSite } from '@/repositories/site';
import { metadataFor, businessData } from '@/lib/seo';
import { Shell, Sections, JsonLd } from '@/components/public';
export async function generateMetadata() {
  const site = await readSite();
  return metadataFor(
    site,
    site.settings.seo,
    '/',
    site.sections.find((s) => s.type === 'hero' && s.visible)?.imageId,
  );
}
export default async function Home() {
  const site = await readSite();
  return (
    <Shell site={site}>
      <JsonLd data={businessData(site)} />
      <Sections site={site} />
    </Shell>
  );
}
