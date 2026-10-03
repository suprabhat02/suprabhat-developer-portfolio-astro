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

| Aceternity component     | Native implementation                                       | Used on                                  |
| ------------------------ | ----------------------------------------------------------- | ---------------------------------------- |
| Spotlight                | `Backdrop spotlight` (`.fx-spotlight`)                      | Homepage hero, every inner page header   |
| Grid and Dot Backgrounds | `Backdrop pattern="grid" \| "dots"`                         | Hero, inner pages, alternate sections    |
| Aurora Background        | `Backdrop aurora` (`.fx-aurora`)                            | Hero, inner pages                        |
| Moving Border            | `.fx-moving-border`                                         | Secondary CTAs, hero portrait frame      |
| Card Spotlight / Glowing | `.fx-glow` + `data-glow`                                    | Cards site-wide                          |
| 3D Card Effect           | `.fx-tilt` + `data-tilt`, `.fx-pop` children                | Hero portrait, work and expertise cards  |
| Card Hover Effect        | `.fx-hover-group` + `.fx-hover-pill` + `data-hover-group`   | Engagements, skills table                |
| Flip Words               | `FlipWords.astro`                                           | Hero                                     |
| Infinite Moving Cards    | `.fx-marquee` + `.fx-marquee-track`                         | Keyword strip, recommendations           |
| Bento Grid               | `.bento-grid` with CSS mini-visuals                         | Problems section                         |
| Timeline / Tracing Beam  | `.fx-beam` inside `.fx-beam-scope`                          | Experience (homepage and `/experience/`) |
| Text Reveal              | `TextReveal.astro`                                          | About statement                          |
| Focus Cards              | `.fx-focus-group` + `.fx-focus-item`                        | Featured articles                        |
| Lamp                     | `.fx-lamp` + `.fx-lamp-line`                                | Homepage CTA band                        |
| Meteors                  | `Meteors.astro`                                             | CTA band, collaboration, 404             |
| Floating Navbar          | `.site-header[data-scrolled]`, `.nav-pill`, scroll progress | Global header                            |

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
   portrait paint immediately; only decorative layers animate in.
5. **Scroll-linked effects are progressive.** They use CSS
   `animation-timeline` inside `@supports`; unsupported browsers show the final
   state.
6. **Reduced motion is honored everywhere.** `prefers-reduced-motion: reduce`
   stops every animation, removes tilt and glide transitions, and turns
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

After the fixes, homepage idle main-thread time is ~17 ms per 5 s (4 ms with
every animation disabled), and no layout shift is recorded in repeated
throttled RTL loads.

## Adding an effect to a card

```astro
<article class="fx-glow fx-reveal" data-glow>…</article>
```

For a 3D card, add `fx-tilt` and `data-tilt`. Mark children that should float
above the surface with `fx-pop`. An element that already uses `::before` or
`::after` for its own decoration must not also use `fx-glow`, which owns both
pseudo-elements.
