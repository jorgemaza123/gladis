import { env } from 'cloudflare:workers';
import { isAdmin, sameOrigin } from '@/lib/auth';
export async function POST(request: Request) {
  if (!sameOrigin(request) || !await isAdmin()) return new Response('Inicia sesión de nuevo.',{status:403});
  if (Number(request.headers.get('content-length')) > 5_300_000) return new Response('Máximo 5 MB por imagen.',{status:413});
  const file = (await request.formData()).get('file');
  if (!(file instanceof File) || file.size > 5_000_000 || file.size < 12) return new Response('Selecciona una imagen de hasta 5 MB.',{status:400});
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png = [137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v);
  const jpeg = bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
  const webp = new TextDecoder().decode(bytes.slice(0,4))==='RIFF' && new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
  const type = png ? 'image/png' : jpeg ? 'image/jpeg' : webp ? 'image/webp' : '';
  if (!type) return new Response('Admitimos JPG, PNG y WebP.',{status:400});
  const id = crypto.randomUUID();
  await env.MEDIA.put(id,bytes,{httpMetadata:{contentType:type}});
  return Response.json({id,url:`/api/media/${id}`,alt:file.name.replace(/\.[^.]+$/,''),caption:'',demo:false});
}
