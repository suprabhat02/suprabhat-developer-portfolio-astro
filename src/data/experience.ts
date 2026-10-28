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

export const experience: readonly Position[] = [
  {
    id: 'topsoe',
    company: 'Topsoe',
    title: 'Software Engineer III',
    start: 'May 2025',
    end: 'Present',
    location: 'Noida, Uttar Pradesh, India',
    mode: 'Hybrid',
    bullets: [
      'Build data-intensive React and TypeScript interfaces with Redux Toolkit and reusable component libraries.',
      'Deliver full-stack product features with Python, FastAPI, PostgreSQL, and Azure services.',
      'Develop a Next.js 16 and React 19 self-service portal with TanStack Query, openapi-fetch, and Azure DevOps CI/CD.',
      'Collaborate in distributed Agile teams across India, Denmark, and China.',
    ],
  },
  {
    id: 'cognizant',
    company: 'Cognizant',
    title: 'Associate – Projects (Frontend Developer)',
    start: 'Feb 2024',
    end: 'Apr 2025',
    location: 'Noida, Uttar Pradesh, India',
    mode: 'On-site',
    bullets: [
      'Developed new features for the BMW Group internal analytics dashboard using React.js, TypeScript, AG Grid, and Ant Design.',
      'Built data-dense AG Grid views for large enterprise datasets and integrated GraphQL and REST APIs over MongoDB, handling asynchronous, loading, and error states.',
      'Ensured cross-browser and cross-device compatibility; participated in Agile sprints and peer code reviews.',
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
      'Improved application delivery with code splitting, lazy loading, and clearer state management.',
      'Integrated REST APIs and implemented responsive, cross-browser interfaces.',
      'Applied WCAG accessibility practices to production web workflows.',
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
        start: 'Sep 2023',
        end: 'Nov 2023',
        promotion: true,
        bullets: [
          'Led frontend architecture reviews and introduced modern delivery tooling.',
          'Mentored junior developers while delivering React and Next.js interfaces.',
        ],
      },
      {
        title: 'Frontend Developer',
        start: 'Feb 2022',
        end: 'Sep 2023',
        bullets: [
          'Converted wireframes into responsive React and TypeScript interfaces.',
          'Built reusable UI components and integrated product APIs.',
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
      'Built responsive, cross-browser websites and web applications using HTML5, CSS3, JavaScript, jQuery, Bootstrap, and Sass.',
      'Contributed across design, development, and testing.',
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
      title: 'Asociado – Proyectos (Desarrollador Frontend)',
      startLabel: 'febrero de 2024',
      endLabel: 'abril de 2025',
      locationLabel: 'Noida, Uttar Pradesh, India',
      modeLabel: 'Presencial',
      bullets: [
        'Desarrollé nuevas funcionalidades para el panel interno de analítica de BMW Group con React.js, TypeScript, AG Grid y Ant Design.',
        'Construí vistas AG Grid con alta densidad de datos para grandes conjuntos empresariales e integré API GraphQL y REST sobre MongoDB, gestionando estados asíncronos, de carga y de error.',
        'Aseguré compatibilidad entre navegadores y dispositivos; participé en sprints Agile y revisiones de código entre pares.',
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
          startLabel: 'septiembre de 2023',
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
        'Desarrollé sitios web y aplicaciones web adaptables y compatibles con distintos navegadores con HTML5, CSS3, JavaScript, jQuery, Bootstrap y Sass.',
        'Participé en las fases de diseño, desarrollo y pruebas.',
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
      title: 'مساعد – المشاريع (مطوّر واجهات أمامية)',
      startLabel: 'فبراير 2024',
      endLabel: 'أبريل 2025',
      locationLabel: 'نويدا، أوتار براديش، الهند',
      modeLabel: 'حضوري',
      bullets: [
        'طورت ميزات جديدة للوحة التحليلات الداخلية الخاصة بـ BMW Group باستخدام React.js وTypeScript وAG Grid وAnt Design.',
        'أنشأت عروض AG Grid كثيفة البيانات لمجموعات بيانات مؤسسية كبيرة ودمجت واجهات GraphQL وREST مع MongoDB، مع معالجة الحالات غير المتزامنة والتحميل والأخطاء.',
        'ضمنت التوافق بين المتصفحات والأجهزة وشاركت في دورات Agile ومراجعات الشيفرة مع الزملاء.',
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
          startLabel: 'سبتمبر 2023',
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
        'أنشأت مواقع وتطبيقات ويب متجاوبة ومتوافقة مع المتصفحات باستخدام HTML5 وCSS3 وJavaScript وjQuery وBootstrap وSass.',
        'ساهمت في مراحل التصميم والتطوير والاختبار.',
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
      ...(job.roles && {
        roles: job.roles.map((role, index) => ({
          ...role,
          ...roles?.[index],
        })),
      }),
    };
  });
};
