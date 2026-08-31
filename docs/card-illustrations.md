# Card Illustrations

Place downloaded unDraw SVG files in `public/assets/illustrations/`. Do not put
card art in `src/`, `uploads/`, or a new top-level image folder.

Use these exact filenames when the card imagery is added:

| Section           | Card                           | File                           |
| ----------------- | ------------------------------ | ------------------------------ |
| Featured articles | Performance article            | `article-performance.svg`      |
| Featured articles | Accessibility article          | `article-accessibility.svg`    |
| Featured articles | UI engineering article         | `article-ui-engineering.svg`   |
| About me          | Performance-first              | `about-performance.svg`        |
| About me          | Accessibility by default       | `about-accessibility.svg`      |
| About me          | Scalable architecture          | `about-architecture.svg`       |
| About me          | Full-stack capable             | `about-fullstack.svg`          |
| Core expertise    | Front-end engineering          | `expertise-frontend.svg`       |
| Core expertise    | Back-end and API integration   | `expertise-backend.svg`        |
| Core expertise    | Design systems and performance | `expertise-design-systems.svg` |

## Choosing and preparing illustrations

- Download the original SVG from unDraw, not a screenshot or a raster export.
- Choose images with generous empty space and a single clear subject. Good
  search terms: `performance`, `accessibility`, `design system`, `developer`,
  `server`, `dashboard`, and `collaboration`.
- Set unDraw's accent color to `#f07e1c` before downloading so illustrations
  match the existing orange accent without runtime recoloring.
- Do not inline SVG markup in the homepage. Files in `public/assets/illustrations/`
  can be cached independently and keep the HTML lean.
- Optimize each SVG with SVGO before committing. Remove `<title>`, `<desc>`,
  editor metadata, and unused definitions. Keep each illustration below 20 KB
  where practical.

## Implementation standard

Each illustration should be rendered as a decorative `<img>` within its card:

```astro
<img
  class="card-illustration"
  src="/assets/illustrations/expertise-frontend.svg"
  alt=""
  aria-hidden="true"
  loading="lazy"
  decoding="async"
/>
```

Use the existing card fade/overlay above the illustration. The image must never
carry essential information, so an empty `alt` prevents duplicate screen-reader
announcements and keeps SEO focused on the card's actual heading and text.

Do not preload these files: all target cards are below the fold. Native lazy
loading, immutable filename caching, optimized SVGs, and no third-party CDN
requests give the best performance without changing search indexing.
