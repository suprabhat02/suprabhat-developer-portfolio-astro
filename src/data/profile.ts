import type { Locale } from '../i18n/config';
import { tools } from './tools';
import {
  X_PROFILE_URL,
  DEV_PROFILE_URL,
  HASHNODE_BLOG_URL,
} from '../config/site';

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
  bookingUrl?: string;
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
    'My career began with UI development at Swaragh Technologies, followed by frontend roles at MobileCoderz, TrueBlue, and Cognizant. At MobileCoderz, I moved into a senior frontend role, mentored developers, and contributed to architecture reviews. At Cognizant, I developed features for BMW Group’s internal analytics dashboard using React, TypeScript, AG Grid, and Ant Design, collaborating with teams in Germany. At TrueBlue, I collaborated daily with a research and development team in Australia and worked with offshore colleagues in New Zealand. That progression taught me how to work across product constraints, time zones, and codebases at different stages of maturity.',
    'I specialize in the parts of frontend work that become difficult as products grow: data-heavy dashboards, state and API boundaries, reusable component systems, rendering performance, and accessible interaction. My regular stack includes Redux Toolkit, RTK Query, TanStack Query, AG Grid, Storybook, FastAPI, and PostgreSQL. I choose tools after understanding the user task, data flow, failure states, and maintenance cost rather than treating a framework as the solution.',
    'My working approach is direct: clarify the decision an interface supports, model loading and error states before the ideal path, build the smallest maintainable system, and verify it with type checks, browser tests, accessibility review, and performance measurement. Written decisions and progress updates keep remote work visible without filling calendars with status meetings.',
    'I am available for remote freelance projects and part-time contracts, with 24–28 hours of weekly capacity and evening overlap from India for teams in the Americas and Europe. The best fit is a SaaS company, startup, or digital agency that needs senior frontend support for a defined React build, dashboard, architecture review, design system, accessibility audit, or performance investigation.',
  ],
  philosophy:
    'A useful interface makes the next decision clear. I start with user tasks and failure states, then shape components, data flow, accessibility, and performance around that evidence. The result should be understandable to users and maintainable by the team that owns it.',
  email: 'suprabhatkumar02@gmail.com',
  // TODO(owner): Add a booking URL here when booking links should be enabled.
  bookingUrl: '',
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
    { label: 'X', href: X_PROFILE_URL, external: true },
    { label: 'DEV', href: DEV_PROFILE_URL, external: true },
    { label: 'Hashnode', href: HASHNODE_BLOG_URL, external: true },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/suprabhatkumar/',
      external: true,
    },
    { label: 'GitHub', href: 'https://github.com/suprabhat02', external: true },
    {
      label: 'npm',
      href: 'https://www.npmjs.com/~suprabhat02',
      external: true,
    },
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
      availability: '24–28 horas semanales · Contratos remotos',
      from: 'Noida Extension, India · IST (UTC+5:30)',
    },
    about: [
      'Soy Suprabhat Kumar, también conocido como Shubh, ingeniero frontend sénior y diseñador web con base en Noida Extension, India. Durante seis años he creado portales SaaS, paneles empresariales, bibliotecas de componentes y sitios web públicos con React, Next.js y TypeScript. Actualmente trabajo como Software Engineer III en Topsoe, donde desarrollo interfaces con gran volumen de datos y funcionalidades full-stack junto a equipos distribuidos en Dinamarca y China.',
      'Mi carrera comenzó con desarrollo de UI en Swaragh Technologies y continuó con puestos frontend en MobileCoderz, TrueBlue y Cognizant. En MobileCoderz pasé a un puesto frontend sénior, orienté a otros desarrolladores y participé en revisiones de arquitectura. En Cognizant desarrollé funciones para el panel interno de analítica de BMW Group con React, TypeScript, AG Grid y Ant Design, colaborando con equipos en Alemania. En TrueBlue colaboré a diario con el equipo de investigación y desarrollo en Australia y trabajé con colegas en Nueva Zelanda. Esa trayectoria me enseñó a trabajar con distintas restricciones de producto, zonas horarias y bases de código en diferentes etapas de madurez.',
      'Me especializo en las partes del trabajo frontend que se complican a medida que un producto crece: paneles con muchos datos, límites entre estado y API, sistemas de componentes reutilizables, rendimiento de renderizado e interacción accesible. Mi stack habitual incluye Redux Toolkit, RTK Query, TanStack Query, AG Grid, Storybook, FastAPI y PostgreSQL. Elijo las herramientas después de entender la tarea del usuario, el flujo de datos, los estados de error y el coste de mantenimiento, en lugar de tratar un framework como la solución.',
      'Mi forma de trabajar es directa: aclarar qué decisión apoya una interfaz, modelar los estados de carga y error antes del camino ideal, construir el sistema mantenible más pequeño posible y verificarlo con comprobación de tipos, pruebas en navegador, revisión de accesibilidad y medición de rendimiento. Las decisiones por escrito y los avances documentados mantienen visible el trabajo remoto sin llenar el calendario de reuniones de seguimiento.',
      'Estoy disponible para proyectos freelance remotos y contratos a tiempo parcial, con 24–28 horas semanales de capacidad y horario de tarde desde India que se solapa con equipos de América y Europa. Encajo mejor con empresas SaaS, startups o agencias digitales que necesiten apoyo frontend sénior para un desarrollo React concreto, un panel de datos, una revisión de arquitectura, un sistema de diseño, una auditoría de accesibilidad o una investigación de rendimiento.',
    ],
    philosophy:
      'Una interfaz útil deja clara la siguiente decisión. Empiezo por las tareas del usuario y los estados de error, y a partir de esa evidencia doy forma a los componentes, el flujo de datos, la accesibilidad y el rendimiento. El resultado debe ser comprensible para los usuarios y mantenible para el equipo que lo gestiona.',
    portraitAlt: 'Retrato de Suprabhat Kumar, ingeniero de software frontend',
  },
  ar: {
    name: 'سوبرابهات',
    title: 'مهندس واجهات أمامية أول',
    tagline: 'أداء SaaS | React/Next.js | Core Web Vitals | إمكانية الوصول',
    lead: 'أبني واجهات SaaS سريعة ومتاحة، ولوحات بيانات، ومواقع حديثة باستخدام React وNext.js وTypeScript.',
    eyebrow: {
      role: 'مهندس واجهات أمامية أول',
      availability: '24–28 ساعة أسبوعيًا · عقود عن بُعد',
      from: 'نويدا إكستنشن، الهند · IST (UTC+5:30)',
    },
    about: [
      'أنا سوبرابهات كومار، وأُعرف أيضًا باسم Shubh، مهندس واجهات أمامية أول ومصمم مواقع مقيم في نويدا إكستنشن بالهند. على مدى ست سنوات، بنيت بوابات SaaS ولوحات تحكم مؤسسية ومكتبات مكونات ومواقع عامة باستخدام React وNext.js وTypeScript. أعمل حاليًا بمنصب Software Engineer III في Topsoe، حيث أطوّر واجهات كثيفة البيانات وميزات full-stack مع فرق موزعة في الدنمارك والصين.',
      'بدأت مسيرتي في تطوير واجهات المستخدم لدى Swaragh Technologies، ثم انتقلت إلى أدوار الواجهات الأمامية لدى MobileCoderz وTrueBlue وCognizant. في MobileCoderz انتقلت إلى دور أول في الواجهات الأمامية، ووجّهت مطورين آخرين وشاركت في مراجعات المعمارية. في Cognizant طورت ميزات للوحة التحليلات الداخلية الخاصة بـ BMW Group باستخدام React وTypeScript وAG Grid وAnt Design، بالتعاون مع فرق في ألمانيا. وفي TrueBlue تعاونت يوميًا مع فريق البحث والتطوير في أستراليا وعملت مع زملاء في نيوزيلندا. علّمتني هذه المسيرة العمل عبر قيود المنتجات والمناطق الزمنية وقواعد الشيفرة في مراحل نضج مختلفة.',
      'أتخصص في جوانب عمل الواجهات الأمامية التي تزداد صعوبة مع نمو المنتج: لوحات البيانات الكثيفة، والحدود بين الحالة وواجهات API، وأنظمة المكونات القابلة لإعادة الاستخدام، وأداء العرض، والتفاعل المتاح للجميع. تشمل أدواتي المعتادة Redux Toolkit وRTK Query وTanStack Query وAG Grid وStorybook وFastAPI وPostgreSQL. أختار الأدوات بعد فهم مهمة المستخدم وتدفق البيانات وحالات الخطأ وتكلفة الصيانة، بدلًا من التعامل مع إطار العمل على أنه الحل.',
      'أسلوبي في العمل مباشر: أوضّح القرار الذي تدعمه الواجهة، وأصمم حالات التحميل والخطأ قبل المسار المثالي، وأبني أصغر نظام قابل للصيانة، ثم أتحقق منه بفحص الأنواع واختبارات المتصفح ومراجعة إمكانية الوصول وقياس الأداء. القرارات المكتوبة وتحديثات التقدم تُبقي العمل عن بُعد واضحًا دون ملء التقويم باجتماعات المتابعة.',
      'أنا متاح لمشاريع العمل الحر عن بُعد والعقود بدوام جزئي، بسعة 24–28 ساعة أسبوعيًا، مع ساعات مسائية من الهند تتداخل مع فرق في الأمريكتين وأوروبا. أنسب ما أكون لشركة SaaS أو شركة ناشئة أو وكالة رقمية تحتاج إلى دعم أول في الواجهات الأمامية لبناء React محدد، أو لوحة بيانات، أو مراجعة معمارية، أو نظام تصميم، أو تدقيق لإمكانية الوصول، أو تحقيق في الأداء.',
    ],
    philosophy:
      'الواجهة المفيدة تجعل القرار التالي واضحًا. أبدأ بمهام المستخدم وحالات الخطأ، ثم أشكّل المكونات وتدفق البيانات وإمكانية الوصول والأداء بناءً على هذه الأدلة. يجب أن تكون النتيجة مفهومة للمستخدمين وقابلة للصيانة من الفريق الذي يملكها.',
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

export const profileStack = ['React', 'Next.js', 'TypeScript'].flatMap((name) =>
  tools.filter((tool) => tool.name === name).map((tool) => tool.name),
);
