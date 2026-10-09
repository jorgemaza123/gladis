import Link from 'next/link';
import type { MediaAsset } from '@/models/content';
import { Photo } from './photo';

export type OccasionCard = {
  id: string;
  title: string;
  mobileTitle?: string;
  description: string;
  href: string;
  group: string;
  image?: MediaAsset;
};

export function OccasionGrid({ occasions }: { occasions: OccasionCard[] }) {
  return (
    <section className="occasion-grid-section" id="ocasiones" aria-labelledby="occasion-title">
      <div className="wrap occasion-grid-heading" data-reveal="occasion-heading">
        <div>
          <p className="section-kicker">Ahora imagina la tuya</p>
          <h2 id="occasion-title">Elige la historia que quieres celebrar.</h2>
        </div>
        <p>
          Elige una ocasión y reúne en un solo lugar el buffet, la atención y
          los detalles que podrías necesitar.
        </p>
      </div>
      <ul className="occasion-grid wrap">
        {occasions.map((occasion, index) => (
          <li key={occasion.id} data-reveal="occasion">
            <Link className="occasion-card" href={occasion.href}>
              <Photo
                asset={occasion.image}
                sizes="(max-width: 600px) 45vw, (max-width: 1050px) 46vw, 380px"
              />
              <span className="occasion-card-shade" aria-hidden="true" />
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
                <span>{occasion.description}</span>
                <b>Preparar esta ocasión <i aria-hidden="true">↗</i></b>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
