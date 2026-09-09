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
    id: 'resume-correction',
    status: 'blocked',
    question:
      'Provide a corrected resume: the PDF places BMW work under Swaragh, while the owner states it was through Cognizant and BMW must not be published yet.',
    affectedContent: ['resume download', 'resume indexing'],
  },
  {
    id: 'lighthouse-provenance',
    status: 'needs-confirmation',
    question:
      'Provide the Lighthouse HTML or JSON report, screenshot, Lighthouse version, and Chrome version for the published desktop lab metrics.',
    affectedContent: ['portfolio SEO and i18n case study'],
  },
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
