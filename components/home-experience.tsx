import Link from 'next/link';
import type { SiteContent } from '@/models/content';
import { Photo } from './photo';
import { QuoteCta } from './quote-cta';

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
        'La compañía se disfruta más cuando alguien se ocupa de los detalles.',
      image: 'imagen-bar-demo',
      ids: ['bar-bartender', 'mozos-evento'],
    },
    {
      title: 'Para poner la mesa',
      description:
        'Elige el menaje y las sillas que acompañarán a tus invitados.',
      image: 'imagen-menaje',
      ids: ['menaje-evento', 'sillas-evento'],
    },
    {
      title: 'Para hacerlo tuyo',
      description: 'Flores, recuerdos y detalles que hablan de tu celebración.',
      image: 'imagen-detalles-demo',
      ids: ['arreglos-florales', 'recuerdos-evento', 'polos-estampados'],
    },
  ];
  return (
    <>
      <section className="mesa-hero wrap" aria-labelledby="home-title">
        <div className="mesa-intro">
          <p className="location-note">
            <span aria-hidden="true" />
            Catering en Lima Metropolitana
          </p>
          <h1 id="home-title">Cocinamos para que disfrutes tu celebración.</h1>
          <p className="lead">
            Buffet, buena compañía y todo lo que necesitas para reunir a los
            tuyos.
          </p>
          <div className="actions">
            <QuoteCta
              className="button"
              entryId="buffet-para-eventos"
              placement="hero"
            >
              Quiero cotizar un buffet <span aria-hidden="true">↗</span>
            </QuoteCta>
            <Link className="text-link" href="#servicios">
              Explorar los servicios
            </Link>
          </div>
          <div className="hero-personal-note">
            <TableDrawing />
            <p>
              Una mesa para todos.
              <br />
              <span>Una propuesta pensada contigo.</span>
            </p>
          </div>
        </div>
        <figure className="mesa-portrait">
          <Photo
            asset={photo('imagen-buffet-demo')}
            priority
            sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 960px) calc(100vw - 64px), (max-width: 1296px) 50vw, 600px"
          />
          <figcaption>
            <span>El gusto de reunirnos</span>
            <small>Buffet y cocina para compartir</small>
          </figcaption>
        </figure>
        <Link className="text-link mesa-mobile-explore" href="#servicios">
          Explorar los servicios
        </Link>
        <div className="hero-bottom">
          <p>
            De una reunión en casa
            <br />a ese día que tanto esperas.
          </p>
          <Link href="#la-mesa" className="scroll-cue">
            <span aria-hidden="true">↓</span> Descubre tu próxima celebración
          </Link>
          <p>
            Todo Lima Metropolitana
            <br />
            Precios a consulta por WhatsApp
          </p>
        </div>
      </section>
      <section className="buffet-story wrap" id="la-mesa">
        <div className="story-heading">
          <p className="section-kicker">Empecemos por la comida</p>
          <h2>
            Las mejores conversaciones{' '}
            <br />
            suceden alrededor de una mesa.
          </h2>
        </div>
        <div className="buffet-composition">
          <figure className="buffet-image">
            <Photo
              asset={photo('imagen-buffet-demo')}
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 960px) calc(100vw - 64px), (max-width: 1296px) 50vw, 580px"
            />
            <figcaption>Sabores para compartir, a tu manera.</figcaption>
          </figure>
          <div className="buffet-options">
            <p>
              No hay dos celebraciones iguales. Cuéntanos la ocasión, cuántos
              serán y el presupuesto que tienes en mente.
            </p>
            <article>
              <h3>Buffet para tu evento</h3>
              <p>
                Entradas, fondos y guarniciones para bodas, cumpleaños,
                reuniones y encuentros de trabajo.
              </p>
              <Link className="text-link" href="/servicios/buffet-para-eventos">
                Conocer el buffet <span aria-hidden="true">↗</span>
              </Link>
            </article>
            <article>
              <h3>El sabor de un menú criollo</h3>
              <p>
                Una alternativa para quienes quieren poner nuestros sabores al
                centro de la celebración.
              </p>
              <Link className="text-link" href="/menus/menu-criollo-eventos">
                Ver el menú criollo <span aria-hidden="true">↗</span>
              </Link>
            </article>
          </div>
        </div>
      </section>
      <section className="service-garden" id="servicios">
        <div className="wrap">
          <div className="garden-heading">
            <h2>
              Lo que hace{' '}
              <br />
              completo tu evento.
            </h2>
            <p>
              Empieza por lo que necesitas. Puedes consultar cada servicio por
              separado o reunir varios en tu evento.
            </p>
          </div>
          <div className="service-families">
            {families.map((family) => (
              <article className="service-family" key={family.title}>
                <Photo
                  asset={photo(family.image)}
                  sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 960px) 45vw, (max-width: 1296px) 33vw, 380px"
                />
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
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="conversation-section wrap" id="como-cotizar">
        <div>
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
          <li>
            <span>1</span>
            <div>
              <h3>Elige lo que necesitas</h3>
              <p>
                Reúne tus servicios en Mi evento. Elige uno como principal y
                ajusta las cantidades.
              </p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <h3>Cuéntanos tu idea</h3>
              <p>
                Fecha, distrito, invitados y presupuesto. Con esos detalles
                podemos empezar.
              </p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <h3>Conversemos por WhatsApp</h3>
              <p>
                Revisa tu mensaje y envíalo al responsable. Confirmamos
                disponibilidad, precio y condiciones contigo.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="occasion-section">
        <div className="wrap occasion-layout">
          <div className="occasion-photo">
            <Photo asset={photo('imagen-sillas')} />
          </div>
          <div>
            <p className="section-kicker">Cerca de tu celebración</p>
            <h2>
              Hay muchas razones
              <br />
              para encontrarnos.
            </h2>
            <p>
              Un cumpleaños en familia, una boda, un almuerzo de equipo o una
              reunión porque sí. La ocasión la pones tú.
            </p>
            <ul className="occasion-links">
              <li>
                <Link href="/tipos-evento/cumpleanos">
                  Cumpleaños y reuniones
                </Link>
              </li>
              <li>
                <Link href="/tipos-evento/boda">Bodas y celebraciones</Link>
              </li>
              <li>
                <Link href="/tipos-evento/corporativo">
                  Eventos corporativos
                </Link>
              </li>
            </ul>
            <p className="coverage-note">
              Atendemos todo Lima Metropolitana.
              <br />
              Coordinamos contigo el distrito, el acceso y el traslado.
            </p>
          </div>
        </div>
      </section>
      <section className="section wrap faq home-faq">
        <div>
          <p className="section-kicker">Antes de empezar</p>
          <h2>
            Hagamos las cosas
            <br />
            más sencillas.
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
      </section>
      <section className="mesa-invitation wrap">
        <TableDrawing />
        <p>Tu próxima celebración</p>
        <h2>
          Guardemos un lugar
          <br />
          para tu idea.
        </h2>
        <p>
          Cuéntanos qué estás imaginando.
          <br />
          Empezamos por una conversación.
        </p>
        <QuoteCta className="button light" placement="footer">
          Preparar mi evento <span aria-hidden="true">↗</span>
        </QuoteCta>
      </section>
    </>
  );
}
