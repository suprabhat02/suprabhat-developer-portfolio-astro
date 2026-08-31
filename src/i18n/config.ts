export const locales = ['en', 'es', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeMeta: Record<
  Locale,
  { label: string; dir: 'ltr' | 'rtl'; htmlLang: string }
> = {
  // Endonyms, not flags — a flag is a country, not a language.
  en: { label: 'English', dir: 'ltr', htmlLang: 'en' },
  es: { label: 'Español', dir: 'ltr', htmlLang: 'es' },
  ar: { label: 'العربية', dir: 'rtl', htmlLang: 'ar' },
};

/**
 * A locale is indexable only once its editorial copy has a reviewed
 * translation. All supported locales have reviewed editorial copy and are
 * included in the sitemap and hreflang set.
 */
export const indexableLocales: readonly Locale[] = ['en', 'es', 'ar'];

export const localePrefix = (l: Locale) => (l === defaultLocale ? '' : `/${l}`);
