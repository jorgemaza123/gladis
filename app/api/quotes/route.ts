import { getAdmin, sameOrigin, boundedJson } from '@/lib/auth';
import { createQuote, listQuotes } from '@/repositories/quotes';
import { quoteStatuses } from '@/models/content';
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return new Response('Origen no permitido.', { status: 403 });
  try {
    const input = await boundedJson(request, 16000);
    return Response.json(
      await createQuote(
        input,
        request.headers.get('cf-connecting-ip') || 'local',
      ),
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Solicitud demasiado grande'
    )
      return new Response('Solicitud demasiado grande.', { status: 413 });
    if (error instanceof SyntaxError)
      return new Response('Solicitud inválida.', { status: 400 });
    const issues = (
      error as { issues?: { path: PropertyKey[]; message: string }[] }
    ).issues;
    if (issues)
      return Response.json(
        {
          message: 'Revisa los campos indicados.',
          errors: Object.fromEntries(
            issues.map((i) => [String(i.path[0] || 'form'), i.message]),
          ),
        },
        { status: 400 },
      );
    if (error instanceof Error && error.message === 'RATE_LIMIT')
      return new Response(
        'Se alcanzó el límite de solicitudes. Intenta más tarde.',
        { status: 429, headers: { 'Retry-After': '3600' } },
      );
    return new Response(
      error instanceof Error
        ? error.message
        : 'No se pudo guardar. Tus datos se conservan para reintentar.',
      { status: 400 },
    );
  }
}
export async function GET(request: Request) {
  if (!(await getAdmin())) return new Response(null, { status: 403 });
  const u = new URL(request.url),
    status = u.searchParams.get('status') || '';
  if (
    status &&
    !quoteStatuses.includes(status as (typeof quoteStatuses)[number])
  )
    return new Response('Estado inválido.', { status: 400 });
  const page = Math.max(
    1,
    Math.min(100000, Number(u.searchParams.get('page')) || 1),
  );
  return Response.json(
    await listQuotes(
      page,
      status,
      (u.searchParams.get('q') || '').slice(0, 150),
    ),
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
