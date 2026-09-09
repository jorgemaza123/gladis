import { env } from 'cloudflare:workers';
export async function GET(_request: Request, {params}: {params:Promise<{id:string}>}) {
  const {id} = await params;
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return new Response(null,{status:404});
  const object = await env.MEDIA.get(id);
  if (!object) return new Response(null,{status:404});
  return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType || 'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff'}});
}
