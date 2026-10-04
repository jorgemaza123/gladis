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
            Tú reúne a los tuyos. Nosotros ponemos el buffet y te ayudamos con
            los detalles.
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
              Ver los servicios
            </Link>
          </div>
          <div className="hero-personal-note">
            <TableDrawing />
            <p>
              Una mesa para todos.
              <br />
              <span>Lo planeamos contigo.</span>
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
          Ver los servicios
        </Link>
        <div className="hero-bottom">
          <p>
            De una reunión en casa
            <br />a ese día que tanto esperas.
          </p>
          <Link href="#la-mesa" className="scroll-cue">
            <span aria-hidden="true">↓</span> Empecemos por el buffet
          </Link>
          <p>
            Todo Lima Metropolitana
            <br />
            Consulta precios por WhatsApp
          </p>
        </div>
      </section>
      <section className="buffet-story wrap" id="la-mesa">
        <div className="story-heading" data-reveal="heading">
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
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 960px) calc(100vw - 64px), (max-width: 1296px) 50vw, 580px"
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
      </section>
      <section className="service-garden" id="servicios">
        <div className="wrap">
          <div className="garden-heading" data-reveal="heading">
            <h2>
              Además del buffet, <br />
              lo que tu evento necesita.
            </h2>
            <p>
              ¿También necesitas mozos, sillas o flores? Puedes pedir un solo
              servicio o combinar varios. Tú eliges.
            </p>
          </div>
          <div className="service-families">
            {families.map((family) => (
              <article
                className="service-family"
                key={family.title}
                data-reveal="service"
              >
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
        <div data-reveal="heading">
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
      </section>
      <section className="occasion-section">
        <div className="wrap occasion-layout">
          <div className="occasion-photo" data-reveal="photograph" data-depth>
            <Photo asset={photo('imagen-sillas')} />
          </div>
          <div>
            <p className="section-kicker">Cerca de tu celebración</p>
            <h2 data-reveal="heading">
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
              Cuéntanos dónde será para coordinar cómo llegar.
            </p>
          </div>
        </div>
      </section>
      <section className="section wrap faq home-faq">
        <div data-reveal="heading">
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
