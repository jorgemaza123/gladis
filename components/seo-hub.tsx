import Link from 'next/link';
import type { SiteContent } from '@/models/content';
import type { SeoHubConfig } from '@/data/seo-hubs';
import {
  EntryCards,
  JsonLd,
  publicEntries,
} from '@/components/public';
import { breadcrumbsData } from '@/lib/seo';
import { QuoteCta } from '@/components/quote-cta';

export function SeoHub({
  site,
  config,
}: {
  site: SiteContent;
  config: SeoHubConfig;
}) {
  const entries = publicEntries(site).filter((entry) =>
    config.entryIds.includes(entry.id),
  );

  return (
    <>
      <JsonLd
        data={breadcrumbsData(site, [
          { name: 'Inicio', path: '/' },
          { name: config.title, path: config.path },
        ])}
      />
      <section className="section wrap">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <span aria-current="page">{config.title}</span>
        </nav>
        <p className="eyebrow">{config.eyebrow}</p>
        <h1 className="page-title">{config.title}</h1>
        <p className="lead catalog-lead">{config.description}</p>
        <div className="actions">
          <QuoteCta className="button" placement="navigation">
            Preparar mi consulta <span aria-hidden="true">↗</span>
          </QuoteCta>
          <Link className="text-link" href={config.secondaryLink?.href || '/eventos'}>
            {config.secondaryLink?.label || 'Explorar ocasiones'} →
          </Link>
        </div>
        <div className="hub-context">
          <section>
            <p className="eyebrow">Para quién es</p>
            <h2>Una búsqueda más fácil de aterrizar.</h2>
            <p>{config.audience}</p>
          </section>
          <section>
            <p className="eyebrow">Cómo empezar</p>
            <h2>Primero, aclara lo esencial.</h2>
            <p>{config.decisionIntro}</p>
          </section>
        </div>
        <div className="section-heading">
          <div>
            <p className="eyebrow">Opciones disponibles</p>
            <h2>Elige solo lo que necesitas.</h2>
          </div>
        </div>
        <EntryCards site={site} entries={entries} />
        <section className="hub-decisions" aria-labelledby="hub-decision-title">
          <div>
            <p className="eyebrow">Antes de elegir</p>
            <h2 id="hub-decision-title">Qué conviene revisar</h2>
          </div>
          <ol>
            {config.choiceTips.map((tip, index) => (
              <li key={tip.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{tip.title}</h3><p>{tip.description}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <nav className="hub-related" aria-label="Contenido relacionado">
          <p className="eyebrow">También puede ayudarte</p>
          <div>
            {config.relatedLinks.map((link) => (
              <Link href={link.href} key={link.href}>{link.label} <span aria-hidden="true">→</span></Link>
            ))}
          </div>
        </nav>
      </section>
    </>
  );
}
