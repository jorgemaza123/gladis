import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = new URL(process.env.SEO_BASE_URL || 'http://127.0.0.1:4191');
const output = new URL('../docs/seo/evidencia/auditoria-contenido.json', import.meta.url);

const fetchText = async (url) => {
  const response = await fetch(url, { redirect: 'manual' });
  return { response, text: await response.text() };
};
const decode = (value) => value
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');
const clean = (value) => decode(value)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const stripSectionByClass = (html, className) => {
  let output = html;
  const opening = new RegExp(`<section\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, 'i');
  let match = output.match(opening);
  while (match?.index !== undefined) {
    const start = match.index;
    const tags = /<\/?section\b[^>]*>/gi;
    tags.lastIndex = start + match[0].length;
    let depth = 1;
    let tag;
    let end = output.length;
    while ((tag = tags.exec(output))) {
      depth += /^<\/section/i.test(tag[0]) ? -1 : 1;
      if (depth === 0) {
        end = tags.lastIndex;
        break;
      }
    }
    output = output.slice(0, start) + ' ' + output.slice(end);
    match = output.match(opening);
  }
  return output;
};
const captures = (html, pattern) => {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  return [...html.matchAll(new RegExp(pattern.source, flags))].map((match) => clean(match[1]));
};
const first = (html, pattern) => captures(html, pattern)[0] || '';
const terms = (value) => new Set(value
  .toLocaleLowerCase('es')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9\s]/g, ' ')
  .split(/\s+/)
  .filter((term) => term.length > 3 && !STOP_WORDS.has(term)));
const similarity = (a, b) => {
  const aa = terms(a), bb = terms(b);
  const shared = [...aa].filter((term) => bb.has(term)).length;
  return shared / Math.max(1, new Set([...aa, ...bb]).size);
};
const shingles = (value, size = 5) => {
  const words = value.toLocaleLowerCase('es')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return new Set(words.slice(0, Math.max(0, words.length - size + 1))
    .map((_, index) => words.slice(index, index + size).join(' ')));
};
const phraseSimilarity = (a, b) => {
  const aa = shingles(a), bb = shingles(b);
  const shared = [...aa].filter((phrase) => bb.has(phrase)).length;
  return shared / Math.max(1, new Set([...aa, ...bb]).size);
};
const STOP_WORDS = new Set([
  'para', 'como', 'esta', 'este', 'estas', 'estos', 'desde', 'hasta', 'entre',
  'puede', 'puedes', 'tambien', 'segun', 'sobre', 'todas', 'todos', 'cada',
  'evento', 'eventos', 'servicio', 'servicios', 'gladys', 'lima', 'metropolitana',
  'cotizar', 'consulta', 'whatsapp', 'opciones', 'necesitas', 'necesita', 'solo',
]);

const sitemap = await fetchText(new URL('/sitemap.xml', base));
assert.equal(sitemap.response.status, 200, 'sitemap.xml debe responder 200');
const published = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const pages = [];

for (const canonicalUrl of published) {
  const canonical = new URL(canonicalUrl);
  const local = new URL(canonical.pathname + canonical.search, base);
  const { response, text: html } = await fetchText(local);
  const mainHtml = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  const coreHtml = ['service-explorer', 'sitewide-quote', 'event-inline-quote', 'other-occasions']
    .reduce((value, className) => stripSectionByClass(value, className), mainHtml);
  const mainText = clean(coreHtml);
  const jsonLd = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap((match) => {
      try {
        const parsed = JSON.parse(match[1]);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    });
  const internalLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/') && !href.startsWith('//'));
  const wordCount = mainText.split(/\s+/).filter(Boolean).length;
  pages.push({
    url: canonical.pathname + canonical.search,
    status: response.status,
    title: first(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    description: first(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i),
    h1: first(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i),
    canonical: html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || '',
    noindex: /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html),
    wordCount,
    ctas: captures(mainHtml, /<(?:a|button)[^>]*class=["'][^"']*(?:button|text-link)[^"']*["'][^>]*>([\s\S]*?)<\/(?:a|button)>/gi),
    internalLinks: [...new Set(internalLinks)],
    schemaTypes: [...new Set(jsonLd.flatMap((item) => {
      const type = item?.['@type'];
      return Array.isArray(type) ? type : type ? [type] : [];
    }))],
    breadcrumb: jsonLd.some((item) => item?.['@type'] === 'BreadcrumbList'),
    faqCount: jsonLd.find((item) => item?.['@type'] === 'FAQPage')?.mainEntity?.length || 0,
    text: mainText,
  });
}

const similarities = [];
for (let index = 0; index < pages.length; index += 1) {
  for (let other = index + 1; other < pages.length; other += 1) {
    const score = similarity(pages[index].text, pages[other].text);
    if (score >= 0.42) similarities.push({
      a: pages[index].url,
      b: pages[other].url,
      score: Number(score.toFixed(3)),
      phraseScore: Number(phraseSimilarity(pages[index].text, pages[other].text).toFixed(3)),
    });
  }
}
similarities.sort((a, b) => b.score - a.score);
const TEMPLATE_RISK_THRESHOLD = 0.5;

const templateRisks = similarities
  .filter((pair) => pair.phraseScore >= TEMPLATE_RISK_THRESHOLD)
  .sort((a, b) => b.phraseScore - a.phraseScore);

const report = {
  generatedAt: new Date().toISOString(),
  base: base.href,
  indexableCount: pages.length,
  pages,
  thinPages: pages.filter((page) => page.wordCount < 240).map(({ url, wordCount }) => ({ url, wordCount })),
  similarities,
  templateRisks,
};

const indexablePaths = new Set(pages.map((page) => page.url.split('?')[0]));
const incoming = new Map([...indexablePaths].map((path) => [path, 0]));
for (const page of pages) {
  for (const href of page.internalLinks) {
    const path = href.split(/[?#]/)[0] || '/';
    if (path !== page.url.split('?')[0] && incoming.has(path))
      incoming.set(path, incoming.get(path) + 1);
  }
}
report.orphanPages = [...incoming]
  .filter(([path, count]) => path !== '/' && count === 0)
  .map(([path]) => path);

await mkdir(new URL('.', output), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);

assert.ok(pages.every((page) => page.status === 200), 'todas las URLs indexables deben responder 200');
assert.ok(pages.every((page) => page.h1 && page.title && page.description && page.canonical), 'todas las URLs necesitan title, description, H1 y canonical');
assert.ok(pages.every((page) => page.ctas.length > 0), 'todas las URLs indexables necesitan una CTA visible');
assert.ok(pages.every((page) => page.internalLinks.length >= 2), 'todas las URLs indexables necesitan enlaces internos');
assert.deepEqual(report.orphanPages, [], `URLs huérfanas: ${report.orphanPages.join(', ')}`);
console.log(`AUDIT CONTENT: ${pages.length} URLs; ${report.thinPages.length} con menos de 240 palabras; ${similarities.length} pares con similitud >= 0.42.`);
console.log(
  `RIESGO DE PLANTILLA: ${templateRisks.length} pares comparten al menos ${Math.round(TEMPLATE_RISK_THRESHOLD * 100)}% de secuencias exactas de cinco palabras.`,
);
console.log(`Informe: ${decodeURIComponent(output.pathname.replace(/^\//, ''))}`);
