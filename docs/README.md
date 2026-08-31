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
src/data/recommendations.ts  quotes and attribution
src/data/faqs.ts             questions and answers
src/data/services.ts         service categories
src/data/navigation.ts       routes and nav labels
src/content/blog/            one .md per article
```

Editing `faqs.ts` updates both the visible FAQ and the FAQPage JSON-LD — they cannot drift.

## Translations

`src/i18n/translations/{en,hi,ar}/ui.json` holds interface strings only. Editorial copy lives in `src/data/` keyed by locale; a locale with no entry falls back to `en` and the page is emitted `noindex` until a reviewed translation exists. `ar` sets `dir="rtl"` on `<html>`; `en` and `hi` set `ltr`.

## Deployment (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- Node: 22
- Canonical host: `https://suprabhat-dev.com`
- Sitemap: `https://suprabhat-dev.com/sitemap-index.xml`
- RSS: `https://suprabhat-dev.com/rss.xml`

## Environment variables

Set the existing Web3Forms access key in the Netlify UI — never in the repo:

```
PUBLIC_WEB3FORMS_KEY
```

## Open TODOs

See `docs/TODO.md`. Nothing in it has been filled in with invented content.
