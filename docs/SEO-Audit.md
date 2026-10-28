# SEO audit and implementation roadmap

Reviewed: 28 October 2026  
Repository reviewed: suprabhat02/suprabhat-developer-portfolio-astro  
Main snapshot inspected: 3eb58035c9051d946f56624e75d93f19de664812 (22 October 2026)  
Implementation branch: seo/comprehensive-audit-2026-10

## Executive assessment

The portfolio already has a stronger technical SEO baseline than a typical personal site. It is statically rendered with Astro, uses canonical URLs and localized alternates, publishes an XML sitemap and RSS feeds, marks intentionally excluded pages as noindex, and emits JSON-LD for the person, website, page, articles, and case studies. The repository also has Playwright tests for SEO signals, structured data, localization, content routes, and sitemap dates.

The biggest remaining uncertainty is not a missing meta tag. No Google Search Console or Bing Webmaster Tools query, indexing, backlink, or field Core Web Vitals reports were available during this review. Without that account data, exact rankings, search impressions, click-through rates, and any indexing exclusions cannot be diagnosed honestly.

No implementation can guarantee first place for every keyword, search engine, country, device, or browser. The practical goal is to make important pages discoverable and eligible, strengthen relevance for specific searches, demonstrate first-hand expertise, and measure whether qualified impressions and enquiries improve.

## What the source currently does well

- The SEOHead component emits a title, description, author, robots directive, canonical URL, Open Graph metadata, Twitter metadata, and JSON-LD. JSON-LD serialization escapes the less-than character before placing it in an inline script.
- The BaseLayout sets document language and direction, links equivalent language versions with hreflang and x-default, and emits consistent Person, WebSite, and WebPage entities.
- The Astro configuration generates a sitemap, uses date-only lastmod values where available, and excludes 404, tag archives, and the deliberately noindexed privacy and skills pages.
- The public robots.txt permits crawling and points crawlers to the sitemap index.
- Blog posts have per-article metadata, article structured data, tags, related links, feed links, and translated route handling. Case studies use their own share images rather than the default image.
- The source contains English, Spanish, and Arabic content; Arabic uses RTL layout. Existing end-to-end tests cover localized case studies, language switching, metadata, structured data, feeds, and sitemap dates.
- The seven article slugs exist in English, Spanish, and Arabic. The case-study data also contains localized entries. These are stronger foundations than creating many near-duplicate SEO landing pages.

## Verified implementation work on the audit branch

### 1. Reproducible Node.js version

A Dependabot pull-request workflow run on 26 October failed before the build could begin. Its log states that the runner supplied Node.js 22.23.3 while the resolved Astro version required at least 22.23.4. The workflow had requested the moving major version 22, so the toolchain did not match the requirement.

The branch pins Node.js 22.23.4 in .nvmrc, updates GitHub Actions to read that file, and updates the setup documentation and agent instructions. Node.js 22.23.4 is an official LTS release published on 21 October 2026.

### 2. IndexNow discovery notification for Bing and participating engines

The branch adds a publicly hosted IndexNow verification key and a Node script that reads the deployed sitemap, validates its canonical HTTPS URLs, and submits the URL set to IndexNow. The deployment workflow only attempts this after a successful production deployment when the push changes content, route, metadata, or shared rendering files. Submission errors are non-blocking so an external indexing service cannot make a valid site deployment fail.

IndexNow is a discovery/freshness notification, not a ranking guarantee and not a replacement for Google Search Console. The public key file is a protocol ownership check, not a private credential. The workflow and key must be merged and deployed before this integration is live; the branch's CI checks remain to be confirmed.

### 3. SEO regression guard

The branch adds an end-to-end contract test intended to detect missing titles/descriptions, duplicate indexable titles or canonicals, indexable canonical URLs missing from the sitemap, noindex pages accidentally present in it, and malformed 404 indexing signals. The test also checks that the IndexNow key asset is present in the build. These are new checks; they should be considered pending until the CI workflow runs successfully.

## Research conclusions from current official guidance

### Google Search

Google's Search Essentials prioritize useful people-first content, natural query language in prominent page elements, crawlable links, and accurate content, images, and structured data. A complete technical setup helps eligibility and discovery, but does not ensure that a URL will be indexed or ranked.

Google chooses result titles and snippets automatically from several sources. Write concise, distinctive title elements and useful descriptions, but do not chase a rigid character count or assume the meta description will always be the displayed snippet. The page's actual heading and visible content should reinforce the title's promise.

Google's documentation for AI Overviews and AI Mode says the usual SEO fundamentals apply; there is no special AI-only schema or extra file required to appear. Avoid publishing large volumes of generic pages, keyword stuffing, doorway pages, or inauthentic mentions.

Official references:
- Search Essentials: https://developers.google.com/search/docs/essentials
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Title links: https://developers.google.com/search/docs/appearance/title-link
- Snippets and meta descriptions: https://developers.google.com/search/docs/appearance/snippet
- AI features and websites: https://developers.google.com/search/docs/appearance/ai-features
- Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Structured data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Multilingual sites: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

### Bing, Copilot, and participating search engines

Bing's current Webmaster Guidelines emphasize crawlable internal links, accurate sitemaps with valid canonical URLs and meaningful freshness dates, clear original content, and IndexNow notifications for updated URLs. The new workflow addresses discovery notification for content-affecting pushes; Bing Webmaster Tools is still needed for verification, crawl reports, and measurement.

Official references:
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- Bing URL submission and IndexNow: https://www.bing.com/webmasters/help/URL-Submission-62f2860b

### Performance

The existing Lighthouse evidence records a desktop production-homepage run from 10 September 2026. It is useful evidence for that specific run, not proof that every route has excellent mobile performance or good real-user Core Web Vitals. Validate the home page, key services and work pages, and representative articles on mobile as well as desktop. Use Search Console's Core Web Vitals report for field data where sufficient user data exists.

The current “good” Core Web Vitals targets are LCP at or below 2.5 seconds, INP below 200 milliseconds, and CLS below 0.1 at the 75th percentile. A perfect lab score alone does not guarantee top rankings.

Reference: https://developers.google.com/search/docs/appearance/core-web-vitals

## Practical query map for this portfolio

Use these as intent clusters to validate in Search Console and Bing search reports, not as claims about search volume or current positions.

| Intent | Representative searches | Best destination |
|---|---|---|
| Personal brand | Suprabhat Kumar, Suprabhat Kumar React developer, suprabhat-dev | Homepage and About |
| Hiring and role | Senior React engineer, React TypeScript frontend engineer, senior frontend engineer India | Homepage, About, Experience |
| Freelance services | React dashboard development, frontend architecture review, React performance audit, design system development, accessibility audit | Services and Contact |
| Proof of execution | React SaaS dashboard case study, frontend performance modernization, accessible contact workflow, design system case study | Relevant Work/case-study pages |
| Informational expertise | Accessibility in React, scalable React UI, frontend code review checklist, Core Web Vitals debugging | Blog articles linked to related case studies and services |

Avoid creating a separate page for every variation of a role keyword, city, or country. Each indexable page should satisfy a distinct user intent with information that adds real value.

## Next priorities, in order

1. **Verify and measure.** Verify the domain in Google Search Console and Bing Webmaster Tools, submit https://suprabhat-dev.com/sitemap-index.xml, and inspect the homepage, About, Services, Work, a case study, and a published article. Review Page indexing, canonical selection, search queries, impressions, clicks, CTR, average position, crawl errors, and manual/security actions.
2. **Improve pages using query data.** Look at actual queries and pages with impressions but weak CTR, and queries sitting just outside the top results. Update titles and on-page copy only when they better match the searcher's intent and the content that is actually present.
3. **Increase original evidence.** Upgrade case studies with truthful details on constraints, trade-offs, implementation, tests, accessibility, and outcomes. Add metrics or screenshots only when they are real, shareable, and approved. Do not invent client results or confidential details.
4. **Publish fewer, stronger articles.** Expand practical guides with original code examples, test cases, diagrams, and observed trade-offs. Link each piece to relevant case studies and service pages. Review translations for completeness and natural language rather than relying on direct keyword substitution.
5. **Earn relevant references.** Keep public profiles consistent and linked to the portfolio; share useful code, npm projects, technical write-ups, and community contributions. Prioritize editorially earned links and real professional references over paid links or manufactured mentions.
6. **Validate page experience.** Test mobile performance and interaction on pages that matter to visitors. Keep changes behind the existing CI checks for formatting, lint, Astro build/type checks, Playwright, and accessibility.

## Measurement cadence

Establish a baseline from Search Console and Bing Webmaster Tools before making broad title or content edits. Review branded and non-branded impressions, clicks, CTR, average position, indexed canonical URLs, qualified contact enquiries, referring domains, and field Core Web Vitals monthly. Compare date ranges and page/query cohorts, not a single manual search result; location, device, personalization, and result features make isolated rankings unreliable.

## Access limitations

No Search Console, Bing Webmaster Tools, backlink index, or analytics account data was accessed for this audit. Search positions, query volume, indexing status, and real-user performance must not be guessed. The new workflow, metadata test, and IndexNow integration are on the implementation branch until reviewed and merged.
