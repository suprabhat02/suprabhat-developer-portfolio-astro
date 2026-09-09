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
    id: 'services',
    question: 'What services do you offer?',
    answer:
      'I offer frontend performance audits, React and TypeScript architecture reviews, SaaS dashboard development, design system engineering, WCAG 2.2 AA accessibility audits, and complete website design and development.',
  },
  {
    id: 'pricing',
    question: 'How do you price projects?',
    answer:
      'Pricing depends on scope, access, and timeline. After reviewing a short brief, I define the deliverables, exclusions, schedule, and fixed quote before work begins.',
  },
  {
    id: 'remote',
    question: 'Do you take on international or remote work?',
    answer:
      'Yes. I am based in Noida Extension, India, on IST (UTC+5:30) and am available now for remote freelance and part-time contracts. I reserve 24–28 hours per week and arrange 2–4 hours of real-time overlap with teams in the Americas, United Kingdom, and Western Europe.',
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
      'Send the problem, product context, timeline, and budget range through the contact form. I will review the fit and reply with questions or a proposed scope and next step.',
  },
] as const;
