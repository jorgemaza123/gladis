import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import {
  getAdmin,
  sameOrigin,
  privateJson,
  boundedJson,
  digest,
  audit,
} from '@/lib/auth';
export async function GET() {
  if ((await getAdmin())?.role !== 'owner')
    return privateJson({ error: 'Acceso restringido' }, 403);
  const token = (await cookies()).get('cms_session')?.value || '';
  const rows = await env.DB.prepare(
    `SELECT s.id,u.username,s.created_at,s.expires_at,s.user_agent,(s.token_hash=?) AS current FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.expires_at>? ORDER BY s.created_at DESC LIMIT 100`,
  )
    .bind(await digest(token), Date.now())
    .all();
  return privateJson({ sessions: rows.results });
}
export async function DELETE(request: Request) {
  const actor = await getAdmin();
  if (actor?.role !== 'owner' || !sameOrigin(request))
    return privateJson({ error: 'Acceso restringido' }, 403);
  let body: Record<string, unknown>;
  try {
    body = await boundedJson(request);
  } catch {
    return privateJson({ error: 'Solicitud inválida' }, 400);
  }
  if (typeof body.id !== 'string' || body.id.length > 64)
    return privateJson({ error: 'Sesión inválida' }, 400);
  await env.DB.prepare('DELETE FROM admin_sessions WHERE id=?')
    .bind(body.id)
    .run();
  await audit(actor, 'session.revoke', body.id);
  return privateJson({ ok: true });
}
