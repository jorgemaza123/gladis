import { env } from 'cloudflare:workers';
import { getAdmin, privateJson } from '@/lib/auth';
export async function GET() {
  if ((await getAdmin())?.role !== 'owner')
    return privateJson({ error: 'Acceso restringido' }, 403);
  const rows = await env.DB.prepare(
    'SELECT id,actor_name,action,target,created_at FROM admin_audit ORDER BY created_at DESC LIMIT 100',
  ).all();
  return privateJson({ events: rows.results });
}
