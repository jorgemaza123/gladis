import { emptyEntry, normalizeSite } from './defaults';
import type { ContentEntry, QuoteConfig, SiteContent } from '@/models/content';

const seo = (title: string, description: string) => ({ title, description, noindex: true });

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
    imageId, status: 'published', featured: true, seo: seo(`${title} · demostración`, description),
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

const demoPrice = (amount: number, unit: 'person' | 'event' | 'unit', minimum: number) => ({
  mode: 'from' as const, amount, currency: 'PEN' as const, unit, minimum,
  conditions: 'Precio de demostración; disponibilidad, traslado y condiciones se confirman antes de vender.',
});

const addon = (
  id: string, title: string, description: string, amount: number, minimum: number,
  imageId = 'imagen-detalles-demo',
) => entry(id, 'complementos', title, description, imageId, {
  sortOrder: 10 + amount, requestable: true, ownerId: 'eventos', quoteConfig: perUnit(minimum, 300, minimum >= 20 ? 5 : 1),
  price: demoPrice(amount, 'unit', minimum),
});

export const demoContent: SiteContent = normalizeSite({
  version: 1,
  settings: {
    name: 'Cocina para Celebrar',
    tagline: 'Cocina para todo tipo de eventos',
    whatsapp: '',
    whatsappMessage: 'Hola, quisiera una propuesta de demostración para mi evento.',
    email: 'hola@cocina-para-celebrar.demo',
    origin: 'https://gladis-vr6r.vercel.app',
    indexable: false,
    demo: true,
    seo: seo('Cocina para Celebrar · demostración de catering', 'Demostración funcional de buffet, barra, atención y complementos para eventos.'),
    navigation: [
      { label: 'Inicio', href: '/' }, { label: 'Buffet y menús', href: '/servicios' },
      { label: 'Complementos', href: '/complementos' }, { label: 'Nosotros', href: '/paginas/nosotros' },
    ],
    footer: 'Demostración funcional: buffet y complementos para eventos en Lima Metropolitana.',
    copy: {
      demoNotice: 'Demostración funcional · identidad, precios, cobertura e imágenes son ejemplos y deben confirmarse antes de vender',
      quoteDescription: 'Elige una propuesta y sus complementos. Esta demostración prepara un mensaje para WhatsApp; no guarda solicitudes.',
      quoteAsideDescription: 'Los precios, disponibilidad, cobertura y condiciones de esta demostración se confirman antes de cualquier venta.',
    },
  },
  media: [
    { id: 'imagen-buffet-demo', url: '/images/demo/buffet-principal-demo.jpg', alt: 'Buffet de demostración con platos y ensaladas para un evento', caption: 'Imagen generada con IA para la demostración; no representa un montaje real contratado.', demo: true, width: 1280, height: 721, bytes: 278114, tags: ['buffet', 'catering'] },
    { id: 'imagen-bar-demo', url: '/images/demo/bar-y-mozos-demo.jpg', alt: 'Bar de demostración con personal preparando bebidas para un evento', caption: 'Imagen generada con IA para la demostración; no representa personal ni bebidas reales.', demo: true, width: 1280, height: 853, bytes: 270942, tags: ['bar', 'bartender', 'mozos'] },
    { id: 'imagen-detalles-demo', url: '/images/demo/detalles-evento-demo.jpg', alt: 'Mesa de demostración con menaje, sillas, flores, recuerdos y polos para un evento', caption: 'Imagen generada con IA para la demostración; no representa inventario real.', demo: true, width: 1280, height: 853, bytes: 281826, tags: ['menaje', 'sillas', 'flores', 'recuerdos'] },
  ],
  entries: [
    entry('boda-demo', 'tipos-evento', 'Bodas y celebraciones', 'Ocasión de demostración para una propuesta completa de buffet y complementos.', 'imagen-detalles-demo', { featured: false, sortOrder: 1 }),
    entry('cumpleanos-demo', 'tipos-evento', 'Cumpleaños y reuniones familiares', 'Ocasión de demostración para una mesa compartida y atención coordinada.', 'imagen-buffet-demo', { featured: false, sortOrder: 2 }),
    entry('corporativo-demo', 'tipos-evento', 'Eventos corporativos', 'Ocasión de demostración para almuerzos, pausas y activaciones de equipo.', 'imagen-bar-demo', { featured: false, sortOrder: 3 }),
    entry('lima-metropolitana-demo', 'cobertura', 'Lima Metropolitana', 'Cobertura de ejemplo. Zona, horario y traslado se confirman antes de vender.', 'imagen-buffet-demo', { featured: false, sortOrder: 1 }),
    entry('callao-demo', 'cobertura', 'Callao', 'Cobertura de ejemplo sujeta a coordinación de fecha, acceso y traslado.', 'imagen-buffet-demo', { featured: false, sortOrder: 2 }),
    entry('buffet-para-eventos', 'servicios', 'Buffet para todo tipo de eventos', 'Propuesta principal de demostración: comida para compartir, montaje y opciones según la ocasión.', 'imagen-buffet-demo', {
      sortOrder: 1, category: 'Propuesta principal',
      body: 'Usa este buffet como punto de partida para bodas, cumpleaños, reuniones familiares o eventos corporativos. Los datos son ejemplos y se confirman antes de vender.',
      details: ['Selección de entradas, fondos y guarniciones de ejemplo', 'Montaje básico según modalidad elegida', 'Coordinación de fecha, distrito y asistentes'],
      excluded: ['Disponibilidad, traslado y montaje especial por confirmar', 'Bebidas, personal y alquileres sólo si se añaden a la propuesta'],
      imageIds: ['imagen-buffet-demo', 'imagen-bar-demo', 'imagen-detalles-demo'],
      price: demoPrice(38, 'person', 20), minimumGuests: 20, dietary: ['Opciones vegetarianas a coordinar'], dietaryConfirmed: true, provider: 'own',
      requestable: true, ownerId: 'eventos', prominence: 'primary', quoteConfig: perPerson,
      eventTypeIds: ['boda-demo', 'cumpleanos-demo', 'corporativo-demo'], coverageIds: ['lima-metropolitana-demo', 'callao-demo'],
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
        { id: 'buffet-minimo', question: '¿Cuál es el mínimo?', answer: 'En esta demostración el mínimo es de 20 personas; el mínimo real debe confirmarse.' },
        { id: 'buffet-cobertura', question: '¿Atienden fuera de Lima?', answer: 'La cobertura de esta demostración es referencial y se confirma según el evento.' },
      ],
    }),
    entry('menu-criollo-eventos', 'menus', 'Menú criollo para compartir', 'Ejemplo de menú criollo como alternativa dentro de una propuesta de evento.', 'imagen-buffet-demo', { sortOrder: 2, details: ['Entrada de ejemplo', 'Fondo criollo de ejemplo', 'Guarniciones para compartir'], price: demoPrice(42, 'person', 20), minimumGuests: 20, requestable: true, ownerId: 'eventos', quoteConfig: perPerson, eventTypeIds: ['cumpleanos-demo', 'corporativo-demo'], coverageIds: ['lima-metropolitana-demo'] }),
    entry('bar-bartender', 'complementos', 'Bartender y barra de bebidas', 'Servicio de barra de demostración para acompañar una recepción o celebración.', 'imagen-bar-demo', { sortOrder: 1, details: ['Bartender de ejemplo', 'Barra y cristalería según coordinación', 'Carta de bebidas por definir'], price: demoPrice(420, 'event', 1), requestable: true, ownerId: 'cocina', quoteConfig: perEvent, coverageIds: ['lima-metropolitana-demo', 'callao-demo'] }),
    addon('mozos-evento', 'Mozos para atención', 'Personal de atención de demostración para servicio en mesa, buffet o recepción.', 95, 1, 'imagen-bar-demo'),
    addon('menaje-evento', 'Alquiler de menaje', 'Vajilla, cubiertos y cristalería de demostración para presentar la mesa.', 8, 20),
    addon('sillas-evento', 'Alquiler de sillas', 'Sillas para invitados como complemento de demostración.', 6, 20),
    addon('arreglos-florales', 'Arreglos florales', 'Arreglos florales de demostración para mesas y recepción.', 140, 1),
    addon('recuerdos-evento', 'Recuerdos para invitados', 'Detalles de demostración para acompañar un evento.', 7, 20),
    addon('polos-estampados', 'Polos estampados para eventos', 'Polos de demostración para equipos, activaciones o recuerdos.', 25, 10),
    entry('nosotros', 'paginas', 'Cocinamos para celebrar', 'Demostración de una propuesta que reúne buffet, atención y detalles para eventos de distintas escalas.', 'imagen-buffet-demo', { sortOrder: 1, details: ['Buffet y menús', 'Personal y barra', 'Alquileres y detalles para el evento'] }),
  ],
  sections: [
    { id: 'portada', type: 'hero', title: 'Buffet y detalles para celebrar cualquier evento', description: 'Una demostración funcional de catering, barra, atención y complementos para una propuesta completa.', imageId: 'imagen-buffet-demo', visible: true, sortOrder: 0, primaryLabel: 'Cotizar un buffet', primaryHref: '/cotizar', secondaryLabel: 'Ver complementos', secondaryHref: '/complementos' },
    { id: 'especialidades', type: 'servicios', title: 'El buffet es nuestro punto de partida.', description: 'Elige una propuesta principal y añade lo que tu evento necesita.', imageId: '', visible: true, sortOrder: 1, entryIds: ['buffet-para-eventos'] },
    { id: 'complementos', type: 'complementos', title: 'Opciones para completar el evento', description: 'Bar, mozos, menaje, sillas, flores, recuerdos y polos de demostración.', imageId: '', visible: true, sortOrder: 2, entryIds: ['bar-bartender', 'mozos-evento', 'menaje-evento'] },
    { id: 'historia', type: 'texto', title: 'Una sola propuesta, varios detalles.', description: 'La disponibilidad, el traslado y las condiciones se coordinan antes de vender.', imageId: 'imagen-detalles-demo', visible: true, sortOrder: 3 },
    { id: 'preguntas', type: 'faq', title: 'Preguntas de la demostración', description: 'Estos datos son ejemplos para probar el recorrido comercial.', imageId: '', visible: true, sortOrder: 4 },
    { id: 'contacto', type: 'cta', title: 'Empieza con el buffet.', description: 'Añade los complementos que necesites y prepara la conversación.', imageId: '', visible: true, sortOrder: 5, primaryLabel: 'Preparar demostración', primaryHref: '/cotizar' },
  ],
  faqs: [
    { id: 'cobertura', question: '¿Dónde atienden?', answer: 'Lima Metropolitana y Callao son coberturas de demostración. La zona final se confirma antes de vender.' },
    { id: 'invitados', question: '¿Para cuántas personas puedo cotizar?', answer: 'El buffet de demostración usa un mínimo de 20 personas; las reglas reales deben confirmarse.' },
    { id: 'incluye', question: '¿El buffet incluye barra, mozos o alquileres?', answer: 'Son complementos independientes. Puedes añadirlos sin cambiar la propuesta principal ni su responsable.' },
  ],
});
