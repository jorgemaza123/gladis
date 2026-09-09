import { env } from 'cloudflare:workers';
import { isAdmin, sameOrigin, getAdmin, audit } from '@/lib/auth';
import { saveSite } from '@/repositories/site';
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return new Response(null, { status: 403 });
  const { id } = await params;
  const row = await env.DB.prepare(
    'SELECT snapshot FROM content_history WHERE id=?',
  )
    .bind(id)
    .first<{ snapshot: string }>();
  if (!row) return new Response('Versión no encontrada.', { status: 404 });
  try {
    const { version } = (await request.json()) as { version: number };
    if (!Number.isInteger(version))
      return new Response('Versión inválida.', { status: 400 });
    const actor = await getAdmin();
    const result = await saveSite(
      { ...JSON.parse(row.snapshot), version },
      actor?.username,
    );
    await audit(actor, 'content.restore', id);
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return new Response(
      e instanceof Error && e.message === 'CONFLICT'
        ? 'Otra sesión guardó cambios. Recarga.'
        : 'No se pudo restaurar esta versión.',
      { status: e instanceof Error && e.message === 'CONFLICT' ? 409 : 400 },
    );
  }
}
