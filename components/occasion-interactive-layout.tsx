'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { OccasionCard } from './occasion-grid';
import { OccasionStage } from './occasion-stage';
import { Photo } from './photo';

export function OccasionInteractiveLayout({
  occasions,
  contexts,
}: {
  occasions: OccasionCard[];
  contexts: OccasionCard[];
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeIndex = hoveredId
    ? occasions.findIndex((item) => item.id === hoveredId)
    : -1;
  const activeOccasion = activeIndex >= 0 ? occasions[activeIndex] : null;

  return (
    <div
      className="occasion-prototype-layout wrap"
      data-occasion-hovered={activeOccasion ? 'true' : undefined}
    >
      <div className="occasion-stage-wrapper">
        <OccasionStage contexts={contexts} />
        {activeOccasion && (
          <div className="occasion-stage-hover-preview" aria-hidden="true">
            <div className="occasion-stage-visual">
              <div className="occasion-stage-hover-image">
                <Photo
                  asset={activeOccasion.image}
                  sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 960px) calc(100vw - 64px), (max-width: 1100px) 52vw, 660px"
                />
              </div>
            </div>
            <div className="occasion-stage-band occasion-stage-hover-band">
              <div className="occasion-stage-context occasion-stage-hover-context">
                <span className="occasion-stage-hover-counter">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(occasions.length).padStart(2, '0')}
                </span>
                <strong>{activeOccasion.mobileTitle || activeOccasion.title}</strong>
                {activeOccasion.typicalMix && (
                  <em className="occasion-card-mix">{activeOccasion.typicalMix}</em>
                )}
                <p>{activeOccasion.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="occasion-mobile-swipe-hint" aria-hidden="true">
        Desliza para ver las {occasions.length} ocasiones →
      </p>
      <ul className="occasion-grid occasion-index">
        {occasions.map((occasion, index) => (
          <li key={occasion.id}>
            <Link
              className="occasion-card"
              href={occasion.href}
              data-stage-active={hoveredId === occasion.id ? 'true' : undefined}
              onMouseEnter={() => setHoveredId(occasion.id)}
              onMouseLeave={() => setHoveredId((current) => (current === occasion.id ? null : current))}
              onFocus={() => setHoveredId(occasion.id)}
              onBlur={() => setHoveredId((current) => (current === occasion.id ? null : current))}
            >
              {occasion.image ? (
                <div className="occasion-card-mobile-thumb" aria-hidden="true">
                  <Photo
                    asset={occasion.image}
                    sizes="(max-width: 960px) 80vw, 1px"
                  />
                </div>
              ) : null}
              <span className="occasion-card-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="occasion-card-copy">
                <small>{occasion.group}</small>
                <strong className="occasion-card-full-title">{occasion.title}</strong>
                {occasion.mobileTitle && (
                  <strong className="occasion-card-mobile-title" aria-hidden="true">
                    {occasion.mobileTitle}
                  </strong>
                )}
                {occasion.typicalMix && (
                  <em className="occasion-card-mix">{occasion.typicalMix}</em>
                )}
                <span>{occasion.description}</span>
                <b>Preparar esta ocasión <i aria-hidden="true">↗</i></b>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
