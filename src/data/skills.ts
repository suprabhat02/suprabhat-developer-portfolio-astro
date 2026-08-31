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
