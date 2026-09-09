'use client';
import { useState } from 'react';
import type { MediaAsset } from '@/models/content';
export function Photo({
  asset,
  priority = false,
  sizes = '(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 640px',
}: {
  asset?: MediaAsset;
  priority?: boolean;
  sizes?: string;
}) {
  const [failedUrl, setFailedUrl] = useState('');
  const variants = asset?.variants
    ?.filter((v) => v.width > 0)
    .sort((a, b) => a.width - b.width);
  return (
    <div className="photo">
      {asset && failedUrl !== asset.url ? (
        <img
          src={variants?.length ? variants[variants.length - 1].url : asset.url}
          srcSet={
            variants?.map((v) => `${v.url} ${v.width}w`).join(', ') || undefined
          }
          sizes={sizes}
          alt={asset.alt}
          width={asset.width || 1200}
          height={asset.height || 900}
          style={{
            objectPosition: `${asset.focalX ?? 50}% ${asset.focalY ?? 50}%`,
          }}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailedUrl(asset.url)}
        />
      ) : (
        <svg
          className="photo-empty"
          aria-label={asset?.alt || 'Imagen por añadir'}
          viewBox="0 0 100 100"
        >
          <title>{asset?.alt || 'Imagen por añadir'}</title>
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="16"
            fill="currentColor"
            aria-hidden="true"
          >
            ✳
          </text>
        </svg>
      )}
    </div>
  );
}
