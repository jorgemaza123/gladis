'use client';

import Link from 'next/link';
import { useEffect, useId, useState, type ReactNode } from 'react';
import { useAttribution } from './attribution-provider';
import { Photo } from './photo';
import { Quote, type QuoteSite } from './quote';
import { useQuoteCart } from './quote-cart-provider';
import type { ExplorerService } from '@/lib/public-services';
import { serviceGroup, serviceGroupOrder } from '@/lib/service-groups';
import { serviceFamilyMeta as homeFamilyMeta, serviceFamilyAnchor as familyAnchor } from '@/lib/service-navigation';

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
  homeProgressive = false,
  headingDecoration,
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
  homeProgressive?: boolean;
  headingDecoration?: ReactNode;
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

  useEffect(() => {
    if (!homeProgressive) return;

    const openFamilyFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id.startsWith('familia-')) return;
      const family = document.getElementById(id);
      if (family instanceof HTMLDetailsElement) family.open = true;
    };

    openFamilyFromHash();
    window.addEventListener('hashchange', openFamilyFromHash);
    return () => window.removeEventListener('hashchange', openFamilyFromHash);
  }, [homeProgressive]);

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
          aria-label={item ? `Quitar ${entry.title} de Mi evento` : `Añadir ${entry.title} a Mi evento`}
          onClick={() => toggle(entry)}
        >
          {homeProgressive ? (item ? 'Añadido ✓' : 'Añadir +') : (item ? 'Añadido · quitar' : 'Añadir a mi evento')}
        </button>
        {item && !isPrimary && (
          <button
            className="service-explorer-primary"
            type="button"
            aria-label={`Elegir ${entry.title} como servicio principal`}
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
    <section
      className={`service-explorer wrap${homeProgressive ? ' service-explorer--home' : ''}`}
      id={anchorId}
      aria-labelledby={headingId}
    >
      <div className="service-explorer-heading">
        {headingDecoration}
        <div>
          <p className="section-kicker">{homeProgressive ? 'También podemos ayudarte con' : 'Una sola consulta, lo que tú necesitas'}</p>
          <h2 id={headingId}>{title}</h2>
        </div>
        <p>{intro}</p>
      </div>
      {homeProgressive && (
        <div className="service-explorer-section-heading">
          <h3>Esenciales para empezar</h3>
          <p>Una base práctica para servir, montar y atender tu evento.</p>
        </div>
      )}
      <div className="service-explorer-featured">
        {suggestions.map((entry) => (
          <article className="service-explorer-card" key={entry.id} data-selected={!!selectedItem(entry.id)}>
            <Photo asset={entry.image} sizes="(max-width: 760px) 24vw, 140px" />
            <div>
              <h3>{entry.title}</h3>
              {entry.id === currentId && <span className="service-explorer-current">Este servicio</span>}
              <p>{featuredReasons?.[entry.id] || entry.description}</p>
              <div className="service-explorer-card-controls">
                <Link
                  href={'/' + entry.kind + '/' + entry.slug}
                  aria-label={`Ver detalles de ${entry.title}`}
                >
                  Ver detalles
                </Link>
                {action(entry)}
              </div>
            </div>
          </article>
        ))}
      </div>
      {homeProgressive ? (
        <div className="service-family-directory" aria-labelledby={`${headingId}-directory`}>
          <div className="service-family-directory-heading">
            <div>
              <p className="section-kicker">Directorio por familias</p>
              <h3 id={`${headingId}-directory`}>Completa lo que falta</h3>
            </div>
            <p>Abre solo las familias que necesites. Los precios dependen del servicio y sus requerimientos.</p>
          </div>
          <div className="service-family-directory-grid">
            {serviceGroupOrder.map((group) => {
              const items = visible.filter((entry) => serviceGroup(entry) === group);
              const meta = homeFamilyMeta[group];
              if (!items.length || !meta) return null;
              const familyId = familyAnchor(group);
              return (
                <details
                  className="service-family-detail"
                  id={familyId}
                  key={group}
                  onToggle={(event) => {
                    const family = event.currentTarget;
                    const currentHash = window.location.hash.slice(1);
                    if (family.open) {
                      window.history.replaceState(window.history.state, '', `#${familyId}`);
                    } else if (currentHash === familyId) {
                      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
                    }
                  }}
                >
                  <summary>
                    <span className="service-family-detail-copy">
                      <h3>{meta.label}</h3>
                      <span>{meta.description}</span>
                    </span>
                    <span className="service-family-detail-count">
                      {items.length} {items.length === 1 ? 'servicio' : 'servicios'}
                    </span>
                    <span className="service-family-detail-arrow" aria-hidden="true">↓</span>
                  </summary>
                  <div className="service-family-detail-content">
                    <ul>
                      {items.map((entry) => (
                        <li key={entry.id} data-selected={!!selectedItem(entry.id)}>
                          <div className="service-family-service-copy">
                            <strong>{entry.title}</strong>
                            <Link
                              href={'/' + entry.kind + '/' + entry.slug}
                              aria-label={`Ver detalles de ${entry.title}`}
                            >
                              Ver detalles
                            </Link>
                          </div>
                          {action(entry)}
                        </li>
                      ))}
                    </ul>
                    <Link className="service-family-all-link" href={meta.href}>
                      Ver todos los servicios de {meta.label.toLowerCase()} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      ) : remaining.length > 0 ? (
        <details className="service-explorer-more">
          <summary>Ver los demás servicios ({remaining.length})</summary>
          <div className="service-explorer-groups">
            {serviceGroupOrder.map((group) => {
              const items = remaining.filter((entry) => serviceGroup(entry) === group);
              return items.length ? (
                <div key={group}>
                  <h3>{group}</h3>
                  <ul>
                    {items.map((entry) => (
                      <li key={entry.id} data-selected={!!selectedItem(entry.id)}>
                        <div>
                          <strong>{entry.title}</strong>
                          <Link
                            href={'/' + entry.kind + '/' + entry.slug}
                            aria-label={`Ver detalles de ${entry.title}`}
                          >
                            Ver detalles
                          </Link>
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
      ) : null}
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
