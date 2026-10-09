import sharp from 'sharp';

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
        <path d="M48 0H0V48" fill="none" stroke="#0070f3" stroke-opacity="0.1"/>
      </pattern>
      <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#0070f3"/>
        <stop offset="1" stop-color="#52a8ff"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="#000000"/>
    <rect width="730" height="630" fill="url(#grid)"/>
    <rect x="64" y="78" width="10" height="10" fill="url(#brand)"/>
    <text x="92" y="90" fill="#a1a1a1" font-family="Arial, sans-serif" font-size="21" font-weight="600">SENIOR FRONTEND ENGINEER</text>
    <text x="64" y="245" fill="#ededed" font-family="Arial, sans-serif" font-size="78" font-weight="700">SUPRABHAT</text>
    <text x="64" y="330" fill="url(#brand)" font-family="Arial, sans-serif" font-size="78" font-weight="700">KUMAR</text>
    <text x="64" y="420" fill="#a1a1a1" font-family="Arial, sans-serif" font-size="26">React · Next.js · TypeScript · FastAPI</text>
    <text x="64" y="525" fill="#ededed" font-family="Arial, sans-serif" font-size="23">Fast, accessible SaaS frontends and data dashboards</text>
    <rect x="730" width="6" height="630" fill="url(#brand)"/>
  </svg>`);

await sharp({
  create: { width, height, channels: 3, background: '#000000' },
})
  .composite([
    { input: copy, left: 0, top: 0 },
    { input: portrait, left: 730, top: 0 },
  ])
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile('public/assets/images/og-image.jpg');

console.log('Generated public/assets/images/og-image.jpg (1200x630).');
