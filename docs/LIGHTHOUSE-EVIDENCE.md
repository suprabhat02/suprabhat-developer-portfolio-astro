# Lighthouse evidence

## Report-driven optimization pass (2026-10-31 UTC)

**Status: still BLOCKED. Final strict gate: 9 of 18 runs scored 100 in all
four categories.** Accessibility, Best Practices and SEO were 100 in all 18
runs, and CLS was 0. The other nine runs scored 98–99 Performance.

### What the supplied PDFs measured

The supplied desktop (56) and mobile (51) reports audited
`http://localhost:4321/`, the **development server**. Their JavaScript
findings (`/@vite/client`, Astro dev toolbar, `aria-query`,
`axobject-query`, unminified `motion.ts`, about 1,498 KiB of minification
savings), the uncompressed document, the dev `/_image` endpoint, and the
SEO 92 "Learn more" link (the dev toolbar's settings panel, linking to
the Astro CLI reference) are not in the production build. Production
preview and live GitHub Pages both serve gzip; GitHub Pages sends
`Cache-Control: max-age=600`, which this repository cannot change.

### Production fixes

| Finding                                | Root cause                                                                                                      | Change                                                                                                                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `suprabhat.webp` 155 KiB               | Full 640 px portrait used as a 52 px world-map avatar                                                           | `WorldMap.astro` uses responsive AVIF/WebP at 52/104 px: 0.8–1.9 KB                                                                                          |
| Portrait over-/under-delivery          | `sizes` didn't match rendered widths (too small at 1041–1199 px, too large on phones)                           | `images.ts`: `sizes` from measured widths; 440w candidate replaced with exact 450w for 442 px desktop                                                        |
| `offset-distance` not composited       | CSS motion path for world-map packets                                                                           | Shared `transform` keyframes from 20 equal-arc-length stops; maximum deviation from the original path 0.354 SVG units                                        |
| `xp-dot-on` not composited             | Animated background, border and shadow                                                                          | `global.css`: a `::after` with the identical lit state cross-fades with `opacity`                                                                            |
| Unminified 6.4 KB inline header script | `is:inline` bypassed the build                                                                                  | `Header.astro`: processed, typed, minified Astro script                                                                                                      |
| Large homepage document                | World-map land path written with absolute coordinates                                                           | Same 0.1-unit points as relative moves: compressed HTML 44.3 → 40.3 KB                                                                                       |
| Slow first paint and Speed Index       | Skew on the blurred, masked aurora container, plus a paused animation still promoting a ~3,000 px blended layer | Skew moved to each layer (max 14/255 color difference on 0.41% of hero pixels); drift animation attached on first hover, focus or tap, identical first frame |

Measured with interleaved Lighthouse runs through a gzip proxy:
per-layer skew cut median mobile observed FCP from 1,234 to 991 ms;
attaching the drift on engagement cut Arabic mobile Speed Index from
2,458 to 1,641 ms (median, four runs each) and English desktop Speed Index
from 1,206 to 1,016 ms (median, five runs each).

Not changed, with reasons: `fx-reveal` blur on timeline cards and toolbox
items is inherently non-compositable and only runs while scrolling; removing
it would change the design. DOM size (about 2,360 elements) is real
content. Unused CSS is mostly below-the-fold rules; an inlining experiment
did not improve measured results and was reverted.

### Final strict gate

Reports: `lighthouse-reports/2026-10-31T07-26-50-732Z/`.

| Homepage | Profile | Performance Run 1 | Run 2 | Run 3 |
| -------- | ------- | ----------------- | ----- | ----- |
| English  | Mobile  | 100               | 100   | 100   |
| English  | Desktop | 99                | 100   | 99    |
| Spanish  | Mobile  | 98                | 100   | 99    |
| Spanish  | Desktop | 98                | 99    | 100   |
| Arabic   | Mobile  | 98                | 99    | 99    |
| Arabic   | Desktop | 100               | 100   | 100   |

Every miss is Speed Index (and on mobile, simulated FCP). Identical builds
ranged from 889 to 1,494 ms desktop and 1,585 to 3,611 ms mobile Speed
Index. Lighthouse's mobile estimate weights observed Speed Index by 1.4,
and observed first paint on this machine is dominated by GPU-process
rasterization of the hero. A minimal one-heading page scores 100 here,
so the remaining cost is the hero's large decorative raster surface,
not JavaScript (TBT ≤ 74 ms, no forced reflow). Removing the aurora
entirely would likely close the gap but changes the design; that requires
an explicit owner decision. Results from a second machine, or from the
deployed site measured with PageSpeed Insights, are still needed before
treating the 100 requirement as met or unmet in production.

## Strict release gate (2026-10-30 UTC)

**Status: BLOCKED. The required all-100 homepage gate has not passed.**

Final production build served at `http://127.0.0.1:4323`, using Node
22.23.4, pinned Lighthouse 13.6.0, and Playwright's headless Chromium.
The audit runner used the standard mobile profile and desktop preset,
fresh Lighthouse browser processes, and all four requested categories.
Every run must have a raw category score of `1`; there is no averaging,
best-run selection, audit-only rendering, or waiver for a 99.

### Final homepage repetitions

| Homepage | Profile | Performance Run 1 | Run 2 | Run 3 |
| -------- | ------- | ----------------- | ----- | ----- |
| English  | Mobile  | 100               | 100   | 99    |
| English  | Desktop | 100               | 100   | 99    |
| Spanish  | Mobile  | 100               | 100   | 100   |
| Spanish  | Desktop | 100               | 100   | 100   |
| Arabic   | Mobile  | 99                | 99    | 100   |
| Arabic   | Desktop | 99                | 99    | 100   |

Accessibility, Best Practices, and SEO were **100 in all 18 runs**.
CLS was zero throughout. Twelve runs passed the complete strict gate;
six failed on Performance, so the command exited with code 1.

The English desktop failure had Speed Index 1.366 s, LCP 0.499 s, and
TBT 0 ms. Arabic desktop failures had Speed Index 1.149-1.171 s and
TBT 0 ms. The failing mobile samples had FCP/LCP 1.116-1.614 s,
Speed Index 2.329-2.505 s, and TBT 15-84 ms. These measurements identify
remaining paint/visual-completion and occasional blocking-time sensitivity;
they do not establish one proven root cause for every variation.

All final homepage JSON reports, HTML hashes, versions, and the complete
summary are retained locally under:

```text
lighthouse-reports/2026-10-30T22-28-23-289Z/
```

### Representative inner-page checks

One mobile and one desktop run for each of these routes passed all four
categories at 100: **10 of 10 runs passed**.

- `/services/`
- `/tools/`
- `/work/performance-modernization/`
- `/blog/frontend-code-review-checklist/`
- `/contact/`

Reports are retained under:

```text
lighthouse-reports/2026-10-30T22-33-52-194Z/
```

This is representative template coverage, not Lighthouse certification of
every generated route or every locale of those templates.

### Changes and regression checks

- Added `npm run audit:lighthouse`, pinned its Lighthouse version, and
  verified that its report validator rejects 99 and accepts four 100s.
- Kept the aurora complete at rest, activating its drift through ordinary
  hover, focus, or touch/pen input. Bounded the blurred surface to 64rem.
  The header now appears immediately. Orbit and border animations remain.
- Reverted experiments that did not demonstrate a useful improvement:
  global CSS inlining and pausing the hero orbit/borders. Earlier exploratory
  reports remain in their timestamped local directories.
- Added separate `data-tap-motion` activation for the hero so it does not
  acquire the living-card styling contract. Existing card depth, touch,
  focus, RTL, and reduced-motion behavior passed regression checks.
- Updated localized homepage descriptions, the English role-focused title,
  and indexed-page robots metadata with `max-image-preview:large`.
- Whole-build technical SEO checks passed for all **78 indexable HTML
  pages**, including canonical/sitemap consistency, reciprocal language
  metadata, internal destinations/fragments, incoming links, share metadata,
  image alternatives, and parseable JSON-LD. Intentional noindex routes are
  separately checked by the existing build inventory.
- Final build, lint, plain repository-wide format check, and diff whitespace
  check passed. Full Playwright suite: **93 passed, 1 expected skip**.
- The targeted `fast-uri` transitive update cleared the development-tool
  advisory. Full `npm audit` reported **zero vulnerabilities**.
- Desktop and mobile screenshots were inspected for English, Spanish, and
  Arabic, with portrait decoding verified before desktop captures.

### Limits and release decision

Do not treat this evidence as authorization to merge or deploy under the
strict all-100 requirement. The remaining homepage failures must be resolved
and the complete gate rerun; successful inner-page audits do not override
them. No commit, push, merge, or deployment was performed.

These are local lab results, not field data. Production-only Cloudflare
analytics, live hosting/CDN behavior, and search-engine indexing require
post-deployment/account verification. Search rankings and Google/Bing/AI
citations cannot be guaranteed by Lighthouse. See `SEO-OPERATIONS.md` for
the keyword hypotheses, release commands, and owner-facing verification steps.

## Production homepage desktop run

- Source report: `suprabhat-dev.com-20260910T174028.html`
- Tested URL: `https://suprabhat-dev.com/`
- Fetch time: `2026-09-10T12:10:28.199Z`
- Mode: navigation, desktop
- Lighthouse: `13.4.1`
- Browser: Chrome `152.0.0.0` on Windows 10
- SHA-256: `08E3575276AC3E9001267FC2ADA60F9284EDBA3853AD408918BAB7EB6A0E33F7`

## Results

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- Agentic Browsing: 100
- First Contentful Paint: 0.4 s
- Largest Contentful Paint: 0.6 s
- Total Blocking Time: 0 ms
- Cumulative Layout Shift: 0
- Speed Index: 0.8 s
- Total transfer size: 190 KiB

These are laboratory measurements from one desktop run, not field data. Results can vary with browser state, extensions, network conditions, device performance, geographic location, and later deployments.

The report's unused-JavaScript diagnostic came entirely from the React Developer Tools browser extension (`chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/`), not from the production Astro application.

## Local palette and skills validation (2026-10-30 UTC)

Production build served through Astro preview at `http://127.0.0.1:4323`,
audited with Lighthouse 13.6.0 and headless Playwright Chromium. Mobile used
the default Lighthouse profile; desktop used `--preset=desktop`. All four
standard categories were enabled. These are local lab results, not a new
production deployment or physical-device certification.

| Homepage | Profile | Performance | Accessibility | Best Practices | SEO | CLS |
| -------- | ------- | ----------- | ------------- | -------------- | --- | --- |
| English  | Mobile  | 100         | 100           | 100            | 100 | 0   |
| English  | Desktop | 100         | 100           | 100            | 100 | 0   |
| Spanish  | Mobile  | 100         | 100           | 100            | 100 | 0   |
| Spanish  | Desktop | 100         | 100           | 100            | 100 | 0   |
| Arabic   | Mobile  | 99          | 100           | 100            | 100 | 0   |
| Arabic   | Desktop | 99          | 100           | 100            | 100 | 0   |

Arabic repeated at 99 Performance without code changes. Its repeated mobile
FCP/LCP was 1.46 s and Speed Index 2.71 s; desktop LCP was 0.45 s and Speed
Index 1.16 s. The all-locales 100 Performance requirement remains unmet; the
other three categories and zero layout shift were confirmed on every run.
JSON reports were retained in the local OS temporary directory as
`portfolio-lh-{locale}-{profile}.json`, with separate Arabic `-repeat` reports.

The final standard Playwright suite passed 91 tests with one skip. The
12-profile device matrix passed its 60 core checks after five tablet failures
were repaired and rerun, plus 24 world-map and toolbox checks on the final
build. The matrix covers emulated phones, tablets and desktop Chromium,
Firefox and WebKit, including all three locales and reduced-motion behavior.

## Six-category follow-up

After adding Astro, shadcn/ui, Zod and GitHub Actions, the homepage and
dedicated Skills/Tools pages were checked for three category columns and two
rows on desktop, with responsive layouts and all three locales preserved.
The full suite passed 91 tests with one skip. Four additional focused runs
passed on small iPhone, iPad, Firefox and desktop WebKit profiles.

Fresh mobile Lighthouse checks of the production preview reported:

- English: 100 Performance, Accessibility, Best Practices and SEO; CLS 0.
- Spanish: 99 Performance, 100 in the other three categories; CLS 0.
- Arabic: 100 Performance, Accessibility, Best Practices and SEO; CLS 0.

Reports are retained in the OS temporary directory as
`portfolio-categories-{locale}-mobile.json`. Desktop Lighthouse was not rerun
for this follow-up. Uniform 100 Performance across locales remains unverified.
