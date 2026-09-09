import { z } from 'zod';
const short = z.string().max(200);
const paragraph = z.string().max(5000);
const seo = z.object({ title: short, description: z.string().max(400), noindex: z.boolean() });
const id = z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/);
const internal = z.string().max(300).regex(/^\/(?!\/)[a-zA-Z0-9/_-]*$/);
const assetUrl = z.string().max(2000).refine(v => /^\/api\/media\/[a-zA-Z0-9_-]+$/.test(v) || /^https:\/\//.test(v), 'Usa una imagen de la biblioteca.');
export const siteSchema = z.object({
  version: z.number().int().nonnegative(),
  settings: z.object({ name: short.min(1), tagline: paragraph, whatsapp: z.string().regex(/^(|[1-9][0-9]{7,14})$/), whatsappMessage: paragraph, email: z.union([z.literal(''), z.string().email()]), origin: z.union([z.literal(''), z.string().url().refine(v => { const u = new URL(v); return u.protocol === 'https:' && u.pathname === '/' && !u.search && !u.hash && !u.username && !u.password; }, 'Usa un dominio HTTPS sin rutas.')]), indexable: z.boolean(), demo: z.boolean(), seo, navigation: z.array(z.object({ label: short.min(1), href: internal })).max(10), footer: paragraph }),
  media: z.array(z.object({ id, url: assetUrl, alt: short, caption: paragraph, demo: z.boolean() })).max(300),
  entries: z.array(z.object({ id, kind: z.enum(['servicios','menus','eventos','complementos','paginas']), slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: short.min(1), description: paragraph, body: paragraph, imageId: z.string().max(100), status: z.enum(['draft','published']), sortOrder: z.number().int().min(0).max(10000), featured: z.boolean(), details: z.array(short).max(40), seo })).max(300),
  sections: z.array(z.object({ id, type: z.enum(['hero','servicios','menus','texto','faq','cta']), title: short, description: paragraph, imageId: z.string().max(100), visible: z.boolean(), sortOrder: z.number().int().min(0).max(10000) })).max(30),
  faqs: z.array(z.object({ id, question: short.min(1), answer: paragraph.min(1) })).max(50),
}).superRefine((site, ctx) => {
  for (const list of [site.entries, site.media, site.sections, site.faqs]) {
    if (new Set(list.map(x => x.id)).size !== list.length) ctx.addIssue({ code: 'custom', message: 'Hay identificadores duplicados.' });
  }
  const urls = site.entries.map(e => `${e.kind}/${e.slug}`);
  if (new Set(urls).size !== urls.length) ctx.addIssue({ code: 'custom', message: 'Dos contenidos tienen la misma URL.' });
  for (const item of [...site.entries, ...site.sections]) {
    if (item.imageId && !site.media.some(m => m.id === item.imageId)) ctx.addIssue({ code: 'custom', message: 'Una imagen seleccionada ya no existe.' });
  }
  if (site.sections.filter(s => s.type === 'hero' && s.visible).length !== 1) ctx.addIssue({ code: 'custom', message: 'Debe haber exactamente una portada visible.' });
  if (site.settings.indexable && (!site.settings.origin || site.settings.demo)) ctx.addIssue({ code: 'custom', message: 'Para indexar configura el dominio y desactiva el modo de demostración.' });
});
