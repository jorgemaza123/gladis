import assert from 'node:assert/strict';

const base = new URL(process.env.SEO_BASE_URL || 'http://127.0.0.1:4191');
const productionOrigin = 'https://gladis-vr6r.vercel.app';
const preserved = new Set([
  '/servicios/cocina-para-eventos-lima',
  '/servicios/buffet-para-eventos',
  '/servicios/desayunos-corporativos-coffee-break',
]);

const request = (path) => fetch(new URL(path, base), { redirect: 'manual' });
const hub = await request('/servicios');
assert.equal(hub.status, 200, '/servicios debe responder 200');
const hubHtml = await hub.text();
const destinations = [...new Set(
  [...hubHtml.matchAll(/href=["'](\/servicios\/[^"'?#]+)["']/g)]
    .map((match) => match[1])
    .filter((path) => !preserved.has(path)),
)].sort();
assert.ok(destinations.length >= 30, `se esperaban al menos 30 fichas migradas y se encontraron ${destinations.length}`);

const rootRedirect = await request('/complementos');
assert.equal(rootRedirect.status, 301, '/complementos debe responder 301');
assert.equal(new URL(rootRedirect.headers.get('location'), base).pathname, '/servicios');

for (const destination of destinations) {
  const slug = destination.split('/').at(-1);
  const legacy = `/complementos/${slug}`;
  const redirect = await request(legacy);
  assert.equal(redirect.status, 301, `${legacy} debe responder 301`);
  const location = new URL(redirect.headers.get('location'), base);
  assert.equal(location.pathname, destination, `${legacy} debe apuntar directamente a ${destination}`);
  assert.notEqual(location.pathname, legacy, `${legacy} no debe crear un loop`);

  const target = await request(location.pathname);
  assert.equal(target.status, 200, `${destination} debe responder 200 sin otra redirección`);
  const html = await target.text();
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
  assert.equal(canonical, `${productionOrigin}${destination}`, `${destination} debe autocanonizar a la URL nueva`);
}

const sitemap = await request('/sitemap.xml');
const sitemapXml = await sitemap.text();
assert.doesNotMatch(sitemapXml, /\/complementos(?:\/|<)/, 'el sitemap conserva URLs antiguas');

console.log(`PASS REDIRECTS: 1 hub y ${destinations.length} fichas migradas con 301 directo, destino 200 y canonical nueva.`);
