export type HomeSceneLayer = {
  name: 'back' | 'main' | 'front';
  mobile: string;
  desktop: string;
  width: number;
  height: number;
};

export type HomeServiceScene = {
  key: 'cocina' | 'bartender' | 'menaje' | 'atencion' | 'personalizados' | 'flores';
  anchor: string;
  kicker: string;
  title: string;
  description: string;
  essentials: string[];
  primaryId: string;
  cta: string;
  ids: string[];
  visualMode: 'cutout' | 'slice';
  layers: HomeSceneLayer[];
};

const slicedLayers = (
  mobile: string,
  desktop: string,
  width: number,
  height: number,
): HomeSceneLayer[] =>
  (['back', 'main', 'front'] as const).map((name) => ({
    name,
    mobile,
    desktop,
    width,
    height,
  }));

export const homeServiceNav = [
  { label: 'Cocina', href: '#servicio-cocina' },
  { label: 'Bartender', href: '#servicio-bartender' },
  { label: 'Menaje', href: '#servicio-menaje' },
  { label: 'Mozos y sillas', href: '#servicio-atencion' },
  { label: 'Personalizados', href: '#servicio-personalizados' },
  { label: 'Flores', href: '#servicio-flores' },
] as const;

export const homeServiceScenes: HomeServiceScene[] = [
  {
    key: 'cocina',
    anchor: 'servicio-cocina',
    kicker: 'La mesa empieza aquí',
    title: 'Cocina para reunir, celebrar y servir con calma.',
    description:
      'Preparamos buffet, platos criollos y desayunos para celebraciones familiares o encuentros de empresa. La propuesta se ajusta a tus invitados y al tipo de servicio.',
    essentials: ['Buffet para eventos', 'Menú criollo', 'Desayunos y coffee break'],
    primaryId: 'buffet-para-eventos',
    cta: 'Cotizar la comida',
    ids: ['buffet-para-eventos', 'menu-criollo-eventos', 'desayuno-corporativo'],
    visualMode: 'slice',
    layers: slicedLayers(
      '/images/mesa/buffet-480.jpg',
      '/images/mesa/buffet-1280.jpg',
      1280,
      960,
    ),
  },
  {
    key: 'bartender',
    anchor: 'servicio-bartender',
    kicker: 'El momento del brindis',
    title: 'Una barra pensada para el ritmo de tu evento.',
    description:
      'Coordinamos bartender, bebidas y cristalería según tus invitados y el estilo de la celebración.',
    essentials: ['Bartender', 'Barra y cristalería', 'Carta de bebidas por coordinar'],
    primaryId: 'bar-bartender',
    cta: 'Cotizar bartender',
    ids: ['bar-bartender'],
    visualMode: 'cutout',
    layers: [
      { name: 'back', mobile: '/images/home-scenes/bartender/bartender-back-bottle-citrus-640.webp', desktop: '/images/home-scenes/bartender/bartender-back-bottle-citrus-1100.webp', width: 1100, height: 629 },
      { name: 'main', mobile: '/images/home-scenes/bartender/bartender-main-cocktail-tools-640.webp', desktop: '/images/home-scenes/bartender/bartender-main-cocktail-tools-1100.webp', width: 1100, height: 800 },
      { name: 'front', mobile: '/images/home-scenes/bartender/bartender-front-ice-citrus-640.webp', desktop: '/images/home-scenes/bartender/bartender-front-ice-citrus-1100.webp', width: 1100, height: 266 },
    ],
  },
  {
    key: 'menaje',
    anchor: 'servicio-menaje',
    kicker: 'Una mesa que recibe bien',
    title: 'El menaje también cuenta cómo imaginaste la celebración.',
    description:
      'Vajilla, copas, cubiertos y piezas de servicio para vestir la mesa sin que tengas que resolver cada elemento por separado.',
    essentials: ['Vajilla y cubiertos', 'Copas, vasos o tazas', 'Piezas de servicio'],
    primaryId: 'menaje-evento',
    cta: 'Cotizar el menaje',
    ids: ['menaje-evento'],
    visualMode: 'cutout',
    layers: [
      { name: 'back', mobile: '/images/home-scenes/menaje/menaje-back-serving-elements-640.webp', desktop: '/images/home-scenes/menaje/menaje-back-serving-elements-1100.webp', width: 1100, height: 408 },
      { name: 'main', mobile: '/images/home-scenes/menaje/menaje-main-tableware-640.webp', desktop: '/images/home-scenes/menaje/menaje-main-tableware-1100.webp', width: 1100, height: 641 },
      { name: 'front', mobile: '/images/home-scenes/menaje/menaje-front-place-setting-640.webp', desktop: '/images/home-scenes/menaje/menaje-front-place-setting-1100.webp', width: 1100, height: 267 },
    ],
  },
  {
    key: 'atencion',
    anchor: 'servicio-atencion',
    kicker: 'Mientras tú celebras',
    title: 'La atención y el espacio pueden quedar en nuestras manos.',
    description:
      'Mozos para acompañar el servicio y sillas para recibir a tus invitados. Puedes pedirlos junto al buffet o por separado.',
    essentials: ['Mozos para eventos', 'Sillas', 'Coordinación según fecha y distrito'],
    primaryId: 'mozos-evento',
    cta: 'Cotizar atención',
    ids: ['mozos-evento', 'sillas-evento'],
    visualMode: 'cutout',
    layers: [
      { name: 'back', mobile: '/images/home-scenes/attention/attention-back-chairs-640.webp', desktop: '/images/home-scenes/attention/attention-back-chairs-640.webp', width: 517, height: 783 },
      { name: 'main', mobile: '/images/home-scenes/attention/attention-main-service-tray-640.webp', desktop: '/images/home-scenes/attention/attention-main-service-tray-1100.webp', width: 1100, height: 714 },
      { name: 'front', mobile: '/images/home-scenes/attention/attention-front-napkin-flowers-card-640.webp', desktop: '/images/home-scenes/attention/attention-front-napkin-flowers-card-1100.webp', width: 1100, height: 412 },
    ],
  },
  {
    key: 'personalizados',
    anchor: 'servicio-personalizados',
    kicker: 'Un recuerdo pensado para ustedes',
    title: 'Personalizados para que tus invitados se lleven un recuerdo de ese día.',
    description:
      'Reunimos recuerdos y productos estampados para invitados, equipos o aniversarios. Cuéntanos la idea, los colores y las cantidades.',
    essentials: ['Recuerdos para invitados', 'Polos estampados', 'Tazas y tomatodos por coordinar'],
    primaryId: 'recuerdos-evento',
    cta: 'Cotizar personalizados',
    ids: ['recuerdos-evento', 'polos-estampados'],
    visualMode: 'slice',
    layers: slicedLayers(
      '/images/home-scenes/personalizados/personalizados-cutout-celebration-details-640.webp',
      '/images/home-scenes/personalizados/personalizados-cutout-celebration-details-1100.webp',
      1100,
      775,
    ),
  },
  {
    key: 'flores',
    anchor: 'servicio-flores',
    kicker: 'El detalle que cambia el ambiente',
    title: 'Flores y detalles para darle una atmósfera propia a la celebración.',
    description:
      'Podemos sumar arreglos florales a la mesa o al espacio. La propuesta se conversa según el estilo, la fecha y la cantidad que necesitas.',
    essentials: ['Arreglos florales', 'Paleta y estilo por coordinar', 'Cantidad según el espacio'],
    primaryId: 'arreglos-florales',
    cta: 'Cotizar flores',
    ids: ['arreglos-florales'],
    visualMode: 'slice',
    layers: slicedLayers(
      '/images/mesa/flores-480.jpg',
      '/images/mesa/flores-1280.jpg',
      1280,
      960,
    ),
  },
];
