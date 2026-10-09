import type { SiteContent } from '@/models/content';
import { QuoteCta } from './quote-cta';
import { OccasionGrid } from './occasion-grid';
import { StoryHero } from './story-hero';
import { HomeServiceJourney } from './home-service-journey';
import { HomeServiceNav } from './home-service-nav';
import { ServiceExplorer } from './service-explorer';
import { explorerServices, quoteSiteFor } from '@/lib/public-services';

function TableDrawing() {
  return (
    <svg
      className="table-drawing"
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="62" pathLength="1" />
      <circle cx="100" cy="100" r="49" pathLength="1" />
      <path
        pathLength="1"
        d="M18 46v42m7-42v42m7-42v42M18 76q7 24 14 0M25 91v62M178 46v107m0-107c-18 16-20 47 0 47"
      />
      <path
        className="drawing-sprig"
        pathLength="1"
        d="M83 116q18-8 34-40m-21 28q-24-6-16-23 15 2 16 23m9-13q-3-24 16-25 5 17-16 25m-8 11q24 6 25-13-17-5-25 13"
      />
    </svg>
  );
}
export function HomeExperience({ site }: { site: SiteContent }) {
  const photo = (id: string) => site.media.find((m) => m.id === id);
  const occasionIds = [
    'cumpleanos',
    'graduaciones',
    'fin-ano-empresas',
    'bautizos-comuniones',
    'boda',
    'reuniones-familiares',
    'desayunos-corporativos',
    'corporativo',
  ];
  const occasions = occasionIds.flatMap((id) => {
    const entry = site.entries.find((item) => item.id === id);
    if (!entry) return [];
    return [{
      id: entry.id,
      title: entry.title,
      description: entry.description,
      href: `/${entry.kind}/${entry.slug}`,
      group: entry.category || 'Celebraciones',
      image: photo(entry.imageId),
    }];
  });
  return (
    <>
      <StoryHero />
      <HomeServiceNav />
      <OccasionGrid occasions={occasions} />
      <ServiceExplorer
        entries={explorerServices(site)}
        featuredIds={['buffet-para-eventos', 'menaje-evento', 'mozos-evento']}
        title="Comida, atención y detalles para reunir a los tuyos."
        intro="Elige un servicio o arma una combinación. Puedes ver todas las opciones y cotizar aquí, sin perder lo que ya seleccionaste."
        quoteSite={quoteSiteFor(site)}
      />
      <HomeServiceJourney site={site} />
      <section className="conversation-chapter" id="como-cotizar">
        <div className="conversation-section wrap">
          <div data-reveal="support-heading">
            <p className="section-kicker">De la idea a tu celebración</p>
            <h2>
              Lo conversamos.
              <br />
              Lo organizamos.
              <br />
              Tú lo disfrutas.
            </h2>
            <QuoteCta className="button" placement="navigation">
              Preparar mi evento <span aria-hidden="true">↗</span>
            </QuoteCta>
          </div>
          <ol className="conversation-steps">
            <li data-reveal="step">
              <span>1</span>
              <div>
                <h3>Elige lo que necesitas</h3>
                <p>
                  Añade los servicios a Mi evento y dinos las cantidades
                  aproximadas. Marca el principal para saber quién te atenderá.
                </p>
              </div>
            </li>
            <li data-reveal="step">
              <span>2</span>
              <div>
                <h3>Cuéntanos tu idea</h3>
                <p>
                  Dinos la fecha, el distrito y cuántos invitados esperas. Si ya
                  tienes un presupuesto en mente, también puedes contárnoslo.
                </p>
              </div>
            </li>
            <li data-reveal="step">
              <span>3</span>
              <div>
                <h3>Conversemos por WhatsApp</h3>
                <p>
                  Revisa tu mensaje y envíanoslo por WhatsApp. Allí conversamos
                  sobre precios, disponibilidad y lo que incluirá tu servicio.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      <section className="faq-chapter">
        <div className="section wrap faq home-faq">
          <div>
            <p className="section-kicker">Antes de empezar</p>
            <h2>
              ¿Tienes alguna
              <br />
              duda?
            </h2>
          </div>
          <div>
            {site.faqs.map((faq) => (
              <details key={faq.id}>
                <summary>
                  {faq.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="mesa-invitation wrap" data-reveal="invitation">
        <TableDrawing />
        <p>Tu próxima celebración</p>
        <h2>
          ¿Qué tienes ganas
          <br />
          de celebrar?
        </h2>
        <p>
          Cuéntanos tu idea, aunque todavía falten detalles.
          <br />
          La vamos viendo contigo.
        </p>
        <QuoteCta className="button light" placement="footer">
          Preparar mi evento <span aria-hidden="true">↗</span>
        </QuoteCta>
      </section>
    </>
  );
}
