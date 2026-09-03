import { SITE_NAME, SITE_URL } from '../config/site';
import { faqs } from './faqs';
import { getServices } from './services';
import { localeMeta, localePrefix, type Locale } from '../i18n/config';
import { t } from '../i18n/messages';

export const getHomepageTitle = (locale: Locale) =>
  locale === 'es'
    ? 'Suprabhat Kumar — Ingeniero Frontend Sénior'
    : locale === 'ar'
      ? 'سوبرابهات كومار — مهندس واجهات أمامية أول'
      : 'Suprabhat Kumar — Senior Frontend Engineer';

export const getHomepageDescription = (locale: Locale) =>
  locale === 'es'
    ? 'Ingeniero frontend sénior con más de seis años creando productos SaaS rápidos y accesibles con React y TypeScript.'
    : locale === 'ar'
      ? 'مهندس واجهات أمامية أول بخبرة تزيد على ست سنوات في بناء منتجات SaaS سريعة ومتاحة باستخدام React وTypeScript.'
      : 'Senior frontend engineer with 6+ years building fast, accessible React & TypeScript SaaS products. Dashboards, design systems, and FastAPI backends.';

export const getHomepageSchema = (locale: Locale) => {
  const services = getServices(locale);
  const pageUrl = `${SITE_URL}${localePrefix(locale)}/`;
  const language = localeMeta[locale].htmlLang;

  return [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: t(
        locale,
        'schema.serviceName',
        `${SITE_NAME} - Frontend Engineering Services`,
      ),
      description: t(
        locale,
        'schema.serviceDescription',
        'SaaS frontend development, dashboard UI engineering, performance optimization, design systems, React/Next.js implementation, FastAPI backend integration, accessibility-focused UI.',
      ),
      url: pageUrl,
      inLanguage: language,
      areaServed: t(locale, 'schema.worldwide', 'Worldwide'),
      provider: { '@id': `${SITE_URL}/#person` },
      serviceType: services.map((service) => service.name),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: t(locale, 'page.services.title', 'Frontend engineering services'),
        itemListElement: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.name,
            description: service.description,
            inLanguage: language,
          },
        })),
      },
    },
    {
      '@type': 'FAQPage',
      inLanguage: language,
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: t(locale, `faq.${faq.id}.q`, faq.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(locale, `faq.${faq.id}.a`, faq.answer),
        },
      })),
    },
  ];
};

export const getHomepageSeo = (locale: Locale) => ({
  title: getHomepageTitle(locale),
  description: getHomepageDescription(locale),
  schema: getHomepageSchema(locale),
});
