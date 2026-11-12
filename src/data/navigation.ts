import { localePrefix, type Locale } from '../i18n/config';

export type NavDestination =
  | { href: string; external?: false; language?: never }
  | { href: `https://${string}`; external: true; language: Locale };

export const navHref = (item: NavDestination, locale: Locale) =>
  item.external ? item.href : `${localePrefix(locale)}${item.href}` || '/';

export const navHrefLang = (item: NavDestination, locale: Locale) =>
  item.external && item.language !== locale ? item.language : undefined;

export type NavKey =
  | 'home'
  | 'about'
  | 'skills'
  | 'experience'
  | 'work'
  | 'blog'
  | 'lab'
  | 'contact'
  | 'tools'
  | 'recommendations'
  | 'faq'
  | 'services'
  | 'accessibility'
  | 'privacy';

export type NavItem = NavDestination & {
  key: NavKey;
  /** Homepage anchor kept alive so old hash bookmarks still resolve. */
  legacyHash?: string;
};

export const labNav: NavItem = {
  key: 'lab',
  href: 'https://lab.suprabhat-dev.com/',
  external: true,
  language: 'en',
};

export const primaryNav: readonly NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about/', legacyHash: '#about' },
  { key: 'services', href: '/services/', legacyHash: '#skills' },
  { key: 'experience', href: '/experience/', legacyHash: '#experience' },
  { key: 'work', href: '/work/', legacyHash: '#work' },
  { key: 'blog', href: '/blog/' },
  { key: 'contact', href: '/contact/', legacyHash: '#contact' },
] as const;

export const moreNav: readonly NavItem[] = [
  labNav,
  { key: 'tools', href: '/tools/', legacyHash: '#tools' },
  { key: 'services', href: '/services/' },
  { key: 'faq', href: '/faq/', legacyHash: '#faq' },
] as const;

export const footerLegalNav: readonly NavItem[] = [
  { key: 'accessibility', href: '/accessibility/' },
  { key: 'privacy', href: '/privacy/' },
] as const;
