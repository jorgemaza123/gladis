import { env } from 'cloudflare:workers';
import { getAdmin, sameOrigin } from '@/lib/auth';
import { readSite } from '@/repositories/site';
async function unused() {
  const site = await readSite();
  const urls = new Set(
    site.media.flatMap((m) => [m.url, ...(m.variants || []).map((v) => v.url)]),
  );
  const versions = await env.DB.prepare(
    'SELECT snapshot FROM content_history',
  ).all<{ snapshot: string }>();
  for (const row of versions.results) {
    const snapshot = JSON.parse(row.snapshot);
    for (const m of snapshot.media || [])
      for (const u of [
        m.url,
        ...(m.variants || []).map((v: { url: string }) => v.url),
      ])
        urls.add(u);
  }
  const cutoff = new Date(Date.now() - 86400000).toISOString();
  const rows = await env.DB.prepare(
    'SELECT id,keys FROM media_objects WHERE created_at<? LIMIT 100',
  )
    .bind(cutoff)
    .all<{ id: string; keys: string }>();
  return rows.results.filter((r) =>
    (JSON.parse(r.keys) as string[]).every((k) => !urls.has(`/api/media/${k}`)),
  );
}
export async function GET() {
  if ((await getAdmin())?.role !== 'owner')
    return new Response(null, { status: 403 });
  const items = await unused();
  return Response.json(
    { count: items.length },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
export async function POST(request: Request) {
  const actor = await getAdmin();
  if (!sameOrigin(request) || actor?.role !== 'owner')
    return new Response(null, { status: 403 });
  // R2 deletion cannot be made atomic with a concurrent content save yet.
  // Keep inventory available, but never delete a file based on a stale snapshot.
  return Response.json(
    {
      error:
        'La eliminación está desactivada para proteger imágenes referenciadas por ediciones simultáneas. El reporte sigue disponible.',
    },
    { status: 409, headers: { 'Cache-Control': 'no-store' } },
  );
}
