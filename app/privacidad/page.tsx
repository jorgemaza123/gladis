import { readSite } from '@/repositories/site';
import { Shell } from '@/components/public';
import { metadataFor } from '@/lib/seo';
export async function generateMetadata() {
  const site = await readSite();
  return metadataFor(
    site,
    { title: site.settings.copy.privacyTitle, description: '', noindex: true },
    '/privacidad',
  );
}
export default async function Privacy() {
  const site = await readSite();
  return (
    <Shell site={site}>
      <section className="section wrap privacy-copy">
        <h1 className="page-title">{site.settings.copy.privacyTitle}</h1>
        <p className="prose">{site.settings.copy.privacyBody}</p>
        {site.settings.email && (
          <a className="text-link" href={`mailto:${site.settings.email}`}>
            {site.settings.email}
          </a>
        )}
      </section>
    </Shell>
  );
}
