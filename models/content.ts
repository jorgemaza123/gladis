export type SEOFields = { title: string; description: string; noindex: boolean };
export type MediaAsset = { id: string; url: string; alt: string; caption: string; demo: boolean };
export type ContentKind = 'servicios' | 'menus' | 'eventos' | 'complementos' | 'paginas';
export type ContentEntry = {
  id: string; kind: ContentKind; slug: string; title: string; description: string;
  body: string; imageId: string; status: 'draft' | 'published'; sortOrder: number;
  featured: boolean; details: string[]; seo: SEOFields;
};
export type PageSection = { id: string; type: 'hero' | 'servicios' | 'menus' | 'texto' | 'faq' | 'cta'; title: string; description: string; imageId: string; visible: boolean; sortOrder: number };
export type SiteSettings = { name: string; tagline: string; whatsapp: string; whatsappMessage: string; email: string; origin: string; indexable: boolean; demo: boolean; seo: SEOFields; navigation: { label: string; href: string }[]; footer: string };
export type SiteContent = { version: number; settings: SiteSettings; entries: ContentEntry[]; media: MediaAsset[]; sections: PageSection[]; faqs: { id: string; question: string; answer: string }[] };
