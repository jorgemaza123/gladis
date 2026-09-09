import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const base = process.env.TEST_ORIGIN || 'http://localhost:3000';
const password = readFileSync('.dev.vars', 'utf8').match(
  /ADMIN_PASSWORD="([^"]+)"/,
)[1];
const login = await fetch(base + '/api/session', {
  method: 'POST',
  headers: { origin: base, 'Content-Type': 'application/json' },
  body: JSON.stringify({ password }),
});
assert.equal(login.status, 204, 'login owner');
const cookie = login.headers.get('set-cookie').split(';')[0],
  headers = { origin: base, cookie, 'Content-Type': 'application/json' };
const read = () =>
  fetch(base + '/api/content', { headers }).then((r) => r.json());
const original = await read();
let state = structuredClone(original);
let quoteId = '';
let quoteVersion = 1;
const suffix = crypto.randomUUID().slice(0, 8);
const save = async (s) => {
  const r = await fetch(base + '/api/content', {
    method: 'PUT',
    headers,
    body: JSON.stringify(s),
  });
  assert.equal(r.status, 200, await r.clone().text());
  return r.json();
};
const item = (kind, name) => ({
  ...structuredClone(original.entries[0]),
  id: `qa-${kind}-${suffix}`,
  slug: `qa-${kind}-${suffix}`,
  kind,
  title: name,
  description: 'Contenido de prueba de integración, se retira al terminar.',
  status: 'published',
  featured: false,
  verified: true,
  menuIds: [],
  dishIds: [],
  serviceIds: [],
  modalityIds: [],
  addOnIds: [],
  eventTypeIds: [],
  imageIds: [],
  minimumGuests: null,
  createdAt: '',
  updatedAt: '',
  seo: {
    title: name,
    description: 'SEO específico de verificación',
    noindex: false,
  },
  price: {
    mode: 'consult',
    amount: null,
    currency: 'PEN',
    unit: 'person',
    minimum: null,
    conditions: '',
  },
});
try {
  const mode = item('modalidades', 'Modalidad de prueba'),
    addon = item('complementos', 'Complemento de prueba'),
    dish = item('platos', 'Plato de prueba'),
    event = item('tipos-evento', 'Evento de prueba'),
    menu = item('menus', 'Menú de prueba');
  menu.modalityIds = [mode.id];
  menu.addOnIds = [addon.id];
  menu.dishIds = [dish.id];
  menu.minimumGuests = 10;
  state.entries.push(mode, addon, dish, event, menu);
  state = await save(state);
  const oldPath = `/menus/${menu.slug}`;
  state.entries.find((e) => e.id === menu.id).slug += '-nuevo';
  state = await save(state);
  const moved = await fetch(base + oldPath, { redirect: 'manual' });
  assert.ok(
    [301, 308].includes(moved.status),
    'old URL redirected permanently',
  );
  assert.ok(moved.headers.get('location').endsWith('-nuevo'));
  const detail = await fetch(base + oldPath + '-nuevo').then((r) => r.text());
  assert.ok(detail.includes(dish.title), 'dish relationship rendered');
  const fields = {
    requestId: crypto.randomUUID(),
    eventTypeId: event.id,
    eventTypeOther: '',
    date: '2030-12-25',
    district: 'Distrito de prueba',
    people: 20,
    selectionId: menu.id,
    modalityId: mode.id,
    addOnIds: [addon.id],
    budget: '',
    name: 'Prueba de integración',
    phone: '999000111',
    email: '',
    notes: 'Registro temporal automatizado',
    consent: true,
    website: '',
    startedAt: Date.now() - 5000,
  };
  quoteId = fields.requestId;
  const submit = (body) =>
    fetch(base + '/api/quotes', {
      method: 'POST',
      headers: { origin: base, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  assert.equal(
    (await submit({ ...fields, consent: false })).status,
    400,
    'consent enforced',
  );
  assert.equal(
    (await submit({ ...fields, people: 2 })).status,
    400,
    'minimum guests enforced',
  );
  assert.equal(
    (await submit({ ...fields, addOnIds: [dish.id] })).status,
    400,
    'invalid addon rejected',
  );
  let r = await submit(fields);
  assert.equal(r.status, 201, await r.clone().text());
  const result = await r.json();
  assert.ok(result.reference);
  assert.equal(result.demo, true, 'test site clearly demo');
  r = await submit(fields);
  assert.equal(r.status, 201);
  assert.equal(
    (await r.json()).reference,
    result.reference,
    'idempotent retry',
  );
  assert.equal(
    (await submit({ ...fields, name: 'Otro nombre' })).status,
    400,
    'changed replay rejected',
  );
  assert.equal(
    (await fetch(base + '/api/quotes')).status,
    403,
    'requests private',
  );
  const list = await fetch(
    base + '/api/quotes?q=' + encodeURIComponent(result.reference),
    { headers },
  ).then((r) => r.json());
  assert.equal(list.total, 1, 'one request only');
  const request = list.items[0];
  assert.equal(request.snapshot.selection, menu.title);
  assert.deepEqual(request.snapshot.addOns, [addon.title]);
  assert.equal(request.input.selectionId, menu.id, 'selection preserved');
  state.entries.find((e) => e.id === menu.id).title = 'Nombre cambiado después';
  state = await save(state);
  const listAfter = await fetch(
    base + '/api/quotes?q=' + encodeURIComponent(result.reference),
    { headers },
  ).then((r) => r.json());
  assert.equal(
    listAfter.items[0].snapshot.selection,
    menu.title,
    'commercial snapshot immutable',
  );
  r = await fetch(base + '/api/quotes/' + quoteId, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      version: 1,
      status: 'reviewing',
      notes: 'Nota interna de prueba',
    }),
  });
  assert.equal(r.status, 200);
  const updated = await r.json();
  quoteVersion = updated.version;
  assert.equal(updated.status, 'reviewing');
  assert.equal(
    (
      await fetch(base + '/api/quotes/' + quoteId, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ version: 1, status: 'closed', notes: '' }),
      })
    ).status,
    409,
    'request concurrency',
  );
  const history = await fetch(base + '/api/content/history', { headers }).then(
    (r) => r.json(),
  );
  assert.ok(history.items.length > 0, 'history available');
  const privatePreview = await fetch(base + '/preview/' + menu.id, {
    redirect: 'manual',
  });
  assert.equal(privatePreview.status, 307, 'private preview requires login');
  assert.equal(privatePreview.headers.get('location'), '/admin');
  const draftState = structuredClone(state);
  draftState.entries.find((e) => e.id === menu.id).status = 'draft';
  state = await save(draftState);
  assert.equal(
    (await fetch(base + '/menus/' + menu.slug + '-nuevo')).status,
    404,
    'unpublish removes route',
  );
  const preview = await fetch(base + '/preview/' + menu.id, { headers });
  assert.equal(preview.status, 200);
  assert.ok((await preview.text()).includes('noindex'), 'preview noindex');
  console.log(
    'PASS: normalized content, permanent redirects, relations, quote consent/validation/idempotence, private listing, immutable snapshot, follow-up conflicts, history, private preview and unpublish.',
  );
} finally {
  if (quoteId) {
    const r = await fetch(base + '/api/quotes/' + quoteId, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ version: quoteVersion }),
    });
    assert.ok([204, 409].includes(r.status), 'test quote cleanup');
  }
  const latest = await read();
  await save({ ...original, version: latest.version });
  const logout = await fetch(base + '/api/session', {
    method: 'DELETE',
    headers,
  });
  assert.equal(logout.status, 204);
  assert.equal(
    (await fetch(base + '/api/content', { headers })).status,
    403,
    'logout invalidates captured token',
  );
}
