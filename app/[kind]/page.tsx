import { notFound, permanentRedirect } from 'next/navigation';
import { readSite } from '@/repositories/site';
import { Shell, EntryCards, publicEntries, JsonLd } from '@/components/public';
import { metadataFor, breadcrumbsData, catalogUrlPolicy } from '@/lib/seo';
import { contentKinds, type ContentKind } from '@/models/content';
type Props = {
  params: Promise<{ kind: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const scalar = (value: string | string[] | undefined) =>
  typeof value === 'string' ? value : '';
export async function generateMetadata({ params, searchParams }: Props) {
  const { kind } = await params;
  if (!contentKinds.includes(kind as ContentKind)) notFound();
  const site = await readSite(),
    c = site.settings.catalogs[kind as ContentKind],
    q = await searchParams,
    policy = catalogUrlPolicy(kind, q);
  return metadataFor(
    site,
    {
      ...c.seo,
      title: c.seo.title || `${c.title} | ${site.settings.name}`,
      description: c.seo.description || c.description,
      noindex: c.seo.noindex || policy.noindex,
    },
    policy.canonicalPath,
  );
}
export default async function Listing({ params, searchParams }: Props) {
  const { kind } = await params;
  if (!contentKinds.includes(kind as ContentKind)) notFound();
  const site = await readSite(),
    c = site.settings.catalogs[kind as ContentKind],
    q = await searchParams,
    policy = catalogUrlPolicy(kind, q);
  const all = publicEntries(site).filter((e) => e.kind === kind),
    query = scalar(q.q).trim().slice(0, 120),
    category = scalar(q.categoria),
    modality = scalar(q.modalidad);
  const fold = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const filtered = all.filter(
    (e) =>
      (!query ||
        fold(`${e.title} ${e.description} ${e.body}`).includes(fold(query))) &&
      (!category || e.category === category) &&
      (!modality || e.modalityIds.includes(modality)),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / 9)),
    requested = policy.page,
    page = Math.max(1, Math.min(pageCount, requested));
  const entries = filtered.slice((page - 1) * 9, page * 9);
  const categories = [...new Set(all.map((e) => e.category).filter(Boolean))];
  const modes = publicEntries(site).filter(
    (e) =>
      e.kind === 'modalidades' &&
      all.some((item) => item.modalityIds.includes(e.id)),
  );
  const pageHref = (n: number) => {
    const sp = new URLSearchParams();
    if (query) sp.set('q', query);
    if (category) sp.set('categoria', category);
    if (modality) sp.set('modalidad', modality);
    if (n > 1) sp.set('pagina', String(n));
    return `/${kind}${sp.size ? '?' + sp : ''}`;
  };
  if (policy.pageParamPresent && (requested !== page || requested === 1))
    permanentRedirect(pageHref(page));
  return (
    <Shell site={site}>
      <JsonLd
        data={breadcrumbsData(site, [
          { name: 'Inicio', path: '/' },
          { name: c.title, path: `/${kind}` },
        ])}
      />
      <section className="section wrap">
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <a href="/">Inicio</a>
          <span>/</span>
          <span aria-current="page">{c.title}</span>
        </nav>
        <p className="eyebrow">{site.settings.tagline}</p>
        <h1 className="page-title">{c.title}</h1>
        {c.description && <p className="lead catalog-lead">{c.description}</p>}
        {all.length > 0 && (
          <form className="catalog-filters" action={`/${kind}`} method="get">
            <label className="field">
              Buscar
              <input
                name="q"
                defaultValue={query}
                type="search"
                maxLength={120}
              />
            </label>
            {categories.length > 0 && (
              <label className="field">
                Categoría
                <select name="categoria" defaultValue={category}>
                  <option value="">Todas</option>
                  {categories.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {modes.length > 0 && (
              <label className="field">
                Modalidad
                <select name="modalidad" defaultValue={modality}>
                  <option value="">Todas</option>
                  {modes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button className="button" type="submit">
              Filtrar
            </button>
            {(query || category || modality) && (
              <a className="text-link" href={`/${kind}`}>
                Limpiar filtros
              </a>
            )}
          </form>
        )}
        {entries.length ? (
          <>
            <p className="result-count">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <EntryCards entries={entries} site={site} />
            {pageCount > 1 && (
              <nav className="pagination" aria-label="Páginas de resultados">
                {page > 1 && <a href={pageHref(page - 1)}>← Anterior</a>}
                {Array.from({ length: pageCount }, (_, i) => i + 1)
                  .filter(
                    (n) => n === 1 || n === pageCount || Math.abs(n - page) < 3,
                  )
                  .map((n) => (
                    <a
                      key={n}
                      href={pageHref(n)}
                      aria-current={n === page ? 'page' : undefined}
                    >
                      {n}
                    </a>
                  ))}
                {page < pageCount && (
                  <a href={pageHref(page + 1)}>Siguiente →</a>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="empty">
            <h2>
              {query || category || modality
                ? 'No encontramos coincidencias'
                : site.settings.copy.emptyTitle}
            </h2>
            <p>{site.settings.copy.emptyDescription}</p>
            <a className="button" href="/cotizar">
              {site.settings.copy.primaryCta}
            </a>
          </div>
        )}
      </section>
    </Shell>
  );
}
