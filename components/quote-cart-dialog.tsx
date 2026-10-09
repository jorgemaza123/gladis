'use client';
import Link from 'next/link';
import { Dialog } from '@base-ui/react/dialog';
import { useQuoteCart } from './quote-cart-provider';
import { useAttribution } from './attribution-provider';
import { EventSelection } from './event-selection';
import { selectionErrors } from '@/lib/event-selection';
import type { PublicBusinessContact } from '@/lib/business-contacts';
import type { QuoteConfig } from '@/models/content';
import type { RecommendationEntry } from './service-recommendations';
export type QuoteCartDialogEntry = {
  id: string;
  title: string;
  quoteConfig: QuoteConfig;
  recipient: PublicBusinessContact;
  whatsappDestination: string | null;
};
export function QuoteCartDialog({
  entries,
  motionEnabled,
}: {
  entries: QuoteCartDialogEntry[];
  recommendationEntries: RecommendationEntry[];
  motionEnabled: boolean;
}) {
  const { cart, restored, restoreNotice } = useQuoteCart();
  const { recordCta } = useAttribution();
  const primary = cart.items.find((item) => item.itemId === cart.primaryItemId);
  const primaryEntry = entries.find((entry) => entry.id === primary?.entryId);
  const recipient = primaryEntry?.recipient;
  const errors = selectionErrors(cart, entries);
  return (
    <Dialog.Root modal>
      <Dialog.Trigger className="button small quote-cart-trigger" type="button" aria-label={`Mi evento: ${cart.items.length} ${cart.items.length === 1 ? 'servicio' : 'servicios'}`}>
        Mi evento <span className="cart-count">{cart.items.length}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="quote-cart-backdrop" />
        <Dialog.Viewport className="quote-cart-viewport">
          <Dialog.Popup
            className="quote-cart-dialog"
            data-motion={motionEnabled ? 'on' : 'off'}
            initialFocus
          >
            <div className="quote-cart-heading">
              <Dialog.Title>Tu evento, a tu manera</Dialog.Title>
              <Dialog.Close
                className="quote-cart-close"
                aria-label="Cerrar revisión"
              >
                ×
              </Dialog.Close>
            </div>
            <Dialog.Description>
              {cart.items.length
                ? 'Aquí están los servicios que elegiste. El equipo del principal recibirá la consulta completa.'
                : 'Elige los servicios que te interesan y consúltalos en una sola conversación.'}
            </Dialog.Description>
            {!restored && <p>Preparando tu selección…</p>}
            {restoreNotice && <p className="notice">{restoreNotice}</p>}
            {!cart.items.length ? (
              <div className="quote-cart-empty">
                <p>¿Empezamos? Añade los servicios que te interesan.</p>
                <Link className="text-link" href="/tipos-evento">Ver ocasiones</Link>
                <Link className="text-link" href="/servicios">Ver servicios</Link>
              </div>
            ) : (
              <EventSelection entries={entries} prefix="dialog" />
            )}
            {!!cart.items.length && !!errors.length && (
              <div className="notice" aria-live="polite">
                {errors.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}
            {recipient && (
              <p className="quote-cart-recipient">
                Toda la consulta irá a: <strong>{recipient.label}</strong>
                {primaryEntry?.whatsappDestination && (
                  <> · +51 {primaryEntry.whatsappDestination.slice(2)}</>
                )}
              </p>
            )}
            <div className="quote-cart-actions">
              <Link
                className="button"
                href="/cotizar"
                onClick={() => recordCta(primary?.entryId || null, 'cart')}
              >
                {errors.length
                  ? 'Completar mi selección'
                  : 'Continuar con mi evento'}
              </Link>
              <Dialog.Close className="text-link" type="button">
                Seguir viendo servicios
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
