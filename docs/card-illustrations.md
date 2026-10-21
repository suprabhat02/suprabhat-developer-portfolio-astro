# Card illustrations

Featured articles, About me, and Core expertise no longer use static image
files. They render the same animated `LiveScene` SVG engine used everywhere
else on the homepage (services, engagements, approach, collaboration — see
`docs/MOTION.md`).

Each scene is a hand-authored SVG defined in `src/components/fx/LiveScene.astro`
and registered by name in `src/components/fx/scenes.ts`. Colors come only
from design tokens (`src/styles/tokens.css` via the `--sc-*` vars in
`src/styles/scenes.css`), so a scene automatically follows light/dark theme
and any palette change — nothing is a baked-in color or a downloaded asset.

| Section            | Card                            | Scene         |
| ------------------- | -------------------------------- | ------------- |
| Featured articles   | Performance article              | `perf`        |
| Featured articles   | Accessibility article            | `a11y`        |
| Featured articles   | UI engineering article           | `components`  |
| About me            | Performance-first                | `perf`        |
| About me            | Accessibility by default         | `a11y`        |
| About me            | Scalable architecture            | `stack`       |
| About me            | Full-stack capable               | `orbit`       |
| Core expertise      | Front-end engineering            | `components`  |
| Core expertise      | Back-end and API integration     | `server`      |
| Core expertise      | Design systems and performance   | `tokens`      |

Reusing a scene across two topically-related cards (e.g. `perf` for both the
performance article and the "Performance-first" trait) is intentional —
same icon language for the same concept, zero extra weight, nothing to keep
in sync between a Figma file and the code.

## Adding a new scene

1. Add the name to `sceneNames` in `src/components/fx/scenes.ts` with a
   one-line JSDoc description of the story it tells.
2. Add a `scene === 'your-name' && (...)` block to `LiveScene.astro`. Reuse
   the existing paint classes (`.ln`, `.t`, `.fa`/`.fb`/`.fok`/`.ftx`,
   `.sa`/`.sb`/`.ok`) and animation triggers (`k k-draw`, `k k-rise`,
   `k k-pop`, `k k-packet`, `k k-tick`, etc. — see `scenes.css`) before
   inventing a new keyframe.
3. If the story needs a new keyframe, add it under "Animation engine" in
   `scenes.css`, with its `0%` frame matching the element's resting state
   (scenes must look complete and static until engaged).
4. Reference the scene from content with `<LiveScene scene="your-name" />`
   inside a card carrying the `fx-live fx-card-gradient` classes (plus
   `fx-glow`/`data-glow`, and `fx-tilt`/`data-tilt` if the card tilts).

Do not add raster images, external SVG downloads, or any other static
illustration format for on-page cards — it breaks theme-reactivity, adds
asset weight, and cannot be hover/tap-gated the way this engine is.
