import type { Locale } from '../i18n/config';

export interface Recommendation {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  quoteLang?: string;
  verified: boolean;
  /** Optional public source URL; direct publication consent may be recorded offline. */
  sourceUrl?: string;
}

/** Wording preserved exactly. Translation consent is confirmed; native review is pending. */
export const recommendations: readonly Recommendation[] = [
  {
    id: 'sandeep-sharma',
    quote:
      'The performance optimization work reduced load times and made our product feel dramatically more responsive.',
    name: 'Sandeep',
    role: 'AI Engineer',
    avatar: '/assets/testimonials/sandeep-sharma.jpg',
    verified: true,
  },
  {
    id: 'pooja-verma',
    quote:
      'Suprabhat turned a complex analytics workflow into a fast, accessible dashboard. The UI felt polished and the performance wins were immediate.',
    name: 'Pooja',
    role: 'Senior Quality Analyst',
    avatar: '/assets/testimonials/pooja-verma.jpg',
    verified: true,
  },
  {
    id: 'sonu-gagan',
    quote:
      'He brought structure to our front-end architecture and delivered a design-system-ready UI that scaled across teams.',
    name: 'Sonu Gagan Karn',
    role: 'Senior Specialist, Platform',
    avatar: '/assets/testimonials/sonu-gagan.jpg',
    verified: true,
  },
  {
    id: 'supriya-suman',
    quote:
      'His accessibility-first approach helped us ship inclusive experiences without slowing delivery.',
    name: 'Supriya Suman',
    role: 'Associate, UX Research',
    avatar: '/assets/testimonials/supriya-suman.jpg',
    verified: true,
  },
  {
    id: 'suraj',
    quote:
      'A thoughtful collaborator who translates design intent into clean, scalable UI with real-world performance in mind.',
    name: 'Suraj',
    role: 'SEO Specialist',
    avatar: '/assets/testimonials/suraj.jpg',
    verified: true,
  },
  {
    id: 'aditi-vimal',
    quote:
      'The refresh delivered measurable improvements in engagement, and the visual polish made the product feel premium overnight.',
    name: 'Aditi Vimal',
    role: 'Executive - Regulatory Affairs',
    avatar: '/assets/testimonials/aditi-vimal.jpg',
    verified: true,
  },
] as const;

/** Homepage shows three; /recommendations/ shows all six. */
export const featuredRecommendationIds = [
  'pooja-verma',
  'sonu-gagan',
  'supriya-suman',
] as const;

const localizedRoles: Partial<Record<Locale, Record<string, string>>> = {
  es: {
    'sandeep-sharma': 'Ingeniero de IA',
    'pooja-verma': 'Analista sénior de calidad',
    'sonu-gagan': 'Especialista sénior, Plataforma',
    'supriya-suman': 'Asociada, Investigación UX',
    suraj: 'Especialista SEO',
    'aditi-vimal': 'Ejecutiva de asuntos regulatorios',
  },
  ar: {
    'sandeep-sharma': 'مهندس ذكاء اصطناعي',
    'pooja-verma': 'محللة جودة أولى',
    'sonu-gagan': 'أخصائي أول، المنصة',
    'supriya-suman': 'زميلة، أبحاث UX',
    suraj: 'أخصائي SEO',
    'aditi-vimal': 'تنفيذية شؤون تنظيمية',
  },
};

export const getRecommendations = (locale: Locale): readonly Recommendation[] =>
  recommendations
    .filter((recommendation) => recommendation.verified)
    .map((recommendation) => ({
      ...recommendation,
      role: localizedRoles[locale]?.[recommendation.id] ?? recommendation.role,
      quoteLang: locale === 'en' ? undefined : 'en',
    }));
