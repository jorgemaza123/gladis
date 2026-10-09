import Link from 'next/link';
import type {
  SiteContent,
  ContentEntry,
  PageSection,
  ContentKind,
} from '@/models/content';
import { contentKinds } from '@/models/content';
import { Photo } from './photo';
import { Motion } from './motion';
import {
  QuoteCartDialog,
  type QuoteCartDialogEntry,
} from './quote-cart-dialog';
import { QuoteCta } from './quote-cta';
import type { RecommendationEntry } from './service-recommendations';
import { resolveBusinessContact, resolveWhatsAppDestination } from '@/lib/business-contacts';
import { EventLanding } from './event-landing';
import { ServiceExplorer } from './service-explorer';
import { explorerServices, quoteSiteFor } from '@/lib/public-services';
export const publicEntries = (site: SiteContent) =>
  site.entries
    .filter(
      (e) =>
        e.status === 'published' &&
        (!(e.kind === 'testimonios' || e.kind === 'eventos') || e.verified),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);

function publicNavigation(site: SiteContent) {
  const entries = publicEntries(site);
  return site.settings.navigation.filter(({ href }) => {
    if (
      href === '/' ||
      href === '/#como-cotizar' ||
      href === '/cotizar' ||
      href === '/privacidad'
    )
      return true;
    const parts = href.split('/').filter(Boolean);
    const kind = parts[0] as ContentKind | undefined;
    if (!kind || !contentKinds.includes(kind)) return false;
    return parts[1]
      ? entries.some((entry) => entry.kind === kind && entry.slug === parts[1])
      : entries.some((entry) => entry.kind === kind);
  });
}

function CatalogNavigation({ site }: { site: SiteContent }) {
  const entries = publicEntries(site);
  const kinds = contentKinds.filter((kind) =>
    entries.some((entry) => entry.kind === kind),
  );
  if (!kinds.length) return null;
  return (
    <nav className="catalog-navigation wrap" aria-label="Explorar propuestas">
      <p className="eyebrow">Explora</p>
      <div>
        <h2>¿Por dónde quieres empezar?</h2>
        <ul>
          {kinds.map((kind) => (
            <li key={kind}>
              <Link href={`/${kind}`}>
                <span>{site.settings.catalogs[kind].title}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
export function JsonLd({ data }: { data: unknown }) {
  return data ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  ) : null;
}
export function Shell({
  site,
  children,
}: {
  site: SiteContent;
  children: React.ReactNode;
}) {
  const s = site.settings,
    c = s.copy;
  const logoAsset = site.media.find((media) => media.id === s.logoId);
  const motionEnabled = s.animations && s.motionLevel !== 'off';
  const navigation = publicNavigation(site);
  const quoteEntryIds = site.entries
    .filter(
      (entry) =>
        entry.status === 'published' &&
        entry.requestable &&
        entry.ownerId !== null &&
        entry.quoteConfig !== null,
    )
    .map((entry) => entry.id);
  const quoteCartEntries: QuoteCartDialogEntry[] = site.entries
    .filter((entry) => quoteEntryIds.includes(entry.id))
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      quoteConfig: entry.quoteConfig!,
      recipient: resolveBusinessContact(entry.ownerId),
      whatsappDestination: resolveWhatsAppDestination(entry.ownerId),
    }));
  const recommendationEntries: RecommendationEntry[] = publicEntries(site).map(
    (entry) => ({
      id: entry.id,
      kind: entry.kind,
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      status: entry.status,
      sortOrder: entry.sortOrder,
      imageId: entry.imageId,
      requestable: entry.requestable,
      ownerId: entry.ownerId,
      quoteConfig: entry.quoteConfig,
      recommendations: entry.recommendations,
      image: site.media.find((media) => media.id === entry.imageId),
    }),
  );
  return (
    <div
      className={`public-site palette-${s.palette} typography-${s.typography}`}
      data-motion={motionEnabled ? 'on' : 'off'}
    >
      <Motion enabled={motionEnabled} />
      <Link className="skip" href="#contenido">
        Saltar al contenido
      </Link>
      {s.demo && <div className="demo-bar">{c.demoNotice}</div>}
      <header className="header">
        <Link className="brand" href="/">
          {logoAsset ? (
            <span className="brand-logo brand-logo-symbol" aria-hidden="true">
              <Photo asset={logoAsset} />
            </span>
          ) : (
            <span className="brand-mark" aria-hidden="true">
              ✳
            </span>
          )}
          <span>
            {s.name}
            <small>{s.tagline}</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {navigation.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <QuoteCta className="button small header-quote-cta" placement="navigation">
          Cotizar mi evento
        </QuoteCta>
        <QuoteCartDialog
          entries={quoteCartEntries}
          recommendationEntries={recommendationEntries}
          motionEnabled={motionEnabled}
        />
        <details className="mobile-menu">
          <summary aria-label="Menú principal">
            <svg
              aria-hidden="true"
              focusable="false"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </summary>
          <nav aria-label="Navegación móvil">
            {navigation.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
            <QuoteCta className="button mobile-nav-cta" placement="navigation">
              Cotizar mi evento
            </QuoteCta>
          </nav>
        </details>
      </header>
      <main id="contenido">{children}</main>
      <footer>
        <div className="footer-grid">
          <div>
            {logoAsset ? (
              <div className="footer-brand-logo"><Photo asset={logoAsset} /></div>
            ) : (
              <div className="brand">{s.name}</div>
            )}
            <p>{s.footer}</p>
            <p>Precios y disponibilidad a consulta por WhatsApp. Atendemos en Lima Metropolitana.</p>
            {s.businessVerified && s.publicAddress && <p>{s.publicAddress}</p>}
            {s.businessVerified && s.hours && <p>{s.hours}</p>}
          </div>
          <nav aria-label="Celebraciones">
            <h2>Celebraciones</h2>
            {['cumpleanos', 'graduaciones', 'boda', 'bautizos-comuniones', 'reuniones-familiares']
              .flatMap((id) => publicEntries(site).filter((entry) => entry.id === id))
              .map((entry) => (
                <Link key={entry.id} href={'/' + entry.kind + '/' + entry.slug}>
                  {entry.title}
                </Link>
              ))}
            <Link href="/tipos-evento">Todas las ocasiones</Link>
          </nav>
          <nav aria-label="Empresas">
            <h2>Empresas</h2>
            {['fin-ano-empresas', 'desayunos-corporativos', 'corporativo']
              .flatMap((id) => publicEntries(site).filter((entry) => entry.id === id))
              .map((entry) => (
                <Link key={entry.id} href={'/' + entry.kind + '/' + entry.slug}>
                  {entry.title}
                </Link>
              ))}
          </nav>
          <nav aria-label="Servicios">
            <h2>Servicios</h2>
            <Link href="/servicios/buffet-para-eventos">Buffet para eventos</Link>
            <Link href="/complementos/bar-bartender">Bartender</Link>
            <Link href="/complementos/menaje-evento">Alquiler de menaje</Link>
            <Link href="/complementos/mozos-evento">Mozos</Link>
            <Link href="/complementos">Ver todos los servicios</Link>
          </nav>
          <div className="footer-contact">
            <p>{c.footerHeading}</p>
            {s.email && <Link href={'mailto:' + s.email}>{s.email}</Link>}
            <QuoteCta className="button" placement="footer">Cotizar mi evento</QuoteCta>
            {s.socialLinks.map((link) => (
              <Link key={link.url} href={link.url} rel="noopener noreferrer">
                {link.label} ↗
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>{s.tagline}</span>
          <Link href="/privacidad">Privacidad</Link>
        </div>      </footer>
    </div>
  );
}
export function EntryPrice({ entry: e }: { entry: ContentEntry }) {
  return (
    <div className="price-block">
      {e.price.mode !== 'consult' && e.price.amount !== null && (
        <p className="price">
          {e.price.mode === 'from' ? 'Desde ' : ''}
          {new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: e.price.currency,
          }).format(e.price.amount)}{' '}
          <small>
            /{' '}
            {
              { person: 'persona', event: 'evento', unit: 'unidad' }[
                e.price.unit
              ]
            }
          </small>
        </p>
      )}
      {(e.minimumGuests || e.price.minimum) && (
        <p>
          Mínimo: {e.minimumGuests || e.price.minimum}{' '}
          {e.minimumGuests
            ? 'personas'
            : e.price.unit === 'person'
              ? 'personas'
              : 'unidades'}
        </p>
      )}
      {e.price.conditions && <p>{e.price.conditions}</p>}
    </div>
  );
}
export function EntryCards({
  site,
  entries,
}: {
  site: SiteContent;
  entries: ContentEntry[];
}) {
  return (
    <div className="cards">
      {entries.map((e) => (
        <article className="entry-card" key={e.id} data-reveal>
          <Link
            href={`/${e.kind}/${e.slug}`}
            className="image-link"
            aria-label={e.title}
          >
            <Photo
              asset={site.media.find((m) => m.id === e.imageId)}
              sizes="(max-width: 760px) 100vw, 33vw"
            />
          </Link>
          <div className="card-top">
            <span className="eyebrow">
              {e.category || site.settings.catalogs[e.kind].title}
            </span>
            <Link aria-label={`Ver ${e.title}`} href={`/${e.kind}/${e.slug}`}>
              ↗
            </Link>
          </div>
          <h3>
            <Link href={`/${e.kind}/${e.slug}`}>{e.title}</Link>
          </h3>
          <p>{e.description}</p>
          <EntryPrice entry={e} />
          {e.requestable && e.ownerId !== null && e.quoteConfig && (
            <QuoteCta
              className="text-link"
              entryId={e.id}
              placement="catalog_card"
            >
              {site.settings.copy.inquire} →
            </QuoteCta>
          )}
          {e.dietaryConfirmed && e.dietary.length > 0 && (
            <div className="chips">
              {e.dietary.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
function Heading({ s }: { s: PageSection }) {
  return (
    <div>
      {s.eyebrow && <p className="eyebrow">{s.eyebrow}</p>}
      <h2>{s.title}</h2>
      {s.description && <p>{s.description}</p>}
    </div>
  );
}
function Hero({
  site,
  section: s,
}: {
  site: SiteContent;
  section: PageSection;
}) {
  const c = site.settings.copy;
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">
          {s.eyebrow || site.settings.tagline}
          {c.location && <span> — {c.location}</span>}
        </p>
        <h1>{s.title}</h1>
        <p className="lead">{s.description}</p>
        <div className="actions">
          <QuoteCta
            className="button"
            placement="hero"
            href={s.primaryHref || '/cotizar'}
          >
            {s.primaryLabel || c.primaryCta} ↗
          </QuoteCta>
          <Link className="text-link" href={s.secondaryHref || '/menus'}>
            {s.secondaryLabel || c.secondaryCta} →
          </Link>
        </div>
      </div>
      <div className="hero-picture">
        <Photo asset={site.media.find((m) => m.id === s.imageId)} priority />
        <div className="picture-label">{site.settings.tagline}</div>
      </div>
      {site.settings.footer && (
        <div className="hero-note">
          <span aria-hidden="true">✳</span>
          {site.settings.footer}
        </div>
      )}
    </section>
  );
}
function Catalog({
  site,
  section: s,
}: {
  site: SiteContent;
  section: PageSection;
}) {
  const entries = publicEntries(site).filter(
    (e) =>
      e.kind === s.type &&
      (s.entryIds?.length ? s.entryIds.includes(e.id) : e.featured),
  );
  if (!entries.length) return null;
  return (
    <section
      className={`section wrap ${s.variant === 'alternate' ? 'block-alternate' : ''}`}
      data-reveal
    >
      <div className="section-heading">
        <Heading s={s} />
        <Link className="text-link" href={`/${s.type}`}>
          {site.settings.copy.viewAll} →
        </Link>
      </div>
      <EntryCards site={site} entries={entries} />
    </section>
  );
}
function TextImage({
  site,
  section: s,
}: {
  site: SiteContent;
  section: PageSection;
}) {
  return (
    <section className={`story ${s.imageId ? '' : 'text-only'}`} data-reveal>
      {s.imageId && (
        <Photo asset={site.media.find((m) => m.id === s.imageId)} />
      )}
      <div>
        <Heading s={s} />
        {s.primaryLabel && (
          <QuoteCta
            className="text-link"
            placement="navigation"
            href={s.primaryHref || '/cotizar'}
          >
            {s.primaryLabel} ↗
          </QuoteCta>
        )}
      </div>
    </section>
  );
}
function Faq({
  site,
  section: s,
}: {
  site: SiteContent;
  section: PageSection;
}) {
  if (!site.faqs.length) return null;
  return (
    <section className="section wrap faq" data-reveal>
      <Heading s={s} />
      <div>
        {site.faqs.map((f) => (
          <details key={f.id}>
            <summary>{f.question}</summary>
            <p>{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
function Cta({
  site,
  section: s,
}: {
  site: SiteContent;
  section: PageSection;
}) {
  return (
    <section className="cta" data-reveal>
      <span aria-hidden="true">✳</span>
      <Heading s={s} />
      <QuoteCta
        className="button light"
        placement="hero"
        href={s.primaryHref || '/cotizar'}
      >
        {s.primaryLabel || site.settings.copy.primaryCta} ↗
      </QuoteCta>
    </section>
  );
}
export function Gallery({
  site,
  ids,
  title,
}: {
  site: SiteContent;
  ids: string[];
  title?: string;
}) {
  const media = ids
    .map((id) => site.media.find((m) => m.id === id))
    .filter((m) => !!m);
  if (!media.length) return null;
  return (
    <div className="gallery-section">
      {title && <h2>{title}</h2>}
      <div className="gallery-grid">
        {media.map((m) => (
          <figure key={m.id} data-reveal>
            <Link href={m.url} aria-label={`Ampliar: ${m.alt}`}>
              <Photo asset={m} />
            </Link>
            {m.caption && <figcaption>{m.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}
function GalleryBlock({
  site,
  section: s,
}: {
  site: SiteContent;
  section: PageSection;
}) {
  if (!s.imageIds?.length) return null;
  return (
    <section className="section wrap">
      <div className="section-heading">
        <Heading s={s} />
      </div>
      <Gallery site={site} ids={s.imageIds} />
    </section>
  );
}
function Steps({ section: s }: { site: SiteContent; section: PageSection }) {
  if (!s.steps?.length) return null;
  return (
    <section className="section wrap" data-reveal>
      <div className="section-heading">
        <Heading s={s} />
      </div>
      <ol className="steps-grid">
        {s.steps.map((step, i) => (
          <li key={i}>
            <span className="step-number">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
function Testimonials({
  site,
  section: s,
}: {
  site: SiteContent;
  section: PageSection;
}) {
  const entries = publicEntries(site).filter(
    (e) =>
      e.kind === 'testimonios' &&
      (!s.entryIds?.length || s.entryIds.includes(e.id)),
  );
  if (!entries.length) return null;
  return (
    <section className="section wrap" data-reveal>
      <div className="section-heading">
        <Heading s={s} />
      </div>
      <div className="testimonial-grid">
        {entries.map((e) => (
          <figure key={e.id}>
            <blockquote>
              <p>{e.body || e.description}</p>
            </blockquote>
            <figcaption>{e.attribution || e.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
export function Sections({ site }: { site: SiteContent }) {
  const visibleSections = site.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const hero = visibleSections.find((section) => section.type === 'hero');
  const remaining = visibleSections.filter((section) => section !== hero);
  return (
    <>
      {hero && <Hero site={site} section={hero} />}
      {hero && <CatalogNavigation site={site} />}
      {remaining.map((section) => {
        const Block =
          section.type === 'texto'
            ? TextImage
            : section.type === 'faq'
              ? Faq
              : section.type === 'cta'
                ? Cta
                : section.type === 'galeria'
                  ? GalleryBlock
                  : section.type === 'pasos'
                    ? Steps
                    : section.type === 'testimonios'
                      ? Testimonials
                      : contentKinds.includes(section.type as ContentKind)
                        ? Catalog
                        : null;
        return Block ? (
          <Block key={section.id} site={site} section={section} />
        ) : null;
      })}
    </>
  );
}
export function EntryDetail({
  site,
  entry: e,
}: {
  site: SiteContent;
  entry: ContentEntry;
}) {
  const c = site.settings.copy;
  if (e.kind === 'tipos-evento') {
    const featuredByOccasion: Record<string, string[]> = {
      cumpleanos: ['buffet-para-eventos', 'menu-criollo-eventos', 'mozos-evento'],
      graduaciones: ['buffet-para-eventos', 'mozos-evento', 'recuerdos-evento'],
      'fin-ano-empresas': ['buffet-para-eventos', 'desayuno-corporativo', 'mozos-evento'],
      'bautizos-comuniones': ['buffet-para-eventos', 'menaje-evento', 'recuerdos-evento'],
      boda: ['buffet-para-eventos', 'mozos-evento', 'arreglos-florales'],
      'reuniones-familiares': ['buffet-para-eventos', 'menu-criollo-eventos', 'menaje-evento'],
      'desayunos-corporativos': ['desayuno-corporativo', 'menaje-evento', 'mozos-evento'],
      corporativo: ['buffet-para-eventos', 'desayuno-corporativo', 'mozos-evento'],
    };
    const services = explorerServices(site);
    const quoteSite = quoteSiteFor(site);
    const otherOccasions = publicEntries(site)
      .filter((item) => item.kind === 'tipos-evento' && item.id !== e.id)
      .slice(0, 4)
      .map((item) => ({
        title: item.title,
        href: `/${item.kind}/${item.slug}`,
      }));
    return (
      <EventLanding
        event={{
          id: e.id,
          title: e.title,
          description: e.description,
          body: e.body,
          details: e.details,
          faqItems: e.faqItems,
          image: site.media.find((media) => media.id === e.imageId),
        }}
        services={services}
        featuredIds={featuredByOccasion[e.id] || e.serviceIds.concat(e.addOnIds)}
        quoteSite={quoteSite}
        otherOccasions={otherOccasions}
      />
    );
  }
  const groups = [
    ['platos', e.dishIds],
    ['menus', e.menuIds],
    ['servicios', e.serviceIds],
    ['modalidades', e.modalityIds],
    ['complementos', e.addOnIds.slice(0, 3)],
  ] as [ContentKind, string[]][];
  return (
    <>
      <section className="section wrap">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href={`/${e.kind}`}>
            {site.settings.catalogs[e.kind].title}
          </Link>
          <span>/</span>
          <span aria-current="page">{e.title}</span>
        </nav>
        <div className="detail-grid">
          <div>
            <p className="eyebrow">
              {e.category || site.settings.catalogs[e.kind].title}
            </p>
            <h1 className="page-title">{e.title}</h1>
            <p className="lead">{e.description}</p>
            <div className="actions">
              <QuoteCta
                className="button"
                entryId={
                  e.requestable && e.ownerId !== null && e.quoteConfig
                    ? e.id
                    : null
                }
                placement="service_detail"
                href="#elegir-servicios"
              >
                {e.requestable ? c.inquire : 'Elegir servicios'} ↗
              </QuoteCta>
            </div>
            <EntryPrice entry={e} />
            {e.body !== e.description && <p className="prose">{e.body}</p>}
            {e.district && <p>{e.district}</p>}
            {e.provider && (
              <p>
                {e.provider === 'partner'
                  ? 'Coordinado con un proveedor aliado'
                  : 'Servicio propio'}
              </p>
            )}
            {e.kind === 'eventos' && e.verified && (
              <p>
                {e.eventDate}
                {e.guestCount ? ` · ${e.guestCount} personas` : ''}
              </p>
            )}
            {e.kind === 'testimonios' && e.verified && <p>{e.attribution}</p>}
            {e.dietaryConfirmed && e.dietary.length > 0 && (
              <div className="chips">
                {e.dietary.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            )}
            {e.processSteps.length > 0 && (
              <section
                className="detail-process"
                aria-labelledby={`proceso-${e.id}`}
              >
                <h2 id={`proceso-${e.id}`}>Cómo coordinamos</h2>
                <ol>
                  {e.processSteps.map((step, index) => (
                    <li key={`${step.title}-${index}`}>
                      <span aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}
            {e.externalCatalog && (
              <QuoteCta
                addToCart={false}
                className="text-link"
                entryId={e.id}
                placement="external_catalog"
                href={e.externalCatalog.url}
                rel="noreferrer"
                target="_blank"
              >
                {e.externalCatalog.label} ↗
              </QuoteCta>
            )}
          </div>
          <Photo asset={site.media.find((m) => m.id === e.imageId)} priority />
        </div>
        {(e.details.length > 0 || e.excluded.length > 0) && (
          <div className="inclusion-grid">
            {e.details.length > 0 && (
              <div>
                <h2>{c.includedTitle}</h2>
                <ul className="included">
                  {e.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
            {e.excluded.length > 0 && (
              <div>
                <h2>{c.excludedTitle}</h2>
                <ul className="excluded">
                  {e.excluded.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <Gallery
          site={site}
          ids={e.imageIds.filter((id) => id !== e.imageId)}
          title={c.galleryTitle}
        />
        {e.faqItems.length > 0 && (
          <section className="detail-faq" aria-labelledby={`faq-${e.id}`}>
            <h2 id={`faq-${e.id}`}>Lo que quizá quieras saber</h2>
            {e.faqItems.map((item) => (
              <details key={item.id}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </section>
        )}
      </section>
      <ServiceExplorer
          entries={explorerServices(site)}
          featuredIds={e.recommendations.map((recommendation) => recommendation.entryId).concat(e.addOnIds)}
          featuredReasons={Object.fromEntries(e.recommendations.map((recommendation) => [recommendation.entryId, recommendation.reason]))}
          currentId={e.requestable ? e.id : undefined}
          anchorId="elegir-servicios"
          title={e.requestable ? "Elige este servicio y lo que quieras añadir." : "Elige los servicios para tu evento."}
          intro={e.requestable ? "Añade este servicio como principal o combina otros. Todo quedará en una sola consulta." : "Puedes contratar un servicio o combinar varios. Revisa las opciones y cotiza aquí mismo."}
          quoteSite={quoteSiteFor(site)}
        />
      {groups.map(([kind, ids]) => {
        const entries = publicEntries(site).filter(
          (item) => ids.includes(item.id) && item.id !== e.id,
        );
        return entries.length ? (
          <section key={kind} className="section wrap">
            <div className="section-heading">
              <h2>{site.settings.catalogs[kind].title}</h2>
            </div>
            <EntryCards site={site} entries={entries} />
          </section>
        ) : null;
      })}

    </>
  );
}
