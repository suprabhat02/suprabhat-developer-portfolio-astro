# Theming

Every color on the site comes from `src/styles/tokens.css`. Components only
use role tokens such as `--bg`, `--text`, or `--accent`; no stylesheet contains
a brand color literal. Change the seeds, and the whole site follows: page
grounds, text, buttons, glows, gradients, borders, focus rings, and both themes.

## Seeds

| Seed                 | Default | Controls                                    |
| -------------------- | ------- | ------------------------------------------- |
| `--seed-primary-h`   | `292`   | Brand hue (electric violet)                 |
| `--seed-secondary-h` | `200`   | Secondary hue used in gradients (cyan)      |
| `--seed-neutral-h`   | `268`   | Hue bias of backgrounds and text (midnight) |
| `--seed-chroma`      | `0.2`   | Brand saturation, `0` (grey) to about `0.3` |
| `--seed-success-h`   | `155`   | Success state                               |
| `--seed-warning-h`   | `75`    | Warning state                               |
| `--seed-danger-h`    | `25`    | Error state                                 |

Hues are OKLCH angles in degrees: about 25 orange, 75 amber, 155 green,
200 cyan, 260 blue, 292 violet, 330 pink.

## Try a palette in DevTools

1. Open DevTools and select the `<html>` element.
2. In **Styles**, find the `:root` rule from `tokens.css`.
3. Edit a seed, for example set `--seed-primary-h` to `160`.

You can also run this in the console:

```js
document.documentElement.style.setProperty('--seed-primary-h', '160');
document.documentElement.style.setProperty('--seed-secondary-h', '60');
```

Toggle the theme button to check light mode with the same seeds.

## Make it permanent

Edit the seed values at the top of `src/styles/tokens.css`. Then update the
static copies that browsers and social platforms read outside CSS:

- `src/styles/tokens.css`: the `@supports not (color: oklch(0 0 0))` fallback
  block (hex values for very old browsers)
- `src/layouts/BaseLayout.astro`: `<meta name="theme-color">`
- `public/site.webmanifest`: `theme_color` and `background_color`
- `public/assets/favicons/favicon.svg`, then regenerate the PNG and ICO sizes
- `scripts/generate-og.mjs`, then run `npm run generate:og`

## Why contrast survives a hue change

OKLCH separates lightness from hue. Each role keeps a fixed lightness (for
example `--text-3` is `0.71` in dark mode and `0.5` in light mode), so any hue
keeps roughly the same contrast. The defaults measure at least 4.5:1 for every
text role on every surface in both themes. After a large change, such as raising
`--seed-chroma` above `0.25` or changing a role's lightness, run
`npm run test:e2e`; it includes axe checks for both themes and RTL.

## Adding a color

Add a role to both theme blocks in `tokens.css`, derived from a seed:

```css
--info: oklch(0.78 0.12 var(--seed-secondary-h));
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
  bands use `--accent`, `--accent-2` and `--accent-strong`.
- **Living-card scenes** (`LiveScene.astro`, scenes.css): every fill and
  stroke resolves from `--accent`, `--accent-2`, `--success`, `--warning`,
  `--danger` and `--text` through the `--sc-*` aliases at the top of
  scenes.css.
- **Collaboration globe** (`src/scripts/globe.ts`): reads `--accent`,
  `--accent-2`, `--accent-strong`, `--text`, `--text-2` and `--bg-2` from
  the page when it mounts, and again whenever `data-theme` changes. Edits
  made live in DevTools apply on the next theme toggle.
- **Toasts** (`.toast`, global.css): `--success` and `--danger` set the tone.
