import './globals.css';
import './design.css';
import './motion.css';
import './service-search.css';
import './site-header.css';
import './home-arrival.css';
import { readSite } from '@/repositories/site';
import { QuoteCartProvider } from '@/components/quote-cart-provider';
import { AttributionProvider } from '@/components/attribution-provider';
import { isPublicAvailability } from '@/models/content';
import { ServiceSearchProvider } from '@/components/service-search';
import { serviceGroup } from '@/lib/service-groups';
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await readSite();
  const requestableEntries = site.entries.filter(
    (e) =>
      e.status === 'published' &&
      isPublicAvailability(e.availability) &&
      e.requestable &&
      e.ownerId !== null &&
      e.quoteConfig !== null,
  );
  const entryIds = requestableEntries.map((e) => e.id);
  const personEntryIds = requestableEntries
    .filter((e) => e.quoteConfig?.quantityUnit === 'person')
    .map((e) => e.id);
  return (
    <html lang="es-PE">
      <body>
        <AttributionProvider>
          <QuoteCartProvider entryIds={entryIds} personEntryIds={personEntryIds}>
            <ServiceSearchProvider entries={requestableEntries.map((entry) => ({
              id: entry.id,
              title: entry.title,
              href: `/${entry.kind}/${entry.slug}`,
              family: serviceGroup(entry),
            }))}>
              {children}
            </ServiceSearchProvider>
          </QuoteCartProvider>
        </AttributionProvider>
      </body>
    </html>
  );
}
