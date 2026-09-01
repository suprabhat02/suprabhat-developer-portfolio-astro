import type { Locale } from '../i18n/config';

export interface Role {
  title: string;
  start: string;
  end: string;
  startLabel?: string;
  endLabel?: string;
  location?: string;
  mode?: string;
  duration?: string;
  promotion?: boolean;
  bullets: readonly string[];
}

export interface Position {
  id: string;
  company: string;
  /** Set when the company row itself is the role (no sub-timeline). */
  title?: string;
  start: string;
  end: string;
  startLabel?: string;
  endLabel?: string;
  location?: string;
  locationLabel?: string;
  mode?: string;
  modeLabel?: string;
  duration?: string;
  durationLabel?: string;
  bullets?: readonly string[];
  /** Newest first. Used for the MobileCoderz promotion timeline. */
  roles?: readonly Role[];
}

type RoleTranslation = Partial<
  Pick<Role, 'title' | 'startLabel' | 'endLabel' | 'bullets'>
>;

type PositionTranslation = Partial<
  Pick<
    Position,
    | 'title'
    | 'startLabel'
    | 'endLabel'
    | 'locationLabel'
    | 'modeLabel'
    | 'durationLabel'
    | 'bullets'
  >
> & {
  roles?: readonly RoleTranslation[];
};

/** Dates, locations, modes, titles and bullets are verbatim. */
export const experience: readonly Position[] = [
  {
    id: 'topsoe',
    company: 'Topsoe',
    title: 'Software Engineer III',
    start: 'May 2025',
    end: 'Present',
    mode: 'Hybrid',
    bullets: [
      'Build sleek, modern interfaces with React and TypeScript.',
      'Ship predictable UI state with Redux Toolkit.',
      'Collaborate with cross-functional teams in a hybrid setup.',
    ],
  },
  {
    id: 'cognizant',
    company: 'Cognizant',
    title: 'Associate Projects',
    start: 'Feb 2024',
    end: 'Apr 2025',
    location: 'Noida, Uttar Pradesh, India',
    mode: 'On-site',
    bullets: [
      'Developed UI features using TypeScript.',
      'Worked with GraphQL-backed data flows.',
      'Implemented responsive, modern user interfaces.',
    ],
  },
  {
    id: 'trueblue',
    company: 'TrueBlue Inc.',
    title: 'Implementation Web Developer',
    start: 'Dec 2023',
    end: 'Jan 2024',
    location: 'Gurugram, Haryana, India',
    mode: 'On-site',
    bullets: [
      'Implemented responsive UI updates for web experiences.',
      'Integrated components and ensured consistent UI behavior.',
    ],
  },
  {
    id: 'mobilecoderz',
    company: 'MobileCoderz',
    start: 'Feb 2022',
    end: 'Nov 2023',
    location: 'Noida, Uttar Pradesh, India',
    duration: '1.8 years',
    roles: [
      {
        title: 'Senior Frontend Developer',
        start: 'Oct 2023',
        end: 'Nov 2023',
        promotion: true,
        bullets: [
          'Built modern front-end experiences with React and Next.js.',
          'Collaborated on UI delivery and component integration.',
        ],
      },
      {
        title: 'Frontend Developer',
        start: 'Feb 2022',
        end: 'Sep 2023',
        bullets: [
          'Developed responsive interfaces and reusable UI components.',
          'Worked across React, TypeScript, and modern CSS.',
        ],
      },
    ],
  },
  {
    id: 'swaragh',
    company: 'Swaragh Technologies',
    title: 'UI Developer',
    start: 'Dec 2019',
    end: 'Jan 2022',
    location: 'Bengaluru, Karnataka, India',
    bullets: [
      'Created responsive UI using HTML, CSS, and JavaScript.',
      'Built interactive behaviors with jQuery where needed.',
    ],
  },
] as const;

const localizedExperience: Partial<
  Record<Locale, Record<string, PositionTranslation>>
> = {
  es: {
    topsoe: {
      title: 'Ingeniero de software III',
      startLabel: 'mayo de 2025',
      endLabel: 'Actualidad',
      modeLabel: 'Híbrido',
      bullets: [
        'Creo interfaces modernas y elegantes con React y TypeScript.',
        'Entrego estados de UI predecibles con Redux Toolkit.',
        'Colaboro con equipos multidisciplinares en un modelo híbrido.',
      ],
    },
    cognizant: {
      title: 'Asociado de proyectos',
      startLabel: 'febrero de 2024',
      endLabel: 'abril de 2025',
      locationLabel: 'Noida, Uttar Pradesh, India',
      modeLabel: 'Presencial',
      bullets: [
        'Desarrollé funciones de UI con TypeScript.',
        'Trabajé con flujos de datos respaldados por GraphQL.',
        'Implementé interfaces modernas y adaptables.',
      ],
    },
    trueblue: {
      title: 'Desarrollador web de implementación',
      startLabel: 'diciembre de 2023',
      endLabel: 'enero de 2024',
      locationLabel: 'Gurugram, Haryana, India',
      modeLabel: 'Presencial',
      bullets: [
        'Implementé actualizaciones de UI adaptables para experiencias web.',
        'Integré componentes y aseguré un comportamiento de UI coherente.',
      ],
    },
    mobilecoderz: {
      startLabel: 'febrero de 2022',
      endLabel: 'noviembre de 2023',
      locationLabel: 'Noida, Uttar Pradesh, India',
      durationLabel: '1,8 años',
      roles: [
        {
          title: 'Desarrollador frontend sénior',
          startLabel: 'octubre de 2023',
          endLabel: 'noviembre de 2023',
          bullets: [
            'Creé experiencias frontend modernas con React y Next.js.',
            'Colaboré en la entrega de UI y la integración de componentes.',
          ],
        },
        {
          title: 'Desarrollador frontend',
          startLabel: 'febrero de 2022',
          endLabel: 'septiembre de 2023',
          bullets: [
            'Desarrollé interfaces adaptables y componentes de UI reutilizables.',
            'Trabajé con React, TypeScript y CSS moderno.',
          ],
        },
      ],
    },
    swaragh: {
      title: 'Desarrollador de UI',
      startLabel: 'diciembre de 2019',
      endLabel: 'enero de 2022',
      locationLabel: 'Bengaluru, Karnataka, India',
      bullets: [
        'Creé interfaces adaptables con HTML, CSS y JavaScript.',
        'Construí interacciones con jQuery cuando era necesario.',
      ],
    },
  },
  ar: {
    topsoe: {
      title: 'مهندس برمجيات III',
      startLabel: 'مايو 2025',
      endLabel: 'حتى الآن',
      modeLabel: 'هجين',
      bullets: [
        'أبني واجهات حديثة وأنيقة باستخدام React وTypeScript.',
        'أقدم حالة واجهة متوقعة باستخدام Redux Toolkit.',
        'أتعاون مع فرق متعددة التخصصات ضمن بيئة عمل هجينة.',
      ],
    },
    cognizant: {
      title: 'مساعد مشاريع',
      startLabel: 'فبراير 2024',
      endLabel: 'أبريل 2025',
      locationLabel: 'نويدا، أوتار براديش، الهند',
      modeLabel: 'حضوري',
      bullets: [
        'طورت ميزات واجهة مستخدم باستخدام TypeScript.',
        'عملت مع تدفقات بيانات مدعومة بـ GraphQL.',
        'نفذت واجهات مستخدم حديثة ومتجاوبة.',
      ],
    },
    trueblue: {
      title: 'مطور ويب للتنفيذ',
      startLabel: 'ديسمبر 2023',
      endLabel: 'يناير 2024',
      locationLabel: 'غورغرام، هاريانا، الهند',
      modeLabel: 'حضوري',
      bullets: [
        'نفذت تحديثات واجهة متجاوبة لتجارب الويب.',
        'دمجت المكونات وضمنت سلوكًا متسقًا للواجهة.',
      ],
    },
    mobilecoderz: {
      startLabel: 'فبراير 2022',
      endLabel: 'نوفمبر 2023',
      locationLabel: 'نويدا، أوتار براديش، الهند',
      durationLabel: '1.8 سنة',
      roles: [
        {
          title: 'مطور واجهات أمامية أول',
          startLabel: 'أكتوبر 2023',
          endLabel: 'نوفمبر 2023',
          bullets: [
            'أنشأت تجارب واجهات أمامية حديثة باستخدام React وNext.js.',
            'تعاونت في تسليم الواجهات وتكامل المكونات.',
          ],
        },
        {
          title: 'مطور واجهات أمامية',
          startLabel: 'فبراير 2022',
          endLabel: 'سبتمبر 2023',
          bullets: [
            'طورت واجهات متجاوبة ومكونات UI قابلة لإعادة الاستخدام.',
            'عملت عبر React وTypeScript وCSS الحديث.',
          ],
        },
      ],
    },
    swaragh: {
      title: 'مطور واجهات مستخدم',
      startLabel: 'ديسمبر 2019',
      endLabel: 'يناير 2022',
      locationLabel: 'بنغالورو، كارناتاكا، الهند',
      bullets: [
        'أنشأت واجهات متجاوبة باستخدام HTML وCSS وJavaScript.',
        'أنشأت تفاعلات باستخدام jQuery عند الحاجة.',
      ],
    },
  },
};

export const getExperience = (locale: Locale): readonly Position[] => {
  const translations = localizedExperience[locale];

  if (!translations) return experience;

  return experience.map((job) => {
    const { roles, ...jobTranslation } = translations[job.id] ?? {};

    return {
      ...job,
      ...jobTranslation,
      roles: job.roles?.map((role, index) => ({
        ...role,
        ...roles?.[index],
      })),
    };
  });
};
