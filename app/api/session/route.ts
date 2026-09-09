import { sessionToken, validPassword, sameOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return new Response('Origen no permitido', {status:403});
  if (Number(request.headers.get('content-length')) > 4096) return new Response('Solicitud demasiado grande', {status:413});
  let password: unknown;
  try { password = (await request.json() as {password?:unknown}).password; } catch { return new Response('Solicitud inválida', {status:400}); }
  if (typeof password !== 'string' || password.length > 256 || !await validPassword(password)) return new Response('La clave no es correcta o el acceso aún no está configurado.', {status:401});
  return new Response(null, {status:204, headers:{'Set-Cookie':`cms_session=${await sessionToken()}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`,'Cache-Control':'no-store'}});
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return new Response(null,{status:403});
  return new Response(null,{status:204,headers:{'Set-Cookie':'cms_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'}});
}
