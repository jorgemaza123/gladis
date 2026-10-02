import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const origin = process.env.DESIGN_ORIGIN || 'http://127.0.0.1:4173';
assert.ok(
  /^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin),
  'Use an isolated local server',
);
const routes = [
  '/',
  '/servicios',
  '/menus',
  '/complementos',
  '/servicios/buffet-para-eventos',
  '/menus/menu-criollo-eventos',
  '/complementos/bar-bartender',
  '/complementos/mozos-evento',
  '/complementos/menaje-evento',
  '/complementos/sillas-evento',
  '/complementos/arreglos-florales',
  '/complementos/recuerdos-evento',
  '/complementos/polos-estampados',
  '/cotizar',
  '/privacidad',
];
const results = [];
for (const route of routes) {
  const response = await fetch(origin + route);
  const html = await response.text();
  assert.equal(response.status, 200, route);
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${route}: one h1`,
  );
  assert.ok(/<title>[^<]+<\/title>/.test(html), `${route}: title`);
  if (route !== '/cotizar')
    assert.ok(html.includes('rel="canonical"'), `${route}: canonical`);
  if (route === '/cotizar')
    assert.ok(/noindex/.test(html), 'quote must not be indexed');
  results.push({
    route,
    status: response.status,
    bytes: Buffer.byteLength(html),
  });
}
const measurements = [];
for (let run = 1; run <= 3; run++) {
  const start = performance.now();
  const response = await fetch(origin + '/');
  const headersAt = performance.now();
  await response.arrayBuffer();
  measurements.push({
    run,
    ttfbMs: +(headersAt - start).toFixed(2),
    htmlCompleteMs: +(performance.now() - start).toFixed(2),
  });
}
const report = {
  date: new Date().toISOString(),
  origin,
  node: process.version,
  environment:
    'Production build, loopback HTTP, no throttling, same running process. HTTP timing only, not browser LCP/CLS.',
  routes: results,
  measurements,
};
await mkdir('docs/diseno/evidencia', { recursive: true });
await writeFile(
  'docs/diseno/evidencia/http-production.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(
  `PASS: ${routes.length} rutas, H1 y metadatos. Tres mediciones HTTP locales guardadas.`,
);
console.log(JSON.stringify(measurements));
