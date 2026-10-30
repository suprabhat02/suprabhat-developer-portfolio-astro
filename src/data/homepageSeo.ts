import { SITE_URL } from '../config/site';
import { getServices } from './services';
import { getHomepageConversionContent } from './homepageConversion';
import {
  getReactInpChunkerSchema,
  getReactSmartCopySchema,
} from './openSource';
import { localeMeta, localePrefix, type Locale } from '../i18n/config';
import { t } from '../i18n/messages';

export const getHomepageTitle = (locale: Locale) =>
  locale === 'es'
    ? 'Suprabhat Kumar — Ingeniero Frontend Sénior'
    : locale === 'ar'
      ? 'سوبرابهات كومار — مهندس واجهات أمامية أول'
      : 'Suprabhat Kumar | Senior React Engineer in India';

export const getHomepageDescription = (locale: Locale) =>
  locale === 'es'
    ? 'Ingeniero frontend sénior con más de seis años creando productos SaaS rápidos y accesibles con React y TypeScript.'
    : locale === 'ar'
      ? 'مهندس واجهات أمامية أول بخبرة تزيد على ست سنوات في بناء منتجات SaaS سريعة ومتاحة ولوحات بيانات وأنظمة تصميم باستخدام React وTypeScript.'
      : 'Senior React frontend engineer in India with 6+ years building SaaS dashboards, design systems, accessible interfaces, and fast web products.';

export const getHomepageSchema = (locale: Locale) => {
  const services = getServices(locale);
  const pageUrl = `${SITE_URL}${localePrefix(locale)}/`;
  const language = localeMeta[locale].htmlLang;
  const { problems } = getHomepageConversionContent(locale);

  return [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: t(locale, 'schema.serviceName'),
      description: t(locale, 'schema.serviceDescription'),
      url: pageUrl,
      inLanguage: language,
      areaServed: t(locale, 'schema.worldwide'),
      provider: { '@id': `${SITE_URL}/#person` },
      serviceType: services.map((service) => service.name),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: t(locale, 'page.services.title'),
        itemListElement: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: [
              service.description,
              service.fit ? `${t(locale, 'service.fit')}: ${service.fit}.` : '',
              service.deliverables
                ? `${t(locale, 'service.deliverables')}: ${service.deliverables}.`
                : '',
              service.duration
                ? `${t(locale, 'service.duration')}: ${service.duration}.`
                : '',
            ]
              .filter(Boolean)
              .join(' '),
            inLanguage: language,
          },
        })),
      },
    },
    getReactSmartCopySchema(SITE_URL, language, locale),
    getReactInpChunkerSchema(SITE_URL, language, locale),
    {
      '@type': 'ItemList',
      '@id': `${pageUrl}#problems`,
      name: problems.title,
      description: problems.lead,
      inLanguage: language,
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: problems.items.length,
      itemListElement: problems.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        description: `${item.body} ${problems.outcomeLabel}: ${item.outcome}`,
      })),
    },
  ];
};

export const getHomepageSeo = (locale: Locale) => ({
  title: getHomepageTitle(locale),
  description: getHomepageDescription(locale),
  schema: getHomepageSchema(locale),
});
