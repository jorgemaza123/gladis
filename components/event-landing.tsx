'use client';

import Link from 'next/link';
import type { ContentEntry, MediaAsset } from '@/models/content';
import type { QuoteSite } from './quote';
import { Quote } from './quote';
import { Photo } from './photo';
import { useQuoteCart } from './quote-cart-provider';
import { useAttribution } from './attribution-provider';

export type EventServiceCard = Pick<
  ContentEntry,
  'id' | 'title' | 'description' | 'quoteConfig'
> & { image?: MediaAsset };

type EventLandingEntry = Pick<
  ContentEntry,
  | 'id'
  | 'title'
  | 'description'
  | 'body'
  | 'details'
  | 'faqItems'
  | 'imageId'
> & { image?: MediaAsset };

export function EventLanding({
  event,
  services,
  quoteSite,
  otherOccasions,
}: {
  event: EventLandingEntry;
  services: EventServiceCard[];
  quoteSite: QuoteSite;
  otherOccasions: { title: string; href: string }[];
}) {
  const { cart, add, dispatch } = useQuoteCart();
  const { recordCta } = useAttribution();
  const selectedIds = new Set(cart.items.map((item) => item.entryId));
  const selectedCount = services.filter((service) => selectedIds.has(service.id)).length;

  const toggle = (service: EventServiceCard) => {
    const current = cart.items.find((item) => item.entryId === service.id);
    if (current) {
      dispatch({ type: 'remove', itemId: current.itemId });
      return;
    }
    recordCta(service.id, 'recommendation');
    add(service.id, service.quoteConfig?.minimum || 1);
  };

  return (
    <>
      <section className="event-hero wrap" aria-labelledby="event-title">
        <div className="event-hero-copy">
          <nav className="breadcrumbs" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/tipos-evento">Ideas para tu evento</Link>
          </nav>
          <p className="section-kicker">Gladys · Lima Metropolitana</p>
          <h1 id="event-title">{event.title}</h1>
          <p className="lead">{event.description}</p>
          <p>{event.body}</p>
          <div className="actions">
            <a className="button" href="#armar-evento">
              Armar mi evento <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#cotizar-evento">
              Ir a la cotización
            </a>
          </div>
          <p className="event-coverage">Atendemos todo Lima Metropolitana · Precios a consulta</p>
        </div>
        <figure className="event-hero-photo">
          <Photo asset={event.image} priority sizes="(max-width: 960px) 100vw, 52vw" />
          <figcaption>Una propuesta que ajustamos contigo.</figcaption>
        </figure>
      </section>

      <section className="event-promise wrap" aria-label="Cómo te ayudamos">
        {event.details.map((detail, index) => (
          <article key={detail}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="event-builder" id="armar-evento" aria-labelledby="builder-title">
        <div className="wrap event-builder-heading">
          <div>
            <p className="section-kicker">Todo en esta página</p>
            <h2 id="builder-title">¿Qué necesitas para tu evento?</h2>
          </div>
          <p>
            Añade solamente lo que te sirva. Podrás indicar cantidades y detalles
            antes de preparar el mensaje de WhatsApp.
          </p>
        </div>
        <div className="wrap event-service-grid">
          {services.map((service, index) => {
            const selected = selectedIds.has(service.id);
            return (
              <article className="event-service-card" data-selected={selected} key={service.id}>
                <div className="event-service-photo">
                  <Photo asset={service.image} sizes="(max-width: 760px) 46vw, 280px" />
                  {index < 3 && <span>Suele elegirse</span>}
                </div>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <small>Precio a consulta por WhatsApp</small>
                  <button
                    className={selected ? 'event-service-remove' : 'event-service-add'}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggle(service)}
                  >
                    {selected ? 'Añadido ✓' : 'Añadir a mi evento +'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="event-inline-quote wrap" id="cotizar-evento" aria-labelledby="quote-event-title">
        <div className="event-inline-heading">
          <p className="section-kicker">Tu consulta, lista para conversar</p>
          <h2 id="quote-event-title">Revisa y cotiza sin salir de aquí.</h2>
          <p>
            Completa lo esencial. La web preparará el mensaje y tú decides si lo
            envías por WhatsApp.
          </p>
        </div>
        <Quote site={quoteSite} selection="" occasion={event.title} />
      </section>

      {event.faqItems.length > 0 && (
        <section className="event-faq wrap" aria-labelledby="event-faq-title">
          <div>
            <p className="section-kicker">Antes de cotizar</p>
            <h2 id="event-faq-title">Lo que quizá quieras saber</h2>
          </div>
          <div>
            {event.faqItems.map((item) => (
              <details key={item.id}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="other-occasions wrap" aria-labelledby="other-events-title">
        <p className="section-kicker">También podemos ayudarte con</p>
        <h2 id="other-events-title">Otras formas de reunir a los tuyos.</h2>
        <div>
          {otherOccasions.map((occasion) => (
            <Link href={occasion.href} key={occasion.href}>{occasion.title}<span>↗</span></Link>
          ))}
        </div>
      </section>

      {selectedCount > 0 && (
        <a className="event-selection-dock" href="#cotizar-evento">
          <span><strong>{selectedCount}</strong> {selectedCount === 1 ? 'servicio elegido' : 'servicios elegidos'}</span>
          <b>Revisar y cotizar <span aria-hidden="true">↑</span></b>
        </a>
      )}
    </>
  );
}
