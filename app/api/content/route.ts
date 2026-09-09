import { isAdmin, sameOrigin } from '@/lib/auth';
import { readSite, saveSite } from '@/repositories/site';
export async function GET() {
  if (!await isAdmin()) return new Response('Acceso no autorizado.', {status:403});
  return Response.json(await readSite(), {headers:{'Cache-Control':'no-store'}});
}
export async function PUT(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return new Response('Inicia sesión de nuevo.', {status:403});
  const raw = await request.text();
  if (raw.length > 1_000_000) return new Response('El contenido supera el límite de esta primera versión.', {status:413});
  try { return Response.json(await saveSite(JSON.parse(raw)), {headers:{'Cache-Control':'no-store'}}); }
  catch (error) {
    if (error instanceof Error && error.message === 'CONFLICT') return new Response('Otra sesión guardó cambios. Recarga antes de volver a editar.', {status:409});
    const e = error as {issues?: {message:string}[]};
    return new Response(e.issues?.map(i => i.message).join(' ') || 'No se pudo guardar. Revisa los datos e intenta nuevamente.', {status:400});
  }
}
