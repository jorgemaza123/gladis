import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);

async function moduleUrl(path, replacements = []) {
  let source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  for (const [from, to] of replacements)
    source = source.replace(from, to);
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
    [
      "from '../config/business-contacts'",
      `from ${JSON.stringify(contactsUrl)}`,
    ],
  ]);
const commerce = await import(commerceUrl);
const contentUrl = await moduleUrl('models/content.ts');
const defaults = await import(
  await moduleUrl('data/defaults.ts', [
    ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
  ]),
);
const validation = await import(
  await moduleUrl('lib/validation.ts', [
    [
      "from 'zod'",
      `from ${JSON.stringify(pathToFileURL(require.resolve('zod')).href)}`,
    ],
    ["from '@/config/business-contacts'", `from ${JSON.stringify(contactsUrl)}`],
    ["from '@/models/content'", `from ${JSON.stringify(contentUrl)}`],
  ]),
);
const quoteValidationUrl = await moduleUrl('lib/quote-validation.ts', [
  [
    "from 'zod'",
    `from ${JSON.stringify(pathToFileURL(require.resolve('zod')).href)}`,
  ],
]);
const attributionUrl = await moduleUrl('lib/attribution.ts');
const whatsapp = await import(await moduleUrl('lib/whatsapp-message.ts'));
const seo = await import(await moduleUrl('lib/seo.ts'));
const quoteV2 = await import(
  await moduleUrl('lib/quote-v2-validation.ts', [
    [
      "from 'zod'",
      `from ${JSON.stringify(pathToFileURL(require.resolve('zod')).href)}`,
    ],
    ["from '@/lib/quote-validation'", `from ${JSON.stringify(quoteValidationUrl)}`],
    ["from '@/lib/attribution'", `from ${JSON.stringify(attributionUrl)}`],
  ]),
);
const quoteResolver = await import(
  await moduleUrl('lib/resolve-quote.ts', [
    ["from '@/lib/business-contacts'", `from ${JSON.stringify(commerceUrl)}`],
  ]),
);
const quoteCart = await import(await moduleUrl('lib/quote-cart.ts'));
const attribution = await import(attributionUrl);
const recommendations = await import(await moduleUrl('lib/recommendations.ts'));
const { diagnoseCatalog } = await import('./catalog-readiness.mjs');

assert.deepEqual(commerce.resolveBusinessContact('eventos'), {
  ownerId: 'eventos',
  label: 'Jorge',
  available: true,
});
assert.deepEqual(commerce.resolveBusinessContact('cocina'), {
  ownerId: 'cocina',
  label: 'Cocina y bar',
  available: false,
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
assert.equal(commerce.resolveWhatsAppDestination('cocina'), null);
assert.equal(commerce.isValidWhatsAppNumber('51999111222'), true);
assert.equal(commerce.isValidWhatsAppNumber('+51999111222'), false);
assert.equal(commerce.isValidWhatsAppNumber('51999 111222'), false);
assert.equal(commerce.isValidWhatsAppNumber('5199911122'), true);

const fixture = {
  cocina: { label: 'Cocina de prueba', whatsapp: '51991112223', enabled: true },
  eventos: { label: 'Eventos de prueba', whatsapp: '51994445556', enabled: true },
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
    faqItems: [{ id: 'faq-servicio', question: '¿Cómo coordinamos?', answer: 'Confirmamos los detalles antes del evento.' }],
    processSteps: [{ title: 'Cuéntanos tu idea', description: 'Revisamos fecha y necesidades.' }],
    externalCatalog: { url: 'https://catalogo.example.test/propuestas', label: 'Ver catálogo externo' },
  }).success,
  true,
  'los datos editoriales opcionales válidos se aceptan',
);
assert.equal(
  validation.entrySchema.safeParse({
    ...quoteEntry,
    externalCatalog: { url: 'http://catalogo.example.test', label: 'No seguro' },
  }).success,
  false,
  'el catálogo externo exige HTTPS',
);
assert.equal(
  validation.entrySchema.safeParse({
    ...quoteEntry,
    externalCatalog: { url: 'https://usuario:clave@catalogo.example.test', label: 'Con credenciales' },
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
assert.equal(validation.siteSchema.safeParse(siteWith(quoteEntry)).success, true);
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
};
const siteWithEntries = (entries) =>
  defaults.normalizeSite({
    version: 1,
    settings: defaults.defaultSettings,
    entries,
    sections: [{ id: 'portada', type: 'hero', title: 'Portada', description: '', imageId: '', visible: true, sortOrder: 0 }],
  });
assert.equal(
  validation.siteSchema.safeParse(siteWithEntries([
    { ...quoteEntry, coverageIds: ['lima-confirmada'] }, coverageEntry,
  ])).success,
  true,
  'la cobertura explícita debe apuntar a una entrada de cobertura',
);
assert.equal(
  validation.siteSchema.safeParse(siteWith({ ...quoteEntry, coverageIds: ['oferta-confirmada'] })).success,
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
      { id: 'a', requestable: true, ownerId: null, quoteConfig: null, recommendations: [{ entryId: 'b', eventTypeIds: [] }] },
      { id: 'b', requestable: false, recommendations: [{ entryId: 'a', eventTypeIds: [] }] },
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
  event: { typeId: null, typeOther: '', date: null, district: '', guests: null },
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
  () => quoteV2.parseQuoteInput({ ...v2, items: Array.from({ length: 21 }, () => v2.items[0]) }),
  'máximo de líneas',
);
assert.throws(
  () => quoteV2.parseQuoteInput({ ...v2, items: [{ ...v2.items[0], quantity: Infinity }] }),
  'cantidad infinita',
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
  type: 'add', item: { itemId: cartItemOne, entryId: 'buffet', quantity: 2, optionValues: { turno: 'dia' } },
});
cart = quoteCart.quoteCartReducer(cart, {
  type: 'add', item: { itemId: cartItemTwo, entryId: 'buffet', quantity: 3, optionValues: { turno: 'dia' } },
});
assert.equal(cart.items.length, 1, 'misma oferta y opciones se fusionan');
assert.equal(cart.items[0].quantity, 5, 'la cantidad fusionada se conserva');
assert.equal(cart.primaryItemId, cartItemOne, 'la primera línea puede ser principal');
cart = quoteCart.quoteCartReducer(cart, {
  type: 'add', item: { itemId: cartItemThree, entryId: 'buffet', quantity: 1, optionValues: { turno: 'noche' } },
});
assert.equal(cart.items.length, 2, 'variantes distintas permanecen separadas');
cart = quoteCart.quoteCartReducer(cart, { type: 'remove', itemId: cartItemOne });
assert.equal(cart.primaryItemId, null, 'retirar principal no elige reemplazo automáticamente');
const serializedCart = quoteCart.serializeQuoteCart(cart, 1000);
assert.equal(quoteCart.restoreQuoteCart(serializedCart, 1001).cart.items.length, 1);
assert.equal(quoteCart.restoreQuoteCart('{inválido', 1001).discarded, true, 'JSON corrupto se descarta');
assert.equal(quoteCart.restoreQuoteCart(serializedCart, 1000 + 86400001).discarded, true, 'bolsa vencida se descarta');
const migratedLegacy = quoteCart.adaptLegacyQuoteDraft(
  JSON.stringify({ savedAt: 1000, data: { selectionId: 'buffet', addOnIds: ['sillas', 'no-valido'], name: 'No guardar', phone: '999 111 222', email: 'no@guardar.test' } }),
  new Set(['buffet', 'sillas']),
  (() => { let next = 20; return () => `123e4567-e89b-42d3-a456-4266141740${next++}`; })(),
  1001,
);
assert.equal(migratedLegacy.cart.items.length, 2, 'el adaptador conserva sólo IDs válidos');
assert.equal(migratedLegacy.discarded, true, 'el adaptador informa descarte parcial');
assert.ok(!JSON.stringify(migratedLegacy.cart).includes('No guardar'), 'la bolsa no migra PII del borrador legado');

const firstTouch = attribution.createAttribution({
  pathname: '/complementos/sillas',
  search: '?utm_source=instagram&utm_medium=social&utm_campaign=primavera',
  referrer: 'https://www.instagram.com/catering',
}, new Date('2030-01-01T00:00:00.000Z'));
assert.equal(firstTouch.landingPath, '/complementos/sillas');
assert.equal(firstTouch.acquisitionEntryId, null, 'visitar una ficha no inventa intención');
assert.equal(firstTouch.channel, 'social');
const chairCta = attribution.createCtaContext(
  firstTouch, 'sillas', 'service_detail', '/complementos/sillas', new Date('2030-01-01T00:01:00.000Z'),
);
const buffetCta = attribution.createCtaContext(
  chairCta, 'buffet', 'catalog_card', '/servicios/buffet', new Date('2030-01-01T00:02:00.000Z'),
);
assert.equal(buffetCta.acquisitionEntryId, 'sillas', 'el primer CTA se conserva aunque cambie el principal');
assert.equal(buffetCta.lastTouchPath, '/servicios/buffet');
assert.equal(buffetCta.ctaPlacement, 'catalog_card');
assert.equal(attribution.createAttribution({ pathname: '/', search: '', referrer: '' }).channel, 'direct_unknown');
assert.deepEqual(
  attribution.sanitizeUtm('?utm_source=https://evil.test&utm_medium=999%20111%20222&utm_campaign=correo%40test.com'),
  {},
  'UTM con URL, teléfono o correo se omite',
);
assert.equal(attribution.restoreAttribution('{roto'), null, 'atribución corrupta no impide recuperar la sesión');
const whatsappMessage = whatsapp.createWhatsAppMessage({
  introduction: 'Hola & gracias', eventType: 'Boda', date: '2030-02-01', district: 'Lima', guests: 30, primary: 'Buffet criollo', extras: ['Sillas'], budget: 'S/ 500',
});
assert.ok(whatsappMessage.includes('Oferta principal: Buffet criollo'));
assert.ok(!whatsappMessage.includes('Teléfono:'), 'el mensaje no incluye datos de contacto');
assert.equal(
  whatsapp.createWhatsAppUrl('51994445556', whatsappMessage),
  `https://wa.me/51994445556?text=${encodeURIComponent(whatsappMessage)}`,
  'la URL conserva caracteres españoles y ampersand codificados',
);
assert.equal(whatsapp.createWhatsAppUrl(null, whatsappMessage), null, 'sin número no hay fallback');
assert.deepEqual(
  seo.catalogUrlPolicy('servicios', { pagina: '2', utm_source: 'instagram' }),
  { page: 2, pageParamPresent: true, noindex: false, canonicalPath: '/servicios?pagina=2' },
  'UTM no altera la canónica ni la indexación de una página válida',
);
assert.deepEqual(
  seo.catalogUrlPolicy('servicios', { q: 'buffet', utm_source: 'instagram' }),
  { page: 1, pageParamPresent: false, noindex: true, canonicalPath: '/servicios' },
  'los filtros son noindex y no contaminan la canónica',
);
assert.equal(seo.catalogUrlPolicy('servicios', { pagina: '1' }).canonicalPath, '/servicios');
const structuredBusiness = seo.businessData(defaults.normalizeSite({
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
  entries: [], sections: [], media: [], faqs: [],
}));
assert.ok(structuredBusiness && !('telephone' in structuredBusiness), 'el esquema omite teléfono legado sin contacto principal confirmado');

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
      { entryId: 'regalos', priority: 2, eventTypeIds: [], reason: 'Para cerrar el servicio.' },
      { entryId: 'sillas', priority: 1, eventTypeIds: ['boda'], reason: 'Para la ceremonia.' },
      { entryId: 'regalos', priority: 3, eventTypeIds: [], reason: 'Duplicado que no debe aparecer.' },
    ],
  },
  { ...gifts, recommendations: [{ entryId: 'bartender', priority: 1, eventTypeIds: [], reason: 'Ciclo explícito.' }] },
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
  recommendations.resolveRecommendations({
    sourceEntryId: 'bartender', entries: recommendationEntries, presentEntryIds: ['regalos'], eventTypeId: 'otro',
  }).map(({ entry }) => entry.id),
  [],
  'no se recomiendan líneas ya presentes ni relaciones de otro contexto',
);
assert.deepEqual(
  recommendations.resolveRecommendations({ sourceEntryId: 'regalos', entries: recommendationEntries }),
  [{ entry: recommendationEntries[0], reason: 'Ciclo explícito.', priority: 1 }],
  'un ciclo no se recorre ni duplica recomendaciones',
);
const resolve = (primaryItemId, items) =>
  quoteResolver.resolveQuote(
    { ...v2, items, primaryItemId },
    [buffet, chairs, bartender, gifts],
    fixture,
  );
const line = (itemId, entryId, quantity) => ({ itemId, entryId, quantity, optionValues: {} });
const secondItemId = '123e4567-e89b-42d3-a456-426614174002';
assert.equal(
  resolve(itemId, [line(itemId, 'buffet', 10), line(secondItemId, 'sillas', 100)]).value.recipient.ownerId,
  'cocina',
);
assert.equal(
  resolve(itemId, [line(itemId, 'sillas', 100), line(secondItemId, 'buffet', 10)]).value.recipient.ownerId,
  'eventos',
);
assert.equal(resolve(itemId, [line(itemId, 'bartender', 1), line(secondItemId, 'regalos', 1)]).value.recipient.ownerId, 'cocina');
assert.equal(resolve(itemId, [line(itemId, 'regalos', 1)]).value.recipient.ownerId, 'eventos');
assert.equal(
  resolve(secondItemId, [line(itemId, 'sillas', 100), line(secondItemId, 'buffet', 10)]).value.recipient.ownerId,
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
