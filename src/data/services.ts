import type { Locale } from '../i18n/config';

export interface Service {
  id: string;
  name: string;
  /** Derived only from existing site copy — see the note on each entry. */
  description: string;
  source: string;
}

export const services: readonly Service[] = [
  {
    id: 'saas-frontend',
    name: 'SaaS frontend development',
    description:
      'Fast, accessible SaaS frontends built with React, Next.js, and TypeScript.',
    source: 'hero lead + ProfessionalService.serviceType',
  },
  {
    id: 'dashboard-ui',
    name: 'Dashboard UI engineering',
    description:
      'Data-heavy dashboards with accessible charts and resilient data states.',
    source: 'Skills lead + About paragraph 3 + internal work',
  },
  {
    id: 'react-nextjs',
    name: 'React and Next.js implementation',
    description: 'UI engineering and React/Next.js development.',
    source: 'FAQ answer 1',
  },
  {
    id: 'design-systems',
    name: 'Design systems',
    description:
      'Standardized components and tokens for UI consistency across teams and products.',
    source: 'ProfessionalService.serviceType + internal work',
  },
  {
    id: 'performance',
    name: 'Performance optimization',
    description:
      'Core Web Vitals work across assets, routing, and rendering strategies.',
    source: 'ProfessionalService.serviceType + internal work',
  },
  {
    id: 'accessibility',
    name: 'Accessibility-focused UI',
    description: 'Accessibility auditing and inclusive UI delivery.',
    source: 'ProfessionalService.serviceType + recommendation (Supriya Suman)',
  },
] as const;

const localizedServices: Partial<Record<Locale, readonly Service[]>> = {
  es: [
    {
      id: 'saas-frontend',
      name: 'Desarrollo frontend SaaS',
      description:
        'Frontends SaaS rápidos y accesibles creados con React, Next.js y TypeScript.',
      source: 'hero lead + ProfessionalService.serviceType',
    },
    {
      id: 'dashboard-ui',
      name: 'Ingeniería de UI para paneles',
      description:
        'Paneles con muchos datos, gráficos accesibles y estados resilientes.',
      source: 'Skills lead + About paragraph 3 + internal work',
    },
    {
      id: 'react-nextjs',
      name: 'Implementación con React y Next.js',
      description: 'Ingeniería de UI y desarrollo con React/Next.js.',
      source: 'FAQ answer 1',
    },
    {
      id: 'design-systems',
      name: 'Sistemas de diseño',
      description:
        'Componentes y tokens estandarizados para mantener consistencia entre equipos y productos.',
      source: 'ProfessionalService.serviceType + internal work',
    },
    {
      id: 'performance',
      name: 'Optimización de rendimiento',
      description:
        'Trabajo de Core Web Vitals sobre activos, rutas y estrategias de renderizado.',
      source: 'ProfessionalService.serviceType + internal work',
    },
    {
      id: 'accessibility',
      name: 'UI centrada en accesibilidad',
      description: 'Auditoría de accesibilidad y entrega de UI inclusiva.',
      source:
        'ProfessionalService.serviceType + recommendation (Supriya Suman)',
    },
  ],
  ar: [
    {
      id: 'saas-frontend',
      name: 'تطوير واجهات SaaS',
      description:
        'واجهات SaaS سريعة ومتاحة مبنية باستخدام React وNext.js وTypeScript.',
      source: 'hero lead + ProfessionalService.serviceType',
    },
    {
      id: 'dashboard-ui',
      name: 'هندسة واجهات لوحات البيانات',
      description: 'لوحات بيانات كثيفة برسوم بيانية متاحة وحالات بيانات مرنة.',
      source: 'Skills lead + About paragraph 3 + internal work',
    },
    {
      id: 'react-nextjs',
      name: 'تنفيذ React وNext.js',
      description: 'هندسة واجهات وتطوير باستخدام React/Next.js.',
      source: 'FAQ answer 1',
    },
    {
      id: 'design-systems',
      name: 'أنظمة التصميم',
      description:
        'مكونات ورموز تصميم موحدة للحفاظ على اتساق الواجهة عبر الفرق والمنتجات.',
      source: 'ProfessionalService.serviceType + internal work',
    },
    {
      id: 'performance',
      name: 'تحسين الأداء',
      description:
        'عمل على Core Web Vitals عبر الأصول والتوجيه واستراتيجيات العرض.',
      source: 'ProfessionalService.serviceType + internal work',
    },
    {
      id: 'accessibility',
      name: 'واجهات تركز على إمكانية الوصول',
      description: 'تدقيق إمكانية الوصول وتسليم واجهات شاملة.',
      source:
        'ProfessionalService.serviceType + recommendation (Supriya Suman)',
    },
  ],
};

export const getServices = (locale: Locale) =>
  localizedServices[locale] ?? services;
