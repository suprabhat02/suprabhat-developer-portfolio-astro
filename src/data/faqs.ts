import { t } from '../i18n/messages';

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

/**
 * Single source for the visible FAQ and the FAQPage JSON-LD, so the two
 * cannot drift. Emit the schema only on pages that render this list.
 */
export const faqs: readonly Faq[] = [
  {
    id: 'identity',
    question: t('en', 'faq.identity.q'),
    answer: t('en', 'faq.identity.a'),
  },
  {
    id: 'services',
    question: 'What services do you offer?',
    answer:
      'I offer frontend performance audits, React and TypeScript architecture reviews, SaaS dashboard development, design system engineering, WCAG 2.2 AA accessibility audits, and complete website design and development.',
  },
  {
    id: 'remote',
    question: 'Do you take on international or remote work?',
    answer:
      'Yes. I am based in Noida, India, on IST (UTC+5:30), and work remotely with teams in the Americas, United Kingdom, and Western Europe, with 2–4 hours of agreed real-time overlap.',
  },
  {
    id: 'timeline',
    question: 'What does a typical timeline look like?',
    answer:
      'Audits usually take 5–7 business days, architecture reviews 1–2 weeks, dashboards 3–8 weeks, design systems 4–10 weeks, and websites 1–8 weeks. Final timing depends on scope, access, and review cycles.',
  },
  {
    id: 'start',
    question: 'How do we start a collaboration?',
    answer:
      'Send the problem, product context, and timeline through the contact form. I will review it and reply with questions or a next step.',
  },
] as const;
