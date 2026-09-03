# Suprabhat Kumar — portfolio (Nocturne rebuild)

Astro, static output, TypeScript strict. Dark-first Nocturne visual system.

Production URL: `https://suprabhat-dev.com`

Requires Node.js 22.12 or newer.

## Setup

```bash
npm install
npm run dev        # localhost:4321
npm run build      # → dist/
npm run preview
npm run generate:og
```

## Checks

```bash
npm run check      # astro check + tsc --noEmit
npm run lint
npm run format
npm run test:e2e   # Playwright + axe
```

## Editing content

The homepage and inner-page content are native Astro, driven by typed data and
content collections. The homepage entry point is `src/pages/index.astro`.

```
src/data/profile.ts          hero facts, about paragraphs, philosophy, contact
src/data/skills.ts           the three skill groups
src/data/experience.ts       employers, dates, locations, bullets
src/data/tools.ts            the twelve tools
src/data/work.ts             internal-work summaries
src/data/caseStudies.ts      localized case-study detail pages
src/data/recommendations.ts  quotes and attribution
src/data/faqs.ts             questions and answers
src/data/services.ts         service categories
src/data/navigation.ts       routes and nav labels
src/i18n/messages.ts         UI labels and short localized strings
src/content/blog/            English articles
src/content/blog-es/         Spanish articles
src/content/blog-ar/         Arabic articles
```

Editing `faqs.ts` updates both the visible FAQ and the FAQPage JSON-LD — they cannot drift.

## Translations

Supported locales are English (`en`), Spanish (`es`), and Arabic (`ar`). UI labels live in `src/i18n/messages.ts`; editorial copy lives in `src/data/`, `src/content/blog/`, `src/content/blog-es/`, and `src/content/blog-ar/`. Arabic routes set `dir="rtl"` on `<html>`; English and Spanish routes set `ltr`.

## Deployment

Production deployment is configured through GitHub Pages in `.github/workflows/deploy-pages.yml`.

- Build command: `npm run build`
- Output directory: `dist`
- Node: 22
- Canonical host: `https://suprabhat-dev.com`
- Sitemap: `https://suprabhat-dev.com/sitemap-index.xml`
- RSS: `https://suprabhat-dev.com/rss.xml`, `https://suprabhat-dev.com/es/rss.xml`, `https://suprabhat-dev.com/ar/rss.xml`

The blog index in each locale exposes crawlable topic archive links under `/blog/tags/`, `/es/blog/tags/`, and `/ar/blog/tags/`. Article pages link back to their localized topic archives and related articles.

`netlify.toml` is kept as an alternate static-hosting configuration because it can express redirects and response headers that GitHub Pages cannot.

## Environment variables

Set the existing Web3Forms access key as a hosting secret or environment variable — never in the repo:

```
PUBLIC_WEB3FORMS_KEY
```

## Open TODOs

See `docs/TODO.md`. Nothing in it has been filled in with invented content.
