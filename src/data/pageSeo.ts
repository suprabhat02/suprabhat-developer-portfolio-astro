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
export const getSectionPageImage = (page: SectionPage) =>
  `/images/pages/${page}-og-1200x630.jpg`;

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
        'Frontend skills in React, TypeScript, Astro, shadcn/ui and Zod, spanning accessible UI systems, data validation and delivery with GitHub Actions.',
    },
    experience: {
      title: 'Frontend Engineering Experience | Suprabhat Kumar',
      description:
        'Six years of frontend engineering at Topsoe, Cognizant, TrueBlue, MobileCoderz and Swaragh Technologies, building SaaS products and enterprise interfaces.',
    },
    tools: {
      title: 'Frontend Tools and Stack | Suprabhat Kumar',
      description:
        'Explore Suprabhat Kumar’s frontend stack: Astro, shadcn/ui, Zod and GitHub Actions, grouped by frameworks, UI systems, data, design and delivery.',
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
        'Answers on Suprabhat Kumar’s frontend services, project pricing, remote and international work, typical timelines, and how to start a collaboration.',
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
        'How this site uses Cloudflare Web Analytics and handles browser-local form drafts and Web3Forms submissions.',
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
      'Competencias frontend de Suprabhat Kumar: React, TypeScript, Astro, shadcn/ui y Zod para interfaces accesibles y entrega con GitHub Actions.',
    experience:
      'Seis años de ingeniería frontend en Topsoe, Cognizant, TrueBlue, MobileCoderz y Swaragh Technologies, con productos SaaS e interfaces empresariales.',
    tools:
      'Explora las herramientas frontend de Suprabhat Kumar: Astro, shadcn/ui, Zod y GitHub Actions, organizadas por interfaces, datos, diseño y entrega.',
    work: 'Casos de estudio de Suprabhat Kumar sobre paneles SaaS, sistemas de diseño, rendimiento en React y accesibilidad.',
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
      'Cómo este sitio utiliza Cloudflare Web Analytics y gestiona borradores locales del formulario y envíos mediante Web3Forms.',
    blog: 'Artículos de ingeniería frontend: rendimiento, accesibilidad, arquitectura y entrega profesional de interfaces.',
  },
  ar: {
    about:
      'تعرّف على مسيرة سوبرابهات كومار الممتدة ست سنوات في الواجهات الأمامية: بوابات SaaS ولوحات تحكم مؤسسية ومعمارية React وإمكانية الوصول والعمل مع فرق عالمية.',
    skills:
      'مهارات سوبرابهات كومار في هندسة الواجهات الأمامية: React وTypeScript وAstro وshadcn/ui وZod لبناء واجهات متاحة والتسليم باستخدام GitHub Actions.',
    experience:
      'ست سنوات من خبرة سوبرابهات كومار في هندسة الواجهات الأمامية لدى Topsoe وCognizant وTrueBlue وMobileCoderz وSwaragh Technologies في منتجات SaaS.',
    tools:
      'استكشف أدوات سوبرابهات كومار: Astro وshadcn/ui وZod وGitHub Actions، مصنفة حسب أطر العمل وأنظمة الواجهات والبيانات والتصميم والتسليم.',
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
      'كيفية استخدام هذا الموقع لـ Cloudflare Web Analytics والتعامل مع مسودات النموذج المحفوظة محليًا والرسائل المرسلة عبر Web3Forms.',
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
