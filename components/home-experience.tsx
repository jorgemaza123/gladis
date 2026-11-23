import type { SiteContent } from '@/models/content';
import Link from 'next/link';
import { QuoteCta } from './quote-cta';
import { OccasionGrid } from './occasion-grid';
import { StoryHero } from './story-hero';
import { HomeServiceJourney } from './home-service-journey';
import { HomeServiceNav } from './home-service-nav';
import { ServiceExplorer } from './service-explorer';
import { HomeSmoothScroll } from './home-smooth-scroll';
import { HomeMotion } from './home-motion';
import { C4DirectoryEntrance } from './c4-directory-entrance';
import { explorerServices, quoteSiteFor } from '@/lib/public-services';
import { publicReviewsUrl } from '@/config/commercial-evidence';
import { ServiceSearchTrigger } from './service-search';
import { CompanyMoments } from './company-moments';
import { QuotePreviewCard } from './quote-preview-card';
import { MesaClosingLabel } from './mesa-closing-cta';
import { MobileScrollProgress } from './mobile-scroll-progress';

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

function CompanyGateway() {
  return (
    <div className="company-chapter">
      <section className="company-gateway wrap" aria-labelledby="company-gateway-title">
        <span className="company-coordination-rule" data-motion-decoration aria-hidden="true" />
        <div className="company-gateway-heading" data-motion-content>
          <p className="section-kicker">Para empresas y equipos</p>
          <h2 id="company-gateway-title">Una consulta clara para una operación bien coordinada.</h2>
        </div>
        <div>
          <p className="company-gateway-copy" data-motion-content>
            Desayunos, coffee break, reuniones, capacitaciones, lanzamientos y fechas internas. Elige alimentación, personal, mobiliario, audiovisuales, producción o personalizados según el programa.
          </p>
          <CompanyMoments />
          <Link className="button" href="/empresas">Ver soluciones para empresas <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
export function HomeExperience({ site }: { site: SiteContent }) {
  const reviewsUrl = publicReviewsUrl();
  const photo = (id: string) => site.media.find((m) => m.id === id);
  const occasionIds = [
    'cumpleanos',
    'graduaciones',
    'fin-ano-empresas',
    'bautizos-comuniones',
    'boda',
    'quinceanos',
    'reuniones-familiares',
    'desayunos-corporativos',
    'corporativo',
  ];
  const occasionMobileTitles: Record<string, string> = {
    cumpleanos: 'Cumpleaños',
    graduaciones: 'Graduaciones y promociones',
    'fin-ano-empresas': 'Fin de año de empresas',
    'bautizos-comuniones': 'Bautizos y comuniones',
    boda: 'Bodas y aniversarios',
    quinceanos: 'Quinceaños',
    'reuniones-familiares': 'Reuniones familiares',
    'desayunos-corporativos': 'Desayunos corporativos',
    corporativo: 'Eventos de empresa',
  };
  const occasionTypicalMix: Record<string, string> = {
    cumpleanos: 'Buffet o menú criollo + Menaje + Mozos',
    graduaciones: 'Buffet + Animación u orquesta + Vehículo ceremonial',
    'fin-ano-empresas': 'Buffet + Bartender + Producción y sonido',
    'bautizos-comuniones': 'Menú o buffet + Decoración + Sillas y menaje',
    boda: 'Buffet + Flores + Música + Vehículo ceremonial',
    quinceanos: 'Animación u orquesta + Producción + Vehículo ceremonial',
    'reuniones-familiares': 'Menú criollo + Menaje + Sillas',
    'desayunos-corporativos': 'Desayuno o coffee break + Menaje + Mozos',
    corporativo: 'Coffee break o almuerzo + Mobiliario + Producción',
  };
  const occasions = occasionIds.flatMap((id) => {
    const entry = site.entries.find((item) => item.id === id);
    if (!entry) return [];
    return [{
      id: entry.id,
      title: occasionMobileTitles[entry.id] || entry.title,
      mobileTitle: occasionMobileTitles[entry.id],
      typicalMix: occasionTypicalMix[entry.id],
      description: entry.description,
      href: `/${entry.kind}/${entry.slug}`,
      group: entry.category || 'Celebraciones',
      image: photo(entry.id === 'graduaciones' ? 'imagen-recuerdos' : entry.imageId),
    }];
  });
  return (
    <>
      <MobileScrollProgress />
      <HomeSmoothScroll />
      <StoryHero serviceSearch={<ServiceSearchTrigger className="service-search-hero-trigger">Buscar o ver servicios</ServiceSearchTrigger>} />
      <HomeServiceNav />
      <aside className="home-assurance wrap" aria-label="Una consulta con condiciones claras">
        <div className="home-assurance-lead">
          <p className="home-assurance-kicker">Coordinación directa</p>
          <strong>Un servicio o varios. Una sola conversación.</strong>
          <p>Antes de reservar, confirmamos contigo disponibilidad, precio, alcance y traslado en Lima Metropolitana.</p>
          <ul className="home-assurance-pillars" aria-label="Garantías de atención">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="9" cy="7" r="3" />
                <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                <path d="M16 11l2 2 4-4" />
              </svg>
              <span>Atención directa por equipo de Cocina o Eventos</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 8h8M8 12h8M8 16h5" />
              </svg>
              <span>Propuesta clara sin compromisos ocultos</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10Z" />
                <circle cx="12" cy="11" r="2" />
              </svg>
              <span>Cobertura en todo Lima Metropolitana</span>
            </li>
          </ul>
        </div>
        <div className="home-assurance-links">
          <Link href="/cotizar#consulta-inicial">
            <span>¿Todavía estás definiendo el evento? Consulta por WhatsApp</span>
            <span className="home-assurance-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link href="/paginas/nosotros">
            <span>Cómo coordinamos tu evento</span>
            <span className="home-assurance-arrow" aria-hidden="true">→</span>
          </Link>
          {reviewsUrl && (
            <a href={reviewsUrl} target="_blank" rel="noopener noreferrer">
              <span>Leer reseñas de clientes</span>
              <span className="home-assurance-arrow" aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </aside>
      <HomeServiceJourney site={site} />
      <ServiceExplorer
        entries={explorerServices(site)}
        featuredIds={['buffet-para-eventos', 'menaje-evento', 'mozos-evento']}
        title="Completa tu evento con lo que falta."
        intro="Empieza por los esenciales y abre solo las familias que necesites. Todo queda en una sola cotización."
        anchorId="completa-tu-evento"
        headingDecoration={<C4DirectoryEntrance />}
        homeProgressive
        quoteSite={quoteSiteFor(site)}
      />
      <OccasionGrid occasions={occasions} />
      <CompanyGateway />
      <section className="home-guides-strip wrap" aria-labelledby="home-guides-title">
        <div className="home-guides-strip-head">
          <p className="section-kicker">Guías prácticas para tu presupuesto</p>
          <h2 id="home-guides-title">Desde reuniones pequeñas en casa hasta grandes celebraciones.</h2>
        </div>
        <ul className="home-guides-links">
          <li>
            <Link href="/guias/catering-para-reuniones-pequenas-en-casa-lima">
              Reuniones pequeñas en casa <span aria-hidden="true">→</span>
            </Link>
          </li>
          <li>
            <Link href="/guias/cuanto-buffet-calcular-30-50-personas-lima">
              Calcular buffet para 30 o 50 personas <span aria-hidden="true">→</span>
            </Link>
          </li>
          <li>
            <Link href="/guias/catering-bodas-graduaciones-eventos-grandes-lima">
              Bodas, graduaciones y eventos grandes <span aria-hidden="true">→</span>
            </Link>
          </li>
          <li>
            <Link href="/guias/coffee-break-corporativo-san-isidro-miraflores">
              Coffee break en San Isidro y Miraflores <span aria-hidden="true">→</span>
            </Link>
          </li>
          <li>
            <Link href="/guias">
              Ver todas las guías <span aria-hidden="true">↗</span>
            </Link>
          </li>
        </ul>
      </section>
      <section className="conversation-chapter" id="como-cotizar">
        <div className="conversation-section wrap">
          <div data-motion-content>
            <p className="section-kicker">De la idea a tu celebración</p>
            <h2>
              Lo conversamos.
              <br />
              Lo organizamos.
              <br />
              Tú lo disfrutas.
            </h2>
            <QuoteCta className="button" placement="navigation">
              Cotizar mi evento <span aria-hidden="true">↗</span>
            </QuoteCta>
            <QuotePreviewCard />
          </div>
          <ol className="conversation-steps">
            <li>
              <i className="process-thread" data-motion-decoration aria-hidden="true" />
              <span>1</span>
              <div data-motion-content>
                <h3>Elige lo que necesitas</h3>
                <p>
                  Añade los servicios a Mi evento y dinos las cantidades
                  aproximadas. Marca el principal para saber quién te atenderá.
                </p>
              </div>
            </li>
            <li>
              <i className="process-thread" data-motion-decoration aria-hidden="true" />
              <span>2</span>
              <div data-motion-content>
                <h3>Cuéntanos tu idea</h3>
                <p>
                  Dinos la fecha, el distrito y cuántos invitados esperas. Si ya
                  tienes un presupuesto en mente, también puedes contárnoslo.
                </p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div data-motion-content>
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
      <section className="mesa-invitation wrap" data-motion-section="cierre">
        <div className="final-table-plane" data-motion-decoration>
          <TableDrawing />
        </div>
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
          <MesaClosingLabel />
        </QuoteCta>
      </section>
      <HomeMotion />
    </>
  );
}
