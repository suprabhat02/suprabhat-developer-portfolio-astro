# Suprabhat — brand mark, logo & favicons

**Concept — "S." (a signature with a full stop).** A custom-drawn S, not a font glyph, ends with a square
accent "period". That square is the same accent square the site header already uses, so this formalizes the
existing identity. The S has real type contrast: verticals are heavier than horizontals (4.8 vs 4.0 units). It also
has a narrower top bowl than bottom bowl and squared, mono-style terminals that match Geist Mono. The wordmark
uses Geist Mono SemiBold outlines, re-kerned by hand, with the custom s swapped in. There are no gradients,
everything is flat, and every file is converted to outlines (no font dependency).

Colors (from `src/styles/tokens.css` fallbacks):

- Dark: ink `#f3f5f8`, accent `#ff4d2a`, ground `#070c10`
- Light: ink `#11171c`, accent `#ff4d2a` (the mark is a fill, so it keeps the
  true brand colour in both themes)

## Files

| File                                                                        | Use                                                                                                                           |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `logo/logo-mark.svg`, `logo-wordmark.svg`, `logo-lockup.svg`                | Standalone and adaptive (follow the OS light/dark setting). Use these for GitHub READMEs, npm, and anywhere outside the site. |
| `logo/*-on-dark.svg`, `*-on-light.svg`                                      | Fixed colors for social banners, slides, the resume PDF, and email signatures.                                                |
| `logo/logo-mark-inline.svg`, `logo-wordmark-inline.svg`                     | For inlining **inside the site**: `currentColor` + `var(--accent)`, so they follow the site's own theme toggle.               |
| `favicons/favicon.svg`                                                      | Adaptive, transparent background. Navy glyph in light tabs, white glyph in dark tabs.                                         |
| `favicons/favicon.ico` (16/32/48), `favicon-16x16.png`, `favicon-32x32.png` | Legacy fallback on a navy tile.                                                                                               |
| `favicons/apple-touch-icon.png` (180, full-bleed)                           | iOS adds its own corner rounding.                                                                                             |
| `favicons/android-chrome-192/512.png`                                       | Android `purpose: any`.                                                                                                       |
| `favicons/maskable-512x512.png`                                             | Android `purpose: maskable` (the glyph sits inside the 80% safe zone).                                                        |
| `favicons/site.webmanifest`                                                 | Updated: adds the maskable icon and the SVG icon.                                                                             |

---

## Prompt for the VS Code agent

Integrate the new brand assets from `suprabhat-brand/` into the site. Work on a new branch called
`brand/logo-favicons`. Don't push.

1. **Favicons:** Replace every file in `public/assets/favicons/` with the matching file from
   `suprabhat-brand/favicons/`. Keep the filenames identical so the `<link>` tags in `BaseLayout.astro`
   (around line 183) keep working. Add `maskable-512x512.png`. Copy `favicon.ico` to `public/favicon.ico`
   too, because browsers request `/favicon.ico` at the root. Delete the stale duplicate
   `public/assets/favicons/site.webmanifest`. Replace `public/site.webmanifest` with the new one.
   Delete `public/favicon.png` if nothing references it (check with grep first).
2. **Header logo** (`src/components/Header.astro`, around lines 115–123): for `en`/`es`, replace
   `<span class="logo-mark"></span>Suprabhat` with the contents of `logo-wordmark-inline.svg`, inlined as
   markup, not as `<img>`, so `currentColor` and `var(--accent)` follow the theme toggle. Size it with CSS:
   `height: 22px; width: auto`. Keep the existing `aria-label` on the `<a>`. The SVG is `aria-hidden`.
   For `ar`, keep the Arabic text name, and replace the 8px `.logo-mark` span with `logo-mark-inline.svg`
   at `height: 18px`. Check RTL ordering.
   Remove the now-unused `.brand .logo-mark` CSS, including its glow `box-shadow`. The brand is flat.
3. **Footer:** if `.footer-wordmark` renders the name as text, consider the same inline wordmark. Match the
   existing size.
4. Run the build, lint and the full e2e + axe suite. Check the header at 360px width (the wordmark must not
   collide with the menu button) and at 1440px, in both themes and all three locales. Lighthouse must stay
   100/100/100/100.
5. Commit as `suprabhat02` only, with no co-author trailers.
