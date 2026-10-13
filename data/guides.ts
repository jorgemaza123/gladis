import type { SEOFields } from '@/models/content';

export type GuideSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  category: string;
  title: string;
  description: string;
  seo: SEOFields;
  sections: GuideSection[];
  relatedLinks: { label: string; href: string }[];
};

const practicalGuide = (
  slug: string,
  category: string,
  title: string,
  description: string,
  sections: GuideSection[],
  relatedLinks: Guide['relatedLinks'],
): Guide => ({
  slug,
  category,
  title,
  description,
  seo: {
    title: `${title} | Gladys`,
    description,
    noindex: false,
  },
  sections,
  relatedLinks,
});

const additionalGuides: Guide[] = [
  practicalGuide(
    'como-organizar-cumpleanos-en-lima', 'Celebraciones',
    'Cómo organizar un cumpleaños en Lima',
    'Ordena la fecha, los invitados, el espacio, la comida y los servicios necesarios para celebrar un cumpleaños.',
    [
      { title: 'Define el formato', paragraphs: ['Aclara si será un almuerzo, una cena, una fiesta o una reunión en casa. El formato determina horarios y servicios.'] },
      { title: 'Calcula espacio e invitados', paragraphs: ['Usa una cantidad aproximada para evaluar comida, mesas, sillas y atención.'], bullets: ['Distrito y acceso', 'Adultos y niños', 'Interior o exterior', 'Horario previsto'] },
      { title: 'Elige por módulos', paragraphs: ['Empieza por el servicio principal y añade únicamente bar, personal, alquileres, música, decoración o fotografía que hagan falta.'] },
    ],
    [{ label: 'Ver opciones para cumpleaños', href: '/tipos-evento/catering-cumpleanos-lima' }, { label: 'Armar mi evento', href: '/cotizar' }],
  ),
  practicalGuide(
    'como-organizar-cumpleanos-infantil', 'Celebraciones',
    'Cómo organizar un cumpleaños infantil',
    'Planifica un cumpleaños infantil según edades, invitados, espacio, comida, animación y seguridad.',
    [
      { title: 'Empieza por las edades', paragraphs: ['Las edades ayudan a definir duración, actividades, comida y nivel de supervisión.'] },
      { title: 'Revisa el lugar', paragraphs: ['Mide el área útil y considera sombra, baños, tomacorrientes y acceso para montaje.'], bullets: ['Cantidad de niños y adultos', 'Espacio para juegos', 'Plan para lluvia o sol', 'Horario de ingreso'] },
      { title: 'Coordina cada servicio', paragraphs: ['Confirma por separado animación, comida, mobiliario, decoración, recuerdos y fotografía.'] },
    ],
    [{ label: 'Servicios para cumpleaños infantiles', href: '/tipos-evento/servicios-cumpleanos-infantiles-lima' }, { label: 'Entretenimiento', href: '/entretenimiento' }],
  ),
  practicalGuide(
    'como-organizar-quinceanos', 'Celebraciones',
    'Cómo organizar un quinceaños',
    'Una guía para ordenar ceremonia, recepción, comida, música, producción y recuerdos de un quinceaños.',
    [
      { title: 'Arma el programa', paragraphs: ['Define recepción, ingreso, brindis, comida, baile y momentos especiales antes de elegir proveedores.'] },
      { title: 'Separa lo esencial de lo opcional', paragraphs: ['Prioriza espacio, comida y atención; después distribuye el presupuesto entre música, producción, decoración y recuerdos.'] },
      { title: 'Confirma la parte técnica', paragraphs: ['Comparte horarios, medidas y restricciones del local para revisar sonido, luces, escenario y montaje.'] },
    ],
    [{ label: 'Servicios para quinceaños', href: '/tipos-evento/servicios-quinceanos-lima' }, { label: 'Producción audiovisual', href: '/produccion' }],
  ),
  practicalGuide(
    'como-organizar-baby-shower', 'Celebraciones',
    'Cómo organizar un baby shower o revelación',
    'Define invitados, lugar, comida, mobiliario y decoración para un baby shower o revelación de género.',
    [
      { title: 'Escoge un formato cómodo', paragraphs: ['Un desayuno, brunch o reunión por la tarde permite ajustar la duración y el tipo de comida.'] },
      { title: 'Diseña a partir del espacio', paragraphs: ['Antes de elegir decoración, confirma mesas, sillas, circulación y zona para fotografías.'] },
      { title: 'Prepara una sola lista', paragraphs: ['Reúne comida, mobiliario, flores, recuerdos y fotografía para evitar pedidos duplicados.'] },
    ],
    [{ label: 'Servicios para baby shower', href: '/tipos-evento/baby-shower-revelacion-genero-lima' }, { label: 'Decoración para eventos', href: '/decoracion' }],
  ),
  practicalGuide(
    'como-organizar-matrimonio-civil', 'Celebraciones',
    'Cómo organizar un matrimonio civil íntimo',
    'Ordena ceremonia, recepción, comida, montaje y fotografías para un matrimonio civil o boda íntima.',
    [
      { title: 'Define ceremonia y recepción', paragraphs: ['Aclara si ocurrirán en el mismo lugar y cuánto tiempo habrá para transformar el espacio.'] },
      { title: 'Ajusta el servicio a los invitados', paragraphs: ['El número de personas y el estilo de comida orientan el menaje, mobiliario y personal.'] },
      { title: 'Cuida los tiempos de montaje', paragraphs: ['Coordina accesos, proveedores, fotografías y desmontaje con el lugar antes de reservar.'] },
    ],
    [{ label: 'Servicios para matrimonio civil', href: '/tipos-evento/servicios-matrimonio-civil-lima' }, { label: 'Alquileres para eventos', href: '/alquiler' }],
  ),
  practicalGuide(
    'como-organizar-graduacion', 'Celebraciones',
    'Cómo organizar una graduación o fiesta de promoción',
    'Planifica una graduación escolar o universitaria con comida, atención, alquileres y recuerdos.',
    [
      { title: 'Alinea al grupo', paragraphs: ['Define responsables, presupuesto aproximado y tipo de celebración antes de pedir propuestas.'] },
      { title: 'Calcula asistentes y servicio', paragraphs: ['Distingue alumnos, familiares y docentes para estimar comida, mesas, sillas y atención.'] },
      { title: 'Reserva con datos claros', paragraphs: ['Comparte fecha, distrito, horario y servicios elegidos para revisar disponibilidad real.'] },
    ],
    [{ label: 'Catering para graduaciones', href: '/tipos-evento/catering-graduaciones-lima' }, { label: 'Personalizados', href: '/personalizados' }],
  ),
  practicalGuide(
    'como-organizar-evento-en-casa', 'Celebraciones',
    'Cómo organizar una fiesta o evento en casa',
    'Revisa capacidad, accesos, mobiliario, comida, música y horarios antes de organizar un evento en casa.',
    [
      { title: 'Comprueba la capacidad real', paragraphs: ['Cuenta el área disponible después de ubicar mesas, circulación, comida y equipos.'] },
      { title: 'Revisa accesos y vecinos', paragraphs: ['Considera ingreso de proveedores, estacionamiento, volumen de música y hora de cierre.'] },
      { title: 'Prepara un plan alternativo', paragraphs: ['Para exteriores, define sombra o cobertura y una opción ante lluvia o viento.'] },
    ],
    [{ label: 'Fiestas en casa', href: '/tipos-evento/fiestas-casa-celebraciones-privadas-lima' }, { label: 'Alquiler de toldos y carpas', href: '/servicios/alquiler-toldos-carpas' }],
  ),
  practicalGuide(
    'como-organizar-evento-corporativo', 'Empresas',
    'Cómo organizar un evento corporativo',
    'Define objetivo, agenda, asistentes, espacio, alimentación y producción para un evento de empresa.',
    [
      { title: 'Empieza por el objetivo', paragraphs: ['Una capacitación, lanzamiento o celebración requiere agenda, tono y recursos distintos.'] },
      { title: 'Construye la operación', paragraphs: ['Comparte horarios de ingreso, pruebas, atención y desmontaje.'], bullets: ['Asistentes', 'Agenda', 'Lugar y accesos', 'Equipos técnicos', 'Alimentación'] },
      { title: 'Centraliza la consulta', paragraphs: ['Selecciona servicios y envía un solo resumen para coordinar internamente sin repetir información.'] },
    ],
    [{ label: 'Servicios para empresas', href: '/empresas' }, { label: 'Armar una consulta', href: '/cotizar' }],
  ),
  practicalGuide(
    'cuanta-comida-calcular-evento', 'Catering',
    'Cómo calcular comida para un evento',
    'Estima comida para un evento considerando horario, duración, invitados, menú y forma de servicio.',
    [
      { title: 'Cuenta a quiénes atenderás', paragraphs: ['Parte de una cantidad aproximada y distingue adultos, niños y necesidades alimentarias.'] },
      { title: 'Relaciona cantidad y horario', paragraphs: ['Un desayuno, un cóctel y un almuerzo completo no requieren la misma cantidad ni variedad.'] },
      { title: 'Evita calcular sin el menú', paragraphs: ['Comparte formato y duración para que las porciones se revisen durante la cotización.'] },
    ],
    [{ label: 'Buffet para eventos', href: '/servicios/buffet-para-eventos' }, { label: 'Menú criollo', href: '/menus/menu-criollo-eventos' }],
  ),
  practicalGuide(
    'que-incluye-buffet-eventos', 'Catering',
    'Qué puede incluir un buffet para eventos',
    'Revisa comida, presentación, atención, menaje y logística antes de comparar propuestas de buffet.',
    [
      { title: 'Separa menú y servicio', paragraphs: ['Pregunta qué platos se incluyen y si la propuesta contempla montaje, atención o retiro.'] },
      { title: 'Confirma los complementos', paragraphs: ['Mozos, menaje, mesas, bebidas y decoración pueden cotizarse aparte.'] },
      { title: 'Compara el alcance completo', paragraphs: ['Revisa cantidades, horarios, transporte, montaje y condiciones, además del precio.'] },
    ],
    [{ label: 'Ver buffet para eventos', href: '/servicios/buffet-para-eventos' }, { label: 'Datos para cotizar', href: '/guias/datos-para-cotizar-un-evento' }],
  ),
  practicalGuide(
    'buffet-o-servicio-en-mesa', 'Catering',
    'Buffet o servicio en mesa: cómo elegir',
    'Compara buffet y servicio en mesa según espacio, horario, invitados y ritmo del evento.',
    [
      { title: 'Piensa en la experiencia', paragraphs: ['El buffet facilita variedad y circulación; el servicio en mesa ordena tiempos y atención.'] },
      { title: 'Mide el espacio y el personal', paragraphs: ['Considera zonas de servicio, circulación, mesas, menaje y número de mozos.'] },
      { title: 'Decide con el programa', paragraphs: ['La ceremonia, discursos y baile pueden favorecer un formato sobre el otro.'] },
    ],
    [{ label: 'Cotizar comida para eventos', href: '/servicios/buffet-para-eventos' }, { label: 'Cotizar mozos', href: '/servicios/mozos-evento' }],
  ),
  practicalGuide(
    'como-calcular-mesas-sillas-evento', 'Alquileres',
    'Cómo calcular mesas y sillas para un evento',
    'Estima mesas y sillas según invitados, formato, circulación y dimensiones del espacio.',
    [
      { title: 'Parte del plano', paragraphs: ['Mide el área útil y reserva circulación, zonas de servicio, baile y salidas.'] },
      { title: 'Elige el tipo de mesa', paragraphs: ['Las mesas redondas, rectangulares y altas cambian la capacidad y la distribución.'] },
      { title: 'Añade un margen razonable', paragraphs: ['Confirma invitados y condiciones de entrega antes de cerrar cantidades.'] },
    ],
    [{ label: 'Alquiler de mesas', href: '/servicios/alquiler-mesas-eventos' }, { label: 'Alquiler de sillas', href: '/servicios/sillas-evento' }],
  ),
  practicalGuide(
    'como-elegir-toldo-carpa-evento', 'Alquileres',
    'Cómo elegir toldo o carpa para un evento',
    'Evalúa medidas, clima, superficie, accesos y montaje antes de alquilar un toldo o una carpa.',
    [
      { title: 'Mide la zona de instalación', paragraphs: ['Comparte ancho, largo, altura disponible y obstáculos del espacio.'] },
      { title: 'Considera clima y superficie', paragraphs: ['El sistema de fijación depende del suelo, el viento y la protección necesaria.'] },
      { title: 'Reserva tiempo para montaje', paragraphs: ['Coordina ingreso, instalación, inspección y retiro con el local.'] },
    ],
    [{ label: 'Alquiler de toldos y carpas', href: '/servicios/alquiler-toldos-carpas' }, { label: 'Ver alquileres', href: '/alquiler' }],
  ),
  practicalGuide(
    'dj-u-orquesta-para-evento', 'Entretenimiento',
    'DJ u orquesta: qué conviene para tu evento',
    'Compara repertorio, espacio, producción, pausas y presupuesto para elegir música en vivo o DJ.',
    [
      { title: 'Define el ambiente', paragraphs: ['Piensa en edades, estilos musicales y momentos clave de la celebración.'] },
      { title: 'Revisa el espacio técnico', paragraphs: ['Una orquesta requiere más área y montaje; un DJ también necesita sonido y energía adecuados.'] },
      { title: 'Pregunta por tiempos y equipos', paragraphs: ['Confirma duración, pausas, repertorio, sonido e iluminación antes de contratar.'] },
    ],
    [{ label: 'DJ para eventos', href: '/servicios/dj-eventos' }, { label: 'Orquesta y música en vivo', href: '/servicios/orquesta-musica-vivo' }],
  ),
  practicalGuide(
    'que-hace-maestro-ceremonias', 'Entretenimiento',
    'Qué hace un maestro de ceremonias',
    'Conoce cómo un maestro de ceremonias ordena el programa, presenta momentos y coordina al público.',
    [
      { title: 'Conduce el programa', paragraphs: ['Presenta ingresos, discursos, reconocimientos y transiciones según una pauta acordada.'] },
      { title: 'Coordina con el equipo', paragraphs: ['Trabaja con sonido, música, catering y responsables para sostener los tiempos.'] },
      { title: 'Prepara información antes', paragraphs: ['Comparte nombres, cargos, pronunciación y momentos sensibles con anticipación.'] },
    ],
    [{ label: 'Maestro de ceremonias', href: '/servicios/maestro-ceremonias' }, { label: 'Ver entretenimiento', href: '/entretenimiento' }],
  ),
  practicalGuide(
    'checklist-lanzamiento-inauguracion', 'Empresas',
    'Checklist para un lanzamiento o inauguración',
    'Ordena objetivo, agenda, invitados, producción, catering y materiales de marca para un lanzamiento o inauguración.',
    [
      { title: 'Define qué debe ocurrir', paragraphs: ['Aclara el mensaje, el público y la acción esperada para construir una agenda concreta.'] },
      { title: 'Prepara la operación', paragraphs: ['Confirma accesos, pruebas, registro, catering, sonido, pantallas y fotografía.'], bullets: ['Horario de montaje', 'Guion y responsables', 'Identidad visual', 'Plan técnico', 'Atención de invitados'] },
      { title: 'Centraliza proveedores y cambios', paragraphs: ['Comparte una versión única del programa y confirma por escrito el alcance de cada servicio.'] },
    ],
    [{ label: 'Servicios para lanzamientos', href: '/tipos-evento/servicios-lanzamientos-inauguraciones-lima' }, { label: 'Producción audiovisual', href: '/produccion' }],
  ),
];

const guideDeepening: Record<string, GuideSection> = {
  'como-organizar-cumpleanos-en-lima': {
    title: 'Cierra el plan antes de reservar',
    paragraphs: [
      'Haz una lista corta con lo que ya aporta el lugar y lo que todavía falta. Si la casa o el local tiene mesas, cocina o equipo de sonido, indícalo para no cotizar recursos duplicados.',
      'Ordena el día desde la llegada de proveedores hasta el retiro. Considera tiempo de montaje, conservación de la comida, atención durante la reunión y una persona de contacto que pueda resolver accesos mientras tú recibes a los invitados.',
    ],
    bullets: ['Hora real de llegada de invitados', 'Espacio para servir y retirar', 'Restricciones del local o edificio', 'Plan alternativo si el evento es exterior'],
  },
  'como-organizar-cumpleanos-infantil': {
    title: 'Cuida el ritmo y la seguridad',
    paragraphs: [
      'Programa actividades cortas y alterna movimiento con momentos tranquilos para comer o abrir regalos. Una agenda demasiado llena suele dejar poco tiempo para que los niños disfruten cada parte.',
      'Separa cables, equipos calientes y zonas de tránsito de los juegos. Confirma quién supervisará a los niños, dónde estarán los adultos y qué alimentos requieren atención por alergias o edades.',
    ],
    bullets: ['Contacto de un adulto responsable', 'Edades y necesidades alimentarias', 'Zona libre para juegos', 'Horario de torta, comida y animación'],
  },
  'como-organizar-quinceanos': {
    title: 'Conecta el programa con los proveedores',
    paragraphs: [
      'Entrega una misma versión del programa al maestro de ceremonias, DJ, fotografía, catering y responsables de la familia. Marca la hora de ingreso, palabras, brindis, baile y cierre para que nadie trabaje con tiempos distintos.',
      'Confirma qué equipos aporta el local y cuáles deben llegar con los proveedores. Sonido, luces, energía, tarima y espacio para músicos requieren revisión previa; no conviene resolverlos al llegar.',
    ],
    bullets: ['Ensayo de ingresos y momentos especiales', 'Lista de nombres y canciones', 'Prueba técnica', 'Responsable de cambios durante la fiesta'],
  },
  'como-organizar-baby-shower': {
    title: 'Organiza una reunión cómoda',
    paragraphs: [
      'Piensa en la comodidad de la persona homenajeada y de invitados de distintas edades. Evita una distribución que obligue a permanecer de pie o que bloquee el acceso a comida, baños y fotografías.',
      'Si habrá revelación, explica con anticipación qué dinámica imaginas y qué puede hacerse en el lugar. Cualquier elemento especial debe revisarse por espacio, limpieza y seguridad antes de confirmarlo.',
      'Deja esa coordinación a una persona identificada.',
    ],
    bullets: ['Asientos suficientes', 'Duración prevista', 'Zona para regalos', 'Alternativa segura para la revelación'],
  },
  'como-organizar-matrimonio-civil': {
    title: 'Ordena una ceremonia íntima',
    paragraphs: [
      'Define dónde esperarán los invitados, por dónde ingresará la pareja y qué ocurrirá inmediatamente después de la ceremonia. Ese recorrido determina sillas, sonido, flores y el cambio hacia el almuerzo o recepción.',
      'Prepara una lista breve de momentos que deben registrarse y de personas que participarán. Coordinarla con fotografía y maestro de ceremonias evita interrumpir la reunión para decidir sobre la marcha.',
      'Comparte la versión final con todos.',
    ],
    bullets: ['Hora de la ceremonia y recepción', 'Distribución de asientos', 'Palabras o brindis', 'Tiempo disponible para fotografías'],
  },
  'como-organizar-graduacion': {
    title: 'Evita decisiones dispersas en el grupo',
    paragraphs: [
      'Nombra a pocas personas para aprobar presupuesto, menú y cambios. Cuando cada familia conversa por separado con proveedores, aparecen versiones distintas sobre cantidades, horarios y servicios incluidos.',
      'Registra alumnos, familiares, docentes y proveedores por separado. Esa división ayuda a calcular asientos y comida, y permite decidir si habrá recuerdos para todos o únicamente para la promoción.',
      'Antes de pagar una reserva, circula un resumen con fecha, lugar, asistentes considerados, servicios incluidos y condiciones para cambios. El grupo debe aprobar la misma versión.',
    ],
    bullets: ['Lista consolidada de asistentes', 'Responsables autorizados', 'Fecha límite para cambios', 'Programa de ceremonia y celebración'],
  },
  'como-organizar-evento-en-casa': {
    title: 'Adapta la operación a una vivienda',
    paragraphs: [
      'Revisa puertas, escaleras, ascensor, estacionamiento y lugar de descarga. Una mesa, una barra o un equipo técnico puede no pasar por el acceso aunque el patio tenga espacio suficiente.',
      'Protege las áreas privadas y define dónde se guardarán embalajes, utensilios y residuos. También conviene acordar quién recibirá a cada proveedor y hasta qué hora se permite música o desmontaje.',
    ],
    bullets: ['Medidas del acceso', 'Puntos de energía y agua', 'Zona de trabajo para comida o bar', 'Reglas del edificio y vecinos'],
  },
  'como-organizar-evento-corporativo': {
    title: 'Prepara un brief que todos entiendan',
    paragraphs: [
      'Resume en una página el objetivo, audiencia, agenda, lugar y resultado esperado. Añade lo que aporta la sede y quién aprobará cambios. Ese documento permite comparar propuestas con el mismo alcance.',
      'Separa necesidades de operación, contenido y atención. El equipo técnico debe conocer presentaciones y pruebas; catering necesita horarios y asistentes; los responsables internos deben manejar accesos, registro y comunicación.',
      'Cierra cada bloque con un responsable y un canal de contacto. Durante el montaje, las decisiones deben llegar de una sola persona para no generar instrucciones incompatibles.',
    ],
    bullets: ['Objetivo y público', 'Agenda con responsables', 'Inventario del lugar', 'Horario de montaje, pruebas y desmontaje'],
  },
  'cuanta-comida-calcular-evento': {
    title: 'Datos que cambian la estimación',
    paragraphs: [
      'No uses una cantidad general por persona sin considerar el menú. El número de tiempos, la duración, si habrá niños y la presencia de bebidas o postres cambian la propuesta y la forma de servir.',
      'Informa si otras actividades coinciden con la comida. Una recepción breve, una jornada completa y una fiesta con baile tienen consumos distintos. La estimación final debe revisarse con quien preparará el menú.',
    ],
    bullets: ['Adultos y niños', 'Horario y duración', 'Entrada, fondo, postre y bebidas', 'Restricciones o preferencias alimentarias'],
  },
  'que-incluye-buffet-eventos': {
    title: 'Preguntas para comparar propuestas',
    paragraphs: [
      'Pide que cada propuesta distinga comida, transporte, montaje, equipos y personal. La palabra buffet puede referirse solo a los platos o a un servicio más amplio, por lo que el precio aislado no permite comparar.',
      'Confirma qué ocurrirá con vajilla, bandejas, residuos y retiro al terminar. También revisa la hora hasta la que permanece el personal y qué cambios pueden hacerse después de confirmar cantidades.',
      'Pide que las condiciones queden escritas antes de reservar. Fechas de pago, límite de cambios y responsabilidades del lugar son parte del alcance, aunque no aparezcan en el menú.',
    ],
    bullets: ['Porciones y menú', 'Presentación y equipos', 'Número y horario del personal', 'Traslado, montaje y retiro'],
  },
  'buffet-o-servicio-en-mesa': {
    title: 'Toma la decisión con el espacio real',
    paragraphs: [
      'Dibuja dónde estarán invitados, circulación y punto de servicio. Un buffet necesita acceso cómodo y reposición; el servicio en mesa requiere pasillos y personal suficiente para atender con un ritmo parejo.',
      'Si el programa incluye discursos o una ceremonia, evita que el movimiento de comida ocurra al mismo tiempo. Comparte el horario completo para decidir qué formato interrumpe menos los momentos principales.',
    ],
    bullets: ['Área disponible para servicio', 'Cantidad de mesas e invitados', 'Tiempo destinado a comer', 'Personal y menaje necesarios'],
  },
  'como-calcular-mesas-sillas-evento': {
    title: 'Comprueba la distribución antes de alquilar',
    paragraphs: [
      'Una lista de invitados no basta para definir mobiliario. Marca entradas, baños, buffet, barra, pista, escenario y salidas; después ubica mesas dejando recorridos que puedan usar invitados y personal.',
      'Consulta las medidas exactas de cada modelo. La capacidad anunciada de una mesa puede resultar incómoda con platos grandes, centros de mesa o sillas anchas, así que la distribución debe revisarse completa.',
      'No agregues un margen de sillas sin explicar para qué sirve. Reserva unidades adicionales solo cuando haya confirmaciones pendientes, rotación de público o una necesidad operativa concreta.',
    ],
    bullets: ['Plano con medidas', 'Tipo y tamaño de mesas', 'Sillas adicionales justificadas', 'Horario de entrega y retiro'],
  },
  'como-elegir-toldo-carpa-evento': {
    title: 'No elijas solo por cantidad de invitados',
    paragraphs: [
      'Bajo la cubierta también pueden ir buffet, pista, escenario o circulación. Indica todo lo que ocupará el área y la altura necesaria para decoración o equipos antes de decidir medidas.',
      'Pregunta cómo se fija la estructura y qué condiciones impedirían el montaje. El proveedor debe revisar superficie, viento, desniveles, acceso y distancia a cables o construcciones.',
      'Comprueba además cómo se evacuaría el agua y dónde quedarán entradas y salidas. Una cubierta útil debe proteger sin encerrar la circulación ni bloquear rutas del lugar.',
    ],
    bullets: ['Medidas y altura libres', 'Tipo de suelo', 'Elementos bajo la cubierta', 'Plan ante clima adverso'],
  },
  'dj-u-orquesta-para-evento': {
    title: 'Compara el alcance completo',
    paragraphs: [
      'Para un DJ, revisa horas, repertorio, sonido, luces y forma de recibir pedidos. Para música en vivo, añade formación, número de bloques, pausas, espacio y requerimientos técnicos.',
      'También puedes combinar ambos formatos si el programa lo justifica. En ese caso define quién cubre cada momento y si compartirán consola, micrófonos o iluminación para evitar equipos duplicados.',
      'Solicita una pauta de inicio, pausas y cierre. La cantidad de horas anunciada no siempre equivale al mismo tiempo efectivo de música, especialmente cuando existe montaje o intervalos.',
    ],
    bullets: ['Duración efectiva', 'Repertorio y momentos clave', 'Sonido e iluminación incluidos', 'Espacio y energía disponibles'],
  },
  'que-hace-maestro-ceremonias': {
    title: 'Qué conviene preparar con anticipación',
    paragraphs: [
      'El maestro de ceremonias necesita una pauta, nombres correctos, cargos, pronunciaciones y señales para coordinar con música o video. No debería enterarse de los momentos principales durante el evento.',
      'Aclara si debe conducir todo el programa o únicamente una ceremonia. También confirma ensayos, reuniones previas, vestimenta, tono y quién puede autorizar cambios mientras el evento está en marcha.',
      'En actividades de empresa, comparte nombres de marca, mensajes aprobados y términos que deben evitarse. En celebraciones familiares, señala momentos sensibles que requieren un tono más reservado.',
    ],
    bullets: ['Guion y tiempos', 'Lista de participantes', 'Señales con sonido y producción', 'Contacto responsable durante el evento'],
  },
  'checklist-lanzamiento-inauguracion': {
    title: 'Haz una verificación final',
    paragraphs: [
      'Recorre el programa como si fueras un invitado: registro, espera, presentación, demostración, comida y salida. Ese ejercicio muestra filas, silencios, zonas sin señalización y momentos donde falta personal.',
      'Realiza pruebas con los archivos definitivos y confirma versiones. Presentaciones, videos, nombres, logos y mensajes deben quedar aprobados antes del montaje para que producción trabaje con material estable.',
      'Guarda además una copia accesible para el responsable técnico.',
    ],
    bullets: ['Lista final de invitados', 'Archivos y equipos probados', 'Responsables por área', 'Plan de contingencia y contactos'],
  },
};

const guideFinalChecks: Record<string, GuideSection> = {
  'como-organizar-cumpleanos-en-lima': {
    title: 'Qué confirmar la última semana',
    paragraphs: [
      'Actualiza la cantidad de invitados, el horario de servicio y el contacto que recibirá a cada proveedor. Revisa dónde se colocarán la comida, las bebidas y los residuos. Si habrá torta, velas o brindis, incluye esos momentos en el horario para que atención, música y fotografía trabajen con la misma pauta.',
    ],
  },
  'como-organizar-cumpleanos-infantil': {
    title: 'Haz una revisión con el adulto responsable',
    paragraphs: [
      'Antes del evento, confirma cuántos niños requieren supervisión, quién autoriza cambios y cómo se entregarán los menores al terminar. Comparte con comida y animación las alergias informadas y reserva un área tranquila para quienes necesiten descansar. La revisión debe hacerse con datos reales, no con edades o cantidades estimadas al azar.',
    ],
  },
  'como-organizar-quinceanos': {
    title: 'Deja margen entre los momentos principales',
    paragraphs: [
      'No programes ingreso, vals, brindis, cena y fotografías sin pausas. Considera los desplazamientos de la familia y el tiempo que necesita cada proveedor para preparar el siguiente momento. Una pauta realista reduce anuncios improvisados y permite que la comida se sirva a una hora adecuada sin cortar el baile o las palabras.',
    ],
  },
  'como-organizar-baby-shower': {
    title: 'Confirma quién atenderá cada momento',
    paragraphs: [
      'Define quién recibe regalos, repone bebidas, dirige los juegos y ayuda con las fotografías. Si el encuentro será corto, sirve la comida en un horario claro para que no compita con las dinámicas. Comunica con anticipación si asistirán niños pequeños, personas mayores o invitados con necesidades alimentarias que deban revisarse.',
    ],
  },
  'como-organizar-matrimonio-civil': {
    title: 'Revisa los detalles de la ceremonia',
    paragraphs: [
      'Confirma con la autoridad o el local el tiempo disponible, los documentos y cualquier restricción de montaje. Indica a proveedores dónde pueden esperar y cuándo entrar sin interrumpir. Si ceremonia y recepción comparten espacio, asigna responsables y tiempo suficiente para retirar sillas, mover flores o preparar las mesas.',
    ],
  },
  'como-organizar-graduacion': {
    title: 'Ordena pagos y aprobaciones del grupo',
    paragraphs: [
      'Registra qué cubre la cuota, quién recauda y quién puede aprobar un gasto adicional. Entrega a las familias un resumen sencillo del alcance contratado y fija una fecha para cerrar invitados. Los cambios posteriores deben pasar por los responsables designados para que proveedores y promoción trabajen con la misma cantidad y programa.',
    ],
  },
  'como-organizar-evento-en-casa': {
    title: 'Protege la operación cotidiana de la casa',
    paragraphs: [
      'Calcula el uso de baños, agua, electricidad y áreas de cocina durante todo el evento. Retira objetos frágiles y deja libres las rutas hacia la salida. Si el acceso es compartido, avisa los horarios de carga y retiro. Al terminar, separa residuos y embalajes antes de devolver cada ambiente a su uso normal.',
    ],
  },
  'como-organizar-evento-corporativo': {
    title: 'Cierra el evento con evidencia útil',
    paragraphs: [
      'Define antes qué necesita conservar la empresa: registro de asistentes, fotografías, grabación, materiales sobrantes o comprobantes. Señala quién recibe cada entrega y en qué formato. Después, compara el resultado con el objetivo inicial y registra incidencias de acceso, tiempos y atención que sirvan para la siguiente actividad.',
    ],
  },
  'cuanta-comida-calcular-evento': {
    title: 'Confirma la cantidad en el momento acordado',
    paragraphs: [
      'Pregunta hasta qué fecha se puede ajustar el número de porciones y qué ocurre si cambia después. Comunica por separado invitados confirmados, niños y personal que también comerá. La estimación debe incluir la secuencia del menú y la forma de reposición; no conviene sumar un porcentaje sin saber qué plato o bebida cubriría.',
    ],
  },
  'que-incluye-buffet-eventos': {
    title: 'Deja por escrito lo que aporta el lugar',
    paragraphs: [
      'Anota si la sede ofrece cocina, agua, energía, mesas de apoyo, refrigeración o espacio para residuos. Comparte ese inventario al solicitar la propuesta y confirma qué debe llevar el equipo de buffet. Así se evitan supuestos sobre equipos disponibles y se puede prever montaje, conservación y retiro con anticipación.',
    ],
  },
  'buffet-o-servicio-en-mesa': {
    title: 'Comprueba el formato con una secuencia real',
    paragraphs: [
      'Imagina el recorrido de un invitado desde que se sienta hasta que termina de comer. En buffet, revisa filas, retorno a la mesa y reposición. En servicio en mesa, calcula pasillos y tiempos por grupo. Si alguno de esos recorridos cruza la ceremonia, la pista o una salida, ajusta la distribución antes de elegir.',
    ],
  },
  'como-calcular-mesas-sillas-evento': {
    title: 'Valida entrega y retiro del mobiliario',
    paragraphs: [
      'Confirma si el proveedor entrega apilado o instala la distribución, cuánto tiempo requiere y quién revisa las unidades. Reserva un lugar para embalajes y piezas de repuesto sin bloquear el evento. Al finalizar, despeja primero las rutas de retiro y acuerda cómo se informarán daños o cantidades distintas de las recibidas.',
    ],
  },
  'como-elegir-toldo-carpa-evento': {
    title: 'Solicita una revisión del punto de montaje',
    paragraphs: [
      'Envía fotografías y medidas, pero permite que el proveedor pida una visita cuando la superficie, la altura o los accesos no estén claros. Informa sobre tuberías, jardines, cables y reglas del local. Antes del evento, confirma quién decide si el clima obliga a modificar o suspender el montaje y cómo se comunicará.',
    ],
  },
  'dj-u-orquesta-para-evento': {
    title: 'Acuerda cómo se atenderán los cambios',
    paragraphs: [
      'Entrega canciones imprescindibles y temas que prefieres evitar, pero deja claro quién puede pedir modificaciones durante la fiesta. Comprueba el uso de micrófonos para discursos y la música de ingresos o cierres. Si habrá músicos y DJ, define la transición entre ambos para evitar silencios, conexiones apresuradas o niveles de volumen distintos.',
    ],
  },
  'que-hace-maestro-ceremonias': {
    title: 'Distingue conducción de coordinación general',
    paragraphs: [
      'Presentar el programa no significa asumir la producción completa del evento. Aclara quién controla tiempos, proveedores y cambios, y qué decisiones puede tomar el maestro de ceremonias. Si también se espera moderación, animación o entrevistas, incluye esas tareas en el guion y confirma el tiempo de preparación necesario.',
    ],
  },
  'checklist-lanzamiento-inauguracion': {
    title: 'Planifica la salida y el seguimiento',
    paragraphs: [
      'Define cómo terminará la actividad, quién despedirá a los invitados y qué materiales se entregarán. Organiza el retiro de equipos sin interferir con asistentes o personal del local. Después, reúne fotografías, contactos, incidencias y pendientes comerciales; el cierre operativo también forma parte del lanzamiento y debe tener responsables.',
    ],
  },
};

export const guides: Guide[] = [
  {
    slug: 'datos-para-cotizar-un-evento',
    category: 'Organización',
    title: 'Qué datos necesitas para cotizar un evento',
    description:
      'Una lista breve para preparar la fecha, el lugar, las cantidades y los servicios antes de solicitar una propuesta.',
    seo: {
      title: 'Qué datos necesitas para cotizar un evento | Gladys',
      description:
        'Revisa qué información necesitas para cotizar comida, atención, alquileres y detalles para un evento en Lima.',
      noindex: false,
    },
    sections: [
      {
        title: 'Empieza por la ocasión y el servicio principal',
        paragraphs: [
          'Indica qué estás organizando y qué necesitas resolver primero. Puede ser únicamente comida, menaje, mozos, bartender, sillas, flores o personalizados. También puedes combinar varios servicios.',
        ],
      },
      {
        title: 'Prepara los datos del evento',
        paragraphs: [
          'No necesitas tener todo cerrado. Una cantidad aproximada permite iniciar la conversación y ajustar los detalles antes de reservar.',
        ],
        bullets: [
          'Fecha prevista',
          'Distrito y acceso al lugar',
          'Cantidad aproximada de invitados o unidades',
          'Horario y duración cuando influyan en el servicio',
          'Servicios que quieres combinar',
        ],
      },
      {
        title: 'Revisa la consulta antes de enviarla',
        paragraphs: [
          'El cotizador prepara un solo mensaje con tu selección. Tú decides si lo envías por WhatsApp. Allí se confirman disponibilidad, alcance, traslado, precio y condiciones.',
        ],
      },
      {
        title: 'Evita solicitudes difíciles de comparar',
        paragraphs: [
          'Envía los mismos datos a todas las opciones que evalúes y pide que separen servicio principal, adicionales, traslado y condiciones. Así podrás distinguir una propuesta completa de otra que deja costos por confirmar.',
          'Si todavía no conoces un dato, márcalo como aproximado. Es más útil declarar la incertidumbre que completar cantidades al azar; antes de reservar se pueden ajustar invitados, unidades y horarios.',
          'Guarda el resumen final que recibas y comprueba que coincida con tu fecha, distrito y cantidad vigente. Si cambias el servicio principal, vuelve a revisar horarios, personal y traslado porque esos datos pueden alterar el alcance completo.',
        ],
      },
    ],
    relatedLinks: [
      { label: 'Preparar mi consulta', href: '/cotizar' },
      { label: 'Ver servicios disponibles', href: '/servicios' },
      { label: 'Revisar cobertura', href: '/cobertura/lima-metropolitana' },
    ],
  },
  {
    slug: 'como-organizar-coffee-break-empresa',
    category: 'Empresas',
    title: 'Cómo organizar un coffee break para tu empresa',
    description:
      'Los datos que ayudan a definir la presentación, las bebidas, el horario y la atención de un coffee break.',
    seo: {
      title: 'Cómo organizar un coffee break para empresas | Gladys',
      description:
        'Organiza un coffee break para una reunión o capacitación: asistentes, horario, presentación, bebidas, menaje y atención.',
      noindex: false,
    },
    sections: [
      {
        title: 'Define el momento de servicio',
        paragraphs: [
          'Una pausa durante una capacitación no se organiza igual que un desayuno de aniversario. Indica el horario, cuánto tiempo tendrá el equipo y si todos comerán al mismo tiempo.',
        ],
      },
      {
        title: 'Elige la presentación',
        paragraphs: [
          'La oferta actual permite consultar por porciones individuales, una mesa para compartir o un formato de coffee break. La elección depende del espacio y de cómo se desarrollará la reunión.',
        ],
        bullets: [
          'Cantidad aproximada de asistentes',
          'Café e infusiones o bebidas calientes y frías',
          'Entrega o servicio durante la reunión',
          'Menaje y atención si hacen falta',
        ],
      },
      {
        title: 'Confirma la logística del lugar',
        paragraphs: [
          'Comparte el distrito, el acceso, el horario de ingreso y el espacio disponible. Gladys confirma por WhatsApp qué puede incluir la propuesta y las condiciones del servicio.',
        ],
      },
      {
        title: 'Prepara el servicio para una jornada de trabajo',
        paragraphs: [
          'Evita alimentos que compliquen una reunión breve o que requieran una zona de preparación inexistente. Pregunta cómo llegarán, cuánto espacio necesitan y quién retirará el menaje o embalaje.',
          'Confirma asistentes y horario cerca de la fecha, pero acuerda antes el límite para cambios. También comunica alergias o restricciones alimentarias sin asumir que una opción puede garantizarse hasta recibir confirmación.',
        ],
      },
    ],
    relatedLinks: [
      {
        label: 'Cotizar desayuno o coffee break',
        href: '/servicios/desayunos-corporativos-coffee-break',
      },
      { label: 'Ver soluciones para empresas', href: '/empresas' },
      { label: 'Cotizar menaje', href: '/servicios/menaje-evento' },
    ],
  },
  {
    slug: 'como-calcular-menaje-para-evento',
    category: 'Menaje',
    title: 'Cómo calcular el menaje para un evento',
    description:
      'Qué revisar antes de definir la cantidad de platos, cubiertos, vasos, copas y piezas de servicio.',
    seo: {
      title: 'Cómo calcular el menaje para un evento | Gladys',
      description:
        'Calcula el menaje de tu evento revisando invitados, menú, bebidas, servicio y piezas necesarias para la mesa.',
      noindex: false,
    },
    sections: [
      {
        title: 'Parte de los invitados y del menú',
        paragraphs: [
          'La cantidad de personas es el primer dato, pero el menú determina las piezas. Una comida con entrada y fondo necesita un montaje distinto de un coffee break o una recepción con bebidas.',
        ],
      },
      {
        title: 'Separa el menaje por uso',
        paragraphs: [
          'Haz una lista según lo que realmente se servirá. Evita pedir piezas que no corresponden al menú y confirma si el lugar ya dispone de parte del menaje.',
        ],
        bullets: [
          'Platos o tazas según cada momento de comida',
          'Cubiertos según los platos elegidos',
          'Vasos y copas según las bebidas',
          'Jarras, fuentes, bandejas u otras piezas de servicio',
        ],
      },
      {
        title: 'Confirma montaje, traslado y devolución',
        paragraphs: [
          'Indica la fecha, el distrito, el acceso y la cantidad aproximada. La disponibilidad, el traslado y las condiciones se revisan antes de reservar.',
        ],
      },
      {
        title: 'Incluye un margen con criterio',
        paragraphs: [
          'El margen no debe consistir en duplicar todas las piezas. Revisa qué elementos se reutilizarán, cuáles permanecen en mesa y cuáles necesita el servicio para reponer o reemplazar durante el evento.',
          'Al recibir, cuenta y revisa el menaje con el responsable. Aclara cómo se registra la devolución, qué limpieza corresponde y cómo se tratan roturas o faltantes para evitar desacuerdos posteriores.',
        ],
      },
    ],
    relatedLinks: [
      { label: 'Cotizar alquiler de menaje', href: '/servicios/menaje-evento' },
      { label: 'Ver alquileres disponibles', href: '/alquiler' },
      { label: 'Cotizar mozos', href: '/servicios/mozos-evento' },
    ],
  },
  ...additionalGuides.map((guide) => ({
    ...guide,
    sections: [
      ...guide.sections,
      guideDeepening[guide.slug],
      guideFinalChecks[guide.slug],
    ],
  })),
];
