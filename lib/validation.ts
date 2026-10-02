import { z } from 'zod';
import { businessOwnerIds } from '@/config/business-contacts';
import { contentKinds } from '@/models/content';
const short = z.string().max(300),
  para = z.string().max(12000),
  identifier = z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/);
const path = z
  .string()
  .max(300)
  .regex(/^\/(?!\/)[a-zA-Z0-9/_-]*$/);
const safeHttps = z
  .url()
  .max(2000)
  .refine((v) => {
    const u = new URL(v);
    return u.protocol === 'https:' && !u.username && !u.password;
  }, 'Usa una URL HTTPS sin credenciales.');
const imageUrl = z
  .string()
  .max(2000)
  .refine(
    (v) =>
      /^\/api\/media\/[a-zA-Z0-9_-]+$/.test(v) ||
      /^\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:avif|jpe?g|png|webp)$/i.test(
        v,
      ) ||
      v.startsWith('https://'),
    'Selecciona una imagen HTTPS o un archivo local de /images.',
  );
const ids = z.array(identifier).max(100);
const seo = z.object({
  title: short,
  description: z.string().max(500),
  noindex: z.boolean(),
  imageId: z.string().max(100).optional(),
  canonical: z.union([z.literal(''), safeHttps]).optional(),
});
export const priceSchema = z
  .object({
    mode: z.enum(['consult', 'fixed', 'from']),
    amount: z.number().min(0).max(10000000).nullable(),
    currency: z.literal('PEN'),
    unit: z.enum(['person', 'event', 'unit']),
    minimum: z.number().int().min(1).max(100000).nullable(),
    conditions: para,
  })
  .superRefine((p, c) => {
    if (p.mode !== 'consult' && p.amount === null)
      c.addIssue({
        code: 'custom',
        message: 'Indica un importe para un precio fijo o desde.',
      });
  });
const quoteOptionValueSchema = z.object({
  id: identifier,
  label: z.string().min(1).max(80),
});
const quoteOptionSchema = z
  .object({
    id: identifier,
    label: z.string().min(1).max(80),
    required: z.boolean(),
    values: z.array(quoteOptionValueSchema).min(1).max(20),
  })
  .superRefine((option, context) => {
    if (
      new Set(option.values.map((value) => value.id)).size !==
      option.values.length
    )
      context.addIssue({
        code: 'custom',
        message: 'Los valores de una opción deben tener IDs únicos.',
      });
  });
const decimalPlaces = (value: number) => {
  const decimal = String(value).split('.')[1];
  return decimal ? decimal.length : 0;
};
const quoteConfigSchema = z
  .object({
    quantityUnit: z.enum(['person', 'unit', 'event', 'hour']),
    minimum: z.number().positive(),
    maximum: z.number().positive(),
    step: z.number().positive(),
    dateRequired: z.boolean(),
    districtRequired: z.boolean(),
    guestsRequired: z.boolean(),
    options: z.array(quoteOptionSchema).max(8),
  })
  .superRefine((config, context) => {
    if (config.maximum < config.minimum)
      context.addIssue({
        code: 'custom',
        message: 'El máximo debe ser igual o mayor que el mínimo.',
      });
    if (
      Math.max(
        decimalPlaces(config.minimum),
        decimalPlaces(config.maximum),
        decimalPlaces(config.step),
      ) > 6
    )
      context.addIssue({
        code: 'custom',
        message: 'Las cantidades admiten hasta seis decimales.',
      });
    else {
      const scale =
        10 **
        Math.max(
          decimalPlaces(config.minimum),
          decimalPlaces(config.maximum),
          decimalPlaces(config.step),
        );
      const increment = Math.round(config.step * scale);
      if (
        increment &&
        Math.round((config.maximum - config.minimum) * scale) % increment
      )
        context.addIssue({
          code: 'custom',
          message: 'El rango debe respetar el incremento configurado.',
        });
    }
    if (
      new Set(config.options.map((option) => option.id)).size !==
      config.options.length
    )
      context.addIssue({
        code: 'custom',
        message: 'Los grupos de opciones deben tener IDs únicos.',
      });
  });
const recommendationSchema = z.object({
  entryId: identifier,
  priority: z.number().int().min(0).max(100000),
  eventTypeIds: ids,
  reason: z.string().max(300),
});
const entryFaqItemSchema = z.object({
  id: identifier,
  question: short,
  answer: para,
});
const entryProcessStepSchema = z.object({
  title: short,
  description: para,
});
const externalCatalogSchema = z
  .object({ url: z.url().max(2048), label: short })
  .nullable()
  .superRefine((catalog, context) => {
    if (!catalog) return;
    try {
      const url = new URL(catalog.url);
      if (url.protocol !== 'https:' || url.username || url.password)
        context.addIssue({
          code: 'custom',
          message: 'El catálogo externo debe usar HTTPS sin credenciales.',
        });
    } catch {
      context.addIssue({
        code: 'custom',
        message: 'La URL de catálogo externo no es válida.',
      });
    }
  });
export const entrySchema = z.object({
  id: identifier,
  kind: z.enum(contentKinds),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: short.min(1),
  description: para,
  body: para,
  imageId: z.string().max(100),
  status: z.enum(['draft', 'published', 'archived']),
  sortOrder: z.number().int().min(0).max(100000),
  featured: z.boolean(),
  details: z.array(short).max(100),
  seo,
  category: short,
  imageIds: ids,
  dishIds: ids,
  menuIds: ids,
  serviceIds: ids,
  modalityIds: ids,
  addOnIds: ids,
  eventTypeIds: ids,
  coverageIds: ids,
  excluded: z.array(short).max(100),
  price: priceSchema,
  minimumGuests: z.number().int().min(1).max(100000).nullable(),
  dietary: z.array(short).max(30),
  dietaryConfirmed: z.boolean(),
  district: short,
  eventDate: z.string().max(30),
  guestCount: z.number().int().min(1).max(100000).nullable(),
  attribution: short,
  verified: z.boolean(),
  provider: z.enum(['', 'own', 'partner']),
  requestable: z.boolean(),
  ownerId: z.enum(businessOwnerIds).nullable(),
  prominence: z.enum(['primary', 'secondary']),
  quoteConfig: quoteConfigSchema.nullable(),
  recommendations: z.array(recommendationSchema).max(30),
  faqItems: z.array(entryFaqItemSchema).max(20),
  processSteps: z.array(entryProcessStepSchema).max(12),
  externalCatalog: externalCatalogSchema,
  createdAt: z.string().max(50),
  updatedAt: z.string().max(50),
});
const copySchema = z.object({
  location: short,
  primaryCta: short,
  secondaryCta: short,
  viewAll: short,
  inquire: short,
  footerHeading: short,
  emptyTitle: short,
  emptyDescription: para,
  galleryTitle: short,
  includedTitle: short,
  excludedTitle: short,
  relatedTitle: short,
  coverageTitle: short,
  quoteTitle: short,
  quoteDescription: para,
  quoteAsideTitle: short,
  quoteAsideDescription: para,
  consent: para.min(1),
  privacyTitle: short,
  privacyBody: para.min(1),
  successTitle: short,
  successDescription: para,
  demoNotice: short,
});
export const siteSchema = z
  .object({
    version: z.number().int().nonnegative(),
    settings: z.object({
      name: short.min(1),
      tagline: para,
      whatsapp: z.string().regex(/^(|[1-9][0-9]{7,14})$/),
      whatsappMessage: para,
      email: z.union([z.literal(''), z.email()]),
      origin: z.union([
        z.literal(''),
        safeHttps.refine((v) => {
          const u = new URL(v);
          return u.pathname === '/' && !u.search && !u.hash;
        }, 'El dominio no debe incluir rutas.'),
      ]),
      indexable: z.boolean(),
      demo: z.boolean(),
      seo,
      navigation: z
        .array(
          z.object({
            label: short.min(1),
            href: z.union([path, z.literal('/#como-cotizar')]),
          }),
        )
        .max(20),
      footer: para,
      logoId: z.string().max(100),
      palette: z.enum(['olive', 'terracotta', 'cacao']),
      typography: z.enum(['editorial', 'classic']),
      animations: z.boolean(),
      motionLevel: z.enum(['subtle', 'off']),
      catalogs: z.record(
        z.enum(contentKinds),
        z.object({ title: short, description: para, seo }),
      ),
      copy: copySchema,
      businessVerified: z.boolean(),
      publicAddress: short,
      hours: para,
      socialLinks: z.array(z.object({ label: short, url: safeHttps })).max(10),
      analyticsConsentText: para,
    }),
    entries: z.array(entrySchema).max(5000),
    media: z
      .array(
        z.object({
          id: identifier,
          url: imageUrl,
          alt: short,
          caption: para,
          demo: z.boolean(),
          width: z.number().int().min(1).max(30000).optional(),
          height: z.number().int().min(1).max(30000).optional(),
          bytes: z.number().int().nonnegative().optional(),
          variants: z
            .array(
              z.object({
                url: imageUrl,
                width: z.number().int().positive(),
                height: z.number().int().positive(),
                bytes: z.number().int().nonnegative(),
              }),
            )
            .max(5)
            .optional(),
          focalX: z.number().min(0).max(100).optional(),
          focalY: z.number().min(0).max(100).optional(),
          tags: z.array(short).max(20).optional(),
          createdAt: z.string().max(50).optional(),
        }),
      )
      .max(5000),
    sections: z
      .array(
        z.object({
          id: identifier,
          type: z.enum([
            'hero',
            'servicios',
            'menus',
            'texto',
            'faq',
            'cta',
            'galeria',
            'modalidades',
            'complementos',
            'testimonios',
            'pasos',
            'cobertura',
            'eventos',
            'tipos-evento',
          ]),
          title: short,
          description: para,
          imageId: z.string().max(100),
          visible: z.boolean(),
          sortOrder: z.number().int().min(0).max(100000),
          eyebrow: short.optional(),
          entryIds: ids.optional(),
          imageIds: ids.optional(),
          primaryLabel: short.optional(),
          primaryHref: z.union([z.literal(''), path]).optional(),
          secondaryLabel: short.optional(),
          secondaryHref: z.union([z.literal(''), path]).optional(),
          variant: z.enum(['standard', 'alternate']).optional(),
          steps: z
            .array(z.object({ title: short, description: para }))
            .max(12)
            .optional(),
        }),
      )
      .max(80),
    faqs: z
      .array(
        z.object({
          id: identifier,
          question: short.min(1),
          answer: para.min(1),
        }),
      )
      .max(300),
  })
  .superRefine((s, c) => {
    const fail = (message: string) => c.addIssue({ code: 'custom', message });
    const all = [...s.entries, ...s.media, ...s.sections, ...s.faqs];
    if (new Set(all.map((x) => x.id)).size !== all.length)
      fail('Los identificadores deben ser únicos en todo el sitio.');
    if (
      new Set(s.entries.map((e) => e.kind + '/' + e.slug)).size !==
      s.entries.length
    )
      fail('Dos contenidos tienen la misma URL.');
    const media = new Set(s.media.map((m) => m.id)),
      records = new Map(s.entries.map((e) => [e.id, e]));
    const checkImage = (id: string | undefined) => {
      if (id && !media.has(id)) fail('Una imagen referenciada ya no existe.');
    };
    checkImage(s.settings.logoId);
    checkImage(s.settings.seo.imageId);
    for (const [kind, catalog] of Object.entries(s.settings.catalogs)) {
      checkImage(catalog.seo.imageId);
      if (
        catalog.seo.canonical &&
        s.settings.origin &&
        new URL(catalog.seo.canonical).origin !==
          new URL(s.settings.origin).origin
      )
        fail('La URL canónica debe pertenecer al dominio configurado: ' + kind);
    }
    for (const e of s.entries) {
      checkImage(e.imageId);
      checkImage(e.seo.imageId);
      e.imageIds.forEach(checkImage);
      for (const [field, kind] of Object.entries({
        dishIds: 'platos',
        menuIds: 'menus',
        serviceIds: 'servicios',
        modalityIds: 'modalidades',
        addOnIds: 'complementos',
        eventTypeIds: 'tipos-evento',
        coverageIds: 'cobertura',
      })) {
        for (const id of e[field as 'dishIds']) {
          if (records.get(id)?.kind !== kind)
            fail(`La relación ${field} de ${e.title} no es válida.`);
        }
      }
      if (
        e.seo.canonical &&
        s.settings.origin &&
        new URL(e.seo.canonical).origin !== new URL(s.settings.origin).origin
      )
        fail('La URL canónica debe pertenecer al dominio configurado.');
      if (e.status === 'published' && !s.settings.demo) {
        if (!e.description.trim())
          fail(`Completa la descripción de ${e.title}.`);
        if (e.kind === 'testimonios' && !e.verified)
          fail('Confirma la autorización del testimonio antes de publicarlo.');
      }
      if (e.requestable && !e.ownerId)
        fail(`Una oferta cotizable necesita responsable: ${e.title}.`);
      if (e.requestable && !e.quoteConfig)
        fail(`Una oferta cotizable necesita reglas completas: ${e.title}.`);
      for (const recommendation of e.recommendations) {
        if (!records.has(recommendation.entryId))
          fail(
            `Una recomendación de ${e.title} apunta a contenido inexistente.`,
          );
        if (recommendation.entryId === e.id)
          fail(`Una recomendación no puede apuntar a sí misma: ${e.title}.`);
        for (const eventTypeId of recommendation.eventTypeIds)
          if (records.get(eventTypeId)?.kind !== 'tipos-evento')
            fail(
              `Una recomendación de ${e.title} usa un tipo de evento inválido.`,
            );
      }
    }
    for (const b of s.sections) {
      checkImage(b.imageId);
      b.imageIds?.forEach(checkImage);
      for (const id of b.entryIds || [])
        if (!records.has(id))
          fail('Una sección referencia un contenido inexistente.');
    }
    if (s.sections.filter((b) => b.type === 'hero' && b.visible).length !== 1)
      fail('Debe existir exactamente una portada visible.');
    if (
      s.settings.indexable &&
      (!s.settings.origin || s.settings.demo || !s.settings.businessVerified)
    )
      fail(
        'Antes de indexar confirma el dominio y los datos reales del negocio, y desactiva la demostración.',
      );
    if (s.settings.indexable) {
      const used = new Set([
        s.settings.logoId,
        ...s.entries
          .filter((e) => e.status === 'published')
          .flatMap((e) => [e.imageId, ...e.imageIds, e.seo.imageId || '']),
        ...s.sections
          .filter((b) => b.visible)
          .flatMap((b) => [b.imageId, ...(b.imageIds || [])]),
      ]);
      if (s.media.some((m) => used.has(m.id) && (m.demo || !m.alt.trim())))
        fail(
          'Reemplaza las imágenes de muestra utilizadas y completa su texto alternativo antes de indexar.',
        );
    }
  });
