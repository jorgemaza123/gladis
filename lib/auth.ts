import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';

async function digest(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
}
export async function sessionToken() {
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 24) return null;
  // Rotates daily; also invalidated whenever the server password is changed.
  return digest(`${env.ADMIN_PASSWORD}:cms:${new Date().toISOString().slice(0,10)}`);
}
export async function isAdmin() {
  const expected = await sessionToken();
  const actual = (await cookies()).get('cms_session')?.value;
  return !!expected && !!actual && await digest(actual) === await digest(expected);
}
export async function validPassword(password: string) {
  return !!env.ADMIN_PASSWORD && env.ADMIN_PASSWORD.length >= 24 && await digest(password) === await digest(env.ADMIN_PASSWORD);
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin;
}
