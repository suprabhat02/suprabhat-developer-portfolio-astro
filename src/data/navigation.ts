export type NavKey =
  | 'home'
  | 'about'
  | 'skills'
  | 'experience'
  | 'work'
  | 'blog'
  | 'contact'
  | 'tools'
  | 'recommendations'
  | 'faq'
  | 'services'
  | 'accessibility'
  | 'privacy';

export interface NavItem {
  key: NavKey;
  href: string;
  /** Homepage anchor kept alive so old hash bookmarks still resolve. */
  legacyHash?: string;
}

export const primaryNav: readonly NavItem[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about/', legacyHash: '#about' },
  { key: 'skills', href: '/skills/', legacyHash: '#skills' },
  { key: 'experience', href: '/experience/', legacyHash: '#experience' },
  { key: 'work', href: '/work/', legacyHash: '#work' },
  { key: 'blog', href: '/blog/' },
  { key: 'contact', href: '/contact/', legacyHash: '#contact' },
] as const;

export const moreNav: readonly NavItem[] = [
  { key: 'tools', href: '/tools/', legacyHash: '#tools' },
  { key: 'recommendations', href: '/recommendations/' },
  { key: 'services', href: '/services/' },
  { key: 'faq', href: '/faq/', legacyHash: '#faq' },
] as const;

export const footerLegalNav: readonly NavItem[] = [
  { key: 'accessibility', href: '/accessibility/' },
  { key: 'privacy', href: '/privacy/' },
] as const;
