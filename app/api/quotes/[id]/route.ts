import { env } from 'cloudflare:workers';
import { getAdmin, isAdmin, sameOrigin, audit } from '@/lib/auth';
import { getQuote } from '@/repositories/quotes';
import { quoteStatuses } from '@/models/content';
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return new Response(null, { status: 403 });
  const { id } = await params;
  const raw = await request.text();
  if (raw.length > 12000)
    return new Response('Notas demasiado largas.', { status: 413 });
  try {
    const data = JSON.parse(raw);
    if (
      !Number.isInteger(data.version) ||
      !quoteStatuses.includes(data.status) ||
      typeof data.notes !== 'string' ||
      data.notes.length > 5000
    )
      return new Response('Datos inválidos.', { status: 400 });
    const result = await env.DB.prepare(
      'UPDATE quotes SET status=?,notes=?,updated_at=?,version=version+1 WHERE id=? AND version=?',
    )
      .bind(data.status, data.notes, new Date().toISOString(), id, data.version)
      .run();
    if (!result.meta.changes)
      return new Response('La solicitud cambió en otra sesión. Recarga.', {
        status: 409,
      });
    await audit(await getAdmin(), 'quote.update', id);
    return Response.json(await getQuote(id), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response('No se pudo actualizar.', { status: 400 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const actor = await getAdmin();
  if (!sameOrigin(request) || actor?.role !== 'owner')
    return new Response(
      'Solo el propietario puede eliminar datos personales.',
      { status: 403 },
    );
  const { id } = await params;
  let version: unknown;
  try {
    version = ((await request.json()) as { version?: unknown }).version;
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!Number.isInteger(version)) return new Response(null, { status: 400 });
  const result = await env.DB.prepare(
    'DELETE FROM quotes WHERE id=? AND version=?',
  )
    .bind(id, version)
    .run();
  if (!result.meta.changes)
    return new Response('La solicitud cambió. Recarga.', { status: 409 });
  await audit(actor, 'quote.delete', id);
  return new Response(null, { status: 204 });
}
