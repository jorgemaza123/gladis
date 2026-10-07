import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
const manifest = JSON.parse(
  (await readFile('data/design-images.json', 'utf8')).replace(/^\uFEFF/, ''),
);
let total = 0;
function jpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 255) throw new Error('Invalid JPEG marker');
    const marker = buffer[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker))
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  throw new Error('JPEG dimensions missing');
}
for (const [name, variants] of Object.entries(manifest)) {
  assert.deepEqual(
    variants.map((v) => v.width),
    [480, 768, 1280],
  );
  for (const asset of variants) {
    const buffer = await readFile(`public${asset.url}`);
    assert.equal(
      buffer.length,
      asset.bytes,
      `${asset.url}: metadata must match file`,
    );
    assert.deepEqual(jpegSize(buffer), {
      width: asset.width,
      height: asset.height,
    });
    assert.ok(
      asset.bytes <=
        (asset.width === 480 ? 65000 : asset.width === 768 ? 140000 : 300000),
      `${name} exceeds responsive budget`,
    );
    total += asset.bytes;
  }
}
assert.ok(total < 2600000, `All image variants: ${total}`);
const fonts = ['lora-500.woff2', 'source-sans.woff2'];
const fontTotal = (
  await Promise.all(
    fonts.map(async (font) => (await stat(`public/fonts/${font}`)).size),
  )
).reduce((a, b) => a + b, 0);
assert.ok(fontTotal < 65000, 'Local fonts exceed budget');

const storySource = await readFile('components/story-hero.tsx', 'utf8');
const storyAssets = [
  ['gladys-story-desktop.mp4', 3200000],
  ['gladys-story-mobile.mp4', 1100000],
  ['gladys-story-poster.webp', 100000],
  ['gladys-story-poster-mobile.webp', 30000],
];
let storyTotal = 0;
for (const [asset, budget] of storyAssets) {
  const bytes = (await stat(`public/videos/${asset}`)).size;
  assert.ok(bytes <= budget, `${asset} exceeds its runtime budget`);
  assert.ok(storySource.includes(`/videos/${asset}`), `${asset} is not wired into StoryHero`);
  storyTotal += bytes;
}
assert.ok(storyTotal < 4200000, `Story hero runtime assets: ${storyTotal}`);
assert.ok(
  !storySource.includes('gladys-banquet-master.mp4'),
  'The preserved master video must not be sent to visitors',
);
console.log(
  `PASS: 24 variantes JPEG con dimensiones reales: ${total} bytes; 2 fuentes locales: ${fontTotal} bytes; 4 activos runtime del relato: ${storyTotal} bytes. Esto no mide Core Web Vitals.`,
);
