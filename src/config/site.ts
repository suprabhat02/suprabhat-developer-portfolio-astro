export const SITE_URL = 'https://suprabhat-dev.com';
export const SITE_NAME = 'Suprabhat Kumar';
export const DEFAULT_OG_IMAGE = '/assets/images/og-image.jpg';
export const SITE_DESCRIPTION =
  'Suprabhat Kumar — Senior Frontend Engineer specialising in React, TypeScript and scalable UI systems.';
export const X_PROFILE_URL = 'https://x.com/SuprabhatKarn97';
export const DEV_PROFILE_URL = 'https://dev.to/suprabhat02';
// Public site token for Cloudflare Web Analytics (cookie-free page views).
// It is embedded in every page by design, so it is not a secret.
export const CLOUDFLARE_ANALYTICS_TOKEN = '27bc314498e7483b9b68e3bc43df19c8';
/**
 * Search-engine ownership verification tokens (meta-tag method, so no DNS
 * change is needed). Empty values render nothing. Google and Bing are
 * already verified; add the others' codes from their webmaster consoles.
 * TODO(owner): paste the Yandex Webmaster code here.
 */
export const SEARCH_VERIFICATION = {
  'google-site-verification': '',
  'msvalidate.01': '',
  'yandex-verification': '',
} as const satisfies Record<string, string>;
export const HASHNODE_BLOG_URL = 'https://suprabhatkumar.hashnode.dev';
// Pages too thin to index yet; also excluded from the sitemap.
export const NOINDEX_PAGES = ['privacy', 'skills'] as const;
