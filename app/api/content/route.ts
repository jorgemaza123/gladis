import { isAdmin, sameOrigin, getAdmin, audit } from '@/lib/auth';
import { readSite, saveSite, listEntries } from '@/repositories/site';
export async function GET(request: Request) {
  if (!(await getAdmin()))
    return new Response('Acceso no autorizado.', { status: 403 });
  const u = new URL(request.url);
  if (u.searchParams.get('collection') === 'entries')
    return Response.json(
      await listEntries({
        kind: u.searchParams.get('kind') || undefined,
        status: u.searchParams.get('status') || undefined,
        page: Number(u.searchParams.get('page')) || 1,
      }),
      { headers: { 'Cache-Control': 'no-store' } },
    );
  return Response.json(await readSite(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
export async function PUT(request: Request) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return new Response(
      'No tienes permiso para editar. Inicia sesión de nuevo.',
      { status: 403 },
    );
  const raw = await request.text();
  if (raw.length > 8_000_000)
    return new Response(
      'El lote es demasiado grande. Guarda en grupos más pequeños.',
      { status: 413 },
    );
  try {
    const actor = await getAdmin();
    const saved = await saveSite(JSON.parse(raw), actor?.username);
    await audit(actor, 'content.save', String(saved.version));
    return Response.json(saved, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof Error && error.message === 'CONFLICT')
      return new Response(
        'Otra sesión guardó cambios. Recarga antes de continuar; no sobrescribimos su trabajo.',
        { status: 409 },
      );
    const e = error as { issues?: { message: string }[] };
    return new Response(
      e.issues?.map((i) => i.message).join(' ') ||
        (error instanceof Error && error.message.startsWith('Esta URL')
          ? error.message
          : 'No se pudo guardar. Los cambios permanecen en el editor.'),
      { status: 400 },
    );
  }
}
