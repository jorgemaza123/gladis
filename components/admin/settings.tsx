import {
  contentKinds,
  type SiteContent,
  type SiteSettings,
} from '@/models/content';
import { kindLabels } from '@/data/defaults';
import { Field, Check, Select, ImagePicker, SeoEditor } from './fields';
const copyLabels: Record<string, string> = {
  location: 'Ubicación',
  primaryCta: 'Botón principal',
  secondaryCta: 'Botón secundario',
  viewAll: 'Ver todos',
  inquire: 'Consultar propuesta',
  footerHeading: 'Título del pie',
  emptyTitle: 'Título sin resultados',
  emptyDescription: 'Descripción sin resultados',
  galleryTitle: 'Título de galería',
  includedTitle: 'Título de incluidos',
  excludedTitle: 'Título de exclusiones',
  relatedTitle: 'Título de relacionados',
  coverageTitle: 'Título de cobertura',
  quoteTitle: 'Título del cotizador',
  quoteDescription: 'Descripción del cotizador',
  quoteAsideTitle: 'Título lateral del cotizador',
  quoteAsideDescription: 'Descripción lateral',
  consent: 'Consentimiento del formulario',
  privacyTitle: 'Título de privacidad',
  privacyBody: 'Política de privacidad',
  successTitle: 'Título de solicitud recibida',
  successDescription: 'Mensaje de solicitud recibida',
  demoNotice: 'Aviso de demostración',
};
export function SettingsEditor({
  site,
  patch,
  seoOnly = false,
}: {
  site: SiteContent;
  patch: (p: Partial<SiteSettings>) => void;
  seoOnly?: boolean;
}) {
  const s = site.settings;
  return seoOnly ? (
    <>
      <div className="panel">
        <h2>SEO del inicio</h2>
        <SeoEditor
          media={site.media}
          value={s.seo}
          onChange={(seo) => patch({ seo })}
          url={s.origin}
        />
        <Field
          label="Dominio público HTTPS"
          value={s.origin}
          onChange={(origin) => patch({ origin })}
        />
        <Check
          label="Permitir indexación"
          value={s.indexable}
          onChange={(indexable) => patch({ indexable })}
        />
        <p>
          Activa la indexación cuando el contenido, los contactos y el dominio
          sean reales.
        </p>
        <a href="/robots.txt" target="_blank" rel="noreferrer">
          robots.txt ↗
        </a>{' '}
        ·{' '}
        <a href="/sitemap.xml" target="_blank" rel="noreferrer">
          sitemap.xml ↗
        </a>
      </div>
      {contentKinds.map((kind) => (
        <details className="panel" key={kind}>
          <summary>Listado: {kindLabels[kind]}</summary>
          <Field
            label="Título del listado"
            value={s.catalogs[kind].title}
            onChange={(title) =>
              patch({
                catalogs: {
                  ...s.catalogs,
                  [kind]: { ...s.catalogs[kind], title },
                },
              })
            }
          />
          <Field
            label="Descripción del listado"
            multiline
            value={s.catalogs[kind].description}
            onChange={(description) =>
              patch({
                catalogs: {
                  ...s.catalogs,
                  [kind]: { ...s.catalogs[kind], description },
                },
              })
            }
          />
          <SeoEditor
            media={site.media}
            value={s.catalogs[kind].seo}
            onChange={(seo) =>
              patch({
                catalogs: {
                  ...s.catalogs,
                  [kind]: { ...s.catalogs[kind], seo },
                },
              })
            }
            url={`${s.origin}/${kind}`}
          />
        </details>
      ))}
    </>
  ) : (
    <>
      <div className="panel">
        <h2>Identidad y contacto</h2>
        <p>El nombre puede mantenerse provisional hasta la presentación.</p>
        <div className="form-grid">
          {(
            [
              'name',
              'tagline',
              'whatsapp',
              'whatsappMessage',
              'email',
              'footer',
              'publicAddress',
              'hours',
              'analyticsConsentText',
            ] as const
          ).map((key) => (
            <Field
              key={key}
              label={
                {
                  name: 'Nombre',
                  tagline: 'Frase de marca',
                  whatsapp: 'WhatsApp con código de país',
                  whatsappMessage: 'Mensaje de WhatsApp',
                  email: 'Correo público',
                  footer: 'Pie de página',
                  publicAddress: 'Dirección pública',
                  hours: 'Horario de atención',
                  analyticsConsentText: 'Consentimiento de estadísticas',
                }[key]
              }
              value={s[key]}
              onChange={(v) => patch({ [key]: v })}
            />
          ))}
        </div>
        <ImagePicker
          label="Logotipo"
          media={site.media}
          value={s.logoId}
          onChange={(logoId) => patch({ logoId })}
        />
        <Check
          label="Mostrar aviso de demostración"
          value={s.demo}
          onChange={(demo) => patch({ demo })}
        />
        <Check
          label="Datos del negocio verificados"
          value={s.businessVerified}
          onChange={(businessVerified) => patch({ businessVerified })}
        />
      </div>
      <div className="panel">
        <h2>Estilo y movimiento</h2>
        <Select
          label="Paleta"
          value={s.palette}
          options={{ olive: 'Oliva', terracotta: 'Terracota', cacao: 'Cacao' }}
          onChange={(v) => patch({ palette: v as SiteSettings['palette'] })}
        />
        <Select
          label="Tipografía"
          value={s.typography}
          options={{ editorial: 'Editorial', classic: 'Clásica' }}
          onChange={(v) =>
            patch({ typography: v as SiteSettings['typography'] })
          }
        />
        <Check
          label="Activar animaciones"
          value={s.animations}
          onChange={(animations) => patch({ animations })}
        />
        <Select
          label="Intensidad"
          value={s.motionLevel}
          options={{ subtle: 'Sutil', off: 'Sin movimiento' }}
          onChange={(v) =>
            patch({ motionLevel: v as SiteSettings['motionLevel'] })
          }
        />
        <p>
          La web respeta la preferencia de movimiento reducido del dispositivo.
        </p>
      </div>
      <div className="panel">
        <h2>Textos de la web y privacidad</h2>
        {Object.entries(s.copy).map(([key, value]) => (
          <Field
            key={key}
            label={copyLabels[key] || key}
            multiline
            value={value}
            onChange={(v) => patch({ copy: { ...s.copy, [key]: v } })}
          />
        ))}
      </div>
      <div className="panel">
        <h2>Navegación</h2>
        {s.navigation.map((n, i) => (
          <div key={i} className="form-grid">
            <Field
              label="Texto"
              value={n.label}
              onChange={(label) =>
                patch({
                  navigation: s.navigation.map((x, j) =>
                    j === i ? { ...x, label } : x,
                  ),
                })
              }
            />
            <Field
              label="Ruta interna"
              value={n.href}
              onChange={(href) =>
                patch({
                  navigation: s.navigation.map((x, j) =>
                    j === i ? { ...x, href } : x,
                  ),
                })
              }
            />
            <button
              className="ghost"
              onClick={() =>
                patch({ navigation: s.navigation.filter((_, j) => j !== i) })
              }
            >
              Quitar {n.label}
            </button>
            <button
              className="ghost"
              disabled={i === 0}
              onClick={() => {
                const a = [...s.navigation];
                [a[i - 1], a[i]] = [a[i], a[i - 1]];
                patch({ navigation: a });
              }}
            >
              Subir enlace
            </button>
          </div>
        ))}
        <button
          className="ghost"
          onClick={() =>
            patch({
              navigation: [
                ...s.navigation,
                { label: 'Nuevo enlace', href: '/' },
              ],
            })
          }
        >
          Añadir enlace
        </button>
      </div>
      <div className="panel">
        <h2>Redes sociales</h2>
        {s.socialLinks.map((n, i) => (
          <div key={i} className="form-grid">
            <Field
              label="Nombre de la red"
              value={n.label}
              onChange={(label) =>
                patch({
                  socialLinks: s.socialLinks.map((x, j) =>
                    j === i ? { ...x, label } : x,
                  ),
                })
              }
            />
            <Field
              label="URL HTTPS"
              value={n.url}
              onChange={(url) =>
                patch({
                  socialLinks: s.socialLinks.map((x, j) =>
                    j === i ? { ...x, url } : x,
                  ),
                })
              }
            />
            <button
              className="ghost"
              onClick={() =>
                patch({ socialLinks: s.socialLinks.filter((_, j) => j !== i) })
              }
            >
              Quitar {n.label}
            </button>
          </div>
        ))}
        <button
          className="ghost"
          onClick={() =>
            patch({
              socialLinks: [...s.socialLinks, { label: 'Nueva red', url: '' }],
            })
          }
        >
          Añadir red
        </button>
      </div>
    </>
  );
}
