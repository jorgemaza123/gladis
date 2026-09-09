export type SEOFields = {
  title: string;
  description: string;
  noindex: boolean;
  imageId?: string;
  canonical?: string;
};
export const contentKinds = [
  'servicios',
  'menus',
  'platos',
  'modalidades',
  'paquetes',
  'tipos-evento',
  'eventos',
  'complementos',
  'cobertura',
  'testimonios',
  'paginas',
] as const;
export type ContentKind = (typeof contentKinds)[number];
export type MediaVariant = {
  url: string;
  width: number;
  height: number;
  bytes: number;
};
export type MediaAsset = {
  id: string;
  url: string;
  alt: string;
  caption: string;
  demo: boolean;
  width?: number;
  height?: number;
  bytes?: number;
  variants?: MediaVariant[];
  focalX?: number;
  focalY?: number;
  tags?: string[];
  createdAt?: string;
};
export type Price = {
  mode: 'consult' | 'fixed' | 'from';
  amount: number | null;
  currency: 'PEN';
  unit: 'person' | 'event' | 'unit';
  minimum: number | null;
  conditions: string;
};
export type ContentEntry = {
  id: string;
  kind: ContentKind;
  slug: string;
  title: string;
  description: string;
  body: string;
  imageId: string;
  status: 'draft' | 'published' | 'archived';
  sortOrder: number;
  featured: boolean;
  details: string[];
  seo: SEOFields;
  category: string;
  imageIds: string[];
  dishIds: string[];
  menuIds: string[];
  serviceIds: string[];
  modalityIds: string[];
  addOnIds: string[];
  eventTypeIds: string[];
  excluded: string[];
  price: Price;
  minimumGuests: number | null;
  dietary: string[];
  dietaryConfirmed: boolean;
  district: string;
  eventDate: string;
  guestCount: number | null;
  attribution: string;
  verified: boolean;
  provider: 'own' | 'partner' | '';
  createdAt: string;
  updatedAt: string;
};
export type SectionType =
  | 'hero'
  | 'servicios'
  | 'menus'
  | 'texto'
  | 'faq'
  | 'cta'
  | 'galeria'
  | 'modalidades'
  | 'complementos'
  | 'testimonios'
  | 'pasos'
  | 'cobertura'
  | 'eventos'
  | 'tipos-evento';
export type PageSection = {
  id: string;
  type: SectionType;
  title: string;
  description: string;
  imageId: string;
  visible: boolean;
  sortOrder: number;
  eyebrow?: string;
  entryIds?: string[];
  imageIds?: string[];
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: 'standard' | 'alternate';
  steps?: { title: string; description: string }[];
};
export type CatalogConfig = {
  title: string;
  description: string;
  seo: SEOFields;
};
export type PublicCopy = {
  location: string;
  primaryCta: string;
  secondaryCta: string;
  viewAll: string;
  inquire: string;
  footerHeading: string;
  emptyTitle: string;
  emptyDescription: string;
  galleryTitle: string;
  includedTitle: string;
  excludedTitle: string;
  relatedTitle: string;
  coverageTitle: string;
  quoteTitle: string;
  quoteDescription: string;
  quoteAsideTitle: string;
  quoteAsideDescription: string;
  consent: string;
  privacyTitle: string;
  privacyBody: string;
  successTitle: string;
  successDescription: string;
  demoNotice: string;
};
export type SiteSettings = {
  name: string;
  tagline: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  origin: string;
  indexable: boolean;
  demo: boolean;
  seo: SEOFields;
  navigation: { label: string; href: string }[];
  footer: string;
  logoId: string;
  palette: 'olive' | 'terracotta' | 'cacao';
  typography: 'editorial' | 'classic';
  animations: boolean;
  motionLevel: 'subtle' | 'off';
  catalogs: Record<ContentKind, CatalogConfig>;
  copy: PublicCopy;
  businessVerified: boolean;
  publicAddress: string;
  hours: string;
  socialLinks: { label: string; url: string }[];
  analyticsConsentText: string;
};
export type SiteContent = {
  version: number;
  settings: SiteSettings;
  entries: ContentEntry[];
  media: MediaAsset[];
  sections: PageSection[];
  faqs: { id: string; question: string; answer: string }[];
};
export const quoteStatuses = [
  'new',
  'reviewing',
  'quoted',
  'confirmed',
  'closed',
] as const;
export type QuoteStatus = (typeof quoteStatuses)[number];
export type QuoteInput = {
  requestId: string;
  eventTypeId: string;
  eventTypeOther: string;
  date: string;
  district: string;
  people: number;
  selectionId: string;
  modalityId: string;
  addOnIds: string[];
  budget: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  consent: boolean;
  website: string;
  startedAt: number;
};
export type QuoteRequest = {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: QuoteStatus;
  notes: string;
  version: number;
  demo: boolean;
  input: QuoteInput;
  snapshot: {
    selection: string;
    modality: string;
    addOns: string[];
    eventType: string;
    price: Price | null;
    consentText: string;
  };
};
