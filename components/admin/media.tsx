import { useState } from 'react';
import type { SiteContent, MediaAsset } from '@/models/content';
import { uploadImage } from '@/lib/upload';
import { Field, Check, NumberField, Lines } from './fields';
export function MediaEditor({
  site,
  change,
  run,
  owner = false,
}: {
  owner?: boolean;
  site: SiteContent;
  change: (media: MediaAsset[]) => void;
  run: (action: () => Promise<void>) => Promise<void>;
}) {
  const [q, Q] = useState('');
  const refs = (id: string) => [
    ...site.entries
      .filter(
        (e) =>
          e.imageId === id || e.imageIds.includes(id) || e.seo.imageId === id,
      )
      .map((e) => e.title),
    ...site.sections
      .filter((s) => s.imageId === id || s.imageIds?.includes(id))
      .map((s) => s.title),
    ...(site.settings.logoId === id ? ['Logotipo'] : []),
    ...(site.settings.seo.imageId === id ? ['SEO del inicio'] : []),
    ...Object.entries(site.settings.catalogs)
      .filter(([, c]) => c.seo.imageId === id)
      .map(([k]) => `SEO de ${k}`),
  ];
  const patch = (id: string, p: Partial<MediaAsset>) =>
    change(site.media.map((m) => (m.id === id ? { ...m, ...p } : m)));
  return (
    <>
      <div className="panel">
        <h2>Biblioteca de fotografías</h2>
        {owner && (
          <button
            className="ghost"
            onClick={() =>
              void run(async () => {
                const r = await fetch('/api/media/cleanup');
                if (!r.ok)
                  throw new Error('No se pudo consultar archivos huérfanos');
                const data = (await r.json()) as { count: number };
                alert(
                  `${data.count} grupos de archivos sin referencias detectados. Este reporte es informativo: la eliminación física está desactivada para proteger imágenes de ediciones simultáneas.`,
                );
              })
            }
          >
            Revisar archivos huérfanos
          </button>
        )}
        <p>
          Las imágenes se optimizan al subirlas. Completa el texto alternativo y
          guarda para incorporarlas al sitio.
        </p>
        <label className="field">
          Subir imágenes
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              e.target.value = '';
              void run(async () => {
                const assets: MediaAsset[] = [];
                for (const f of files) assets.push(await uploadImage(f));
                change([...site.media, ...assets]);
              });
            }}
          />
        </label>
        <Field
          label="Buscar por descripción, pie o etiqueta"
          value={q}
          onChange={Q}
        />
      </div>
      <div className="media-grid">
        {site.media
          .filter((m) =>
            `${m.alt} ${m.caption} ${(m.tags || []).join(' ')}`
              .toLowerCase()
              .includes(q.toLowerCase()),
          )
          .map((m) => (
            <div className="media-card" key={m.id}>
              <img
                className="admin-photo"
                src={m.url}
                alt={m.alt || 'Imagen pendiente de descripción'}
                loading="lazy"
                style={{
                  objectPosition: `${m.focalX ?? 50}% ${m.focalY ?? 50}%`,
                }}
              />
              <small>
                {m.width ?? '?'} × {m.height ?? '?'} px ·{' '}
                {m.bytes ? `${Math.round(m.bytes / 1024)} KB` : ''} ·{' '}
                {m.variants?.length || 0} variantes
              </small>
              <Field
                label="Texto alternativo"
                value={m.alt}
                onChange={(alt) => patch(m.id, { alt })}
              />
              <Field
                label="Pie de foto"
                value={m.caption}
                onChange={(caption) => patch(m.id, { caption })}
              />
              <Lines
                label="Etiquetas de búsqueda"
                value={m.tags || []}
                onChange={(tags) => patch(m.id, { tags })}
              />
              <Check
                label="Imagen de demostración"
                value={m.demo}
                onChange={(demo) => patch(m.id, { demo })}
              />
              <NumberField
                label="Punto focal horizontal (0–100)"
                value={m.focalX ?? 50}
                onChange={(v) =>
                  patch(m.id, { focalX: Math.min(100, Math.max(0, v ?? 50)) })
                }
              />
              <NumberField
                label="Punto focal vertical (0–100)"
                value={m.focalY ?? 50}
                onChange={(v) =>
                  patch(m.id, { focalY: Math.min(100, Math.max(0, v ?? 50)) })
                }
              />
              <p>Usada en: {refs(m.id).join(', ') || 'Ningún contenido'}</p>
              <label className="field">
                Reemplazar archivo conservando referencias
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (file)
                      void run(async () => {
                        const asset = await uploadImage(file);
                        patch(m.id, {
                          ...asset,
                          id: m.id,
                          alt: m.alt,
                          caption: m.caption,
                          tags: m.tags,
                          focalX: m.focalX,
                          focalY: m.focalY,
                        });
                      });
                  }}
                />
              </label>
              <button
                className="ghost"
                disabled={refs(m.id).length > 0}
                onClick={() => {
                  if (
                    confirm(
                      '¿Quitar esta imagen de la biblioteca? Se aplicará al guardar.',
                    )
                  )
                    change(site.media.filter((x) => x.id !== m.id));
                }}
              >
                Quitar de biblioteca
              </button>
              {refs(m.id).length > 0 && (
                <small>
                  Retira primero sus referencias para poder quitarla.
                </small>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
