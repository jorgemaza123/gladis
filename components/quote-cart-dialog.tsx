'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useQuoteCart } from '@/components/quote-cart-provider';
import { useAttribution } from '@/components/attribution-provider';
import type { PublicBusinessContact } from '@/lib/business-contacts';
import type { QuoteConfig } from '@/models/content';
import { ServiceRecommendations, type RecommendationEntry } from '@/components/service-recommendations';

export type QuoteCartDialogEntry = {
  id: string;
  title: string;
  quoteConfig: QuoteConfig;
  recipient: PublicBusinessContact;
};

export function QuoteCartDialog({
  entries,
  recommendationEntries,
}: {
  entries: QuoteCartDialogEntry[];
  recommendationEntries: RecommendationEntry[];
}) {
  const { cart, dispatch, restored, restoreNotice } = useQuoteCart();
  const { recordCta } = useAttribution();
  const details = new Map(entries.map((entry) => [entry.id, entry]));
  const primary = cart.items.find((item) => item.itemId === cart.primaryItemId) || null;
  const recipient = primary ? details.get(primary.entryId)?.recipient : null;
  const canContinue = !!primary;

  return (
    <Dialog.Root modal>
      <Dialog.Trigger className="button small quote-cart-trigger" type="button">
        Revisar bolsa{cart.items.length ? ` (${cart.items.length})` : ''}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="quote-cart-backdrop" />
        <Dialog.Viewport className="quote-cart-viewport">
          <Dialog.Popup className="quote-cart-dialog" initialFocus>
            <div className="quote-cart-heading">
              <div>
                <p className="eyebrow">Cotización</p>
                <Dialog.Title>Revisa tu bolsa</Dialog.Title>
              </div>
              <Dialog.Close className="quote-cart-close" aria-label="Cerrar revisión">
                ×
              </Dialog.Close>
            </div>
            {!restored && <p className="field-help">Preparando la bolsa…</p>}
            {restoreNotice && <output className="notice">{restoreNotice}</output>}
            {!cart.items.length ? (
              <p className="quote-cart-empty">
                Aún no hay ofertas en tu bolsa. Puedes seguir explorando los servicios.
              </p>
            ) : (
              <div className="quote-cart-lines">
                {cart.items.map((item) => {
                  const entry = details.get(item.entryId);
                  if (!entry) return null;
                  const isPrimary = item.itemId === cart.primaryItemId;
                  return (
                    <article className="quote-cart-line" data-primary={isPrimary || undefined} key={item.itemId}>
                      <div className="quote-cart-line-title">
                        <label className="check">
                          <input
                            checked={isPrimary}
                            name="quote-cart-primary"
                            onChange={() => dispatch({ type: 'setPrimary', itemId: item.itemId })}
                            type="radio"
                          />
                          <span>{isPrimary ? 'Oferta principal' : 'Marcar como principal'}</span>
                        </label>
                        <h3>{entry.title}</h3>
                      </div>
                      <label className="field quote-cart-quantity">
                        Cantidad
                        <input
                          max={entry.quoteConfig.maximum}
                          min={entry.quoteConfig.minimum}
                          onChange={(event) =>
                            dispatch({
                              type: 'update',
                              itemId: item.itemId,
                              quantity: Number(event.target.value),
                              optionValues: item.optionValues,
                            })
                          }
                          step={entry.quoteConfig.step}
                          type="number"
                          value={item.quantity}
                        />
                      </label>
                      {entry.quoteConfig.options.map((option) => (
                        <label className="field quote-cart-option" key={option.id}>
                          {option.label}{option.required ? ' (requerido)' : ' (opcional)'}
                          <select
                            required={option.required}
                            onChange={(event) =>
                              dispatch({
                                type: 'update',
                                itemId: item.itemId,
                                quantity: item.quantity,
                                optionValues: { ...item.optionValues, [option.id]: event.target.value },
                              })
                            }
                            value={item.optionValues[option.id] || ''}
                          >
                            <option value="">Seleccionar</option>
                            {option.values.map((value) => (
                              <option key={value.id} value={value.id}>{value.label}</option>
                            ))}
                          </select>
                        </label>
                      ))}
                      <button
                        className="text-link quote-cart-remove"
                        onClick={() => dispatch({ type: 'remove', itemId: item.itemId })}
                        type="button"
                      >
                        Quitar
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
            {cart.items.length > 0 && !primary && (
              <p className="notice error">Elige una oferta principal antes de continuar.</p>
            )}
            {recipient && (
              <p className="quote-cart-recipient">
                Responsable: <strong>{recipient.label || 'Por confirmar'}</strong>
                {!recipient.available && ' · Este responsable no tiene WhatsApp disponible.'}
              </p>
            )}
            <div className="cart-recommendations">
              <ServiceRecommendations entries={recommendationEntries} heading="También podrías necesitar" />
            </div>
            <div className="quote-cart-actions">
              <a
                aria-disabled={!canContinue}
                className="button"
                href={canContinue ? '/cotizar' : undefined}
                onClick={(event) => {
                  if (!canContinue) event.preventDefault();
                  else recordCta(primary?.entryId || null, 'cart');
                }}
              >
                Continuar a datos de contacto
              </a>
              <Dialog.Close className="text-link" type="button">Seguir explorando</Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
