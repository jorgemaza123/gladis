import type { SEOFields } from '@/models/content';

export type SeoHubConfig = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  audience: string;
  decisionIntro: string;
  choiceTips: readonly { title: string; description: string }[];
  relatedLinks: readonly { label: string; href: string }[];
  entryIds: readonly string[];
  secondaryLink?: { label: string; href: string };
  seo: SEOFields;
};

export const seoHubPages = {
  personalizados: {
    path: '/personalizados',
    eyebrow: 'Detalles para invitados y equipos',
    title: 'Personalizados para eventos en Lima',
    description:
      'Elige recuerdos, polos, tazas, tomatodos, cuadros, fotorecuerdos, llaveros, papelería o kits para celebraciones, equipos y marcas.',
    audience: 'Para familias, promociones, equipos y marcas que necesitan un detalle con nombre, foto, mensaje o identidad visual.',
    decisionIntro: 'Define primero para quién es el detalle, cuántas unidades necesitas y cuándo debe estar listo. El material, la técnica y el empaque se confirman en la propuesta.',
    choiceTips: [
      { title: 'Uso y destinatario', description: 'Un recuerdo para invitados, un uniforme de equipo y un regalo corporativo requieren acabados distintos.' },
      { title: 'Cantidad y fecha', description: 'Comparte una cantidad aproximada y la fecha de entrega para revisar producción y disponibilidad.' },
      { title: 'Diseño y presentación', description: 'Envía logo, texto o referencia; antes de producir se acuerdan medidas, colores y alcance.' },
    ],
    relatedLinks: [{ label: 'Eventos y celebraciones', href: '/eventos' }, { label: 'Soluciones para empresas', href: '/empresas' }],
    entryIds: [
      'recuerdos-evento', 'polos-estampados', 'tazas-personalizadas',
      'tomatodos-personalizados', 'cuadros-fotorecuerdos',
      'llaveros-personalizados', 'papeleria-eventos', 'kits-regalos-corporativos',
    ],
    secondaryLink: { label: 'Ver soluciones para empresas', href: '/empresas' },
    seo: {
      title: 'Recuerdos y personalizados para eventos en Lima | Gladys',
      description:
        'Cotiza recuerdos, polos, tazas, tomatodos, cuadros, fotorecuerdos, llaveros, papelería y kits personalizados para eventos y empresas en Lima.',
      noindex: false,
    },
  },
  alquiler: {
    path: '/alquiler',
    eyebrow: 'Alquileres disponibles',
    title: 'Alquiler para eventos en Lima',
    description:
      'Cotiza menaje, sillas, mesas, toldos, mantelería y mobiliario. Indica cantidades, fecha y distrito para revisar disponibilidad y traslado.',
    audience: 'Para celebraciones en casa, locales, recepciones y reuniones de empresa que necesitan completar mesa, asientos o áreas de servicio.',
    decisionIntro: 'El punto de partida es el número de asistentes y el espacio útil. Después se revisan el tipo de montaje, el acceso, la entrega y el retiro.',
    choiceTips: [
      { title: 'Mide el espacio', description: 'Reserva circulación, zonas de comida y salidas antes de calcular mesas, sillas o mobiliario.' },
      { title: 'Relaciona piezas y menú', description: 'El menaje cambia según los platos y bebidas que se servirán; no todas las reuniones necesitan lo mismo.' },
      { title: 'Confirma la logística', description: 'Distrito, pisos, ascensor, horario y superficie influyen en traslado, instalación y retiro.' },
    ],
    relatedLinks: [{ label: 'Calcular menaje', href: '/guias/como-calcular-menaje-para-evento' }, { label: 'Organizar un evento en casa', href: '/guias/como-organizar-evento-en-casa' }],
    entryIds: [
      'menaje-evento', 'sillas-evento', 'alquiler-mesas-eventos',
      'alquiler-toldos-carpas', 'manteleria-eventos', 'mobiliario-eventos',
    ],
    secondaryLink: { label: 'Ver todos los servicios', href: '/servicios' },
    seo: {
      title: 'Alquiler de menaje, sillas y mobiliario en Lima | Gladys',
      description:
        'Cotiza alquiler de menaje, sillas, mesas, toldos, mantelería y mobiliario para celebraciones y eventos de empresa en Lima Metropolitana.',
      noindex: false,
    },
  },
  empresas: {
    path: '/empresas',
    eyebrow: 'Soluciones para equipos y organizaciones',
    title: 'Servicios para empresas en Lima',
    description:
      'Organiza desayunos, coffee break, reuniones, celebraciones y eventos de fin de año con los servicios que tu empresa realmente necesita.',
    audience: 'Para áreas de administración, recursos humanos, marketing y equipos que coordinan reuniones, capacitaciones, lanzamientos o fechas internas.',
    decisionIntro: 'Comparte el objetivo, la agenda y el número de asistentes. Así se separan los recursos indispensables de los complementos y se evita pedir dos veces la misma información.',
    choiceTips: [
      { title: 'Agenda y asistentes', description: 'Los horarios de ingreso, pausas y cierre ordenan alimentación, personal y montaje técnico.' },
      { title: 'Formato de atención', description: 'Elige entre entrega, coffee break, almuerzo, recepción o una combinación adecuada al tiempo disponible.' },
      { title: 'Recursos del lugar', description: 'Indica mobiliario, audio, pantalla, conexión y accesos ya disponibles para cotizar únicamente lo que falta.' },
    ],
    relatedLinks: [{ label: 'Cómo organizar un evento corporativo', href: '/guias/como-organizar-evento-corporativo' }, { label: 'Producción audiovisual', href: '/produccion' }],
    entryIds: [
      'desayuno-corporativo',
      'desayunos-corporativos',
      'corporativo',
      'fin-ano-empresas',
      'almuerzos-cenas-corporativas',
      'capacitaciones-conferencias',
      'lanzamientos-inauguraciones',
      'activaciones-ferias',
      'aniversarios-empresa',
      'team-building',
      'kits-regalos-corporativos',
    ],
    secondaryLink: { label: 'Ver guías para empresas', href: '/guias' },
    seo: {
      title: 'Servicios para empresas y eventos corporativos en Lima | Gladys',
      description:
        'Cotiza desayunos, coffee break, catering y servicios para reuniones, aniversarios y eventos empresariales en Lima Metropolitana.',
      noindex: false,
    },
  },
  eventos: {
    path: '/eventos',
    eyebrow: 'Encuentra tu ocasión',
    title: 'Servicios para eventos y celebraciones en Lima',
    description:
      'Empieza por el evento que estás organizando. En cada página puedes elegir comida, personal, alquileres, entretenimiento, producción y detalles, y preparar una sola consulta.',
    audience: 'Para quien organiza una celebración familiar, una reunión privada o una actividad de empresa y quiere ver opciones adecuadas para esa ocasión.',
    decisionIntro: 'Entra por el tipo de evento para encontrar una selección inicial. Dentro de cada página puedes quitar servicios, añadir otros y enviar una sola consulta.',
    choiceTips: [
      { title: 'Define la ocasión', description: 'La edad del público, el objetivo y el horario ayudan a evitar opciones que no corresponden.' },
      { title: 'Empieza por lo esencial', description: 'Comida, espacio y atención suelen ordenar el resto de decisiones; los extras se añaden después.' },
      { title: 'Comparte datos aproximados', description: 'Fecha, distrito e invitados bastan para iniciar. Las cantidades finales se afinan antes de reservar.' },
    ],
    relatedLinks: [{ label: 'Todos los servicios', href: '/servicios' }, { label: 'Datos para cotizar', href: '/guias/datos-para-cotizar-un-evento' }],
    entryIds: [
      'cumpleanos', 'graduaciones', 'boda', 'bautizos-comuniones',
      'reuniones-familiares', 'desayunos-corporativos', 'corporativo',
      'fin-ano-empresas', 'cumpleanos-infantiles', 'quinceanos',
      'baby-shower-revelacion', 'matrimonio-civil', 'fiesta-casa-privada',
      'capacitaciones-conferencias', 'lanzamientos-inauguraciones',
      'activaciones-ferias', 'aniversarios-empresa', 'team-building',
    ],
    secondaryLink: { label: 'Explorar todos los servicios', href: '/servicios' },
    seo: {
      title: 'Servicios para eventos y celebraciones en Lima | Gladys',
      description:
        'Organiza cumpleaños, bodas, graduaciones, eventos infantiles y reuniones de empresa en Lima. Elige servicios y cotiza por WhatsApp.',
      noindex: false,
    },
  },
  entretenimiento: {
    path: '/entretenimiento',
    eyebrow: 'Música, animación y experiencias',
    title: 'Entretenimiento para eventos en Lima',
    description:
      'Cotiza DJ, orquesta, animación, hora loca, karaoke y opciones infantiles según el público, el horario y el espacio de tu evento.',
    audience: 'Para celebraciones sociales y actividades de empresa que necesitan música, conducción o una dinámica pensada para su público.',
    decisionIntro: 'La mejor opción depende del momento que quieres cubrir, las edades, el área disponible y el equipo técnico del local.',
    choiceTips: [
      { title: 'Música durante todo el evento', description: 'Un DJ cubre distintos momentos y repertorios; la propuesta debe indicar duración y equipo requerido.' },
      { title: 'Presentación en vivo', description: 'Una orquesta o artista necesita espacio, tiempos de montaje, pausas y sonido adecuados.' },
      { title: 'Actividad puntual', description: 'Animación, karaoke u hora loca funcionan mejor cuando se define público, duración y momento del programa.' },
    ],
    relatedLinks: [{ label: 'DJ u orquesta: cómo elegir', href: '/guias/dj-u-orquesta-para-evento' }, { label: 'Producción audiovisual', href: '/produccion' }],
    entryIds: ['dj-eventos', 'orquesta-musica-vivo', 'animacion-eventos', 'hora-loca-shows', 'karaoke-eventos', 'fiestas-infantiles-servicios'],
    secondaryLink: { label: 'Ver producción audiovisual', href: '/produccion' },
    seo: {
      title: 'Entretenimiento para eventos en Lima | Gladys',
      description: 'Cotiza DJ, orquesta, animación, hora loca, karaoke y entretenimiento infantil para eventos en Lima Metropolitana.',
      noindex: false,
    },
  },
  produccion: {
    path: '/produccion',
    eyebrow: 'Recursos técnicos para tu evento',
    title: 'Producción audiovisual para eventos en Lima',
    description:
      'Encuentra sonido, iluminación, pantallas, proyección, escenarios, tarimas y streaming para celebraciones, conferencias y eventos de empresa.',
    audience: 'Para reuniones con discursos o presentaciones, fiestas con música y eventos híbridos que requieren soporte técnico coordinado.',
    decisionIntro: 'El espacio, la audiencia y el programa determinan la configuración. Una lista de equipos sin esos datos no permite comparar propuestas correctamente.',
    choiceTips: [
      { title: 'Audio y micrófonos', description: 'Indica quién hablará, si habrá música y cuántas personas deben escuchar con claridad.' },
      { title: 'Imagen e iluminación', description: 'El tamaño del salón, la luz ambiental y el contenido definen pantalla, proyección y luces.' },
      { title: 'Montaje y pruebas', description: 'Comparte accesos, energía, internet y horarios para reservar tiempo de instalación y verificación.' },
    ],
    relatedLinks: [{ label: 'Capacitaciones y conferencias', href: '/tipos-evento/servicios-capacitaciones-conferencias-lima' }, { label: 'Lanzamientos e inauguraciones', href: '/tipos-evento/servicios-lanzamientos-inauguraciones-lima' }],
    entryIds: ['sonido-eventos', 'iluminacion-eventos', 'pantallas-proyeccion-eventos', 'escenarios-tarimas-eventos', 'streaming-eventos'],
    secondaryLink: { label: 'Ver eventos para empresas', href: '/empresas' },
    seo: {
      title: 'Sonido, iluminación y producción para eventos en Lima | Gladys',
      description: 'Cotiza sonido, iluminación, pantallas, escenarios, tarimas y streaming para eventos en Lima Metropolitana.',
      noindex: false,
    },
  },
  decoracion: {
    path: '/decoracion',
    eyebrow: 'Ambientación y detalles visuales',
    title: 'Decoración para eventos en Lima',
    description:
      'Combina decoración, flores, candy bar y mesas de postres según el tipo de celebración, el espacio y el estilo que buscas.',
    audience: 'Para celebraciones familiares, bodas íntimas, cumpleaños y eventos de marca que necesitan ambientar uno o varios puntos del espacio.',
    decisionIntro: 'Una referencia visual ayuda, pero también hacen falta medidas, fotos del lugar y una prioridad: recepción, mesa principal, fondo de fotos o ambientación completa.',
    choiceTips: [
      { title: 'Elige el punto principal', description: 'Concentrar el presupuesto en una zona visible suele funcionar mejor que repartir elementos sin jerarquía.' },
      { title: 'Coordina colores y materiales', description: 'Comparte referencias y elementos que ya tienes para evitar mezclas o compras duplicadas.' },
      { title: 'Revisa montaje y retiro', description: 'El acceso, la superficie y el horario del local condicionan estructuras, flores y mesas de postres.' },
    ],
    relatedLinks: [{ label: 'Personalizados', href: '/personalizados' }, { label: 'Baby shower y revelación', href: '/tipos-evento/baby-shower-revelacion-genero-lima' }],
    entryIds: ['decoracion-eventos', 'arreglos-florales', 'candy-bar-mesas-postres'],
    secondaryLink: { label: 'Ver personalizados', href: '/personalizados' },
    seo: {
      title: 'Decoración, flores y candy bar para eventos en Lima | Gladys',
      description: 'Cotiza decoración, arreglos florales, candy bar y mesas de postres para eventos en Lima Metropolitana.',
      noindex: false,
    },
  },
  fotoVideo: {
    path: '/foto-video',
    eyebrow: 'Recuerdos de tu celebración',
    title: 'Cabina y experiencia 360 para celebraciones en Lima',
    description:
      'Cotiza cabina fotográfica y experiencia 360 según el espacio, la duración y el formato de participación de tus invitados.',
    audience: 'Para familias, promociones y empresas que quieren sumar una actividad participativa para sus invitados.',
    decisionIntro: 'Una cabina es una actividad para los invitados. Revisa el área disponible, el tiempo de uso y la forma de compartir el contenido; el formato se confirma antes de reservar.',
    choiceTips: [
      { title: 'Duración', description: 'Define durante qué bloque del evento estará disponible la actividad y cuántas personas podrían participar.' },
      { title: 'Contenido', description: 'Consulta la forma de compartir los archivos, el fondo y las opciones disponibles antes de confirmar el alcance.' },
      { title: 'Cabina o 360', description: 'Revisa espacio, energía, flujo de personas, fondo y forma de compartir los archivos.' },
    ],
    relatedLinks: [{ label: 'Graduaciones y promociones', href: '/tipos-evento/catering-graduaciones-lima' }, { label: 'Eventos y celebraciones', href: '/eventos' }],
    entryIds: ['cabina-fotografica-360'],
    secondaryLink: { label: 'Ver eventos y celebraciones', href: '/eventos' },
    seo: {
      title: 'Cabina y experiencia 360 para eventos en Lima | Gladys',
      description: 'Cotiza cabina fotográfica y experiencia 360 para invitados de celebraciones y eventos en Lima Metropolitana. Formato, duración y disponibilidad a consulta.',
      noindex: false,
    },
  },
} as const satisfies Record<string, SeoHubConfig>;
