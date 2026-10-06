/**
 * Regenerates src/data/globeLand.ts, the land mask drawn by the CTA globe.
 *
 * The geodata packages are intentionally not project dependencies; install
 * them in a scratch directory and run from there:
 *
 *   npm install world-atlas@2 topojson-client@3 d3-geo@3
 *   node /path/to/repo/scripts/generate-globe-land.mjs /path/to/repo/src/data/globeLand.ts
 *
 * Source: Natural Earth 1:50m land and countries (public domain).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const require = createRequire(pathToFileURL(`${process.cwd()}/`));
const { feature } = await import(require.resolve('topojson-client'));
const { geoContains } = await import(require.resolve('d3-geo'));

const output = process.argv[2];
if (!output) throw new Error('Usage: generate-globe-land.mjs <output.ts>');

const readAtlas = (name) =>
  JSON.parse(readFileSync(require.resolve(`world-atlas/${name}`), 'utf8'));
const land = readAtlas('land-50m.json');
const countries = readAtlas('countries-50m.json');
const landShape = feature(land, land.objects.land);
const india = feature(countries, countries.objects.countries).features.find(
  (country) => country.id === '356',
);

const STEP = 1.5;
const ROWS = 180 / STEP;
const COLS = 360 / STEP;
const bits = new Uint8Array(Math.ceil((ROWS * COLS) / 8));
const indiaCells = [];

for (let row = 0; row < ROWS; row++) {
  const lat = 90 - (row + 0.5) * STEP;
  for (let col = 0; col < COLS; col++) {
    const lng = -180 + (col + 0.5) * STEP;
    if (!geoContains(landShape, [lng, lat])) continue;
    const index = row * COLS + col;
    bits[index >> 3] |= 1 << (index & 7);
    if (geoContains(india, [lng, lat])) indiaCells.push(index);
  }
}

writeFileSync(
  output,
  `/**
 * Land mask for the CTA globe, generated from Natural Earth 1:50m land
 * (public domain, via the world-atlas package) on a ${STEP}° grid.
 *
 * ${ROWS} rows (90°N → 90°S) × ${COLS} columns (180°W → 180°E), one bit per
 * cell, row-major, least-significant bit first, base64-encoded.
 * Regenerate with scripts/generate-globe-land.mjs.
 */
export const GLOBE_GRID = { step: ${STEP}, rows: ${ROWS}, cols: ${COLS} } as const;

export const GLOBE_LAND_MASK =
  '${Buffer.from(bits).toString('base64')}';

/** Cells (row * cols + col) inside India, tinted on the globe. */
export const GLOBE_INDIA_CELLS: readonly number[] = [${indiaCells.join(', ')}];
`,
);
