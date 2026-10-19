import type { CartV2 } from '@/models/quote-v2';
import type { QuoteConfig } from '@/models/content';
import { resolveBusinessContact, resolveWhatsAppDestination } from './business-contacts';
import { describeItem } from './event-selection';
import { createWhatsAppMessage, createWhatsAppUrl } from './whatsapp-message';

export type EnquiryService = {
  id: string;
  title: string;
  quoteConfig: QuoteConfig;
  recipient: { label: string | null };
  whatsappDestination: string | null;
};

export type EnquiryEvent = Partial<Record<'occasion' | 'date' | 'district' | 'guests' | 'budget', string>>;

/** An initial enquiry may leave quantities/preferences open; it is not a quote. */
export function initialEnquiry({
  entries,
  cart,
  topic,
  note = '',
  event = {},
}: {
  entries: EnquiryService[];
  cart: CartV2;
  topic: string;
  note?: string;
  event?: EnquiryEvent;
}) {
  const selected = cart.items.map((item) => ({
    item,
    entry: entries.find((entry) => entry.id === item.entryId),
  }));
  // Never silently drop a selected service or let a topic override its principal.
  if (selected.some(({ entry }) => !entry)) return null;
  const primary = selected.find(({ item }) => item.itemId === cart.primaryItemId);
  if (selected.length && !primary) return null;
  const topicEntry = entries.find((entry) => entry.id === topic);
  const owner = topic === 'orientacion-cocina'
    ? 'cocina'
    : topic === 'orientacion-eventos' ? 'eventos' : null;
  const destination = selected.length
    ? primary!.entry!.whatsappDestination
    : topicEntry?.whatsappDestination || (owner && resolveWhatsAppDestination(owner));
  const recipientLabel = selected.length
    ? primary!.entry!.recipient.label
    : topicEntry?.recipient.label || (owner && resolveBusinessContact(owner).label);
  const primaryTitle = primary?.entry?.title || topicEntry?.title || (
    owner === 'cocina' ? 'Orientación sobre cocina, alimentación, bar o menaje'
      : owner === 'eventos' ? 'Orientación sobre otros servicios para mi evento' : ''
  );
  if (!destination || !primaryTitle) return null;
  const message = createWhatsAppMessage({
    introduction: 'Hola, quisiera orientación para mi evento. Todavía estoy definiendo los detalles.',
    eventType: event.occasion || '',
    date: event.date || '',
    district: event.district || '',
    guests: Number(event.guests) || 0,
    primary: primaryTitle,
    extras: selected.filter(({ item }) => item.itemId !== cart.primaryItemId)
      .map(({ entry }) => entry!.title),
    budget: event.budget || '',
    items: selected.map(({ item, entry }) => {
      const config = entry!.quoteConfig;
      const validQuantity = Number.isInteger(item.quantity)
        && item.quantity >= config.minimum && item.quantity <= config.maximum
        && (item.quantity - config.minimum) % config.step === 0;
      const detail = describeItem(item, entry!);
      const description = validQuantity
        ? detail
        : ['Cantidad por definir', ...detail.split(' · ').slice(1)].join(' · ');
      return `${item.itemId === cart.primaryItemId ? 'Principal' : 'Adicional'}: ${entry!.title} — ${description}`;
    }),
    notes: note,
  });
  const href = createWhatsAppUrl(destination, message);
  return href ? {
    href,
    message,
    recipientLabel,
    destination,
    entryId: primary?.entry?.id || topicEntry?.id || null,
  } : null;
}
