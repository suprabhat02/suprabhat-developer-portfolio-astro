# Card illustrations

Featured articles, About me, and Core expertise no longer use static image
files. They render the same animated `LiveScene` SVG engine used everywhere
else on the homepage (services, engagements, approach, collaboration — see
`docs/MOTION.md`).

Each scene is a hand-authored SVG mounted by `src/components/fx/LiveScene.astro`
and registered by name in `src/components/fx/scenes.ts`. Colors come only
from design tokens (`src/styles/tokens.css` via the `--sc-*` vars in
`src/styles/scenes.css`), so a scene automatically follows light/dark theme
and any palette change — nothing is a baked-in color or a downloaded asset.

| Section           | Card                                          | Scene     |
| ----------------- | --------------------------------------------- | --------- |
| Featured articles | `react-inp-benchmark`                         | `race`    |
| Featured articles | `accessibility-in-react-what-developers-skip` | `voice`   |
| Featured articles | Every other post slug                         | `article` |
| About me          | Performance-first                             | `vitals`  |
| About me          | Accessibility by default                      | `keys`    |
| About me          | Scalable architecture                         | `branch`  |
| About me          | Full-stack capable                            | `bridge`  |
| Core expertise    | Front-end engineering                         | `layout`  |
| Core expertise    | Back-end and API integration                  | `flow`    |
| Core expertise    | Design systems and performance                | `system`  |

The five redesigned sections live in `src/components/fx/scenes/`. Their
visual-only stories use no code and almost no words. See
[Motion: visual stories](MOTION.md#visual-stories-outside-the-stack) for the
complete scene inventory and animation rules. The `perf` loading filmstrip
is also used by the small hero work-proof card. Writing uses
`getArticleScene(post.id)`, never the post's position in the featured list.

## Adding a new scene

1. Add the name to `sceneNames` in `src/components/fx/scenes.ts` with a
   one-line JSDoc description of the story it tells.
2. Add a `scene === 'your-name' && (...)` block to the relevant scene
   component. Reuse `Surface`, `ui-*` paint and existing motion primitives
   before introducing a keyframe.
3. Keep the unanimated CSS in the finished state. A `.ui-story` starts its
   ordered replay only on engagement and resets all beats together. Check
   start, intermediate and end frames, plus the reduced-motion result.
4. Reference the scene from content with `<LiveScene scene="your-name" />`
   inside a card carrying the `fx-live fx-card-gradient` classes (plus
   `fx-glow`/`data-glow`). Wrap layers in `<g class="lv-l" style="--d:…">`
   to give them parallax depth.

The collaboration bento combines the `chat`, `milestones` and `merge`
(package handover, not a version-control merge) scenes
with `WorldMap.astro`: a build-time dotted map, the existing portrait and
verified international team connections. The grid uses unequal column spans
on desktop, two columns on tablets and a single column on phones. All three
scenes retain hover/tap activation, with offscreen and reduced-motion rules;
the map needs no client framework or third-party map runtime.

Do not add raster images, external SVG downloads, or any other static
illustration format for on-page cards — it breaks theme-reactivity, adds
asset weight, and cannot be hover/tap-gated the way this engine is.

## Technology logos

Technology brand marks are separate from the animated illustrations. CSS3,
Ant Design, Material UI and Zustand use local artwork from
[Devicon](https://github.com/devicons/devicon/tree/master/icons), with its
license retained in `public/assets/techicons/LICENSE.devicon.txt`. The first
three are optimized SVGs; Zustand is a 96px WebP generated from the upstream
SVG to avoid shipping its 121 KB source at icon size.

GitHub Actions, JavaScript and Chakra UI also use Devicon artwork (the
`-original` SVGs from Devicon 2.18.0, unmodified). Astro, shadcn/ui, Zod and
Headless UI use monochrome marks from
[Simple Icons](https://github.com/simple-icons/simple-icons) (Headless UI from
16.38.0, CC0), with its license retained in
`public/assets/techicons/LICENSE.simple-icons.txt`. These four marks use the
existing dark-theme inversion treatment.

JavaScript, Chakra UI and Headless UI are skills without a tool entry of their
own, so their logos are listed as `skillOnlyLogos` in `src/data/tools.ts`: they
appear beside the skill name on the homepage and the Skills page, never on the
Tools page. RTK Query and the Context API reuse the Redux and React marks they
belong to; REST APIs has no logo and shows the `layers` icon.

`src/data/tools.ts` owns both the tool groups and the shared skill-logo lookup.
`src/data/skills.ts` supplies the same skills to the homepage and Skills page.
Both use six categories: languages/frameworks, state/data/validation,
styling/UI systems, backend/databases, design/documentation, and delivery/workflow.
On the homepage `src/data/stack.ts` joins the two into one section: a bento of
six cards on desktop and a carousel on smaller screens, each card with a scene,
the localized Tools page heading and description, and the group's technologies.
The dedicated Skills and Tools pages keep three columns and two rows on desktop.
Names remain in server-rendered lists beside decorative, lazy-loaded icons, and
every card stays in the document with or without script.
