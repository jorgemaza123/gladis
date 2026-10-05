import designImages from './design-images.json';
import { emptyEntry, normalizeSite } from './defaults';
import type { ContentEntry, QuoteConfig, SiteContent } from '@/models/content';

const seo = (title: string, description: string) => ({
  title,
  description,
  noindex: false,
});

function entry(
  id: string,
  kind: ContentEntry['kind'],
  title: string,
  description: string,
  imageId: string,
  overrides: Partial<ContentEntry> = {},
): ContentEntry {
  return {
    ...emptyEntry(),
    id,
    kind,
    slug: id,
    title,
    description,
    body: description,
    imageId,
    status: 'published',
    featured: true,
    seo: seo(`${title} | Catering Gladis`, description),
    ...overrides,
  };
}

const perPerson: QuoteConfig = {
  quantityUnit: 'person',
  minimum: 1,
  maximum: 100000,
  step: 1,
  dateRequired: true,
  districtRequired: true,
  guestsRequired: true,
  options: [
    {
      id: 'modalidad',
      label: 'Modalidad de servicio',
      required: true,
      values: [
        { id: 'buffet', label: 'Buffet servido' },
        { id: 'mesa', label: 'Servicio en mesa' },
      ],
    },
    {
      id: 'menu',
      label: 'Tipo de menú',
      required: true,
      values: [
        { id: 'criollo', label: 'Criollo' },
        { id: 'mixto', label: 'Mixto' },
        { id: 'vegetariano', label: 'Con opciones vegetarianas' },
      ],
    },
  ],
};

const perEvent: QuoteConfig = {
  quantityUnit: 'event',
  minimum: 1,
  maximum: 1,
  step: 1,
  dateRequired: true,
  districtRequired: true,
  guestsRequired: false,
  options: [
    {
      id: 'duracion',
      label: 'Duración estimada',
      required: true,
      values: [
        { id: 'cuatro-horas', label: 'Hasta 4 horas' },
        { id: 'seis-horas', label: 'Hasta 6 horas' },
      ],
    },
  ],
};

const perUnit = (minimum: number, maximum: number, step = 1): QuoteConfig => ({
  quantityUnit: 'unit',
  minimum,
  maximum,
  step,
  dateRequired: true,
  districtRequired: true,
  guestsRequired: false,
  options: [],
});

const consultationPrice = (
  unit: 'person' | 'event' | 'unit',
  _minimum: number,
) => ({
  mode: 'consult' as const,
  amount: null,
  currency: 'PEN' as const,
  unit,
  minimum: null,
  conditions:
    'Consulta el precio por WhatsApp. Antes de reservar, revisamos contigo la disponibilidad, el traslado y las condiciones.',
});

const addon = (
  id: string,
  title: string,
  description: string,
  sortOrder: number,
  _minimum: number,
  ownerId: 'cocina' | 'eventos',
  imageId = 'imagen-detalles-demo',
) =>
  entry(id, 'complementos', title, description, imageId, {
    sortOrder,
    requestable: true,
    ownerId,
    quoteConfig: perUnit(1, 100000),
    price: consultationPrice('unit', 1),
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
    seo: seo(
      'Catering Gladis | Buffet y servicios para eventos en Lima',
      'Buffet, menús, bartender, mozos, menaje, sillas, flores, recuerdos y polos para eventos en Lima Metropolitana. Cotiza por WhatsApp.',
    ),
    navigation: [
      { label: 'Buffet y menús', href: '/servicios' },
      { label: 'Servicios para eventos', href: '/complementos' },
      { label: 'Cómo cotizar', href: '/#como-cotizar' },
    ],
    catalogs: {
      servicios: {
        title: 'Buffet y menús',
        description:
          'Un buffet para tu boda, un menú para tu cumpleaños o un almuerzo con tu equipo. Cuéntanos qué celebras en Lima Metropolitana.',
        seo: seo(
          'Buffet y menús para eventos en Lima | Catering Gladis',
          'Explora el buffet y el menú criollo. Cuéntanos tu fecha, distrito e invitados para cotizar por WhatsApp.',
        ),
      },
      complementos: {
        title: 'Servicios para tu evento',
        description:
          'Bartender, mozos, menaje, sillas, flores, recuerdos y polos. Elige lo que te hace falta para tu evento; también puedes pedir un solo servicio.',
        seo: seo(
          'Servicios para eventos en Lima | Catering Gladis',
          'Bartender, mozos, alquiler de menaje y sillas, arreglos florales, recuerdos y polos para eventos. Precios a consulta por WhatsApp.',
        ),
      },
    },
    footer:
      'Buffet y servicios para eventos en Lima Metropolitana. Cotiza por WhatsApp.',
    copy: {
      demoNotice:
        'Imágenes referenciales. Cada propuesta se confirma por WhatsApp antes de reservar.',
      quoteTitle: 'Hagamos espacio para tu celebración.',
      quoteDescription:
        'Cuéntanos qué tienes en mente y elige lo que necesitas. Seguimos la conversación por WhatsApp.',
      inquire: 'Añadir a mi evento',
      primaryCta: 'Preparar mi evento',
      quoteAsideDescription:
        'Te damos el precio por WhatsApp según lo que necesites. Antes de reservar, revisamos contigo la fecha, el lugar y las condiciones del servicio.',
    },
  },
  media: Object.entries(designImages)
    .map(([name, variants]) => ({
      id:
        name === 'buffet'
          ? 'imagen-buffet-demo'
          : name === 'bartender'
            ? 'imagen-bar-demo'
            : name === 'flores'
              ? 'imagen-detalles-demo'
              : `imagen-${name}`,
      ...variants[variants.length - 1],
      variants,
      alt: (
        {
          buffet: 'Mesa de buffet criollo con causas, arroz y ensaladas',
          bartender: 'Barra con limas, bebidas y coctelera',
          mozos: 'Mozo con bandeja en una celebración diurna',
          menaje: 'Vajilla blanca, cubiertos y copas',
          sillas: 'Sillas de madera alrededor de una mesa',
          flores: 'Flores blancas y follaje en un centro de mesa',
          recuerdos: 'Cajas de recuerdos con cintas verdes',
          polos: 'Polos blancos y verdes para eventos',
        } as Record<string, string>
      )[name],
      caption: 'Imagen referencial.',
      demo: false,
      tags: [name],
    }))
    .concat([
      {
        id: 'imagen-flores',
        ...designImages.flores[2],
        variants: designImages.flores,
        alt: 'Arreglo floral blanco con follaje verde',
        caption: 'Imagen referencial.',
        demo: false,
        tags: ['flores'],
      },
    ]),
  entries: [
    entry(
      'boda',
      'tipos-evento',
      'Bodas y celebraciones',
      'Buffet y servicios para compartir tu boda con las personas que quieres.',
      'imagen-detalles-demo',
      { featured: false, sortOrder: 1 },
    ),
    entry(
      'cumpleanos',
      'tipos-evento',
      'Cumpleaños y reuniones familiares',
      'Un buffet para reunirse en familia, celebrar un cumpleaños y compartir la mesa.',
      'imagen-buffet-demo',
      { featured: false, sortOrder: 2 },
    ),
    entry(
      'corporativo',
      'tipos-evento',
      'Eventos corporativos',
      'Comida y servicios para almuerzos, reuniones y eventos con tu equipo.',
      'imagen-bar-demo',
      { featured: false, sortOrder: 3 },
    ),
    entry(
      'lima-metropolitana',
      'cobertura',
      'Lima Metropolitana',
      'Atendemos en toda Lima Metropolitana. Dinos la fecha y el distrito de tu evento para revisar juntos el acceso y el traslado.',
      'imagen-buffet-demo',
      { featured: false, sortOrder: 1 },
    ),
    entry(
      'buffet-para-eventos',
      'servicios',
      'Buffet para todo tipo de eventos',
      'Un buffet para reunir a los tuyos, con opciones de comida y montaje según lo que quieras celebrar.',
      'imagen-buffet-demo',
      {
        sortOrder: 1,
        category: 'Propuesta principal',
        body: '¿Una boda, un cumpleaños, una reunión familiar o un evento de trabajo? Cuéntanos cuántos serán y qué les gustaría comer. Armamos contigo una propuesta de buffet en Lima Metropolitana y te damos el precio por WhatsApp.',
        details: [
          'Selección de entradas, fondos y guarniciones',
          'Montaje básico según modalidad elegida',
          'Coordinamos contigo la fecha, el distrito y el número de invitados',
        ],
        excluded: [
          'Confirmamos la disponibilidad, el traslado y cualquier montaje especial al cotizar',
          'Puedes añadir bebidas, personal y alquileres; se cotizan por separado',
        ],
        imageIds: [
          'imagen-buffet-demo',
          'imagen-bar-demo',
          'imagen-detalles-demo',
        ],
        price: consultationPrice('person', 20),
        minimumGuests: null,
        dietary: ['Opciones vegetarianas a coordinar'],
        dietaryConfirmed: true,
        provider: 'own',
        requestable: true,
        ownerId: 'cocina',
        prominence: 'primary',
        quoteConfig: perPerson,
        eventTypeIds: ['boda', 'cumpleanos', 'corporativo'],
        coverageIds: ['lima-metropolitana'],
        addOnIds: [
          'bar-bartender',
          'mozos-evento',
          'menaje-evento',
          'sillas-evento',
          'arreglos-florales',
          'recuerdos-evento',
          'polos-estampados',
        ],
        recommendations: [
          {
            entryId: 'bar-bartender',
            priority: 1,
            eventTypeIds: [],
            reason: 'Acompaña la comida con una barra de bebidas para tus invitados.',
          },
          {
            entryId: 'mozos-evento',
            priority: 2,
            eventTypeIds: [],
            reason: 'Cuenta con mozos para atender las mesas o el buffet.',
          },
          {
            entryId: 'menaje-evento',
            priority: 3,
            eventTypeIds: [],
            reason: 'Añade la vajilla, los cubiertos y las copas que te hagan falta.',
          },
        ],
        processSteps: [
          {
            title: 'Cuéntanos tu evento',
            description:
              'Dinos cuándo y dónde será, cuántos invitados esperas y cómo te gustaría servir la comida.',
          },
          {
            title: 'Ajustamos la propuesta',
            description:
              'Conversamos sobre el menú, los servicios que necesitas y el precio por WhatsApp.',
          },
          {
            title: 'Coordinamos el servicio',
            description:
              'Antes de reservar, confirmamos contigo la disponibilidad, el traslado y los detalles del servicio.',
          },
        ],
        faqItems: [
          {
            id: 'buffet-minimo',
            question: '¿Para cuántas personas puedo pedir un buffet?',
            answer:
              'Dinos cuántos invitados esperas. Revisaremos las opciones contigo y te confirmaremos las cantidades y condiciones al cotizar.',
          },
          {
            id: 'buffet-cobertura',
            question: '¿Dónde atienden?',
            answer:
              'Atendemos en toda Lima Metropolitana. Cuéntanos la fecha y el distrito; por WhatsApp revisamos contigo el acceso al lugar y el traslado.',
          },
        ],
      },
    ),
    entry(
      'menu-criollo-eventos',
      'menus',
      'Menú criollo para compartir',
      'Un menú criollo para compartir en tu reunión, cumpleaños o evento de trabajo. Conversemos sobre los platos que tienes en mente.',
      'imagen-buffet-demo',
      {
        sortOrder: 2,
        details: ['Entrada', 'Fondo criollo', 'Guarniciones para compartir'],
        price: consultationPrice('person', 20),
        minimumGuests: null,
        requestable: true,
        ownerId: 'cocina',
        quoteConfig: perPerson,
        eventTypeIds: ['cumpleanos', 'corporativo'],
        coverageIds: ['lima-metropolitana'],
      },
    ),
    entry(
      'bar-bartender',
      'complementos',
      'Bartender y barra de bebidas',
      'Un bartender y una barra de bebidas para acompañar tu celebración. Cuéntanos qué te gustaría ofrecer a tus invitados.',
      'imagen-bar-demo',
      {
        sortOrder: 1,
        details: [
          'Bartender',
          'Barra y cristalería según coordinación',
          'Carta de bebidas por definir',
        ],
        price: consultationPrice('event', 1),
        requestable: true,
        ownerId: 'cocina',
        quoteConfig: perEvent,
        coverageIds: ['lima-metropolitana'],
      },
    ),
    addon(
      'mozos-evento',
      'Mozos para atención',
      'Mozos para atender a tus invitados en las mesas, el buffet o la recepción de tu evento.',
      2,
      1,
      'eventos',
      'imagen-mozos',
    ),
    addon(
      'menaje-evento',
      'Alquiler de menaje',
      'Alquiler de vajilla, cubiertos y copas para tu evento. Cuéntanos qué necesitas para poner la mesa.',
      3,
      20,
      'cocina',
      'imagen-menaje',
    ),
    addon(
      'sillas-evento',
      'Alquiler de sillas',
      'Alquiler de sillas para reunir a tus invitados. Dinos cuántas necesitas y dónde será tu evento.',
      4,
      20,
      'eventos',
      'imagen-sillas',
    ),
    addon(
      'arreglos-florales',
      'Arreglos florales',
      'Arreglos florales para dar tu toque a las mesas y la recepción. Cuéntanos los colores y el estilo que te gustan.',
      5,
      1,
      'eventos',
      'imagen-flores',
    ),
    addon(
      'recuerdos-evento',
      'Recuerdos para invitados',
      'Recuerdos para que tus invitados se lleven un detalle de tu celebración. Conversemos sobre la idea que tienes en mente.',
      6,
      20,
      'eventos',
      'imagen-recuerdos',
    ),
    addon(
      'polos-estampados',
      'Polos estampados para eventos',
      'Polos estampados para tu equipo, una activación o una celebración. Cuéntanos tu idea y cuántos necesitas.',
      7,
      10,
      'eventos',
      'imagen-polos',
    ),
    entry(
      'nosotros',
      'paginas',
      'Cocinamos para celebrar',
      'Cocinamos para que compartas la mesa con los tuyos. Además del buffet, puedes elegir los servicios y detalles que necesites para tu evento.',
      'imagen-buffet-demo',
      {
        sortOrder: 1,
        details: [
          'Buffet y menús',
          'Personal y barra',
          'Alquileres y detalles para el evento',
        ],
      },
    ),
  ],
  sections: [
    {
      id: 'portada',
      type: 'hero',
      title: 'Buffet y detalles para celebrar cualquier evento',
      description:
        'Catering, barra y servicios para tu evento en Lima Metropolitana. Cuéntanos qué celebras y armemos juntos tu propuesta.',
      imageId: 'imagen-buffet-demo',
      visible: true,
      sortOrder: 0,
      primaryLabel: 'Cotizar un buffet',
      primaryHref: '/cotizar',
      secondaryLabel: 'Ver complementos',
      secondaryHref: '/complementos',
    },
    {
      id: 'especialidades',
      type: 'servicios',
      title: 'El buffet es nuestro punto de partida.',
      description:
        'Empieza por la comida que quieres compartir y añade lo que necesites para tu celebración.',
      imageId: '',
      visible: true,
      sortOrder: 1,
      entryIds: ['buffet-para-eventos'],
    },
    {
      id: 'complementos',
      type: 'complementos',
      title: 'Opciones para completar el evento',
      description:
        'Bar, mozos, menaje, sillas, flores, recuerdos y polos para tu evento.',
      imageId: '',
      visible: true,
      sortOrder: 2,
      entryIds: ['bar-bartender', 'mozos-evento', 'menaje-evento'],
    },
    {
      id: 'historia',
      type: 'texto',
      title: 'Una sola propuesta, varios detalles.',
      description:
        'Cuéntanos tu idea por WhatsApp. Antes de reservar, revisamos contigo la disponibilidad, el traslado y las condiciones.',
      imageId: 'imagen-detalles-demo',
      visible: true,
      sortOrder: 3,
    },
    {
      id: 'preguntas',
      type: 'faq',
      title: 'Preguntas frecuentes',
      description:
        'Quizá te estés preguntando esto antes de empezar. Si te queda alguna duda, conversemos por WhatsApp.',
      imageId: '',
      visible: true,
      sortOrder: 4,
    },
    {
      id: 'contacto',
      type: 'cta',
      title: 'Empieza con el buffet.',
      description:
        'Añade los complementos que necesites y cotiza por WhatsApp.',
      imageId: '',
      visible: true,
      sortOrder: 5,
      primaryLabel: 'Cotizar por WhatsApp',
      primaryHref: '/cotizar',
    },
  ],
  faqs: [
    {
      id: 'cobertura',
      question: '¿Dónde atienden?',
      answer:
        'Atendemos en toda Lima Metropolitana. Dinos la fecha y el distrito de tu evento; revisamos contigo el acceso al lugar y el traslado por WhatsApp.',
    },
    {
      id: 'invitados',
      question: '¿Para cuántas personas puedo cotizar?',
      answer:
        'Cuéntanos cuántos invitados esperas y qué presupuesto tienes en mente. Con esos datos, revisamos las opciones y te confirmamos las cantidades y condiciones por WhatsApp.',
    },
    {
      id: 'incluye',
      question: '¿El buffet incluye barra, mozos o alquileres?',
      answer:
        'Se cotizan por separado. Puedes añadir bartender, mozos, menaje, sillas u otros servicios a tu evento. Antes de reservar, te confirmamos qué incluye cada uno y su precio.',
    },
  ],
});
