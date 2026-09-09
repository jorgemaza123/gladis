import { env } from 'cloudflare:workers';
import { isAdmin, sameOrigin, getAdmin, audit } from '@/lib/auth';
import { imageInfo } from '@/lib/image-info';
export async function POST(request: Request) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return new Response('No tienes permiso para subir imágenes.', {
      status: 403,
    });
  if (Number(request.headers.get('content-length')) > 10_000_000)
    return new Response('La carga supera 10 MB.', { status: 413 });
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File))
      return new Response('Selecciona una imagen.', { status: 400 });
    const fields = [
      'file',
      ...Array.from(form.keys()).filter((k) => /^variant-[1-4]$/.test(k)),
    ];
    if (fields.length > 5)
      return new Response('Demasiadas variantes.', { status: 400 });
    const prepared = [];
    let size = 0;
    for (const field of fields) {
      const image = form.get(field);
      if (!(image instanceof File) || image.size > 5_000_000)
        return new Response('Cada imagen debe pesar menos de 5 MB.', {
          status: 400,
        });
      size += image.size;
      if (size > 10_000_000)
        return new Response('La carga supera 10 MB.', { status: 413 });
      const bytes = new Uint8Array(await image.arrayBuffer());
      const info = imageInfo(bytes);
      if (!info)
        return new Response(
          'Imagen inválida, animada o dimensiones no admitidas.',
          { status: 400 },
        );
      prepared.push({ bytes, info, id: crypto.randomUUID() });
    }
    const main = prepared[0];
    const variants = [];
    for (const item of prepared) {
      await env.MEDIA.put(item.id, item.bytes, {
        httpMetadata: { contentType: item.info.type },
      });
      variants.push({
        url: `/api/media/${item.id}`,
        width: item.info.width,
        height: item.info.height,
        bytes: item.bytes.length,
      });
    }
    const createdAt = new Date().toISOString();
    await env.DB.prepare(
      'INSERT INTO media_objects(id,keys,created_at) VALUES(?,?,?)',
    )
      .bind(main.id, JSON.stringify(prepared.map((p) => p.id)), createdAt)
      .run();
    await audit(await getAdmin(), 'media.upload', main.id);
    const name = form.get('name');
    return Response.json({
      id: main.id,
      url: `/api/media/${main.id}`,
      alt: (typeof name === 'string' && name
        ? name
        : file.name.replace(/\.[^.]+$/, '')
      ).slice(0, 300),
      caption: '',
      demo: false,
      width: main.info.width,
      height: main.info.height,
      bytes: main.bytes.length,
      variants,
      focalX: 50,
      focalY: 50,
      tags: [],
      createdAt,
    });
  } catch {
    return new Response('No se pudo procesar la foto. Intenta nuevamente.', {
      status: 400,
    });
  }
}
