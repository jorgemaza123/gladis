import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const assets = [
  'public/images/demo/buffet-principal-demo.jpg',
  'public/images/demo/bar-y-mozos-demo.jpg',
  'public/images/demo/detalles-evento-demo.jpg',
];
const budgetBytes = 1_000_000;
const sizes = await Promise.all(assets.map(async (asset) => ({ asset, bytes: (await stat(resolve(asset))).size })));
const total = sizes.reduce((sum, asset) => sum + asset.bytes, 0);

assert.ok(total <= budgetBytes, `Las imágenes de demostración pesan ${total} bytes; el presupuesto es ${budgetBytes}.`);
console.log(`PASS: ${sizes.length} imágenes de demostración pesan ${total} bytes en total (presupuesto ${budgetBytes}).`);
