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
      'I build high-performance, accessible websites and front-end applications, including UI engineering, design systems, performance optimization, and React/Next.js development.',
  },
  {
    id: 'pricing',
    question: 'How do you price projects?',
    answer:
      'Pricing is tailored to scope and timeline. I provide a fixed quote after a short discovery call and a clear requirements outline.',
  },
  {
    id: 'remote',
    question: 'Do you take on international or remote work?',
    answer:
      'Yes. I collaborate remotely with teams worldwide using async updates, shared milestones, and transparent progress tracking.',
  },
  {
    id: 'timeline',
    question: 'What does a typical timeline look like?',
    answer:
      'Timelines depend on complexity, but most landing pages take 1–2 weeks, and multi-page sites or apps take 3–6 weeks.',
  },
  {
    id: 'start',
    question: 'How do we start a collaboration?',
    answer:
      'Send a brief via the contact form and I will reply with next steps, timeline options, and a detailed proposal.',
  },
] as const;
