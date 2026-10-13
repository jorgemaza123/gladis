import { readSite } from '@/repositories/site';
import { Shell } from '@/components/public';
import { ServicesHub } from '@/components/services-hub';
import { metadataFor } from '@/lib/seo';

export async function generateMetadata() {
  const site = await readSite();
  return metadataFor(site, site.settings.catalogs.servicios.seo, '/servicios');
}

export default async function ServicesPage() {
  const site = await readSite();
  return (
    <Shell site={site}>
      <ServicesHub site={site} />
    </Shell>
  );
}
