import type { OccasionCard } from './occasion-grid';
import { Photo } from './photo';

const planes = ['a', 'c', 'b'] as const;

/** Three ambient examples; the eight commercial destinations remain independent. */
export function OccasionStage({ contexts }: { contexts: OccasionCard[] }) {
  return (
    <figure className="occasion-stage" aria-hidden="true" data-motion-decoration>
      <div className="occasion-stage-visual">
        {contexts.map((occasion, index) => (
          <div className={`occasion-stage-image occasion-stage-image--${planes[index]}`} key={occasion.id}>
            <Photo asset={occasion.image} sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 960px) calc(100vw - 64px), (max-width: 1100px) 52vw, 660px" />
          </div>
        ))}
      </div>
      <figcaption className="occasion-stage-band">
        {contexts.map((occasion, index) => (
          <div className={`occasion-stage-context occasion-stage-context--${planes[index]}`} key={occasion.id}>
            <strong>{occasion.mobileTitle || occasion.title}</strong>
            <p>{occasion.description}</p>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
