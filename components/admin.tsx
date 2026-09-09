'use client';
import { useEffect, useRef, useState } from 'react';
import {
  contentKinds,
  type SiteContent,
  type ContentKind,
  type ContentEntry,
} from '@/models/content';
import { emptyEntry, kindLabels } from '@/data/defaults';
import { ContentEditor } from './admin/content';
import { SettingsEditor } from './admin/settings';
import { SectionsEditor } from './admin/sections';
import { MediaEditor } from './admin/media';
import { QuotesEditor } from './admin/quotes';
import { Field } from './admin/fields';
import './admin/admin.css';
const labels: Record<string, string> = {
  resumen: 'Resumen',
  ...kindLabels,
  bloques: 'Secciones de inicio',
  media: 'Biblioteca de imágenes',
  faq: 'Preguntas frecuentes',
  seo: 'SEO y listados',
  config: 'Configuración',
  quotes: 'Solicitudes',
  history: 'Historial',
};
async function response<T>(r: Response): Promise<T> {
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  if (!r.ok)
    throw new Error(data?.error || text || 'No se pudo completar la operación');
  return data as T;
}
export function Login() {
  const [busy, B] = useState(false),
    [error, E] = useState('');
  const lock = useRef(false);
  return (
    <main className="login">
      <p className="eyebrow">Administración</p>
      <h1>Tu cocina, al día.</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (lock.current) return;
          lock.current = true;
          const form = new FormData(e.currentTarget);
          B(true);
          E('');
          try {
            await response(
              await fetch('/api/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  username: form.get('username'),
                  password: form.get('password'),
                }),
              }),
            );
            window.location.reload();
          } catch (err) {
            E(err instanceof Error ? err.message : 'Error de conexión');
          } finally {
            lock.current = false;
            B(false);
          }
        }}
      >
        <fieldset disabled={busy}>
          <label className="field">
            Usuario (opcional en el primer acceso)
            <input name="username" autoComplete="username" />
          </label>
          <label className="field">
            Contraseña
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              maxLength={256}
            />
          </label>
          <button className="button" type="submit">
            {busy ? 'Ingresando…' : 'Ingresar'}
          </button>
        </fieldset>
        <p role="alert">{error}</p>
      </form>
      <a href="/">Volver a la web</a>
    </main>
  );
}
type HistoryItem = {
  id: string;
  createdAt: string;
  version: number;
  actor: string;
  summary: string;
};
export function Admin({
  initial,
  role = 'editor',
}: {
  initial: SiteContent;
  role?: 'owner' | 'editor' | 'viewer';
}) {
  const [site, S] = useState(initial),
    [tab, T] = useState('resumen'),
    [editing, E] = useState<string | null>(null),
    [dirty, D] = useState(false),
    [busy, B] = useState(false),
    [message, M] = useState(''),
    [error, R] = useState(''),
    [query, Q] = useState(''),
    [history, H] = useState<HistoryItem[]>([]);
  const lock = useRef(false);
  const readonly = role === 'viewer';
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);
  function update(fn: (s: SiteContent) => SiteContent) {
    if (readonly) return;
    S(fn);
    D(true);
    M('');
  }
  async function run(action: () => Promise<void>) {
    if (lock.current || readonly) return;
    lock.current = true;
    B(true);
    R('');
    M('');
    try {
      await action();
    } catch (err) {
      R(
        err instanceof Error
          ? err.message
          : 'No se pudo completar. Tus cambios se conservan en el editor.',
      );
    } finally {
      lock.current = false;
      B(false);
    }
  }
  async function save() {
    await run(async () => {
      const saved = await response<SiteContent>(
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(site),
        }),
      );
      S(saved);
      D(false);
      M('Cambios guardados. La versión publicada ya está disponible.');
    });
  }
  function create(kind: ContentKind) {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    update((s) => ({
      ...s,
      entries: [
        ...s.entries,
        {
          ...emptyEntry(),
          id,
          kind,
          title: 'Nueva propuesta',
          slug: `nueva-propuesta-${id.slice(0, 8)}`,
          sortOrder: s.entries.filter((e) => e.kind === kind).length,
          createdAt: now,
          updatedAt: now,
        },
      ],
    }));
    E(id);
  }
  const current = site.entries.find((e) => e.id === editing);
  const patch = (p: Partial<ContentEntry>) =>
    update((s) => ({
      ...s,
      entries: s.entries.map((e) => (e.id === editing ? { ...e, ...p } : e)),
    }));
  async function loadHistory() {
    B(true);
    R('');
    try {
      const data = await response<{ items: HistoryItem[] }>(
        await fetch('/api/content/history'),
      );
      H(data.items);
    } catch (e) {
      R(e instanceof Error ? e.message : 'No se pudo cargar historial');
    } finally {
      B(false);
    }
  }
  return (
    <div className="admin">
      <aside className="sidebar">
        <a className="brand" href="/">
          {site.settings.name}
        </a>
        <p>Contenido y administración</p>
        <nav aria-label="Secciones del panel">
          {Object.entries(labels)
            .filter(([key]) => role === 'owner' || key !== 'history')
            .map(([key, label]) => (
              <button
                key={key}
                disabled={busy}
                aria-current={tab === key ? 'page' : undefined}
                onClick={() => {
                  T(key);
                  E(null);
                  Q('');
                  if (key === 'history') void loadHistory();
                }}
              >
                {label}
              </button>
            ))}
        </nav>
        {role === 'owner' && <a href="/admin/security">Usuarios y seguridad</a>}
        <a href="/" target="_blank" rel="noreferrer">
          Ver sitio ↗
        </a>
        <button
          disabled={busy}
          onClick={async () => {
            if (
              dirty &&
              !confirm('¿Cerrar sesión y descartar cambios sin guardar?')
            )
              return;
            try {
              await response(await fetch('/api/session', { method: 'DELETE' }));
              window.location.reload();
            } catch (e) {
              R(e instanceof Error ? e.message : 'No se pudo cerrar sesión');
            }
          }}
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="admin-main">
        <header className="admin-toolbar">
          <div>
            <h1>{labels[tab]}</h1>
            <p>
              {readonly
                ? 'Acceso de consulta'
                : dirty
                  ? 'Tienes cambios sin guardar'
                  : `Versión ${site.version} guardada`}
            </p>
          </div>
          <button
            className="button secondary"
            disabled={busy || !dirty || readonly}
            onClick={() => void save()}
          >
            {busy ? 'Procesando…' : 'Guardar cambios'}
          </button>
        </header>
        {site.settings.demo && (
          <div className="notice">
            Contenido de demostración: completa los datos reales antes de
            activar la indexación.
          </div>
        )}
        <output aria-live="polite">{message}</output>
        {error && (
          <div className="notice error" role="alert">
            {error}
          </div>
        )}
        <fieldset className="admin-editor-lock" disabled={busy}>
          {tab === 'resumen' && (
            <>
              <div className="stats">
                <div className="stat">
                  <span>Publicados</span>
                  <strong>
                    {
                      site.entries.filter((e) => e.status === 'published')
                        .length
                    }
                  </strong>
                </div>
                <div className="stat">
                  <span>Borradores</span>
                  <strong>
                    {site.entries.filter((e) => e.status === 'draft').length}
                  </strong>
                </div>
                <div className="stat">
                  <span>Imágenes</span>
                  <strong>{site.media.length}</strong>
                </div>
              </div>
              <div className="panel">
                <h2>Preparación del negocio</h2>
                <ul>
                  <li>
                    {site.settings.whatsapp
                      ? 'WhatsApp configurado'
                      : 'Falta el contacto de WhatsApp'}
                  </li>
                  <li>
                    {site.settings.businessVerified
                      ? 'Datos comerciales verificados'
                      : 'Datos comerciales pendientes de confirmar'}
                  </li>
                  <li>
                    {site.settings.origin
                      ? 'Dominio configurado'
                      : 'Dominio público pendiente'}
                  </li>
                  <li>
                    {site.settings.indexable
                      ? 'Indexación activa'
                      : 'Indexación desactivada'}
                  </li>
                  <li>
                    {site.media.filter((m) => m.demo).length} imágenes de
                    demostración
                  </li>
                  <li>
                    {site.media.filter((m) => !m.alt.trim()).length} imágenes
                    sin texto alternativo
                  </li>
                </ul>
                <p>
                  El nombre puede seguir provisional. Guarda los cambios antes
                  de revisar la vista previa.
                </p>
              </div>
            </>
          )}
          {contentKinds.includes(tab as ContentKind) &&
            (current ? (
              <>
                <button className="ghost" onClick={() => E(null)}>
                  ← Volver al listado
                </button>
                <fieldset disabled={readonly}>
                  <ContentEditor entry={current} site={site} patch={patch} />
                </fieldset>
              </>
            ) : (
              <div className="panel">
                <div className="list-head">
                  <h2>{labels[tab]}</h2>
                  <button
                    className="button secondary"
                    disabled={readonly}
                    onClick={() => create(tab as ContentKind)}
                  >
                    Crear contenido
                  </button>
                </div>
                <Field
                  label="Buscar por título, categoría o estado"
                  value={query}
                  onChange={Q}
                />
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Contenido</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {site.entries
                        .filter(
                          (e) =>
                            e.kind === tab &&
                            `${e.title} ${e.category} ${e.status}`
                              .toLowerCase()
                              .includes(query.toLowerCase()),
                        )
                        .sort((a, b) => a.sortOrder - b.sortOrder)
                        .map((e) => (
                          <tr key={e.id}>
                            <td>
                              {e.title}
                              <br />
                              <small>
                                /{e.kind}/{e.slug}
                              </small>
                            </td>
                            <td>
                              {
                                {
                                  draft: 'Borrador',
                                  published: 'Publicado',
                                  archived: 'Archivado',
                                }[e.status]
                              }
                            </td>
                            <td>
                              <button className="ghost" onClick={() => E(e.id)}>
                                Editar
                              </button>
                              <button
                                className="ghost"
                                disabled={readonly}
                                onClick={() => {
                                  const id = crypto.randomUUID();
                                  update((s) => ({
                                    ...s,
                                    entries: [
                                      ...s.entries,
                                      {
                                        ...e,
                                        id,
                                        title: `${e.title} (copia)`,
                                        slug: `${e.slug.slice(0, 100)}-${id.slice(0, 8)}`,
                                        status: 'draft',
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                      },
                                    ],
                                  }));
                                  E(id);
                                }}
                              >
                                Duplicar
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          <fieldset disabled={readonly} className="admin-editor-lock">
            {tab === 'config' && (
              <SettingsEditor
                site={site}
                patch={(p) =>
                  update((s) => ({ ...s, settings: { ...s.settings, ...p } }))
                }
              />
            )}
            {tab === 'seo' && (
              <SettingsEditor
                site={site}
                seoOnly
                patch={(p) =>
                  update((s) => ({ ...s, settings: { ...s.settings, ...p } }))
                }
              />
            )}
            {tab === 'bloques' && (
              <SectionsEditor
                site={site}
                change={(sections) => update((s) => ({ ...s, sections }))}
              />
            )}
            {tab === 'media' && (
              <MediaEditor
                owner={role === 'owner' && !dirty}
                site={site}
                change={(media) => update((s) => ({ ...s, media }))}
                run={run}
              />
            )}
            {tab === 'faq' && (
              <>
                <button
                  className="button secondary"
                  onClick={() =>
                    update((s) => ({
                      ...s,
                      faqs: [
                        ...s.faqs,
                        {
                          id: crypto.randomUUID(),
                          question: 'Nueva pregunta',
                          answer: '',
                        },
                      ],
                    }))
                  }
                >
                  Añadir pregunta
                </button>
                {site.faqs.map((f, i) => (
                  <div className="panel" key={f.id}>
                    <Field
                      label="Pregunta"
                      value={f.question}
                      onChange={(question) =>
                        update((s) => ({
                          ...s,
                          faqs: s.faqs.map((x) =>
                            x.id === f.id ? { ...x, question } : x,
                          ),
                        }))
                      }
                    />
                    <Field
                      label="Respuesta"
                      multiline
                      value={f.answer}
                      onChange={(answer) =>
                        update((s) => ({
                          ...s,
                          faqs: s.faqs.map((x) =>
                            x.id === f.id ? { ...x, answer } : x,
                          ),
                        }))
                      }
                    />
                    <button
                      className="ghost"
                      disabled={i === 0}
                      onClick={() =>
                        update((s) => {
                          const faqs = [...s.faqs];
                          [faqs[i - 1], faqs[i]] = [faqs[i], faqs[i - 1]];
                          return { ...s, faqs };
                        })
                      }
                    >
                      Subir
                    </button>
                    <button
                      className="ghost"
                      onClick={() => {
                        if (confirm('¿Quitar esta pregunta al guardar?'))
                          update((s) => ({
                            ...s,
                            faqs: s.faqs.filter((x) => x.id !== f.id),
                          }));
                      }}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </>
            )}
          </fieldset>
          {tab === 'quotes' && <QuotesEditor readonly={readonly} />}
          {tab === 'history' && (
            <div className="panel">
              <h2>Versiones guardadas</h2>
              <p>
                Restaurar crea una nueva versión a partir de la seleccionada.
              </p>
              {history.map((h) => (
                <article key={h.id}>
                  <h3>Versión {h.version}</h3>
                  <p>
                    {new Date(h.createdAt).toLocaleString('es-PE')} · {h.actor}
                  </p>
                  <p>{h.summary}</p>
                  <button
                    className="ghost"
                    onClick={() => {
                      if (
                        confirm(
                          `¿Restaurar la versión ${h.version}? ${dirty ? 'Se descartarán los cambios sin guardar.' : ''}`,
                        )
                      )
                        void run(async () => {
                          const restored = await response<SiteContent>(
                            await fetch(`/api/content/history/${h.id}`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ version: site.version }),
                            }),
                          );
                          S(restored);
                          D(false);
                          M('Versión restaurada correctamente.');
                        });
                    }}
                  >
                    Restaurar
                  </button>
                </article>
              ))}
            </div>
          )}
        </fieldset>
      </main>
    </div>
  );
}
