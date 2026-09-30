// Static-site guard: no API, database or Cloudflare binding may remain in runtime code.
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
async function files(directory) {
  const names = await readdir(new URL(directory, root), { withFileTypes: true });
  return (await Promise.all(names.map((entry) =>
    entry.isDirectory()
      ? files(`${directory}/${entry.name}`)
      : Promise.resolve([`${directory}/${entry.name}`]),
  ))).flat();
}
const runtimeFiles = [
  ...(await files('app')).filter((file) => /\.(ts|tsx)$/.test(file)),
  ...(await files('repositories')).filter((file) => /\.(ts|tsx)$/.test(file)),
];
for (const file of runtimeFiles) {
  const source = await readFile(new URL(file, root), 'utf8');
  assert.ok(!/cloudflare:workers|env\.DB|D1Database/.test(source), `${file} must not require a database`);
  assert.ok(!/\bfetch\s*\(|sendBeacon\s*\(/.test(source), `${file} must not send data from the static runtime`);
}
await assert.rejects(access(new URL('app/api', root)), 'the static runtime must not expose API routes');
const quoteSource = await readFile(new URL('components/quote.tsx', root), 'utf8');
for (const field of ["field('name'", "field('phone'", "field('email'", 'data.notes', 'data.consent', 'data.website'])
  assert.ok(!quoteSource.includes(field), `the quote UI must not collect ${field}`);
const siteRepository = await readFile(new URL('repositories/site.ts', root), 'utf8');
assert.ok(siteRepository.includes('structuredClone(demoContent)'), 'each static read must clone the source content');
console.log('PASS: la aplicación pública es estática, no envía datos ni recolecta contacto innecesario.');
