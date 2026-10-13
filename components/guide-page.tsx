import Link from 'next/link';
import type { Guide } from '@/data/guides';
import type { SiteContent } from '@/models/content';
import { JsonLd } from '@/components/public';
import { absoluteUrl, breadcrumbsData } from '@/lib/seo';
import { QuoteCta } from '@/components/quote-cta';

export function GuidePage({ site, guide }: { site: SiteContent; guide: Guide }) {
  const url = absoluteUrl(site, `/guias/${guide.slug}`);
  const article = url
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        mainEntityOfPage: url,
        author: { '@id': absoluteUrl(site, '/#business') },
        publisher: { '@id': absoluteUrl(site, '/#business') },
      }
    : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbsData(site, [
            { name: 'Inicio', path: '/' },
            { name: 'Guías', path: '/guias' },
            { name: guide.title, path: `/guias/${guide.slug}` },
          ]),
          article,
        ].filter(Boolean)}
      />
      <article className="section wrap">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <Link href="/guias">Guías</Link>
          <span>/</span>
          <span aria-current="page">{guide.title}</span>
        </nav>
        <p className="eyebrow">{guide.category}</p>
        <h1 className="page-title">{guide.title}</h1>
        <p className="lead catalog-lead">{guide.description}</p>
        {guide.sections.map((section) => (
          <section className="detail-process" key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p className="prose" key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && (
              <ul className="included">
                {section.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
        <section className="detail-process" aria-labelledby="guide-next-step">
          <h2 id="guide-next-step">Siguiente paso</h2>
          <div className="actions">
            <QuoteCta className="button" placement="navigation">
              Preparar mi consulta <span aria-hidden="true">↗</span>
            </QuoteCta>
            {guide.relatedLinks.map((link) => (
              <Link className="text-link" href={link.href} key={link.href}>
                {link.label} →
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
