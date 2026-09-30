import {
  resolveBusinessContact,
  type BusinessContactMap,
  type PublicBusinessContact,
} from '@/lib/business-contacts';
import type { ContentEntry, QuoteConfig } from '@/models/content';
import type { QuoteInputV2, QuoteItemV2 } from '@/models/quote-v2';

export type QuoteResolutionError = {
  itemId: string | null;
  code:
    | 'unavailable_entry'
    | 'missing_config'
    | 'quantity'
    | 'option'
    | 'event'
    | 'primary';
  message: string;
};

export type ResolvedQuoteItem = {
  itemId: string;
  entryId: string;
  title: string;
  quantity: number;
  quantityUnit: QuoteConfig['quantityUnit'];
  options: { id: string; label: string; valueId: string; valueLabel: string }[];
  ownerId: NonNullable<ContentEntry['ownerId']>;
  price: ContentEntry['price'];
};

export type ResolvedQuote = {
  primaryItemId: string;
  recipient: PublicBusinessContact;
  items: ResolvedQuoteItem[];
};

export type QuoteResolution =
  | { ok: true; value: ResolvedQuote }
  | { ok: false; errors: QuoteResolutionError[] };

const decimalPlaces = (value: number) => String(value).split('.')[1]?.length || 0;

function respectsStep(quantity: number, config: QuoteConfig) {
  const decimals = Math.max(
    decimalPlaces(quantity),
    decimalPlaces(config.minimum),
    decimalPlaces(config.step),
  );
  if (decimals > 6) return false;
  const scale = 10 ** decimals;
  return (
    Math.round((quantity - config.minimum) * scale) %
      Math.round(config.step * scale) ===
    0
  );
}

function resolveItem(
  item: QuoteItemV2,
  entry: ContentEntry | undefined,
): { item?: ResolvedQuoteItem; errors: QuoteResolutionError[] } {
  if (!entry || entry.status !== 'published' || !entry.requestable)
    return {
      errors: [{ itemId: item.itemId, code: 'unavailable_entry', message: 'La oferta ya no está disponible.' }],
    };
  if (!entry.ownerId || !entry.quoteConfig)
    return {
      errors: [{ itemId: item.itemId, code: 'missing_config', message: 'La oferta no tiene configuración comercial completa.' }],
    };
  const config = entry.quoteConfig;
  if (
    !Number.isFinite(item.quantity) ||
    item.quantity < config.minimum ||
    item.quantity > config.maximum ||
    !respectsStep(item.quantity, config)
  )
    return {
      errors: [{ itemId: item.itemId, code: 'quantity', message: 'La cantidad no respeta los límites de esta oferta.' }],
    };
  const options = [];
  for (const [optionId, valueId] of Object.entries(item.optionValues)) {
    const option = config.options.find((candidate) => candidate.id === optionId);
    const value = option?.values.find((candidate) => candidate.id === valueId);
    if (!option || !value)
      return {
        errors: [{ itemId: item.itemId, code: 'option', message: 'Una opción ya no está disponible para esta oferta.' }],
      };
    options.push({ id: option.id, label: option.label, valueId: value.id, valueLabel: value.label });
  }
  if (config.options.some((option) => option.required && !(option.id in item.optionValues)))
    return {
      errors: [{ itemId: item.itemId, code: 'option', message: 'Falta una opción obligatoria de esta oferta.' }],
    };
  return {
    item: {
      itemId: item.itemId,
      entryId: entry.id,
      title: entry.title,
      quantity: item.quantity,
      quantityUnit: config.quantityUnit,
      options,
      ownerId: entry.ownerId,
      price: entry.price,
    },
    errors: [],
  };
}

export function resolveQuote(
  input: QuoteInputV2,
  entries: readonly ContentEntry[],
  contacts: BusinessContactMap,
): QuoteResolution {
  const errors: QuoteResolutionError[] = [];
  const resolved = input.items.map((item) => {
    const result = resolveItem(item, entries.find((entry) => entry.id === item.entryId));
    errors.push(...result.errors);
    return result.item;
  });
  const primary = resolved.find((item) => item?.itemId === input.primaryItemId);
  if (!primary)
    errors.push({ itemId: input.primaryItemId, code: 'primary', message: 'La línea principal no se pudo validar.' });
  const eventErrors = resolved
    .filter((item): item is ResolvedQuoteItem => !!item)
    .flatMap((item) => {
      const entry = entries.find((candidate) => candidate.id === item.entryId)!;
      const config = entry.quoteConfig!;
      return [
        config.dateRequired && !input.event.date,
        config.districtRequired && !input.event.district.trim(),
        config.guestsRequired && !input.event.guests,
      ].some(Boolean)
        ? [{ itemId: item.itemId, code: 'event' as const, message: 'Faltan datos de evento requeridos por esta oferta.' }]
        : [];
    });
  errors.push(...eventErrors);
  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      primaryItemId: input.primaryItemId,
      recipient: resolveBusinessContact(primary!.ownerId, contacts),
      items: resolved as ResolvedQuoteItem[],
    },
  };
}
