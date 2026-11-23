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

## Homepage LCP miss: Lighthouse timestamp precision (2026-11-19 UTC)

Pattern: a mobile homepage run (`/`, `/es/` or `/ar/`) occasionally scored 99
Performance with simulated LCP about 600 ms above FCP (1801 to 1860 ms against
1201 to 1260 ms) while TBT, Speed Index and CLS were unchanged. It appeared in
10 of 156 local homepage runs saved between 2026-11-15 and 2026-11-19, on
`main` and on feature branches alike.

Cause: Lighthouse 13.6.0 ships `@paulirish/trace_engine` 0.0.67. Its Lantern
LCP estimate reuses the FCP estimate for a text LCP only when the trace's FCP
and LCP timestamps are exactly equal. In a saved failing run of `/es/`, FCP was
at 17.307 ms and the LCP candidate (the hero `h1`, type `text`) at 17.308 ms:
the same frame, 1 µs apart. Chromium wrote the FCP timestamp through double
seconds, which can truncate it by 1 µs (crbug 583885865). Lantern then used its
first-paint graph, which counts every request started before LCP; re-scoring
that run with single requests removed showed the font preload alone worth
about 220 ms, and no single request accounting for the whole 600 ms.

Fix: trace engine 0.0.69 treats timestamps within 10 µs as the same frame. The
`overrides` entry in `package.json` gives Lighthouse 13.6.0 that version (the
one Lighthouse's own 13.6 development builds depend on). It changes only the
audit tool, not the site. Re-scoring the same saved failing run in audit mode
(`-A`) with 0.0.69: Performance 99 → 100, LCP 1829 → 1229 ms, every other
metric unchanged. Remove the override once a stable Lighthouse release depends
on trace engine 0.0.69 or later. PageSpeed Insights runs Google's own
Lighthouse build, so its scores change only when Google updates it.

After the fix, 24 mobile homepage runs (8 each of `/`, `/es/`, `/ar/`) gave
no LCP above FCP. One `/ar/` run scored 97 on TBT (189 ms): every main-thread
category in that run was about 1.6 times its usual size (style and layout
633 ms against 368 ms in a passing run). Traced locally at 4x CPU, the layout
script's task measured 4 to 21 ms with no forced layout, so this miss is the
machine variance described in the next section.

The full strict gate on the same build, with the Spanish and Arabic display
settings labels updated, then passed 72 of 72 runs: 12 paths (`/`, `/es/`,
`/ar/`, `/about/`, `/es/about/`, `/ar/about/`, `/faq/`, `/es/faq/`,
`/ar/faq/`, `/services/`, `/ar/services/`, `/blog/`) × 3 runs × mobile and
desktop, every run 100/100/100/100.

## Homepage mobile TBT investigation (2026-11-18 UTC)

**Status: cause found, no safe code change beats the noise.** The strict gate
misses that recur are on the Arabic pages, on mobile (Performance 99 from TBT
of 50 to 130 ms), and the Arabic homepage is the one that shows up on unchanged
`main` too. This section records what was
measured so the work is not repeated.

Method: Chromium with a 412 px mobile viewport, 4x CPU throttling, tracing and
`Performance.getMetrics`; each figure is the median of 7 loads of the built
site (`npm run preview`, Node 22.23.4). Run-to-run spread is about 15 ms.

What the long task is. On every page the one task over 50 ms is the first
rendering update: style recalculation, one `Layout` and a paint in a single
task (152 to 215 ms at 4x on `/ar/`). JavaScript is not the cost: the boot
script has about 7 ms of self time, and the `BaseLayout` script that Lighthouse
names owns only the surrounding task.

| Page (mobile, 4x) | Layout (ms) | TBT (ms) |
| ----------------- | ----------: | -------: |
| `/ar/`            |         122 |      105 |
| `/es/`            |          46 |       55 |
| `/`               |          51 |       53 |
| `/ar/about/`      |          96 |       62 |
| `/about/`         |          32 |       28 |
| `/services/`      |          31 |       11 |
| `/faq/`           |          23 |       10 |

Arabic pages spend two to three times the layout time of the same page in
Latin script. The first `Layout` covers about 270 objects and is dominated by
text shaping (about 90 shaping calls), so complex-script shaping in the first
viewport is the floor. Pages with less first-viewport text (`/services/`,
`/faq/`) cost far less, and every run of them on `main` scored 100.

Candidates tried and rejected. None moved layout or TBT by more than the
run-to-run spread, so none was shipped:

- `text-wrap: balance` and `pretty` off, `backdrop-filter` off, `mask-image` and
  `filter` off, all animations and transitions off.
- A system monospace font instead of Geist Mono, and an explicit Arabic-capable
  family list for `[dir='rtl']`.
- Hiding or `content-visibility: auto` on the hero proof cards (the homepage
  already skips the sections below the hero this way).
- `build.inlineStylesheets: 'always'`: FCP improved by 10 to 40 ms, but every
  page grew by 19 to 29 KB gzip (the homepage HTML goes from 46 to 75 KB), and
  `/ar/` mobile TBT rose from 22 to 56 ms with one run at 99. Not worth it.

Open, larger items (not started, no score depends on them): Lighthouse
estimates 12 to 23 KiB of unused CSS and about 180 ms of render-blocking
savings on mobile, because `global.css` carries rules for components absent
from a given page; splitting it by page is a refactor that touches RTL and
theme rules. The homepage portrait AVIF at the 560 px step is 68 KB for a
287 px slot (13 KiB estimated saving).

## Page-scoped CSS investigation (2026-11-18 UTC)

No CSS was moved. The measured `main` baseline was
`e7969480755397eb66e99d28c3861fa0774fce67`, built with Node 22.23.4 and the
existing `node_modules`. Playwright CSS coverage was collected at 390 × 844
with reduced motion for 16 route types in each of `en`, `es` and `ar` (48
pages). Each page was scrolled to its end; native disclosures, the mobile menu
and language menu were opened, the theme was toggled, and available form and
copy controls were exercised. These coverage bytes are a hint for investigation,
not proof that an unobserved pseudo-class or media variant can be removed.

| Route type      | BaseLayout CSS reported unused, across locales (raw bytes) |
| --------------- | ---------------------------------------------------------: |
| Home            |                                              39,293–44,894 |
| About           |                                              51,495–51,731 |
| Services        |                                              49,968–50,204 |
| FAQ             |                                              51,027–51,263 |
| Contact         |                                              52,440–52,727 |
| Blog index      |                                              49,658–49,894 |
| Blog article    |                                              45,460–45,703 |
| Work index      |                                              44,698–45,041 |
| Case study      |                                              50,849–51,048 |
| Experience      |                                              46,502–46,796 |
| Skills          |                                              50,268–50,504 |
| Tools           |                                              49,653–49,940 |
| Recommendations |                                              50,554–50,790 |
| Accessibility   |                                              53,953–54,152 |
| Privacy         |                                              54,396–54,519 |
| 404             |                                              48,999–49,198 |

These are raw, route-level Chromium coverage figures after the stated
interactions, not Lighthouse's `unused-css-rules` estimates. The following
component-owned blocks were checked against markup and scripts. Locale variants
have the same component placement; the code search found no script that adds
these classes outside those components.

| Rule block                               |                        `global.css` lines | Routes that render it (`en`, `es`, `ar`)                                              |
| ---------------------------------------- | ----------------------------------------: | ------------------------------------------------------------------------------------- |
| 404 page                                 | 841–1026, 1845–1848, 1886–1900, 1915–1942 | 404 page only                                                                         |
| Topic-cloud base                         |                                 1029–1043 | Blog index, tag pages and `/blog/` content in `PageContent`                           |
| Tool-group layout                        |                                 1067–1107 | `/tools/`                                                                             |
| Accessibility note                       |                                 1109–1112 | `/accessibility/`                                                                     |
| Metadata and bullets                     |                                 1113–1129 | Blog pages, case studies and relevant `PageContent` sections; shared across templates |
| Article page, list, prose and scorecard  |                                 1453–1728 | Blog index, tag pages and blog articles                                               |
| FAQ disclosure effects                   |                                 2149–2185 | Home and `/faq/`                                                                      |
| Contact form focus effects               |                                 2187–2212 | Home and `/contact/`                                                                  |
| Article link and inline-code effects     |                                 2214–2244 | Blog articles                                                                         |
| Philosophy callout                       |                                 2325–2347 | No matching markup or script found                                                    |
| Work index tile                          |                                 2348–2358 | `/work/`                                                                              |
| Experience timeline and promotion ladder |                                 2359–2799 | Home and `/experience/`                                                               |
| Copy button                              |                                 2804–2877 | Home, `/work/`, blog articles and case studies                                        |
| Open-source spotlight and terminal       |                                 2973–3239 | Home and `/work/`                                                                     |
| Frame-card treatment                     |                                 2879–2971 | Shared by multiple card components; not exclusive                                     |
| Reduced-motion card/copy/spotlight rules |                                 3240–3265 | Mixed selectors; keep with their shared rules                                         |

The existing BaseLayout stylesheet measured 73,720 raw bytes and 15,700 gzip
bytes on `main`. Removing every block in the table above that is exclusive to
one or two routes (404, tools, article, work tile, experience, spotlight and
terminal) with a CSS parser, and rebuilding, gives 53,721 raw and 11,918 gzip
bytes: 3,782 gzip bytes (24 %) less on pages that use none of those blocks
(`/about/`, `/services/`, `/faq/`, `/contact/`, `/skills/`). A narrower upper
bound that kept the mixed groups measured 2,010 gzip bytes. The homepage uses
the experience, spotlight, FAQ and contact blocks, so it saves far less.

Decision: not shipped. 3.8 KB gzip is about 20 ms of transfer at Lighthouse's
mobile bandwidth (1.6 Mbps), every score is already 100, and the move touches
cascade order, theme, RTL and state variants across 48 pages. Revisit only
with a pixel-for-pixel comparison harness in place. Strict Lighthouse numbers
from a shared, busy laptop were discarded: with identical CSS they varied from
57 to 29 passing runs out of 72, which shows that machine cannot serve as a gate.

## Hero portrait quality sweep (2026-11-18 UTC)

**Decision: keep `heroPortraitQuality` at 62.** The source is
`portrait-1100.webp` (1100 × 1467, 305,780 bytes). Sharp 0.35.5 generated
AVIF and WebP at qualities 62, 58, 54 and 50 for widths 288, 360, 450, 560,
720 and 880. The quality-62 outputs matched all 12 responsive variants from
the pinned-Node Astro build byte for byte.

The Q62 column is the current per-file size. Other columns show the candidate
size and its byte reduction versus Q62 at the same width and format.

| Format | Width | Q62 bytes | Q58 bytes (saved) | Q54 bytes (saved) | Q50 bytes (saved) |
| ------ | ----: | --------: | ----------------: | ----------------: | ----------------: |
| AVIF   |   288 |    19,777 |    16,995 (2,782) |    14,291 (5,486) |    12,708 (7,069) |
| AVIF   |   360 |    29,783 |    25,945 (3,838) |    21,486 (8,297) |   18,731 (11,052) |
| AVIF   |   450 |    46,145 |    39,336 (6,809) |   32,573 (13,572) |   28,702 (17,443) |
| AVIF   |   560 |    69,096 |    59,137 (9,959) |   48,960 (20,136) |   42,457 (26,639) |
| AVIF   |   720 |   109,534 |   93,164 (16,370) |   77,167 (32,367) |   67,294 (42,240) |
| AVIF   |   880 |   157,330 |  134,866 (22,464) |  111,830 (45,500) |   98,150 (59,180) |
| WebP   |   288 |    17,790 |      17,178 (612) |    16,058 (1,732) |    15,228 (2,562) |
| WebP   |   360 |    26,966 |    25,810 (1,156) |    24,222 (2,744) |    22,978 (3,988) |
| WebP   |   450 |    41,142 |    39,424 (1,718) |    36,830 (4,312) |    35,158 (5,984) |
| WebP   |   560 |    62,030 |    58,702 (3,328) |    54,944 (7,086) |    52,262 (9,768) |
| WebP   |   720 |    99,098 |    93,956 (5,142) |   87,792 (11,306) |   83,422 (15,676) |
| WebP   |   880 |   139,778 |   135,400 (4,378) |  125,824 (13,954) |  120,044 (19,734) |

PSNR and mean absolute difference (MAD) compare each lower-quality encode to
Q62 at the same width and format. Each cell is `PSNR dB / MAD` on decoded
sRGB RGB channel values (0–255).

| Format | Width | Q58 PSNR / MAD | Q54 PSNR / MAD | Q50 PSNR / MAD |
| ------ | ----: | -------------: | -------------: | -------------: |
| AVIF   |   288 |  33.07 / 3.941 |  32.00 / 4.469 |  31.54 / 4.691 |
| AVIF   |   360 |  33.18 / 3.869 |  32.11 / 4.382 |  31.60 / 4.610 |
| AVIF   |   450 |  33.28 / 3.814 |  32.17 / 4.334 |  31.68 / 4.564 |
| AVIF   |   560 |  33.40 / 3.758 |  32.29 / 4.283 |  31.77 / 4.511 |
| AVIF   |   720 |  33.51 / 3.715 |  32.39 / 4.237 |  31.89 / 4.455 |
| AVIF   |   880 |  33.93 / 3.519 |  32.74 / 4.046 |  32.22 / 4.271 |
| WebP   |   288 |  34.52 / 3.245 |  33.15 / 3.888 |  32.46 / 4.237 |
| WebP   |   360 |  34.74 / 3.167 |  33.08 / 3.891 |  32.42 / 4.238 |
| WebP   |   450 |  34.78 / 3.131 |  33.36 / 3.754 |  32.68 / 4.079 |
| WebP   |   560 |  34.61 / 3.193 |  33.37 / 3.709 |  32.59 / 4.085 |
| WebP   |   720 |  34.68 / 3.119 |  33.36 / 3.701 |  32.59 / 4.082 |
| WebP   |   880 |  35.13 / 2.911 |  33.90 / 3.426 |  33.05 / 3.825 |

The required PSNR threshold is above 40 dB; none of the candidates reaches it.
At 450 and 560 px, AVIF Q54 saves 13,572 and 20,136 bytes respectively, but
WebP Q54 saves only 4,312 and 7,086 bytes. Q58 saves less than 10,000 bytes at
both widths in both formats. On the 2× face, hair-edge and jacket-texture
crops at 450 and 560 px, Q58 already loses some fine detail; Q54 and Q50 are
visibly softer, with the hair/tree edges and jacket texture becoming less
distinct. The crops are not visually indistinguishable at 2×, so none of the
lower qualities meets the combined size, visual and PSNR criteria.

Playwright `currentSrc` probes on the homepage confirmed these AVIF selections
(DPR 1 / 2 / 3); the WebP files in the preceding table are the format fallback:

| Viewport width | DPR 1 | DPR 2 | DPR 3 |
| -------------: | ----: | ----: | ----: |
|            320 |   288 |   450 |   720 |
|            390 |   288 |   560 |   880 |
|            768 |   450 |   880 |   880 |
|           1040 |   450 |   880 |   880 |
|           1041 |   450 |   880 |   880 |
|           1280 |   450 |   880 |   880 |
|           1440 |   450 |   880 |   880 |

| Width | AVIF file                             | WebP fallback file                   |
| ----: | ------------------------------------- | ------------------------------------ |
|   288 | `portrait-1100.Do0cluMw_A1tSL.avif`   | `portrait-1100.Do0cluMw_1TptuF.webp` |
|   360 | `portrait-1100.Do0cluMw_Z1cmxFU.avif` | `portrait-1100.Do0cluMw_71qTY.webp`  |
|   450 | `portrait-1100.Do0cluMw_Z11yWAr.avif` | `portrait-1100.Do0cluMw_hO20s.webp`  |
|   560 | `portrait-1100.Do0cluMw_Z1dink6.avif` | `portrait-1100.Do0cluMw_65BgN.webp`  |
|   720 | `portrait-1100.Do0cluMw_Zm6Fkl.avif`  | `portrait-1100.Do0cluMw_Whjgy.webp`  |
|   880 | `portrait-1100.Do0cluMw_NhxHd.avif`   | `portrait-1100.Do0cluMw_XSbTG.webp`  |

Across the tested wide viewports (1041 and 1280 px, DPR 1–3), the media-gated
image preload's `imagesrcset` and `imagesizes` matched the AVIF `<source>` and
`<img sizes>`; the browser selected a candidate present in the preload set and
requested it once. At smaller viewports the preload media condition does not
match, and the selected lazy image was requested once.

No source or quality setting was changed, so no performance run was needed.

## Dotted glow canvas (2026-11-18 UTC)

**Status: the pages that carry the field score 100 in every run.** Node 22.23.4
(the pinned version), one idle machine, `npm run preview`, Lighthouse through
`npm run audit:lighthouse`, twelve paths (`/`, `/es/`, `/ar/`, `/about/`,
`/es/about/`, `/ar/about/`, `/faq/`, `/es/faq/`, `/ar/faq/`, `/services/`,
`/ar/services/`, `/blog/`), mobile and desktop, three runs each (72 runs per
build). Nothing was discarded or averaged.

| Build                | Runs at 100 / 100 / 100 / 100 | Misses                              |
| -------------------- | ----------------------------: | ----------------------------------- |
| `main` (`465b50b`)   |                         72/72 | none                                |
| Branch, first sample |                         66/72 | Performance 92 to 99, all from TBT  |
| Branch, second run   |                         71/72 | `/ar/` mobile run 2, Performance 99 |

The first branch sample ran straight after the end-to-end suite and a
screenshot job; its TBT values (66 to 238 ms) fell on pages with and without the
field, and they did not repeat. On the second run every page that renders the
field (`/about/`, `/faq/` and `/services/` in all locales) scored 100 with 0 ms
TBT. The single miss is the Arabic homepage, which does not render the field
(`data-dot-glow` count 0 in `dist/ar/index.html`). That page already showed the
same variance on unchanged `main` (average mobile TBT 22 ms there); it is the
known Arabic mobile homepage variance, not a regression from this change. A
further six mobile runs of `/ar/` on the branch scored 100 five times and 89
once, on the first run after the preview server started.

Runtime cost, Chromium with 4x CPU throttling, main-thread time per 5 s
(`Performance.getMetrics` `TaskDuration`):

| Condition                              | 1280 px DPR 1 | 1280 px DPR 2 | 390 px DPR 3 |
| -------------------------------------- | ------------: | ------------: | -----------: |
| Field on screen                        |      3,069 ms |      4,004 ms |     1,212 ms |
| Field loaded, then scrolled off screen |   27 to 42 ms |   37 to 53 ms |  20 to 30 ms |
| Module never loaded (same as `main`)   |   40 to 50 ms |   23 to 67 ms |  21 to 29 ms |
| Reduced motion (one static frame)      |          6 ms |          5 ms |         6 ms |

Off screen the loop is stopped, so the cost matches a page that never loaded the
module. The `dotGlow` chunk is 1,558 bytes gzip and is requested only when the
field is within 200 px of the viewport.

Build, lint, format and the end-to-end suite (253 passed, 3 skipped) passed on
this branch.

## Page outro refresh (2026-11-18 UTC)

**Status: passes the strict gate.** Baseline `main` (`cf0338e`) and the
`feat/page-outro-refresh` build each scored 100 / 100 / 100 / 100 in all 54
runs: nine paths (`/`, `/es/`, `/ar/`, `/about/`, `/es/about/`, `/ar/about/`,
`/services/`, `/ar/services/`, `/blog/`), mobile and desktop, three runs each,
run sequentially on one idle machine against `npm run preview` with
`npm run audit:lighthouse`. No run was repeated, discarded or averaged.

An earlier attempt on a different, busy machine scored only 2 of 54 baseline
runs at 100 on unchanged `main`. That result measured the machine, not the code,
and it is not used as evidence. Run the gate on an idle machine.

Worst single run per profile across all nine paths (milliseconds, CLS unitless):

| Profile | Build  | FCP   | LCP   | TBT | CLS | Speed Index |
| ------- | ------ | ----- | ----- | --- | --- | ----------- |
| Mobile  | main   | 1,218 | 1,860 | 30  | 0   | 1,218       |
| Mobile  | branch | 1,260 | 1,860 | 37  | 0   | 1,260       |
| Desktop | main   | 380   | 540   | 0   | 0   | 461         |
| Desktop | branch | 341   | 501   | 0   | 0   | 429         |

The mobile differences are within run-to-run noise: FCP and Speed Index move by
42 ms and TBT by 7 ms, with LCP and CLS unchanged, and every category still
rounds to 100. The Arabic mobile homepage did not drop below 100 in this run,
but the variance recorded in the gate policy above is not fixed; keep watching it.

HTML gzip bytes (`gzip -9`, same settings before and after):

| Page         | Before |  After | Growth |
| ------------ | -----: | -----: | -----: |
| `/about/`    | 10,469 | 10,780 |   +311 |
| `/es/about/` | 10,787 | 11,095 |   +308 |
| `/ar/about/` |  9,025 |  9,343 |   +318 |

Build, lint and format passed. The full end-to-end suite passed (237 passed,
3 skipped), including the new `tests/outro.spec.ts`.

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

## About page without `content-visibility` (November 2026)

The About page's Experience section and bento no longer use
`content-visibility: auto`: its estimated height made the page jump and
stall mid-scroll. Each station of the career path now carries its sentence of
the career story, and the hero portrait sits in a CSS-only "Scales" frame.

Strict gate on the production preview, 3 runs per page and profile:
18/18 at 100/100/100/100 (`/about/`, `/es/about/`, `/ar/about/`, mobile and
desktop). Mobile figures across the 9 runs:

- Style & Layout 162–273 ms (143–195 ms was recorded with
  `content-visibility`).
- Total Blocking Time 0 ms in 7 runs, 39 ms and 91 ms in the other two.
- LCP 0.9–1.7 s; CLS 0 in every run.

The extra Style & Layout is real but stayed inside the 100 band. A future run
with more main-thread work could put the 91 ms TBT run closer to the edge.

## About page scroll on the compositor (November 2026)

Scrolling past the Experience section still felt stuck on phones after
`content-visibility` was removed. Lighthouse listed 30 non-composited
animations on `/about/`, all scroll-linked: 4 road reveals (`clip-path`) and
26 scene strokes (`stroke-dashoffset`). Each repainted on the main thread on
every scroll frame, so the artwork lagged behind the scroll. The road now
reveals with two opposite `transform`s on HTML boxes, the lit station pops as
its own `<svg>`, and the scenes play once on a clock when they come into
view.

Strict gate on the production preview, 3 runs per page and profile: 18/18 at
100/100/100/100 (`/about/`, `/es/about/`, `/ar/about/`, mobile and desktop).
Mobile figures across the 9 runs:

- Non-composited animations: 30 before, none after.
- Total Blocking Time 0–28 ms (0–91 ms before).
- LCP 1.05–1.67 s; the phone portrait stays at 256px so a 1.75x phone loads
  the 450w file (at 260px it took the 560w file and English LCP rose to
  1.80 s).

A 4x CPU-throttled scroll trace in headless Chromium (no GPU) shows the
Experience section now costs about what it costs with motion paused. The
scenes' once-played beats add a short burst of paint when each scene comes
into view; it is not tied to the scroll.
