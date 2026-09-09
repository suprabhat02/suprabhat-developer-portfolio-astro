import type { Locale } from '../i18n/config';

export interface Profile {
  name: string;
  nickname: string;
  title: string;
  tagline: string;
  lead: string;
  eyebrow: { role: string; availability: string; from: string };
  about: readonly string[];
  philosophy: string;
  email: string;
  phone: string;
  pronouns: string;
  timezone: string;
  portrait: { src: string; width: number; height: number; alt: string };
  social: readonly { label: string; href: string; external: boolean }[];
}

type ProfileTranslation = Pick<
  Profile,
  'title' | 'tagline' | 'lead' | 'about' | 'philosophy'
> & {
  name?: string;
  eyebrow: Profile['eyebrow'];
  portraitAlt: string;
};

export const profile: Profile = {
  name: 'Suprabhat Kumar',
  nickname: 'Shubh',
  title: 'Senior Front-End Engineer',
  tagline:
    'React architecture · SaaS dashboards · Web performance · Accessibility',
  lead: 'I help SaaS teams build fast, accessible React products, data-heavy dashboards, and frontend systems they can maintain.',
  eyebrow: {
    role: 'Senior Front-End Engineer',
    availability: '24–28 hours weekly · Remote contracts',
    from: 'Noida Extension, India · IST (UTC+5:30)',
  },
  about: [
    'I am Suprabhat Kumar, also known as Shubh, a Senior Front-End Engineer and web designer based in Noida Extension, India. Over six years, I have built SaaS portals, enterprise dashboards, component libraries, and public websites with React, Next.js, and TypeScript. I currently work as a Software Engineer III at Topsoe, where I develop data-intensive interfaces and full-stack features with distributed teams in Denmark and China.',
    'My career began with UI development at Swaragh Technologies, followed by frontend roles at MobileCoderz, TrueBlue, and Cognizant. At MobileCoderz, I moved into a senior frontend role, mentored developers, and contributed to architecture reviews. At Cognizant, I delivered React and TypeScript SaaS interfaces with an Australian research and development team. That progression taught me how to work across product constraints, time zones, and codebases at different stages of maturity.',
    'I specialize in the parts of frontend work that become difficult as products grow: data-heavy dashboards, state and API boundaries, reusable component systems, rendering performance, and accessible interaction. My regular stack includes Redux Toolkit, RTK Query, TanStack Query, AG Grid, Storybook, FastAPI, and PostgreSQL. I choose tools after understanding the user task, data flow, failure states, and maintenance cost rather than treating a framework as the solution.',
    'My working approach is direct: clarify the decision an interface supports, model loading and error states before the ideal path, build the smallest maintainable system, and verify it with type checks, browser tests, accessibility review, and performance measurement. Written decisions and progress updates keep remote work visible without filling calendars with status meetings.',
    'I am available for remote freelance projects and part-time contracts, with 24–28 hours of weekly capacity and evening overlap from India for teams in the Americas and Europe. The best fit is a SaaS company, startup, or digital agency that needs senior frontend support for a defined React build, dashboard, architecture review, design system, accessibility audit, or performance investigation.',
  ],
  philosophy:
    'A useful interface makes the next decision clear. I start with user tasks and failure states, then shape components, data flow, accessibility, and performance around that evidence. The result should be understandable to users and maintainable by the team that owns it.',
  email: 'suprabhatkumar02@gmail.com',
  phone: '+91 78920 08290',
  pronouns: 'he/him',
  timezone: 'IST (UTC+5:30)',
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
    name: 'صباح الخير',
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
    name: translation.name ?? profile.name,
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
