import { mkdir, readdir, readFile } from 'node:fs/promises';
import process from 'node:process';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createServer } from 'vite';

// Share images are rendered outside CSS, so they use static copies of the
// dark palette tokens (see docs/THEMING.md, "Make it permanent").
const palette = {
  bg: '#070c10',
  text: '#f3f5f8',
  text2: '#bec5cc',
  accent: '#ff4d2a',
};

// Every card is laid out on a 1200x630 canvas. Blog covers are captured at
// 4/3 scale (1600x840) so all share images keep the same proportions.
const width = 1200;
const height = 630;

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

const page = (body, styles) => `<!doctype html>
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
        background: ${palette.bg};
        color: ${palette.text};
        font-family: 'Geist Mono', monospace;
      }
      ${styles}
    </style>
  </head>
  <body>${body}</body>
</html>`;

const brandMark = `<svg class="mark" viewBox="0 0 25.1 22" aria-hidden="true">
  <path fill="${palette.text}" d="M16.6 0H6.99A6.99 6.25 0 0 0 6.99 12.5H11.27A2.73 2.75 0 0 1 11.27 18H1V22H11.27A7.53 6.75 0 0 0 11.27 8.5H6.99A2.19 2.25 0 0 1 6.99 4H16.6Z"/>
  <rect fill="${palette.accent}" x="21.1" y="18" width="4" height="4"/>
</svg>`;

// Shared layout for case-study cards and blog covers.
const cardStyles = `
  .bar { position: absolute; inset: 0 auto 0 0; width: 10px; background: ${palette.accent}; }
  .mark { position: absolute; top: 68px; left: 98px; width: 50px; height: 44px; }
  .copy { position: absolute; top: 180px; left: 98px; right: 98px; }
  .eyebrow { color: ${palette.accent}; font-size: 22px; font-weight: 600; letter-spacing: 0.14em; }
  h1 { margin-top: 22px; font-size: 64px; font-weight: 700; line-height: 1.12; }
  h1.long { font-size: 52px; }
  .detail { margin-top: 26px; color: ${palette.text2}; font-size: 25px; line-height: 1.5; }
  .domain { position: absolute; left: 98px; bottom: 64px; color: ${palette.accent}; font-size: 24px; }
`;
const card = ({ eyebrow, title, detail }) =>
  page(
    `<div class="bar"></div>
    ${brandMark}
    <div class="copy">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h1${title.length > 40 ? ' class="long"' : ''}>${escapeHtml(title)}</h1>
      <p class="detail">${escapeHtml(detail)}</p>
    </div>
    <p class="domain">suprabhat-dev.com</p>`,
    cardStyles,
  );

// Default share image: name and role beside the portrait.
const portrait = (
  await sharp('public/assets/images/portrait-1100.webp')
    .resize(470, height, { fit: 'cover', position: 'north' })
    .jpeg({ quality: 88 })
    .toBuffer()
).toString('base64');
const defaultCard = page(
  `<div class="grid"></div>
  <div class="copy">
    <p class="eyebrow"><span class="dot"></span>SENIOR FRONTEND ENGINEER</p>
    <h1>SUPRABHAT<br /><span class="brand">KUMAR</span></h1>
    <p class="stack">React · Next.js · TypeScript · FastAPI</p>
    <p class="pitch">Fast, accessible SaaS frontends and data dashboards</p>
  </div>
  <div class="rule"></div>
  <img class="portrait" src="data:image/jpeg;base64,${portrait}" alt="" />`,
  `
  .grid {
    position: absolute; inset: 0 auto 0 0; width: 730px;
    background-image:
      linear-gradient(to right, rgb(255 77 42 / 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(255 77 42 / 0.1) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .copy { position: absolute; top: 74px; left: 64px; width: 610px; }
  .eyebrow { display: flex; align-items: center; gap: 16px; color: ${palette.text2}; font-size: 20px; font-weight: 600; letter-spacing: 0.08em; }
  .dot { width: 10px; height: 10px; background: ${palette.accent}; }
  h1 { margin-top: 82px; font-size: 76px; font-weight: 700; line-height: 1.08; letter-spacing: -0.02em; }
  .brand { color: ${palette.accent}; }
  .stack { margin-top: 44px; color: ${palette.text2}; font-size: 24px; }
  .pitch { margin-top: 62px; font-size: 21px; line-height: 1.4; }
  .rule { position: absolute; top: 0; left: 730px; width: 6px; height: 100%; background: ${palette.accent}; }
  .portrait { position: absolute; top: 0; left: 730px; width: 470px; height: 630px; object-fit: cover; }
  .rule { z-index: 1; }
  `,
);

// Case-study cards. Every locale reuses the English card, so it is drawn from
// the English title and tags.
const vite = await createServer({
  configFile: false,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
const { getCaseStudies } = await vite.ssrLoadModule('/src/data/caseStudies.ts');
const caseStudies = getCaseStudies('en');
const { sectionPages, getSectionPageMeta, getSectionPageImage } =
  await vite.ssrLoadModule('/src/data/pageSeo.ts');
await vite.close();

// Blog covers: the share image and on-page cover for every locale of each
// article. Titles are the short cover headlines, not the article titles.
const blogCovers = [
  {
    slug: 'accessibility-in-react-what-developers-skip',
    title: 'Accessibility in React',
    detail: 'What Most Developers Skip',
  },
  {
    slug: 'clean-ui-design-principles-frontend',
    title: 'Clean UI Design Principles',
    detail: 'Spacing, OKLCH tokens, motion and contrast in code',
  },
  {
    slug: 'cloud-web-interface-design-best-practices',
    title: 'Cloud Web Interface Design',
    detail: 'Best practices for scalable, accessible UIs',
  },
  {
    slug: 'frontend-best-practices-clean-ui',
    title: 'Scalable React UI',
    detail: 'Without overengineering',
  },
  {
    slug: 'frontend-code-review-checklist',
    title: 'Frontend Code Review Checklist',
    detail: 'A risk-first review order for safer releases',
  },
  {
    slug: 'hiring-senior-frontend-engineer',
    title: 'What to Look For When Hiring a Senior Frontend Engineer',
    detail: 'Skills, signals and interview questions',
  },
  {
    slug: 'why-clean-minimal-ui-professional-website',
    title: 'Why Minimal UI Works',
    detail: 'Clarity, hierarchy and conversion',
  },
];

// Every English article needs a cover entry, and every entry an article.
const articleSlugs = (await readdir('src/content/blog'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''))
  .sort();
const coverSlugs = blogCovers.map(({ slug }) => slug).sort();
if (articleSlugs.join() !== coverSlugs.join()) {
  throw new Error(
    `blogCovers must match src/content/blog.\n  articles: ${articleSlugs.join(', ')}\n  covers:   ${coverSlugs.join(', ')}`,
  );
}

// PLAYWRIGHT_CHROMIUM_PATH lets the script run where the bundled browser
// is a different build (for example a preinstalled Chromium).
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});
const render = async (html, scale) => {
  const tab = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: scale,
  });
  await tab.setContent(html);
  await tab.evaluate('document.fonts.ready');
  const shot = await tab.screenshot();
  await tab.close();
  return shot;
};

await mkdir('public/images/pages', { recursive: true });
for (const section of sectionPages) {
  const { title } = getSectionPageMeta('en', section);
  const output = `public${getSectionPageImage(section)}`;
  await sharp(
    await render(
      card({
        eyebrow: 'SUPRABHAT KUMAR',
        title,
        detail: 'React · Next.js · TypeScript',
      }),
      1,
    ),
  )
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(output);
  console.log(`Generated ${output} (1200x630).`);
}
if (process.argv.includes('--sections-only')) {
  await browser.close();
  process.exit(0);
}

await sharp(await render(defaultCard, 1))
  .jpeg({ quality: 86, progressive: true, mozjpeg: true })
  .toFile('public/assets/images/og-image.jpg');
console.log('Generated public/assets/images/og-image.jpg (1200x630).');

await mkdir('public/images/work', { recursive: true });
for (const { slug, title, tags } of caseStudies) {
  const output = `public/images/work/${slug}-og-1200x630.png`;
  await sharp(
    await render(
      card({ eyebrow: 'CASE STUDY', title, detail: tags.join(' · ') }),
      1,
    ),
  )
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);
  console.log(`Generated ${output} (1200x630).`);
}

await mkdir('public/images/blog', { recursive: true });
for (const { slug, title, detail } of blogCovers) {
  const output = `public/images/blog/${slug}-cover-1600x840.png`;
  await sharp(await render(card({ eyebrow: 'ARTICLE', title, detail }), 4 / 3))
    .png({ compressionLevel: 9, palette: true })
    .toFile(output);
  console.log(`Generated ${output} (1600x840).`);
}

await browser.close();
