'use client';
import { useEffect, useState } from 'react';
type User = {
  id: string;
  username: string;
  role: string;
  active: number;
  created_at: number;
};
type Session = {
  id: string;
  username: string;
  created_at: number;
  expires_at: number;
  user_agent: string;
  current: number;
};
type Event = {
  id: string;
  actor_name: string;
  action: string;
  target: string;
  created_at: number;
};
const roles: Record<string, string> = {
  owner: 'Propietario',
  editor: 'Editor',
  viewer: 'Consulta',
};
const actions: Record<string, string> = {
  'session.login': 'Inicio de sesión',
  'session.logout': 'Cierre de sesión',
  'session.revoke': 'Sesión revocada',
  'user.create': 'Usuario creado',
  'user.activate': 'Usuario activado',
  'user.deactivate': 'Usuario desactivado',
  'user.password_reset': 'Contraseña restablecida',
  'site.save': 'Contenido guardado',
  'media.upload': 'Imagen subida',
  'inquiry.update': 'Solicitud actualizada',
};
const date = (value: number) =>
  new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Lima',
  }).format(value);
export function SecurityPanel({ actorId }: { actorId: string }) {
  const [users, setUsers] = useState<User[]>([]),
    [sessions, setSessions] = useState<Session[]>([]),
    [events, setEvents] = useState<Event[]>([]);
  const [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [resetId, setResetId] = useState('');
  async function api(path: string, method = 'GET', body?: unknown) {
    const response = await fetch(`/api/admin/${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = (await response.json()) as {
      error?: string;
      users?: User[];
      sessions?: Session[];
      events?: Event[];
      reauthenticate?: boolean;
    };
    if (!response.ok)
      throw new Error(data.error || 'No se pudo completar la operación.');
    return data;
  }
  async function refresh() {
    const [u, s, e] = await Promise.all([
      api('users'),
      api('sessions'),
      api('audit'),
    ]);
    setUsers(u.users || []);
    setSessions(s.sessions || []);
    setEvents(e.events || []);
  }
  useEffect(() => {
    Promise.resolve()
      .then(refresh)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  async function act(operation: () => Promise<void>) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await operation();
      await refresh();
      setMessage('Cambios aplicados.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de conexión.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main
      className="admin-main"
      style={{
        maxWidth: 1150,
        margin: '0 auto',
        padding: 'clamp(20px,4vw,48px)',
      }}
    >
      <a className="text-link" href="/admin">
        ← Volver al contenido
      </a>
      <p className="eyebrow">Administración</p>
      <h1>Usuarios y seguridad</h1>
      <p>
        Cada persona tiene su propio acceso. Los propietarios administran
        usuarios; los editores gestionan el contenido; consulta permite revisar
        sin publicar.
      </p>
      <output aria-live="polite">
        {loading ? 'Cargando accesos…' : message}
      </output>
      {error && (
        <p role="alert" className="error">
          {error}{' '}
          <button
            className="ghost"
            onClick={() => act(async () => {})}
            disabled={busy}
          >
            Reintentar
          </button>
        </p>
      )}
      <fieldset
        disabled={busy || loading}
        style={{ border: 0, padding: 0, minWidth: 0 }}
      >
        <section className="panel">
          <h2>Crear usuario</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget,
                data = new FormData(form);
              void act(async () => {
                await api('users', 'POST', {
                  username: data.get('username'),
                  password: data.get('password'),
                  role: data.get('role'),
                });
                form.reset();
              });
            }}
          >
            <div className="form-grid">
              <label className="field">
                Nombre de usuario
                <input
                  name="username"
                  required
                  minLength={3}
                  maxLength={64}
                  pattern="[a-z0-9][a-z0-9._-]{2,63}"
                  autoComplete="off"
                />
                <small>
                  Letras minúsculas, números, punto, guion o guion bajo.
                </small>
              </label>
              <label className="field">
                Contraseña inicial
                <input
                  type="password"
                  name="password"
                  required
                  minLength={16}
                  maxLength={256}
                  autoComplete="new-password"
                />
                <small>Usa una frase única de al menos 16 caracteres.</small>
              </label>
              <label className="field">
                Permisos
                <select name="role" defaultValue="editor">
                  <option value="editor">Editor</option>
                  <option value="viewer">Solo consulta</option>
                  <option value="owner">Propietario</option>
                </select>
              </label>
            </div>
            <button className="button" type="submit">
              Crear usuario
            </button>
          </form>
        </section>
        <section className="panel">
          <h2>Personas con acceso</h2>
          <div style={{ display: 'grid', gap: 20 }}>
            {users.map((user) => (
              <article
                key={user.id}
                style={{ borderBottom: '1px solid #d7d4c9', paddingBottom: 16 }}
              >
                <h3>
                  {user.username} {user.id === actorId ? '(tú)' : ''}
                </h3>
                <p>
                  {roles[user.role]} · {user.active ? 'Activo' : 'Desactivado'}
                </p>
                <div className="form-actions">
                  <button
                    className="ghost"
                    onClick={() =>
                      setResetId(resetId === user.id ? '' : user.id)
                    }
                  >
                    Restablecer contraseña
                  </button>
                  <button
                    className="ghost"
                    disabled={user.id === actorId}
                    onClick={() => {
                      if (
                        window.confirm(
                          `${user.active ? 'Desactivar' : 'Activar'} el acceso de ${user.username}?`,
                        )
                      )
                        void act(async () => {
                          await api('users', 'PATCH', {
                            id: user.id,
                            action: 'active',
                            active: !user.active,
                          });
                        });
                    }}
                  >
                    {user.active ? 'Desactivar' : 'Activar'}
                  </button>
                </div>
                {resetId === user.id && (
                  <form
                    style={{ marginTop: 16 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const password = new FormData(e.currentTarget).get(
                        'password',
                      );
                      void act(async () => {
                        const r = await api('users', 'PATCH', {
                          id: user.id,
                          action: 'password',
                          password,
                        });
                        setResetId('');
                        if (r.reauthenticate) window.location.assign('/admin');
                      });
                    }}
                  >
                    <label className="field">
                      Nueva contraseña
                      <input
                        name="password"
                        type="password"
                        required
                        minLength={16}
                        maxLength={256}
                        autoComplete="new-password"
                      />
                    </label>
                    <p>
                      Se cerrarán todas las sesiones de esta persona.
                      {user.id === actorId
                        ? ' Tendrás que volver a ingresar.'
                        : ''}
                    </p>
                    <button className="button" type="submit">
                      Guardar contraseña
                    </button>
                  </form>
                )}
              </article>
            ))}
          </div>
        </section>
        <section className="panel">
          <h2>Sesiones activas</h2>
          <p>
            Las sesiones vencen a las 8 horas. Revoca cualquier acceso que no
            reconozcas.
          </p>
          {sessions.map((session) => (
            <article
              key={session.id}
              style={{
                padding: '16px 0',
                borderBottom: '1px solid #d7d4c9',
                overflowWrap: 'anywhere',
              }}
            >
              <h3>
                {session.username}
                {session.current ? ' · Esta sesión' : ''}
              </h3>
              <p>
                Inicio: {date(session.created_at)} · Vence:{' '}
                {date(session.expires_at)}
              </p>
              <small>{session.user_agent}</small>
              <div>
                <button
                  className="ghost"
                  onClick={() => {
                    if (window.confirm('¿Cerrar esta sesión?'))
                      void act(async () => {
                        await api('sessions', 'DELETE', { id: session.id });
                        if (session.current) window.location.assign('/admin');
                      });
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            </article>
          ))}
          {!loading && !sessions.length && <p>No hay sesiones activas.</p>}
        </section>
        <section className="panel">
          <h2>Actividad reciente</h2>
          <p>Últimos 100 eventos, en horario de Lima.</p>
          <ol style={{ paddingLeft: 24 }}>
            {events.map((event) => (
              <li
                key={event.id}
                style={{ padding: '10px 0', overflowWrap: 'anywhere' }}
              >
                <strong>{actions[event.action] || event.action}</strong> ·{' '}
                {event.actor_name}
                <br />
                <small>
                  {date(event.created_at)} · {event.target}
                </small>
              </li>
            ))}
          </ol>
          {!loading && !events.length && (
            <p>Todavía no hay actividad registrada.</p>
          )}
        </section>
      </fieldset>
    </main>
  );
}
