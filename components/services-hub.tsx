import Link from 'next/link';
import type { ContentEntry, SiteContent } from '@/models/content';
import { JsonLd, publicEntries } from '@/components/public';
import { QuoteCta } from '@/components/quote-cta';
import { breadcrumbsData } from '@/lib/seo';

type ServiceFamily = {
  id: string;
  title: string;
  description: string;
  hub?: { href: string; label: string };
  matches: (entry: ContentEntry) => boolean;
};

const byId = (ids: string[]) => new Set(ids);
const foodIds = byId([
  'cocina-para-eventos',
  'buffet-para-eventos',
  'menu-criollo-eventos',
  'desayuno-corporativo',
]);
const barIds = byId(['bar-bartender', 'bebidas-barra-eventos']);
const staffIds = byId(['mozos-evento', 'maestro-ceremonias']);
const rentalIds = byId(['menaje-evento', 'sillas-evento']);
const decorationIds = byId(['arreglos-florales']);
const personalizedIds = byId(['recuerdos-evento', 'polos-estampados']);

export const serviceFamilies: readonly ServiceFamily[] = [
  {
    id: 'cocina',
    title: 'Cocina y alimentación',
    description: 'Buffet, menú criollo, desayunos, coffee break y propuestas de comida para celebraciones o empresas.',
    hub: { href: '/servicios/cocina-para-eventos-lima', label: 'Ver opciones de cocina' },
    matches: (entry) => foodIds.has(entry.id) || entry.category === 'Comida',
  },
  {
    id: 'bar',
    title: 'Bar y bebidas',
    description: 'Bartender, barra móvil, cócteles, mocktails y bebidas según el formato de tu evento.',
    matches: (entry) => barIds.has(entry.id) || entry.category === 'Bar',
  },
  {
    id: 'personal',
    title: 'Personal para eventos',
    description: 'Mozos y conducción para atender, acompañar y ordenar los momentos principales del evento.',
    matches: (entry) => staffIds.has(entry.id) || entry.category === 'Personal',
  },
  {
    id: 'alquileres',
    title: 'Alquileres',
    description: 'Menaje, sillas, mesas, toldos, mantelería y mobiliario según cantidades, espacio y acceso.',
    hub: { href: '/alquiler', label: 'Explorar alquileres' },
    matches: (entry) => rentalIds.has(entry.id) || entry.category === 'Alquileres',
  },
  {
    id: 'entretenimiento',
    title: 'Entretenimiento',
    description: 'DJ, música en vivo, animación, hora loca, karaoke y actividades para públicos de distintas edades.',
    hub: { href: '/entretenimiento', label: 'Explorar entretenimiento' },
    matches: (entry) => entry.category === 'Música' || entry.category === 'Entretenimiento',
  },
  {
    id: 'produccion',
    title: 'Producción',
    description: 'Sonido, iluminación, pantallas, escenarios y streaming coordinados con el programa y el espacio.',
    hub: { href: '/produccion', label: 'Explorar producción' },
    matches: (entry) => entry.category === 'Producción' || entry.category === 'Sonido e iluminación',
  },
  {
    id: 'decoracion',
    title: 'Decoración',
    description: 'Ambientación, arreglos florales, candy bar y mesas de postres para los puntos más visibles.',
    hub: { href: '/decoracion', label: 'Explorar decoración' },
    matches: (entry) => decorationIds.has(entry.id) || entry.category === 'Decoración',
  },
  {
    id: 'foto-video',
    title: 'Fotografía y video',
    description: 'Cobertura fotográfica, video, cabina y experiencia 360 para conservar y compartir el evento.',
    hub: { href: '/foto-video', label: 'Explorar fotografía y video' },
    matches: (entry) => entry.category === 'Fotografía y video',
  },
  {
    id: 'personalizados',
    title: 'Personalizados',
    description: 'Recuerdos, polos, tazas, tomatodos, cuadros, llaveros, papelería y kits para invitados o equipos.',
    hub: { href: '/personalizados', label: 'Explorar personalizados' },
    matches: (entry) => personalizedIds.has(entry.id) || entry.category === 'Personalizados',
  },
] as const;

export function ServicesHub({ site }: { site: SiteContent }) {
  const entries = publicEntries(site).filter(
    (entry) => entry.kind === 'servicios' || entry.id === 'menu-criollo-eventos',
  );
  const families = serviceFamilies.map((family) => ({
    ...family,
    entries: entries.filter(family.matches),
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbsData(site, [
          { name: 'Inicio', path: '/' },
          { name: 'Servicios para eventos en Lima', path: '/servicios' },
        ])}
      />
      <section className="section wrap services-hub">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <span aria-current="page">Servicios</span>
        </nav>
        <div className="services-hub-intro">
          <div>
            <p className="eyebrow">Todo lo que puede necesitar tu evento</p>
            <h1 className="page-title">Servicios para eventos en Lima</h1>
          </div>
          <div>
            <p className="lead">
              Explora la oferta por familia. Puedes contratar un servicio por separado o combinar varios y preparar una sola consulta por WhatsApp.
            </p>
            <QuoteCta className="button" placement="navigation">
              Cotizar mi evento <span aria-hidden="true">↗</span>
            </QuoteCta>
          </div>
        </div>

        <nav className="service-family-index" aria-label="Familias de servicios">
          {families.map((family, index) => (
            <a href={`#${family.id}`} key={family.id}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {family.title}
            </a>
          ))}
        </nav>

        <div className="service-family-list">
          {families.map((family, index) => (
            <section className="service-family" id={family.id} key={family.id}>
              <header>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{family.title}</h2>
                  <p>{family.description}</p>
                </div>
              </header>
              <ul>
                {family.entries.map((entry) => (
                  <li key={entry.id}>
                    <Link href={`/${entry.kind}/${entry.slug}`}>
                      <span>{entry.title}</span>
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {family.hub && (
                <Link className="text-link service-family-more" href={family.hub.href}>
                  {family.hub.label} →
                </Link>
              )}
            </section>
          ))}
        </div>

        <section className="services-hub-close">
          <div>
            <p className="eyebrow">Una sola conversación</p>
            <h2>Elige lo esencial y añade el resto cuando lo necesites.</h2>
          </div>
          <p>
            Si combinas servicios de distintos equipos, Gladys mantiene tu selección en una sola consulta y coordina contigo los datos que falten.
          </p>
          <QuoteCta className="button" placement="navigation">Preparar mi cotización</QuoteCta>
        </section>
      </section>
    </>
  );
}
