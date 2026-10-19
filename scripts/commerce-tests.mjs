import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);

async function moduleUrl(path, replacements = []) {
  let source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  for (const [from, to] of replacements) source = source.replace(from, to);
  return (
    'data:text/javascript;base64,' +
    Buffer.from(
      ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
        },
      }).outputText,
    ).toString('base64')
  );
}

const contactsUrl = await moduleUrl('config/business-contacts.ts');
const commerceUrl = await moduleUrl('lib/business-contacts.ts', [
  ["from '../config/business-contacts'", `from ${JSON.stringify(contactsUrl)}`],
]);
const commerce = await import(commerceUrl);
const contentUrl = await moduleUrl('models/content.ts');
const defaultsUrl = await moduleUrl('data/defaults.ts', [
  ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
]);
const defaults = await import(defaultsUrl);
const occasionEntriesUrl = await moduleUrl('data/occasion-entries.ts', [
  ["from './defaults'", `from ${JSON.stringify(defaultsUrl)}`],
]);
const commercialExpansionUrl = await moduleUrl('data/commercial-expansion.ts', [
  ["from './defaults'", `from ${JSON.stringify(defaultsUrl)}`],
]);
const demo = await import(
  await moduleUrl('data/demo.ts', [
    [
      "import designImages from './design-images.json';",
      `const designImages = ${await readFile(new URL('../data/design-images.json', import.meta.url), 'utf8')};`,
    ],
    ["from './defaults'", `from ${JSON.stringify(defaultsUrl)}`],
    ["from './occasion-entries'", `from ${JSON.stringify(occasionEntriesUrl)}`],
    ["from './commercial-expansion'", `from ${JSON.stringify(commercialExpansionUrl)}`],
    ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
  ])
);
const validation = await import(
  await moduleUrl('lib/validation.ts', [
    [
      "from 'zod'",
      `from ${JSON.stringify(pathToFileURL(require.resolve('zod')).href)}`,
    ],
    [
      "from '@/config/business-contacts'",
      `from ${JSON.stringify(contactsUrl)}`,
    ],
    ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
  ])
);
const quoteValidationUrl = await moduleUrl('lib/quote-validation.ts', [
  [
    "from 'zod'",
    `from ${JSON.stringify(pathToFileURL(require.resolve('zod')).href)}`,
  ],
]);
const attributionUrl = await moduleUrl('lib/attribution.ts');
const whatsapp = await import(await moduleUrl('lib/whatsapp-message.ts'));
const seo = await import(
  await moduleUrl('lib/seo.ts', [
    ["from '@/lib/business-contacts'", `from ${JSON.stringify(commerceUrl)}`],
    ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
  ])
);
const quoteV2 = await import(
  await moduleUrl('lib/quote-v2-validation.ts', [
    [
      "from 'zod'",
      `from ${JSON.stringify(pathToFileURL(require.resolve('zod')).href)}`,
    ],
    [
      "from '@/lib/quote-validation'",
      `from ${JSON.stringify(quoteValidationUrl)}`,
    ],
    ["from '@/lib/attribution'", `from ${JSON.stringify(attributionUrl)}`],
  ])
);
const quoteResolver = await import(
  await moduleUrl('lib/resolve-quote.ts', [
    ["from '@/lib/business-contacts'", `from ${JSON.stringify(commerceUrl)}`],
    ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
  ])
);
const quoteCart = await import(await moduleUrl('lib/quote-cart.ts'));
const attribution = await import(attributionUrl);
const recommendations = await import(
  await moduleUrl('lib/recommendations.ts', [
    ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
  ])
);
const { diagnoseCatalog } = await import('./catalog-readiness.mjs');

const parsedCommercialCatalog = validation.siteSchema.safeParse(
  demo.demoContent,
);
assert.equal(
  parsedCommercialCatalog.success,
  true,
  parsedCommercialCatalog.success
    ? ''
    : parsedCommercialCatalog.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; '),
);
assert.deepEqual(
  diagnoseCatalog(demo.demoContent),
  [],
  'el catálogo comercial no debe tener reglas ni responsables incompletos',
);

assert.deepEqual(commerce.resolveBusinessContact('eventos'), {
  ownerId: 'eventos',
  label: 'Servicios y producción para eventos',
  available: true,
});
assert.deepEqual(commerce.resolveBusinessContact('cocina'), {
  ownerId: 'cocina',
  label: 'Cocina, alimentación, bar y menaje',
  available: true,
});
assert.deepEqual(commerce.resolveBusinessContact(null), {
  ownerId: null,
  label: null,
  available: false,
});
assert.deepEqual(commerce.resolveBusinessContact('desconocido'), {
  ownerId: null,
  label: null,
  available: false,
});
assert.equal(commerce.resolveWhatsAppDestination('cocina'), '51923106197');
assert.equal(commerce.resolveWhatsAppDestination('eventos'), '51902843481');
assert.equal(commerce.isValidWhatsAppNumber('51999111222'), true);
assert.equal(commerce.isValidWhatsAppNumber('+51999111222'), false);
assert.equal(commerce.isValidWhatsAppNumber('51999 111222'), false);
assert.equal(commerce.isValidWhatsAppNumber('5199911122'), true);

const fixture = {
  cocina: { label: 'Cocina de prueba', whatsapp: '51991112223', enabled: true },
  eventos: {
    label: 'Eventos de prueba',
    whatsapp: '51994445556',
    enabled: true,
  },
};
assert.equal(
  commerce.resolveWhatsAppDestination('eventos', fixture),
  '51994445556',
  'la configuración inyectada debe reflejar el número nuevo',
);
assert.deepEqual(commerce.resolveBusinessContact('eventos', fixture), {
  ownerId: 'eventos',
  label: 'Eventos de prueba',
  available: true,
});
assert.equal(
  commerce.resolveWhatsAppDestination('eventos', {
    ...fixture,
    eventos: { ...fixture.eventos, whatsapp: 'inválido' },
  }),
  null,
  'un teléfono inválido nunca genera destino',
);
assert.equal(
  commerce.resolveWhatsAppDestination('eventos', {
    ...fixture,
    eventos: { ...fixture.eventos, enabled: false },
  }),
  null,
  'un contacto inactivo nunca genera destino',
);

const legacy = {
  version: 3,
  settings: { name: 'Sitio existente' },
  entries: [
    {
      id: 'informacion',
      kind: 'paginas',
      slug: 'informacion',
      title: 'Información existente',
      description: 'Contenido previo',
    },
  ],
};
const normalizedLegacy = defaults.normalizeSite(legacy);
assert.equal(normalizedLegacy.entries[0].requestable, false);
assert.equal(normalizedLegacy.entries[0].ownerId, null);
assert.equal(normalizedLegacy.entries[0].quoteConfig, null);
assert.deepEqual(normalizedLegacy.entries[0].faqItems, []);
assert.deepEqual(normalizedLegacy.entries[0].processSteps, []);
assert.equal(normalizedLegacy.entries[0].externalCatalog, null);
assert.equal(normalizedLegacy.entries[0].title, 'Información existente');

const quoteConfig = {
  quantityUnit: 'person',
  minimum: 10,
  maximum: 50,
  step: 5,
  dateRequired: true,
  districtRequired: true,
  guestsRequired: true,
  options: [
    {
      id: 'servicio',
      label: 'Servicio',
      required: true,
      values: [{ id: 'buffet', label: 'Buffet' }],
    },
  ],
};
const quoteEntry = {
  ...defaults.emptyEntry(),
  id: 'oferta-confirmada',
  kind: 'servicios',
  slug: 'oferta-confirmada',
  title: 'Oferta confirmada',
  description: 'Oferta de prueba',
  body: 'Oferta de prueba',
  availability: 'active',
  requestable: true,
  ownerId: 'cocina',
  prominence: 'primary',
  quoteConfig,
  provider: 'partner',
};
assert.equal(validation.entrySchema.safeParse(quoteEntry).success, true);
assert.equal(
  validation.entrySchema.safeParse({
    ...quoteEntry,
    faqItems: [
      {
        id: 'faq-servicio',
        question: '¿Cómo coordinamos?',
        answer: 'Confirmamos los detalles antes del evento.',
      },
    ],
    processSteps: [
      {
        title: 'Cuéntanos tu idea',
        description: 'Revisamos fecha y necesidades.',
      },
    ],
    externalCatalog: {
      url: 'https://catalogo.example.test/propuestas',
      label: 'Ver catálogo externo',
    },
  }).success,
  true,
  'los datos editoriales opcionales válidos se aceptan',
);
assert.equal(
  validation.entrySchema.safeParse({
    ...quoteEntry,
    externalCatalog: {
      url: 'http://catalogo.example.test',
      label: 'No seguro',
    },
  }).success,
  false,
  'el catálogo externo exige HTTPS',
);
assert.equal(
  validation.entrySchema.safeParse({
    ...quoteEntry,
    externalCatalog: {
      url: 'https://usuario:clave@catalogo.example.test',
      label: 'Con credenciales',
    },
  }).success,
  false,
  'el catálogo externo no admite credenciales en la URL',
);
assert.equal(
  validation.entrySchema.safeParse({
    ...quoteEntry,
    quoteConfig: { ...quoteConfig, maximum: 51 },
  }).success,
  false,
  'el rango debe respetar el incremento',
);
const siteWith = (entry) =>
  defaults.normalizeSite({
    version: 1,
    settings: defaults.defaultSettings,
    entries: [entry],
    sections: [
      {
        id: 'portada',
        type: 'hero',
        title: 'Portada',
        description: '',
        imageId: '',
        visible: true,
        sortOrder: 0,
      },
    ],
  });
assert.equal(
  validation.siteSchema.safeParse(siteWith(quoteEntry)).success,
  true,
);
assert.equal(
  validation.siteSchema.safeParse(siteWith({ ...quoteEntry, ownerId: null }))
    .success,
  false,
  'una oferta cotizable sin propietario debe fallar',
);
const coverageEntry = {
  ...defaults.emptyEntry(),
  id: 'lima-confirmada',
  kind: 'cobertura',
  slug: 'lima-confirmada',
  title: 'Cobertura confirmada',
  description: 'Zona confirmada por los datos de prueba.',
  body: 'Zona confirmada por los datos de prueba.',
  status: 'published',
  availability: 'active',
};
const siteWithEntries = (entries) =>
  defaults.normalizeSite({
    version: 1,
    settings: defaults.defaultSettings,
    entries,
    sections: [
      {
        id: 'portada',
        type: 'hero',
        title: 'Portada',
        description: '',
        imageId: '',
        visible: true,
        sortOrder: 0,
      },
    ],
  });
assert.equal(
  validation.siteSchema.safeParse(
    siteWithEntries([
      { ...quoteEntry, coverageIds: ['lima-confirmada'] },
      coverageEntry,
    ]),
  ).success,
  true,
  'la cobertura explícita debe apuntar a una entrada de cobertura',
);
assert.equal(
  validation.siteSchema.safeParse(
    siteWith({ ...quoteEntry, coverageIds: ['oferta-confirmada'] }),
  ).success,
  false,
  'una relación de cobertura hacia otra clase de contenido se rechaza',
);
assert.equal(
  validation.siteSchema.safeParse(
    siteWith({
      ...quoteEntry,
      recommendations: [
        { entryId: 'ausente', priority: 1, eventTypeIds: [], reason: '' },
      ],
    }),
  ).success,
  false,
  'referencias inválidas deben fallar',
);
assert.equal(
  diagnoseCatalog({
    entries: [
      {
        id: 'a',
        requestable: true,
        ownerId: null,
        quoteConfig: null,
        recommendations: [{ entryId: 'b', eventTypeIds: [] }],
      },
      {
        id: 'b',
        requestable: false,
        recommendations: [{ entryId: 'a', eventTypeIds: [] }],
      },
    ],
  }).some((issue) => issue.type === 'recommendation_cycle'),
  true,
  'el diagnóstico detecta ciclos sin recorrerlos al renderizar',
);

const requestId = '123e4567-e89b-42d3-a456-426614174000';
const itemId = '123e4567-e89b-42d3-a456-426614174001';
const v2 = {
  schemaVersion: 2,
  requestId,
  items: [{ itemId, entryId: 'buffet', quantity: 10, optionValues: {} }],
  primaryItemId: itemId,
  event: {
    typeId: null,
    typeOther: '',
    date: null,
    district: '',
    guests: null,
  },
  contact: { name: 'Cliente de prueba', phone: '999 111 222', email: '' },
  notes: '',
  consent: true,
  website: '',
  startedAt: 1,
  attribution: {
    schemaVersion: 1,
    landingPath: '/',
    acquisitionEntryId: null,
    lastTouchPath: '/cotizar',
    referrerHost: null,
    channel: 'direct_unknown',
    utm: {},
    ctaPlacement: 'quote_form',
    capturedAt: '2030-01-01T00:00:00.000Z',
  },
};
assert.equal(quoteV2.parseQuoteInput(v2).schemaVersion, 2);
assert.throws(
  () => quoteV2.parseQuoteInput({ ...v2, primaryItemId: requestId }),
  'principal inexistente',
);
assert.throws(
  () => quoteV2.parseQuoteInput({ ...v2, items: [v2.items[0], v2.items[0]] }),
  'UUID duplicado',
);
assert.throws(
  () =>
    quoteV2.parseQuoteInput({
      ...v2,
      items: Array.from({ length: 21 }, () => v2.items[0]),
    }),
  'máximo de líneas',
);
assert.throws(
  () =>
    quoteV2.parseQuoteInput({
      ...v2,
      items: [{ ...v2.items[0], quantity: Infinity }],
    }),
  'cantidad infinita',
);
assert.throws(
  () => quoteV2.parseQuoteInput({ ...v2, items: [{ ...v2.items[0], quantity: 0 }] }),
  'un borrador sin cantidad no puede convertirse en solicitud',
);
assert.throws(
  () => quoteV2.parseQuoteInput({ ...v2, recipientPhone: '51900000000' }),
  'autoridad ajena',
);
const v1 = {
  requestId,
  eventTypeId: '',
  eventTypeOther: 'Reunión',
  date: '2030-01-01',
  district: 'Lima',
  people: 10,
  selectionId: '',
  modalityId: '',
  addOnIds: [],
  budget: '',
  name: 'Cliente V1',
  phone: '999 111 222',
  email: '',
  notes: '',
  consent: true,
  website: '',
  startedAt: 1,
};
assert.equal(quoteV2.parseQuoteInput(v1).schemaVersion, 1);

const cartItemOne = '123e4567-e89b-42d3-a456-426614174010';
const cartItemTwo = '123e4567-e89b-42d3-a456-426614174011';
const cartItemThree = '123e4567-e89b-42d3-a456-426614174012';
let cart = quoteCart.emptyQuoteCart();
cart = quoteCart.quoteCartReducer(cart, {
  type: 'add',
  item: {
    itemId: cartItemOne,
    entryId: 'buffet',
    quantity: 2,
    optionValues: { turno: 'dia' },
  },
});
cart = quoteCart.quoteCartReducer(cart, {
  type: 'add',
  item: {
    itemId: cartItemTwo,
    entryId: 'buffet',
    quantity: 3,
    optionValues: { turno: 'dia' },
  },
});
assert.equal(cart.items.length, 1, 'misma oferta y opciones se fusionan');
assert.equal(cart.items[0].quantity, 5, 'la cantidad fusionada se conserva');
assert.equal(
  cart.primaryItemId,
  cartItemOne,
  'la primera línea puede ser principal',
);
cart = quoteCart.quoteCartReducer(cart, {
  type: 'add',
  item: {
    itemId: cartItemThree,
    entryId: 'buffet',
    quantity: 1,
    optionValues: { turno: 'noche' },
  },
});
assert.equal(cart.items.length, 2, 'variantes distintas permanecen separadas');
cart = quoteCart.quoteCartReducer(cart, {
  type: 'remove',
  itemId: cartItemOne,
});
assert.equal(
  cart.primaryItemId,
  null,
  'retirar principal no elige reemplazo automáticamente',
);
const serializedCart = quoteCart.serializeQuoteCart(cart, 1000);
assert.equal(
  quoteCart.restoreQuoteCart(serializedCart, 1001).cart.items.length,
  1,
);
let emptyQuantityDraft = quoteCart.quoteCartReducer(quoteCart.emptyQuoteCart(), {
  type: 'add',
  item: { itemId: cartItemOne, entryId: 'buffet', quantity: 0, optionValues: {} },
});
assert.equal(emptyQuantityDraft.items[0].quantity, 0, 'la cantidad sin escribir queda vacía');
emptyQuantityDraft = quoteCart.quoteCartReducer(emptyQuantityDraft, {
  type: 'update', itemId: cartItemOne, quantity: 50, optionValues: {},
});
emptyQuantityDraft = quoteCart.quoteCartReducer(emptyQuantityDraft, {
  type: 'update', itemId: cartItemOne, quantity: 0, optionValues: {},
});
assert.equal(emptyQuantityDraft.items[0].quantity, 0, 'el campo puede borrarse de nuevo');
assert.equal(quoteV2.cartV2Schema.safeParse(emptyQuantityDraft).success, true);
assert.equal(
  quoteCart.restoreQuoteCart(quoteCart.serializeQuoteCart(emptyQuantityDraft, 1000), 1001).cart.items[0].quantity,
  0,
  'el borrador vacío se conserva al navegar',
);
assert.equal(
  quoteCart.restoreQuoteCart('{inválido', 1001).discarded,
  true,
  'JSON corrupto se descarta',
);
assert.equal(
  quoteCart.restoreQuoteCart(serializedCart, 1000 + 86400001).discarded,
  true,
  'bolsa vencida se descarta',
);
const migratedLegacy = quoteCart.adaptLegacyQuoteDraft(
  JSON.stringify({
    savedAt: 1000,
    data: {
      selectionId: 'buffet',
      addOnIds: ['sillas', 'no-valido'],
      name: 'No guardar',
      phone: '999 111 222',
      email: 'no@guardar.test',
    },
  }),
  new Set(['buffet', 'sillas']),
  (() => {
    let next = 20;
    return () => `123e4567-e89b-42d3-a456-4266141740${next++}`;
  })(),
  1001,
);
assert.equal(
  migratedLegacy.cart.items.length,
  2,
  'el adaptador conserva sólo IDs válidos',
);
assert.equal(
  migratedLegacy.discarded,
  true,
  'el adaptador informa descarte parcial',
);
assert.ok(
  !JSON.stringify(migratedLegacy.cart).includes('No guardar'),
  'la bolsa no migra PII del borrador legado',
);

const firstTouch = attribution.createAttribution(
  {
    pathname: '/servicios/sillas',
    search: '?utm_source=instagram&utm_medium=social&utm_campaign=primavera',
    referrer: 'https://www.instagram.com/catering',
  },
  new Date('2030-01-01T00:00:00.000Z'),
);
assert.equal(firstTouch.landingPath, '/servicios/sillas');
assert.equal(
  firstTouch.acquisitionEntryId,
  null,
  'visitar una ficha no inventa intención',
);
assert.equal(firstTouch.channel, 'social');
const chairCta = attribution.createCtaContext(
  firstTouch,
  'sillas',
  'service_detail',
  '/servicios/sillas',
  new Date('2030-01-01T00:01:00.000Z'),
);
const buffetCta = attribution.createCtaContext(
  chairCta,
  'buffet',
  'catalog_card',
  '/servicios/buffet',
  new Date('2030-01-01T00:02:00.000Z'),
);
assert.equal(
  buffetCta.acquisitionEntryId,
  'sillas',
  'el primer CTA se conserva aunque cambie el principal',
);
assert.equal(buffetCta.lastTouchPath, '/servicios/buffet');
assert.equal(buffetCta.ctaPlacement, 'catalog_card');
assert.equal(
  attribution.createAttribution({ pathname: '/', search: '', referrer: '' })
    .channel,
  'direct_unknown',
);
assert.deepEqual(
  attribution.sanitizeUtm(
    '?utm_source=https://evil.test&utm_medium=999%20111%20222&utm_campaign=correo%40test.com',
  ),
  {},
  'UTM con URL, teléfono o correo se omite',
);
assert.equal(
  attribution.restoreAttribution('{roto'),
  null,
  'atribución corrupta no impide recuperar la sesión',
);
const whatsappMessage = whatsapp.createWhatsAppMessage({
  introduction: 'Hola & gracias',
  eventType: 'Boda',
  date: '2030-02-01',
  district: 'Lima',
  guests: 30,
  primary: 'Buffet criollo',
  extras: ['Sillas'],
  budget: 'S/ 500',
});
assert.ok(whatsappMessage.includes('Oferta principal: Buffet criollo'));
assert.ok(
  !whatsappMessage.includes('Teléfono:'),
  'el mensaje no incluye datos de contacto',
);
assert.equal(
  whatsapp.createWhatsAppUrl('51994445556', whatsappMessage),
  `https://wa.me/51994445556?text=${encodeURIComponent(whatsappMessage)}`,
  'la URL conserva caracteres españoles y ampersand codificados',
);
assert.equal(
  whatsapp.createWhatsAppUrl(null, whatsappMessage),
  null,
  'sin número no hay fallback',
);
assert.deepEqual(
  seo.catalogUrlPolicy('servicios', { pagina: '2', utm_source: 'instagram' }),
  {
    page: 2,
    pageParamPresent: true,
    noindex: false,
    canonicalPath: '/servicios?pagina=2',
  },
  'UTM no altera la canónica ni la indexación de una página válida',
);
assert.deepEqual(
  seo.catalogUrlPolicy('servicios', { q: 'buffet', utm_source: 'instagram' }),
  {
    page: 1,
    pageParamPresent: false,
    noindex: true,
    canonicalPath: '/servicios',
  },
  'los filtros son noindex y no contaminan la canónica',
);
assert.equal(
  seo.catalogUrlPolicy('servicios', { pagina: '1' }).canonicalPath,
  '/servicios',
);
const structuredBusiness = seo.businessData(
  defaults.normalizeSite({
    version: 1,
    settings: {
      ...defaults.defaultSettings,
      origin: 'https://ejemplo.test',
      demo: false,
      indexable: true,
      businessVerified: true,
      publicAddress: 'Dirección confirmada',
      whatsapp: '51902843481',
    },
    entries: [],
    sections: [],
    media: [],
    faqs: [],
  }),
);
assert.ok(
  structuredBusiness && !('telephone' in structuredBusiness),
  'el esquema omite teléfono legado sin contacto principal confirmado',
);
assert.equal(structuredBusiness['@type'], 'LocalBusiness');
assert.deepEqual(structuredBusiness.address, {
  '@type': 'PostalAddress',
  streetAddress: 'Dirección confirmada',
});
const structuredOrganization = seo.businessData(demo.demoContent);
assert.equal(structuredOrganization['@type'], 'Organization');
assert.equal(
  'address' in structuredOrganization,
  false,
  'sin dirección pública no se inventa local',
);
assert.equal(
  'telephone' in structuredOrganization,
  false,
  'no se inventa un teléfono principal',
);
assert.deepEqual(structuredOrganization.areaServed, [
  { '@type': 'AdministrativeArea', name: 'Lima Metropolitana' },
]);
assert.deepEqual(
  structuredOrganization.contactPoint
    .map((contact) => contact.telephone)
    .sort(),
  ['+51902843481', '+51923106197'],
  'los contactos del esquema usan la misma configuración comercial que WhatsApp',
);
for (const settings of [
  { demo: true },
  { businessVerified: false },
  { origin: '' },
  { origin: 'no-es-una-url' },
  { origin: 'javascript:alert(1)' },
  { name: ' ' },
]) {
  assert.equal(
    seo.businessData({
      ...demo.demoContent,
      settings: { ...demo.demoContent.settings, ...settings },
    }),
    null,
    'una identidad no confirmada o un origen inválido no genera datos comerciales',
  );
}
const limitedPublicSite = {
  ...demo.demoContent,
  entries: demo.demoContent.entries.map((entry) => ({
    ...entry,
    status:
      entry.kind === 'cobertura' || entry.ownerId === 'eventos'
        ? 'draft'
        : entry.status,
  })),
  media: demo.demoContent.media.map((media) => ({ ...media, demo: true })),
};
const limitedOrganization = seo.businessData(limitedPublicSite);
assert.equal(
  'areaServed' in limitedOrganization,
  false,
  'la cobertura en borrador no se publica en schema',
);
assert.equal(
  'logo' in limitedOrganization,
  false,
  'un logo demo no se presenta como identidad comercial',
);
assert.deepEqual(
  limitedOrganization.contactPoint.map((contact) => contact.telephone),
  ['+51923106197'],
  'no se anuncian contactos de ofertas que dejaron de estar publicadas',
);

const resolverConfig = {
  ...quoteConfig,
  minimum: 1,
  maximum: 200,
  step: 1,
  dateRequired: false,
  districtRequired: false,
  guestsRequired: false,
  options: [],
};
const offering = (id, title, ownerId) => ({
  ...defaults.emptyEntry(),
  id,
  kind: 'servicios',
  slug: id,
  title,
  description: title,
  body: title,
  status: 'published',
  availability: 'active',
  requestable: true,
  ownerId,
  quoteConfig: resolverConfig,
});
const buffet = offering('buffet', 'Buffet', 'cocina');
const chairs = offering('sillas', 'Sillas', 'eventos');
const bartender = offering('bartender', 'Bartender', 'cocina');
const gifts = offering('regalos', 'Regalos', 'eventos');
const recommendationEntries = [
  {
    ...bartender,
    recommendations: [
      {
        entryId: 'regalos',
        priority: 2,
        eventTypeIds: [],
        reason: 'Para cerrar el servicio.',
      },
      {
        entryId: 'sillas',
        priority: 1,
        eventTypeIds: ['boda'],
        reason: 'Para la ceremonia.',
      },
      {
        entryId: 'regalos',
        priority: 3,
        eventTypeIds: [],
        reason: 'Duplicado que no debe aparecer.',
      },
    ],
  },
  {
    ...gifts,
    recommendations: [
      {
        entryId: 'bartender',
        priority: 1,
        eventTypeIds: [],
        reason: 'Ciclo explícito.',
      },
    ],
  },
  chairs,
];
const suggestedForBartender = recommendations.resolveRecommendations({
  sourceEntryId: 'bartender',
  entries: recommendationEntries,
  eventTypeId: 'boda',
});
assert.deepEqual(
  suggestedForBartender.map(({ entry }) => entry.id),
  ['sillas', 'regalos'],
  'prioridad, contexto y duplicados se resuelven sólo desde relaciones explícitas',
);
assert.deepEqual(
  recommendations
    .resolveRecommendations({
      sourceEntryId: 'bartender',
      entries: recommendationEntries,
      presentEntryIds: ['regalos'],
      eventTypeId: 'otro',
    })
    .map(({ entry }) => entry.id),
  [],
  'no se recomiendan líneas ya presentes ni relaciones de otro contexto',
);
assert.deepEqual(
  recommendations.resolveRecommendations({
    sourceEntryId: 'regalos',
    entries: recommendationEntries,
  }),
  [
    {
      entry: recommendationEntries[0],
      reason: 'Ciclo explícito.',
      priority: 1,
    },
  ],
  'un ciclo no se recorre ni duplica recomendaciones',
);
const resolve = (primaryItemId, items) =>
  quoteResolver.resolveQuote(
    { ...v2, items, primaryItemId },
    [buffet, chairs, bartender, gifts],
    fixture,
  );
const line = (itemId, entryId, quantity) => ({
  itemId,
  entryId,
  quantity,
  optionValues: {},
});
const secondItemId = '123e4567-e89b-42d3-a456-426614174002';
assert.equal(
  resolve(itemId, [
    line(itemId, 'buffet', 10),
    line(secondItemId, 'sillas', 100),
  ]).value.recipient.ownerId,
  'cocina',
);
assert.equal(
  resolve(itemId, [
    line(itemId, 'sillas', 100),
    line(secondItemId, 'buffet', 10),
  ]).value.recipient.ownerId,
  'eventos',
);
assert.equal(
  resolve(itemId, [
    line(itemId, 'bartender', 1),
    line(secondItemId, 'regalos', 1),
  ]).value.recipient.ownerId,
  'cocina',
);
assert.equal(
  resolve(itemId, [line(itemId, 'regalos', 1)]).value.recipient.ownerId,
  'eventos',
);
assert.equal(
  resolve(secondItemId, [
    line(itemId, 'sillas', 100),
    line(secondItemId, 'buffet', 10),
  ]).value.recipient.ownerId,
  'cocina',
  'cambiar explícitamente principal cambia destinatario',
);
assert.equal(
  quoteResolver.resolveQuote(
    { ...v2, items: [line(itemId, 'buffet', 1)], primaryItemId: itemId },
    [buffet],
    { ...fixture, cocina: { ...fixture.cocina, whatsapp: null } },
  ).value.recipient.available,
  false,
  'contacto conocido sin número no usa fallback',
);
assert.equal(
  quoteResolver.resolveQuote(
    { ...v2, items: [line(itemId, 'retirada', 1)], primaryItemId: itemId },
    [buffet],
    fixture,
  ).ok,
  false,
  'una oferta retirada marca error de línea',
);

console.log(
  'PASS: contactos comerciales, disponibilidad, formato y cambio de configuración sin navegación de WhatsApp.',
);

// Actual public catalog: all services must be independently quotable, with complete item descriptions.
const eventSelection = await import(await moduleUrl('lib/event-selection.ts'));
const actualEntries = demo.demoContent.entries.filter((e) => e.requestable);
assert.equal(actualEntries.length, 39);
assert.ok(!demo.demoContent.entries.some((entry) => entry.id === 'fotografia-video-eventos'), 'la cobertura de fotografía retirada no debe ofrecerse');
for (const entry of demo.demoContent.entries)
  for (const key of ['serviceIds', 'menuIds', 'addOnIds', 'recommendations'])
    assert.ok(!entry[key].some((item) => (typeof item === 'string' ? item : item.entryId) === 'fotografia-video-eventos'), `${entry.id}: referencia a fotografía retirada`);
const partnerEntries = actualEntries.filter((entry) => entry.availability === 'partner');
assert.equal(partnerEntries.length, 29);
const cocinaServiceIds = new Set([
  'buffet-para-eventos',
  'menu-criollo-eventos',
  'desayuno-corporativo',
  'bocaditos-piqueos-eventos',
  'brunch-box-eventos',
  'almuerzos-cenas-corporativas',
  'bar-bartender',
  'bebidas-barra-eventos',
  'menaje-evento',
]);
assert.equal(cocinaServiceIds.size, 9);
for (const entry of partnerEntries) {
  const claims = [
    entry.description,
    entry.body,
    ...entry.details,
    ...entry.faqItems.flatMap((item) => [item.question, item.answer]),
    ...entry.processSteps.flatMap((step) => [step.title, step.description]),
  ].join(' ');
  assert.doesNotMatch(
    claims,
    /\b(?:nuestros? equipos|nuestros? músicos|nuestros? animadores|stock permanente|disponibilidad garantizada|siempre disponible|precio fijo|precios fijos|garantizamos disponibilidad)\b/i,
    `${entry.id}: un servicio de aliado no debe prometer propiedad, stock, precio o disponibilidad`,
  );
  assert.match(
    claims,
    /(?:aliado|proveedor|según disponibilidad|sujeto a disponibilidad|se confirma|se confirman|cotización)/i,
    `${entry.id}: debe explicar que el alcance se coordina y confirma`,
  );
}
const occasionEntries = demo.demoContent.entries.filter(
  (entry) => entry.kind === 'tipos-evento',
);
assert.equal(occasionEntries.length, 18);
assert.equal(new Set(occasionEntries.map((entry) => entry.slug)).size, 18);
for (const occasion of occasionEntries) {
  assert.ok(occasion.seo.title.includes('Gladys'));
  assert.ok(
    occasion.serviceIds.length +
      occasion.menuIds.length +
      occasion.addOnIds.length >=
      4,
    `${occasion.id}: la página debe ofrecer varias opciones sin navegar a otro catálogo`,
  );
}
for (const entry of actualEntries) {
  const item = {
    itemId: 'single',
    entryId: entry.id,
    quantity: entry.quoteConfig.minimum,
    optionValues: Object.fromEntries(
      entry.quoteConfig.options.map((o) => [o.id, o.values[0].id]),
    ),
  };
  const cart = {
    schemaVersion: 2,
    items: [item],
    primaryItemId: 'single',
    updatedAt: Date.now(),
  };
  assert.deepEqual(eventSelection.selectionErrors(cart, actualEntries), []);
  const text = eventSelection.describeItem(item, entry);
  assert.ok(text.startsWith('1 '), 'no invented commercial minimum');
  for (const option of entry.quoteConfig.options)
    assert.ok(text.includes(option.values[0].label));
  assert.equal(
    commerce.resolveWhatsAppDestination(entry.ownerId),
    cocinaServiceIds.has(entry.id)
      ? '51923106197'
      : '51902843481',
  );
  assert.ok(
    eventSelection.selectionErrors(
      { ...cart, primaryItemId: null },
      actualEntries,
    ).length,
  );
  assert.ok(
    eventSelection.selectionErrors(
      { ...cart, items: [{ ...item, quantity: 0 }] },
      actualEntries,
    ).length,
  );
  assert.ok(
    eventSelection.selectionErrors(
      { ...cart, items: [{ ...item, quantity: 1.5 }] },
      actualEntries,
    ).length,
  );
  if (entry.quoteConfig.options.length)
    assert.ok(
      eventSelection.selectionErrors(
        { ...cart, items: [{ ...item, optionValues: {} }] },
        actualEntries,
      ).length,
    );
}
assert.equal(eventSelection.quantityLabel('unit', 1), '1 unidad');
assert.equal(eventSelection.quantityLabel('person', 30), '30 personas');
const fullMessage = whatsapp.createWhatsAppMessage({
  introduction: 'Hola',
  eventType: 'Boda',
  date: '2030-01-01',
  district: 'Lima',
  guests: 30,
  primary: 'Buffet',
  extras: ['Sillas'],
  budget: '',
  items: [
    'Principal: Buffet — 30 personas · Tipo de menú: Criollo',
    'Adicional: Sillas — 35 unidades',
  ],
  origin: 'Entrada: /servicios/buffet-para-eventos',
});
assert.ok(fullMessage.includes('30 personas · Tipo de menú: Criollo'));
assert.ok(fullMessage.includes('35 unidades'));
assert.ok(fullMessage.includes('Entrada: /servicios/buffet-para-eventos'));
assert.ok(fullMessage.includes('Detalles de los servicios:'));
assert.ok(!fullMessage.includes('Presupuesto orientativo: Por definir'));
assert.ok(!fullMessage.includes('Complementos: Ninguno seleccionado'));
assert.equal(
  whatsapp.createWhatsAppUrl('51902843481', 'x'.repeat(6001)),
  null,
  'never silently truncate selected options',
);
const { initialEnquiry } = await import(await moduleUrl('lib/initial-enquiry.ts', [
  ["from './business-contacts'", `from ${JSON.stringify(commerceUrl)}`],
  ["from './event-selection'", `from ${JSON.stringify(await moduleUrl('lib/event-selection.ts'))}`],
  ["from './whatsapp-message'", `from ${JSON.stringify(await moduleUrl('lib/whatsapp-message.ts'))}`],
]));
const enquiryEntries = actualEntries.map((entry) => ({
  ...entry,
  recipient: commerce.resolveBusinessContact(entry.ownerId),
  whatsappDestination: commerce.resolveWhatsAppDestination(entry.ownerId),
}));
const emptyEnquiryCart = quoteCart.emptyQuoteCart();
const { publicReviewsUrl } = await import(await moduleUrl('config/commercial-evidence.ts'));
assert.equal(publicReviewsUrl(''), null);
assert.equal(publicReviewsUrl('javascript:alert(1)'), null);
assert.equal(publicReviewsUrl('http://example.com/reviews'), null);
assert.equal(publicReviewsUrl('https://user:password@example.com/reviews'), null);
assert.equal(publicReviewsUrl('https://example.com/reviews'), 'https://example.com/reviews');
assert.equal(initialEnquiry({ entries: enquiryEntries, cart: emptyEnquiryCart, topic: '' }), null);
for (const entry of enquiryEntries) {
  const enquiry = initialEnquiry({ entries: enquiryEntries, cart: emptyEnquiryCart, topic: entry.id });
  assert.equal(enquiry.destination, entry.whatsappDestination);
  assert.ok(enquiry.message.includes(entry.title));
  assert.ok(enquiry.href.startsWith(`https://wa.me/${entry.whatsappDestination}?text=`));
}
assert.equal(initialEnquiry({ entries: enquiryEntries, cart: emptyEnquiryCart, topic: 'orientacion-cocina' }).destination, '51923106197');
assert.equal(initialEnquiry({ entries: enquiryEntries, cart: emptyEnquiryCart, topic: 'orientacion-eventos' }).destination, '51902843481');
const knownEventEnquiry = initialEnquiry({ entries: enquiryEntries, cart: emptyEnquiryCart, topic: 'orientacion-eventos', event: { occasion: 'Graduación', date: '2030-12-20', district: 'Lima', guests: '50', budget: 'Por coordinar' } });
for (const detail of ['Graduación', '2030-12-20', 'Lima', '50', 'Por coordinar']) assert.ok(knownEventEnquiry.message.includes(detail), 'una consulta inicial conserva los datos del evento ya conocidos');
const mixedEnquiry = {
  ...emptyEnquiryCart,
  items: [
    { itemId: 'food', entryId: 'buffet-para-eventos', quantity: 0, optionValues: {} },
    { itemId: 'music', entryId: 'dj-eventos', quantity: 1, optionValues: {} },
  ],
  primaryItemId: 'food',
};
const djEntry = enquiryEntries.find((entry) => entry.title === 'DJ para eventos');
assert.ok(djEntry);
mixedEnquiry.items[1].entryId = djEntry.id;
for (const [primaryItemId, destination] of [['food', '51923106197'], ['music', '51902843481']]) {
  const enquiry = initialEnquiry({ entries: enquiryEntries, cart: { ...mixedEnquiry, primaryItemId }, topic: 'orientacion-eventos', note: 'Cumpleaños en casa' });
  assert.equal(enquiry.destination, destination, 'el principal determina el equipo incluso en una consulta inicial');
  assert.ok(enquiry.message.includes('Buffet para todo tipo de eventos'));
  assert.ok(enquiry.message.includes('DJ para eventos'));
  assert.ok(enquiry.message.includes('Cantidad por definir'));
  assert.ok(enquiry.message.includes('Mi idea: Cumpleaños en casa'));
  assert.ok(!enquiry.message.includes('0 personas'));
}
assert.equal(initialEnquiry({ entries: enquiryEntries, cart: { ...mixedEnquiry, primaryItemId: null }, topic: 'orientacion-eventos' }), null);
assert.equal(initialEnquiry({ entries: enquiryEntries, cart: { ...mixedEnquiry, items: [...mixedEnquiry.items, { itemId: 'missing', entryId: 'missing', quantity: 1, optionValues: {} }] }, topic: '' }), null);
console.log(
  'PASS: treinta y nueve servicios, dieciocho ocasiones y consultas iniciales sin datos obligatorios; selección completa y responsables correctos en ambas vías.',
);

const serviceSearch = await import(await moduleUrl('lib/service-search.ts'));
const serviceGroupsUrl = await moduleUrl('lib/service-groups.ts');
const serviceGroups = await import(serviceGroupsUrl);
const searchEntries = actualEntries.map((entry) => ({
  id: entry.id,
  title: entry.title,
  href: `/${entry.kind}/${entry.slug}`,
  family: serviceGroups.serviceGroup(entry),
}));
assert.equal(serviceSearch.searchServices(searchEntries, '').length, 39);
assert.equal(new Set(searchEntries.map((entry) => entry.family)).size, 9);
for (const id of Object.keys(serviceSearch.serviceSearchAliases))
  assert.ok(searchEntries.some((entry) => entry.id === id), `alias sin servicio real: ${id}`);
for (const entry of searchEntries) {
  const results = serviceSearch.searchServices(searchEntries, entry.title);
  assert.equal(results[0]?.id, entry.id, `el nombre exacto debe encontrar primero ${entry.id}`);
  assert.equal(results[0]?.href, entry.href);
}
for (const [query, expected] of [
  ['vajilla', 'menaje-evento'],
  ['busco un dj', 'dj-eventos'],
  ['toldos', 'alquiler-toldos-carpas'],
  ['taza', 'tazas-personalizadas'],
  ['coffee break', 'desayuno-corporativo'],
  ['meseros', 'mozos-evento'],
]) assert.equal(serviceSearch.searchServices(searchEntries, query)[0]?.id, expected, query);
assert.equal(serviceSearch.searchServices(searchEntries, '', 'Personalizados').length, 8);
assert.equal(serviceSearch.searchServices(searchEntries, '', 'Música y entretenimiento').length, 6);
assert.equal(serviceSearch.searchServices(searchEntries, '', 'Cabina y 360').length, 1);
assert.deepEqual(serviceSearch.searchServices(searchEntries, 'fotógrafo'), []);
assert.deepEqual(serviceSearch.searchServices(searchEntries, 'FOTOGRAFO'), []);
assert.ok(serviceSearch.searchServices(searchEntries, 'alquiler').every((entry) => searchEntries.some((actual) => actual.id === entry.id)));
assert.deepEqual(serviceSearch.searchServices(searchEntries, 'un-servicio-inexistente-xyz'), []);
assert.deepEqual(serviceSearch.searchServices(searchEntries, '<script>alert(1)</script>'), []);
console.log('PASS SEARCH: treinta y nueve servicios y nueve familias, términos relacionados, acentos, orden de relevancia y rutas reales; fotografía retirada.');

const navigation = await import(await moduleUrl('lib/service-navigation.ts', [
  ["from './service-groups'", `from ${JSON.stringify(serviceGroupsUrl)}`],
]));
const navigationFamilies = navigation.serviceFamilyLinks(actualEntries);
assert.equal(navigationFamilies.length, 9);
assert.equal(new Set(navigationFamilies.map((family) => family.id)).size, 9);
assert.equal(navigationFamilies.reduce((total, family) => total + family.count, 0), actualEntries.length);
for (const group of serviceGroups.serviceGroupOrder) {
  const family = navigationFamilies.find((item) => item.id === navigation.serviceFamilyAnchor(group));
  const count = actualEntries.filter((entry) => serviceGroups.serviceGroup(entry) === group).length;
  if (!count) {
    assert.equal(family, undefined, `una familia vacía no debe aparecer: ${group}`);
    continue;
  }
  assert.ok(family, `la navegación debe enlazar la familia real ${group}`);
  assert.equal(family.count, count);
}
assert.equal(navigationFamilies.find((family) => family.label === 'Personal')?.count, 2);
assert.equal(navigationFamilies.find((family) => family.label === 'Empresas')?.count, 1);
for (const [path, expected] of [
  ['/servicios', 'servicios'], ['/servicios/dj-eventos', 'servicios'],
  ['/menus/menu-criollo-eventos', 'servicios'], ['/foto-video', 'servicios'],
  ['/eventos', 'ocasiones'], ['/tipos-evento/catering-cumpleanos-lima', 'ocasiones'],
  ['/empresas', 'empresas'], ['/cotizar', ''], ['/guias', ''],
]) assert.equal(navigation.navigationSectionForPath(path), expected, path);
console.log('PASS NAVIGATION: nueve familias y treinta y nueve servicios con anclas únicas; Personal completo, Empresas y sección de ruta correctos.');
