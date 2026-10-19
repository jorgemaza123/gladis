'use client';

import Link from 'next/link';
import type { ContentEntry, MediaAsset } from '@/models/content';
import type { ExplorerService } from '@/lib/public-services';
import type { QuoteSite } from './quote';
import { Quote } from './quote';
import { Photo } from './photo';
import { ServiceExplorer } from './service-explorer';
import { useQuoteCart } from './quote-cart-provider';

type EventLandingEntry = Pick<
  ContentEntry,
  'id' | 'title' | 'description' | 'body' | 'details' | 'faqItems'
> & { image?: MediaAsset };

const occasionAdvice: Record<string, { title: string; body: string; checks: string[] }> = {
  boda: { title: 'Piensa la recepción como una secuencia.', body: 'Separa llegada, ceremonia o brindis, comida, baile y cierre. Con esos tiempos se puede calcular atención, barra, menaje y música sin interrumpir los momentos principales.', checks: ['Horario de ceremonia y recepción', 'Distribución de mesas y pista', 'Brindis, discursos y baile'] },
  cumpleanos: { title: 'Empieza por el horario y el lugar.', body: 'Un almuerzo familiar, una cena y una fiesta de adultos necesitan servicios distintos. Indica qué aporta la casa o el local para cotizar únicamente lo que falta.', checks: ['Adultos y niños', 'Comida sentada o para compartir', 'Hora permitida para música y retiro'] },
  'bautizos-comuniones': { title: 'Coordina ceremonia y reunión familiar.', body: 'Confirma cuánto tiempo hay entre ambos momentos y si los invitados llegarán juntos. Esto ordena la comida, la atención, las flores y los recuerdos.', checks: ['Hora de salida de la ceremonia', 'Invitados adultos y niños', 'Mesa familiar o recepción'] },
  'reuniones-familiares': { title: 'Resuelve lo práctico antes del menú.', body: 'Revisa capacidad, asientos, acceso y zona para servir. Después define si prefieres comida emplatada, fuentes para compartir o un buffet sencillo.', checks: ['Capacidad real del lugar', 'Personas mayores o niños', 'Recursos disponibles en casa'] },
  graduaciones: { title: 'Trabaja con una lista y un responsable.', body: 'Distingue alumnos, familiares y docentes, y define quién aprobará cambios. Una sola versión de asistentes, horario y servicios evita pedidos duplicados.', checks: ['Lista consolidada', 'Programa de ceremonia y celebración', 'Fecha límite para confirmar cantidades'] },
  'fin-ano-empresas': { title: 'El cierre puede tener varios formatos.', body: 'Define si será desayuno, almuerzo, brindis o fiesta y qué objetivo tiene para el equipo. La agenda determina alimentación, producción, música y reconocimientos.', checks: ['Formato y duración', 'Asistentes y sede', 'Palabras, premios o actividad interna'] },
  'cumpleanos-infantiles': { title: 'La edad cambia toda la propuesta.', body: 'Indica edades, número de niños y adultos, espacio libre y duración. La comida, los juegos y la animación deben encajar con el ritmo y la seguridad del grupo.', checks: ['Edades y alergias', 'Zona segura para juegos', 'Horario de comida y torta'] },
  quinceanos: { title: 'Conecta ceremonia, música y producción.', body: 'Escribe el orden de ingreso, brindis, baile y momentos especiales. DJ, maestro de ceremonias y sonido deben trabajar con el mismo programa.', checks: ['Programa y canciones', 'Ensayo de momentos especiales', 'Prueba de sonido e iluminación'] },
  'baby-shower-revelacion': { title: 'Busca comodidad y buena circulación.', body: 'Distribuye asientos, regalos, comida y fotografías sin bloquear el paso. Si habrá revelación, revisa antes la dinámica y las condiciones del lugar.', checks: ['Duración y número de invitados', 'Zona para regalos y fotos', 'Dinámica segura de revelación'] },
  'matrimonio-civil': { title: 'Una boda íntima también necesita tiempos claros.', body: 'Define si ceremonia y comida serán en el mismo espacio y cuánto tiempo habrá para cambiar el montaje. Señala los momentos que quieres registrar.', checks: ['Ceremonia y recepción', 'Cambio de distribución', 'Brindis y fotografías'] },
  'fiesta-casa-privada': { title: 'Adapta los servicios a una vivienda.', body: 'Comprueba puertas, escaleras, energía, agua y reglas del edificio. Una buena logística evita que mobiliario, barra o sonido lleguen sin un lugar viable.', checks: ['Medidas y accesos', 'Reglas de ruido y horario', 'Zona de trabajo para proveedores'] },
  'capacitaciones-conferencias': { title: 'La agenda dirige la operación.', body: 'Marca registro, bloques, pausas, preguntas y cierre. Así se coordinan coffee break, mobiliario, micrófonos, pantalla y streaming sin interferir con la sesión.', checks: ['Agenda y ponentes', 'Aforo y distribución', 'Prueba técnica y conectividad'] },
  'lanzamientos-inauguraciones': { title: 'El objetivo debe verse en el recorrido.', body: 'Ordena registro, bienvenida, presentación, demostración y atención de invitados. Catering, producción y materiales de marca deben responder a ese recorrido.', checks: ['Mensaje y acción esperada', 'Guion y archivos definitivos', 'Montaje, prueba y atención'] },
  'activaciones-ferias': { title: 'Diseña para el flujo de personas.', body: 'Calcula entradas, permanencia y salida del público. Mobiliario, sonido y merchandising deben facilitar la interacción sin bloquear el espacio.', checks: ['Flujo y duración', 'Dinámica de participación', 'Entrega y reposición de materiales'] },
  'aniversarios-empresa': { title: 'Distingue celebración y reconocimiento.', body: 'Define si habrá desayuno, almuerzo, ceremonia o fiesta, y quién recibirá menciones o regalos. Esto ordena programa, alimentación y personalizados.', checks: ['Objetivo de la fecha', 'Lista de reconocimientos', 'Formato de comida y entretenimiento'] },
  'team-building': { title: 'Parte de un objetivo concreto.', body: 'Integración, bienvenida y colaboración necesitan dinámicas diferentes. Comparte el perfil del grupo, el espacio y el tiempo disponible antes de elegir actividades.', checks: ['Objetivo y perfil del equipo', 'Duración y nivel de actividad', 'Alimentación, materiales y cierre'] },
  'desayunos-corporativos': { title: 'Ajusta el desayuno a la jornada.', body: 'Una entrega individual, una mesa compartida y una pausa de capacitación requieren presentaciones distintas. Indica cuándo comerá el equipo y cuánto tiempo tendrá.', checks: ['Horario y asistentes', 'Entrega o atención', 'Espacio, menaje y bebidas'] },
  corporativo: { title: 'Primero define qué debe lograr el evento.', body: 'Una reunión, una inauguración y una celebración interna no comparten la misma operación. Resume objetivo, agenda, asistentes y recursos del lugar antes de elegir servicios.', checks: ['Objetivo y audiencia', 'Agenda y sede', 'Alimentación, producción y personal'] },
};

export function EventLanding({
  event,
  services,
  featuredIds,
  quoteSite,
  otherOccasions,
}: {
  event: EventLandingEntry;
  services: ExplorerService[];
  featuredIds: string[];
  quoteSite: QuoteSite;
  otherOccasions: { title: string; href: string }[];
}) {
  const { cart } = useQuoteCart();
  const selectedCount = cart.items.length;
  const isBusiness = new Set([
    'desayunos-corporativos', 'corporativo', 'fin-ano-empresas',
    'capacitaciones-conferencias', 'lanzamientos-inauguraciones',
    'activaciones-ferias', 'aniversarios-empresa', 'team-building',
  ]).has(event.id);
  const suggested = featuredIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is ExplorerService => !!service)
    .slice(0, 8);
  const advice = occasionAdvice[event.id];

  return (
    <>
      <section className="event-hero wrap" aria-labelledby="event-title">
        <div className="event-hero-copy">
          <nav className="breadcrumbs" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link>
            <span>/</span>
            <Link href="/tipos-evento">Ocasiones</Link>
          </nav>
          <p className="section-kicker">{isBusiness ? 'Soluciones para empresas' : 'Gladys · Lima Metropolitana'}</p>
          <h1 id="event-title">{event.title}</h1>
          <p className="lead">{event.description}</p>
          <div className="actions">
            <a className="button" href="#armar-evento">
              Elegir servicios <span aria-hidden="true">↓</span>
            </a>
            <a className="text-link" href="#cotizar-evento">
              Cotizar esta ocasión
            </a>
          </div>
          <p>{event.body}</p>
          <p className="event-coverage">Atendemos todo Lima Metropolitana · Precios a consulta</p>
        </div>
        <figure className="event-hero-photo">
          <Photo asset={event.image} priority sizes="(max-width: 960px) 100vw, 52vw" />
          <figcaption>{isBusiness ? 'Servicios ajustados al programa y al lugar.' : 'Una propuesta que ajustamos contigo.'}</figcaption>
        </figure>
      </section>

      <section className="event-promise wrap" aria-label="Cómo te ayudamos">
        {event.details.map((detail, index) => (
          <article key={detail}>
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      {advice && (
        <section className="event-planning-note wrap" aria-labelledby="event-planning-title">
          <div>
            <p className="section-kicker">Antes de elegir servicios</p>
            <h2 id="event-planning-title">{advice.title}</h2>
            <p>{advice.body}</p>
          </div>
          <ul>{advice.checks.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      <section className="event-service-intent wrap" aria-labelledby="event-services-title">
        <div>
          <p className="section-kicker">Opciones para esta ocasión</p>
          <h2 id="event-services-title">
            {isBusiness ? 'Recursos que puedes coordinar.' : 'Una combinación que puedes adaptar.'}
          </h2>
          <p>
            Puedes contratar cualquiera de estos servicios por separado o reunir varios en una sola consulta. La selección inicial es una ayuda, no un paquete obligatorio.
          </p>
        </div>
        <ul>
          {suggested.map((service) => (
            <li key={service.id}>
              <Link href={`/${service.kind}/${service.slug}`}>{service.title}<span aria-hidden="true">↗</span></Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="event-builder" id="armar-evento">
        <ServiceExplorer
          entries={services}
          featuredIds={featuredIds}
          title="Elige los servicios para esta ocasión."
          intro="Puedes pedir solo comida, solo un servicio complementario o combinar varios. Añádelos aquí y revisa las cantidades antes de escribirnos."
          quoteHref="#cotizar-evento"
          occasion={event.title}
        />
      </div>

      <section className="event-inline-quote wrap" id="cotizar-evento" aria-labelledby="quote-event-title">
        <div className="event-inline-heading">
          <p className="section-kicker">Tu consulta, lista para conversar</p>
          <h2 id="quote-event-title">Revisa y cotiza sin salir de aquí.</h2>
          <p>
            Completa lo esencial. La web preparará el mensaje y tú decides si lo
            envías por WhatsApp.
          </p>
        </div>
        <Quote site={quoteSite} selection="" occasion={event.title} />
      </section>

      {event.faqItems.length > 0 && (
        <section className="event-faq wrap" aria-labelledby="event-faq-title">
          <div>
            <p className="section-kicker">Antes de cotizar</p>
            <h2 id="event-faq-title">Lo que quizá quieras saber</h2>
          </div>
          <div>
            {event.faqItems.map((item) => (
              <details key={item.id}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="other-occasions wrap" aria-labelledby="other-events-title">
        <p className="section-kicker">También podemos ayudarte con</p>
        <h2 id="other-events-title">{isBusiness ? 'Otros eventos que puedes organizar.' : 'Otras formas de reunir a los tuyos.'}</h2>
        <div>
          {otherOccasions.map((occasion) => (
            <Link href={occasion.href} key={occasion.href}>{occasion.title}<span>↗</span></Link>
          ))}
        </div>
      </section>

      {selectedCount > 0 && (
        <a className="event-selection-dock" href="#cotizar-evento">
          <span><strong>{selectedCount}</strong> {selectedCount === 1 ? 'servicio elegido' : 'servicios elegidos'}</span>
          <b>Revisar y cotizar <span aria-hidden="true">↑</span></b>
        </a>
      )}
    </>
  );
}
