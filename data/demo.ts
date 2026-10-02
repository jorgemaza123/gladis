import { emptyEntry, normalizeSite } from './defaults';
import type { ContentEntry, QuoteConfig, SiteContent } from '@/models/content';

const seo = (title: string, description: string) => ({ title, description, noindex: false });

function entry(
  id: string,
  kind: ContentEntry['kind'],
  title: string,
  description: string,
  imageId: string,
  overrides: Partial<ContentEntry> = {},
): ContentEntry {
  return {
    ...emptyEntry(), id, kind, slug: id, title, description, body: description,
    imageId, status: 'published', featured: true, seo: seo(`${title} | Catering Gladis`, description),
    ...overrides,
  };
}

const perPerson: QuoteConfig = {
  quantityUnit: 'person', minimum: 20, maximum: 300, step: 5,
  dateRequired: true, districtRequired: true, guestsRequired: true,
  options: [
    { id: 'modalidad', label: 'Modalidad de servicio', required: true, values: [{ id: 'buffet', label: 'Buffet servido' }, { id: 'mesa', label: 'Servicio en mesa' }] },
    { id: 'menu', label: 'Tipo de menú', required: true, values: [{ id: 'criollo', label: 'Criollo' }, { id: 'mixto', label: 'Mixto' }, { id: 'vegetariano', label: 'Con opciones vegetarianas' }] },
  ],
};

const perEvent: QuoteConfig = {
  quantityUnit: 'event', minimum: 1, maximum: 1, step: 1,
  dateRequired: true, districtRequired: true, guestsRequired: false,
  options: [{ id: 'duracion', label: 'Duración estimada', required: true, values: [{ id: 'cuatro-horas', label: 'Hasta 4 horas' }, { id: 'seis-horas', label: 'Hasta 6 horas' }] }],
};

const perUnit = (minimum: number, maximum: number, step = 1): QuoteConfig => ({
  quantityUnit: 'unit', minimum, maximum, step,
  dateRequired: true, districtRequired: true, guestsRequired: false, options: [],
});

const consultationPrice = (unit: 'person' | 'event' | 'unit', minimum: number) => ({
  mode: 'consult' as const, amount: null, currency: 'PEN' as const, unit, minimum,
  conditions: 'Precio a consulta por WhatsApp. Disponibilidad, traslado y condiciones se confirman antes de reservar.',
});

const addon = (
  id: string, title: string, description: string, sortOrder: number, minimum: number, ownerId: 'cocina' | 'eventos',
  imageId = 'imagen-detalles-demo',
) => entry(id, 'complementos', title, description, imageId, {
  sortOrder, requestable: true, ownerId, quoteConfig: perUnit(minimum, 300, minimum >= 20 ? 5 : 1),
  price: consultationPrice('unit', minimum),
});

export const demoContent: SiteContent = normalizeSite({
  version: 1,
  settings: {
    name: 'Catering Gladis',
    tagline: 'Cocina y servicios para todo tipo de eventos',
    whatsapp: '',
    whatsappMessage: 'Hola, quisiera una propuesta para mi evento.',
    email: '',
    origin: 'https://gladis-vr6r.vercel.app',
    indexable: true,
    demo: false,
    businessVerified: true,
    seo: seo('Catering Gladis | Buffet y servicios para eventos en Lima', 'Buffet, menús, bartender, mozos, menaje, sillas, flores, recuerdos y polos para eventos en Lima Metropolitana. Cotiza por WhatsApp.'),
    navigation: [
      { label: 'Inicio', href: '/' }, { label: 'Buffet y menús', href: '/servicios' },
      { label: 'Complementos', href: '/complementos' }, { label: 'Nosotros', href: '/paginas/nosotros' },
    ],
    footer: 'Buffet y servicios para eventos en Lima Metropolitana. Cotiza por WhatsApp.',
    copy: {
      demoNotice: 'Imágenes referenciales generadas con IA. Cada propuesta se confirma por WhatsApp antes de reservar.',
      quoteDescription: 'Elige una propuesta y sus complementos. Prepararemos un mensaje para WhatsApp; no guardamos solicitudes.',
      quoteAsideDescription: 'Todos los precios se cotizan por WhatsApp. Disponibilidad, cobertura y condiciones se confirman antes de reservar.',
    },
  },
  media: [
    { id: 'imagen-buffet-demo', url: '/images/demo/buffet-principal-demo.jpg', alt: 'Buffet con platos y ensaladas para un evento', caption: 'Imagen referencial generada con IA.', demo: false, width: 1280, height: 721, bytes: 278114, tags: ['buffet', 'catering'] },
    { id: 'imagen-bar-demo', url: '/images/demo/bar-y-mozos-demo.jpg', alt: 'Bar con personal preparando bebidas para un evento', caption: 'Imagen referencial generada con IA.', demo: false, width: 1280, height: 853, bytes: 270942, tags: ['bar', 'bartender', 'mozos'] },
    { id: 'imagen-detalles-demo', url: '/images/demo/detalles-evento-demo.jpg', alt: 'Mesa con menaje, sillas, flores, recuerdos y polos para un evento', caption: 'Imagen referencial generada con IA.', demo: false, width: 1280, height: 853, bytes: 281826, tags: ['menaje', 'sillas', 'flores', 'recuerdos'] },
  ],
  entries: [
    entry('boda', 'tipos-evento', 'Bodas y celebraciones', 'Propuesta completa de buffet y complementos para celebrar.', 'imagen-detalles-demo', { featured: false, sortOrder: 1 }),
    entry('cumpleanos', 'tipos-evento', 'Cumpleaños y reuniones familiares', 'Mesa compartida y atención coordinada para tu celebración.', 'imagen-buffet-demo', { featured: false, sortOrder: 2 }),
    entry('corporativo', 'tipos-evento', 'Eventos corporativos', 'Almuerzos, pausas y activaciones de equipo.', 'imagen-bar-demo', { featured: false, sortOrder: 3 }),
    entry('lima-metropolitana', 'cobertura', 'Lima Metropolitana', 'Atendemos todo Lima Metropolitana. Fecha, distrito, acceso y traslado se confirman al cotizar.', 'imagen-buffet-demo', { featured: false, sortOrder: 1 }),
    entry('buffet-para-eventos', 'servicios', 'Buffet para todo tipo de eventos', 'Comida para compartir, montaje y opciones según la ocasión.', 'imagen-buffet-demo', {
      sortOrder: 1, category: 'Propuesta principal',
      body: 'Usa este buffet como punto de partida para bodas, cumpleaños, reuniones familiares o eventos corporativos. Cotiza cada detalle por WhatsApp.',
      details: ['Selección de entradas, fondos y guarniciones', 'Montaje básico según modalidad elegida', 'Coordinación de fecha, distrito y asistentes'],
      excluded: ['Disponibilidad, traslado y montaje especial por confirmar', 'Bebidas, personal y alquileres se añaden a la propuesta según necesidad'],
      imageIds: ['imagen-buffet-demo', 'imagen-bar-demo', 'imagen-detalles-demo'],
      price: consultationPrice('person', 20), minimumGuests: 20, dietary: ['Opciones vegetarianas a coordinar'], dietaryConfirmed: true, provider: 'own',
      requestable: true, ownerId: 'cocina', prominence: 'primary', quoteConfig: perPerson,
      eventTypeIds: ['boda', 'cumpleanos', 'corporativo'], coverageIds: ['lima-metropolitana'],
      addOnIds: ['bar-bartender', 'mozos-evento', 'menaje-evento', 'sillas-evento', 'arreglos-florales', 'recuerdos-evento', 'polos-estampados'],
      recommendations: [
        { entryId: 'bar-bartender', priority: 1, eventTypeIds: [], reason: 'Complementa el buffet con bebidas preparadas.' },
        { entryId: 'mozos-evento', priority: 2, eventTypeIds: [], reason: 'Añade atención durante el servicio.' },
        { entryId: 'menaje-evento', priority: 3, eventTypeIds: [], reason: 'Completa la presentación de la mesa.' },
      ],
      processSteps: [
        { title: 'Cuéntanos tu evento', description: 'Indica fecha, distrito, asistentes y estilo de servicio.' },
        { title: 'Ajustamos la propuesta', description: 'Revisamos menú, complementos y condiciones antes de confirmar.' },
        { title: 'Coordinamos el servicio', description: 'La disponibilidad y logística se validan antes de la venta.' },
      ],
      faqItems: [
        { id: 'buffet-minimo', question: '¿Cuál es el mínimo?', answer: 'El mínimo referencial es de 20 personas. Confirma tu caso por WhatsApp.' },
        { id: 'buffet-cobertura', question: '¿Dónde atienden?', answer: 'Atendemos todo Lima Metropolitana. Confirma fecha, distrito, acceso y traslado al cotizar.' },
      ],
    }),
    entry('menu-criollo-eventos', 'menus', 'Menú criollo para compartir', 'Menú criollo como alternativa dentro de una propuesta de evento.', 'imagen-buffet-demo', { sortOrder: 2, details: ['Entrada', 'Fondo criollo', 'Guarniciones para compartir'], price: consultationPrice('person', 20), minimumGuests: 20, requestable: true, ownerId: 'cocina', quoteConfig: perPerson, eventTypeIds: ['cumpleanos', 'corporativo'], coverageIds: ['lima-metropolitana'] }),
    entry('bar-bartender', 'complementos', 'Bartender y barra de bebidas', 'Servicio de barra para acompañar una recepción o celebración.', 'imagen-bar-demo', { sortOrder: 1, details: ['Bartender', 'Barra y cristalería según coordinación', 'Carta de bebidas por definir'], price: consultationPrice('event', 1), requestable: true, ownerId: 'cocina', quoteConfig: perEvent, coverageIds: ['lima-metropolitana'] }),
    addon('mozos-evento', 'Mozos para atención', 'Personal de atención para servicio en mesa, buffet o recepción.', 2, 1, 'eventos', 'imagen-bar-demo'),
    addon('menaje-evento', 'Alquiler de menaje', 'Vajilla, cubiertos y cristalería para presentar la mesa.', 3, 20, 'cocina'),
    addon('sillas-evento', 'Alquiler de sillas', 'Sillas para invitados como complemento del evento.', 4, 20, 'eventos'),
    addon('arreglos-florales', 'Arreglos florales', 'Arreglos florales para mesas y recepción.', 5, 1, 'eventos'),
    addon('recuerdos-evento', 'Recuerdos para invitados', 'Detalles para acompañar un evento.', 6, 20, 'eventos'),
    addon('polos-estampados', 'Polos estampados para eventos', 'Polos para equipos, activaciones o recuerdos.', 7, 10, 'eventos'),
    entry('nosotros', 'paginas', 'Cocinamos para celebrar', 'Reunimos buffet, atención y detalles para eventos de distintas escalas.', 'imagen-buffet-demo', { sortOrder: 1, details: ['Buffet y menús', 'Personal y barra', 'Alquileres y detalles para el evento'] }),
  ],
  sections: [
    { id: 'portada', type: 'hero', title: 'Buffet y detalles para celebrar cualquier evento', description: 'Catering, barra, atención y complementos para una propuesta completa en Lima Metropolitana.', imageId: 'imagen-buffet-demo', visible: true, sortOrder: 0, primaryLabel: 'Cotizar un buffet', primaryHref: '/cotizar', secondaryLabel: 'Ver complementos', secondaryHref: '/complementos' },
    { id: 'especialidades', type: 'servicios', title: 'El buffet es nuestro punto de partida.', description: 'Elige una propuesta principal y añade lo que tu evento necesita.', imageId: '', visible: true, sortOrder: 1, entryIds: ['buffet-para-eventos'] },
    { id: 'complementos', type: 'complementos', title: 'Opciones para completar el evento', description: 'Bar, mozos, menaje, sillas, flores, recuerdos y polos para tu evento.', imageId: '', visible: true, sortOrder: 2, entryIds: ['bar-bartender', 'mozos-evento', 'menaje-evento'] },
    { id: 'historia', type: 'texto', title: 'Una sola propuesta, varios detalles.', description: 'La disponibilidad, el traslado y las condiciones se coordinan por WhatsApp antes de reservar.', imageId: 'imagen-detalles-demo', visible: true, sortOrder: 3 },
    { id: 'preguntas', type: 'faq', title: 'Preguntas frecuentes', description: 'Resolvemos los detalles de tu evento al momento de cotizar.', imageId: '', visible: true, sortOrder: 4 },
    { id: 'contacto', type: 'cta', title: 'Empieza con el buffet.', description: 'Añade los complementos que necesites y cotiza por WhatsApp.', imageId: '', visible: true, sortOrder: 5, primaryLabel: 'Cotizar por WhatsApp', primaryHref: '/cotizar' },
  ],
  faqs: [
    { id: 'cobertura', question: '¿Dónde atienden?', answer: 'Atendemos todo Lima Metropolitana. Confirma la fecha, distrito, acceso y traslado por WhatsApp.' },
    { id: 'invitados', question: '¿Para cuántas personas puedo cotizar?', answer: 'El buffet tiene un mínimo referencial de 20 personas. Escríbenos por WhatsApp para confirmar tu caso.' },
    { id: 'incluye', question: '¿El buffet incluye barra, mozos o alquileres?', answer: 'Son complementos independientes. Puedes añadirlos sin cambiar la propuesta principal ni su responsable.' },
  ],
});
