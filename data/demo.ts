import designImages from './design-images.json';
import { emptyEntry, normalizeSite } from './defaults';
import { newOccasions } from './occasion-entries';
import { commercialExpansionEntries } from './commercial-expansion';
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
    availability: 'active',
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
  overrides: Partial<ContentEntry> = {},
) =>
  entry(id, 'servicios', title, description, imageId, {
    sortOrder,
    requestable: true,
    ownerId,
    quoteConfig: perUnit(1, 100000),
    price: consultationPrice('unit', 1),
    faqItems: [
      {
        id: `${id}-solo`,
        question: `¿Puedo contratar solamente ${title.toLowerCase()}?`,
        answer: 'Sí. Puedes cotizar este servicio por separado o añadirlo a otros servicios para enviar una sola consulta.',
      },
      {
        id: `${id}-datos`,
        question: '¿Qué datos necesitan para cotizar?',
        answer: 'Indica la fecha, el distrito, la cantidad aproximada y cualquier detalle del espacio o del evento que influya en el servicio.',
      },
      {
        id: `${id}-confirmacion`,
        question: '¿Cómo se confirma la disponibilidad?',
        answer: 'Revisamos la fecha, el lugar y el alcance por WhatsApp antes de confirmar el precio y la reserva.',
      },
    ],
    seo: seo(
      `${title} en Lima | Gladys`,
      `${description} Consulta disponibilidad y traslado en Lima Metropolitana por WhatsApp.`,
    ),
    ...overrides,
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
      'Gladys | Servicios para eventos y celebraciones en Lima',
      'Comida, personal, alquileres, entretenimiento, producción, decoración y personalizados para eventos en Lima. Cotiza por WhatsApp.',
    ),
    navigation: [
      { label: 'Servicios', href: '/servicios' },
      { label: 'Eventos', href: '/eventos' },
      { label: 'Empresas', href: '/empresas' },
      { label: 'Guías', href: '/guias' },
    ],
    catalogs: {
      servicios: {
        title: 'Servicios para eventos en Lima',
        description:
          'Encuentra cocina, bar, personal, alquileres, entretenimiento, producción, decoración y personalizados para eventos en Lima.',
        seo: seo(
          'Servicios para eventos en Lima | Gladys',
          'Explora servicios de cocina, bar, personal, alquileres, entretenimiento, producción, decoración y personalizados en Lima.',
        ),
      },
      complementos: {
        title: 'Servicios para tu evento',
        description:
          'Comida, bar, personal, alquileres, música, entretenimiento, producción, decoración y personalizados. Elige uno o combina varios.',
        seo: seo(
          'Servicios para eventos en Lima | Gladys',
          'Servicios para eventos en Lima: bar, personal, alquileres, música, producción, decoración y personalizados. Cotiza por WhatsApp.',
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
      menus: {
        title: 'Menús para compartir',
        description:
          'Opciones de menú para cumpleaños, reuniones familiares y encuentros de trabajo en Lima Metropolitana.',
        seo: {
          ...seo(
            'Menús para eventos y reuniones en Lima | Gladys',
            'Explora menús para cumpleaños, reuniones y eventos de trabajo en Lima Metropolitana. Consulta opciones y disponibilidad por WhatsApp.',
          ),
          noindex: true,
        },
      },
      cobertura: {
        title: 'Cobertura en Lima Metropolitana',
        description:
          'Consulta la atención, el acceso y el traslado para tu evento según el distrito y la fecha.',
        seo: {
          ...seo(
            'Cobertura de servicios para eventos en Lima | Gladys',
            'Gladys atiende eventos en Lima Metropolitana. Indica el distrito y la fecha para revisar acceso, traslado y disponibilidad.',
          ),
          noindex: true,
        },
      },
      paginas: {
        title: 'Conoce Gladys',
        description:
          'Conoce cómo Gladys combina comida, atención, alquileres y detalles para eventos en Lima Metropolitana.',
        seo: {
          ...seo(
            'Conoce Gladys | Servicios para eventos en Lima',
            'Conoce cómo Gladys organiza una sola propuesta con los servicios que cada celebración o empresa necesita.',
          ),
          noindex: true,
        },
      },
    },
    footer:
      'Soluciones para eventos, celebraciones y empresas en Lima Metropolitana. Elige uno o varios servicios y cotiza por WhatsApp.',
    logoId: 'logo-gladys',
    copy: {
      demoNotice:
        'Imágenes referenciales. Cada propuesta se confirma por WhatsApp antes de reservar.',
      quoteTitle: 'Cotiza los servicios para tu evento.',
      quoteDescription:
        'Elige uno o varios servicios e indica la fecha, el distrito y las cantidades aproximadas. Prepararemos un solo mensaje para continuar por WhatsApp.',
      inquire: 'Añadir a mi evento',
      primaryCta: 'Arma tu evento',
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
      'cocina-para-eventos',
      'servicios',
      'Cocina para eventos en Lima',
      'Comida para cumpleaños, reuniones, celebraciones familiares y encuentros de empresa, con una propuesta ajustada a tus invitados.',
      'imagen-buffet-demo',
      {
        slug: 'cocina-para-eventos-lima',
        sortOrder: 0,
        category: 'Cocina y alimentación',
        body: 'Si buscas quién prepare la comida para tu evento, aquí puedes empezar. Elige buffet, menú criollo o desayuno corporativo y añade únicamente la atención, el menaje o los detalles que necesites.',
        details: [
          'Buffet para celebraciones y encuentros de empresa',
          'Menú criollo para compartir',
          'Desayunos corporativos y coffee break',
          'Cotización según fecha, distrito y cantidad aproximada de invitados',
        ],
        serviceIds: [
          'buffet-para-eventos',
          'desayuno-corporativo',
          'bocaditos-piqueos-eventos',
          'brunch-box-eventos',
          'almuerzos-cenas-corporativas',
        ],
        menuIds: ['menu-criollo-eventos'],
        addOnIds: ['bar-bartender', 'bebidas-barra-eventos', 'menaje-evento'],
        seo: seo(
          'Cocina para eventos en Lima | Comida y catering | Gladys',
          'Cotiza comida, buffet, menú criollo, desayunos y coffee break para cumpleaños, reuniones y eventos de empresa en Lima Metropolitana.',
        ),
        faqItems: [
          {
            id: 'cocina-solo-comida',
            question: '¿Puedo contratar solamente la comida?',
            answer: 'Sí. Puedes cotizar buffet, menú o desayuno sin añadir otros servicios. Si necesitas menaje o atención, agrégalos a la misma consulta.',
          },
          {
            id: 'cocina-datos',
            question: '¿Qué datos necesitan para cotizar?',
            answer: 'Indica la fecha, el distrito, la cantidad aproximada de personas y el formato de comida que buscas. Confirmaremos opciones y condiciones por WhatsApp.',
          },
        ],
      },
    ),
    entry(
      'boda',
      'tipos-evento',
      'Catering para bodas y aniversarios de pareja',
      'Comida y atención para una recepción de boda o aniversario de pareja, con los complementos que realmente necesites.',
      'imagen-sillas',
      {
        slug: 'catering-bodas-aniversarios-lima',
        featured: false,
        sortOrder: 3,
        category: 'Celebraciones',
        body: 'Esta página está pensada para recepciones de boda y aniversarios de pareja. Si organizarás únicamente una ceremonia civil o una comida íntima, encontrarás una opción específica. Aquí puedes combinar buffet, barra, atención, menaje, sillas, flores y recuerdos para una recepción más amplia.',
        details: [
          'Elige únicamente los servicios que necesita tu celebración',
          'Ajustamos cantidades, estilo y logística contigo',
          'Recibe la propuesta y disponibilidad por WhatsApp',
        ],
        serviceIds: ['buffet-para-eventos'],
        addOnIds: ['bar-bartender', 'mozos-evento', 'menaje-evento', 'sillas-evento', 'arreglos-florales', 'recuerdos-evento'],
        seo: seo(
          'Catering para bodas y aniversarios de pareja en Lima | Gladys',
          'Cotiza buffet, bartender, mozos, menaje, sillas, flores y recuerdos para recepciones de boda y aniversarios de pareja en Lima.',
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
      'Catering para cumpleaños familiares y de adultos en Lima',
      'Comida y atención para un cumpleaños familiar o de adultos, en casa o en un local.',
      'imagen-buffet-demo',
      {
        slug: 'catering-cumpleanos-lima',
        featured: false,
        sortOrder: 1,
        category: 'Celebraciones',
        body: 'Esta página reúne opciones para cumpleaños familiares y de adultos. Combina buffet con mozos, bartender, menaje, sillas, flores o recuerdos según el lugar y el horario. Para una celebración infantil o un quinceaños, usa la página dedicada a esa ocasión.',
        details: [
          'Opciones para cumpleaños familiares y de adultos',
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
          { id: 'cumple-formatos', question: '¿Esta opción sirve para un cumpleaños infantil o un quinceaños?', answer: 'Para esas ocasiones hay páginas específicas con animación, producción y otros servicios adecuados. Esta página se concentra en cumpleaños familiares y de adultos.' },
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
        seo: {
          ...seo(
          'Cómo organizar un desayuno corporativo en Lima | Gladys',
          'Elige alimentación, menaje y atención para una reunión, capacitación o aniversario de empresa en Lima Metropolitana.',
          ),
          noindex: true,
        },
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
        seo: {
          ...seo(
          'Catering para eventos empresariales en Lima | Gladys',
          'Cotiza catering, coffee break, bartender, mozos, menaje, sillas y polos para eventos empresariales en Lima Metropolitana.',
          ),
          noindex: true,
        },
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
      {
        featured: false,
        sortOrder: 1,
        body: 'La cobertura se revisa según la fecha, el distrito, el acceso al lugar y los servicios elegidos. Lima Metropolitana comprende 43 distritos. Callao se consulta por separado antes de confirmar el servicio.',
        details: [
          'Lima Norte: Ancón, Carabayllo, Comas, Independencia, Los Olivos, Puente Piedra, San Martín de Porres y Santa Rosa',
          'Lima Centro: Barranco, Breña, Cercado de Lima, Jesús María, La Victoria, Lince, Magdalena del Mar, Miraflores, Pueblo Libre, Rímac, San Borja, San Isidro, San Luis, San Miguel y Surquillo',
          'Lima Este: Ate, Chaclacayo, Cieneguilla, El Agustino, La Molina, Lurigancho-Chosica, San Juan de Lurigancho y Santa Anita',
          'Lima Sur: Chorrillos, Lurín, Pachacámac, Pucusana, Punta Hermosa, Punta Negra, San Bartolo, San Juan de Miraflores, Santa María del Mar, Santiago de Surco, Villa El Salvador y Villa María del Triunfo',
        ],
        processSteps: [
          { title: 'Indica distrito y dirección aproximada', description: 'Con esos datos se revisan distancia, acceso, estacionamiento y condiciones de carga o descarga.' },
          { title: 'Añade fecha y horario', description: 'La disponibilidad y el traslado dependen del día, la hora de ingreso y el momento de retiro.' },
          { title: 'Confirma antes de reservar', description: 'La propuesta final detalla cobertura, traslado y cualquier condición especial del lugar.' },
        ],
        faqItems: [
          { id: 'cobertura-callao', question: '¿Atienden en Callao?', answer: 'Se consulta por separado. Comparte la dirección, fecha y servicios para revisar si la atención es viable.' },
          { id: 'cobertura-traslado', question: '¿El traslado está incluido?', answer: 'No se asume automáticamente. La propuesta confirma el traslado según distrito, acceso y servicios elegidos.' },
        ],
        seo: seo(
          'Servicios para eventos en Lima Metropolitana | Gladys',
          'Consulta la cobertura de servicios para celebraciones y eventos de empresa en los 43 distritos de Lima Metropolitana, según fecha y ubicación.',
        ),
      },
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
        seo: seo(
          'Buffet para eventos en Lima | Catering para celebraciones | Gladys',
          'Cotiza buffet para cumpleaños, bodas, reuniones familiares y eventos empresariales en Lima Metropolitana.',
        ),
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
        addOnIds: ['mozos-evento', 'menaje-evento', 'sillas-evento'],
        recommendations: [
          { entryId: 'mozos-evento', priority: 1, eventTypeIds: [], reason: 'Añade atención si prefieres que alguien acompañe el servicio.' },
          { entryId: 'menaje-evento', priority: 2, eventTypeIds: [], reason: 'Completa la mesa con vajilla, cubiertos y copas.' },
          { entryId: 'sillas-evento', priority: 3, eventTypeIds: [], reason: 'Suma sillas si el espacio no tiene mobiliario suficiente.' },
        ],
        seo: seo(
          'Menú criollo para eventos en Lima | Gladys',
          'Cotiza un menú criollo para cumpleaños, reuniones familiares y eventos de trabajo en Lima Metropolitana.',
        ),
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
      'servicios',
      'Bartender y barra de bebidas',
      'Un bartender y una barra de bebidas para acompañar tu celebración. Cuéntanos qué te gustaría ofrecer a tus invitados.',
      'imagen-bar-demo',
      {
        sortOrder: 1,
        body: 'El servicio principal es la atención del bartender. La carta, los insumos, la barra física y la cristalería se definen según el tipo de reunión, la cantidad de invitados y lo que ya tenga el lugar. Nada se considera incluido hasta revisar la propuesta.',
        details: [
          'Atención de bartender durante el horario acordado',
          'Carta de bebidas definida antes de reservar',
          'Barra, cristalería e insumos solo cuando la propuesta los incluya',
        ],
        price: consultationPrice('event', 1),
        requestable: true,
        ownerId: 'cocina',
        quoteConfig: perEvent,
        coverageIds: ['lima-metropolitana'],
        recommendations: [
          { entryId: 'menaje-evento', priority: 1, eventTypeIds: [], reason: 'Coordina la cristalería y el menaje que utilizarán tus invitados.' },
          { entryId: 'mozos-evento', priority: 2, eventTypeIds: [], reason: 'Añade personal de atención si también habrá servicio en mesas.' },
          { entryId: 'sillas-evento', priority: 3, eventTypeIds: [], reason: 'Suma sillas si el espacio no tiene mobiliario suficiente.' },
        ],
        faqItems: [
          { id: 'bartender-incluye', question: '¿Contratar bartender incluye bebidas y cristalería?', answer: 'No automáticamente. La propuesta indicará si incluye insumos, hielo, cristalería, implementos o barra física.' },
          { id: 'bartender-sin-alcohol', question: '¿Puedo pedir una carta sin alcohol?', answer: 'Sí. Cuéntanos qué público asistirá y qué tipo de bebidas quieres ofrecer para revisar una carta adecuada.' },
          { id: 'bartender-datos', question: '¿Qué necesitan para cotizar?', answer: 'Cantidad aproximada de invitados, fecha, distrito, horario, lugar y alcance esperado de la barra.' },
        ],
        seo: seo(
          'Bartender para eventos en Lima | Barra de bebidas | Gladys',
          'Cotiza bartender, barra y cristalería para cumpleaños, bodas y eventos empresariales en Lima Metropolitana.',
        ),
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
      {
        body: 'La cantidad de mozos depende del número de invitados, la forma de servir y las tareas asignadas. Indica si atenderán mesas, apoyarán un buffet o recibirán invitados; el horario, el uniforme y las funciones se acuerdan antes de reservar.',
        details: ['Atención en mesas o apoyo de buffet según el formato', 'Horario y tareas definidos en la propuesta', 'Cantidad de personal calculada según invitados y operación'],
        faqItems: [
          { id: 'mozos-cantidad', question: '¿Cuántos mozos necesita mi evento?', answer: 'Depende de los invitados, el menú, la distribución y si habrá atención en mesa o buffet. Lo calculamos con esos datos.' },
          { id: 'mozos-tareas', question: '¿Qué tareas pueden realizar?', answer: 'La propuesta debe indicar si atenderán mesas, apoyarán el buffet, recibirán invitados o realizarán otra función acordada.' },
          { id: 'mozos-horario', question: '¿Cómo se define el horario?', answer: 'Indica montaje, llegada de invitados, comida y cierre. Confirmaremos las horas incluidas antes de reservar.' },
        ],
        recommendations: [
          { entryId: 'menaje-evento', priority: 1, eventTypeIds: [], reason: 'Añade el menaje que utilizará el personal durante el servicio.' },
          { entryId: 'sillas-evento', priority: 2, eventTypeIds: [], reason: 'Completa el mobiliario si necesitas asientos para tus invitados.' },
          { entryId: 'arreglos-florales', priority: 3, eventTypeIds: [], reason: 'Suma flores si quieres ambientar las mesas o la recepción.' },
        ],
      },
    ),
    addon(
      'menaje-evento',
      'Alquiler de menaje',
      'Alquiler de vajilla, cubiertos y copas para tu evento. Cuéntanos qué necesitas para poner la mesa.',
      3,
      20,
      'cocina',
      'imagen-menaje',
      {
        body: 'El menaje se calcula a partir del menú y de las bebidas, no solo del número de invitados. Dinos qué se servirá y qué piezas ya tiene el lugar para revisar vajilla, cubiertos, vasos, copas, tazas y elementos de apoyo sin duplicar cantidades.',
        details: ['Vajilla y cubiertos según los tiempos del menú', 'Vasos, copas o tazas según las bebidas', 'Piezas de servicio definidas antes de reservar'],
        faqItems: [
          { id: 'menaje-calculo', question: '¿Cómo calculan la cantidad de menaje?', answer: 'Se revisan invitados, menú, bebidas, forma de servicio y piezas que ya tiene el lugar.' },
          { id: 'menaje-piezas', question: '¿Puedo alquilar solo algunas piezas?', answer: 'Sí. Indica si necesitas únicamente platos, cubiertos, vasos, copas, tazas u otros elementos.' },
          { id: 'menaje-devolucion', question: '¿Cómo se coordinan entrega y devolución?', answer: 'Distrito, acceso, horarios y condiciones se detallan en la propuesta antes de confirmar.' },
        ],
        recommendations: [
          { entryId: 'sillas-evento', priority: 1, eventTypeIds: [], reason: 'Completa el mobiliario disponible con sillas para tus invitados.' },
          { entryId: 'arreglos-florales', priority: 2, eventTypeIds: [], reason: 'Suma flores para ambientar las mesas o la recepción.' },
          { entryId: 'recuerdos-evento', priority: 3, eventTypeIds: [], reason: 'Añade un detalle para entregar a tus invitados.' },
        ],
      },
    ),
    addon(
      'sillas-evento',
      'Alquiler de sillas',
      'Alquiler de sillas para reunir a tus invitados. Dinos cuántas necesitas y dónde será tu evento.',
      4,
      20,
      'eventos',
      'imagen-sillas',
      {
        body: 'Para cotizar sillas necesitamos cantidad, tipo de evento, espacio y condiciones de acceso. El modelo, el traslado, la colocación y el retiro se confirman en la propuesta; no se asume un modelo ni disponibilidad hasta revisar la fecha.',
        details: ['Cantidad y modelo sujetos a disponibilidad', 'Traslado según distrito y acceso', 'Colocación y retiro definidos en la propuesta'],
        faqItems: [
          { id: 'sillas-modelo', question: '¿Qué modelos de silla están disponibles?', answer: 'Se confirman según la fecha, cantidad y uso. Si tienes una referencia, envíala para revisar opciones.' },
          { id: 'sillas-mesas', question: '¿Las sillas incluyen mesas?', answer: 'No automáticamente. Puedes añadir mesas y mantelería como servicios separados en la misma consulta.' },
          { id: 'sillas-traslado', question: '¿Cómo se calcula el traslado?', answer: 'Se revisan distrito, acceso, horario, cantidad y condiciones de carga y descarga.' },
        ],
        recommendations: [
          { entryId: 'arreglos-florales', priority: 1, eventTypeIds: [], reason: 'Suma flores si quieres ambientar las mesas o la recepción.' },
          { entryId: 'recuerdos-evento', priority: 2, eventTypeIds: [], reason: 'Añade un detalle para entregar a tus invitados.' },
          { entryId: 'polos-estampados', priority: 3, eventTypeIds: [], reason: 'Incluye polos si forman parte de la celebración o actividad.' },
        ],
      },
    ),
    addon(
      'arreglos-florales',
      'Arreglos florales',
      'Arreglos florales para dar tu toque a las mesas y la recepción. Cuéntanos los colores y el estilo que te gustan.',
      5,
      1,
      'eventos',
      'imagen-flores',
      {
        body: 'Los arreglos se definen por ubicación, tamaño, paleta y tipo de flor disponible. Indica si necesitas piezas para mesas, recepción, ceremonia o un regalo; una referencia visual ayuda a entender el estilo, pero la propuesta final se confirma según temporada.',
        details: ['Arreglos para mesas, recepción o ceremonia', 'Paleta y tamaño acordados antes de producir', 'Flores y follaje sujetos a temporada y disponibilidad'],
        faqItems: [
          { id: 'flores-referencia', question: '¿Puedo enviar una foto de referencia?', answer: 'Sí. Sirve para entender paleta, forma y tamaño, sin asumir que se copiará exactamente ni atribuirla como trabajo de Gladys.' },
          { id: 'flores-temporada', question: '¿Puedo elegir cualquier flor?', answer: 'La selección final depende de temporada, fecha y disponibilidad. Podemos conversar sobre alternativas del mismo estilo.' },
          { id: 'flores-recipientes', question: '¿Los recipientes quedan incluidos?', answer: 'La propuesta indicará si se entregan, alquilan o deben devolverse.' },
        ],
        recommendations: [
          { entryId: 'recuerdos-evento', priority: 1, eventTypeIds: [], reason: 'Añade un detalle para entregar a tus invitados.' },
          { entryId: 'polos-estampados', priority: 2, eventTypeIds: [], reason: 'Incluye polos si forman parte de la celebración o actividad.' },
        ],
      },
    ),
    addon(
      'recuerdos-evento',
      'Recuerdos para invitados',
      'Recuerdos para que tus invitados se lleven un detalle de tu celebración. Conversemos sobre la idea que tienes en mente.',
      6,
      20,
      'eventos',
      'imagen-recuerdos',
      {
        body: 'Un recuerdo se define por destinatario, cantidad, material, personalización y fecha de entrega. Cuéntanos qué quieres comunicar y si se entregará durante el evento; revisaremos opciones sin asumir un producto, empaque o acabado hasta aprobar la propuesta.',
        details: ['Producto y material elegidos según la ocasión', 'Personalización con nombre, fecha, mensaje o diseño acordado', 'Empaque y entrega definidos antes de producir'],
        faqItems: [
          { id: 'recuerdos-eleccion', question: '¿Qué recuerdo conviene para mi evento?', answer: 'Depende de la ocasión, el público, la cantidad y el presupuesto. Comparte esos datos para revisar opciones.' },
          { id: 'recuerdos-diseno', question: '¿Puedo enviar mi propio diseño?', answer: 'Sí. Antes de producir se revisan formato, tamaño, colores y viabilidad del archivo.' },
          { id: 'recuerdos-plazo', question: '¿Con cuánto tiempo debo pedirlos?', answer: 'El plazo depende del producto y la cantidad. La fecha de entrega se confirma antes de reservar.' },
        ],
        recommendations: [
          { entryId: 'polos-estampados', priority: 1, eventTypeIds: [], reason: 'Añade polos si también necesitas un detalle para el equipo o la celebración.' },
        ],
      },
    ),
    addon(
      'polos-estampados',
      'Polos estampados para eventos',
      'Polos estampados para tu equipo, una activación o una celebración. Cuéntanos tu idea y cuántos necesitas.',
      7,
      10,
      'eventos',
      'imagen-polos',
      {
        body: 'Los polos se cotizan según cantidad, tallas, prendas, colores y técnica de estampado. Envía el diseño o la idea y señala para qué se usarán; antes de producir se confirman materiales, ubicación del arte, muestra y fecha de entrega.',
        details: ['Tallas y colores acordados por cantidad', 'Estampado según diseño y uso de la prenda', 'Muestra o aprobación previa según la propuesta'],
        faqItems: [
          { id: 'polos-minimo', question: '¿Existe una cantidad mínima?', answer: 'La cantidad viable depende del tipo de prenda y estampado. Se confirma durante la cotización.' },
          { id: 'polos-tallas', question: '¿Cómo envío las tallas?', answer: 'Puedes comenzar con una distribución aproximada y confirmar la lista final antes de producir.' },
          { id: 'polos-archivo', question: '¿Qué archivo necesitan para el diseño?', answer: 'Envía el material disponible. Revisaremos resolución, colores y formato antes de aprobar la producción.' },
        ],
      },
    ),
    ...commercialExpansionEntries,
    entry(
      'nosotros',
      'paginas',
      'Soluciones para eventos, celebraciones y empresas',
      'Gladys reúne comida, atención, alquileres y detalles para que elijas solo lo que necesita tu evento en Lima Metropolitana.',
      'imagen-buffet-demo',
      {
        sortOrder: 1,
        body: 'Gladys reúne comida, atención, alquileres y detalles para celebraciones y empresas en Lima Metropolitana. Puedes contratar un solo servicio o combinar varios en una consulta. La fecha, el distrito, las cantidades, el precio y las condiciones se confirman por WhatsApp antes de reservar. Cocina, alimentación, catering, bar y menaje son atendidos por su equipo responsable; los demás servicios se coordinan con el segundo equipo y, cuando aplica, mediante proveedores aliados. En todos los casos recibes una sola conversación para revisar el alcance, sin tener que volver a explicar los datos de tu evento.',
        details: [
          'Buffet y menús',
          'Personal y barra',
          'Alquileres y detalles para el evento',
        ],
        processSteps: [
          { title: 'Empieza por una necesidad', description: 'Puedes consultar solo por comida, personal, alquileres, entretenimiento, producción o un producto personalizado.' },
          { title: 'Combina sin repetir datos', description: 'Añade los extras que necesites y prepara una sola consulta con fecha, distrito y cantidades aproximadas.' },
          { title: 'Confirma el alcance', description: 'El equipo responsable revisa disponibilidad, precio, traslado y condiciones contigo antes de reservar.' },
        ],
        faqItems: [
          { id: 'nosotros-un-servicio', question: '¿Tengo que contratar un paquete completo?', answer: 'No. Puedes cotizar un solo servicio o combinar varios según tu evento.' },
          { id: 'nosotros-aliados', question: '¿Todos los servicios son propios?', answer: 'No. Algunos se coordinan mediante aliados y se identifican en su ficha. La propuesta confirma quién participa y qué incluye.' },
        ],
        seo: seo(
          'Conoce Gladys | Servicios para eventos en Lima',
          'Conoce cómo Gladys combina comida, atención, alquileres y detalles para celebraciones y empresas en Lima Metropolitana.',
        ),
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
      secondaryHref: '/servicios',
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
    {
      id: 'un-servicio',
      question: '¿Puedo contratar un solo servicio?',
      answer:
        'Sí. Puedes pedir únicamente comida, bartender, personal, alquiler, decoración, entretenimiento, producción o personalizados, según disponibilidad.',
    },
    {
      id: 'combinar',
      question: '¿Cómo combino varios servicios?',
      answer:
        'Añade las opciones que necesitas y elige cuál será la principal. El cotizador reúne todo en un solo mensaje para que no tengas que repetir tu pedido.',
    },
    {
      id: 'anticipacion',
      question: '¿Con cuánta anticipación debo consultar?',
      answer:
        'Consulta apenas tengas una fecha aproximada. La anticipación necesaria depende del servicio, la cantidad, el distrito y la disponibilidad de cada proveedor.',
    },
    {
      id: 'aliados',
      question: '¿Todos los servicios son realizados directamente por Gladys?',
      answer:
        'Algunos servicios son propios y otros se coordinan con aliados especializados. Antes de reservar te confirmamos quién presta cada servicio y sus condiciones.',
    },
  ],
});
