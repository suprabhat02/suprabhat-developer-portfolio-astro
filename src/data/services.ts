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
