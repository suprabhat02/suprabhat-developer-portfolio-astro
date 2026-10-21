import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createServer } from 'vite';

const width = 1200;
const height = 630;
const portrait = await sharp('public/assets/images/portrait-1100.webp')
  .resize(470, height, { fit: 'cover', position: 'north' })
  .jpeg({ quality: 88, progressive: true })
  .toBuffer();

const copy = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#00c872" stroke-opacity="0.1"/>
      </pattern>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#00c872"/>
        <stop offset="1" stop-color="#f8a3e5"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="#020c19"/>
    <rect width="730" height="630" fill="url(#grid)"/>
    <rect x="64" y="78" width="10" height="10" fill="url(#brand)"/>
    <text x="92" y="90" fill="#b4c6db" font-family="Arial, sans-serif" font-size="21" font-weight="600">SENIOR FRONTEND ENGINEER</text>
    <text x="64" y="245" fill="#eff6fd" font-family="Arial, sans-serif" font-size="78" font-weight="700">SUPRABHAT</text>
    <text x="64" y="330" fill="url(#brand)" font-family="Arial, sans-serif" font-size="78" font-weight="700">KUMAR</text>
    <text x="64" y="420" fill="#b4c6db" font-family="Arial, sans-serif" font-size="26">React · Next.js · TypeScript · FastAPI</text>
    <text x="64" y="525" fill="#eff6fd" font-family="Arial, sans-serif" font-size="23">Fast, accessible SaaS frontends and data dashboards</text>
    <rect x="730" width="6" height="630" fill="url(#brand)"/>
  </svg>`);

await sharp({
  create: { width, height, channels: 3, background: '#020c19' },
})
  .composite([
    { input: copy, left: 0, top: 0 },
    { input: portrait, left: 730, top: 0 },
  ])
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile('public/assets/images/og-image.jpg');

console.log('Generated public/assets/images/og-image.jpg (1200x630).');

// Case-study share cards in the blog-cover style. Every locale reuses the
// English card, so it is drawn from the English title and tags.
const vite = await createServer({
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
const { getCaseStudies } = await vite.ssrLoadModule('/src/data/caseStudies.ts');
const caseStudies = getCaseStudies('en');
await vite.close();

const geistMono = (
  await readFile(
    'node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
  )
).toString('base64');
const escapeHtml = (text) =>
  text.replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  );
const caseStudyCard = ({ title, tags }) => `<!doctype html>
<html lang="en">
  <head>
    <style>
      @font-face {
        font-family: 'Geist Mono';
        font-weight: 100 900;
        src: url(data:font/woff2;base64,${geistMono}) format('woff2');
      }
      * { margin: 0; box-sizing: border-box; }
      body {
        position: relative;
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
        background: #020c19;
        color: #eff6fd;
        font-family: 'Geist Mono', monospace;
      }
      .bar { position: absolute; inset: 0 auto 0 0; width: 10px; background: #00c872; }
      .mark { position: absolute; top: 68px; left: 98px; width: 50px; height: 44px; }
      .copy { position: absolute; top: 180px; left: 98px; right: 98px; }
      .eyebrow { color: #00c872; font-size: 22px; font-weight: 600; letter-spacing: 0.14em; }
      h1 { margin-top: 22px; font-size: 64px; font-weight: 700; line-height: 1.12; }
      .tags { margin-top: 26px; color: #b4c6db; font-size: 25px; line-height: 1.5; }
      .domain { position: absolute; left: 98px; bottom: 64px; color: #00c872; font-size: 24px; }
    </style>
  </head>
  <body>
    <div class="bar"></div>
    <svg class="mark" viewBox="0 0 25.1 22" aria-hidden="true">
      <path fill="#eff6fd" d="M16.6 0H6.99A6.99 6.25 0 0 0 6.99 12.5H11.27A2.73 2.75 0 0 1 11.27 18H1V22H11.27A7.53 6.75 0 0 0 11.27 8.5H6.99A2.19 2.25 0 0 1 6.99 4H16.6Z"/>
      <rect fill="#00c872" x="21.1" y="18" width="4" height="4"/>
    </svg>
    <div class="copy">
      <p class="eyebrow">CASE STUDY</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="tags">${tags.map(escapeHtml).join(' · ')}</p>
    </div>
    <p class="domain">suprabhat-dev.com</p>
  </body>
</html>`;

await mkdir('public/images/work', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
for (const caseStudy of caseStudies) {
  await page.setContent(caseStudyCard(caseStudy));
  await page.evaluate('document.fonts.ready');
  const output = `public/images/work/${caseStudy.slug}-og-1200x630.png`;
  await sharp(await page.screenshot())
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);
  console.log(`Generated ${output} (1200x630).`);
}
await browser.close();
