'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { useAttribution } from './attribution-provider';
import { Photo } from './photo';
import { Quote, type QuoteSite } from './quote';
import { useQuoteCart } from './quote-cart-provider';
import type { ExplorerService } from '@/lib/public-services';

const groups = [
  { title: 'Comida y bebidas', ids: ['buffet-para-eventos', 'menu-criollo-eventos', 'desayuno-corporativo', 'bar-bartender'] },
  { title: 'Atención y alquiler', ids: ['mozos-evento', 'menaje-evento', 'sillas-evento'] },
  { title: 'Detalles para el evento', ids: ['arreglos-florales', 'recuerdos-evento', 'polos-estampados'] },
];

export function ServiceExplorer({
  entries,
  featuredIds,
  featuredReasons,
  title = 'Completa tu evento a tu manera.',
  intro = 'Puedes elegir un solo servicio o combinar varios. Te daremos el precio y la disponibilidad por WhatsApp.',
  currentId,
  anchorId,
  quoteSite,
  quoteHref,
  occasion = '',
}: {
  entries: ExplorerService[];
  featuredIds: string[];
  featuredReasons?: Record<string, string>;
  title?: string;
  intro?: string;
  currentId?: string;
  anchorId?: string;
  quoteSite?: QuoteSite;
  quoteHref?: string;
  occasion?: string;
}) {
  const headingId = useId();
  const quoteId = useId();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const { cart, restored, add, dispatch } = useQuoteCart();
  const { recordCta } = useAttribution();
  const visible = entries;
  const featured = [...(currentId ? [currentId] : []), ...featuredIds]
    .map((id) => visible.find((entry) => entry.id === id))
    .filter((entry): entry is ExplorerService => !!entry)
    .slice(0, 3);
  const suggestions = featured.length ? featured : visible.slice(0, 3);
  const suggestionIds = new Set(suggestions.map((entry) => entry.id));
  const remaining = visible.filter((entry) => !suggestionIds.has(entry.id));
  const principal = cart.items.find((item) => item.itemId === cart.primaryItemId);
  const recipient = entries.find((entry) => entry.id === principal?.entryId);

  const selectedItem = (id: string) =>
    cart.items.find((item) => item.entryId === id);

  const toggle = (entry: ExplorerService) => {
    const matching = cart.items.filter((item) => item.entryId === entry.id);
    if (matching.length) {
      matching.forEach((item) => dispatch({ type: 'remove', itemId: item.itemId }));
      return;
    }
    recordCta(entry.id, 'recommendation');
    add(entry.id, entry.quoteConfig.minimum);
  };

  const action = (entry: ExplorerService) => {
    const item = selectedItem(entry.id);
    const isPrimary = item?.itemId === cart.primaryItemId;
    return (
      <div className="service-explorer-actions">
        <button
          className="service-explorer-toggle"
          type="button"
          disabled={!restored}
          aria-pressed={!!item}
          onClick={() => toggle(entry)}
        >
          {item ? 'Añadido · quitar' : 'Añadir a mi evento'}
        </button>
        {item && !isPrimary && (
          <button
            className="service-explorer-primary"
            type="button"
            onClick={() => {
              dispatch({ type: 'setPrimary', itemId: item.itemId });
              recordCta(entry.id, 'recommendation');
            }}
          >
            Elegir como principal
          </button>
        )}
        {isPrimary && <span className="service-explorer-primary-label">Principal</span>}
      </div>
    );
  };

  return (
    <section className="service-explorer wrap" id={anchorId} aria-labelledby={headingId}>
      <div className="service-explorer-heading">
        <div>
          <p className="section-kicker">Una sola consulta, lo que tú necesitas</p>
          <h2 id={headingId}>{title}</h2>
        </div>
        <p>{intro}</p>
      </div>
      <div className="service-explorer-featured">
        {suggestions.map((entry) => (
          <article className="service-explorer-card" key={entry.id} data-selected={!!selectedItem(entry.id)}>
            <Photo asset={entry.image} sizes="(max-width: 760px) 24vw, 140px" />
            <div>
              <h3>{entry.title}</h3>
              {entry.id === currentId && <span className="service-explorer-current">Este servicio</span>}
              <p>{featuredReasons?.[entry.id] || entry.description}</p>
              <Link href={'/' + entry.kind + '/' + entry.slug}>Ver detalles</Link>
              {action(entry)}
            </div>
          </article>
        ))}
      </div>
      {remaining.length > 0 && (
        <details className="service-explorer-more">
          <summary>Ver los demás servicios ({remaining.length})</summary>
          <div className="service-explorer-groups">
            {groups.map((group) => {
              const items = remaining.filter((entry) => group.ids.includes(entry.id));
              return items.length ? (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {items.map((entry) => (
                      <li key={entry.id} data-selected={!!selectedItem(entry.id)}>
                        <div>
                          <strong>{entry.title}</strong>
                          <Link href={'/' + entry.kind + '/' + entry.slug}>Ver detalles</Link>
                        </div>
                        {action(entry)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })}
          </div>
        </details>
      )}
      <div className="service-explorer-summary" aria-live="polite">
        <p>
          <strong>{cart.items.length} {cart.items.length === 1 ? 'servicio elegido' : 'servicios elegidos'}</strong>
          {recipient
            ? ' · La consulta completa irá a ' + recipient.recipientLabel + ' (' + (recipient.whatsappDestination || '').replace(/^51/, '+51 ') + ').'
            : ' · Elige un servicio para empezar.'}
        </p>
        <p>Si añades extras de otro equipo, Gladys los coordinará contigo en la misma conversación.</p>
        {quoteHref ? (
          <a className="button" href={quoteHref}>Revisar y cotizar aquí</a>
        ) : (
          <button
            className="button"
            type="button"
            aria-expanded={quoteOpen}
            aria-controls={quoteId}
            onClick={() => {
              recordCta(principal?.entryId || null, 'navigation');
              setQuoteOpen((open) => !open);
            }}
          >
            {quoteOpen ? 'Ocultar cotización' : 'Cotizar aquí sin salir'}
          </button>
        )}
      </div>
      {!quoteHref && quoteSite && (
        <div className="service-explorer-quote" id={quoteId} hidden={!quoteOpen}>
          {quoteOpen && <Quote site={quoteSite} selection="" occasion={occasion} />}
        </div>
      )}
    </section>
  );
}
