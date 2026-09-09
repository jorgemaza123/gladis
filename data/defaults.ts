import {
  contentKinds,
  type ContentEntry,
  type SiteContent,
  type SiteSettings,
  type PublicCopy,
  type ContentKind,
} from '@/models/content';
export const kindLabels: Record<ContentKind, string> = {
  servicios: 'Servicios de catering',
  menus: 'Menús para compartir',
  platos: 'Platos',
  modalidades: 'Modalidades de servicio',
  paquetes: 'Paquetes',
  'tipos-evento': 'Tipos de evento',
  eventos: 'Eventos realizados',
  complementos: 'Complementos',
  cobertura: 'Zonas de atención',
  testimonios: 'Experiencias de nuestros clientes',
  paginas: 'Conócenos',
};
export const emptySeo = () => ({ title: '', description: '', noindex: false });
export const emptyEntry = (): ContentEntry => ({
  id: '',
  kind: 'servicios',
  slug: '',
  title: '',
  description: '',
  body: '',
  imageId: '',
  status: 'draft',
  sortOrder: 0,
  featured: false,
  details: [],
  seo: emptySeo(),
  category: '',
  imageIds: [],
  dishIds: [],
  menuIds: [],
  serviceIds: [],
  modalityIds: [],
  addOnIds: [],
  eventTypeIds: [],
  excluded: [],
  price: {
    mode: 'consult',
    amount: null,
    currency: 'PEN',
    unit: 'person',
    minimum: null,
    conditions: '',
  },
  minimumGuests: null,
  dietary: [],
  dietaryConfirmed: false,
  district: '',
  eventDate: '',
  guestCount: null,
  attribution: '',
  verified: false,
  provider: '',
  createdAt: '',
  updatedAt: '',
});
export const defaultCopy: PublicCopy = {
  location: 'Lima, Perú',
  primaryCta: 'Cotizar mi evento',
  secondaryCta: 'Explorar menús',
  viewAll: 'Ver todos',
  inquire: 'Consultar esta propuesta',
  footerHeading: 'Conversemos sobre tu evento',
  emptyTitle: 'Estamos preparando esta selección.',
  emptyDescription:
    'Cuéntanos qué necesitas y coordinemos las opciones disponibles.',
  galleryTitle: 'Detalles para compartir',
  includedTitle: 'Qué incluye',
  excludedTitle: 'Qué no incluye',
  relatedTitle: 'Completa tu propuesta',
  coverageTitle: 'Consulta la atención en tu distrito',
  quoteTitle: 'Organicemos tu próximo evento.',
  quoteDescription:
    'Cuéntanos la fecha, el lugar y lo que tienes en mente. Recibiremos tu solicitud para coordinar una propuesta.',
  quoteAsideTitle: 'Una buena mesa empieza por conocerte.',
  quoteAsideDescription:
    'La disponibilidad y las condiciones se confirman en la propuesta.',
  consent:
    'Autorizo el uso de mis datos para atender esta solicitud de cotización.',
  privacyTitle: 'Privacidad de tu solicitud',
  privacyBody:
    'Usaremos la información que nos compartas para responder tu consulta y coordinar tu evento. No incluyas información sensible en los comentarios. Puedes solicitar la eliminación de tu consulta a través del contacto del negocio.',
  successTitle: 'Recibimos tu solicitud',
  successDescription:
    'Guarda tu número de referencia. También puedes continuar la conversación por WhatsApp.',
  demoNotice: 'Vista de demostración · Fotografías y propuestas de muestra',
};
export const defaultSettings: SiteSettings = {
  name: 'Nombre de la marca',
  tagline: 'Cocina para compartir',
  whatsapp: '',
  whatsappMessage: 'Hola, quisiera una propuesta para mi evento.',
  email: '',
  origin: '',
  indexable: false,
  demo: true,
  seo: emptySeo(),
  navigation: [],
  footer: '',
  logoId: '',
  palette: 'olive',
  typography: 'editorial',
  animations: true,
  motionLevel: 'subtle',
  catalogs: Object.fromEntries(
    contentKinds.map((kind) => [
      kind,
      { title: kindLabels[kind], description: '', seo: emptySeo() },
    ]),
  ) as SiteSettings['catalogs'],
  copy: defaultCopy,
  businessVerified: false,
  publicAddress: '',
  hours: '',
  socialLinks: [],
  analyticsConsentText:
    'Permitir estadísticas anónimas de navegación para mejorar la web.',
};
export function normalizeSite(raw: unknown): SiteContent {
  const value = (raw || {}) as Partial<SiteContent>;
  const settings = value.settings || ({} as SiteSettings);
  return {
    version: value.version || 0,
    settings: {
      ...defaultSettings,
      ...settings,
      seo: { ...emptySeo(), ...settings.seo },
      copy: { ...defaultCopy, ...settings.copy },
      catalogs: Object.fromEntries(
        contentKinds.map((k) => [
          k,
          {
            ...defaultSettings.catalogs[k],
            ...settings.catalogs?.[k],
            seo: { ...emptySeo(), ...settings.catalogs?.[k]?.seo },
          },
        ]),
      ) as SiteSettings['catalogs'],
    },
    entries: (value.entries || []).map((e) => ({
      ...emptyEntry(),
      ...e,
      price: { ...emptyEntry().price, ...e.price },
      seo: { ...emptySeo(), ...e.seo },
    })),
    media: value.media || [],
    sections: value.sections || [],
    faqs: value.faqs || [],
  };
}
