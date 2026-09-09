import { env } from 'cloudflare:workers';
import {
  getAdmin,
  sameOrigin,
  boundedJson,
  privateJson,
  hashPassword,
  validUsername,
  validNewPassword,
  audit,
} from '@/lib/auth';
export async function GET() {
  if ((await getAdmin())?.role !== 'owner')
    return privateJson({ error: 'Acceso restringido' }, 403);
  const users = await env.DB.prepare(
    'SELECT id,username,role,active,created_at FROM admin_users ORDER BY created_at',
  ).all();
  return privateJson({ users: users.results });
}
export async function POST(request: Request) {
  const actor = await getAdmin();
  if (actor?.role !== 'owner' || !sameOrigin(request))
    return privateJson({ error: 'Acceso restringido' }, 403);
  let body: Record<string, unknown>;
  try {
    body = await boundedJson(request);
  } catch {
    return privateJson({ error: 'Solicitud inválida' }, 400);
  }
  const username =
    typeof body.username === 'string'
      ? body.username.trim().toLowerCase()
      : body.username;
  if (
    !validUsername(username) ||
    username === 'owner-bootstrap' ||
    !validNewPassword(body.password) ||
    !['owner', 'editor', 'viewer'].includes(String(body.role))
  )
    return privateJson(
      {
        error:
          'Usuario de 3–64 caracteres, contraseña de 16–256 caracteres y rol válido requeridos.',
      },
      400,
    );
  const id = crypto.randomUUID();
  const result = await env.DB.prepare(
    'INSERT OR IGNORE INTO admin_users (id,username,password_hash,role,active,created_at) VALUES (?,?,?,?,1,?)',
  )
    .bind(
      id,
      username,
      await hashPassword(body.password),
      body.role,
      Date.now(),
    )
    .run();
  if (!result.meta.changes)
    return privateJson({ error: 'El usuario ya existe' }, 409);
  await audit(actor, 'user.create', username);
  return privateJson({ id }, 201);
}
export async function PATCH(request: Request) {
  const actor = await getAdmin();
  if (actor?.role !== 'owner' || !sameOrigin(request))
    return privateJson({ error: 'Acceso restringido' }, 403);
  let body: Record<string, unknown>;
  try {
    body = await boundedJson(request);
  } catch {
    return privateJson({ error: 'Solicitud inválida' }, 400);
  }
  if (typeof body.id !== 'string' || body.id.length > 64)
    return privateJson({ error: 'Usuario inválido' }, 400);
  const target = await env.DB.prepare(
    'SELECT id,username,role,active FROM admin_users WHERE id=?',
  )
    .bind(body.id)
    .first<{ id: string; username: string; role: string; active: number }>();
  if (!target) return privateJson({ error: 'Usuario no encontrado' }, 404);
  if (body.action === 'password') {
    if (!validNewPassword(body.password))
      return privateJson(
        { error: 'La contraseña debe tener entre 16 y 256 caracteres.' },
        400,
      );
    await env.DB.batch([
      env.DB.prepare('UPDATE admin_users SET password_hash=? WHERE id=?').bind(
        await hashPassword(body.password),
        body.id,
      ),
      env.DB.prepare('DELETE FROM admin_sessions WHERE user_id=?').bind(
        body.id,
      ),
    ]);
    await audit(actor, 'user.password_reset', target.username);
    return privateJson({ ok: true, reauthenticate: actor.id === body.id });
  }
  if (body.action === 'active' && typeof body.active === 'boolean') {
    if (body.id === actor.id && !body.active)
      return privateJson(
        { error: 'No puedes desactivar tu propia cuenta.' },
        409,
      );
    // Conditional UPDATE protects the last owner even across simultaneous requests.
    const result = await env.DB.prepare(
      `UPDATE admin_users SET active=? WHERE id=? AND (?=1 OR role<>'owner' OR (SELECT count(*) FROM admin_users WHERE role='owner' AND active=1)>1)`,
    )
      .bind(body.active ? 1 : 0, body.id, body.active ? 1 : 0)
      .run();
    if (!result.meta.changes)
      return privateJson(
        { error: 'Debe quedar al menos un propietario activo.' },
        409,
      );
    if (!body.active)
      await env.DB.prepare('DELETE FROM admin_sessions WHERE user_id=?')
        .bind(body.id)
        .run();
    await audit(
      actor,
      body.active ? 'user.activate' : 'user.deactivate',
      target.username,
    );
    return privateJson({ ok: true });
  }
  return privateJson({ error: 'Operación inválida' }, 400);
}
