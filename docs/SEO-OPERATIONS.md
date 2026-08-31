# SEO launch and growth operations

Technical SEO makes the site understandable, fast, and crawlable. It cannot guarantee a first-place ranking. Competitive rankings also require useful content, demonstrated expertise, trusted references, relevant links, engagement, and time.

## Domain launch checklist

1. Add `suprabhat-dev.com` and `www.suprabhat-dev.com` to the Netlify site.
2. Set `suprabhat-dev.com` as the primary domain and enforce HTTPS.
3. If `suprabhatkumar.com` was previously live, attach it to the same Netlify site so the configured host-level 301 redirect can execute. Keep that redirect for at least one year and preferably indefinitely.
4. Set `PUBLIC_WEB3FORMS_KEY` in the production environment.
5. Deploy and verify these public URLs:
   - `https://suprabhat-dev.com/`
   - `https://suprabhat-dev.com/robots.txt`
   - `https://suprabhat-dev.com/sitemap-index.xml`
   - `https://suprabhat-dev.com/rss.xml`
   - `https://suprabhat-dev.com/assets/images/og-image.jpg`
6. Confirm that HTTP, `www`, and the former host redirect once to the HTTPS apex URL without chains.
7. Confirm deploy previews contain `noindex,follow` and production pages contain `index,follow`.

## Search engine registration

### Google Search Console

1. Create a Domain property for `suprabhat-dev.com` and verify it with the DNS TXT record Google provides.
2. Submit `https://suprabhat-dev.com/sitemap-index.xml`.
3. Inspect the homepage, services page, work page, and each published article, then request indexing after the first production deployment.
4. Review Page indexing, Core Web Vitals, HTTPS, manual actions, and security issues monthly.
5. When moving from an indexed old domain, use Google's Change of Address tool after redirects are live.

### Bing Webmaster Tools

1. Add and verify `suprabhat-dev.com`, either through DNS or by importing the Google Search Console property.
2. Submit the sitemap index.
3. Enable IndexNow in Netlify or a trusted deployment integration if frequent publishing makes it useful.
4. Review crawl errors and keyword reports monthly.

Never invent verification tokens or commit private service credentials. DNS and HTML verification values must come from the account owner.

## Global discoverability

English pages can rank internationally without country targeting. Keep language concise and use terms naturally used by hiring teams and product organizations, such as senior frontend engineer, React engineer, Next.js developer, TypeScript developer, SaaS frontend development, dashboard UI engineering, web accessibility, design systems, and Core Web Vitals.

Spanish and Arabic routes remain indexable only while every visible factual sentence has a reviewed translation. English-only blog articles do not have locale equivalents, so localized blog indexes remain `noindex` until translated articles are published. When a locale needs to be held back:

1. Publish complete translated pages rather than thin interface-only copies.
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
- Add specific, confidentiality-safe case studies when role, constraints, decisions, and outcomes can be verified.

## Measurement

No analytics package is installed. If measurement is added, use a privacy-respecting product, update the privacy page, and load it only after evaluating performance and legal requirements for the target audience.

Track at minimum:

- Search Console clicks, impressions, average position, and indexed URLs
- Branded versus non-branded query growth
- Queries that reach services, work, and contact pages
- Contact enquiries attributable to organic search
- Core Web Vitals field data when sufficient traffic exists
- Referring domains and links to useful resources

Review performance quarterly and make decisions from query/page data. Titles and descriptions can improve relevance and click-through rate, but they should remain accurate and should not be rewritten simply to repeat keywords.
