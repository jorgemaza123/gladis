import type { MediaAsset } from '@/models/content';
import { OccasionInteractiveLayout } from './occasion-interactive-layout';
import '@/app/occasion-motion.css';

export type OccasionCard = {
  id: string;
  title: string;
  mobileTitle?: string;
  typicalMix?: string;
  description: string;
  href: string;
  group: string;
  image?: MediaAsset;
};

export function OccasionGrid({ occasions }: { occasions: OccasionCard[] }) {
  const normalizedOccasions = occasions.map((occasion) => ({ ...occasion }));
  const contexts = ['reuniones-familiares', 'boda', 'fin-ano-empresas']
    .flatMap((id) => normalizedOccasions.find((occasion) => occasion.id === id) || []);
  return (
    <section className="occasion-grid-section occasion-prototype" id="ocasiones" aria-labelledby="occasion-title">
      <div className="wrap occasion-grid-heading">
        <div>
          <p className="section-kicker">Ahora imagina la tuya</p>
          <h2 id="occasion-title">Elige la historia que quieres celebrar.</h2>
        </div>
        <p>
          Elige una ocasión y reúne en un solo lugar el buffet, la atención y
          los detalles que podrías necesitar.
        </p>
      </div>
      <OccasionInteractiveLayout occasions={normalizedOccasions} contexts={contexts} />
    </section>
  );
}
