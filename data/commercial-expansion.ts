import { emptyEntry } from './defaults';
import type {
  ContentEntry,
  QuoteConfig,
  QuoteQuantityUnit,
} from '@/models/content';
import type { BusinessOwnerId } from '@/config/business-contacts';

type ExpansionSpec = {
  id: string;
  title: string;
  description: string;
  body: string;
  category: string;
  details: string[];
  imageId: string;
  ownerId?: BusinessOwnerId;
  unit?: QuoteQuantityUnit;
  addOnIds?: string[];
  faq: [string, string][];
  noindex?: boolean;
};

const quoteConfig = (unit: QuoteQuantityUnit): QuoteConfig => ({
  quantityUnit: unit,
  minimum: 1,
  maximum: 100000,
  step: 1,
  dateRequired: true,
  districtRequired: true,
  guestsRequired: unit === 'person',
  options: [],
});

const priceFor = (unit: QuoteQuantityUnit): ContentEntry['price'] => ({
  mode: 'consult',
  amount: null,
  currency: 'PEN',
  unit: unit === 'hour' ? 'event' : unit,
  minimum: null,
  conditions:
    'Cotización según fecha, distrito, cantidad y requerimientos. La configuración y disponibilidad se confirman antes de reservar.',
});

const processFor = (spec: ExpansionSpec): ContentEntry['processSteps'] => {
  const firstByCategory: Record<string, ContentEntry['processSteps'][number]> = {
    Comida: { title: 'Comparte horario y asistentes', description: 'Indica cuándo se servirá, para cuántas personas y qué formato de presentación buscas.' },
    Bar: { title: 'Define la carta y el público', description: 'Cuéntanos el horario, los invitados y si necesitas bebidas con alcohol, sin alcohol o ambas.' },
    Personal: { title: 'Comparte el programa', description: 'Indica público, agenda, momentos principales y el tono que necesita la conducción.' },
    Alquileres: { title: 'Mide y describe el lugar', description: 'Comparte cantidades, medidas, acceso, superficie y uso previsto de cada elemento.' },
    'Sonido e iluminación': { title: 'Envía el requerimiento técnico', description: 'Indica audiencia, espacio, programa, equipos del lugar y resultado esperado.' },
    Música: { title: 'Define público y repertorio', description: 'Comparte edades, estilos, momentos del programa, duración y espacio disponible.' },
    Entretenimiento: { title: 'Describe la dinámica', description: 'Indica edades, cantidad de participantes, duración y área disponible para la actividad.' },
    Decoración: { title: 'Comparte espacio y referencias', description: 'Envía fotos, medidas, paleta y las zonas que quieres ambientar.' },
    'Fotografía y video': { title: 'Marca los momentos importantes', description: 'Indica horario, lugar, duración y qué partes del evento necesitas registrar.' },
    Personalizados: { title: 'Prepara cantidad y diseño', description: 'Comparte unidades, fecha de entrega, uso y el archivo o idea que quieres personalizar.' },
  };
  const secondByCategory: Record<string, ContentEntry['processSteps'][number]> = {
    Comida: { title: 'Definimos selección y presentación', description: 'Revisamos variedades, porciones, forma de entrega y complementos necesarios.' },
    Bar: { title: 'Acordamos el alcance de la barra', description: 'Se revisan bebidas, insumos, implementos, cristalería y atención requeridos.' },
    Personal: { title: 'Buscamos el perfil adecuado', description: 'La experiencia, el estilo y la coordinación previa se ajustan al tipo de evento.' },
    Alquileres: { title: 'Revisamos modelos y cantidades', description: 'Las opciones se confirman con aliados según fecha, uso y disponibilidad.' },
    'Sonido e iluminación': { title: 'Preparamos la configuración', description: 'Un proveedor especializado revisa capacidad, conexiones, montaje y operación.' },
    Música: { title: 'Revisamos formación y técnica', description: 'Se coordinan repertorio, integrantes, bloques, sonido y necesidades de montaje.' },
    Entretenimiento: { title: 'Ajustamos actividad y duración', description: 'La propuesta considera público, ritmo del evento, personal y recursos necesarios.' },
    Decoración: { title: 'Delimitamos el montaje', description: 'Se acuerdan materiales, tamaños, puntos principales y elementos sujetos a disponibilidad.' },
    'Fotografía y video': { title: 'Definimos cobertura y entrega', description: 'Se revisan equipo, edición, formatos y alcance antes de reservar.' },
    Personalizados: { title: 'Revisamos material y muestra', description: 'Se acuerdan técnica, colores, medidas y aprobación previa a la producción.' },
  };
  const first = firstByCategory[spec.category];
  const second = secondByCategory[spec.category];
  const serviceName = spec.title.toLocaleLowerCase('es');
  const mainOption = spec.details[0].replace(/\.$/, '').toLocaleLowerCase('es');
  return [
    first,
    {
      ...second,
      description: `Para ${serviceName}, revisamos ${mainOption} y los demás elementos indicados en la ficha según el uso solicitado.`,
    },
    {
      title: 'Confirmamos la propuesta',
      description: `Para ${serviceName}, el precio, la disponibilidad, el traslado y las condiciones se confirman antes de reservar.`,
    },
  ];
};

function partnerEntry(spec: ExpansionSpec, sortOrder: number): ContentEntry {
  const unit = spec.unit || 'event';
  return {
    ...emptyEntry(),
    id: spec.id,
    kind: 'servicios',
    slug: spec.id,
    title: spec.title,
    description: spec.description,
    body: spec.body,
    imageId: spec.imageId,
    status: 'published',
    availability: 'partner',
    provider: 'partner',
    requestable: true,
    ownerId: spec.ownerId || 'eventos',
    quoteConfig: quoteConfig(unit),
    price: priceFor(unit),
    category: spec.category,
    sortOrder,
    featured: false,
    details: spec.details,
    coverageIds: ['lima-metropolitana'],
    addOnIds: spec.addOnIds || [],
    faqItems: spec.faq.map(([question, answer], index) => ({
      id: `${spec.id}-faq-${index + 1}`,
      question,
      answer: answer === partnerAvailability
        ? `Para ${spec.title.toLocaleLowerCase('es')}, las opciones se confirman según la fecha, la cantidad, el lugar y el alcance solicitado.`
        : answer,
    })),
    processSteps: processFor(spec),
    seo: {
      title: `${spec.title} en Lima | Gladys`,
      description: `${spec.description} Cotiza según fecha y requerimientos en Lima Metropolitana.`,
      noindex: spec.noindex ?? false,
    },
  };
}

const partnerAvailability =
  'La disponibilidad y configuración se confirman durante la cotización según la fecha, la cantidad de invitados y las características del evento.';

const specs: ExpansionSpec[] = [
  {
    id: 'bocaditos-piqueos-eventos',
    title: 'Bocaditos y piqueos para eventos',
    description: 'Bocaditos dulces o salados, canapés, sanguchitos y piqueos para reuniones, celebraciones y empresas.',
    body: 'Solicita una propuesta de bocaditos para una recepción, cumpleaños, capacitación o reunión de trabajo. La selección y la presentación se ajustan al horario, la cantidad de personas y el formato del evento.',
    category: 'Comida',
    details: ['Bocaditos dulces y salados según propuesta', 'Canapés, sanguchitos y piqueos según disponibilidad', 'Presentación para compartir o porciones coordinadas', 'Mesa de bocaditos cuando el espacio y el formato lo permitan'],
    imageId: 'imagen-buffet-demo',
    ownerId: 'cocina',
    unit: 'person',
    addOnIds: ['mozos-evento', 'menaje-evento', 'bebidas-barra-eventos'],
    faq: [
      ['¿Puedo pedir bocaditos para una capacitación?', 'Sí. Indica el horario, los asistentes y si habrá una pausa definida para preparar una propuesta adecuada.'],
      ['¿Qué variedades están disponibles?', partnerAvailability],
      ['¿Puedo añadir bebidas y menaje?', 'Sí. Puedes incorporarlos a la misma consulta y Gladys coordinará el alcance completo.'],
    ],
  },
  {
    id: 'brunch-box-eventos',
    title: 'Brunch, box breakfast y box lunch',
    description: 'Opciones individuales o para compartir en desayunos, reuniones, jornadas y actividades corporativas.',
    body: 'Cotiza un brunch, box breakfast o box lunch para una reunión, capacitación o celebración. Cuéntanos el horario, el tipo de entrega y las necesidades del grupo para definir la propuesta.',
    category: 'Comida',
    details: ['Brunch para reuniones y celebraciones', 'Box breakfast para entregas o jornadas tempranas', 'Box lunch para capacitaciones y actividades', 'Opciones y presentación según requerimiento'],
    imageId: 'imagen-buffet-demo',
    ownerId: 'cocina',
    unit: 'person',
    addOnIds: ['bebidas-barra-eventos', 'menaje-evento', 'mozos-evento'],
    faq: [
      ['¿Cuál es la diferencia entre brunch y box?', 'El brunch suele plantearse para compartir o servir en un horario intermedio; los box se entregan en porciones individuales. La propuesta final se confirma al cotizar.'],
      ['¿Pueden entregarse en una empresa?', 'Indica el distrito, el acceso, el horario y la cantidad para revisar la entrega y disponibilidad.'],
      ['¿Hay una cantidad mínima?', partnerAvailability],
    ],
  },
  {
    id: 'almuerzos-cenas-corporativas',
    title: 'Almuerzos y cenas corporativas',
    description: 'Alimentación para reuniones de trabajo, aniversarios, reconocimientos y encuentros de empresa.',
    body: 'Organiza un almuerzo o una cena para colaboradores, clientes o invitados. Podemos coordinar la alimentación y sumar atención, menaje, mobiliario o producción según el formato elegido.',
    category: 'Comida',
    details: ['Almuerzos para reuniones y jornadas', 'Cenas para aniversarios y celebraciones', 'Catering corporativo modular', 'Propuesta según horario, asistentes y espacio'],
    imageId: 'imagen-buffet-demo',
    ownerId: 'cocina',
    unit: 'person',
    addOnIds: ['mozos-evento', 'menaje-evento', 'sonido-eventos'],
    faq: [
      ['¿Sirve para un aniversario de empresa?', 'Sí. Indica si será un almuerzo, una cena o una celebración más amplia y qué servicios quieres combinar.'],
      ['¿Puedo pedir solo la comida?', 'Sí. También puedes añadir atención, menaje u otros servicios si los necesitas.'],
      ['¿Cómo se define el menú?', partnerAvailability],
    ],
  },
  {
    id: 'bebidas-barra-eventos',
    title: 'Barra de bebidas y cócteles',
    description: 'Barra móvil, cócteles, mocktails y bebidas sin alcohol para celebraciones y encuentros corporativos.',
    body: 'Complementa tu evento con una barra de bebidas. La carta, los insumos, la cristalería, los implementos y la modalidad de servicio se definen durante la cotización.',
    category: 'Bar',
    details: ['Cócteles y mocktails según propuesta', 'Bebidas sin alcohol', 'Barra móvil cuando el espacio lo permita', 'Cristalería, implementos e insumos según alcance'],
    imageId: 'imagen-bar-demo',
    ownerId: 'cocina',
    addOnIds: ['bar-bartender', 'menaje-evento', 'mozos-evento'],
    faq: [
      ['¿La propuesta puede incluir bartender?', 'Sí. Puedes seleccionar bartender como servicio principal o añadirlo a esta consulta.'],
      ['¿Incluye cristalería e insumos?', partnerAvailability],
      ['¿Pueden preparar bebidas sin alcohol?', 'Sí, la consulta puede considerar mocktails y otras bebidas sin alcohol según la propuesta disponible.'],
    ],
    noindex: true,
  },
  {
    id: 'maestro-ceremonias',
    title: 'Maestro de ceremonias para eventos',
    description: 'Conducción para matrimonios, quinceaños, graduaciones, inauguraciones y eventos corporativos.',
    body: 'Coordina la presentación y el orden de los momentos principales con un maestro de ceremonias. Comparte el programa, el público y el tono del evento para buscar el perfil adecuado.',
    category: 'Personal',
    details: ['Conducción de bodas y quinceaños', 'Presentación de graduaciones y ceremonias', 'Maestro de ceremonias corporativo', 'Coordinación previa del programa'],
    imageId: 'imagen-mozos',
    addOnIds: ['sonido-eventos', 'iluminacion-eventos', 'fotografia-video-eventos'],
    faq: [
      ['¿También puede conducir un evento empresarial?', 'Sí. Indica el formato, la agenda y el público para coordinar un perfil apropiado.'],
      ['¿Ayuda a preparar el programa?', 'El alcance de la coordinación previa se define durante la cotización.'],
      ['¿Incluye equipo de sonido?', 'No automáticamente. Puedes añadir sonido y micrófonos a la misma consulta.'],
    ],
  },
  {
    id: 'animacion-eventos',
    title: 'Animación para fiestas y eventos',
    description: 'Animadores para cumpleaños, quinceaños, celebraciones privadas y actividades de empresa.',
    body: 'Solicita animación según la edad del público, el tipo de celebración y el espacio disponible. La dinámica, duración y cantidad de animadores se coordinan antes de reservar.',
    category: 'Entretenimiento',
    details: ['Animación para cumpleaños y fiestas', 'Animación para quinceaños', 'Dinámicas para eventos corporativos', 'Formato según público, espacio y duración'],
    imageId: 'imagen-recuerdos',
    addOnIds: ['dj-eventos', 'sonido-eventos', 'hora-loca-shows'],
    faq: [
      ['¿La animación se adapta a niños y adultos?', 'Sí. Es importante indicar la edad del público y el tipo de actividad para buscar una opción adecuada.'],
      ['¿Puedo combinarla con DJ?', 'Sí. Añade DJ, sonido o iluminación a la misma consulta.'],
      ['¿Cuánto dura?', partnerAvailability],
    ],
  },
  {
    id: 'alquiler-mesas-eventos',
    title: 'Alquiler de mesas para eventos',
    description: 'Mesas para sentar invitados, servir un buffet, recibir asistentes o crear áreas de apoyo según la distribución.',
    body: 'Define la capacidad y circulación del evento con mesas adecuadas a cada uso. Para cotizar se revisan el número de personas, el formato de atención, las medidas del espacio y la distribución prevista.',
    category: 'Alquileres',
    details: ['Mesas redondas o rectangulares para invitados', 'Mesas altas y cocteleras para recepción', 'Mesas para buffet, registro o apoyo', 'Distribución y cantidad según aforo'],
    imageId: 'imagen-sillas',
    unit: 'unit',
    addOnIds: ['sillas-evento', 'manteleria-eventos', 'menaje-evento'],
    faq: [
      ['¿Cómo calculo las mesas que necesito?', 'Comparte el número de invitados, el tipo de servicio y las medidas del espacio para revisar capacidad y circulación.'],
      ['¿Incluye sillas o mantelería?', 'Se coordinan por separado y puedes añadirlas en la misma consulta.'],
      ['¿Realizan traslado?', partnerAvailability],
    ],
  },
  {
    id: 'alquiler-toldos-carpas',
    title: 'Alquiler de toldos y carpas para eventos',
    description: 'Cobertura temporal para patios y exteriores, dimensionada según el área, la superficie y las condiciones de montaje.',
    body: 'Cubre una zona frente al sol o una eventual lluvia y delimita el montaje exterior. Para cotizar se revisan medidas, altura disponible, tipo de superficie, puntos de fijación, acceso y horario de instalación.',
    category: 'Alquileres',
    details: ['Toldos para patios y áreas exteriores', 'Carpas para eventos sociales o corporativos', 'Medidas según superficie y zona por cubrir', 'Revisión de anclaje, acceso, instalación y retiro'],
    imageId: 'imagen-sillas',
    addOnIds: ['alquiler-mesas-eventos', 'sillas-evento', 'iluminacion-eventos'],
    faq: [
      ['¿Cómo sé qué área debo cubrir?', 'Comparte las medidas del lugar y qué irá debajo: invitados, mesas, buffet, escenario u otra zona de trabajo.'],
      ['¿Se instala en cualquier superficie?', 'La viabilidad se revisa según el lugar, el acceso y las condiciones de montaje.'],
      ['¿Incluye mesas y sillas?', 'No automáticamente. Puedes añadir mobiliario a la misma consulta.'],
    ],
  },
  {
    id: 'manteleria-eventos',
    title: 'Alquiler de mantelería para eventos',
    description: 'Manteles, caminos de mesa, servilletas, fundas y faldones según el estilo y el mobiliario.',
    body: 'Completa el montaje con mantelería coordinada con el tipo y tamaño de las mesas. Los colores, piezas, cantidades y condiciones se definen durante la cotización.',
    category: 'Alquileres',
    details: ['Manteles y caminos de mesa', 'Servilletas de tela según propuesta', 'Fundas y faldones cuando correspondan', 'Colores y medidas según disponibilidad'],
    imageId: 'imagen-menaje',
    unit: 'unit',
    addOnIds: ['alquiler-mesas-eventos', 'menaje-evento', 'arreglos-florales'],
    faq: [
      ['¿Cómo elijo las medidas?', 'Indica el tipo y tamaño de las mesas. Si también las alquilas, podemos coordinar ambas necesidades.'],
      ['¿Puedo elegir colores?', partnerAvailability],
      ['¿Incluye montaje?', 'El montaje y retiro se confirman como parte del alcance antes de reservar.'],
    ],
  },
  {
    id: 'mobiliario-eventos',
    title: 'Mobiliario para eventos',
    description: 'Salas lounge, sofás, mesas de centro, barras, atriles, podios y pedestales mediante aliados.',
    body: 'Arma áreas de recepción, descanso, presentación o exhibición con mobiliario adecuado al espacio. Envía una referencia del montaje y las cantidades aproximadas.',
    category: 'Alquileres',
    details: ['Salas lounge, sofás y mesas de centro', 'Barras móviles y pedestales', 'Atriles y podios para presentaciones', 'Configuración según espacio y disponibilidad'],
    imageId: 'imagen-sillas',
    unit: 'unit',
    addOnIds: ['alquiler-mesas-eventos', 'alquiler-toldos-carpas', 'decoracion-eventos'],
    faq: [
      ['¿Tienen mobiliario para una conferencia?', 'La propuesta puede considerar podio, atril, mesas, sillas y otros elementos según disponibilidad.'],
      ['¿Puedo enviar una referencia visual?', 'Sí. Una referencia ayuda a entender el estilo y la distribución que necesitas.'],
      ['¿Cómo se confirma el inventario?', partnerAvailability],
    ],
  },
  {
    id: 'sonido-eventos',
    title: 'Alquiler de equipos de sonido para eventos',
    description: 'Audio, parlantes, consolas y micrófonos para fiestas, ceremonias, conferencias, DJ y música en vivo.',
    body: 'Configura el sonido según el espacio, la audiencia y el uso: música, discursos, presentaciones, DJ u orquesta. La propuesta técnica se coordina con un proveedor especializado.',
    category: 'Sonido e iluminación',
    details: ['Parlantes y subwoofers según necesidad', 'Consolas y monitoreo', 'Micrófonos de mano, vincha, solapa o inalámbricos', 'Configuración para DJ, orquesta, conferencia o discursos'],
    imageId: 'imagen-mozos',
    addOnIds: ['iluminacion-eventos', 'pantallas-proyeccion-eventos', 'escenarios-tarimas-eventos'],
    faq: [
      ['¿Qué equipo necesito?', 'Depende del tamaño del lugar, la cantidad de personas y si habrá discursos, música, DJ u orquesta.'],
      ['¿Puedo pedir sonido con micrófonos?', 'Sí. Indica cuántos participantes hablarán y cómo se desarrollará la actividad.'],
      ['¿Incluye operador?', partnerAvailability],
    ],
  },
  {
    id: 'iluminacion-eventos',
    title: 'Iluminación para eventos',
    description: 'Iluminación ambiental, decorativa y para pista, con luces LED y equipos técnicos según el montaje.',
    body: 'Define la atmósfera y mejora la visibilidad del evento con una propuesta de iluminación ajustada al lugar. El equipo exacto se establece después de revisar el espacio y el programa.',
    category: 'Sonido e iluminación',
    details: ['Iluminación ambiental y decorativa', 'Luces para pista', 'Equipos LED según propuesta', 'Moving heads o PAR LED cuando correspondan'],
    imageId: 'imagen-bar-demo',
    addOnIds: ['sonido-eventos', 'dj-eventos', 'escenarios-tarimas-eventos'],
    faq: [
      ['¿Qué iluminación sirve para una fiesta?', 'Comparte el espacio, horario y estilo que buscas para definir una configuración.'],
      ['¿Puede combinarse con DJ y sonido?', 'Sí. Los tres servicios pueden coordinarse dentro de una sola consulta.'],
      ['¿Qué equipos están disponibles?', partnerAvailability],
    ],
  },
  {
    id: 'pantallas-proyeccion-eventos',
    title: 'Pantallas y proyección para eventos',
    description: 'Visualización presencial con pantallas LED, televisores, proyectores o ecran para el público dentro del evento.',
    body: 'Muestra diapositivas, videos o contenido de marca a los asistentes que están en el lugar. La solución se define por tamaño de imagen, distancia de visualización, luz ambiental, ubicación y conexiones de la fuente.',
    category: 'Sonido e iluminación',
    details: ['Pantallas LED o televisores según disponibilidad', 'Proyectores y ecran', 'Reproducción de presentaciones y videos en sala', 'Tamaño, brillo y conexiones según el espacio'],
    imageId: 'imagen-polos',
    addOnIds: ['sonido-eventos', 'streaming-eventos', 'maestro-ceremonias'],
    faq: [
      ['¿Qué opción conviene para que todos vean el contenido?', 'Depende del tamaño y la luz del salón, la distancia del público y el formato de la presentación o video.'],
      ['¿Puedo añadir sonido y micrófonos?', 'Sí. Puedes reunir audiovisuales y audio en la misma consulta.'],
      ['¿Incluye instalación?', partnerAvailability],
    ],
  },
  {
    id: 'escenarios-tarimas-eventos',
    title: 'Escenarios, tarimas y estructuras para eventos',
    description: 'Tarimas, escenarios, truss y pistas de baile configurados según el espacio y el uso.',
    body: 'Prepara un área elevada para presentaciones, ceremonias, música o baile. Para cotizar se revisan medidas, carga, acceso, superficie y requerimientos técnicos.',
    category: 'Sonido e iluminación',
    details: ['Tarimas y escenarios', 'Estructuras truss según necesidad', 'Pistas de baile', 'Medidas y montaje sujetos a revisión técnica'],
    imageId: 'imagen-sillas',
    addOnIds: ['sonido-eventos', 'iluminacion-eventos', 'orquesta-musica-vivo'],
    faq: [
      ['¿Qué medidas puede tener el escenario?', partnerAvailability],
      ['¿Se puede montar en exteriores?', 'La viabilidad depende de la superficie, el acceso, el clima y las condiciones de seguridad del lugar.'],
      ['¿Puedo añadir sonido e iluminación?', 'Sí. Reunimos los requerimientos para coordinar una propuesta técnica integrada.'],
    ],
  },
  {
    id: 'streaming-eventos',
    title: 'Streaming para eventos y conferencias',
    description: 'Transmisión en vivo para asistentes remotos en capacitaciones, conferencias, presentaciones y encuentros híbridos.',
    body: 'Lleva la señal del evento a una audiencia conectada fuera del local mediante proveedores especializados. Se revisan plataforma, conexión de subida, captura de cámaras, audio, participantes remotos y programa de emisión.',
    category: 'Sonido e iluminación',
    details: ['Emisión en vivo para conferencias y capacitaciones', 'Participación presencial y remota', 'Captura e integración de cámaras y audio', 'Prueba de conectividad y plataforma antes del evento'],
    imageId: 'imagen-polos',
    addOnIds: ['pantallas-proyeccion-eventos', 'sonido-eventos', 'fotografia-video-eventos'],
    faq: [
      ['¿Dónde verán la transmisión los asistentes remotos?', 'La plataforma se define según el acceso requerido, la audiencia y la configuración disponible.'],
      ['¿Incluye cámaras y audio?', partnerAvailability],
      ['¿Necesitan revisar la conexión del lugar?', 'Sí. La conectividad es un dato esencial antes de confirmar una transmisión.'],
    ],
  },
  {
    id: 'dj-eventos',
    title: 'DJ para eventos',
    description: 'DJ para cumpleaños, matrimonios, quinceaños y celebraciones corporativas, con sonido y luces opcionales.',
    body: 'Coordina la música de tu celebración según el público, el horario y el estilo que buscas. Puedes sumar sonido e iluminación dentro de la misma propuesta.',
    category: 'Música',
    details: ['DJ para cumpleaños y fiestas', 'DJ para matrimonios y quinceaños', 'DJ corporativo', 'Sonido e iluminación como servicios adicionales'],
    imageId: 'imagen-bar-demo',
    addOnIds: ['sonido-eventos', 'iluminacion-eventos', 'hora-loca-shows'],
    faq: [
      ['¿El DJ incluye sonido y luces?', 'No se asume automáticamente. Selecciona los servicios que necesitas para que la propuesta los considere.'],
      ['¿Puedo indicar estilos musicales?', 'Sí. Comparte el tipo de público, estilos preferidos y momentos importantes del evento.'],
      ['¿Cuántas horas incluye?', partnerAvailability],
    ],
  },
  {
    id: 'orquesta-musica-vivo',
    title: 'Orquesta y música en vivo para eventos',
    description: 'Orquesta digital, dúos, tríos, cantante, saxofonista y grupos musicales según el estilo del evento.',
    body: 'Cotiza música en vivo para bodas, quinceaños, cumpleaños, aniversarios y eventos empresariales. La formación puede variar según repertorio, espacio, presupuesto y disponibilidad.',
    category: 'Música',
    details: ['Orquesta digital de formación variable', 'Dúos, tríos y cantante solista', 'Saxofonista, mariachi o grupo musical según disponibilidad', 'Repertorios criollos, salsa, cumbia y otros estilos a coordinar'],
    imageId: 'imagen-mozos',
    addOnIds: ['sonido-eventos', 'iluminacion-eventos', 'maestro-ceremonias'],
    faq: [
      ['¿Puedo elegir entre cuatro, cinco o seis integrantes?', 'Sí. La formación se revisa según el evento, el repertorio, el espacio y la disponibilidad.'],
      ['¿Qué estilos musicales ofrecen?', partnerAvailability],
      ['¿La orquesta incluye sonido?', 'La necesidad de sonido se revisa por separado y puede añadirse a la misma consulta.'],
    ],
  },
  {
    id: 'hora-loca-shows',
    title: 'Hora loca y shows para fiestas',
    description: 'Animación, cotillón, batucada, zanqueros, personajes y shows según el tipo de celebración.',
    body: 'Añade un momento de alta energía a tu fiesta con una propuesta acorde al público y al espacio. Temática, personajes, duración y elementos se confirman al cotizar.',
    category: 'Entretenimiento',
    details: ['Hora loca y animadores', 'Cotillón y temáticas según propuesta', 'Batucada o zanqueros cuando correspondan', 'Personajes y shows coordinados con aliados'],
    imageId: 'imagen-recuerdos',
    addOnIds: ['dj-eventos', 'sonido-eventos', 'iluminacion-eventos'],
    faq: [
      ['¿Puedo elegir una temática?', 'Sí. Comparte la edad del público, el estilo y las referencias que tienes en mente.'],
      ['¿Incluye cotillón?', partnerAvailability],
      ['¿Ofrecen robots LED?', 'Puede consultarse como opción sujeta a proveedor, fecha, espacio y disponibilidad.'],
    ],
  },
  {
    id: 'karaoke-eventos',
    title: 'Karaoke para fiestas y empresas',
    description: 'Karaoke con audio y pantalla para reuniones, cumpleaños y actividades corporativas.',
    body: 'Convierte una parte del evento en una experiencia participativa. Se coordina el sistema de karaoke, las pantallas, los micrófonos y el sonido según el lugar.',
    category: 'Entretenimiento',
    details: ['Karaoke para cumpleaños y fiestas', 'Karaoke corporativo', 'Pantalla y micrófonos según configuración', 'Sonido coordinado según el espacio'],
    imageId: 'imagen-bar-demo',
    addOnIds: ['sonido-eventos', 'pantallas-proyeccion-eventos', 'animacion-eventos'],
    faq: [
      ['¿Incluye pantalla y micrófonos?', partnerAvailability],
      ['¿Sirve para una actividad de empresa?', 'Sí. Indica el número de asistentes, el espacio y la dinámica que quieres realizar.'],
      ['¿Puedo combinarlo con DJ?', 'Sí. Ambos servicios pueden formar parte de la misma consulta.'],
    ],
  },
  {
    id: 'fiestas-infantiles-servicios',
    title: 'Servicios para fiestas infantiles',
    description: 'Animación, juegos, personajes, pintacaritas, globoflexia, shows y talleres coordinados según la edad.',
    body: 'Organiza una fiesta infantil eligiendo solo las actividades que encajan con los niños, el espacio y el tiempo disponible. También puedes sumar comida, mobiliario, decoración, recuerdos y fotografía.',
    category: 'Entretenimiento',
    details: ['Animación, juegos y concursos', 'Personajes, pintacaritas y globoflexia', 'Magia, títeres, burbujas o talleres según disponibilidad', 'Mini disco, karaoke u hora loca infantil'],
    imageId: 'imagen-recuerdos',
    addOnIds: ['decoracion-eventos', 'candy-bar-mesas-postres', 'fotografia-video-eventos'],
    faq: [
      ['¿Cómo elijo las actividades?', 'Indica la edad de los niños, la cantidad, el espacio y la duración aproximada para preparar opciones.'],
      ['¿Puedo añadir decoración y comida?', 'Sí. Puedes combinar actividades, decoración, bocaditos, mesas, sillas y recuerdos.'],
      ['¿Qué personajes están disponibles?', partnerAvailability],
    ],
  },
  {
    id: 'decoracion-eventos',
    title: 'Decoración para eventos',
    description: 'Globos, paneles, backdrops, centros de mesa y ambientación para celebraciones y empresas.',
    body: 'Construye una propuesta visual a partir del tipo de evento, los colores, el espacio y una referencia de estilo. La decoración puede enfocarse en la mesa principal, recepción, escenario o áreas específicas.',
    category: 'Decoración',
    details: ['Arcos, columnas y decoración con globos', 'Paneles, backdrops y fondos personalizados', 'Mesa principal, mesa de torta y centros de mesa', 'Decoración infantil, social o corporativa'],
    imageId: 'imagen-flores',
    addOnIds: ['arreglos-florales', 'candy-bar-mesas-postres', 'papeleria-eventos'],
    faq: [
      ['¿Puedo enviar una referencia?', 'Sí. Las imágenes de referencia ayudan a definir colores, estilo y alcance sin atribuirlas como trabajos de Gladys.'],
      ['¿Decoran matrimonios civiles y baby shower?', 'Sí. La propuesta se adapta a la ocasión y al espacio disponible.'],
      ['¿Qué elementos incluye?', partnerAvailability],
    ],
  },
  {
    id: 'candy-bar-mesas-postres',
    title: 'Candy bar y mesas de postres',
    description: 'Mesas de dulces y postres para cumpleaños, baby shower, quinceaños, bodas y eventos de empresa.',
    body: 'Cotiza una mesa de postres o candy bar acorde al número de invitados y al estilo de la celebración. La selección, presentación, mobiliario y decoración se coordinan según requerimiento.',
    category: 'Decoración',
    details: ['Candy bar para celebraciones', 'Mesa de postres', 'Presentación coordinada con la temática', 'Mobiliario y decoración según propuesta'],
    imageId: 'imagen-buffet-demo',
    unit: 'person',
    addOnIds: ['decoracion-eventos', 'bocaditos-piqueos-eventos', 'recuerdos-evento'],
    faq: [
      ['¿Qué postres incluye?', partnerAvailability],
      ['¿Puede combinarse con la decoración?', 'Sí. Puedes cotizar ambos servicios y compartir la misma referencia de estilo.'],
      ['¿Cómo se calcula la cantidad?', 'Indica el número aproximado de invitados y el momento en que se servirá para preparar la propuesta.'],
    ],
  },
  {
    id: 'fotografia-video-eventos',
    title: 'Fotografía y video para eventos',
    description: 'Cobertura de cumpleaños, quinceaños, matrimonios, graduaciones y eventos corporativos.',
    body: 'Conserva los momentos principales con fotografía, video o un reel resumen. La cobertura, cantidad de profesionales, entregables y uso de drone se confirman según el programa y el lugar.',
    category: 'Fotografía y video',
    details: ['Fotografía social y corporativa', 'Video de eventos', 'Reel o resumen según propuesta', 'Drone sujeto a condiciones legales, operativas y del lugar'],
    imageId: 'imagen-recuerdos',
    addOnIds: ['cabina-fotografica-360', 'decoracion-eventos', 'maestro-ceremonias'],
    faq: [
      ['¿Qué entregables recibiré?', partnerAvailability],
      ['¿Pueden cubrir una graduación o evento corporativo?', 'Sí. Comparte el programa, horario, lugar y momentos que deben registrarse.'],
      ['¿Siempre se puede usar drone?', 'No. Depende del lugar, permisos, clima y condiciones operativas. Se confirma antes de contratar.'],
    ],
  },
  {
    id: 'cabina-fotografica-360',
    title: 'Cabina fotográfica y experiencia 360',
    description: 'Photobooth, cabina 360, espejo mágico y fotos instantáneas según disponibilidad.',
    body: 'Añade una experiencia participativa para invitados o colaboradores. El formato, espacio, duración, fondo y entrega de contenido se definen durante la cotización.',
    category: 'Fotografía y video',
    details: ['Cabina fotográfica o photobooth', 'Cabina 360 según disponibilidad', 'Espejo mágico o fotos instantáneas', 'Fondo fotográfico y video mensajes según propuesta'],
    imageId: 'imagen-recuerdos',
    addOnIds: ['fotografia-video-eventos', 'decoracion-eventos', 'papeleria-eventos'],
    faq: [
      ['¿Cuánto espacio necesita?', partnerAvailability],
      ['¿Puedo personalizar el fondo?', 'Sí, el diseño y la disponibilidad del fondo se revisan con la propuesta.'],
      ['¿Sirve para una activación de marca?', 'Sí. Indica la identidad visual, el flujo de asistentes y el objetivo de la actividad.'],
    ],
  },
  {
    id: 'tazas-personalizadas',
    title: 'Tazas personalizadas para eventos y empresas',
    description: 'Tazas con foto, nombre o logo para invitados, promociones, cumpleaños y regalos corporativos.',
    body: 'Personaliza tazas para una celebración, promoción o entrega empresarial. Los modelos, acabados, diseño, cantidad y tiempo de producción se confirman al cotizar.',
    category: 'Personalizados',
    details: ['Tazas blancas, mágicas o con asa especial según disponibilidad', 'Tazas metálicas o glitter cuando correspondan', 'Diseños con foto, nombre o logo', 'Opciones para eventos, promociones y empresas'],
    imageId: 'imagen-polos',
    unit: 'unit',
    addOnIds: ['tomatodos-personalizados', 'cuadros-fotorecuerdos', 'kits-regalos-corporativos'],
    faq: [
      ['¿Qué modelos tienen?', partnerAvailability],
      ['¿Puedo usar mi foto o logo?', 'Sí. La calidad del archivo y la viabilidad del diseño se revisan antes de producir.'],
      ['¿Cuál es el tiempo de entrega?', 'Se confirma según modelo, cantidad, diseño y fecha solicitada.'],
    ],
  },
  {
    id: 'tomatodos-personalizados',
    title: 'Tomatodos personalizados',
    description: 'Tomatodos personalizados como producto individual, con nombre, diseño o logo para equipos, promociones e invitados.',
    body: 'Elige una pieza reutilizable para entregar por unidad en una promoción, bienvenida, activación o celebración. Antes de confirmar se revisan modelo, capacidad, material, color, área de impresión, personalización individual y cantidad.',
    category: 'Personalizados',
    details: ['Tomatodos de aluminio o deportivos según disponibilidad', 'Capacidad, material y color por confirmar', 'Nombre o logo aplicado a cada unidad', 'Producción según técnica, cantidad y fecha'],
    imageId: 'imagen-polos',
    unit: 'unit',
    addOnIds: ['tazas-personalizadas', 'polos-estampados', 'kits-regalos-corporativos'],
    faq: [
      ['¿Qué materiales están disponibles?', partnerAvailability],
      ['¿Pueden llevar nombres distintos?', 'La personalización individual se revisa según el modelo, la cantidad y el método de impresión.'],
      ['¿Se pueden pedir sin armar un kit?', 'Sí. El tomatodo puede cotizarse y entregarse como producto independiente.'],
    ],
  },
  {
    id: 'cuadros-fotorecuerdos',
    title: 'Cuadros y fotorecuerdos personalizados',
    description: 'Cuadros, fotos con marco, soportes rígidos y recuerdos fotográficos para celebraciones y reconocimientos.',
    body: 'Convierte una fotografía o diseño en un recuerdo para invitados, familiares o colaboradores. El soporte, tamaño, acabado y cantidad se definen según la imagen y la fecha.',
    category: 'Personalizados',
    details: ['Cuadros personalizados y conmemorativos', 'Cuadros metálicos según disponibilidad', 'Fotos con marco o soporte rígido', 'Fotorecuerdos y fotos sublimadas'],
    imageId: 'imagen-recuerdos',
    unit: 'unit',
    addOnIds: ['tazas-personalizadas', 'llaveros-personalizados', 'kits-regalos-corporativos'],
    faq: [
      ['¿Qué tamaños y soportes ofrecen?', partnerAvailability],
      ['¿Puedo usar una foto del celular?', 'La imagen debe revisarse para confirmar si tiene calidad suficiente para el tamaño elegido.'],
      ['¿Pueden hacerse varias unidades?', 'Sí. Indica la cantidad y la fecha para revisar producción y disponibilidad.'],
    ],
  },
  {
    id: 'llaveros-personalizados',
    title: 'Llaveros personalizados',
    description: 'Llaveros con foto, nombre o identidad de marca para invitados, promociones y empresas.',
    body: 'Prepara llaveros como recuerdo o artículo promocional. El material, forma, impresión, diseño y empaque dependen de la opción disponible y la cantidad.',
    category: 'Personalizados',
    details: ['Llaveros con foto o nombre', 'Recuerdos para invitados', 'Llaveros corporativos', 'Materiales y acabados según disponibilidad'],
    imageId: 'imagen-recuerdos',
    unit: 'unit',
    addOnIds: ['cuadros-fotorecuerdos', 'papeleria-eventos', 'kits-regalos-corporativos'],
    faq: [
      ['¿Qué materiales tienen?', partnerAvailability],
      ['¿Puedo incluir el logo de mi empresa?', 'Sí. Comparte el archivo para revisar la reproducción y el área disponible.'],
      ['¿Incluye empaque?', 'El empaque se define como parte de la propuesta y no se asume automáticamente.'],
    ],
  },
  {
    id: 'papeleria-eventos',
    title: 'Papelería personalizada para eventos',
    description: 'Invitaciones, stickers, etiquetas, tags, credenciales, carteles y números de mesa.',
    body: 'Unifica la información y la identidad visual con piezas impresas o digitales según la ocasión. Comparte textos, cantidades, medidas y fecha de uso para preparar la propuesta.',
    category: 'Personalizados',
    details: ['Invitaciones y menús', 'Stickers, etiquetas y tags', 'Credenciales y carteles', 'Números de mesa y señalética'],
    imageId: 'imagen-polos',
    unit: 'unit',
    addOnIds: ['decoracion-eventos', 'kits-regalos-corporativos', 'polos-estampados'],
    faq: [
      ['¿Pueden diseñar las piezas?', 'El alcance de diseño y producción se confirma según las piezas y los archivos disponibles.'],
      ['¿También hacen invitaciones digitales?', 'Puede consultarse como parte del requerimiento y está sujeto a la propuesta disponible.'],
      ['¿Cuánto demora?', 'El plazo depende del diseño, aprobación, cantidad y tipo de producción.'],
    ],
  },
  {
    id: 'kits-regalos-corporativos',
    title: 'Kits y regalos corporativos personalizados',
    description: 'Packs de varios productos para bienvenida, reconocimiento, campañas y regalos institucionales.',
    body: 'Arma una entrega compuesta para colaboradores, clientes o invitados. El objetivo, presupuesto por persona, cantidad, presentación y fecha orientan la selección de productos, la personalización conjunta y el empaque.',
    category: 'Personalizados',
    details: ['Kits de bienvenida o incorporación', 'Packs para reconocimiento, campañas o promociones', 'Selección de varios productos bajo una misma identidad', 'Empaque y composición según presupuesto y disponibilidad'],
    imageId: 'imagen-recuerdos',
    unit: 'unit',
    addOnIds: ['tazas-personalizadas', 'tomatodos-personalizados', 'polos-estampados'],
    faq: [
      ['¿Qué puede incluir un kit?', 'Puede reunir productos disponibles como tazas, tomatodos, polos, papelería o recuerdos. La combinación y el empaque se definen como una sola propuesta.'],
      ['¿Puedo indicar un presupuesto por persona?', 'Sí. Sirve como referencia para proponer una combinación sin prometer un precio antes de revisar cantidades y productos.'],
      ['¿Pueden llevar identidad de marca?', 'Sí. Comparte el logo y lineamientos para revisar la personalización posible.'],
    ],
  },
];

export const commercialExpansionEntries = specs.map((spec, index) =>
  partnerEntry(spec, 100 + index),
);
