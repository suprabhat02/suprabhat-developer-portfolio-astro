# Production deployment

## Decision

Use Netlify as the target production host. The site remains a static Astro
build, while Netlify provides the response-header and immutable-cache controls
that the current GitHub Pages deployment cannot express.

GitHub Pages remains the live host until the cutover is verified. Do not disable
the Pages workflow or change DNS before the Netlify preview passes every check
below.

## Preview verification

1. Create the Netlify site from this repository using `netlify.toml`.
2. Set `PUBLIC_WEB3FORMS_KEY` as a protected environment variable.
3. Verify the deploy preview returns `noindex,follow` on every HTML route.
4. Exercise every locale, navigation menu, form state, RSS feed, sitemap, and
   custom 404 page.
5. Inspect CSP report-only violations and remove unnecessary origins.
6. Confirm `/_astro/*` responses use one-year immutable caching while HTML
   revalidates.
7. Run the build, lint, Playwright, Axe, broken-link, and Lighthouse checks.

## Contact delivery

The site remains statically generated. Contact submissions receive native and
browser-side validation, then Web3Forms handles delivery, spam protection, and
rate limiting. Configure those protections in the Web3Forms dashboard; this
repository does not claim to provide server-side form validation.

## DNS cutover

1. Record the current GitHub Pages DNS values and lower DNS TTL in advance.
2. Add and verify `suprabhat-dev.com` and `www.suprabhat-dev.com` in Netlify.
3. Switch DNS only after the production certificate is ready.
4. Verify the canonical host redirect, HTTP protocol, headers, cache behavior,
   all locale routes, and legacy redirects from an uncached browser.
5. Monitor CSP reports before replacing `Content-Security-Policy-Report-Only`
   with an enforced `Content-Security-Policy` header.
6. Disable the GitHub Pages workflow only after the new host is stable.

Do not add HSTS `includeSubDomains` or `preload` until every subdomain has been
inventoried and confirmed to support HTTPS.
