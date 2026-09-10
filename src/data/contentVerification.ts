export type VerificationStatus = 'blocked' | 'needs-confirmation';

export interface ContentVerificationTodo {
  id: string;
  status: VerificationStatus;
  question: string;
  affectedContent: readonly string[];
}

/** Editorial facts that must be confirmed before they are published as proof. */
export const contentVerificationTodos: readonly ContentVerificationTodo[] = [
  {
    id: 'article-sources',
    status: 'blocked',
    question:
      'Provide the draft/source files for the eleven approved article slugs; only three published article files exist in the repository.',
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
