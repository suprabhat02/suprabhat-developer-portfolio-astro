export interface WorkItem {
  id: string;
  title: string;
  summary: string;
  tags: readonly string[];
}

/**
 * Internal work. No client names, screenshots, metrics or outcomes beyond
 * what the source page already stated. Detail pages are blocked on
 * docs/TODO.md #6.
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
