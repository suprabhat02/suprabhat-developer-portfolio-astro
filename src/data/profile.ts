import type { Locale } from '../i18n/config';

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  lead: string;
  eyebrow: { role: string; availability: string; from: string };
  about: readonly string[];
  philosophy: string;
  email: string;
  portrait: { src: string; width: number; height: number; alt: string };
  social: readonly { label: string; href: string; external: boolean }[];
}

type ProfileTranslation = Pick<
  Profile,
  'title' | 'tagline' | 'lead' | 'about' | 'philosophy'
> & {
  eyebrow: Profile['eyebrow'];
  portraitAlt: string;
};

/** Verbatim from the existing landing page. Do not paraphrase. */
export const profile: Profile = {
  name: 'Suprabhat Kumar',
  title: 'Senior Frontend Engineer',
  tagline:
    'SaaS frontend performance | React/Next.js | Core Web Vitals | Accessibility',
  lead: 'I build fast, accessible SaaS frontends, data dashboards, and modern websites with React, Next.js, and TypeScript.',
  eyebrow: {
    role: 'Senior Frontend Engineer',
    availability: 'Remote friendly',
    from: 'India',
  },
  about: [
    'Senior frontend engineer with 6+ years of experience building scalable SaaS platforms, enterprise dashboards, and high-performance web applications.',
    'I help teams deliver fast, accessible, and maintainable UI systems with predictable architecture, reusable components, and performance budgets that hold up in production.',
    'Specialized in data-heavy dashboards, design systems, and modern front-end architecture across React, Next.js, and TypeScript.',
  ],
  philosophy:
    'I believe great UI is invisible: fast, inclusive, and focused on the task at hand. I build with performance budgets, accessibility checklists, and clean engineering practices from day one for both websites and front-end web applications.',
  email: 'suprabhatkumar02@gmail.com',
  portrait: {
    src: '/assets/images/suprabhat.webp',
    width: 640,
    height: 640,
    alt: 'Portrait of Suprabhat Kumar, Software Engineer',
  },
  social: [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/suprabhatkumar/',
      external: true,
    },
    { label: 'GitHub', href: 'https://github.com/suprabhat02', external: true },
    { label: 'X', href: 'https://twitter.com/suprabhat_dev', external: true },
  ],
} as const;

const profileTranslations: Partial<Record<Locale, ProfileTranslation>> = {
  es: {
    title: 'Ingeniero Frontend Sénior',
    tagline:
      'Rendimiento SaaS | React/Next.js | Core Web Vitals | Accesibilidad',
    lead: 'Creo interfaces SaaS rápidas y accesibles, paneles de datos y sitios web modernos con React, Next.js y TypeScript.',
    eyebrow: {
      role: 'Ingeniero Frontend Sénior',
      availability: 'Trabajo remoto',
      from: 'India',
    },
    about: [
      'Ingeniero frontend sénior con más de 6 años de experiencia creando plataformas SaaS escalables, paneles empresariales y aplicaciones web de alto rendimiento.',
      'Ayudo a los equipos a entregar sistemas de UI rápidos, accesibles y mantenibles con una arquitectura predecible, componentes reutilizables y presupuestos de rendimiento que funcionan en producción.',
      'Especializado en paneles con muchos datos, sistemas de diseño y arquitectura frontend moderna con React, Next.js y TypeScript.',
    ],
    philosophy:
      'Creo que una gran UI es invisible: rápida, inclusiva y enfocada en la tarea. Construyo con presupuestos de rendimiento, listas de verificación de accesibilidad y prácticas de ingeniería limpias desde el primer día, tanto para sitios web como para aplicaciones frontend.',
    portraitAlt: 'Retrato de Suprabhat Kumar, ingeniero de software frontend',
  },
  ar: {
    title: 'مهندس واجهات أمامية أول',
    tagline: 'أداء SaaS | React/Next.js | Core Web Vitals | إمكانية الوصول',
    lead: 'أبني واجهات SaaS سريعة ومتاحة، ولوحات بيانات، ومواقع حديثة باستخدام React وNext.js وTypeScript.',
    eyebrow: {
      role: 'مهندس واجهات أمامية أول',
      availability: 'متاح للعمل عن بعد',
      from: 'الهند',
    },
    about: [
      'مهندس واجهات أمامية أول بخبرة تزيد على 6 سنوات في بناء منصات SaaS قابلة للتوسع، ولوحات تحكم مؤسسية، وتطبيقات ويب عالية الأداء.',
      'أساعد الفرق على تقديم أنظمة UI سريعة ومتاحة وقابلة للصيانة من خلال معمارية واضحة، ومكونات قابلة لإعادة الاستخدام، وميزانيات أداء تصمد في الإنتاج.',
      'متخصص في لوحات البيانات الكثيفة، وأنظمة التصميم، ومعمارية الواجهات الأمامية الحديثة باستخدام React وNext.js وTypeScript.',
    ],
    philosophy:
      'أؤمن بأن الواجهة الممتازة تكون غير مرئية: سريعة، شاملة، ومركزة على المهمة. أبني منذ اليوم الأول بميزانيات أداء، وقوائم تحقق لإمكانية الوصول، وممارسات هندسية نظيفة للمواقع وتطبيقات الواجهات الأمامية.',
    portraitAlt: 'صورة شخصية لسوبرابهات كومار، مهندس واجهات أمامية',
  },
};

export const getProfile = (locale: Locale): Profile => {
  const translation = profileTranslations[locale];

  if (!translation) return profile;

  return {
    ...profile,
    title: translation.title,
    tagline: translation.tagline,
    lead: translation.lead,
    eyebrow: translation.eyebrow,
    about: translation.about,
    philosophy: translation.philosophy,
    portrait: {
      ...profile.portrait,
      alt: translation.portraitAlt,
    },
  };
};
