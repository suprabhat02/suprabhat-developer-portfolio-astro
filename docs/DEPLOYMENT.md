# Production deployment

## Current architecture

The production site is a static Astro build hosted by GitHub Pages. Hostinger
manages the DNS zone for `suprabhat-dev.com`; it does not receive the `dist`
folder. A push to `main` starts `.github/workflows/deploy-pages.yml`, which
installs dependencies, builds the site, uploads `dist`, and deploys it through
GitHub Pages.

The checked-in `netlify.toml` is an inactive reference configuration. Netlify is
not part of the current deployment.

## Where to verify each setting

1. GitHub repository > **Settings > Pages**: confirm the source is **GitHub
   Actions**, the custom domain is `suprabhat-dev.com`, and **Enforce HTTPS** is
   enabled.
2. GitHub repository > **Actions**: open **Deploy to GitHub Pages** to inspect
   each production deployment and its public URL.
3. Hostinger hPanel > **Domains > DNS / Nameservers**: confirm the apex `A`
   records point to GitHub Pages and the `www` record is a CNAME for the GitHub
   Pages hostname. Do not change working DNS records during a content release.
4. GitHub repository > **Settings > Secrets and variables > Actions**: add a
   repository secret named `PUBLIC_WEB3FORMS_KEY`. Never commit or paste its
   value into chat.

## Contact delivery

Create or open the form at `web3forms.com` using
`suprabhatkumar02@gmail.com`. In Web3Forms:

1. Verify the destination email address.
2. Restrict submissions to `suprabhat-dev.com` and
   `www.suprabhat-dev.com` if domain restriction is available for the account.
3. Enable the provider's spam protection.
4. Enable submission notifications to the verified email.
5. Leave an autoresponder disabled until its wording, consent basis, and reply
   address have been reviewed.
6. Review Web3Forms' current dashboard and privacy documentation for retention
   controls; the repository must not invent a retention period.

Web3Forms owns server-side delivery, provider rate limits, spam filtering, and
submission storage. The static site provides native and browser-side validation
plus a direct email fallback.

## Release procedure

1. Run `npm run format:check`, `npm run lint`, `npm run check`,
   `npm run test:e2e`, and `npm run build`.
2. Commit and push to `main`.
3. Open GitHub **Actions > Deploy to GitHub Pages** and confirm the workflow is
   green.
4. Verify the homepage, contact form, recommendations, localized routes,
   sitemap, RSS feeds, and custom 404 page on `https://suprabhat-dev.com`.
5. If the form reports that it is unconfigured, confirm the GitHub Actions secret
   name and rerun the workflow.

GitHub Pages does not apply the response headers in `netlify.toml`. If custom
security headers, redirects, or edge caching become necessary later, evaluate a
Cloudflare proxy or a deliberate hosting migration as a separate project.
