import { notFound } from 'next/navigation';
import { readSite } from '@/repositories/site';
import { Shell } from '@/components/public';
import { GuidePage } from '@/components/guide-page';
import { guides } from '@/data/guides';
import { metadataFor } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();
  const site = await readSite();
  return metadataFor(site, guide.seo, `/guias/${guide.slug}`);
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();
  const site = await readSite();
  return (
    <Shell site={site}>
      <GuidePage site={site} guide={guide} />
    </Shell>
  );
}
