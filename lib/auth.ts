import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';

export type AdminRole = 'owner' | 'editor' | 'viewer';
export type AdminActor = { id: string; username: string; role: AdminRole };
const encoder = new TextEncoder();
const hex = (bytes: ArrayBuffer | Uint8Array) =>
  Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
export const SESSION_SECONDS = 8 * 60 * 60;
export const randomToken = () =>
  hex(crypto.getRandomValues(new Uint8Array(32)));
export async function digest(value: string) {
  return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}
function equal(a: string, b: string) {
  let difference = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return difference === 0;
}
// Workerd caps WebCrypto PBKDF2 at 100,000 iterations. A random 256-bit salt,
// long passphrases and persistent account/IP throttling complement this limit.
export async function hashPassword(password: string, salt = randomToken()) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: encoder.encode(salt),
      iterations: 100000,
    },
    key,
    256,
  );
  return `pbkdf2-sha256$100000$${salt}$${hex(bits)}`;
}
export async function verifyPassword(password: string, stored: string) {
  const parts = stored.split('$');
  if (
    parts.length !== 4 ||
    parts[0] !== 'pbkdf2-sha256' ||
    parts[1] !== '100000' ||
    !/^[a-f0-9]{64}$/.test(parts[2]) ||
    !/^[a-f0-9]{64}$/.test(parts[3])
  )
    return false;
  return equal(await hashPassword(password, parts[2]), stored);
}
export async function validPassword(password: string) {
  return (
    typeof env.ADMIN_PASSWORD === 'string' &&
    env.ADMIN_PASSWORD.length >= 24 &&
    equal(await digest(password), await digest(env.ADMIN_PASSWORD))
  );
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}
export async function getAdmin(): Promise<AdminActor | null> {
  const token = (await cookies()).get('cms_session')?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return await env.DB.prepare(
    `SELECT u.id, u.username, u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1`,
  )
    .bind(await digest(token), Date.now())
    .first<AdminActor>();
}
export async function isAdmin() {
  const actor = await getAdmin();
  return !!actor && (actor.role === 'owner' || actor.role === 'editor');
}
export async function audit(
  actor: AdminActor | null,
  action: string,
  target: string,
) {
  await env.DB.prepare(
    'INSERT INTO admin_audit (id,actor_id,actor_name,action,target,created_at) VALUES (?,?,?,?,?,?)',
  )
    .bind(
      crypto.randomUUID(),
      actor?.id || 'anonymous',
      actor?.username || 'anonymous',
      action.slice(0, 100),
      target.slice(0, 200),
      Date.now(),
    )
    .run();
}
export async function boundedJson(
  request: Request,
  limit = 4096,
): Promise<Record<string, unknown>> {
  if (Number(request.headers.get('content-length')) > limit)
    throw new Error('Solicitud demasiado grande');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Solicitud vacía');
  let total = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new Error('Solicitud demasiado grande');
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  const parsed = JSON.parse(new TextDecoder().decode(buffer));
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    throw new Error('Solicitud inválida');
  return parsed;
}
export const privateJson = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export const validUsername = (value: unknown): value is string =>
  typeof value === 'string' && /^[a-z0-9][a-z0-9._-]{2,63}$/.test(value);
export const validNewPassword = (value: unknown): value is string =>
  typeof value === 'string' && value.length >= 16 && value.length <= 256;
