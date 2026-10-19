export const serviceGroupOrder = [
  'Comida y bebidas',
  'Personal para eventos',
  'Alquileres',
  'Música y entretenimiento',
  'Producción audiovisual',
  'Decoración',
  'Cabina y 360',
  'Personalizados',
  'Soluciones para empresas',
  'Otros servicios',
] as const;

const groupsById: Record<string, (typeof serviceGroupOrder)[number]> = {
  'buffet-para-eventos': 'Comida y bebidas',
  'menu-criollo-eventos': 'Comida y bebidas',
  'desayuno-corporativo': 'Soluciones para empresas',
  'bar-bartender': 'Comida y bebidas',
  'mozos-evento': 'Personal para eventos',
  'menaje-evento': 'Alquileres',
  'sillas-evento': 'Alquileres',
  'arreglos-florales': 'Decoración',
  'recuerdos-evento': 'Personalizados',
  'polos-estampados': 'Personalizados',
};

const groupsByCategory: Record<string, (typeof serviceGroupOrder)[number]> = {
  Comida: 'Comida y bebidas',
  Bar: 'Comida y bebidas',
  Personal: 'Personal para eventos',
  Alquileres: 'Alquileres',
  Música: 'Música y entretenimiento',
  Entretenimiento: 'Música y entretenimiento',
  Producción: 'Producción audiovisual',
  'Sonido e iluminación': 'Producción audiovisual',
  Decoración: 'Decoración',
  Cabinas: 'Cabina y 360',
  Personalizados: 'Personalizados',
  Empresas: 'Soluciones para empresas',
};

export function serviceGroup(entry: { id: string; category: string }) {
  return groupsById[entry.id] || groupsByCategory[entry.category] || 'Otros servicios';
}
