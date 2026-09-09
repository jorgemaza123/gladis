import { normalizeSite, emptyEntry } from './defaults';
import images from './stitch-images.json';
import type { SiteContent, ContentEntry } from '@/models/content';
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
  details: string[] = [],
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
    sortOrder: 0,
    featured: true,
    details,
    seo: seo(`${title} en Lima`, description),
  };
}
export const demoContent: SiteContent = normalizeSite({
  version: 0,
  settings: {
    name: 'Nombre de la marca',
    tagline: 'Cocina para compartir',
    whatsapp: '',
    whatsappMessage: 'Hola, quisiera una propuesta para mi evento.',
    email: '',
    origin: '',
    indexable: false,
    demo: true,
    seo: seo(
      'Catering y buffet para eventos en Lima',
      'Comida y opciones de servicio para reuniones familiares, celebraciones y eventos empresariales en Lima.',
    ),
    navigation: [
      { label: 'Inicio', href: '/' },
      { label: 'Servicios', href: '/servicios' },
      { label: 'Menús', href: '/menus' },
      { label: 'Nosotros', href: '/paginas/nosotros' },
    ],
    footer:
      'Catering y buffet en Lima. Cada propuesta se coordina según la fecha, la zona y las necesidades del evento.',
  },
  media: images.slice(1).map((url, i) => ({
    id: `foto-${i}`,
    url,
    alt:
      [
        'Mesa de buffet con platos para compartir',
        'Mesa para una reunión familiar',
        'Montaje para una celebración',
        'Mesa para una boda',
        'Servicio para una reunión empresarial',
        'Especialidad gastronómica',
        'Selección de platos criollos',
      ][i] || 'Presentación gastronómica de muestra',
    caption: 'Imagen de demostración de la propuesta de Stitch.',
    demo: true,
  })),
  entries: [
    entry(
      'buffet-criollo',
      'servicios',
      'Buffet criollo',
      'Sabores peruanos para reunir a tu familia, amigos o equipo alrededor de una buena mesa.',
      'foto-5',
      [
        'Selección de platos a coordinar',
        'Montaje según modalidad',
        'Cantidad de invitados por confirmar',
      ],
    ),
    entry(
      'almuerzos-para-grupos',
      'servicios',
      'Almuerzos para grupos',
      'Una propuesta de comida para reuniones familiares y encuentros de trabajo.',
      'foto-1',
      ['Menú según las necesidades del grupo', 'Entrega sujeta a coordinación'],
    ),
    entry(
      'coffee-break',
      'servicios',
      'Coffee break',
      'Una pausa para compartir en reuniones, capacitaciones y encuentros empresariales.',
      'foto-4',
      [
        'Bebidas y bocaditos a coordinar',
        'Opciones según la duración del evento',
      ],
    ),
    entry(
      'menu-criollo',
      'menus',
      'Una mesa criolla',
      'Una selección de sabores peruanos para compartir. El menú final se define contigo.',
      'foto-6',
      [
        'Entradas a elección',
        'Platos de fondo a coordinar',
        'Guarniciones para compartir',
      ],
    ),
    entry(
      'menu-familiar',
      'menus',
      'Para reunirnos en familia',
      'Comida para celebraciones cercanas, con una propuesta adaptada a tus invitados.',
      'foto-1',
      ['Opciones de entrada', 'Plato principal', 'Complementos a consultar'],
    ),
    entry(
      'menu-empresarial',
      'menus',
      'Una pausa bien servida',
      'Opciones de comida para acompañar reuniones y jornadas de trabajo.',
      'foto-4',
      ['Selección de bocaditos', 'Bebidas a coordinar'],
    ),
    entry(
      'nosotros',
      'paginas',
      'La cocina nos reúne',
      'Somos un negocio familiar de preparación de comida para eventos en Lima. Queremos acompañar tus reuniones con buena comida y un trato cercano.',
      'foto-0',
      [
        'Cuéntanos qué estás organizando',
        'Definimos la propuesta contigo',
        'Coordinamos los detalles del servicio',
      ],
    ),
  ],
  sections: [
    {
      id: 'portada',
      type: 'hero',
      title: 'Catering y buffet para eventos en Lima',
      description:
        'Comida y opciones de servicio para reuniones familiares, celebraciones y eventos empresariales.',
      imageId: 'foto-0',
      visible: true,
      sortOrder: 0,
    },
    {
      id: 'especialidades',
      type: 'servicios',
      title: 'Buena comida.\nBuenos momentos.',
      description: 'Encuentra una propuesta para lo que estás organizando.',
      imageId: '',
      visible: true,
      sortOrder: 1,
    },
    {
      id: 'historia',
      type: 'texto',
      title: 'El gusto de\ncompartir la mesa.',
      description:
        'Cada reunión es distinta. Cuéntanos la fecha, el lugar y cuántas personas te acompañan; te ayudamos a elegir una propuesta.',
      imageId: 'foto-1',
      visible: true,
      sortOrder: 2,
    },
    {
      id: 'seleccion',
      type: 'menus',
      title: 'Un menú para tu ocasión',
      description:
        'Explora nuestras propuestas y conversemos sobre las opciones para tu evento.',
      imageId: '',
      visible: true,
      sortOrder: 3,
    },
    {
      id: 'preguntas',
      type: 'faq',
      title: 'Antes de sentarnos a la mesa',
      description: 'Resolvamos las primeras dudas.',
      imageId: '',
      visible: true,
      sortOrder: 4,
    },
    {
      id: 'contacto',
      type: 'cta',
      title: 'Tu próxima reunión\nempieza aquí.',
      description:
        'Cuéntanos qué tienes en mente. Coordinemos una propuesta para compartir.',
      imageId: '',
      visible: true,
      sortOrder: 5,
    },
  ],
  faqs: [
    {
      id: 'cobertura',
      question: '¿Atienden mi distrito?',
      answer:
        'Indícanos el distrito y la dirección aproximada para confirmar cobertura y condiciones de traslado.',
    },
    {
      id: 'invitados',
      question: '¿Para cuántas personas puedo cotizar?',
      answer:
        'Cuéntanos cuántas personas asistirán. Las cantidades mínimas se confirman según el menú y la modalidad.',
    },
    {
      id: 'incluye',
      question: '¿El servicio incluye montaje y personal?',
      answer:
        'La propuesta especificará qué incluye. Puedes consultar por preparación y entrega, montaje o personal de atención.',
    },
  ],
});
