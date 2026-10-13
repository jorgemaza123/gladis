import Link from 'next/link';
import { readSite } from '@/repositories/site';
import { Shell, JsonLd } from '@/components/public';
import { guides } from '@/data/guides';
import { breadcrumbsData, metadataFor } from '@/lib/seo';

const seo = {
  title: 'Guías para organizar eventos en Lima | Gladys',
  description:
    'Guías prácticas sobre organización, catering, cantidades, alquileres, celebraciones, entretenimiento y eventos de empresa en Lima.',
  noindex: false,
};

export async function generateMetadata() {
  const site = await readSite();
  return metadataFor(site, seo, '/guias');
}

export default async function GuidesPage() {
  const site = await readSite();
  return (
    <Shell site={site}>
      <JsonLd
        data={breadcrumbsData(site, [
          { name: 'Inicio', path: '/' },
          { name: 'Guías', path: '/guias' },
        ])}
      />
      <section className="section wrap">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link>
          <span>/</span>
          <span aria-current="page">Guías</span>
        </nav>
        <p className="eyebrow">Información para decidir</p>
        <h1 className="page-title">Guías para organizar tu evento</h1>
        <p className="lead catalog-lead">
          Resuelve dudas antes de elegir servicios o preparar tu consulta.
        </p>
        <div className="cards">
          {guides.map((guide) => (
            <article className="entry-card" key={guide.slug}>
              <p className="eyebrow">{guide.category}</p>
              <h2><Link href={`/guias/${guide.slug}`}>{guide.title}</Link></h2>
              <p>{guide.description}</p>
              <Link className="text-link" href={`/guias/${guide.slug}`}>
                Leer guía →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}
