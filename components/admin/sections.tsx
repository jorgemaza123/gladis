import { useState } from 'react';
import type { SiteContent, PageSection } from '@/models/content';
import { Field, Check, Select, ImagePicker, Multi } from './fields';
const types: Record<PageSection['type'], string> = {
  hero: 'Portada',
  servicios: 'Servicios',
  menus: 'Menús',
  texto: 'Texto e imagen',
  faq: 'Preguntas frecuentes',
  cta: 'Llamado a la acción',
  galeria: 'Galería',
  modalidades: 'Modalidades',
  complementos: 'Complementos',
  testimonios: 'Testimonios',
  pasos: 'Pasos',
  cobertura: 'Cobertura',
  eventos: 'Eventos',
  'tipos-evento': 'Tipos de evento',
};
export function SectionsEditor({
  site,
  change,
}: {
  site: SiteContent;
  change: (sections: PageSection[]) => void;
}) {
  const [drag, setDrag] = useState<string | null>(null);
  const ordered = [...site.sections].sort((a, b) => a.sortOrder - b.sortOrder);
  const patch = (id: string, p: Partial<PageSection>) =>
    change(ordered.map((s) => (s.id === id ? { ...s, ...p } : s)));
  function move(id: string, to: number) {
    const a = [...ordered];
    const from = a.findIndex((s) => s.id === id);
    if (from < 0 || to < 0 || to >= a.length) return;
    const [item] = a.splice(from, 1);
    a.splice(to, 0, item);
    change(a.map((s, i) => ({ ...s, sortOrder: i })));
  }
  return (
    <>
      <div className="panel">
        <Select
          label="Añadir sección"
          value=""
          options={{ '': 'Selecciona un tipo', ...types }}
          onChange={(v) => {
            if (v)
              change([
                ...ordered,
                {
                  id: crypto.randomUUID(),
                  type: v as PageSection['type'],
                  title: 'Nueva sección',
                  description: '',
                  imageId: '',
                  visible: true,
                  sortOrder: ordered.length,
                  entryIds: [],
                  imageIds: [],
                  steps: [],
                },
              ]);
          }}
        />
        <p>
          Arrastra el control de orden o utiliza Subir y Bajar. La vista previa
          refleja la última versión guardada.
        </p>
      </div>
      {ordered.map((s, i) => (
        <div
          className="panel"
          key={s.id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (drag) move(drag, i);
            setDrag(null);
          }}
        >
          <div className="list-head">
            <h2>
              {i + 1}. {types[s.type]}
            </h2>
            <div className="admin-actions">
              <button
                className="ghost"
                draggable
                aria-label={`Arrastrar ${s.title}`}
                onDragStart={() => setDrag(s.id)}
              >
                ⠿
              </button>
              <button
                className="ghost"
                disabled={i === 0}
                onClick={() => move(s.id, i - 1)}
              >
                Subir
              </button>
              <button
                className="ghost"
                disabled={i === ordered.length - 1}
                onClick={() => move(s.id, i + 1)}
              >
                Bajar
              </button>
            </div>
          </div>
          <Check
            label="Visible"
            value={s.visible}
            onChange={(visible) => patch(s.id, { visible })}
          />
          <div className="form-grid">
            <Field
              label="Antetítulo"
              value={s.eyebrow || ''}
              onChange={(eyebrow) => patch(s.id, { eyebrow })}
            />
            <Field
              label="Título"
              value={s.title}
              onChange={(title) => patch(s.id, { title })}
            />
          </div>
          <Field
            label="Descripción"
            multiline
            value={s.description}
            onChange={(description) => patch(s.id, { description })}
          />
          <ImagePicker
            media={site.media}
            value={s.imageId}
            onChange={(imageId) => patch(s.id, { imageId })}
          />
          <Multi
            label="Contenidos seleccionados"
            value={s.entryIds || []}
            options={site.entries.map((e) => ({
              id: e.id,
              title: `${e.title} · ${e.kind} · ${e.status}`,
            }))}
            onChange={(entryIds) => patch(s.id, { entryIds })}
          />
          <Multi
            label="Imágenes de galería"
            value={s.imageIds || []}
            options={site.media.map((m) => ({
              id: m.id,
              title: m.alt || m.id,
            }))}
            onChange={(imageIds) => patch(s.id, { imageIds })}
          />
          <div className="form-grid">
            {(
              [
                'primaryLabel',
                'primaryHref',
                'secondaryLabel',
                'secondaryHref',
              ] as const
            ).map((key) => (
              <Field
                key={key}
                label={
                  {
                    primaryLabel: 'Botón principal: texto',
                    primaryHref: 'Botón principal: destino',
                    secondaryLabel: 'Botón secundario: texto',
                    secondaryHref: 'Botón secundario: destino',
                  }[key]
                }
                value={s[key] || ''}
                onChange={(v) => patch(s.id, { [key]: v })}
              />
            ))}
          </div>
          <Select
            label="Presentación"
            value={s.variant || 'standard'}
            options={{ standard: 'Estándar', alternate: 'Alternada' }}
            onChange={(v) =>
              patch(s.id, { variant: v as PageSection['variant'] })
            }
          />
          {s.type === 'pasos' && (
            <>
              <h3>Pasos</h3>
              {(s.steps || []).map((step, j) => (
                <div key={j}>
                  <Field
                    label={`Paso ${j + 1}: título`}
                    value={step.title}
                    onChange={(title) =>
                      patch(s.id, {
                        steps: s.steps?.map((x, k) =>
                          k === j ? { ...x, title } : x,
                        ),
                      })
                    }
                  />
                  <Field
                    label="Descripción del paso"
                    value={step.description}
                    multiline
                    onChange={(description) =>
                      patch(s.id, {
                        steps: s.steps?.map((x, k) =>
                          k === j ? { ...x, description } : x,
                        ),
                      })
                    }
                  />
                  <button
                    className="ghost"
                    onClick={() =>
                      patch(s.id, { steps: s.steps?.filter((_, k) => k !== j) })
                    }
                  >
                    Quitar paso
                  </button>
                </div>
              ))}
              <button
                className="ghost"
                onClick={() =>
                  patch(s.id, {
                    steps: [
                      ...(s.steps || []),
                      { title: 'Nuevo paso', description: '' },
                    ],
                  })
                }
              >
                Añadir paso
              </button>
            </>
          )}
          <button
            className="ghost"
            onClick={() => {
              if (
                confirm(
                  `¿Quitar la sección «${s.title}»? Se aplicará al guardar.`,
                )
              )
                change(ordered.filter((x) => x.id !== s.id));
            }}
          >
            Quitar sección
          </button>
        </div>
      ))}
    </>
  );
}
