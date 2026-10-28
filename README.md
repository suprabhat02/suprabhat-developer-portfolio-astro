<h1 align="center">suprabhat-dev.com</h1>

<p align="center">
  The source of my developer portfolio and blog — a static, multilingual Astro site built to be fast, accessible and easy to find.
</p>

<p align="center">
  <a href="https://suprabhat-dev.com"><b>🌐 Live site</b></a> ·
  <a href="https://suprabhat-dev.com/blog/"><b>📝 Blog</b></a> ·
  <a href="https://suprabhat-dev.com/rss.xml"><b>📡 RSS</b></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Lighthouse-100%20%C2%B7%20100%20%C2%B7%20100%20%C2%B7%20100-0CCE6B?style=flat-square&logo=lighthouse&logoColor=white" alt="Lighthouse 100 across all categories"/>
  <img src="https://img.shields.io/badge/Astro-static-BC52EE?style=flat-square&logo=astro&logoColor=white" alt="Astro"/>
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript strict"/>
  <img src="https://img.shields.io/badge/i18n-EN%20%C2%B7%20ES%20%C2%B7%20AR%20(RTL)-555?style=flat-square" alt="English, Spanish, Arabic"/>
</p>

---

## Highlights

- **Lighthouse 100 / 100 / 100 / 100** on the production homepage (desktop) — LCP 0.6 s, TBT 0 ms, CLS 0, ~190 KiB transferred. Evidence and caveats in [`docs/LIGHTHOUSE-EVIDENCE.md`](docs/LIGHTHOUSE-EVIDENCE.md).
- **Three locales — English, Spanish and Arabic** — with a full right-to-left layout for Arabic, localised blog collections and locale-aware sitemaps.
- **SEO built in**: JSON-LD structured data, per-post `lastmod` in the sitemap, generated Open Graph images, RSS feeds, and IndexNow notifications after content-affecting production deployments (posts cross-posted to dev.to and Hashnode use canonical URLs pointing back here).
- **Dark-first design system** with theme tokens and a zero-dependency motion layer — see [`docs/THEMING.md`](docs/THEMING.md) and [`docs/MOTION.md`](docs/MOTION.md).
- **Accessibility covered by end-to-end tests** — Playwright with axe-core scans.
- Dogfoods my own open-source library, [**react-smart-copy**](https://github.com/suprabhat02/react-smart-copy), for copy interactions.

## Tech stack

| Area      | Tools                                                               |
| --------- | ------------------------------------------------------------------- |
| Framework | Astro (static output), TypeScript in strict mode                    |
| Content   | Markdown content collections, `@astrojs/rss`, `@astrojs/sitemap`    |
| Quality   | ESLint, Prettier, `astro check`, Playwright, `@axe-core/playwright` |
| Assets    | Sharp, SVGO, generated OG images                                    |
| Delivery  | GitHub Actions → GitHub Pages                                       |

## Project structure

```text
src/
├── components/   # Astro components (header, timeline, case studies, SEO head…)
├── content/      # Blog posts per locale (blog, blog-es, blog-ar) + JSON data
├── data/         # Typed site data: experience, case studies, FAQs, navigation
├── i18n/         # Locale config and UI message catalogues
├── layouts/
├── pages/        # Routes, including /es, /ar, /blog, /work and rss.xml
└── styles/       # Theme tokens and global styles
docs/             # Theming, motion, SEO, deployment and Lighthouse notes
scripts/          # OG image and globe-map generators
tests/            # Playwright end-to-end + accessibility tests
```

## Running locally

Requires **Node.js 22.23.4+**. The repository pins Node.js `22.23.4` in `.nvmrc` so local builds and CI use the same supported patch.

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # type-check + build to dist/
npm run preview      # serve the production build
npm run lint         # ESLint
npm run test:e2e     # Playwright + axe accessibility checks
npm run generate:og  # regenerate Open Graph images
```

More detail lives in [`docs/README.md`](docs/README.md) and [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Author

**Suprabhat** — Senior Frontend Engineer working with React, TypeScript and Next.js.

[Portfolio](https://suprabhat-dev.com) · [GitHub](https://github.com/suprabhat02) · [X](https://x.com/SuprabhatKarn97) · [dev.to](https://dev.to/suprabhat02)

If you find something useful here, a ⭐ is always appreciated.
