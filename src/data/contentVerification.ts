export type VerificationStatus = 'blocked' | 'needs-confirmation';

export interface ContentVerificationTodo {
  id: string;
  status: VerificationStatus;
  question: string;
  affectedContent: readonly string[];
  value?: string;
}

/** Editorial facts that must be confirmed before they are published as proof. */
export const contentVerificationTodos: readonly ContentVerificationTodo[] = [
  // TODO(owner): Supply confirmed values and publication permission; keep these blocked until then.
  {
    id: 'testimonial-sources-consent-relationships',
    status: 'blocked',
    value: '',
    question:
      'Confirm the public source, publication consent and relationship for every testimonial.',
    affectedContent: ['recommendations', 'homepage testimonials'],
  },
  {
    id: 'case-study-figures-permission-screenshots',
    status: 'blocked',
    value: '',
    question:
      'Confirm case-study figures, permission to publish and approved screenshots.',
    affectedContent: ['case studies'],
  },
  {
    id: 'audit-prices',
    status: 'blocked',
    value: '',
    question:
      'Confirm audit prices and localized pricing notes before publishing them.',
    affectedContent: ['services'],
  },
  {
    id: 'booking-url',
    status: 'blocked',
    value: '',
    question: 'Confirm the booking URL before enabling booking links.',
    affectedContent: ['hero actions', 'homepage contact', 'case-study CTA'],
  },
  {
    id: 'package-repository-stats',
    status: 'blocked',
    value: '',
    question:
      'Supply verified npm download and GitHub star counts with their source and measurement date.',
    affectedContent: ['open-source project statistics'],
  },
  {
    id: 'profile-page-creation-date',
    status: 'blocked',
    value: '',
    question:
      'Confirm the actual ProfilePage creation date; do not infer it from a build.',
    affectedContent: ['about page schema'],
  },
  {
    id: 'article-sources',
    status: 'blocked',
    question:
      'Provide the draft/source files for the eleven approved article slugs; seven articles are published so far, each in English, Spanish and Arabic (21 article files).',
    affectedContent: ['blog index', 'article routes'],
  },
  {
    id: 'localized-editorial-review',
    status: 'needs-confirmation',
    question:
      'Complete native Spanish and Modern Standard Arabic editorial review before market-specific promotion or translated testimonial publication.',
    affectedContent: [
      'Spanish routes',
      'Arabic routes',
      'translated testimonials',
    ],
  },
] as const;
