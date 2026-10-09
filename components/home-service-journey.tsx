import Link from 'next/link';
import { homeServiceScenes, type HomeSceneLayer } from '@/data/home-service-scenes';
import type { SiteContent } from '@/models/content';
import { QuoteCta } from './quote-cta';

function SceneLayerImage({ layer }: { layer: HomeSceneLayer }) {
  return (
    <picture className={`service-scene-layer service-scene-layer--${layer.name}`}>
      <source media="(max-width: 760px)" srcSet={layer.mobile} />
      <img
        src={layer.desktop}
        width={layer.width}
        height={layer.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

export function HomeServiceJourney({ site }: { site: SiteContent }) {
  return (
    <section className="service-garden" id="servicios" aria-labelledby="services-title">
      <div className="garden-heading wrap" data-reveal="chapter">
        <div>
          <p className="section-kicker">Todo puede convivir en una sola cotización</p>
          <h2 id="services-title">
            Arma el evento{' '}
            <br />
            que tienes en mente.
          </h2>
        </div>
        <p>
          Empieza por la comida o elige solo el servicio que necesitas. Los
          precios se confirman por WhatsApp según fecha, distrito y cantidad.
        </p>
      </div>

      <div className="service-families">
        {homeServiceScenes.map((scene) => {
          const entries = scene.ids.flatMap((id) => {
            const entry = site.entries.find((item) => item.id === id);
            return entry ? [entry] : [];
          });
          const primary = entries.find((entry) => entry.id === scene.primaryId);

          return (
            <article
              className="service-family"
              data-scene={scene.key}
              data-visual={scene.visualMode}
              data-reveal="service"
              id={scene.anchor}
              key={scene.key}
            >
              <div className="service-card wrap">
                <div className="service-visual" aria-hidden="true">
                  <span className="service-scene-orbit" />
                  {scene.layers.filter((layer) => scene.visualMode === 'cutout' || layer.name === 'main').map((layer) => (
                    <SceneLayerImage layer={layer} key={layer.name} />
                  ))}
                </div>

                <div className="service-copy">
                  <p className="service-scene-kicker">{scene.kicker}</p>
                  <h3>{scene.title}</h3>
                  <p>{scene.description}</p>
                  <ul className="service-essentials" aria-label={`Lo esencial de ${scene.kicker}`}>
                    {scene.essentials.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="service-scene-meta">
                    Lima Metropolitana <span aria-hidden="true">·</span> Precio a consulta
                  </p>
                  <div className="service-scene-actions">
                    <QuoteCta
                      className="button service-scene-cta"
                      entryId={scene.primaryId}
                      placement="catalog_card"
                    >
                      {scene.cta} <span aria-hidden="true">↗</span>
                    </QuoteCta>
                    {primary ? (
                      <Link className="service-detail-link" href={`/${primary.kind}/${primary.slug}`}>
                        Ver detalles
                      </Link>
                    ) : null}
                  </div>
                  <ul className="service-options" aria-label={`Servicios disponibles en ${scene.kicker}`}>
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        <Link href={`/${entry.kind}/${entry.slug}`}>{entry.title}</Link>
                        <QuoteCta
                          className="service-option-add"
                          entryId={entry.id}
                          placement="catalog_card"
                          mode="add"
                        >
                          Añadir <span className="sr-only">{entry.title}</span>
                          <span aria-hidden="true">+</span>
                        </QuoteCta>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
