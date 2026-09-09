import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import {
  randomToken,
  digest,
  validPassword,
  sameOrigin,
  hashPassword,
  verifyPassword,
  boundedJson,
  privateJson,
  audit,
  getAdmin,
  SESSION_SECONDS,
  type AdminActor,
} from '@/lib/auth';

async function takeAttempt(key: string, maximum: number) {
  const now = Date.now();
  const result = await env.DB.prepare(
    `INSERT INTO admin_login_limits (id,attempts,reset_at) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET attempts=CASE WHEN reset_at<=? THEN 1 ELSE attempts+1 END, reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END RETURNING attempts,reset_at`,
  )
    .bind(await digest(key), now + 15 * 60 * 1000, now, now)
    .first<{ attempts: number; reset_at: number }>();
  return result && result.attempts <= maximum;
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return privateJson({ error: 'Origen no permitido' }, 403);
  let body: Record<string, unknown>;
  try {
    body = await boundedJson(request);
  } catch {
    return privateJson({ error: 'Solicitud inválida' }, 400);
  }
  const password = body.password;
  const username =
    typeof body.username === 'string' && body.username.trim()
      ? body.username.trim().toLowerCase()
      : 'owner-bootstrap';
  if (
    typeof password !== 'string' ||
    password.length < 1 ||
    password.length > 256 ||
    !/^[a-z0-9][a-z0-9._-]{2,63}$/.test(username)
  )
    return privateJson({ error: 'Credenciales inválidas' }, 400);
  // Only the trusted Cloudflare header is used; forwarded headers are spoofable.
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  const ipAllowed = await takeAttempt(`ip:${ip}`, 30);
  const accountAllowed = await takeAttempt(`account:${username}`, 10);
  if (!ipAllowed || !accountAllowed)
    return Response.json(
      { error: 'Demasiados intentos. Espera 15 minutos.' },
      {
        status: 429,
        headers: { 'Retry-After': '900', 'Cache-Control': 'no-store' },
      },
    );
  let user = await env.DB.prepare(
    'SELECT id,username,role,password_hash,active FROM admin_users WHERE username=?',
  )
    .bind(username)
    .first<AdminActor & { password_hash: string; active: number }>();
  if (
    !user &&
    username === 'owner-bootstrap' &&
    (await validPassword(password))
  ) {
    await env.DB.prepare(
      'INSERT OR IGNORE INTO admin_users (id,username,password_hash,role,active,created_at) VALUES (?,?,?,?,1,?)',
    )
      .bind(
        crypto.randomUUID(),
        username,
        await hashPassword(password),
        'owner',
        Date.now(),
      )
      .run();
    user = await env.DB.prepare(
      'SELECT id,username,role,password_hash,active FROM admin_users WHERE username=?',
    )
      .bind(username)
      .first<AdminActor & { password_hash: string; active: number }>();
  }
  // Spend the same password derivation work for unknown and inactive accounts.
  const verified = await verifyPassword(
    password,
    user?.password_hash ||
      `pbkdf2-sha256$100000$${'0'.repeat(64)}$${'0'.repeat(64)}`,
  );
  if (!user || !user.active || !verified)
    return privateJson({ error: 'Usuario o contraseña incorrectos.' }, 401);
  const token = randomToken(),
    now = Date.now();
  await env.DB.batch([
    env.DB.prepare('DELETE FROM admin_sessions WHERE expires_at<=?').bind(now),
    env.DB.prepare('DELETE FROM admin_login_limits WHERE reset_at<=?').bind(
      now,
    ),
    env.DB.prepare(
      'INSERT INTO admin_sessions (id,token_hash,user_id,created_at,expires_at,user_agent) VALUES (?,?,?,?,?,?)',
    ).bind(
      crypto.randomUUID(),
      await digest(token),
      user.id,
      now,
      now + SESSION_SECONDS * 1000,
      (request.headers.get('user-agent') || 'Desconocido').slice(0, 200),
    ),
  ]);
  await audit(user, 'session.login', user.id);
  return new Response(null, {
    status: 204,
    headers: {
      'Set-Cookie': `cms_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`,
      'Cache-Control': 'no-store',
    },
  });
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request))
    return privateJson({ error: 'Origen no permitido' }, 403);
  const actor = await getAdmin();
  const token = (await cookies()).get('cms_session')?.value;
  if (token && /^[a-f0-9]{64}$/.test(token))
    await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash=?')
      .bind(await digest(token))
      .run();
  if (actor) await audit(actor, 'session.logout', actor.id);
  return new Response(null, {
    status: 204,
    headers: {
      'Set-Cookie': `cms_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`,
      'Cache-Control': 'no-store',
    },
  });
}
