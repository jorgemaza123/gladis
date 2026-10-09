import type { SiteContent, QuoteConfig, MediaAsset, ContentKind } from '@/models/content';
import type { QuoteSite } from '@/components/quote';
import { resolveBusinessContact, resolveWhatsAppDestination } from '@/lib/business-contacts';

export type ExplorerService = {
  id: string;
  kind: ContentKind;
  slug: string;
  title: string;
  description: string;
  quoteConfig: QuoteConfig;
  image?: MediaAsset;
  recipientLabel: string | null;
  whatsappDestination: string | null;
};

const requestableEntries = (site: SiteContent) =>
  site.entries.filter(
    (entry) =>
      entry.status === 'published' &&
      entry.requestable &&
      entry.ownerId !== null &&
      entry.quoteConfig !== null,
  );

export function explorerServices(site: SiteContent): ExplorerService[] {
  return requestableEntries(site)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      quoteConfig: entry.quoteConfig!,
      image: site.media.find((media) => media.id === entry.imageId),
      recipientLabel: resolveBusinessContact(entry.ownerId).label,
      whatsappDestination: resolveWhatsAppDestination(entry.ownerId),
    }));
}

export function quoteSiteFor(site: SiteContent): QuoteSite {
  const copy = site.settings.copy;
  return {
    settings: {
      whatsappMessage: site.settings.whatsappMessage,
      copy: {
        coverageTitle: copy.coverageTitle,
        privacyTitle: copy.privacyTitle,
        quoteAsideDescription: copy.quoteAsideDescription,
        quoteAsideTitle: copy.quoteAsideTitle,
        successDescription: copy.successDescription,
        successTitle: copy.successTitle,
      },
    },
    entries: requestableEntries(site).map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      minimumGuests: entry.minimumGuests,
      modalityIds: entry.modalityIds,
      addOnIds: entry.addOnIds,
      coverageIds: entry.coverageIds,
      requestable: entry.requestable,
      quoteConfig: entry.quoteConfig,
      recipient: resolveBusinessContact(entry.ownerId),
      whatsappDestination: resolveWhatsAppDestination(entry.ownerId),
    })),
  };
}
