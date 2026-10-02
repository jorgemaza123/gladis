import './globals.css';
import './design.css';
import { readSite } from '@/repositories/site';
import { QuoteCartProvider } from '@/components/quote-cart-provider';
import { AttributionProvider } from '@/components/attribution-provider';
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await readSite();
  const entryIds = site.entries
    .filter(
      (e) =>
        e.status === 'published' &&
        e.requestable &&
        e.ownerId !== null &&
        e.quoteConfig !== null,
    )
    .map((e) => e.id);
  return (
    <html lang="es-PE">
      <body>
        <AttributionProvider>
          <QuoteCartProvider entryIds={entryIds}>{children}</QuoteCartProvider>
        </AttributionProvider>
      </body>
    </html>
  );
}
