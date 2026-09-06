import type { Locale } from '../i18n/config';

export interface WorkItem {
  id: string;
  title: string;
  summary: string;
  tags: readonly string[];
}

/**
 * Internal work. No client names, screenshots, metrics or outcomes beyond
 * what can be shared safely. Detail pages must stay confidentiality-safe.
 */
export const internalWorkNotice =
  'Internal work — described without client names, screenshots, or confidential detail.';

export const work: readonly WorkItem[] = [
  {
    id: 'analytics-command-center',
    title: 'Analytics command center',
    summary:
      'Designed a role-based dashboard with accessible charts and resilient data states for fast decision-making.',
    tags: ['Core Web Vitals', 'Performance', 'Accessibility', 'Data UX'],
  },
  {
    id: 'design-system-uplift',
    title: 'Design system uplift',
    summary:
      'Standardized components and tokens to improve UI consistency across multiple teams and products.',
    tags: ['Design systems', 'Consistency', 'Scalability'],
  },
  {
    id: 'performance-modernization',
    title: 'Performance modernization',
    summary:
      'Reduced load times by optimizing assets, routing, and rendering strategies across a complex UI.',
    tags: ['Core Web Vitals', 'Optimization', 'Frontend'],
  },
  {
    id: 'portfolio-seo-i18n-system',
    title: 'Portfolio SEO and i18n system',
    summary:
      'Architected a static Astro portfolio system with localized content, hreflang, structured data, and crawlable case-study routes.',
    tags: ['Astro', 'Technical SEO', 'i18n', 'Structured data'],
  },
  {
    id: 'accessible-contact-workflow',
    title: 'Accessible contact workflow',
    summary:
      'Designed a lightweight contact path with accessible form semantics, privacy clarity, fallback email routes, and localized validation.',
    tags: ['Accessible forms', 'Lead UX', 'Progressive enhancement'],
  },
  {
    id: 'frontend-quality-system',
    title: 'Frontend quality system',
    summary:
      'Built a regression safety net for localized routes, accessibility, structured data, mobile overflow, and static build confidence.',
    tags: ['Playwright', 'Accessibility', 'SEO QA', 'Astro check'],
  },
] as const;

const localizedInternalWorkNotice: Partial<Record<Locale, string>> = {
  es: 'Trabajo interno: descrito sin nombres de clientes, capturas ni detalles confidenciales.',
  ar: 'عمل داخلي: موصوف من دون أسماء عملاء أو لقطات شاشة أو تفاصيل سرية.',
};

const localizedWork: Partial<Record<Locale, readonly WorkItem[]>> = {
  es: [
    {
      id: 'analytics-command-center',
      title: 'Centro de control analítico',
      summary:
        'Diseñé un panel basado en roles con gráficos accesibles y estados de datos resilientes para facilitar decisiones rápidas.',
      tags: ['Core Web Vitals', 'Rendimiento', 'Accesibilidad', 'UX de datos'],
    },
    {
      id: 'design-system-uplift',
      title: 'Mejora del sistema de diseño',
      summary:
        'Estandaricé componentes y tokens para mejorar la consistencia de UI entre varios equipos y productos.',
      tags: ['Sistemas de diseño', 'Consistencia', 'Escalabilidad'],
    },
    {
      id: 'performance-modernization',
      title: 'Modernización de rendimiento',
      summary:
        'Reduje los tiempos de carga optimizando activos, rutas y estrategias de renderizado en una UI compleja.',
      tags: ['Core Web Vitals', 'Optimización', 'Frontend'],
    },
    {
      id: 'portfolio-seo-i18n-system',
      title: 'Sistema SEO e i18n para portfolio',
      summary:
        'Arquitecté un sistema Astro estático con contenido localizado, hreflang, datos estructurados y rutas de casos rastreables.',
      tags: ['Astro', 'SEO técnico', 'i18n', 'Datos estructurados'],
    },
    {
      id: 'accessible-contact-workflow',
      title: 'Flujo de contacto accesible',
      summary:
        'Diseñé una ruta de contacto ligera con semántica accesible, privacidad clara, fallback por email y validación localizada.',
      tags: ['Formularios accesibles', 'UX de leads', 'Mejora progresiva'],
    },
    {
      id: 'frontend-quality-system',
      title: 'Sistema de calidad frontend',
      summary:
        'Construí una red de regresión para rutas localizadas, accesibilidad, datos estructurados, overflow móvil y confianza de build.',
      tags: ['Playwright', 'Accesibilidad', 'QA SEO', 'Astro check'],
    },
  ],
  ar: [
    {
      id: 'analytics-command-center',
      title: 'مركز تحكم للتحليلات',
      summary:
        'صممت لوحة قائمة على الأدوار برسوم بيانية متاحة وحالات بيانات مرنة لدعم اتخاذ قرارات أسرع.',
      tags: ['Core Web Vitals', 'الأداء', 'إمكانية الوصول', 'تجربة بيانات'],
    },
    {
      id: 'design-system-uplift',
      title: 'تحسين نظام التصميم',
      summary:
        'وحّدت المكونات ورموز التصميم لتحسين اتساق الواجهة عبر فرق ومنتجات متعددة.',
      tags: ['أنظمة التصميم', 'الاتساق', 'قابلية التوسع'],
    },
    {
      id: 'performance-modernization',
      title: 'تحديث الأداء',
      summary:
        'قللت أوقات التحميل عبر تحسين الأصول والتوجيه واستراتيجيات العرض في واجهة معقدة.',
      tags: ['Core Web Vitals', 'التحسين', 'الواجهة الأمامية'],
    },
    {
      id: 'portfolio-seo-i18n-system',
      title: 'نظام SEO وتدويل المحفظة',
      summary:
        'صممت نظام Astro ثابتًا بمحتوى محلي وhreflang وبيانات منظمة ومسارات دراسات حالة قابلة للفهرسة.',
      tags: ['Astro', 'SEO تقني', 'i18n', 'بيانات منظمة'],
    },
    {
      id: 'accessible-contact-workflow',
      title: 'مسار تواصل متاح',
      summary:
        'صممت مسار تواصل خفيفًا مع نموذج دلالي متاح، خصوصية واضحة، بديل بريد، وتحقق محلي.',
      tags: ['نماذج متاحة', 'UX للعملاء', 'تحسين تدريجي'],
    },
    {
      id: 'frontend-quality-system',
      title: 'نظام جودة Frontend',
      summary:
        'بنيت شبكة أمان للانحدارات في المسارات المحلية والإتاحة والبيانات المنظمة وoverflow الجوال وثقة build.',
      tags: ['Playwright', 'الإتاحة', 'QA SEO', 'Astro check'],
    },
  ],
};

export const getInternalWorkNotice = (locale: Locale) =>
  localizedInternalWorkNotice[locale] ?? internalWorkNotice;

export const getWork = (locale: Locale) => localizedWork[locale] ?? work;
