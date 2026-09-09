'use client';
import { useState } from 'react';
import type { MediaAsset } from '@/models/content';
export function Photo({asset,priority=false}:{asset?:MediaAsset;priority?:boolean}) {
  const [failed,setFailed]=useState(false);
  return <div className="photo">{asset&&!failed ? <img key={asset.url} src={asset.url} alt={asset.alt} width={1200} height={900} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async" onError={()=>setFailed(true)}/> : <div className="photo-empty">Imagen por añadir</div>}</div>;
}
