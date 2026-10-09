'use client';

import Link from 'next/link';
import type { ContentEntry, MediaAsset } from '@/models/content';
import type { ExplorerService } from '@/lib/public-services';
import type { QuoteSite } from './quote';
import { Quote } from './quote';
import { Photo } from './photo';
import { ServiceExplorer } from './service-explorer';
import { useQuoteCart } from './quote-cart-provider';

type EventLandingEntry = Pick<
  ContentEntry,
  'id' | 'title' | 'description' | 'body' | 'details' | 'faqItems'
> & { image?: MediaAsset };

export function EventLanding({
  event,
  services,
  featuredIds,
  quoteSite,
  otherOccasions,
}: {
  event: EventLandingEntry;
  services: ExplorerService[];
  featuredIds: string[];
  quoteSite: QuoteSite;
  otherOccasions: { title: string; href: string }[];
}) {
  const { cart } = useQuoteCart();
  const selectedCount = cart.items.length;

  return (
    <>
      <section className="event-hero wrap" aria-labelledby="event-title">
        <div className="event-hero-copy">
          <nav className="breadcrumbs" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/tipos-evento">Ocasiones</Link>
          </nav>
          <p className="section-kicker">Gladys · Lima Metropolitana</p>
          <h1 id="event-title">{event.title}</h1>
          <p className="lead">{event.description}</p>
          <div className="actions">
            <a className="button" href="#armar-evento">
              Elegir servicios <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#cotizar-evento">
              Cotizar esta ocasión
            </a>
          </div>
          <p>{event.body}</p>
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

      <div className="event-builder" id="armar-evento">
        <ServiceExplorer
          entries={services}
          featuredIds={featuredIds}
          title="Elige los servicios para esta ocasión."
          intro="Puedes pedir solo comida, solo un servicio complementario o combinar varios. Añádelos aquí y revisa las cantidades antes de escribirnos."
          quoteHref="#cotizar-evento"
          occasion={event.title}
        />
      </div>

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
