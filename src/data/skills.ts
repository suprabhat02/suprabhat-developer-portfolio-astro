import type { Locale } from '../i18n/config';

export interface SkillGroup {
  id: string;
  heading: string;
  items: readonly string[];
}

export const skillsLead =
  'Core services include SaaS frontend development, dashboard UI engineering, performance optimization, and design system delivery.';

export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'front-end',
    heading: 'Front-End',
    items: [
      'React.js + Next.js',
      'JavaScript + TypeScript',
      'HTML + CSS + Sass',
      'Tailwind CSS',
    ],
  },
  {
    id: 'ui-libraries',
    heading: 'UI Libraries',
    items: ['Chakra UI', 'Headless UI', 'React Bootstrap', 'Ant Design'],
  },
  {
    id: 'state-and-data',
    heading: 'State & Data',
    items: [
      'Git workflows',
      'Redux Toolkit',
      'React Hooks + Context API',
      'React Query',
      'GraphQL',
    ],
  },
] as const;

const localizedSkills: Partial<
  Record<Locale, { skillsLead: string; skillGroups: readonly SkillGroup[] }>
> = {
  es: {
    skillsLead:
      'Los servicios principales incluyen desarrollo frontend SaaS, ingeniería de UI para paneles, optimización de rendimiento y entrega de sistemas de diseño.',
    skillGroups: [
      {
        id: 'front-end',
        heading: 'Frontend',
        items: [
          'React.js + Next.js',
          'JavaScript + TypeScript',
          'HTML + CSS + Sass',
          'Tailwind CSS',
        ],
      },
      {
        id: 'ui-libraries',
        heading: 'Bibliotecas de UI',
        items: ['Chakra UI', 'Headless UI', 'React Bootstrap', 'Ant Design'],
      },
      {
        id: 'state-and-data',
        heading: 'Estado y datos',
        items: [
          'Flujos de trabajo con Git',
          'Redux Toolkit',
          'React Hooks + Context API',
          'React Query',
          'GraphQL',
        ],
      },
    ],
  },
  ar: {
    skillsLead:
      'تشمل الخدمات الأساسية تطوير واجهات SaaS، وهندسة واجهات لوحات البيانات، وتحسين الأداء، وتسليم أنظمة التصميم.',
    skillGroups: [
      {
        id: 'front-end',
        heading: 'الواجهة الأمامية',
        items: [
          'React.js + Next.js',
          'JavaScript + TypeScript',
          'HTML + CSS + Sass',
          'Tailwind CSS',
        ],
      },
      {
        id: 'ui-libraries',
        heading: 'مكتبات UI',
        items: ['Chakra UI', 'Headless UI', 'React Bootstrap', 'Ant Design'],
      },
      {
        id: 'state-and-data',
        heading: 'الحالة والبيانات',
        items: [
          'سير عمل Git',
          'Redux Toolkit',
          'React Hooks + Context API',
          'React Query',
          'GraphQL',
        ],
      },
    ],
  },
};

export const getSkills = (locale: Locale) =>
  localizedSkills[locale] ?? { skillsLead, skillGroups };
