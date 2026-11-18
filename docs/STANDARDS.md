# Engineering standards

This is the quality bar for every change to this repository, whoever or whatever
makes it. It sets what "done" means. The detailed how-to lives in the linked
documents; this file wins only where it is stricter.

Read this file before starting any task. If a task cannot meet a rule here, stop
and say which rule and why. Never lower the bar quietly to finish.

## 0. Order of authority

1. The owner's explicit instruction for the current task.
2. [CLAUDE.md](../CLAUDE.md) (hard rules: facts, git, deploys, DNS, secrets).
3. This file.
4. Topic documents: [docs/MOTION.md](MOTION.md), [docs/THEMING.md](THEMING.md),
   [docs/SEO-OPERATIONS.md](SEO-OPERATIONS.md),
   [docs/CONTENT-STRATEGY.md](CONTENT-STRATEGY.md),
   [docs/card-illustrations.md](card-illustrations.md).
5. The code as it stands.

When two sources disagree, follow the stricter one and report the conflict.

## 1. Workflow

- Start every task from a clean, up-to-date `main`: `git fetch --all --prune`,
  `git checkout main`, `git pull --ff-only origin main`. If the tree is dirty or
  the pull is not a fast-forward, stop and ask. Never stash, reset or discard the
  owner's work.
- One concern per branch. Branch names describe the change (`feat/…`, `fix/…`,
  `docs/…`, `chore/…`).
- Before editing, read the files you will change and search for every other place
  that uses what you change (components, scene names, tokens, message keys).
- Every commit is authored and committed as
  `suprabhat02 <suprabhatkumar02@gmail.com>`. No `Co-Authored-By`, no "Generated with",
  no session links, no trailers.
- No AI tool or vendor name anywhere: files, comments, docs, commit messages,
  branch names, PR text. (The three agent instruction files keep their required
  file names.)
- Push only the feature branch. Never push to `main`, open a PR, or merge unless
  the owner says so in the current task. `main` deploys to production.
- Do not touch DNS, `.github/workflows/`, secrets or `PUBLIC_WEB3FORMS_KEY`
  unless the task is specifically about them.
- No new dependency without the owner's approval. Prefer the platform and the
  code already here.

## 2. Visual design: no "generated" look

The site has one visual system (Nocturne: dark-first, Geist Mono, OKLCH tokens,
hairlines, one brand orange). New work extends it; it never adds a second style.

Always:

- Colors only through role tokens from `src/styles/tokens.css` (`--bg`, `--text`,
  `--accent`, `--border`, `--success`, …). No raw color literals outside
  `tokens.css`. Run `node scripts/palette-check.mjs` after any token change.
  Details: [docs/THEMING.md](THEMING.md).
- Reuse the existing components (`SectionHeader`, `Carousel`, `LiveScene`,
  `Surface`, `Icon`, existing card classes) before creating new ones.
- Hierarchy through type size, weight, spacing and position. Spacing from the
  existing scale.
- Every visual element carries information. If you can remove it and nothing is
  lost, remove it.
- Layout is checked at 320, 390, 768, 1040, 1280 and 1440 px, in English and
  Arabic, in dark and light theme.

Never introduce:

- Decorative gradients, glows, blobs, glassmorphism stacks or new drop shadows.
- The inner-page CTA dotted glow is an owner-approved exception to the no-glows rule.
- Emoji as icons, clip art, stock 3D illustration, sparkles or confetti.
- Identical cards that differ only by text when the content has real structure.
- Fake data that reads as a claim about the owner: metrics, client names, logos,
  dates, test counts, timings or scores that are not in `src/data/*`.
- Lorem ipsum or placeholder copy in shipped code.
- A new font family, icon set or animation library.

## 3. SVG scenes

Scenes are the small animated illustrations on cards (`LiveScene`). Details:
[docs/MOTION.md](MOTION.md#product-scenes) ("Product scenes",
["Visual stories outside the stack"](MOTION.md#visual-stories-outside-the-stack))
and [docs/card-illustrations.md](card-illustrations.md).

### Purpose

- A scene explains its card to a non-technical visitor in about two seconds, from
  shapes, layout and motion alone. If a recruiter or founder could not say what it
  shows, it is not done.
- One story per scene: start state, change, clear end state. No two scenes on the
  site tell the same story.

### Form

- Choose a **diagram** (flow, structure, timeline, gauge, chart) for a process,
  system or result, or a **simplified product screen** for something a user sees.
- **No code** in any scene, except the Stack section's product scenes (`editor`,
  `store`, `responsive`, `query`, `handoff`, `review`), where the technologies are
  the subject. No keywords, syntax, file names, URLs, terminal output or HTTP
  methods elsewhere, and no `kw`/`type` text tones.
- **At most three short labels** per scene, one or two words each. Prefer icons,
  numbers and universal symbols. SVG text is not translated, so words reach Spanish
  and Arabic visitors in English.

### Drawing

- Canvas: viewBox `0 -12 320 144` scene units. Keep the band sizes the layouts
  already use; never enlarge a scene to fill space.
- Surfaces: `Surface.astro`, 1px non-scaling hairlines, radius 6 or less, no
  lips, no drop shadows, no 3D.
- Align to a consistent grid; keep stroke widths, node sizes and gaps consistent
  within and across scenes.
- Color: neutral token greys. The accent marks only the element the story is
  about. Green, amber and red mean success, risk and failure, nothing else.
- No SVG `filter`, no animated `fill`, no raster images inside scenes. Every
  scene is `aria-hidden` and decorative; the card text carries the meaning.
- Scenes are drawn left to right in every locale; the card layout around them
  mirrors in Arabic.

### Motion

- The resting frame is the finished, meaningful state. Hover, keyboard focus
  within the card, or a touch tap replays the story; scrolling never starts it.
- Cause before effect, on one synchronized timeline (`.ui-story`, `--i`). No idle
  loops or fidgeting.
- Animate only `transform`, `opacity` and stroke dashes. Packets and dashes end
  past their path so no round-cap dot remains.
- `prefers-reduced-motion: reduce` shows the end state with no animation and no
  parallax.

### Registration

- Register every scene in `src/components/fx/scenes.ts` with an accurate
  description, and update the scene table in [docs/MOTION.md](MOTION.md).
- Remove scene markup, CSS and keyframes that nothing references any more; prove
  it with a search.
- Check each scene frame by frame (pause animations at several times) and at
  every place it is reused, including small sizes.

## 4. Performance and Lighthouse

Details and measured pitfalls:
[docs/MOTION.md](MOTION.md#rules-that-keep-lighthouse-and-axe-at-100)
("Rules that keep Lighthouse and axe at 100",
["Measured pitfalls"](MOTION.md#measured-pitfalls-do-not-reintroduce)) and
[docs/SEO-OPERATIONS.md](SEO-OPERATIONS.md#strict-pre-release-gate)
("Strict pre-release gate").

- Pages are static HTML. Content never depends on JavaScript; scripts only
  enhance. No client framework, hydration island or third-party script, other than
  the production-only analytics beacon already in `BaseLayout.astro`.
- Every rule and pitfall in [docs/MOTION.md](MOTION.md) is binding. Do not
  reintroduce a listed pitfall.
- Images: built through the existing pipeline with explicit `width` and `height`;
  below-the-fold images lazy-load; the LCP element is never hidden, faded or
  delayed.
- Layout shift is zero. Reserve space for everything that loads or changes.
- Report homepage HTML size (gzip) for `/`, `/es/`, `/ar/` before and after any
  change to shared markup. Growth above 8 KB gzip per page needs a written reason;
  prefer deleting dead code to offset it.
- **Lighthouse gate:** the strict pre-release gate in
  [docs/SEO-OPERATIONS.md](SEO-OPERATIONS.md#strict-pre-release-gate):
  `npm run audit:lighthouse` against `npm run preview` on an idle machine, mobile
  and desktop, three runs per profile, on all three homepages plus every changed
  template route. Performance, Accessibility, Best Practices and SEO must each
  score 100 in every run. There is no exception for a 99 in any category. Never
  average runs, pick the best run, rerun until a pass appears, or disable motion
  for audits. If the unchanged `main` baseline already fails a path, report the
  failing metric with its numbers: it is fixed in its own task, and no change to
  the built site is merged while the gate fails.

## 5. Accessibility

Target: WCAG 2.2 AA as an implementation baseline, enforced by the axe-core
Playwright suite. Do not claim formal certification in copy.

- Zero axe violations, including target size, on every changed page in all three
  locales.
- Semantic HTML first: landmarks, one `h1` per page, ordered headings, real
  buttons and links, labelled form fields. ARIA only where HTML cannot express it.
- Every interactive element is reachable and operable by keyboard with a visible
  focus indicator; focus order follows reading order.
- Text contrast 4.5:1 (3:1 for large text and UI boundaries), checked in both
  themes. Never animate the opacity of text.
- Every `img` has an `alt` with a value: descriptive for content, `alt=""` for
  decoration. Decorative SVG is `aria-hidden`.
- `prefers-reduced-motion` is honoured everywhere. Nothing essential flashes,
  moves on its own for longer than five seconds without a pause, or depends on
  hover only.
- `lang` and `dir` are correct on every page. Arabic uses logical properties
  (`inline-start`/`inline-end`), mirrored arrows and zero `letter-spacing`.

## 6. SEO and structured data

Details: [docs/SEO-OPERATIONS.md](SEO-OPERATIONS.md),
[docs/SEO-Audit.md](SEO-Audit.md),
[docs/CONTENT-STRATEGY.md](CONTENT-STRATEGY.md).

- One primary search intent per page. Titles unique and within the limits the SEO
  tests enforce; descriptions written for people.
- Every indexable page has a self-canonical, reciprocal `hreflang` for en/es/ar
  plus `x-default`, and appears in the sitemap. Slugs and URLs do not change
  without a redirect plan (GitHub Pages cannot set server redirects).
- Structured data matches visible facts only, comes from `src/data/*`, and
  parses. No schema for things the page does not show.
- No keyword stuffing, hidden text, doorway pages or invented ratings, reviews or
  credentials.
- Internal links use descriptive anchor text and point to the right locale.
- `robots.txt` and the sitemap are authoritative; `llms.txt` is supplementary. Do
  not add `noindex`, `nosnippet` or `noarchive` to public pages without the owner's
  decision.
- The generated-page SEO tests must pass. New page types get the same coverage.

## 7. Content and voice in three languages

- **Facts:** never invent facts about the owner. Use only `src/data/*`,
  `src/i18n/messages.ts` and published content. Anything in
  `src/data/contentVerification.ts` stays withheld until the owner gives the real
  value.
- **Voice:** a senior engineer talking to a peer. Plain words, active voice,
  specific nouns and verbs, short sentences, sentence case. Show evidence instead
  of adjectives.
- **Avoid the generated tone:** no "delve", "leverage", "seamless", "robust",
  "cutting-edge", "elevate", "unlock", "empower", "game-changer", "in today's
  fast-paced world", "not just X but Y", stacked triplets for rhythm, or rhetorical
  questions as openers. No universal promises ("guaranteed", "always", "best") and
  no compliance claims the evidence does not support.
- **Each locale is written, not converted.** Spanish and Arabic read as if first
  written in that language: natural word order, idiomatic terms the local tech
  community uses, the conventions already used in `messages.ts` (for example the
  form of address in Spanish, Modern Standard Arabic, digit style). Technical names
  (React, TypeScript) stay as they are.
- **Same meaning in all three.** A change in one locale ships in all three in the
  same commit. If you are not confident in a Spanish or Arabic sentence, do not
  guess: leave the existing copy, add the item to your report for native review,
  and never ship English text in a non-English page.
- **UI strings** go in `src/i18n/messages.ts` for all three locales together;
  content stays in the data files and content collections, not hard-coded in
  components.

## 8. Definition of done

A task is done only when all of these are true and reported with real output:

- [ ] Started from an up-to-date `main` on a new branch; working tree clean at
      the end.
- [ ] Changed files were read before editing; every other use of changed names
      was found and checked.
- [ ] `npm run build`, `npm run lint`, `npm run format:check` pass.
- [ ] `npm run test:e2e` passes (stop any running `astro preview` first; only one
      preview can run per workspace).
- [ ] Lighthouse gate from section 4, with numbers, for anything touching markup,
      CSS, scripts, images or fonts.
- [ ] Screenshots reviewed at the widths in section 2, en and ar, both themes,
      plus reduced motion for anything animated.
- [ ] All three locales updated together, or the gaps listed for owner review.
- [ ] Docs updated where behavior changed ([MOTION.md](MOTION.md),
      [THEMING.md](THEMING.md), [SEO-OPERATIONS.md](SEO-OPERATIONS.md),
      [card-illustrations.md](card-illustrations.md), this file).
- [ ] Commits authored as `suprabhat02`, no trailers, no AI names; only the
      feature branch pushed.
- [ ] The report says plainly what was not verified or not possible.
