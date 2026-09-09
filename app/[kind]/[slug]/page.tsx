import { notFound, permanentRedirect } from 'next/navigation';
import { readSite, resolveRedirect } from '@/repositories/site';
import { metadataFor, breadcrumbsData } from '@/lib/seo';
import { Shell, EntryDetail, publicEntries, JsonLd } from '@/components/public';
type Props = { params: Promise<{ kind: string; slug: string }> };
async function resolve(params: Props['params']) {
  const { kind, slug } = await params;
  const site = await readSite();
  const entry = publicEntries(site).find(
    (e) => e.kind === kind && e.slug === slug,
  );
  if (!entry) {
    const target = await resolveRedirect(`/${kind}/${slug}`);
    if (
      target &&
      publicEntries(site).some((e) => `/${e.kind}/${e.slug}` === target)
    )
      permanentRedirect(target);
    notFound();
  }
  return { site, entry };
}
export async function generateMetadata({ params }: Props) {
  const { site, entry: e } = await resolve(params);
  return metadataFor(
    site,
    {
      ...e.seo,
      title: e.seo.title || `${e.title} | ${site.settings.name}`,
      description: e.seo.description || e.description,
    },
    `/${e.kind}/${e.slug}`,
    e.imageId,
  );
}
export default async function Detail({ params }: Props) {
  const { site, entry: e } = await resolve(params);
  return (
    <Shell site={site}>
      <JsonLd
        data={breadcrumbsData(site, [
          { name: 'Inicio', path: '/' },
          { name: site.settings.catalogs[e.kind].title, path: `/${e.kind}` },
          { name: e.title, path: `/${e.kind}/${e.slug}` },
        ])}
      />
      <EntryDetail site={site} entry={e} />
    </Shell>
  );
}
