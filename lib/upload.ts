import type { MediaAsset } from '@/models/content';
/** Resize before upload: no third-party request, no original stored, no upscaling. */
export async function uploadImage(file: File): Promise<MediaAsset> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('Selecciona JPG, PNG o WebP.');
  if (file.size > 10_000_000)
    throw new Error(
      'La foto de origen supera 10 MB. Reduce su tamaño antes de subirla.',
    );
  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  });
  try {
    if (bitmap.width * bitmap.height > 24_000_000)
      throw new Error('La foto supera 24 megapíxeles. Reduce sus dimensiones.');
    const widths = Array.from(
      new Set([480, 960, 1600].map((w) => Math.min(w, bitmap.width))),
    ).sort((a, b) => b - a);
    const form = new FormData();
    const manifest: {
      field: string;
      width: number;
      height: number;
      bytes: number;
    }[] = [];
    for (const [i, width] of widths.entries()) {
      const height = Math.max(
        1,
        Math.round((bitmap.height * width) / bitmap.width),
      );
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('El navegador no pudo procesar la imagen.');
      context.drawImage(bitmap, 0, 0, width, height);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) =>
            b
              ? resolve(b)
              : reject(new Error('No se pudo comprimir la imagen.')),
          'image/webp',
          0.82,
        ),
      );
      if (blob.size > 5_000_000)
        throw new Error(
          'La imagen sigue siendo demasiado grande después de optimizarla.',
        );
      const field = i === 0 ? 'file' : `variant-${i}`;
      form.set(field, blob, `${file.name.replace(/\.[^.]+$/, '')}.webp`);
      manifest.push({ field, width, height, bytes: blob.size });
      canvas.width = 1;
      canvas.height = 1;
    }
    form.set('manifest', JSON.stringify(manifest));
    form.set('name', file.name.replace(/\.[^.]+$/, ''));
    const response = await fetch('/api/media', { method: 'POST', body: form });
    if (!response.ok) throw new Error(await response.text());
    return (await response.json()) as MediaAsset;
  } finally {
    bitmap.close();
  }
}
