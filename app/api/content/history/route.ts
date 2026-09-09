import { env } from 'cloudflare:workers';
import { getAdmin } from '@/lib/auth';
export async function GET() {
  if (!(await getAdmin())) return new Response(null, { status: 403 });
  const result = await env.DB.prepare(
    'SELECT id,version,created_at AS createdAt,actor,summary FROM content_history ORDER BY created_at DESC LIMIT 30',
  ).all();
  return Response.json(
    { items: result.results },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
