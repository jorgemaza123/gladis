import assert from 'node:assert/strict';

const base = new URL(process.env.SEO_BASE_URL || 'http://127.0.0.1:4191');
const productionOrigin = 'https://gladis-vr6r.vercel.app';

const get = async (url) => {
  const response = await fetch(url, { redirect: 'manual' });
  return { response, text: await response.text() };
};
const matches = (html, pattern) => [...html.matchAll(pattern)].map((match) => match[1]);
const localUrl = (url) => {
  const parsed = new URL(url, productionOrigin);
  return new URL(parsed.pathname + parsed.search, base).href;
};

const robots = await get(new URL('/robots.txt', base));
assert.equal(robots.response.status, 200, 'robots.txt debe responder 200');
assert.match(robots.text, /Sitemap:/i, 'robots.txt debe declarar el sitemap');
for (const crawler of ['Googlebot', 'Bingbot', 'OAI-SearchBot'])
  assert.match(robots.text, new RegExp(`User-agent: ${crawler}`, 'i'), `robots.txt debe declarar ${crawler}`);

const sitemap = await get(new URL('/sitemap.xml', base));
assert.equal(sitemap.response.status, 200, 'sitemap.xml debe responder 200');
const urls = matches(sitemap.text, /<loc>(.*?)<\/loc>/g);
assert.ok(urls.length >= 70, `sitemap insuficiente: ${urls.length} URLs`);
assert.equal(new Set(urls).size, urls.length, 'el sitemap contiene URLs duplicadas');
assert.ok(
  urls.every((url) => !new URL(url).pathname.startsWith('/complementos')),
  'el sitemap no debe contener URLs antiguas de /complementos',
);

const titles = new Map();
const h1s = new Map();
const links = new Set();
for (const publishedUrl of urls) {
  const { response, text } = await get(localUrl(publishedUrl));
  assert.equal(response.status, 200, `${publishedUrl} debe responder 200`);
  assert.doesNotMatch(text, /<meta[^>]+name=["']robots["'][^>]+noindex/i, `${publishedUrl} no debe tener noindex`);
  const pageTitles = matches(text, /<title[^>]*>(.*?)<\/title>/gis);
  const descriptions = matches(text, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/gi);
  const canonicals = matches(text, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/gi);
  const pageH1s = matches(text, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((value) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
  assert.equal(pageTitles.length, 1, `${publishedUrl} debe tener un title`);
  assert.equal(descriptions.length, 1, `${publishedUrl} debe tener una description`);
  assert.equal(canonicals.length, 1, `${publishedUrl} debe tener una canonical`);
  assert.equal(pageH1s.length, 1, `${publishedUrl} debe tener un H1`);
  assert.equal(canonicals[0], publishedUrl, `${publishedUrl} tiene canonical incorrecta`);
  assert.ok(pageTitles[0].length <= 75, `${publishedUrl} tiene title demasiado largo`);
  assert.ok(descriptions[0].length >= 50 && descriptions[0].length <= 200, `${publishedUrl} tiene description fuera de rango`);
  assert.ok(!titles.has(pageTitles[0]), `title duplicado entre ${publishedUrl} y ${titles.get(pageTitles[0])}`);
  titles.set(pageTitles[0], publishedUrl);
  const h1Key = pageH1s[0].toLowerCase();
  assert.ok(!h1s.has(h1Key), `H1 duplicado entre ${publishedUrl} y ${h1s.get(h1Key)}`);
  h1s.set(h1Key, publishedUrl);
  assert.match(text, /<meta[^>]+property=["']og:title["']/i, `${publishedUrl} necesita og:title`);
  assert.match(text, /<meta[^>]+property=["']og:description["']/i, `${publishedUrl} necesita og:description`);
  assert.match(text, /<meta[^>]+property=["']og:url["']/i, `${publishedUrl} necesita og:url`);
  const schemas = matches(text, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    .flatMap((json) => {
      const parsed = JSON.parse(json);
      return Array.isArray(parsed) ? parsed : [parsed];
    });
  if (new URL(publishedUrl).pathname !== '/')
    assert.ok(schemas.some((schema) => schema?.['@type'] === 'BreadcrumbList'), `${publishedUrl} necesita BreadcrumbList`);
  for (const image of text.matchAll(/<img\b([^>]*)>/gi))
    assert.match(image[1], /\balt=["'][^"']*["']/i, `${publishedUrl} contiene una imagen sin atributo alt`);
  for (const href of matches(text, /<a[^>]+href=["']([^"']+)["']/gi)) {
    if (href.startsWith('/') && !href.startsWith('//')) links.add(href.split('#')[0] || '/');
  }
}

const missing = await get(new URL('/esta-ruta-no-existe-auditoria', base));
assert.equal(missing.response.status, 404, 'una ruta inexistente debe responder 404');

const retiredPhotography = '/servicios/fotografia-video-eventos';
const retired = await get(new URL(retiredPhotography, base));
assert.equal(retired.response.status, 404, 'la cobertura de fotografía retirada no debe seguir publicada');
assert.ok(!urls.some((url) => new URL(url).pathname === retiredPhotography), 'la ficha retirada no debe estar en el sitemap');
assert.ok(!links.has(retiredPhotography), 'no deben quedar enlaces internos al servicio retirado');

for (const noindexPath of [
  '/cotizar',
  '/privacidad',
  '/tipos-evento/desayunos-corporativos-lima',
  '/tipos-evento/catering-eventos-empresariales-lima',
  '/servicios/bebidas-barra-eventos',
]) {
  const page = await get(new URL(noindexPath, base));
  assert.equal(page.response.status, 200, `${noindexPath} debe seguir accesible`);
  assert.match(page.text, /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i, `${noindexPath} debe declarar noindex`);
  assert.ok(!urls.some((url) => new URL(url).pathname === noindexPath), `${noindexPath} no debe aparecer en sitemap`);
}

for (const href of links) {
  const { response } = await get(new URL(href, base));
  assert.notEqual(response.status, 404, `enlace interno roto: ${href}`);
  assert.ok(response.status < 500, `enlace interno con error: ${href}`);
}

console.log(`PASS SEO: ${urls.length} URLs indexables, ${titles.size} titles únicos, ${h1s.size} H1 únicos y ${links.size} enlaces internos verificados.`);
