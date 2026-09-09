import type {
  SiteContent,
  ContentEntry,
  PageSection,
  ContentKind,
} from '@/models/content';
import { contentKinds } from '@/models/content';
import { Photo } from './photo';
import { Motion } from './motion';
export const publicEntries = (site: SiteContent) =>
  site.entries
    .filter(
      (e) =>
        e.status === 'published' &&
        (!(e.kind === 'testimonios' || e.kind === 'eventos') || e.verified),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
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
  return (
    <div
      className={`public-site palette-${s.palette} typography-${s.typography}`}
      data-motion={s.animations && s.motionLevel !== 'off' ? 'on' : 'off'}
    >
      <Motion enabled={s.animations && s.motionLevel !== 'off'} />
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      {s.demo && <div className="demo-bar">{c.demoNotice}</div>}
      <header className="header">
        <a className="brand" href="/">
          {s.logoId ? (
            <span className="brand-logo">
              <Photo asset={site.media.find((m) => m.id === s.logoId)} />
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
        </a>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {s.navigation.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a className="button small" href="/cotizar">
          {c.primaryCta}
          <span aria-hidden="true">↗</span>
        </a>
        <details className="mobile-menu">
          <summary aria-label="Abrir navegación">☰</summary>
          <nav aria-label="Navegación móvil">
            {s.navigation.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </details>
      </header>
      <main id="contenido">{children}</main>
      <footer>
        <div className="footer-grid">
          <div>
            <div className="brand">{s.name}</div>
            <p>{s.footer}</p>
            {s.businessVerified && s.publicAddress && <p>{s.publicAddress}</p>}
            {s.businessVerified && s.hours && <p>{s.hours}</p>}
          </div>
          <nav aria-label="Pie de página">
            {s.navigation.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <div>
            <p>{c.footerHeading}</p>
            {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
            {s.whatsapp && (
              <a
                href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(s.whatsappMessage)}`}
              >
                WhatsApp ↗
              </a>
            )}
            <a href="/cotizar">{c.primaryCta} ↗</a>
            {s.socialLinks.map((l) => (
              <a key={l.url} href={l.url} rel="noopener noreferrer">
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>{s.tagline}</span>
          <a href="/privacidad">Privacidad</a>
          <a href="/admin">Administración</a>
        </div>
      </footer>
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
          <a
            href={`/${e.kind}/${e.slug}`}
            className="image-link"
            aria-label={e.title}
          >
            <Photo
              asset={site.media.find((m) => m.id === e.imageId)}
              sizes="(max-width: 760px) 100vw, 33vw"
            />
          </a>
          <div className="card-top">
            <span className="eyebrow">
              {e.category || site.settings.catalogs[e.kind].title}
            </span>
            <a aria-label={`Ver ${e.title}`} href={`/${e.kind}/${e.slug}`}>
              ↗
            </a>
          </div>
          <h3>
            <a href={`/${e.kind}/${e.slug}`}>{e.title}</a>
          </h3>
          <p>{e.description}</p>
          <EntryPrice entry={e} />
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
          <a className="button" href={s.primaryHref || '/cotizar'}>
            {s.primaryLabel || c.primaryCta} ↗
          </a>
          <a className="text-link" href={s.secondaryHref || '/menus'}>
            {s.secondaryLabel || c.secondaryCta} →
          </a>
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
        <a className="text-link" href={`/${s.type}`}>
          {site.settings.copy.viewAll} →
        </a>
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
          <a className="text-link" href={s.primaryHref || '/cotizar'}>
            {s.primaryLabel} ↗
          </a>
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
      <a className="button light" href={s.primaryHref || '/cotizar'}>
        {s.primaryLabel || site.settings.copy.primaryCta} ↗
      </a>
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
            <a href={m.url} aria-label={`Ampliar: ${m.alt}`}>
              <Photo asset={m} />
            </a>
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
  return (
    <>
      {site.sections
        .filter((s) => s.visible)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((section) => {
          const Block =
            section.type === 'hero'
              ? Hero
              : section.type === 'texto'
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
  const groups = [
    ['platos', e.dishIds],
    ['menus', e.menuIds],
    ['servicios', e.serviceIds],
    ['modalidades', e.modalityIds],
    ['complementos', e.addOnIds],
    ['tipos-evento', e.eventTypeIds],
  ] as [ContentKind, string[]][];
  return (
    <>
      <section className="section wrap">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <a href="/">Inicio</a>
          <span>/</span>
          <a href={`/${e.kind}`}>{site.settings.catalogs[e.kind].title}</a>
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
            <div className="actions">
              <a
                className="button"
                href={`/cotizar?seleccion=${encodeURIComponent(e.id)}`}
              >
                {c.inquire} ↗
              </a>
            </div>
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
      </section>
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
