import { z } from 'zod';
export function todayInLima() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Lima' });
}
export const quoteSchema = z
  .object({
    requestId: z.uuid(),
    eventTypeId: z.string().max(100),
    eventTypeOther: z.string().trim().max(150),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine(
        (d) =>
          !Number.isNaN(Date.parse(d)) &&
          new Date(d).toISOString().slice(0, 10) === d &&
          d >= todayInLima(),
        'La fecha debe ser válida y no anterior a hoy.',
      ),
    district: z.string().trim().min(2, 'Indica el distrito.').max(120),
    people: z.number().int().min(1).max(100000),
    selectionId: z.string().max(100),
    modalityId: z.string().max(100),
    addOnIds: z.array(z.string().max(100)).max(30),
    budget: z.string().trim().max(100),
    name: z.string().trim().min(2, 'Indica tu nombre.').max(150),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(25)
      .regex(/^[+()0-9\s-]+$/, 'Revisa el teléfono.'),
    email: z.union([z.literal(''), z.email().trim().max(200)]),
    notes: z.string().trim().max(2500),
    consent: z.literal(true, {
      error: 'Necesitamos tu autorización para atender la solicitud.',
    }),
    website: z.literal(''),
    startedAt: z.number(),
  })
  .refine((q) => !!q.eventTypeId || q.eventTypeOther.length >= 2, {
    path: ['eventTypeOther'],
    message: 'Indica el tipo de evento.',
  });
