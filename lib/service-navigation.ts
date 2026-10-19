import { serviceGroup, serviceGroupOrder } from './service-groups';

export type ServiceFamilyName = (typeof serviceGroupOrder)[number];

export const serviceFamilyMeta: Partial<Record<ServiceFamilyName, {
  label: string;
  description: string;
  href: string;
}>> = {
  'Comida y bebidas': { label: 'Comida y bebidas', description: 'Para servir, brindar y compartir.', href: '/servicios/cocina-para-eventos-lima' },
  'Personal para eventos': { label: 'Personal', description: 'Para recibir y acompañar a tus invitados.', href: '/servicios' },
  Alquileres: { label: 'Alquileres', description: 'Para montar el espacio y vestir la mesa.', href: '/alquiler' },
  'Música y entretenimiento': { label: 'Música y entretenimiento', description: 'Para darle ritmo a la celebración.', href: '/entretenimiento' },
  'Producción audiovisual': { label: 'Producción audiovisual', description: 'Para que el evento se vea y se escuche bien.', href: '/produccion' },
  Decoración: { label: 'Decoración', description: 'Para definir el ambiente y los detalles.', href: '/decoracion' },
  'Cabina y 360': { label: 'Cabina y 360', description: 'Una experiencia participativa para tus invitados.', href: '/foto-video' },
  Personalizados: { label: 'Personalizados', description: 'Para convertir la idea en recuerdos y piezas propias.', href: '/personalizados' },
  'Soluciones para empresas': { label: 'Empresas', description: 'Para reuniones, equipos y fechas corporativas.', href: '/empresas' },
};

export const serviceFamilyAnchor = (group: ServiceFamilyName) => 'familia-' + group
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

export function serviceFamilyLinks(entries: { id: string; category: string }[]) {
  return serviceGroupOrder.flatMap((group) => {
    const meta = serviceFamilyMeta[group];
    const count = entries.filter((entry) => serviceGroup(entry) === group).length;
    return meta && count ? [{ id: serviceFamilyAnchor(group), label: meta.label, count }] : [];
  });
}

export type HeaderSection = 'servicios' | 'ocasiones' | 'empresas' | 'como-cotizar' | '';

export function navigationSectionForPath(path: string): HeaderSection {
  const segment = path.split('/')[1];
  if (['servicios', 'menus', 'alquiler', 'entretenimiento', 'produccion', 'decoracion', 'foto-video', 'personalizados'].includes(segment)) return 'servicios';
  if (['eventos', 'tipos-evento'].includes(segment)) return 'ocasiones';
  if (segment === 'empresas') return 'empresas';
  return '';
}
