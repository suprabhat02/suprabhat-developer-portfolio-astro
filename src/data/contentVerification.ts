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
    id: 'recommendation-provenance',
    status: 'blocked',
    question:
      'Confirm each recommendation verbatim, its attribution, consent to publish, and an optional public source URL.',
    affectedContent: ['recommendations', 'homepage trust section'],
  },
  {
    id: 'case-study-outcomes',
    status: 'needs-confirmation',
    question:
      'Confirm which anonymized case-study outcomes and role descriptions can be published.',
    affectedContent: ['work index', 'case-study pages'],
  },
  {
    id: 'availability',
    status: 'needs-confirmation',
    question:
      'Confirm current freelance and part-time availability, timezone overlap, and typical weekly capacity.',
    affectedContent: ['homepage hero', 'hire page', 'contact page'],
  },
  {
    id: 'resume-download',
    status: 'blocked',
    question:
      'Provide the public resume file and confirm which employment details may be indexed.',
    affectedContent: ['homepage CTA', 'resume page'],
  },
  {
    id: 'contact-expectations',
    status: 'needs-confirmation',
    question:
      'Confirm a realistic response-time expectation and preferred project budget or weekly-hours ranges.',
    affectedContent: ['contact form', 'hire page'],
  },
] as const;
