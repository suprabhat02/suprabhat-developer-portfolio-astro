import type { Locale } from '../i18n/config';
import { t } from '../i18n/messages';

/** Career highlights shared by the homepage and the Experience page. */
export const getCareerStats = (locale: Locale) =>
  [
    { value: '6+', label: t(locale, 'home.statYears') },
    { value: '5', label: t(locale, 'home.statCompanies') },
    { value: '2', label: t(locale, 'home.statCapabilities') },
    { value: t(locale, 'globe.home'), label: t(locale, 'home.statRemote') },
  ] as const;
