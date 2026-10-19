import type { Locale } from '../i18n/config';
import { t } from '../i18n/messages';

/** Static section pages, shared by `[page].astro` and `[locale]/[...page].astro`. */
export const sectionPages = [
  'about',
  'skills',
  'experience',
  'tools',
  'work',
  'recommendations',
  'services',
  'faq',
  'contact',
  'accessibility',
  'privacy',
  'blog',
] as const;
export type SectionPage = (typeof sectionPages)[number];

type LocalizedLocale = Exclude<Locale, 'en'>;

const englishMeta: Record<SectionPage, { title: string; description: string }> =
  {
    about: {
      title: 'About Suprabhat Kumar | Senior React Frontend Engineer',
      description:
        'Follow Suprabhat Kumar’s six-year frontend career across SaaS portals, enterprise dashboards, React architecture, accessibility, and global teams.',
    },
    skills: {
      title: 'Frontend Engineering Skills | Suprabhat Kumar',
      description:
        'React, Next.js, TypeScript, HTML5, Bootstrap 5, TanStack Query, GraphQL, MongoDB, design systems and data UI expertise.',
    },
    experience: {
      title: 'Frontend Engineering Experience | Suprabhat Kumar',
      description:
        'Six years of frontend engineering experience across SaaS products and enterprise interfaces.',
    },
    tools: {
      title: 'Frontend Tools and Stack | Suprabhat Kumar',
      description:
        'The tools used to design, build and maintain production frontend systems, including HTML5, TanStack Query, GraphQL, Bootstrap 5 and MongoDB.',
    },
    work: {
      title: 'React Frontend Engineering Case Studies | Suprabhat Kumar',
      description:
        'Read frontend case studies on SaaS dashboards, design systems, React performance, accessibility, Astro SEO, localization, and browser testing.',
    },
    recommendations: {
      title: 'Recommendations | Suprabhat Kumar',
      description:
        'Recommendations for Suprabhat Kumar from colleagues in AI engineering, quality assurance, platform, UX research, SEO and regulatory affairs.',
    },
    services: {
      title: 'React Frontend Engineering Services | Suprabhat Kumar',
      description:
        'Hire Suprabhat Kumar for React performance audits, architecture reviews, SaaS dashboards, design systems, accessibility, and website delivery.',
    },
    faq: {
      title: 'Frequently Asked Questions | Suprabhat Kumar',
      description:
        'Answers about services, pricing, remote collaboration, timelines and getting started.',
    },
    contact: {
      title: 'Hire Suprabhat Kumar | Senior React Frontend Engineer',
      description:
        'Discuss a React dashboard, architecture review, design system, performance audit, accessibility audit, or website project with Suprabhat Kumar.',
    },
    accessibility: {
      title: 'Accessibility Statement | Suprabhat Kumar',
      description:
        'Accessibility statement for suprabhat-dev.com: the WCAG 2.2 AA target, what is in place, how it is tested, known limitations and how to report a barrier.',
    },
    privacy: {
      title: 'Contact Form Privacy | Suprabhat Kumar',
      description:
        'How the suprabhat-dev.com contact form handles your data: no analytics, drafts saved only in your browser, and submissions emailed through Web3Forms.',
    },
    blog: {
      title: 'React and Frontend Engineering Articles | Suprabhat Kumar',
      description:
        'Practical React and frontend engineering guides on architecture, accessibility, performance, code review, design systems, and maintainable UI.',
    },
  };

// Section pages follow the EN pattern: page, role keyword, then the name.
const titleRole: Record<LocalizedLocale, string> = {
  es: 'Ingeniero Frontend Sénior',
  ar: 'مهندس واجهات أمامية أول',
};
const roleTitledPages: readonly SectionPage[] = [
  'about',
  'blog',
  'contact',
  'experience',
  'services',
  'tools',
  'work',
];
// Long labels use the shorter role so the title stays within 60 characters.
const shortRoleTitles: Record<
  LocalizedLocale,
  Partial<Record<SectionPage, string>>
> = {
  es: {
    recommendations: 'Recomendaciones | Ingeniero Frontend — Suprabhat Kumar',
    faq: 'Preguntas frecuentes | Ingeniero Frontend — Suprabhat Kumar',
  },
  ar: {
    recommendations: 'التوصيات | مهندس واجهات أمامية أول — Suprabhat Kumar',
    faq: 'الأسئلة الشائعة | مهندس واجهات أمامية أول — Suprabhat Kumar',
  },
};

const localizedDescriptions: Record<
  LocalizedLocale,
  Record<SectionPage, string>
> = {
  es: {
    about:
      'Perfil de Suprabhat Kumar, ingeniero frontend sénior especializado en interfaces SaaS rápidas, accesibles y mantenibles.',
    skills:
      'Competencias de ingeniería frontend de Suprabhat Kumar: React, Next.js, TypeScript, TanStack Query, GraphQL, MongoDB, sistemas de diseño y accesibilidad.',
    experience:
      'Seis años de ingeniería frontend en Topsoe, Cognizant, TrueBlue, MobileCoderz y Swaragh Technologies, con productos SaaS e interfaces empresariales.',
    tools:
      'Herramientas y tecnologías que utiliza Suprabhat Kumar para crear productos frontend rápidos y escalables, incluyendo TanStack Query, GraphQL y MongoDB.',
    work: 'Trabajo interno de producto seleccionado por Suprabhat Kumar, centrado en rendimiento, accesibilidad y sistemas de interfaz.',
    recommendations:
      'Recomendaciones para Suprabhat Kumar de colegas de ingeniería de IA, control de calidad, plataforma, investigación UX, SEO y asuntos regulatorios.',
    services:
      'Servicios de ingeniería frontend: desarrollo SaaS, paneles de datos, React, sistemas de diseño, rendimiento y accesibilidad.',
    faq: 'Respuestas a preguntas frecuentes sobre servicios, precios, colaboración remota y plazos de proyectos frontend.',
    contact:
      'Habla con Suprabhat Kumar sobre un panel React, una revisión de arquitectura, un sistema de diseño o una auditoría de rendimiento o accesibilidad.',
    accessibility:
      'Declaración de accesibilidad de suprabhat-dev.com: objetivo WCAG 2.2 AA, qué está implementado, cómo se prueba, limitaciones y cómo avisar de una barrera.',
    privacy:
      'Cómo se gestiona la información enviada mediante el formulario de contacto de Suprabhat Kumar.',
    blog: 'Artículos de ingeniería frontend: rendimiento, accesibilidad, arquitectura y entrega profesional de interfaces.',
  },
  ar: {
    about:
      'تعرّف على مسيرة سوبرابهات كومار الممتدة ست سنوات في الواجهات الأمامية: بوابات SaaS ولوحات تحكم مؤسسية ومعمارية React وإمكانية الوصول والعمل مع فرق عالمية.',
    skills:
      'مهارات سوبرابهات كومار في هندسة الواجهات الأمامية: React وNext.js وTypeScript وTanStack Query وGraphQL وMongoDB وأنظمة التصميم وإمكانية الوصول.',
    experience:
      'ست سنوات من خبرة سوبرابهات كومار في هندسة الواجهات الأمامية لدى Topsoe وCognizant وTrueBlue وMobileCoderz وSwaragh Technologies في منتجات SaaS.',
    tools:
      'الأدوات والتقنيات التي يستخدمها سوبرابهات كومار لإنشاء منتجات واجهات أمامية سريعة وقابلة للتوسع، بما في ذلك TanStack Query وGraphQL وMongoDB.',
    work: 'دراسات حالة في الواجهات الأمامية حول لوحات بيانات SaaS وأنظمة التصميم وأداء React وإمكانية الوصول وSEO في Astro والتوطين واختبارات المتصفح.',
    recommendations:
      'توصيات لسوبرابهات كومار من زملاء في هندسة الذكاء الاصطناعي وضمان الجودة والمنصات وأبحاث تجربة المستخدم وSEO والشؤون التنظيمية.',
    services:
      'خدمات سوبرابهات كومار: تدقيق أداء React، ومراجعات المعمارية، ولوحات بيانات SaaS، وأنظمة التصميم، وإمكانية الوصول، وتسليم مواقع الويب.',
    faq: 'إجابات عن الأسئلة الشائعة حول الخدمات والأسعار والتعاون عن بُعد والجداول الزمنية وكيفية بدء مشروع واجهات أمامية مع سوبرابهات كومار.',
    contact:
      'ناقش مع سوبرابهات كومار لوحة بيانات React أو مراجعة معمارية أو نظام تصميم أو تدقيقًا للأداء أو لإمكانية الوصول أو مشروع موقع ويب.',
    accessibility:
      'بيان إمكانية الوصول لموقع suprabhat-dev.com: الهدف WCAG 2.2 AA، وما هو مطبَّق، وكيف يُختبَر، والقيود المعروفة، وكيفية الإبلاغ عن أي عائق.',
    privacy:
      'كيفية التعامل مع المعلومات المرسلة من خلال نموذج التواصل الخاص بسوبرابهات كومار.',
    blog: 'أدلة عملية في React وهندسة الواجهات الأمامية حول المعمارية وإمكانية الوصول والأداء ومراجعة الشيفرة وأنظمة التصميم والواجهات القابلة للصيانة.',
  },
};

export function getSectionPageMeta(
  locale: Locale,
  page: SectionPage,
): { title: string; description: string } {
  if (locale === 'en') return englishMeta[page];
  const pageLabel = t(locale, `nav.${page}`);
  const title =
    shortRoleTitles[locale][page] ??
    (roleTitledPages.includes(page)
      ? `${pageLabel} | ${titleRole[locale]} — Suprabhat Kumar`
      : `${pageLabel} — Suprabhat Kumar`);
  return { title, description: localizedDescriptions[locale][page] };
}
