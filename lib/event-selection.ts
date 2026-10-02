import type { QuoteConfig } from '@/models/content';
import type { CartV2, QuoteItemV2 } from '@/models/quote-v2';

export type EventEntry = {
  id: string;
  title: string;
  quoteConfig: QuoteConfig;
};
export function quantityLabel(
  unit: QuoteConfig['quantityUnit'],
  quantity: number,
) {
  const labels = {
    person: ['persona', 'personas'],
    unit: ['unidad', 'unidades'],
    event: ['evento', 'eventos'],
    hour: ['hora', 'horas'],
  };
  return `${quantity} ${labels[unit][quantity === 1 ? 0 : 1]}`;
}
export function selectionErrors(cart: CartV2, entries: EventEntry[]) {
  const errors: string[] = [];
  if (!cart.items.length) return ['Elige al menos un servicio para tu evento.'];
  if (!cart.items.some((item) => item.itemId === cart.primaryItemId))
    errors.push('Elige el servicio principal para saber quién te atenderá.');
  for (const item of cart.items) {
    const entry = entries.find((e) => e.id === item.entryId);
    if (!entry) {
      errors.push(
        'Uno de los servicios ya no está disponible. Quítalo de tu selección.',
      );
      continue;
    }
    const c = entry.quoteConfig;
    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < c.minimum ||
      item.quantity > c.maximum ||
      (item.quantity - c.minimum) % c.step !== 0
    )
      errors.push(
        `${entry.title}: indica una cantidad entre ${c.minimum} y ${c.maximum}, en incrementos de ${c.step}.`,
      );
    for (const option of c.options) {
      const value = item.optionValues[option.id];
      if (
        (option.required && !value) ||
        (value && !option.values.some((v) => v.id === value))
      )
        errors.push(`${entry.title}: elige ${option.label.toLowerCase()}.`);
    }
    if (
      Object.keys(item.optionValues).some(
        (id) => !c.options.some((o) => o.id === id),
      )
    )
      errors.push(
        `${entry.title}: revisa las opciones antiguas antes de continuar.`,
      );
  }
  return errors;
}
export function describeItem(item: QuoteItemV2, entry: EventEntry) {
  return [
    quantityLabel(entry.quoteConfig.quantityUnit, item.quantity),
    ...entry.quoteConfig.options.flatMap((option) => {
      const value = option.values.find(
        (v) => v.id === item.optionValues[option.id],
      );
      return value ? [`${option.label}: ${value.label}`] : [];
    }),
  ].join(' · ');
}
