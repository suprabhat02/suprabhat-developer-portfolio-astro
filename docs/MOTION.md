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
src/scripts/motionPreference.ts system and visitor motion preference, shared with lazy renderers
src/scripts/dotGlow.ts       lazy canvas renderer for the inner-page CTA field
src/scripts/globe.ts         lazy canvas renderer for the homepage globe
src/components/Carousel.astro  horizontal scroll-snap carousel (see "Carousel")
src/styles/carousel.css      carousel track, controls and progress rail
src/scripts/carousel.ts      carousel buttons and counter, loaded on demand
src/components/fx/
  Backdrop.astro             grid or dot background, spotlight beams, aurora blobs
  FlipWords.astro            CSS slot-machine word rotation with a stable screen-reader label
  Meteors.astro              deterministic meteor shower
  SectionHeader.astro        numbered eyebrow, h2 title, lead, optional slot
  TextReveal.astro           scroll-linked word brightening
  LiveScene.astro            animated SVG mini-scenes for living cards
  SceneDefs.astro            shared lit gradients for every scene on a page
  Raised.astro               a scene object with a lit top face and a shaded lip
  scenes/                    visual-only expertise, approach, service, collaboration and writing scenes
```

## Site-wide motion preference

The control lives in the header's display settings panel (see "Display
settings" below) as the **Animations** radio group: System, On, Off. With
"System" (no saved choice), motion follows `prefers-reduced-motion`: it plays
by default and is paused when the system requests reduced motion. "On" and
"Off" store `playing` or `paused` in local storage key `sk-motion` and
override that default; choosing "System" again removes the key. The existing inline bootstrap applies the choice before first paint;
storage failures fall back to the system preference without disabling the
control for the current page. No preference data is sent anywhere.

`motionPreference.ts` owns the effective state, publishes changes to the main
interaction layer and its lazy canvas/carousel renderers, and reflects it on
`<html data-motion="paused">` (or `playing` when explicitly selected). A paused
scope keeps its current frame; canvas loops schedule no recurring frames, and
their shared motion clock excludes paused time so resuming does not jump ahead.
Every automatic CSS or canvas loop is inside a `[data-motion-scope]`. The same
root pause also freezes a product scene already playing, without starting one:
product scenes remain idle until hover, focus, or tap.

| Source                                                                                                                 | Repeats automatically?                                          | Scope             | Reduced-motion / pause behavior                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage hero orbit, Flip Words, moving borders and availability ping (`Homepage.astro`; `homepage.css`, `motion.css`) | Yes                                                             | Hero section      | System reduction keeps them static; the site setting pauses the scope in place.                                                               |
| Backdrop aurora blobs (`Backdrop.astro`; `motion.css`)                                                                 | Yes                                                             | Backdrop          | Static under system reduction; scope pause retains the current frame. The wide hero aurora flow starts only after engagement.                 |
| Keyword and recommendation marquees (`Homepage.astro`; `motion.css`)                                                   | Yes                                                             | Each marquee      | System reduction wraps originals and hides clones; pause freezes the current position.                                                        |
| Meteor fields (`Meteors.astro`; `motion.css`)                                                                          | Yes                                                             | Meteor field      | Hidden under system reduction; scope pause freezes the field.                                                                                 |
| Homepage globe (`Globe.astro`; `globe.ts`) and inner-page dotted CTA (`DotGlow.astro`; `dotGlow.ts`)                   | Yes                                                             | Canvas host       | Draw only while visible and motion is allowed. Reduced motion paints one static frame; pause cancels the loop and resume continues its clock. |
| World map packets and halo (`WorldMap.astro`)                                                                          | Yes                                                             | Figure            | Packets are hidden under system reduction; pause freezes both animations.                                                                     |
| 404 status orb (`PageContent.astro`; `global.css`)                                                                     | Yes                                                             | Orb               | Static under system reduction; scope pause retains its frame.                                                                                 |
| Product scenes (`LiveScene.astro`; `scenes.css`)                                                                       | No; play only on hover, focus or tap                            | No per-card scope | Reduced motion shows the resting state. The site setting freezes an already active scene; it never starts one.                                |
| Bento focus ring, developer palette orbit and terminal cursor (`homepage.css`, `PalettePicker.astro`, `global.css`)    | No; require hover or focus                                      | No scope          | They are interaction-triggered, not idle loops; reduced motion disables them, and the pause state freezes them if active.                     |
| Carousels and finite timers (`carousel.ts`, `motion.ts`, `toast.ts`, `ContactForm.astro`)                              | No autoplay; timers follow user actions or dismiss transient UI | No scope          | Carousel steps use instant scrolling while paused. Nav settling, toast dismissal and form-success timing are not animation loops.             |

## Display settings

The header holds two popovers, each a native `popover` panel opened by a
`<button popovertarget>`; the browser supplies `aria-expanded`, Escape, light
dismiss, focus return and opening another closes the first. Neither uses
`role="menu"`: menus are for application actions and promise arrow-key
behaviour a list of links or settings does not have.

- **Language** (`#lang-menu`): a labelled `<nav>` of plain links whose text is
  the language's own name, each with its `lang`. It stays its own control, not
  part of display settings: someone who cannot read the current page can still
  find their language by name, and changing it is navigation (another URL),
  not a preference. It opens without scripts.
- **Display settings** (`#prefs-panel`): two `<fieldset>` radio groups, Theme
  (System, Light, Dark) and Animations (System, On, Off). Native radios give
  arrow-key movement in both directions, constant labels and correct state
  announcements; the radio itself stays in place under the label styling. A
  choice applies at once and never closes the panel. The trigger is hidden
  until the inline bootstrap sets `data-js` on the root, because without
  scripts a choice could not apply; there is never a dead control.

Both panels hang from their trigger with CSS anchor positioning
(`position-area: block-end span-inline-start`, which mirrors on RTL pages by
itself); browsers without it place them at the header's inline end, and
browsers without popovers keep them closed (the mobile menu still lists every
language). In forced colours the chosen option is filled with `Highlight` so
the focus outline stays visible on top of it.

`src/scripts/themePreference.ts` and `motionPreference.ts` own the state;
`initPreferences` in `motion.ts` wires the radio groups to them. Both modules
ride in the layout script that already loads on every page, so the panel adds
no request.

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
| Card Hover Effect        | `.fx-hover-group` + `.fx-hover-pill` + `data-hover-group` | Available; no section uses it at present |
| Flip Words               | `FlipWords.astro`                                         | Hero                                     |
| Infinite Moving Cards    | `.fx-marquee` + `.fx-marquee-track`                       | Keyword strip, recommendations           |
| Bento Grid               | `.bento-card` with CSS mini-visuals                       | Problems section                         |
| Timeline / Tracing Beam  | `ExperienceTimeline.astro` (`.xp-rail` + `.xp-rail-fill`) | Experience (homepage and `/experience/`) |
| Timeline / Tracing Beam  | `AboutPage.astro` career route (`.ab-route`)              | `/about/` hero (horizontal, time-scaled) |
| Sticky Scroll Reveal     | `.ab-ch` rows with sticky `.ab-ch-title` (CSS only)       | `/about/` chapters                       |
| Text Reveal              | `TextReveal.astro`                                        | About statement                          |
| Focus Cards              | `.fx-focus-group` + `.fx-focus-item`                      | Featured articles                        |
| Lamp                     | `.fx-lamp` + `.fx-lamp-line`                              | Homepage CTA band                        |
| Meteors                  | `Meteors.astro`                                           | CTA band, collaboration, 404             |
| Dotted Glow Background   | `DotGlow.astro` + `dotGlow.ts` (lazy canvas)              | Inner-page CTA only                      |
| Floating Navbar          | `.site-header[data-scrolled]`, `.nav-pill`                | Global header                            |

## Rules that keep Lighthouse and axe at 100

1. **Content never depends on JavaScript.** Every effect is decorative and
   layered on server-rendered HTML. `motion.ts` only adds pointer polish and
   state attributes.
2. **Continuous animations only use `transform` or decorative `opacity`.**
   Keep their painted geometry static and pause them off screen. Never animate
   text opacity. Canvas renderers (the globe and dotted glow) draw only while
   visible.
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
   starts the site-wide motion control paused; explicit visitor choice can
   override it. The default reduced-motion rendering removes parallax and glide
   transitions and turns marquees into static wrapped lists without clones.
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

## Scene materials

Scenes are drawn from a small paint vocabulary (`.t`, `.fa`, `.fb`, `.fok`,
`.fas`, `.fbs`, `.ftx`). Depth comes from light, not from a 3D runtime:

- `SceneDefs.astro` renders one zero-size SVG of gradients per page and the
  inline rules that point the vocabulary at them. Each fill runs from a lit
  top-left to a shaded bottom-right; tiles get a bright upper rim. Render it
  once, before the first `LiveScene`. Without it, scenes fall back to the flat
  colours in `scenes.css`, because every paint is `url(#id) <colour>`.
- The rules are inline because some browsers resolve `url(#id)` in an external
  stylesheet against the stylesheet, not the page.
- `Raised.astro` gives an object thickness: a shaded lip, an opaque backing and
  the lit face, in one group so it animates as a single body.
- Legacy corner radii come from one scale in `LiveScene.astro` (`R.frame`
  12, `R.panel` 10, `R.tile` 6, `R.chip` 4); pills use half their height.
  Flat product scenes use `Surface.astro` with small radii. Draw outlines
  and focus rings to follow the control's own geometry.
- An outline, ring or connector sits in the same `.lv-l` layer as the shape it
  belongs to; in different layers the two drift apart under parallax.
- A translucent node that a line passes behind needs a `.lv-base` circle under
  it, or the line shows through.
- A bar that fills is a round-capped `<line class="ui-bar">` animated with
  `stroke-dashoffset` (`k-progress`). Scaling a rounded
  rectangle flattens its ends.
- `.lv-glow-a|b` pools light behind a focal object and `.lv-spec` is a glint
  on a sphere. These legacy materials remain static.
- No SVG `filter` is used for depth. Gradients are painted once; a filter would
  be re-rasterised on every animated frame.
- Stop colours are tokens mixed in `oklab`. Mixing in `oklch` swings the hue on
  the way to the shade (green turns olive, orange turns purple).
- Never tween `fill` on a lit element: a gradient cannot interpolate. Fade
  `opacity` instead, as `lv-paint` does.

## Stack bento

Skills and tools are one homepage section (`#skills`; the card list keeps the
old `#tools` id so existing links still land there). `src/data/stack.ts`
builds it: technology names from `skills.ts`, logos from `tools.ts`, headings
and descriptions from `messages.ts`. The build fails if a group has no card or
a logo in `tools.ts` would no longer be shown.

- **A card** (`.stack-card`) is a scene band, the group's name and purpose,
  then every technology as a tile: its logo over its name. One technology per
  tile; `skills.ts` never joins two names with "+".
- **The technologies are the content.** The scene is a caption for them, so
  the band has one modest height on every card (`clamp(11rem, 17vw, 13.75rem)`)
  and the artwork keeps its drawn size instead of growing with wider cards.
  On phones the band is exactly as tall as the artwork at full width.
- **Logos** are 32px (28px on phones). A tile is a size container, and its
  name is set at 15.5% of the tile's width (11.52px at most), which still fits
  a ten-character word such as "JavaScript": names wrap between words only.
- **Phones and tablets** show the six cards as a `Carousel`, the same
  component as the problem cards; tiles sit three to a row on most phones.
- **From 1041px** the carousel becomes a twelve-column bento, filled row by
  row as 5 + 7, 7 + 5, 6 + 6. The shape of each card comes from `stack.ts`, in
  card order, so the document order and the visual order stay the same. The
  order pairs a short list with a long one, so cards in a row end level.
- **Scenes** are product-interface scenes; see "Product scenes" below.

## Product scenes

`editor`, `store`, `responsive`, `query`, `handoff` and `review` are drawn as
small pieces of real software rather than as illustrations. They live in
`src/components/fx/ProductScenes.astro` and are rendered by `LiveScene` like
every other scene, so hover, focus, touch tapping and reduced motion behave
the same.

- **Surfaces** are `Surface.astro`: a one-pixel hairline that stays one pixel
  at any scale (`vector-effect: non-scaling-stroke`), a radius of 6 or less, a
  lit top edge and an optional title-bar rule. No lips, no drop shadows.
- **Stack text** is `Type.astro`, in the site's own monospace face, coloured token
  by token (`kw`, `type`, `ok`, `dim`, `hi`, `on`). Only code, identifiers and
  numbers appear, so no locale needs its own version, and scenes are
  `aria-hidden`. Scenes are always laid out left to right, also in Arabic.
- **Colour** is grey except for the one thing a scene is about, which takes
  the accent or the success colour.
- **One story per scene, in order.** The resting frame is the finished state;
  hovering replays how it got there. The delays (`--i`) are set so cause comes
  before effect, e.g. the store updates only after the action has passed its
  schema, and subscribers flash only after the store has changed.
- **Motion hooks** added for them: `k-reveal` and `k-caret` type a line one
  character at a time with the caret riding its edge (`--reveal` is the
  line's width in scene units), and `k-hop` sends a packet across a short
  connector in about half a second. A hop ends past the path, because a dash
  that only touches the end point would still paint its round cap as a dot.
- **Adding one:** draw it at 320 × 144 scene units with `Surface` and `Type`,
  register the name in `scenes.ts`, set its pace with `--lv-dur` and
  `--lv-step` in `scenes.css`, then check it frame by frame by pausing its
  animations at several times.

### Visual stories outside the stack

Core expertise, Engineering approach, Services, Remote collaboration and
Writing use diagrams or simplified product UI, not code. Their components
are in `src/components/fx/scenes/` and are mounted by `LiveScene`. They reuse
the flat `Surface` and `ui-*` paint vocabulary; no runtime or dependency is
added. The existing card dimensions and layouts stay unchanged.

- No keywords, code syntax, filenames, URLs, terminal output or `kw`/`type`
  token tones. These scenes use icons, shapes and universal symbols instead
  of untranslated prose, with at most three short labels.
- Neutral token greys, small radii and hairlines; accent highlights the
  story. Green, amber and red mean success, risk and failure respectively.
- Resting CSS is the complete, meaningful result. Hover, focus within a
  card, or touch tapping replays the story. Touch scrolling never starts it;
  links retain their normal behavior. Reduced motion disables animation and
  parallax without hiding the result.
- `.ui-story` sequences synchronize every beat on one looping timeline.
  `--i` selects the start inside a `linear()` easing function rather than
  delaying separate loops, so every replay resets together. `ui-arrive`,
  `ui-trace` and `ui-gather` move from the start state to the result, then
  hold. Expertise retains its approved choreography.
- New animations change only transforms, opacity or stroke dashes. SVG dash
  drawing is not claimed to be compositor-only; colors and geometry are
  static. Semantic color changes cross-fade pre-painted shapes.
- Animated connectors use `ui-wire`, not the non-scaling `ui-ln`: normalized
  `pathLength` dashes must scale with their paths. Packets rest beyond the
  path to avoid round-cap dots in idle and reduced-motion frames.

| Section       | Scene        | Form and story                                                                  |
| ------------- | ------------ | ------------------------------------------------------------------------------- |
| Expertise     | `layout`     | UI: header, sidebar, tiles and rows assemble                                    |
| Expertise     | `flow`       | Diagram: locked browser request, server, database, returning rows               |
| Expertise     | `system`     | Diagram: palette and spacing become matching controls and a green gauge         |
| Approach      | `clarify`    | Diagram: question cards converge on a checked goal                              |
| Approach      | `blueprint`  | Diagram: connectors build a layered system                                      |
| Approach      | `quality`    | UI: four checks complete before a shield                                        |
| Services      | `pipeline`   | Diagram: plan, build and launch milestones                                      |
| Services      | `perf`       | UI: loading filmstrip from slow to fast; also used in the small hero proof card |
| Services      | `graph`      | Diagram: tangled connections settle into layers                                 |
| Services      | `advisory`   | Diagram: out-of-order replies; stale ones fade, newest reaches the screen       |
| Services      | `chart`      | UI: applied filter, KPI tiles and line chart                                    |
| Services      | `tokens`     | UI: consistent button sizes and states                                          |
| Services      | `a11y`       | UI: readable contrast, traveling focus and accessibility approval               |
| Services      | `browser`    | UI: a page assembles top to bottom                                              |
| Collaboration | `chat`       | Diagram: two time zones, offline messaging and a pinned decision                |
| Collaboration | `milestones` | Diagram: roadmap flags fill and an amber risk resolves                          |
| Collaboration | `merge`      | Diagram: documents and a key pass from a person to a team                       |
| Writing       | `race`       | Diagram: relative response bars compare a blocked task with responsive chunks   |
| Writing       | `voice`      | UI: a button gains a label and is read aloud                                    |
| Writing       | `article`    | UI: a neutral article layout draws in                                           |

`getArticleScene(post.id)` in `src/components/fx/scenes.ts` binds
`react-inp-benchmark` to `race` and
`accessibility-in-react-what-developers-skip` to `voice`. Every other slug
gets `article`, regardless of publication date or list position. The same
mapping applies in English, Spanish and Arabic.

Service content is unchanged: Spanish and Arabic currently have four cards,
not the English eight. Architecture review, design system engineering,
accessibility audit and website design/development lack distinct localized
cards. Their existing dashboard/audit/advisory copy describes fractional
product engineering, a general technical audit and scheduled advisory,
respectively, rather than the narrower English services. These content
gaps require confirmed translations, not invented replacements.

## Problems bento

From 1041px the six problem cards form a bento (`.problem-bento` in
`src/styles/homepage.css`): two wide cards stacked beside one tall card, then
the same mirrored.

- **Shapes come from position.** `problemShapes` in `HomepageConversion.astro`
  marks each card `wide` or `tall`; the CSS places them by `:nth-child`. Every
  locale publishes the same six problems in the same order.
- **A wide card** is a two-column grid: art, title and summary on one side, the
  signals and outcome on the other. **A tall card** stacks them.
- **No empty space.** A wide card is about half as high as a tall one, so the
  rows close on their own. What is left over goes to `.bento-stage`, the frame
  around the art, which grows. The art inside (`.bento-visual`) keeps its drawn
  size and stays centred, so no visual depends on the shape of its card.
- **It is CSS only.** The DOM order is the reading order, nothing is measured
  or moved by script, and below 1041px the same cards are carousel slides.

## Approach timeline

The engineering approach is a vertical timeline (`.steps` in
`src/styles/homepage.css`), built like the experience timeline but with its
rail on the trailing edge.

- **Each step** is a list item with two parts: `.step-main` (heading, text and
  a `LiveScene`) and `.step-marker` (the step number). The rail and the numbers
  are `aria-hidden`; the `<ol>` already gives the order to assistive technology.
- **Trailing edge** means the right in English and Spanish and the left in
  Arabic. Everything is placed with logical properties, so there is no RTL
  override.
- **Scene size.** Inside `.steps` a scene drops its fixed height and keeps the
  artwork's `320 / 144` proportions, so it grows with its column. From 861px
  the text and the scene sit side by side; below that the scene is shown first
  with `order`, while the heading stays first in the document.
- **Scroll progress.** `.steps-rail-fill` and the ring on each number
  (`.step-num::after`) follow view timelines with `transform` and `opacity`
  only. Numbers are lit by default, so browsers without scroll timelines and
  readers who prefer reduced motion see every step reached.
- **Copy** lives in `approach.items` in `src/data/homepageConversion.ts`, one
  entry per locale. Adding a step there adds a row; nothing else changes.

## Carousel

`src/components/Carousel.astro` turns a long card grid into one horizontal row.
The homepage uses it for the open-source work (`size="wide"`: one large card
at a time), the problems (`desktop="grid"`: a row on phones and tablets, a
bento from 1041px, see below) and the services (several cards in view).

- **Content is untouched.** Every slide is in the HTML and in the accessibility
  tree. Nothing is cloned, hidden or rendered late, so search engines and screen
  readers read it like a plain list.
- **Scrolling is native.** The track is a CSS scroll-snap container
  (`src/styles/carousel.css`). Touch, trackpad and keyboard focus work with no
  JavaScript, and the browser scrolls on the compositor.
- **The script is optional.** `src/scripts/carousel.ts` (about 1.2 KB gzipped) is
  fetched by `motion.ts` only when a carousel comes near the viewport. It adds
  the previous/next buttons, the counter and the progress fallback. Until then
  the buttons are invisible but keep their space, so nothing shifts.
- **Controls come first.** The rail, counter and buttons sit above the track,
  so the row reads as sideways-scrolling before the cards do. Pass the section
  heading in the `header` slot: from 1041px the controls sit at the inline end
  of the heading, level with its last line (the lead is kept clear of them in
  CSS); below that they sit between the heading and the cards.
- **Progress rail.** Driven by a named scroll timeline where supported, and by
  one custom property per frame elsewhere. It only ever animates `translate`.
  The script writes that property, and the thumb's size, on the thumb itself,
  and writes the counter and button states only when they change, so a scroll
  frame never restyles the slides or re-lays out the controls.
- **RTL.** Layout uses logical properties; the script reads the track's
  direction, so "next" always moves towards the inline end.

Rules when using it:

- Put `<Carousel>` directly inside a full-width section, outside `.wrap`. It
  insets itself by the page gutter and lets slides run to the screen edge.
- Do not put `fx-reveal` on slides. Inside a scroll container `view()` binds to
  the track, not the page. Put the reveal on the track with `trackClass`.
- Keep `animation-*` longhands in separate rules (see the pitfall above); the
  minifier otherwise drops the scroll timeline.
- Slide width is `--cx-slide`; change it per breakpoint in `carousel.css`.
- Use `desktop="grid"` only when every slide fits a three-column grid. The
  switch is CSS only: the track stops being a scroll container and the
  controls are removed, so it looks the same with and without script.
- Pass `focusable` when the slides hold no links or buttons. Keyboard users
  can then focus the track and scroll it with the arrow keys (WCAG 2.1.1);
  the script removes that tab stop whenever nothing scrolls.
- A component that carries its own `fx-reveal` needs a way to turn it off as
  a slide (see the `reveal` prop of `OpenSourceSpotlight.astro`).

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

## Inner-page signal field

`DotGlow.astro` and `src/scripts/dotGlow.ts` port Aceternity's
[Dotted Glow Background](https://ui.aceternity.com/registry/dotted-glow-background.json)
for the `PageOutro` CTA only; the
[official demo 2](https://ui.aceternity.com/registry/dotted-glow-background-demo-2.json)
provides its usage values. The React component is not redistributed. The site
adds no dependency or client framework.

The port keeps the original staggered grid (including its two-dot overscan),
per-dot random phase and speed, resize regeneration, DPR cap of 2, triangle
wave, alpha range 0.25–0.8, glow threshold and blur formula, and one circle
path/fill per dot. The CTA uses gap 10, radius 1.6, opacity 1, speed range
0.3–1.6 and speed scale 1. Component defaults remain gap 12, radius 2,
opacity 0.6, speed range 0.4–1.3 and speed scale 1.

Adaptations and reasons:

- Two typed token names (`--text-3` and `--accent-fill`) replace literal,
  light/dark color props. A hidden probe resolves `light-dark()` and
  `color-mix()` tokens to canvas-readable colors, and a `data-theme` observer
  refreshes them.
- `ResizeObserver.contentRect` supplies dimensions; there are no per-frame
  layout reads or window-resize listener. Dot coordinates, phases and speeds
  use typed arrays to reduce allocations, and shadow state changes only when
  needed.
- The renderer is dynamically imported at a 200px intersection margin. Its
  animation loop cancels offscreen and while the document is hidden, then
  resumes when visible. A 30fps cap reduces mobile work. The initial frame
  paints as soon as the size is known.
- Reduced motion renders a static time-zero frame and listens for preference
  changes; forced colors clears the canvas and hides the field. The canvas
  fades in over 400ms, except under reduced motion.
- Non-finite numeric attributes fall back to defaults; finite values clamp to
  gap 4–64, radius 0.5–8, opacity 0–1 and speeds 0–10. Token names must start
  with `--`. Background fading and hover/focus brightening are omitted because
  this use needs neither.
- The dots use `Float32Array` storage, but preserve independent randomized
  phase and speed and the source's per-dot drawing. Batching or glow sprites
  are not used: prior measurements on this CTA made them slower or no faster.

The field stays in the CTA's inline-end grid column at widths above 760px,
bleeds to the card's block edges and inline-end edge, and uses a mirrored
radial mask to fade before the copy. At 760px and below it moves below the
buttons, spans the card's inner width and touches its bottom edge. It never
overlaps the eyebrow, heading, lead or actions. Its host is `aria-hidden` and
`pointer-events: none`; it has no `data-motion-scope` because its renderer owns
visibility pausing. Light theme uses layer opacity 0.45; dark uses 1.

Measured Chromium main-thread `TaskDuration` delta over five seconds at 4× CPU
throttling (lower is better; main is the unchanged CSS field, branch is the
canvas field):

| State                             | Main (ms / 5s) | Branch (ms / 5s) |
| --------------------------------- | -------------: | ---------------: |
| `/about/` at top, field offscreen |            122 |               96 |
| CTA on screen, 1280×900 DPR 1     |             24 |            3,705 |
| CTA on screen, 1280×900 DPR 2     |             21 |            4,344 |
| CTA on screen, 390×844 DPR 3      |             21 |            1,341 |
| CTA on screen, reduced motion     |              2 |                4 |

Both builds were served from production previews on Node 22.23.4 and measured
with the same Chromium script, 4× CPU throttling, and a five-second window.
The branch uses an exact 30 fps cap. Animation pauses offscreen and while the
document is hidden; reduced motion draws a static frame. The branch's offscreen
measurement was 26 ms lower than main, and reduced motion was 3 ms higher.

The long-task observer recorded no tasks for main. On the branch it recorded
one 55 ms task at DPR 1 and nine tasks (499 ms total, 63 ms longest) at DPR 2;
it recorded none offscreen, on mobile, or with reduced motion. These are
throttled lab measurements, not field performance.

HTML sizes (`gzip -9`) for the CTA pages:

| Page         | Main raw | Branch raw | Main gzip | Branch gzip | Gzip change |
| ------------ | -------: | ---------: | --------: | ----------: | ----------: |
| `/about/`    |   39,103 |     37,647 |    10,929 |      10,746 |        -183 |
| `/es/about/` |   39,831 |     38,375 |    11,245 |      11,070 |        -175 |
| `/ar/about/` |   34,292 |     32,836 |     9,454 |       9,262 |        -192 |

Homepage HTML raw sizes were unchanged. Gzip grew by 1 byte for `/`, 2 bytes
for `/es/`, and 1 byte for `/ar/`; those documents reference the updated
hashed global script bundle.

Validation on Node 22.23.4: `npm run build`, `npm run lint`, and
`npm run format:check` passed. The focused outro suite passed all 104 tests;
the full Playwright suite passed 253 tests with 3 skips.

Related links keep the existing `fx-card-gradient` frame and pointer tilt,
without redundant `fx-glow` markup. Icon fills cross-fade through opacity;
arrow motion mirrors in RTL. Reduced motion leaves the cards still.

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

## About page career path and scenes

`AboutPage.astro` opens with the original hero portrait
(`portrait-1100.webp`, eager, `fetchpriority="high"`; on phones it is the
LCP element, so it renders at 256px with quality 50: at the homepage's
quality 62 the 560w AVIF was 68 KB and mobile Performance scored 99, now the
450w file phones load is 28 KB and every run scores 100). Below the hero:

1. **About me beside At a glance** (`.ab-intro`): the first paragraph under
   the `built` scene on one side, the identity facts in a framed panel on
   the other (`.ab-id`; the summary and seven facts stay one
   `[data-identity-summary]` block, the working terms follow as label/value
   rows). Stacked at 1040px and below.
2. **Experience** as its own section (`.ab-xp`): a large heading beside the
   paragraph, then the career path (`src/components/about/CareerPath.astro`),
   larger from 1041px (13rem road, 1.35rem company names, 3.5rem years).
3. **Bento** (`.ab-bento`) of Core expertise (`contain`), Engineering
   approach (`states`), Availability (`reach`) and Design philosophy
   (`decide`): 12 columns, 7+5 then 5+7 from 1041px, 2x2 down to 761px, one
   column below. Each scene sits in a recessed well of one fixed height; the
   SVG fills the well (`meet`), so headings line up across a row.

`.ab-xp` and `.ab-bento` use `content-visibility: auto` with remembered
intrinsic sizes: the bigger path and the bento added ~70 ms of Style &
Layout on throttled mobile loads, and one cold run scored 99; skipping them
until they near the viewport brought Style & Layout to 143–195 ms and the
gate to 18/18. Their scroll-driven timelines still progress normally.

- **Path data.** `getCareerPath()` in `src/data/careerRoute.ts` returns one
  leg per employer from `experience.ts`, oldest first: company, titles
  (oldest first, with the promotion flag), the localized date range and the
  tenure in months. An unsupported date format fails the build.
- **Path layout.** From 761px the road runs down the middle, cards alternate
  sides and each start year sits across the road. At 760px and below the
  road runs along the inline start. Each leg owns the road from its station
  to the next station: the road SVG starts `--node-y` below the leg's top
  and is exactly as tall as the leg (`height: 100%`; an SVG between two
  insets would keep its own aspect ratio). The SVG stretches
  (`preserveAspectRatio="none"`) with non-scaling strokes, so stations
  always sit on the road; `tests/about.spec.ts` checks it at five widths in
  all three locales. A leg's minimum height follows its tenure. The road
  swings toward the year side and is mirrored in RTL (`scale: -1 1`).
- **Path colour.** Neutral base road; the accent road is the road travelled.
  Past stations are accent rings, today's station is filled with a halo, and
  a dashed tail continues past it.
- **Scenes.** `built` (six year-arcs, four kinds of product), `contain`
  (product grows, cost curve stays low against an amber typical curve),
  `states` (loading, error, then the result), `reach` (IST clock with
  evening hours on a bus to six focus areas), `decide` (cluttered screen
  zigzags the eye; the clear one leads to one action). Only "6+" and "IST"
  are text. They use the about-only paint classes in `about.css` (`.ab-sc`),
  not `scenes.css`, so the About page loads no extra stylesheet.
- **Motion (owner-approved exception for this page).** Unlike card scenes,
  these build with scroll. Everything rests finished; inside
  `@supports (animation-timeline: view())` and only while motion is not
  paused, each chapter is a named view timeline (`--ab-ch`) and each beat
  (`--i`) plays over a short stretch of scroll as the chapter enters. Each
  path leg is a view timeline narrowed to a reading band across the middle
  of the viewport (`view-timeline-inset: 45% 45%`): the accent road is
  revealed with `clip-path` while the band crosses the leg, and the station
  pops in as the band reaches it. Only transforms, decorative opacity,
  stroke dashes and `clip-path` animate; no text fades. Without support,
  with reduced motion or with Animations off, nothing attaches and the
  finished state shows. Longhands only (see rule 5).
- **Tests.** `tests/about.spec.ts` checks the path content and order, the
  promotion label, the chapters, the portrait, stations on the road at
  1440/1040/768/390/320px in en/es/ar, no horizontal overflow, and that
  nothing animates with motion off.
