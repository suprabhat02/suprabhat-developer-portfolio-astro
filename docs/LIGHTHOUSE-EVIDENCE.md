# Lighthouse evidence

## Gate policy (2026-11-17 UTC)

The owner restored the strict requirement: Performance, Accessibility, Best
Practices and SEO score 100 in every run, with no exception for a 99. The
99–100 acceptance recorded for the visual scene redesign below applied to that
change only and no longer applies. Its measurements stay as recorded.

Open issue: the strict gate is not yet reliably green on the unchanged
homepages. On 2026-11-17, two Arabic mobile runs of the build now on `main`
scored 100 and 99 Performance; the miss came from Total Blocking Time (49 ms
in the passing run, 101 ms in the failing one), with FCP, LCP, Speed Index and
CLS all scoring 1.00. Earlier misses in this file came from Speed Index and
FCP. Until a dedicated performance change makes every run score 100, the gate
can fail on `main` itself, and no change to the built site is merged under the
strict requirement while it fails.

## Page outro refresh (2026-11-17 UTC)

**Status: BLOCKED for merge. Main passed 2/54 strict audits; the feature
passed 33/54.** The remaining 21 feature runs failed Performance. Accessibility,
Best Practices and SEO scored 100 in all 108 baseline and feature runs.
This is not an exception to the strict gate.

Baseline: `cf0338e00a9741123653456ae1a955fa06fa760e`.
Branch: `feat/page-outro-refresh`. Both builds used Node 22.23.4 and the same
machine, preview port 4323, nine paths, three runs, mobile and desktop.
Audits ran sequentially without concurrent tests, builds or screenshot browsers.
Machine-wide idleness cannot be guaranteed in a shared environment.
No failed Lighthouse run was repeated or discarded; no averages were used.

Performance scores, in run order:

| Path            | Profile | Main runs 1/2/3 | Feature runs 1/2/3 |
| --------------- | ------- | --------------- | ------------------ |
| `/`             | Mobile  | 84/99/99        | 99/96/96           |
| `/`             | Desktop | 96/96/95        | 94/94/94           |
| `/es/`          | Mobile  | 99/99/100       | 97/100/100         |
| `/es/`          | Desktop | 98/98/99        | 100/100/100        |
| `/ar/`          | Mobile  | 99/96/96        | 99/98/99           |
| `/ar/`          | Desktop | 98/96/97        | 100/100/99         |
| `/about/`       | Mobile  | 99/96/98        | 100/99/99          |
| `/about/`       | Desktop | 99/97/97        | 100/100/100        |
| `/es/about/`    | Mobile  | 98/98/98        | 99/99/99           |
| `/es/about/`    | Desktop | 99/99/99        | 100/100/100        |
| `/ar/about/`    | Mobile  | 98/99/98        | 100/99/99          |
| `/ar/about/`    | Desktop | 99/97/99        | 100/100/100        |
| `/services/`    | Mobile  | 99/98/100       | 100/100/100        |
| `/services/`    | Desktop | 99/99/98        | 100/100/100        |
| `/ar/services/` | Mobile  | 98/97/98        | 99/99/99           |
| `/ar/services/` | Desktop | 98/99/99        | 100/100/100        |
| `/blog/`        | Mobile  | 98/99/97        | 100/100/100        |
| `/blog/`        | Desktop | 99/97/98        | 100/100/100        |

All changed-path Performance scores were at least their corresponding baseline
scores, but that does **not** establish zero metric regression. Pairing by path,
profile and run number shows 10 FCP increases (largest +65.72 ms), 13 LCP
increases (largest +120.97 ms), and nine TBT increases (largest +95.81 ms).
No changed-path CLS or Speed Index increased. Measurement variability prevents
assigning these differences to the outro; it does not justify declaring the
no-regression requirement met. The three homepage HTML hashes are identical
to baseline; their pre-existing performance issues were not changed here.

Raw reports and the full 108-row FCP/LCP/TBT/CLS/Speed Index comparison are
retained in the session workspace:
`lighthouse-baseline/2026-11-17T17-11-35-380Z/`,
`lighthouse-branch/2026-11-17T18-21-05-151Z/`,
`lighthouse-all-runs.csv`, and `lighthouse-metric-deltas.json`.

Build (123 pages, zero diagnostics), lint and formatting passed. All 88 new
outro test executions passed. The final full suite reported 236 passed,
three skipped and one timeout in the unchanged homepage approach timeline
test. That test passed alone in 23.6 seconds, but the full-suite gate is not
green. Its timeout and unrelated homepage code were not modified.

Screenshot review covered all six requested widths, English/Arabic and both
themes, plus reduced motion, focused cards, focused CTA links and enlarged
grid-node crops: 44 images under `screenshots/` in the session workspace.
The reduced-motion checks also caught and fixed inherited 0.01 ms color
transitions inside the new cards; focus is checked immediately, without waiting
for those transitions to finish.

HTML gzip bytes (Node's default gzip level, identical settings before/after):

| Page         | Before |  After | Growth |
| ------------ | -----: | -----: | -----: |
| `/about/`    | 10,627 | 10,936 |   +309 |
| `/es/about/` | 10,948 | 11,251 |   +303 |
| `/ar/about/` |  9,147 |  9,467 |   +320 |

Homepage gzip sizes remain unchanged: en 49,913 B, es 49,350 B, ar 47,196 B.
The existing installed dependencies were retained rather than reinstalled with
`npm ci`; the task-local pinned Node installation did not change system Node.

## Visual scene redesign (2026-11-17 UTC)

**Status (superseded by the gate policy above): passed the owner's then-revised
99–100 requirement for this redesign.**
All eight final audits scored at least 99 Performance and 100 in the other
three categories. The original, stricter all-100 gate still passes only
6 of 8 runs; the two 99s below have not been hidden or relabeled as 100.
The production build was served by Astro preview at `http://127.0.0.1:4321`.
No audit-specific rendering, score averaging or best-run selection was used.

| Homepage | Profile | Performance Run 1 | Run 2 |
| -------- | ------- | ----------------- | ----- |
| English  | Mobile  | 100               | 100   |
| English  | Desktop | 100               | 99    |
| Arabic   | Mobile  | 99                | 100   |
| Arabic   | Desktop | 100               | 100   |

Accessibility, Best Practices and SEO scored 100 throughout; CLS was zero.
The English desktop miss had Speed Index 1.261 s, LCP 0.505 s and TBT 0 ms.
The Arabic mobile miss had FCP/LCP 1.635 s, Speed Index 1.877 s and TBT 50 ms.
Final reports are retained in the session workspace under
`lighthouse-final/2026-11-17T10-29-20-333Z/`.

An isolated production build of the unchanged `417d939` baseline was also
measured with the same runner: Arabic mobile scored 100 then 99, with the
other categories at 100. Reports:
`lighthouse-baseline/2026-11-17T10-08-20-459Z/`. This confirms that an all-100
failure also occurs on the baseline, not that every variation is explained.
Earlier exploratory scene-build audits also ranged from 99 to 100. The
final measurements above remain authoritative. After reviewing these
results, the owner requested that errors be fixed before pushing and that
Lighthouse score 99 or 100. That revised acceptance range applies to this
redesign; the audit runner's default strict all-100 behavior is unchanged.

Build, lint and repository formatting passed. The full Playwright suite
passed 141 tests with 3 existing skips. Screenshot review covered all five
sections at 390, 768, 1280 and 1440 px in English/Arabic, light theme, motion
frames, Spanish and reduced motion. A direct baseline comparison confirmed
unchanged scene-band dimensions and no clipped artwork at all four widths
in all three locales, including the small hero performance-scene reuse.

Homepage HTML sizes (gzip level 9; baseline `417d939`):

| Locale | Baseline raw | Final raw | Baseline gzip | Final gzip | Gzip growth |
| ------ | -----------: | --------: | ------------: | ---------: | ----------: |
| en     |    239,734 B | 254,711 B |      46,859 B |   49,525 B |    +2,666 B |
| es     |    232,407 B | 247,180 B |      46,332 B |   48,974 B |    +2,642 B |
| ar     |    234,206 B | 248,979 B |      43,947 B |   46,811 B |    +2,864 B |

Every increase is below the 8 KB budget. Initial-paint/Speed Index work
outside the requested scenes was not folded into this redesign. The
two 99 Performance results are within the revised acceptance range.

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
