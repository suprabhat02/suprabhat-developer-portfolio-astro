# SEO launch and growth operations

Technical SEO makes the site understandable, fast, and crawlable. It cannot guarantee a first-place ranking. Competitive rankings also require useful content, demonstrated expertise, trusted references, relevant links, engagement, and time.

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
7. Confirm that HTTPS is enabled and production pages contain `index,follow`.
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
3. Enable IndexNow in Netlify or a trusted deployment integration if frequent publishing makes it useful.
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

No analytics package is installed. If measurement is added, use a privacy-respecting product, update the privacy page, and load it only after evaluating performance and legal requirements for the target audience.

Track at minimum:

- Search Console clicks, impressions, average position, and indexed URLs
- Branded versus non-branded query growth
- Queries that reach services, work, and contact pages
- Contact enquiries attributable to organic search
- Core Web Vitals field data when sufficient traffic exists
- Referring domains and links to useful resources

Review performance quarterly and make decisions from query/page data. Titles and descriptions can improve relevance and click-through rate, but they should remain accurate and should not be rewritten simply to repeat keywords.
