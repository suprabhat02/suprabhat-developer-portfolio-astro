# Theming

The design system follows Vercel's Geist (as used on nextjs.org): true-neutral
grays on pure black and white grounds, hairline gray-alpha borders, one blue
accent, Geist Sans for text and Geist Mono for labels and code. Every color
comes from `src/styles/tokens.css`; components only use role tokens such as
`--bg`, `--text` or `--accent`, never a color literal.

## Three layers

| Layer       | Examples                                        | Purpose                                         |
| ----------- | ----------------------------------------------- | ----------------------------------------------- |
| Primitives  | `--gray-100…1000`, `--blue-700`, `--red-900`    | Geist scales, verbatim, as `light-dark()` pairs |
| Brand alias | `--brand-100/400/700/900/1000`, `--brand-alt`   | Which scale is "the brand" (blue by default)    |
| Roles       | `--bg`, `--text-2`, `--accent`, `--accent-fill` | What components use                             |

Geist step semantics apply to every scale: 100 background · 200 hover
background · 300 active background · 400 border · 500 hover border · 600
active border · 700 high-contrast fill · 800 hover fill · 900 secondary text ·
1000 primary text. That is why `--accent` (text and links) is `--brand-900`,
while `--accent-fill` (buttons, dots, selection) is `--brand-700` (#0070f3)
with white text.

The theme toggle sets `color-scheme` on `<html>`, so each `light-dark()`
pair resolves for the active theme with no duplicated blocks. Browsers without
`light-dark()` get Geist's published hex values from the fallback block at the
end of the file.

## Re-theme in DevTools

1. Open DevTools and select the `<html>` element.
2. In **Styles**, find the `:root` rule from `tokens.css`.
3. Point the brand alias at another scale, for example green:

```js
const root = document.documentElement.style;
for (const step of ['100', '400', '700', '900']) {
  root.setProperty(`--brand-${step}`, `var(--green-${step})`);
}
```

Toggle the theme button to check light mode with the same change.

## Make it permanent

Edit the brand alias in `src/styles/tokens.css`. Then update the static
copies that browsers and social platforms read outside CSS:

- `src/layouts/BaseLayout.astro`: `<meta name="theme-color">`
- `public/site.webmanifest`: `theme_color` and `background_color`
- `public/assets/favicons/favicon.svg`, then regenerate the PNG and ICO sizes
- `scripts/generate-og.mjs`, then run `npm run generate:og`

## Typography

- **Geist Sans** renders all reading text and headings. It is preloaded on
  every page with `font-display: optional`, so it is normally used from the
  first frame and never swaps text later. A metric-matched fallback
  (`Geist Fallback`, Arial scaled with `size-adjust` and ascent/descent
  overrides computed from the font file) occupies the same space if it is
  late, so the page never shifts.
- **Geist Mono** is for labels, indices and code. motion.ts registers it after
  the page has loaded, keeping it off the first-paint path. Nothing rendered
  at load uses it.
- Headings use Geist's negative tracking tokens (`--tracking-display`
  through `--tracking-subsection`); all letter-spacing is reset to zero in
  RTL, where Arabic letters must join.

## Contrast

Roles are chosen from Geist steps that hold at least 4.5:1 for text on every
ground in both themes (for example `--text-3` sits between gray-800 and 900 in
light mode). After a large change, run `npm run test:e2e`; it includes axe
checks for both themes and RTL.

## Adding a color

Add a role in the roles layer of `tokens.css`, mapped to a Geist step:

```css
--info: var(--blue-900);
```

For a translucent variant, derive it with `color-mix` rather than a new
literal:

```css
background: color-mix(in oklch, var(--info) 12%, transparent);
```

## Effects that follow the tokens

Everything decorative reads the same roles, so a seed change re-themes it
with no extra work:

- **Aurora background** (`.fx-aurora-bg`, motion.css): stripes use `--bg`,
  bands use `--accent`, `--accent-2` and `--accent-strong`, blended with
  `screen` on dark grounds.
- **Living-card scenes** (`LiveScene.astro`, scenes.css): every fill and
  stroke resolves from `--accent`, `--accent-2`, `--success`, `--warning`,
  `--danger` and `--text` through the `--sc-*` aliases at the top of
  scenes.css.
- **Collaboration globe** (`src/scripts/globe.ts`): resolves `--accent`,
  `--accent-vivid`, `--accent-2`, `--accent-strong`, `--text`, `--text-2` and
  `--bg-2` to concrete colors (through a probe element, since tokens hold
  `light-dark()` expressions canvas cannot parse) when it mounts and on every
  theme change. Edits made live in DevTools apply on the next theme toggle.
- **Toasts** (`.toast`, global.css): `--success` and `--danger` set the tone.
