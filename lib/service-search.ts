export type ServiceSearchEntry = {
  id: string;
  title: string;
  href: string;
  family: string;
};

// Search vocabulary points to real catalog IDs; it never creates offers.
export const serviceSearchAliases: Readonly<Record<string, readonly string[]>> = {
  'buffet-para-eventos': ['catering', 'cocina', 'comida', 'alimentación', 'buffets'],
  'menu-criollo-eventos': ['cocina', 'comida criolla', 'platos criollos'],
  'desayuno-corporativo': ['coffee break', 'coffe', 'café', 'desayunos empresariales', 'cocina'],
  'bocaditos-piqueos-eventos': ['cocina', 'aperitivos', 'bocaditos', 'piqueos'],
  'brunch-box-eventos': ['cocina', 'desayuno en caja', 'box lunch', 'box breakfast'],
  'almuerzos-cenas-corporativas': ['cocina', 'comida', 'almuerzo empresarial', 'cena empresarial'],
  'bar-bartender': ['barman', 'bartenders', 'cocteles', 'cóctel', 'barra', 'tragos'],
  'bebidas-barra-eventos': ['barman', 'cocteles', 'cóctel', 'tragos', 'bebidas'],
  'menaje-evento': ['vajilla', 'platos', 'cubiertos', 'copas', 'vasos', 'tazas de menaje'],
  'mozos-evento': ['mozo', 'meseros', 'camareros', 'personal de atención'],
  'sillas-evento': ['silla', 'asientos'],
  'alquiler-mesas-eventos': ['mesa', 'mesas de alquiler'],
  'alquiler-toldos-carpas': ['toldo', 'carpa', 'toldos', 'carpas'],
  'manteleria-eventos': ['manteles', 'mantel', 'servilletas', 'textiles'],
  'mobiliario-eventos': ['muebles', 'mobiliario'],
  'maestro-ceremonias': ['maestro de ceremonia', 'presentador', 'conductor', 'conducción'],
  'animacion-eventos': ['animador', 'animadores', 'animación'],
  'dj-eventos': ['disc jockey', 'deejay', 'música para bailar', 'dj'],
  'orquesta-musica-vivo': ['banda', 'grupo musical', 'músicos', 'música en vivo'],
  'hora-loca-shows': ['hora loca', 'show', 'shows'],
  'karaoke-eventos': ['cantar', 'karaoke'],
  'fiestas-infantiles-servicios': ['animación infantil', 'fiesta infantil', 'cumpleaños infantiles'],
  'sonido-eventos': ['audio', 'parlantes', 'altavoces', 'sonido'],
  'iluminacion-eventos': ['luces', 'luz', 'iluminación'],
  'pantallas-proyeccion-eventos': ['proyector', 'proyectores', 'pantalla', 'proyección'],
  'escenarios-tarimas-eventos': ['escenario', 'tarima', 'estructuras'],
  'streaming-eventos': ['transmisión', 'transmisiones', 'evento virtual', 'streaming'],
  'decoracion-eventos': ['decorador', 'decoradora', 'ambientación', 'decoración'],
  'arreglos-florales': ['florista', 'flores', 'florales', 'centros de mesa'],
  'candy-bar-mesas-postres': ['dulces', 'postres', 'mesa dulce', 'candybar'],
  'cabina-fotografica-360': ['fotocabina', 'cabina de fotos', 'photobooth', '360'],
  'recuerdos-evento': ['souvenirs', 'recuerditos', 'recuerdo para invitados'],
  'polos-estampados': ['camisetas', 'polo', 'polos personalizados', 'estampados'],
  'tazas-personalizadas': ['taza', 'tazas estampadas'],
  'tomatodos-personalizados': ['tomatodo', 'botellas personalizadas'],
  'cuadros-fotorecuerdos': ['cuadro', 'fotorecuerdo', 'marcos personalizados'],
  'llaveros-personalizados': ['llavero'],
  'papeleria-eventos': ['papelería', 'invitaciones', 'etiquetas', 'tarjetas'],
  'kits-regalos-corporativos': ['regalos empresariales', 'regalos para colaboradores', 'kits corporativos'],
};

export const normalizeServiceSearch = (value: string) => value
  .slice(0, 160)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('es')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const fillerWords = new Set(['de', 'del', 'para', 'el', 'la', 'los', 'las', 'un', 'una', 'mi', 'necesito', 'busco', 'quiero', 'contratar']);

export function searchServices(entries: ServiceSearchEntry[], query: string, family: string | null = null) {
  const normalized = normalizeServiceSearch(query);
  const tokens = normalized.split(' ').filter((token) => token && !fillerWords.has(token));
  return entries
    .filter((entry) => !family || entry.family === family)
    .map((entry, index) => {
      if (!normalized) return { entry, index, score: 0 };
      if (!tokens.length) return { entry, index, score: -1 };
      const title = normalizeServiceSearch(entry.title);
      const aliases = normalizeServiceSearch((serviceSearchAliases[entry.id] || []).join(' '));
      const group = normalizeServiceSearch(entry.family);
      let score = title.includes(normalized) ? 200 : 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 40;
        else if (aliases.includes(token)) score += 22;
        else if (group.includes(token)) score += 8;
        else return { entry, index, score: -1 };
      }
      return { entry, index, score };
    })
    .filter(({ score }) => score >= 0)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ entry }) => entry);
}
