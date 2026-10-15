# suprabhat-dev.com — Codebase & SEO Audit

Oct 14, 2026 · @Suprabhat

## Summary

Production at suprabhat-dev.com matches the latest commit of [suprabhat-developer-portfolio-astro](https://github.com/suprabhat02/suprabhat-developer-portfolio-astro) (`b97dbae`, 10 Oct 2026, "Update portfolio palette and interaction polish"). The build passes and produces 102 HTML pages and 99 sitemap URLs. The SEO foundation is strong; the main gaps are broken language-switch links, thin tag and utility pages, weak Spanish and Arabic titles, and missing freshness signals.

## How the site is built

| Area      | What's in place                                                                                                                                                                                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack     | Astro 7, fully static, TypeScript strict. No UI framework at runtime; hand-built CSS motion layer (`motion.ts`) and OKLCH colour tokens. Only client package: `react-smart-copy/core` for copy buttons.              |
| Hosting   | GitHub Pages, deployed by `deploy-pages.yml` on every push to `main`. Hostinger manages DNS only. `netlify.toml` and the `.htaccess` files are inactive, so no custom headers, cache rules or server-side redirects. |
| Languages | English (no prefix), Spanish (`/es/`), Arabic (`/ar/`, right-to-left).                                                                                                                                               |
| Content   | Typed data files in `src/data/`; interface text in `i18n/messages.ts`; 3 blog posts, 7 case studies and 12 static pages per language.                                                                                |

### Existing SEO pieces

- `SEOHead.astro` sets title, description, canonical, robots, Open Graph and Twitter tags.
- `BaseLayout` adds hreflang links, including x-default.
- Every page has one combined structured-data block with Person, WebSite and WebPage entries.
- The homepage adds ProfessionalService with its service catalogue, the react-smart-copy software entry, a problems list and FAQPage.
- Case studies use TechArticle, posts use BlogPosting, and every page has breadcrumbs.
- Sitemap with hreflang and x-default, RSS feeds per language, `llms.txt`, `robots.txt`.
- Playwright tests check the SEO tags.

### Repo rules to follow (`CLAUDE.md` / `AGENTS.md`)

- Never invent facts.
- Keep Lighthouse at 100 in all four categories.
- Keep all three languages and the Arabic layout correct.
- Work on a branch; don't push to `main`, which deploys to production.
- Commits authored only as suprabhat02, with no AI co-author line.

## Problems found during the audit

The first item is a real defect; the rest are ranking and click-through improvements.

| #   | Problem                                            | Detail                                                                                                                                                                                                                                    |
| --- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Broken language-switch links on tag pages          | About 56 internal links point to pages that don't exist. Tag slugs are translated (`accessibility` vs `accesibilidad`), but the switcher reuses the English path, sending people and crawlers to 404s.                                    |
| 2   | Weak tag archive pages                             | 30 tag pages with roughly 85–150 words each, all indexed, no hreflang, mostly 1–2 posts each. Likely seen as thin or duplicate content.                                                                                                   |
| 3   | Blog-post language switcher goes to the wrong page | On any article it links to the other language's `/blog/` index instead of the translated article. The hreflang links themselves are correct.                                                                                              |
| 4   | Weak Spanish and Arabic titles                     | Inner pages use a generic pattern like "Sobre mí — Suprabhat Kumar"; English pages have keyword-targeted titles.                                                                                                                          |
| 5   | Uneven content across languages                    | English About has 366 words, Spanish 121, Arabic 102.                                                                                                                                                                                     |
| 6   | English titles missing the name                    | Skills, Tools, Experience, FAQ, Recommendations, Privacy and Accessibility lack "\| Suprabhat Kumar". Privacy's title is just "Privacy" (7 characters).                                                                                   |
| 7   | Titles and descriptions too long                   | Many case-study and post titles run 64–91 characters and get cut off in results; several descriptions run 164–189 characters.                                                                                                             |
| 8   | Very short indexed pages                           | Tools 29 words, Accessibility 37, Privacy 59, Skills 65 — all indexed.                                                                                                                                                                    |
| 9   | One social preview image everywhere                | Every page shares `og-image.jpg`, including articles and case studies; `generate-og.mjs` only makes that single image.                                                                                                                    |
| 10  | No freshness signals                               | Sitemap has no `lastmod`; case-study modified dates are hard-coded to 2026-09-06; all 3 posts share one publish date.                                                                                                                     |
| 11  | Gaps in structured data                            | No `alumniOf` (VTU) or `hasOccupation`; linked profiles limited to LinkedIn, GitHub, npm; no translated alternates for posts; no `og:locale:alternate` or `twitter:creator`.                                                              |
| 12  | Leftover inconsistencies                           | Slug `frontend-best-practices-clean-ui` no longer matches its title ("How to Build Scalable React UI…"); Spanish and Arabic post titles missed the English rewrites; `contentVerification.ts` lists 11 planned articles but only 3 exist. |

## Other limits and next steps

There is no analytics, and it's unclear whether Search Console is set up. GitHub Pages also can't do real 301 redirects, which matters if URLs ever change.

Next, choose where to start:

- [ ] Fix the technical issues above
- [ ] Keyword and content strategy
- [ ] Authority and reach (profiles, links, community)
