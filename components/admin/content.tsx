import type { ContentEntry, SiteContent } from '@/models/content';
import {
  Field,
  Check,
  Select,
  NumberField,
  Lines,
  ImagePicker,
  Multi,
  SeoEditor,
} from './fields';
export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 110);
export function ContentEditor({
  entry: e,
  site,
  patch,
}: {
  entry: ContentEntry;
  site: SiteContent;
  patch: (p: Partial<ContentEntry>) => void;
}) {
  return (
    <>
      <div className="panel">
        <div className="admin-actions">
          <a href={`/preview/${e.id}`} target="_blank" rel="noreferrer">
            Vista previa guardada ↗
          </a>
          {e.status === 'published' && (
            <a href={`/${e.kind}/${e.slug}`} target="_blank" rel="noreferrer">
              Ver publicado ↗
            </a>
          )}
        </div>
        <h2>Información de la propuesta</h2>
        <div className="form-grid">
          <Field
            label="Título"
            value={e.title}
            onChange={(title) =>
              patch({
                title,
                ...(e.slug === slugify(e.title) || !e.slug
                  ? { slug: slugify(title) }
                  : {}),
              })
            }
          />
          <Field
            label="URL / slug"
            value={e.slug}
            onChange={(slug) => patch({ slug })}
            hint="Si cambia una URL existente, al guardar se creará su redirección automáticamente."
          />
          <Field
            label="Categoría"
            value={e.category}
            onChange={(category) => patch({ category })}
          />
          <Select
            label="Estado"
            value={e.status}
            options={{
              draft: 'Borrador',
              published: 'Publicado',
              archived: 'Archivado',
            }}
            onChange={(v) => patch({ status: v as ContentEntry['status'] })}
          />
          <NumberField
            label="Orden"
            value={e.sortOrder}
            onChange={(v) => patch({ sortOrder: v ?? 0 })}
          />
          <Check
            label="Destacado"
            value={e.featured}
            onChange={(featured) => patch({ featured })}
          />
        </div>
        <Field
          label="Descripción breve"
          value={e.description}
          multiline
          onChange={(description) => patch({ description })}
        />
        <Field
          label="Contenido completo"
          value={e.body}
          multiline
          onChange={(body) => patch({ body })}
        />
        <ImagePicker
          media={site.media}
          value={e.imageId}
          onChange={(imageId) => patch({ imageId })}
        />
        <Multi
          label="Galería de imágenes"
          options={site.media.map((m) => ({ id: m.id, title: m.alt || m.id }))}
          value={e.imageIds}
          onChange={(imageIds) => patch({ imageIds })}
        />
      </div>
      <div className="panel">
        <h2>Oferta y condiciones</h2>
        <div className="form-grid">
          <Lines
            label="Incluye"
            value={e.details}
            onChange={(details) => patch({ details })}
          />
          <Lines
            label="No incluye"
            value={e.excluded}
            onChange={(excluded) => patch({ excluded })}
          />
          <NumberField
            label="Mínimo de invitados"
            value={e.minimumGuests}
            onChange={(minimumGuests) => patch({ minimumGuests })}
          />
          <Select
            label="Proveedor"
            value={e.provider}
            options={{
              '': 'Sin especificar',
              own: 'Servicio propio',
              partner: 'Proveedor aliado',
            }}
            onChange={(v) => patch({ provider: v as ContentEntry['provider'] })}
          />
          <Select
            label="Precio"
            value={e.price.mode}
            options={{
              consult: 'A cotizar',
              from: 'Desde',
              fixed: 'Precio fijo',
            }}
            onChange={(v) =>
              patch({
                price: { ...e.price, mode: v as ContentEntry['price']['mode'] },
              })
            }
          />
          <NumberField
            label="Importe en soles"
            value={e.price.amount}
            onChange={(amount) => patch({ price: { ...e.price, amount } })}
          />
          <Select
            label="Unidad del precio"
            value={e.price.unit}
            options={{
              person: 'Por persona',
              event: 'Por evento',
              unit: 'Por unidad',
            }}
            onChange={(v) =>
              patch({
                price: { ...e.price, unit: v as ContentEntry['price']['unit'] },
              })
            }
          />
          <NumberField
            label="Cantidad mínima para este precio"
            value={e.price.minimum}
            onChange={(minimum) => patch({ price: { ...e.price, minimum } })}
          />
        </div>
        <Field
          label="Condiciones del precio"
          multiline
          value={e.price.conditions}
          onChange={(conditions) =>
            patch({ price: { ...e.price, conditions } })
          }
        />
        <Lines
          label="Características alimentarias"
          value={e.dietary}
          onChange={(dietary) => patch({ dietary })}
        />
        <Check
          label="He verificado las características alimentarias declaradas"
          value={e.dietaryConfirmed}
          onChange={(dietaryConfirmed) => patch({ dietaryConfirmed })}
        />
        <p>
          Confirma ingredientes y preparación antes de declarar aptitud para
          alergias o restricciones alimentarias.
        </p>
      </div>
      <div className="panel">
        <h2>Relaciones del catálogo</h2>
        {(
          [
            ['dishIds', 'platos', 'Platos incluidos'],
            ['menuIds', 'menus', 'Menús'],
            ['serviceIds', 'servicios', 'Servicios'],
            ['modalityIds', 'modalidades', 'Modalidades'],
            ['addOnIds', 'complementos', 'Complementos compatibles'],
            ['eventTypeIds', 'tipos-evento', 'Tipos de evento'],
          ] as const
        ).map(([key, kind, label]) => (
          <Multi
            key={key}
            label={label}
            value={e[key]}
            options={site.entries
              .filter((x) => x.kind === kind && x.id !== e.id)
              .map((x) => ({ id: x.id, title: `${x.title} · ${x.status}` }))}
            onChange={(v) => patch({ [key]: v })}
          />
        ))}
      </div>
      <div className="panel">
        <h2>Ubicación y pruebas de confianza</h2>
        <div className="form-grid">
          <Field
            label="Distrito / zona"
            value={e.district}
            onChange={(district) => patch({ district })}
          />
          <Field
            type="date"
            label="Fecha del evento"
            value={e.eventDate}
            onChange={(eventDate) => patch({ eventDate })}
          />
          <NumberField
            label="Invitados atendidos"
            value={e.guestCount}
            onChange={(guestCount) => patch({ guestCount })}
          />
          <Field
            label="Autor del testimonio / atribución"
            value={e.attribution}
            onChange={(attribution) => patch({ attribution })}
          />
        </div>
        <Check
          label="Contenido real verificado y autorizado para publicación"
          value={e.verified}
          onChange={(verified) => patch({ verified })}
        />
      </div>
      <div className="panel">
        <h2>SEO y redes sociales</h2>
        <SeoEditor
          value={e.seo}
          onChange={(seo) => patch({ seo })}
          url={`${site.settings.origin}/${e.kind}/${e.slug}`}
          media={site.media}
        />
      </div>
    </>
  );
}
