import type { Metadata } from 'next';
import type { SiteContent, SEOFields } from '@/models/content';
export function metadataFor(site: SiteContent, fields: SEOFields, path: string, imageId?: string): Metadata {
  const {settings} = site;
  const canonical = settings.origin ? `${settings.origin.replace(/\/$/,'')}${path}` : undefined;
  const image = site.media.find(m=>m.id===imageId);
  const imageUrl = image && (image.url.startsWith('https://') ? image.url : settings.origin ? `${settings.origin.replace(/\/$/,'')}${image.url}` : undefined);
  const index = settings.indexable && !settings.demo && !fields.noindex;
  return {title:fields.title || settings.seo.title,description:fields.description || settings.seo.description,alternates:canonical?{canonical}:undefined,robots:{index,follow:index},openGraph:{title:fields.title,description:fields.description,locale:'es_PE',type:'website',url:canonical,siteName:settings.name,images:imageUrl?[{url:imageUrl,alt:image?.alt}]:[]},twitter:{card:imageUrl?'summary_large_image':'summary',title:fields.title,description:fields.description,images:imageUrl?[imageUrl]:[]}};
}
