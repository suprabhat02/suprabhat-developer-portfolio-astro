# SEO launch and growth operations

Technical SEO makes the site understandable, fast, and crawlable. It cannot guarantee a first-place ranking. Competitive rankings also require useful content, demonstrated expertise, trusted references, relevant links, engagement, and time.

## Strict pre-release gate

Use the Node version in `.nvmrc` (22.23.4), install the lockfile with `npm ci`, and run these checks against the exact revision intended for release:

```sh
npm run build
npm run lint
npm run format:check
npm run test:e2e -- --workers=4
```

After Playwright exits, start `npm run preview -- --host 127.0.0.1 --port 4323` in a separate terminal, then run:

```sh
npm run audit:lighthouse
```

The pinned Lighthouse runner uses Playwright's installed Chromium, the standard mobile and desktop profiles, three runs per profile, and all three homepages. Every category in every run must have a raw score of `1`. A missing category, runtime error, or score below 100 fails the command. Do not average scores, select the best run, disable motion only for audits, or skip a failing category. Stop the audit preview before running Playwright again: Astro permits only one preview instance per workspace.

Reports and a summary are retained under `lighthouse-reports/<timestamp>/`. The summary records the Node and Lighthouse versions, URLs, profiles, runs, HTML hashes, and failures. The individual reports also contain browser and audit configuration details. Keep unsuccessful runs as evidence. Run audits sequentially on an otherwise idle machine, without building or running tests concurrently.

For additional templates, use explicit routes and retain the same threshold:

```sh
npm run audit:lighthouse -- --paths /services/,/tools/,/work/performance-modernization/,/contact/ --runs 3
```

Homepage measurements do not certify every route. The generated-page SEO tests separately inventory the entire build and check indexed-page metadata, canonical/sitemap consistency, reciprocal language links, internal destinations and fragments, image alternatives, parseable structured data, and internal incoming links. Intentional `noindex,follow` pages, including tag archives and duplicate skills content, are not indexing failures.

A local all-100 result is a release gate, not a promise of identical scores on every device or hosting environment. After an authorized deployment, repeat against the production origin and use Search Console field data when available. Do not merge or deploy under the strict requirement while the local gate is failing. No deployment workflow or branch protection is changed by this local command.

## Search-intent priorities

These are relevance-based keyword hypotheses grounded in existing portfolio content, not verified search-volume, difficulty, or ranking claims. Use one primary intent per page; do not insert every phrase into every title or heading.

| Page                               | Primary intent                              | Supporting phrases and evidence                                                                                              |
| ---------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `/`                                | Senior React frontend engineer in India     | React and TypeScript engineer; remote frontend engineer; confirmed role, location, and availability                          |
| `/services/`                       | React frontend consulting                   | React performance audit; frontend architecture review; SaaS dashboard development; actual service scope                      |
| `/work/performance-modernization/` | React performance optimization case study   | INP optimization; Core Web Vitals; the documented investigation and implementation, without invented metrics                 |
| `/work/`                           | Frontend engineering case studies           | SaaS dashboards; React design systems; accessible frontend architecture; link to the relevant individual case study          |
| `/blog/` and its articles          | Practical frontend implementation questions | Frontend code review checklist; React accessibility; frontend performance diagnostics; each article targets its own question |
| `/tools/`                          | Supporting technology expertise             | Astro, shadcn/ui, Zod, GitHub Actions, React, TypeScript; useful supporting context, not a substitute for service proof      |

The homepage title emphasizes the role, React specialization, and India. Its description connects that expertise to SaaS dashboards, design systems, and performance reviews. Technology names remain in their relevant visible groups and structured knowledge fields; there is no need for a meta-keywords tag, hidden keyword list, or repetitive location pages.

For Spanish and Arabic, use the reviewed localized role and service language already present on equivalent pages. Validate query wording with native-language Search Console/Bing data instead of mechanically translating English keyword lists or publishing unreviewed claims.

After sufficient indexed traffic exists, export query/page data from Google Search Console and Bing Webmaster Tools. Prioritize relevant non-branded queries with impressions, useful service intent, and a matching page; inspect click-through rate and qualified enquiries before changing titles. Preserve branded searches for Suprabhat Kumar. Record the date, country, language, and device segment with each decision. Without those account datasets, no phrase can honestly be labeled the objectively "best" keyword.

## AI-search eligibility

Google's AI features use the same search foundations: accessible crawling, indexing, snippet eligibility, useful textual content, descriptive internal links, and structured data that matches visible facts. Google does not require a separate AI file or special AI schema. `llms.txt` is supplementary navigation, not a ranking or citation guarantee.

Bing and Copilot also depend on crawlable, well-structured, accurate content. Keep canonical sitemaps current and use the existing IndexNow process for actual changes. Do not add `nosnippet`, `noarchive`, or `nocache` to public indexable pages without understanding their consequences for snippets and AI grounding. Indexed pages permit `max-image-preview:large`; private or intentionally excluded pages keep their exclusion policy.

Perplexity's current crawler documentation could not be verified from this environment because its documentation request was network-blocked. The site's general crawler policy remains open, but confirm current crawler names, network/WAF access, and any owner-facing controls directly with Perplexity before claiming provider-specific verification. Allowing a crawler never guarantees retrieval or citation.

Reviewed references:

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)

After deployment, the owner must verify live robots/sitemap responses, preferred canonicals, language alternatives, index eligibility, structured-data reports, and account-level crawl/indexing status. Local tests cannot certify search-engine indexing, production CDN behavior, backlinks, demand, or AI citations.

## Domain launch checklist

1. Use the `main` branch of `suprabhat02/suprabhat-developer-portfolio-astro` as the production source. The GitHub Actions workflow builds and publishes the static site to GitHub Pages on every push.
2. In GitHub repository Settings > Pages, set the source to GitHub Actions, configure `suprabhat-dev.com` as the custom domain, and enforce HTTPS after GitHub issues the certificate.
3. In the Hostinger DNS zone, configure the four GitHub Pages apex `A` records and `www` CNAME. Keep the Hostinger nameservers unchanged.
4. In GitHub repository Settings > Secrets and variables > Actions, add `PUBLIC_WEB3FORMS_KEY` using the value from the local `.env` file. This value must never be committed or copied into chat.
5. Redeploy after adding the secret by pushing a commit to `main` or using Run workflow in the Actions tab.
6. Deploy and verify these public URLs:
   - `https://suprabhat-dev.com/`
   - `https://suprabhat-dev.com/robots.txt`
   - `https://suprabhat-dev.com/sitemap-index.xml`
   - `https://suprabhat-dev.com/rss.xml`
   - `https://suprabhat-dev.com/es/rss.xml`
   - `https://suprabhat-dev.com/ar/rss.xml`
   - `https://suprabhat-dev.com/assets/images/og-image.jpg`
7. Confirm that HTTPS is enabled and intended indexable pages contain `index,follow,max-image-preview:large`; preserve intentional `noindex,follow` routes.
8. If `suprabhatkumar.com` was previously live, use a redirect-capable edge service such as Cloudflare Redirect Rules to redirect it to `https://suprabhat-dev.com/` for at least one year.

## GitHub Pages platform limits

GitHub Pages provides HTTPS and a global CDN, but does not allow this repository to control response headers or force HTTP/2/HTTP/3. Therefore Lighthouse may report short cache lifetimes, HTTP/1.1, or missing CSP, HSTS, COOP, and clickjacking headers even though the site scores 100 for Best Practices and SEO. Those are hosting-platform limitations, not Astro code defects.

Use Cloudflare in front of GitHub Pages only if custom cache rules, modern HTTP, response security headers, and redirects are required. Configure those controls at the edge after confirming the custom domain remains correctly connected; do not attempt to emulate response headers using HTML meta tags.

## Search engine registration

### Google Search Console

1. Create a Domain property for `suprabhat-dev.com` and verify it with the DNS TXT record Google provides.
2. Submit `https://suprabhat-dev.com/sitemap-index.xml`.
3. Inspect the homepage, services page, work page, case-study pages, and each published article, then request indexing after the first production deployment.
4. Review Page indexing, Core Web Vitals, HTTPS, manual actions, and security issues monthly.
5. When moving from an indexed old domain, use Google's Change of Address tool after redirects are live.

### Bing Webmaster Tools

1. Add and verify `suprabhat-dev.com`, either through DNS or by importing the Google Search Console property.
2. Submit the sitemap index.
3. After successful production pushes that affect indexed pages, the workflow submits changed blog article URLs plus their locale blog indexes for blog-only commits. Broader source changes submit the current canonical sitemap URL set because they may change many rendered pages. Deleted blog article URLs are included even after they leave the sitemap. The public ownership-check file is https://suprabhat-dev.com/indexnow-key.txt. This notifies Bing and other participating IndexNow engines; it does not submit URLs to Google or guarantee indexing or rankings. Check the IndexNow report in Bing Webmaster Tools after the workflow is merged and deployed.
4. Review crawl errors and keyword reports monthly.

Never invent verification tokens or commit private service credentials. DNS and HTML verification values must come from the account owner.

## Global discoverability

English pages can rank internationally without country targeting. Keep language concise and use terms naturally used by hiring teams and product organizations, such as senior frontend engineer, React engineer, Next.js developer, TypeScript developer, SaaS frontend development, dashboard UI engineering, web accessibility, design systems, and Core Web Vitals.

Spanish and Arabic routes are currently emitted as indexable localized pages because equivalent editorial copy exists for the primary pages, case studies, blog indexes, and published article pages. Keep them indexable only while every visible factual sentence has reviewed localized copy. When a locale needs to be held back:

1. Publish complete localized pages rather than thin interface-only copies.
2. Remove `noindex` for the completed locale.
3. Add reciprocal `hreflang` links for `en`, `es`, `ar`, and `x-default` only on equivalent translated pages.
4. Include indexable localized routes in the sitemap.
5. Keep recommendation quotations in their original language unless the recommender approves a translation.

Do not create many city or country pages with near-duplicate copy. International landing pages should exist only when they provide distinct services, availability, proof, or market-specific guidance.

## Content strategy

Publish material that demonstrates judgment rather than repeating generic definitions. Strong topic clusters for this portfolio include:

- Frontend architecture for data-heavy SaaS products
- React and Next.js performance diagnostics
- INP, LCP, and CLS investigation workflows
- Accessible dashboard and form patterns
- Design-system governance and component API decisions
- Type-safe API integration with FastAPI and TypeScript
- Testing keyboard behavior and screen-reader flows

Keep the blog taxonomy crawlable as the article library grows. Every article tag should resolve to a localized archive page, each article page should link to its tag archives, and related-article blocks should connect posts that share a practical topic.

Each article should answer one clear search intent, include original examples or diagrams where useful, link to relevant service/work pages, and be updated when framework or browser behavior changes. Avoid publishing unfinished articles only to increase page count.

A sustainable initial cadence is one high-quality article every two to four weeks. Measure indexed pages, non-branded impressions, qualified enquiries, links earned, and conversions rather than raw word count.

## Authority and digital marketing

Search visibility for competitive developer terms depends heavily on authority beyond the site.

- Keep LinkedIn and GitHub profiles complete and link them to `suprabhat-dev.com`.
- Publish useful code examples or small open-source tools that support article topics.
- Contribute technically substantive posts to relevant engineering communities without duplicating full articles.
- Seek podcast, meetup, conference, and guest-writing opportunities where frontend performance or accessibility expertise is relevant.
- Ask collaborators for permission to link recommendations to their original LinkedIn sources.
- Earn editorial links through useful research, tools, checklists, or case studies; do not buy links or participate in link exchanges.
- Keep confidentiality-safe case studies specific to role, constraints, decisions, and outcomes; add verified screenshots or metrics only when they can be shared.

## Measurement

Cloudflare Web Analytics is already injected by `BaseLayout.astro` on the production hostname only. Local preview and CI do not load that external beacon, so local Lighthouse scores do not certify its production impact. Verify the live request and privacy disclosures before adding any further measurement SDK or changing data collection. Search Console and Bing Webmaster Tools provide search-query evidence without adding client-side JavaScript.

Track at minimum:

- Search Console clicks, impressions, average position, and indexed URLs
- Branded versus non-branded query growth
- Queries that reach services, work, and contact pages
- Contact enquiries attributable to organic search
- Core Web Vitals field data when sufficient traffic exists
- Referring domains and links to useful resources

Review performance quarterly and make decisions from query/page data. Titles and descriptions can improve relevance and click-through rate, but they should remain accurate and should not be rewritten simply to repeat keywords.
