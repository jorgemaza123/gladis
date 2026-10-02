export type WhatsAppMessageInput = {
  introduction: string;
  eventType: string;
  date: string;
  district: string;
  guests: number;
  primary: string;
  extras: string[];
  budget: string;
  items?: string[];
  origin?: string;
};

const MAX_MESSAGE_LENGTH = 6000;
const clean = (value: string, maximum: number) =>
  Array.from(value)
    .filter(
      (character) => character >= ' ' && character !== String.fromCharCode(127),
    )
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maximum);

export function createWhatsAppMessage(input: WhatsAppMessageInput) {
  const lines = [
    clean(input.introduction, 300),
    `Evento: ${clean(input.eventType, 150) || 'Por definir'}`,
    `Fecha: ${clean(input.date, 40) || 'Por definir'}`,
    `Distrito: ${clean(input.district, 150) || 'Por definir'}`,
    `Personas: ${Number.isFinite(input.guests) && input.guests > 0 ? input.guests : 'Por definir'}`,
    `Oferta principal: ${clean(input.primary, 200) || 'Necesito orientación'}`,
    `Complementos: ${
      input.extras
        .map((item) => clean(item, 150))
        .filter(Boolean)
        .join(', ') || 'Ninguno seleccionado'
    }`,
    `Presupuesto orientativo: ${clean(input.budget, 150) || 'Por definir'}`,
    ...(input.items || []).map((item) => clean(item, 600)),
    input.origin ? `Origen de la consulta: ${clean(input.origin, 700)}` : '',
  ].filter(Boolean);
  return lines.join('\n');
}

export function createWhatsAppUrl(destination: string | null, message: string) {
  if (
    !destination ||
    !/^[1-9][0-9]{7,14}$/.test(destination) ||
    message.length > MAX_MESSAGE_LENGTH
  )
    return null;
  return `https://wa.me/${destination}?text=${encodeURIComponent(message)}`;
}
