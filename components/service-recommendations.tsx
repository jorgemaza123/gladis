'use client';

import { Photo } from '@/components/photo';
import { QuoteCta } from '@/components/quote-cta';
import { useQuoteCart } from '@/components/quote-cart-provider';
import {
  resolveRecommendations,
  type RecommendationCandidate,
} from '@/lib/recommendations';
import type { MediaAsset } from '@/models/content';

export type RecommendationEntry = RecommendationCandidate & {
  image?: MediaAsset;
};

export function ServiceRecommendations({
  entries,
  eventTypeId,
  heading = 'Completa tu propuesta',
}: {
  entries: RecommendationEntry[];
  eventTypeId?: string | null;
  heading?: string;
}) {
  const { cart } = useQuoteCart();
  const primary = cart.items.find((item) => item.itemId === cart.primaryItemId) || null;
  const recommendations = resolveRecommendations({
    sourceEntryId: primary?.entryId || null,
    entries,
    presentEntryIds: cart.items.map((item) => item.entryId),
    eventTypeId,
  });
  if (!recommendations.length) return null;

  return (
    <section className="service-recommendations" aria-label={heading}>
      <h2>{heading}</h2>
      <p className="field-help">
        Puedes añadir opciones sin cambiar la oferta principal ni su responsable.
      </p>
      <div className="service-recommendation-grid">
        {recommendations.map(({ entry, reason }) => (
          <article className="service-recommendation-card" key={entry.id}>
            <Photo asset={entry.image} sizes="(max-width: 760px) 100vw, 220px" />
            <div>
              <h3>{entry.title}</h3>
              {reason && <p>{reason}</p>}
              <div className="actions">
                <QuoteCta className="button small" entryId={entry.id} mode="add" placement="recommendation">
                  Añadir
                </QuoteCta>
                <a className="text-link" href={`/${entry.kind}/${entry.slug}`}>
                  Ver detalles →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
