import { readSite } from '@/repositories/site';
import { Shell, publicEntries } from '@/components/public';
import { Quote, type QuoteSite } from '@/components/quote';
import { metadataFor } from '@/lib/seo';
export async function generateMetadata() {
  const site = await readSite();
  return metadataFor(
    site,
    {
      title: site.settings.copy.quoteTitle,
      description: site.settings.copy.quoteDescription,
      noindex: true,
    },
    '/cotizar',
  );
}
export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ seleccion?: string }>;
}) {
  const site = await readSite();
  const { seleccion } = await searchParams;
  const entries = publicEntries(site).filter((entry) =>
    [
      'servicios',
      'menus',
      'paquetes',
      'tipos-evento',
      'modalidades',
      'complementos',
      'cobertura',
    ].includes(entry.kind),
  );
  const copy = site.settings.copy;
  const quoteSite: QuoteSite = {
    settings: {
      whatsapp: site.settings.whatsapp,
      whatsappMessage: site.settings.whatsappMessage,
      copy: {
        consent: copy.consent,
        coverageTitle: copy.coverageTitle,
        privacyTitle: copy.privacyTitle,
        quoteAsideDescription: copy.quoteAsideDescription,
        quoteAsideTitle: copy.quoteAsideTitle,
        successDescription: copy.successDescription,
        successTitle: copy.successTitle,
      },
    },
    entries: entries.map(
      ({ id, kind, title, minimumGuests, modalityIds, addOnIds }) => ({
        id,
        kind,
        title,
        minimumGuests,
        modalityIds,
        addOnIds,
      }),
    ),
  };
  const selection = entries.some(
    (e) =>
      e.id === seleccion && ['servicios', 'menus', 'paquetes'].includes(e.kind),
  )
    ? seleccion!
    : '';
  return (
    <Shell site={site}>
      <section className="section wrap quote-page">
        <h1 className="page-title">{site.settings.copy.quoteTitle}</h1>
        <p className="lead">{site.settings.copy.quoteDescription}</p>
        <Quote site={quoteSite} selection={selection} />
      </section>
    </Shell>
  );
}
