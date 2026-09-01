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
  ],
};

export const getInternalWorkNotice = (locale: Locale) =>
  localizedInternalWorkNotice[locale] ?? internalWorkNotice;

export const getWork = (locale: Locale) => localizedWork[locale] ?? work;
