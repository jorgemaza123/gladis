import Link from 'next/link';
import type { SiteContent } from '@/models/content';
import { Photo } from './photo';
import { QuoteCta } from './quote-cta';
import { OccasionGrid } from './occasion-grid';
import { StoryHero } from './story-hero';

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
  const families = [
    {
      title: 'Para atender y brindar',
      description:
        'Para servir la comida, preparar los tragos y atender a tus invitados.',
      image: 'imagen-bar-demo',
      ids: ['bar-bartender', 'mozos-evento'],
    },
    {
      title: 'Para poner la mesa',
      description: 'Menaje y sillas para que todos tengan su lugar en la mesa.',
      image: 'imagen-menaje',
      ids: ['menaje-evento', 'sillas-evento'],
    },
    {
      title: 'Para hacerlo tuyo',
      description:
        'Flores, recuerdos y polos con ese detalle que tienes en mente.',
      image: 'imagen-detalles-demo',
      ids: ['arreglos-florales', 'recuerdos-evento', 'polos-estampados'],
    },
  ];
  const occasionIds = [
    'cumpleanos',
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
      <OccasionGrid occasions={occasions} />
      <section className="buffet-story" id="la-mesa">
        <div className="wrap">
          <div className="story-heading" data-reveal="chapter">
            <p className="section-kicker">Empecemos por la comida</p>
            <h2>
              Un buen buffet <br />
              para sentarse a compartir.
            </h2>
          </div>
          <div className="buffet-composition">
            <figure className="buffet-image" data-reveal="photograph" data-depth>
              <Photo
                asset={photo('imagen-buffet-demo')}
                sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 960px) calc(100vw - 64px), (max-width: 1296px) 58vw, 700px"
              />
              <figcaption>Sabores para compartir, a tu manera.</figcaption>
            </figure>
            <div className="buffet-options">
              <p>
                ¿Qué vas a celebrar y cuántos serán? Cuéntanos qué te gustaría
                servir y cuánto tienes pensado invertir.
              </p>
              <article data-reveal="menu">
                <h3>Buffet para tu evento</h3>
                <p>
                  Entradas, fondos y guarniciones para bodas, cumpleaños,
                  reuniones y encuentros de trabajo.
                </p>
                <Link className="text-link" href="/servicios/buffet-para-eventos">
                  Conocer el buffet <span aria-hidden="true">↗</span>
                </Link>
              </article>
              <article data-reveal="menu">
                <h3>El sabor de un menú criollo</h3>
                <p>
                  Los sabores criollos que nos gusta compartir, también en ese día
                  especial.
                </p>
                <Link className="text-link" href="/menus/menu-criollo-eventos">
                  Ver el menú criollo <span aria-hidden="true">↗</span>
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="service-garden" id="servicios">
        <div className="wrap">
          <div className="garden-heading" data-reveal="chapter">
            <div>
              <p className="section-kicker">Todo alrededor de la mesa</p>
              <h2>
                Además del buffet, <br />
                lo que tu evento necesita.
              </h2>
            </div>
            <p>
              ¿También necesitas mozos, sillas o flores? Puedes pedir un solo
              servicio o combinar varios. Tú eliges.
            </p>
          </div>
          <div className="service-families">
            {families.map((family, index) => (
              <article
                className="service-family"
                key={family.title}
                data-reveal="service"
              >
                <div className="service-card">
                  <div className="service-visual">
                    <span className="service-number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Photo
                      asset={photo(family.image)}
                      sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 960px) 45vw, (max-width: 1296px) 52vw, 620px"
                    />
                  </div>
                  <div className="service-copy">
                    <h3>{family.title}</h3>
                    <p>{family.description}</p>
                    <ul>
                      {family.ids.map((id) => {
                        const entry = site.entries.find((e) => e.id === id)!;
                        return (
                          <li key={id}>
                            <Link href={`/${entry.kind}/${entry.slug}`}>
                              <span>{entry.title}</span>
                              <span aria-hidden="true">↗</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
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
