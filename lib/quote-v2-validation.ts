import { z } from 'zod';
import { quoteSchema } from '@/lib/quote-validation';
import { ctaPlacements } from '@/lib/attribution';
import type {
  AttributionV1,
  CartV2,
  NormalizedQuoteInput,
  QuoteInputV2,
} from '@/models/quote-v2';

const identifier = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
const path = z.string().max(300).regex(/^\/(?!\/)[a-zA-Z0-9/_-]*$/);
const phone = z.string().trim().min(7).max(25).regex(/^[+()0-9\s-]+$/);
const optionValues = z.record(identifier, identifier);

export const attributionV1Schema: z.ZodType<AttributionV1> = z
  .object({
    schemaVersion: z.literal(1),
    landingPath: path,
    acquisitionEntryId: identifier.nullable(),
    lastTouchPath: path,
    referrerHost: z.string().max(253).nullable(),
    channel: z.enum(['organic', 'paid', 'social', 'referral', 'direct_unknown']),
    utm: z
      .object({
        source: z.string().max(80).optional(),
        medium: z.string().max(80).optional(),
        campaign: z.string().max(80).optional(),
      })
      .strict(),
    ctaPlacement: z.enum(ctaPlacements),
    capturedAt: z.iso.datetime({ offset: true }),
  })
  .strict();

export const quoteItemV2Schema = z
  .object({
    itemId: z.uuid(),
    entryId: identifier,
    quantity: z.number().positive(),
    optionValues,
  })
  .strict();

export const cartV2Schema: z.ZodType<CartV2> = z
  .object({
    schemaVersion: z.literal(2),
    items: z.array(quoteItemV2Schema).max(20),
    primaryItemId: z.uuid().nullable(),
    updatedAt: z.number().nonnegative(),
  })
  .strict()
  .superRefine((cart, context) => {
    const ids = cart.items.map((item) => item.itemId);
    if (new Set(ids).size !== ids.length)
      context.addIssue({ code: 'custom', message: 'Cada línea debe tener un UUID único.' });
    if (cart.primaryItemId && !ids.includes(cart.primaryItemId))
      context.addIssue({ code: 'custom', path: ['primaryItemId'], message: 'La línea principal debe pertenecer a la bolsa.' });
  });

export const quoteInputV2Schema: z.ZodType<QuoteInputV2> = z
  .object({
    schemaVersion: z.literal(2),
    requestId: z.uuid(),
    items: z.array(quoteItemV2Schema).min(1).max(20),
    primaryItemId: z.uuid(),
    event: z
      .object({
        typeId: identifier.nullable(),
        typeOther: z.string().trim().max(150),
        date: z.iso.date().nullable(),
        district: z.string().trim().max(120),
        guests: z.number().int().positive().nullable(),
      })
      .strict(),
    contact: z
      .object({
        name: z.string().trim().min(2).max(150),
        phone,
        email: z.union([z.literal(''), z.email().trim().max(200)]),
      })
      .strict(),
    notes: z.string().trim().max(2500),
    consent: z.literal(true),
    website: z.literal(''),
    startedAt: z.number().nonnegative(),
    attribution: attributionV1Schema,
  })
  .strict()
  .superRefine((input, context) => {
    const ids = input.items.map((item) => item.itemId);
    if (new Set(ids).size !== ids.length)
      context.addIssue({ code: 'custom', message: 'Cada línea debe tener un UUID único.' });
    if (!ids.includes(input.primaryItemId))
      context.addIssue({ code: 'custom', path: ['primaryItemId'], message: 'La línea principal debe pertenecer a la solicitud.' });
  });

export function parseQuoteInput(raw: unknown): NormalizedQuoteInput {
  if (typeof raw === 'object' && raw !== null && 'schemaVersion' in raw) {
    const version = (raw as { schemaVersion?: unknown }).schemaVersion;
    if (version !== 2) throw new Error('Versión de solicitud no compatible.');
    return { schemaVersion: 2, input: quoteInputV2Schema.parse(raw) };
  }
  return { schemaVersion: 1, input: quoteSchema.parse(raw) };
}
