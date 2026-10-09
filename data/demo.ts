import designImages from './design-images.json';
import { emptyEntry, normalizeSite } from './defaults';
import { newOccasions } from './occasion-entries';
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
    seo: seo(`${title} | Gladys`, description),
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

const corporateBreakfast: QuoteConfig = {
  quantityUnit: 'person',
  minimum: 1,
  maximum: 100000,
  step: 1,
  dateRequired: true,
  districtRequired: true,
  guestsRequired: true,
  options: [
    {
      id: 'presentacion',
      label: 'Presentación',
      required: true,
      values: [
        { id: 'individual', label: 'Porciones individuales' },
        { id: 'mesa', label: 'Mesa para compartir' },
        { id: 'coffee-break', label: 'Coffee break' },
      ],
    },
    {
      id: 'bebidas',
      label: 'Bebidas',
      required: true,
      values: [
        { id: 'calientes', label: 'Café e infusiones' },
        { id: 'mixtas', label: 'Bebidas calientes y frías' },
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
    name: 'Gladys',
    tagline: 'Eventos & experiencias',
    whatsapp: '',
    whatsappMessage: 'Hola, quisiera una propuesta para mi evento.',
    email: '',
    origin: 'https://gladis-vr6r.vercel.app',
    indexable: true,
    demo: false,
    businessVerified: true,
    seo: seo(
      'Gladys | Buffet y servicios para eventos en Lima',
      'Buffet, menús, bartender, mozos, menaje, sillas, flores, recuerdos y polos para eventos en Lima Metropolitana. Cotiza por WhatsApp.',
    ),
    navigation: [
      { label: 'Ocasiones', href: '/tipos-evento' },
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
          'Buffet y menús para eventos en Lima | Gladys',
          'Explora el buffet y el menú criollo. Cuéntanos tu fecha, distrito e invitados para cotizar por WhatsApp.',
        ),
      },
      complementos: {
        title: 'Servicios para tu evento',
        description:
          'Bartender, mozos, menaje, sillas, flores, recuerdos y polos. Elige lo que te hace falta para tu evento; también puedes pedir un solo servicio.',
        seo: seo(
          'Servicios para eventos en Lima | Gladys',
          'Bartender, mozos, alquiler de menaje y sillas, arreglos florales, recuerdos y polos para eventos. Precios a consulta por WhatsApp.',
        ),
      },
      'tipos-evento': {
        title: 'Ideas para tu evento',
        description:
          'Explora opciones para cumpleaños, graduaciones, bodas, bautizos, reuniones familiares y eventos de empresa en Lima Metropolitana.',
        seo: seo(
          'Catering para celebraciones y empresas en Lima | Gladys',
          'Explora catering para cumpleaños, graduaciones, fiestas de promoción, bodas, fin de año, desayunos corporativos y eventos empresariales en Lima.',
        ),
      },
    },
    footer:
      'Buffet y servicios para eventos en Lima Metropolitana. Cotiza por WhatsApp.',
    logoId: 'logo-gladys',
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
  media: [
    {
      id: 'logo-gladys',
      url: '/images/brand/gladys-logo.png',
      alt: 'Gladys Eventos & Experiencias',
      caption: '',
      demo: false,
      width: 1254,
      height: 1254,
      bytes: 565079,
      variants: [
        { url: '/images/brand/gladys-logo-160.webp', width: 160, height: 160, bytes: 11140 },
        { url: '/images/brand/gladys-logo-320.webp', width: 320, height: 320, bytes: 27256 },
      ],
      tags: ['logo', 'marca'],
    },
    ...Object.entries(designImages).map(([name, variants]) => ({
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
    })),
  ]
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
      'Catering para bodas y aniversarios',
      'Una propuesta para celebrar con buena comida, atención y detalles elegidos a tu manera.',
      'imagen-sillas',
      {
        slug: 'catering-bodas-aniversarios-lima',
        featured: false,
        sortOrder: 3,
        category: 'Celebraciones',
        body: 'Cuéntanos cómo imaginas ese día y cuántas personas quieres reunir. Podemos combinar buffet, barra, atención, menaje, sillas, flores y recuerdos en una sola consulta.',
        details: [
          'Elige únicamente los servicios que necesita tu celebración',
          'Ajustamos cantidades, estilo y logística contigo',
          'Recibe la propuesta y disponibilidad por WhatsApp',
        ],
        serviceIds: ['buffet-para-eventos'],
        addOnIds: ['bar-bartender', 'mozos-evento', 'menaje-evento', 'sillas-evento', 'arreglos-florales', 'recuerdos-evento'],
        seo: seo(
          'Catering para bodas y aniversarios en Lima | Gladys',
          'Cotiza buffet, bartender, mozos, menaje, sillas, flores y recuerdos para bodas y aniversarios en Lima Metropolitana.',
        ),
        faqItems: [
          { id: 'boda-paquete', question: '¿Tengo que contratar todos los servicios?', answer: 'No. Puedes elegir un solo servicio o combinar varios. Preparamos la cotización según lo que realmente necesites.' },
          { id: 'boda-cobertura', question: '¿Atienden bodas en todo Lima?', answer: 'Atendemos Lima Metropolitana. Confírmanos el distrito, la fecha y el acceso al lugar para revisar el traslado.' },
        ],
      },
    ),
    entry(
      'cumpleanos',
      'tipos-evento',
      'Catering para cumpleaños en Lima',
      'Una mesa rica y bien presentada para celebrar sin pasar el día pendiente de la cocina.',
      'imagen-buffet-demo',
      {
        slug: 'catering-cumpleanos-lima',
        featured: false,
        sortOrder: 1,
        category: 'Celebraciones',
        body: 'Reúne a tus invitados. Nosotros te ayudamos a combinar el buffet con mozos, bartender, menaje, sillas, flores o recuerdos, según el tamaño y el estilo del cumpleaños.',
        details: [
          'Opciones para cumpleaños familiares, infantiles y de adultos',
          'Servicios que puedes añadir o quitar en esta misma página',
          'Precio y disponibilidad confirmados directamente por WhatsApp',
        ],
        serviceIds: ['buffet-para-eventos'],
        menuIds: ['menu-criollo-eventos'],
        addOnIds: ['bar-bartender', 'mozos-evento', 'menaje-evento', 'sillas-evento', 'arreglos-florales', 'recuerdos-evento'],
        seo: seo(
          'Catering para cumpleaños en Lima | Buffet y servicios | Gladys',
          'Arma tu catering para cumpleaños en Lima con buffet, bartender, mozos, menaje, sillas, flores y recuerdos. Cotiza por WhatsApp.',
        ),
        faqItems: [
          { id: 'cumple-flexible', question: '¿Puedo contratar solamente el buffet?', answer: 'Sí. También puedes añadir atención, alquileres o detalles si te hacen falta. La cotización se adapta a tu celebración.' },
          { id: 'cumple-invitados', question: '¿Necesito saber el número exacto de invitados?', answer: 'Puedes empezar con una cantidad aproximada. Antes de confirmar coordinaremos contigo las cantidades finales.' },
          { id: 'cumple-formatos', question: '¿Puedo consultar por un cumpleaños infantil, de adultos o un quinceañero?', answer: 'Sí. Dinos qué celebras, cuántas personas esperas y si será en casa o en un local. Selecciona sólo la comida y los servicios que te interesen para conversar sobre una propuesta adecuada.' },
          { id: 'cumple-barra', question: '¿La barra está incluida en cualquier cumpleaños?', answer: 'No. Bartender es un servicio opcional y no se sugiere por defecto para celebraciones infantiles. Si tu evento es de adultos, puedes añadirlo a la consulta.' },
        ],
      },
    ),
    entry(
      'bautizos-comuniones',
      'tipos-evento',
      'Buffet para bautizos y primeras comuniones',
      'Comida, atención y detalles para compartir un día especial con la familia.',
      'imagen-flores',
      {
        slug: 'buffet-bautizos-comuniones-lima',
        featured: false,
        sortOrder: 2,
        category: 'Celebraciones',
        body: 'Organiza el almuerzo o la recepción desde una sola página. Elige buffet, menaje, mozos, sillas, flores y recuerdos; nosotros revisamos contigo la fecha, el lugar y las cantidades.',
        details: [
          'Propuesta flexible para almuerzo, recepción o reunión familiar',
          'Flores y recuerdos disponibles como servicios independientes',
          'Coordinación para cualquier distrito de Lima Metropolitana',
        ],
        serviceIds: ['buffet-para-eventos'],
        menuIds: ['menu-criollo-eventos'],
        addOnIds: ['mozos-evento', 'menaje-evento', 'sillas-evento', 'arreglos-florales', 'recuerdos-evento'],
        seo: seo(
          'Buffet para bautizos y primeras comuniones en Lima | Gladys',
          'Cotiza buffet, mozos, menaje, sillas, flores y recuerdos para bautizos y primeras comuniones en Lima Metropolitana.',
        ),
        faqItems: [
          { id: 'bautizo-servicios', question: '¿Puedo pedir flores o recuerdos sin contratar buffet?', answer: 'Sí. Cada servicio puede cotizarse de forma independiente o como parte de una propuesta más completa.' },
          { id: 'bautizo-menu', question: '¿Podemos conversar sobre un menú familiar?', answer: 'Sí. Cuéntanos qué te gustaría servir y para cuántas personas; revisaremos contigo una propuesta adecuada.' },
        ],
      },
    ),
    entry(
      'reuniones-familiares',
      'tipos-evento',
      'Buffet para reuniones familiares',
      'Comida para compartir en casa, celebrar una fecha o simplemente volver a reunir a todos.',
      'imagen-menaje',
      {
        slug: 'buffet-reuniones-familiares-lima',
        featured: false,
        sortOrder: 4,
        category: 'Celebraciones',
        body: 'Empieza por el buffet o el menú criollo y añade menaje, sillas o atención si lo necesitas. Te ayudamos a resolver lo esencial sin convertir la reunión en una producción complicada.',
        details: [
          'Buffet o menú para compartir según tu reunión',
          'Alquileres y atención disponibles de forma opcional',
          'Una sola consulta con todo lo que hayas seleccionado',
        ],
        serviceIds: ['buffet-para-eventos'],
        menuIds: ['menu-criollo-eventos'],
        addOnIds: ['mozos-evento', 'menaje-evento', 'sillas-evento'],
        seo: seo(
          'Buffet para reuniones familiares en Lima | Gladys',
          'Cotiza buffet, menú criollo, mozos, menaje y sillas para reuniones familiares en Lima Metropolitana.',
        ),
        faqItems: [
          { id: 'familia-casa', question: '¿Pueden atender una reunión en casa?', answer: 'Sí. Indícanos el distrito, la fecha, el acceso y la cantidad de invitados para revisar la logística contigo.' },
          { id: 'familia-menu', question: '¿El menú tiene que ser igual para todos?', answer: 'Conversaremos sobre las opciones que necesitas, incluidas alternativas vegetarianas que deban coordinarse.' },
          { id: 'familia-baby-shower', question: '¿Puedo consultar por un baby shower o un almuerzo familiar?', answer: 'Sí. Cuéntanos el tipo de reunión, el lugar y cuántas personas asistirán. Puedes empezar por la comida y añadir atención o alquileres sólo si los necesitas.' },
        ],
      },
    ),
    entry(
      'desayunos-corporativos',
      'tipos-evento',
      'Desayunos corporativos en Lima',
      'Desayunos para aniversarios, reuniones, capacitaciones y momentos de reconocimiento en la empresa.',
      'imagen-buffet-demo',
      {
        slug: 'desayunos-corporativos-lima',
        featured: false,
        sortOrder: 5,
        category: 'Empresas',
        body: 'Cuéntanos para cuántas personas será, dónde se realizará y si prefieres una presentación individual o una mesa para compartir. Puedes añadir menaje, atención y polos para el equipo.',
        details: [
          'Alternativas para equipos, reuniones y aniversarios de empresa',
          'Cantidad y modalidad ajustadas al espacio y al horario',
          'Cotización directa por WhatsApp sin formularios extensos',
        ],
        serviceIds: ['desayuno-corporativo'],
        addOnIds: ['mozos-evento', 'menaje-evento', 'polos-estampados', 'arreglos-florales'],
        seo: seo(
          'Desayunos corporativos en Lima para empresas | Gladys',
          'Cotiza desayunos corporativos, coffee break, menaje y atención para reuniones, aniversarios y equipos en Lima Metropolitana.',
        ),
        faqItems: [
          { id: 'desayuno-modalidad', question: '¿Puede ser un desayuno individual o para compartir?', answer: 'Sí. Indica la cantidad de personas, el horario y el tipo de reunión para conversar sobre la presentación más conveniente.' },
          { id: 'desayuno-horario', question: '¿Con cuánto tiempo debemos coordinar?', answer: 'Consulta la fecha tan pronto como la tengas. Confirmaremos disponibilidad, horario de entrega o servicio y condiciones por WhatsApp.' },
          { id: 'desayuno-capacitacion', question: '¿Podemos pedir un coffee break para una capacitación?', answer: 'Sí. Indícanos el horario de pausa, el número aproximado de participantes y el distrito. Revisaremos contigo la modalidad y si hace falta menaje o atención.' },
        ],
      },
    ),
    entry(
      'corporativo',
      'tipos-evento',
      'Catering para eventos empresariales',
      'Comida y servicios para aniversarios, reuniones, inauguraciones y celebraciones con tu equipo.',
      'imagen-mozos',
      {
        slug: 'catering-eventos-empresariales-lima',
        featured: false,
        sortOrder: 6,
        category: 'Empresas',
        body: 'Reúne en una sola solicitud el catering, la barra, la atención, el menaje, las sillas y los polos del equipo. Ajustamos la propuesta al formato y al número de asistentes.',
        details: [
          'Opciones para aniversarios, inauguraciones y encuentros de equipo',
          'Servicios independientes o combinados en una sola propuesta',
          'Cobertura para empresas en toda Lima Metropolitana',
        ],
        serviceIds: ['buffet-para-eventos', 'desayuno-corporativo'],
        menuIds: ['menu-criollo-eventos'],
        addOnIds: ['bar-bartender', 'mozos-evento', 'menaje-evento', 'sillas-evento', 'polos-estampados'],
        seo: seo(
          'Catering para eventos empresariales en Lima | Gladys',
          'Cotiza catering, coffee break, bartender, mozos, menaje, sillas y polos para eventos empresariales en Lima Metropolitana.',
        ),
        faqItems: [
          { id: 'empresa-factores', question: '¿Qué información necesitan para cotizar?', answer: 'Fecha, distrito, horario, cantidad aproximada de asistentes y los servicios que deseas incluir.' },
          { id: 'empresa-combinar', question: '¿Podemos combinar comida, atención y polos?', answer: 'Sí. Selecciona las opciones en esta página y recibirás una sola conversación organizada por WhatsApp.' },
          { id: 'empresa-lanzamiento', question: '¿Puedo consultar por una inauguración o un lanzamiento?', answer: 'Sí. Cuéntanos si será un desayuno, almuerzo o recepción, cuántas personas asistirán y dónde se realizará. Te diremos qué servicios podemos coordinar para ese formato.' },
        ],
      },
    ),
    ...newOccasions,
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
        eventTypeIds: [
          'boda',
          'cumpleanos',
          'bautizos-comuniones',
          'reuniones-familiares',
          'corporativo',
        ],
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
        eventTypeIds: [
          'cumpleanos',
          'bautizos-comuniones',
          'reuniones-familiares',
          'corporativo',
        ],
        coverageIds: ['lima-metropolitana'],
      },
    ),
    entry(
      'desayuno-corporativo',
      'servicios',
      'Desayuno corporativo y coffee break',
      'Desayunos para equipos, reuniones, capacitaciones y aniversarios de empresa en Lima Metropolitana.',
      'imagen-buffet-demo',
      {
        slug: 'desayunos-corporativos-coffee-break',
        sortOrder: 2,
        category: 'Empresas',
        body: 'Elige una presentación individual, una mesa para compartir o un coffee break. Cuéntanos el horario, la cantidad de personas y el lugar para preparar una propuesta por WhatsApp.',
        details: [
          'Presentación individual, mesa compartida o coffee break',
          'Café, infusiones y bebidas según coordinación',
          'Entrega o atención sujetas al lugar y al horario confirmados',
        ],
        price: consultationPrice('person', 1),
        requestable: true,
        ownerId: 'cocina',
        prominence: 'primary',
        quoteConfig: corporateBreakfast,
        eventTypeIds: ['desayunos-corporativos', 'corporativo'],
        coverageIds: ['lima-metropolitana'],
        addOnIds: ['mozos-evento', 'menaje-evento', 'polos-estampados', 'arreglos-florales'],
        recommendations: [
          { entryId: 'mozos-evento', priority: 1, eventTypeIds: [], reason: 'Añade atención si el desayuno se servirá durante una reunión o ceremonia.' },
          { entryId: 'menaje-evento', priority: 2, eventTypeIds: [], reason: 'Completa la mesa con vajilla, cubiertos y tazas.' },
          { entryId: 'polos-estampados', priority: 3, eventTypeIds: [], reason: 'Puede acompañar un aniversario o una actividad de equipo.' },
        ],
        seo: seo(
          'Desayunos corporativos y coffee break en Lima | Gladys',
          'Cotiza desayunos corporativos y coffee break para reuniones, capacitaciones y aniversarios de empresa en Lima Metropolitana.',
        ),
        faqItems: [
          { id: 'desayuno-cantidad', question: '¿Para cuántas personas puedo cotizar?', answer: 'Indica una cantidad aproximada. Confirmaremos contigo las porciones y la presentación antes de reservar.' },
          { id: 'desayuno-entrega', question: '¿Incluye entrega o atención?', answer: 'Depende del formato y del lugar. Selecciona los servicios que necesitas y revisaremos las condiciones en la propuesta.' },
        ],
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
