import type { Locale } from '../i18n/config';
import { t } from '../i18n/messages';
import type { ToolGroupId } from './tools';

export interface SkillGroup {
  id: string;
  heading: string;
  items: readonly string[];
}

export const skillsLead =
  'Core services include SaaS frontend development, dashboard UI engineering, performance optimization, and design system delivery.';

const sharedGroups: readonly { id: ToolGroupId; items: readonly string[] }[] = [
  {
    id: 'languages',
    items: [
      'React + Next.js',
      'JavaScript + TypeScript',
      'HTML5',
      'Astro',
      'jQuery',
    ],
  },
  {
    id: 'data',
    items: [
      'Redux Toolkit + RTK Query',
      'Zustand',
      'React Hooks + Context API',
      'TanStack Query',
      'GraphQL',
      'Zod',
    ],
  },
  {
    id: 'styling',
    items: [
      'CSS3 + Sass',
      'Tailwind CSS',
      'shadcn/ui',
      'Chakra UI',
      'Headless UI',
      'Bootstrap 5 + React Bootstrap',
      'Ant Design',
      'Material UI',
    ],
  },
  {
    id: 'backend',
    items: [
      'FastAPI (Python)',
      'PostgreSQL',
      'MongoDB',
      'Node.js',
      'REST APIs',
    ],
  },
  {
    id: 'design',
    items: ['Figma', 'Storybook'],
  },
  {
    id: 'workflow',
    items: ['Git', 'GitHub Actions', 'Azure', 'Claude AI'],
  },
] as const;

const localizedLeads: Record<Locale, string> = {
  en: skillsLead,
  es: 'Los servicios principales incluyen desarrollo frontend SaaS, ingeniería de UI para paneles, optimización de rendimiento y entrega de sistemas de diseño.',
  ar: 'تشمل الخدمات الأساسية تطوير واجهات SaaS، وهندسة واجهات لوحات البيانات، وتحسين الأداء، وتسليم أنظمة التصميم.',
};

export const getSkills = (
  locale: Locale,
): { skillsLead: string; skillGroups: readonly SkillGroup[] } => ({
  skillsLead: localizedLeads[locale],
  skillGroups: sharedGroups.map((group) => ({
    ...group,
    heading: t(locale, `page.tools.group.${group.id}.title`),
  })),
});

export const skillGroups = getSkills('en').skillGroups;
