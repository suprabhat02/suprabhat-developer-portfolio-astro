# Motion system

The interface uses native ports of [Aceternity UI](https://ui.aceternity.com/)
effects. Aceternity ships React, Tailwind CSS, and Framer Motion components;
loading that runtime would add client JavaScript, hydration islands, and main-thread
work to every page. Each effect is instead rebuilt as an Astro component, CSS
primitive, or a few lines in one typed module, so pages stay fully static and
server-rendered.

## Files

```
src/styles/motion.css        effect primitives (fx-*), keyframes, reduced-motion fallbacks
src/scripts/motion.ts        pointer and scroll enhancements, loaded once by BaseLayout
src/components/fx/
  Backdrop.astro             grid or dot background, spotlight beams, aurora blobs
  FlipWords.astro            CSS slot-machine word rotation with a stable screen-reader label
  Meteors.astro              deterministic meteor shower
  SectionHeader.astro        numbered eyebrow, h2 title, lead, optional slot
  TextReveal.astro           scroll-linked word brightening
```

## Aceternity mapping

| Aceternity component     | Native implementation                                     | Used on                                  |
| ------------------------ | --------------------------------------------------------- | ---------------------------------------- |
| Spotlight                | `Backdrop spotlight` (`.fx-spotlight`)                    | Homepage hero, every inner page header   |
| Grid and Dot Backgrounds | `Backdrop pattern="grid" \| "dots"`                       | Hero, inner pages, alternate sections    |
| Aurora Background        | `Backdrop aurora` (`.fx-aurora`)                          | Hero, inner pages                        |
| Moving Border            | `.fx-moving-border`                                       | Secondary CTAs, hero portrait frame      |
| Card Spotlight / Glowing | `.fx-glow` + `data-glow` (pointer-lit hairline)           | Secondary cards, chips and links         |
| Frame card               | `.fx-card-gradient` (fixed corners turn accent)           | Primary cards site-wide                  |
| Parallax scene layers    | `.fx-live` + `.lv-l` layers with depth `--d`              | Living cards with pointer perspective    |
| Card Hover Effect        | `.fx-hover-group` + `.fx-hover-pill` + `data-hover-group` | Engagements, skills table                |
| Flip Words               | `FlipWords.astro`                                         | Hero                                     |
| Infinite Moving Cards    | `.fx-marquee` + `.fx-marquee-track`                       | Keyword strip, recommendations           |
| Bento Grid               | `.bento-grid` with CSS mini-visuals                       | Problems section                         |
| Timeline / Tracing Beam  | `ExperienceTimeline.astro` (`.xp-rail` + `.xp-rail-fill`) | Experience (homepage and `/experience/`) |
| Text Reveal              | `TextReveal.astro`                                        | About statement                          |
| Focus Cards              | `.fx-focus-group` + `.fx-focus-item`                      | Featured articles                        |
| Lamp                     | `.fx-lamp` + `.fx-lamp-line`                              | Homepage CTA band                        |
| Meteors                  | `Meteors.astro`                                           | CTA band, collaboration, 404             |
| Floating Navbar          | `.site-header[data-scrolled]`, `.nav-pill`                | Global header                            |

## Rules that keep Lighthouse and axe at 100

1. **Content never depends on JavaScript.** Every effect is decorative and
   layered on server-rendered HTML. `motion.ts` only adds pointer polish and
   state attributes.
2. **Continuous animations only use `transform`.** They run on the compositor,
   cost no main-thread time, and cannot cause layout shift.
3. **Reveal effects never animate `opacity` on text.** Scroll reveals use
   `transform` and `filter`, so axe never samples half-transparent text in a
   color-contrast check. Hidden Flip Words slots are clipped, not faded.
4. **Above-the-fold LCP content is never hidden.** The hero name, copy, and
   portrait paint immediately. The fixed header is visible from its first
   paint, without an entrance animation. The hero aurora is complete at rest
   and drifts only on content/portrait hover, keyboard focus within the hero,
   or touch/pen activation. The drift animation is attached on the first
   engagement (`data-engaged`), then pauses in place; its first keyframe is
   the static frame, so the attachment is invisible. Each aurora layer carries
   the skew itself instead of the blurred, masked container. Its blurred
   surface is capped at 64rem; the mobile fade uses a fixed 48rem ellipse
   rather than growing with the entire hero. These rules apply to all
   visitors, not just automated audits.
5. **Scroll-linked effects are progressive.** They use CSS
   `animation-timeline` inside `@supports`; unsupported browsers show the final
   state (the back-to-top ring falls back to the scroll handler in
   `motion.ts`). Always write them as longhands
   (`animation-name`, `animation-timing-function`, `animation-fill-mode`,
   `animation-timeline`): the CSS minifier folds a timeline into an `animation`
   shorthand, which browsers reject, so the effect silently disappears from
   the production build. Scroll reveals (`.fx-reveal`, `.fx-words`) are opt-in
   through `data-scroll-reveals` on `<html>`, because they cost mobile Speed
   Index. Line icons (`Icon.astro`) are static for every user: no draw-in and
   no hover or focus motion.
6. **Reduced motion is honored everywhere.** `prefers-reduced-motion: reduce`
   stops every animation, removes parallax and glide transitions, and turns
   marquees into static wrapped lists without their decorative clones.
7. **Pointer effects need a fine, hover-capable pointer.** Touch devices skip
   them entirely.
8. **Decorative duplicates are hidden from assistive technology.** Marquee
   clones carry `data-clone` and `aria-hidden="true"`; Flip Words exposes one
   complete sentence through a visually hidden label.
9. **RTL is first-class.** Effects use logical properties, mirror arrows, and
   reverse marquees under `[dir='rtl']`. Arabic text always uses zero
   `letter-spacing` so letters stay joined.

## Measured pitfalls (do not reintroduce)

These were found by profiling idle main-thread time over CDP (5 s at 4× CPU
throttling) and by tracing `layout-shift` entries. Each one regressed a
Lighthouse metric while looking harmless.

| Pattern                                                         | Cost                                                    | Rule                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Infinite animation inside a `content-visibility: auto` section  | ~3 s of main-thread work per 5 s idle                   | Use `.fx-ping--static` (or no animation) inside `.cv-auto` / `.conversion-section`    |
| Animating `background-position` (gradient text shimmer)         | ~3 s per 5 s idle; repaints the LCP heading every frame | Gradient text stays static                                                            |
| Offscreen infinite animations (meteors, marquees)               | ~300 ms per 5 s idle                                    | Wrap them in `[data-motion-scope]`; `motion.ts` pauses scopes marked `data-offscreen` |
| Layout reads at boot (`getBoundingClientRect` for the nav pill) | Forced reflow inside a long task on Arabic pages        | Measure only inside user-initiated pointer or focus events                            |
| Animated transforms inside an `overflow: hidden` wrapper        | Layout shift on RTL pages (scroll-origin re-anchoring)  | Clip with `overflow: clip` (keep `hidden` as the fallback line before it)             |
| Decorative layers positioned with `%` of a content-sized host   | Layout shift when the host grows on font swap           | Offset backdrops with fixed units (`rem`), never a percentage of the host height      |
| Scrollbar appearing after first paint                           | Viewport narrows; right-anchored layers shift           | `html { scrollbar-gutter: stable; }`                                                  |
| ~160 view-timeline reveals (transform + blur) site-wide         | Mobile Speed Index 1.3 s → 2.5–4 s (Lighthouse 98–99)   | Keep reveals opt-in (`data-scroll-reveals`)                                           |
| `skewX` on the blurred, masked aurora container                 | Observed first paint up to ~2 s later in Lighthouse     | Skew each aurora layer; keep the filtered container untransformed                     |
| A paused animation on the ~3,000px blended aurora layer         | Mobile Speed Index ~2.5 s vs ~1.6 s without it          | Attach the drift on first engagement only                                             |
| `offset-distance` motion path (world-map packets)               | Not composited                                          | Shared `transform` keyframes from equal-arc-length stops                              |
| Animating `background`/`border`/`box-shadow` (timeline dots)    | Not composited                                          | Cross-fade a pseudo-element holding the end state with `opacity`                      |

After the fixes, homepage idle main-thread time is ~17 ms per 5 s (4 ms with
every animation disabled), and no layout shift is recorded in repeated
throttled RTL loads.

## Adding an effect to a card

```astro
<article class="fx-glow fx-reveal" data-glow>…</article>
```

For a primary card, add `fx-card-gradient`: fixed neutral 18px viewfinder
corners that turn accent on hover, focus or scene tap, without a continuous
border. The
frame owns the card's `::before`, so do not combine it with an element that
uses `::before` for its own decoration. `fx-glow` owns `::after` and is
hidden on frame cards. Framed cards have layered shadows at rest; a fine
pointer adds up to four degrees of perspective and a 6px lift. Living scene
layers also move independently. Motion resets on leave, scroll, resize or
window blur and is disabled for reduced motion and coarse pointers.

## Collaboration map

`WorldMap.astro` adapts the visual pattern of Aceternity's
[world-map-demo](https://ui.aceternity.com/registry/world-map-demo.json) to
this site's Astro stack. The project uses strict TypeScript, not shadcn/ui,
Tailwind v4, React Motion or next-themes; the map introduces none of those
dependencies and ships no new client script.

The existing public-domain Natural Earth land mask in `globeLand.ts` is
sampled at build time into a single dotted SVG path. Equirectangular
projection is shared by the land and routes. Connections show the documented
collaboration from India with Denmark and China at Topsoe, Germany on the
BMW project at Cognizant, and Australia and New Zealand at TrueBlue, not the
registry demo's example cities. Geographic east/west stays fixed in RTL; the caption and adjacent
content mirror normally. Labels come from `messages.ts` in all three locales.

CSS route packets and endpoint pulses use the existing `data-motion-scope`
offscreen pause. Reduced motion leaves a complete static map. Hero proof
rows reserve padding on every side so card perspective stays within their
paint and horizontal-scroll bounds.
