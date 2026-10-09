import './globals.css';
import './design.css';
import './motion.css';
import { readSite } from '@/repositories/site';
import { QuoteCartProvider } from '@/components/quote-cart-provider';
import { AttributionProvider } from '@/components/attribution-provider';
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await readSite();
  const requestableEntries = site.entries.filter(
    (e) =>
      e.status === 'published' &&
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
            {children}
          </QuoteCartProvider>
        </AttributionProvider>
      </body>
    </html>
  );
}
