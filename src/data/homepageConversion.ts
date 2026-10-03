import type { Locale } from '../i18n/config';

interface ConversionItem {
  title: string;
  body: string;
}

interface ProblemItem extends ConversionItem {
  /** Observable symptoms a buyer recognises in their own product. */
  signals: readonly string[];
  /** The concrete result of the engagement, stated without metrics. */
  outcome: string;
}

interface EngagementItem extends ConversionItem {
  fit: string;
  deliverables: string;
  duration: string;
}

interface HomepageConversionContent {
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    trustLine: string;
  };
  work: { eyebrow: string; title: string; lead: string; note: string };
  problems: {
    eyebrow: string;
    title: string;
    lead: string;
    signalsLabel: string;
    outcomeLabel: string;
    items: readonly ProblemItem[];
  };
  engagements: {
    eyebrow: string;
    title: string;
    lead: string;
    fitLabel: string;
    deliverablesLabel: string;
    durationLabel: string;
    items: readonly EngagementItem[];
  };
  approach: {
    eyebrow: string;
    title: string;
    items: readonly ConversionItem[];
  };
  collaboration: {
    eyebrow: string;
    title: string;
    lead: string;
    items: readonly ConversionItem[];
  };
}

const content: Record<Locale, HomepageConversionContent> = {
  en: {
    hero: {
      eyebrow: 'Senior Front-End Engineer · Remote contracts · India',
      title: 'React architecture, SaaS dashboards, and frontend performance',
      lead: 'I help SaaS teams build accessible React products, data-heavy dashboards, and frontend systems they can maintain.',
      primaryCta: 'View case studies',
      secondaryCta: 'Discuss your frontend work',
      trustLine:
        '24–28 hours weekly · Americas and Europe overlap · Available now',
    },
    work: {
      eyebrow: 'Featured case studies',
      title: 'Architecture and product decisions in context',
      lead: 'Anonymized and public work showing constraints, implementation choices, accessibility, and performance practice.',
      note: 'Client names, private data, screenshots, and unverified metrics are intentionally excluded.',
    },
    problems: {
      eyebrow: 'Problems I solve',
      title: 'Frontend work for complex product surfaces',
      lead: 'Focused help where maintainability, speed, accessibility, and product clarity intersect.',
      signalsLabel: 'Typical signals',
      outcomeLabel: 'Outcome',
      items: [
        {
          title: 'React modernization',
          body: 'Untangle brittle component and state patterns while preserving product continuity.',
          signals: [
            'Components that mix data fetching, state, and layout',
            'Prop drilling or global state used as a workaround',
            'Regressions after routine UI changes',
          ],
          outcome:
            'An incremental migration plan with clear component and state boundaries, shipped without a feature freeze.',
        },
        {
          title: 'Frontend performance',
          body: 'Find and prioritize rendering, asset, interaction, and Core Web Vitals bottlenecks.',
          signals: [
            'Slow LCP or INP in field data or Lighthouse lab tests',
            'Large JavaScript bundles on first load',
            'Interactions that stutter on mid-range devices',
          ],
          outcome:
            'A prioritized fix list tied to Core Web Vitals, with before-and-after measurements.',
        },
        {
          title: 'Data-heavy dashboards',
          body: 'Create clear information hierarchy and resilient loading, empty, error, and permission states.',
          signals: [
            'Tables and charts that slow down as data grows',
            'Unclear loading, empty, or error states',
            'Filters and views that differ by user role',
          ],
          outcome:
            'A scan-first dashboard with typed data contracts and resilient states for every panel.',
        },
        {
          title: 'Accessible interfaces',
          body: 'Improve semantics, keyboard paths, focus behavior, forms, and assistive-technology support.',
          signals: [
            'Controls that cannot be reached or operated by keyboard',
            'Missing labels, focus order, or screen-reader announcements',
            'Customer or procurement requests for WCAG 2.2 AA evidence',
          ],
          outcome:
            'Severity-ranked findings and fixes mapped to WCAG 2.2 AA success criteria.',
        },
        {
          title: 'Design systems',
          body: 'Build reusable components, tokens, documentation, and adoption patterns teams can maintain.',
          signals: [
            'The same component built differently across teams',
            'Design tokens that drift between Figma and code',
            'Slow reviews over visual inconsistencies',
          ],
          outcome:
            'A documented component library and token set in Storybook that teams can extend.',
        },
        {
          title: 'Architecture reviews',
          body: 'Assess boundaries, state ownership, rendering strategy, testing, and delivery risks.',
          signals: [
            'A codebase inherited after team changes',
            'Unclear ownership of state, data fetching, and routing',
            'Rising delivery risk before a major release',
          ],
          outcome:
            'An architecture decision record and a refactor roadmap ranked by risk and effort.',
        },
      ],
    },
    engagements: {
      eyebrow: 'Frontend engineering services',
      title: 'Defined support for a specific frontend problem',
      lead: 'Each engagement has a clear fit, concrete deliverables, and a working duration. Final scope is confirmed after discovery.',
      fitLabel: 'Best for',
      deliverablesLabel: 'Deliverables',
      durationLabel: 'Duration',
      items: [
        {
          title: 'Defined React frontend project',
          body: 'Deliver a bounded React, Next.js, or TypeScript build without adding embedded team overhead.',
          fit: 'SaaS teams, startups, and agencies with an approved scope and product owner',
          deliverables:
            'Implementation, responsive UI, accessibility, tests, documentation, and handover',
          duration: 'Confirmed after discovery',
        },
        {
          title: 'Frontend performance audit',
          body: 'Locate rendering, asset, routing, and interaction bottlenecks in a React application.',
          fit: 'SaaS teams with weak Lighthouse lab scores or slow product flows',
          deliverables:
            'Audit report, annotated fix list, priority order, and review call',
          duration: '5 business days',
        },
        {
          title: 'React and TypeScript architecture review',
          body: 'Assess component boundaries, state ownership, data flow, rendering, tests, and delivery risks.',
          fit: 'Engineering managers inheriting or scaling a React codebase',
          deliverables:
            'Architecture decision record, refactor roadmap, and team presentation',
          duration: '1–2 weeks',
        },
        {
          title: 'Async architecture advisory',
          body: 'Get focused code review or architecture guidance without an embedded engagement.',
          fit: 'Engineering leads who need a senior second opinion across time zones',
          deliverables:
            'Written review, annotated findings, recorded walkthrough, and decision notes',
          duration: 'Scoped per review',
        },
        {
          title: 'SaaS dashboard development',
          body: 'Build data-heavy admin panels and analytics interfaces in React and TypeScript.',
          fit: 'Product teams building dashboards, internal tools, or analytics products',
          deliverables:
            'Responsive UI, resilient data states, accessibility, tests, and handover',
          duration: '3–8 weeks',
        },
        {
          title: 'Design system engineering',
          body: 'Standardize components and visual decisions across products and teams.',
          fit: 'Teams with inconsistent UI across multiple products or engineers',
          deliverables:
            'Component library, tokens, Storybook, theming, accessibility baseline, and contribution guide',
          duration: '4–10 weeks',
        },
        {
          title: 'Accessibility audit',
          body: 'Review key workflows against WCAG 2.2 AA criteria with manual and axe-based testing.',
          fit: 'Teams serving enterprise clients or regulated industries',
          deliverables:
            'Severity-ranked findings, fix guidance, and one retest round',
          duration: '5–7 business days',
        },
        {
          title: 'Website design and development',
          body: 'Design and build a responsive, accessible website using technology suited to its content and delivery model.',
          fit: 'Startups, businesses, and agencies needing a complete web presence',
          deliverables:
            'Custom design, responsive build, performance testing, SEO metadata, contact form, and deployment',
          duration: '1–8 weeks, depending on scope',
        },
      ],
    },
    approach: {
      eyebrow: 'Engineering approach',
      title: 'Evidence before abstraction',
      items: [
        {
          title: 'Clarify the decision',
          body: 'Start with users, constraints, failure states, and the business decision the interface supports.',
        },
        {
          title: 'Design the system',
          body: 'Choose component, data, state, and rendering boundaries that fit the actual product.',
        },
        {
          title: 'Verify the result',
          body: 'Use type checks, tests, accessibility review, performance budgets, and documented handover.',
        },
      ],
    },
    collaboration: {
      eyebrow: 'Remote collaboration',
      title: 'Delivery stays visible across time zones',
      lead: 'Based in Noida Extension on IST (UTC+5:30), with 24–28 hours of weekly capacity and 2–4 hours of agreed real-time overlap for teams in the Americas, United Kingdom, and Western Europe.',
      items: [
        {
          title: 'Async by default',
          body: 'Written context, decisions, and progress updates reduce meeting dependency.',
        },
        {
          title: 'Shared milestones',
          body: 'Scope, review points, risks, and next actions remain visible throughout delivery.',
        },
        {
          title: 'Review and handover',
          body: 'Changes include review context, documentation, knowledge transfer, and full source ownership after final payment.',
        },
      ],
    },
  },
  es: {
    hero: {
      eyebrow: 'Ingeniero Frontend Sénior · Remoto · India',
      title:
        'Creo productos React rápidos y accesibles para equipos SaaS y empresariales.',
      lead: 'Ayudo a equipos de producto a entregar dashboards escalables, arquitectura frontend, sistemas de diseño y mejoras de rendimiento con React, Next.js, TypeScript y Astro.',
      primaryCta: 'Ver casos de estudio',
      secondaryCta: 'Hablar de un proyecto',
      trustLine:
        'Trabajo asíncrono · Actualizaciones escritas · Hitos compartidos · Compatible con NDA',
    },
    work: {
      eyebrow: 'Casos de estudio destacados',
      title: 'Decisiones de arquitectura y producto en contexto',
      lead: 'Trabajo anonimizado y público que muestra restricciones, decisiones de implementación, accesibilidad y rendimiento.',
      note: 'Se excluyen intencionalmente nombres de clientes, datos privados, capturas y métricas no verificadas.',
    },
    problems: {
      eyebrow: 'Problemas que resuelvo',
      title: 'Frontend para superficies de producto complejas',
      lead: 'Ayuda especializada donde se cruzan mantenibilidad, velocidad, accesibilidad y claridad de producto.',
      signalsLabel: 'Señales habituales',
      outcomeLabel: 'Resultado',
      items: [
        {
          title: 'Modernización de React',
          body: 'Mejorar componentes y estado frágiles sin interrumpir la continuidad del producto.',
          signals: [
            'Componentes que mezclan obtención de datos, estado y maquetación',
            'Prop drilling o estado global usado como parche',
            'Regresiones tras cambios rutinarios de UI',
          ],
          outcome:
            'Un plan de migración incremental con límites claros de componentes y estado, sin congelar funcionalidades.',
        },
        {
          title: 'Rendimiento frontend',
          body: 'Detectar y priorizar problemas de renderizado, recursos, interacción y Core Web Vitals.',
          signals: [
            'LCP o INP lentos en datos de campo o en pruebas de laboratorio de Lighthouse',
            'Paquetes de JavaScript grandes en la primera carga',
            'Interacciones que se entrecortan en dispositivos de gama media',
          ],
          outcome:
            'Una lista de correcciones priorizada según Core Web Vitals, con mediciones de antes y después.',
        },
        {
          title: 'Dashboards de datos',
          body: 'Crear jerarquía clara y estados de carga, vacío, error y permisos resilientes.',
          signals: [
            'Tablas y gráficos que se ralentizan al crecer los datos',
            'Estados de carga, vacío o error poco claros',
            'Filtros y vistas que cambian según el rol',
          ],
          outcome:
            'Un dashboard pensado para escanear, con contratos de datos tipados y estados resilientes en cada panel.',
        },
        {
          title: 'Interfaces accesibles',
          body: 'Mejorar semántica, teclado, foco, formularios y soporte para tecnologías de asistencia.',
          signals: [
            'Controles que no se alcanzan o no se operan con teclado',
            'Faltan etiquetas, orden de foco o anuncios para lectores de pantalla',
            'Clientes o procesos de compra que piden evidencia de WCAG 2.2 AA',
          ],
          outcome:
            'Hallazgos ordenados por gravedad y correcciones vinculadas a los criterios de WCAG 2.2 AA.',
        },
        {
          title: 'Sistemas de diseño',
          body: 'Construir componentes, tokens, documentación y patrones de adopción mantenibles.',
          signals: [
            'El mismo componente construido de forma distinta en cada equipo',
            'Tokens de diseño que divergen entre Figma y el código',
            'Revisiones lentas por inconsistencias visuales',
          ],
          outcome:
            'Una biblioteca de componentes y tokens documentada en Storybook que los equipos pueden ampliar.',
        },
        {
          title: 'Revisiones de arquitectura',
          body: 'Evaluar límites, estado, renderizado, pruebas y riesgos de entrega.',
          signals: [
            'Una base de código heredada tras cambios de equipo',
            'Propiedad poco clara del estado, los datos y el enrutamiento',
            'Riesgo de entrega creciente antes de un lanzamiento importante',
          ],
          outcome:
            'Un registro de decisiones de arquitectura y una hoja de ruta de refactorización ordenada por riesgo y esfuerzo.',
        },
      ],
    },
    engagements: {
      eyebrow: 'Formas de colaborar',
      title: 'Elige el nivel de apoyo que necesita el problema',
      lead: 'El alcance y el calendario se confirman tras revisar el contexto y las restricciones.',
      fitLabel: 'Ideal para',
      deliverablesLabel: 'Entregables',
      durationLabel: 'Duración',
      items: [
        {
          title: 'Proyecto freelance definido',
          body: 'Una funcionalidad, dashboard, parte de un sistema de diseño o modernización delimitada.',
          fit: 'Equipos con un resultado y responsable claros',
          deliverables: 'Implementación, pruebas, documentación y entrega',
          duration: 'Se confirma tras el descubrimiento',
        },
        {
          title: 'Ingeniería de producto a tiempo parcial',
          body: 'Entrega frontend continua junto a un equipo de producto existente.',
          fit: 'Equipos que necesitan capacidad frontend sénior',
          deliverables:
            'Entrega incremental, revisiones, actualizaciones y transferencia',
          duration: 'Capacidad y plazo por confirmar',
        },
        {
          title: 'Auditoría técnica',
          body: 'Revisión enfocada de rendimiento, accesibilidad, arquitectura o calidad frontend.',
          fit: 'Equipos que necesitan evidencia priorizada',
          deliverables:
            'Hallazgos, riesgos, recomendaciones y plan de verificación',
          duration: 'Según tamaño y acceso al producto',
        },
        {
          title: 'Sesiones de asesoría',
          body: 'Apoyo estructurado para decisiones de arquitectura, entrega o sistema de diseño.',
          fit: 'Líderes que validan un enfoque',
          deliverables: 'Preparación, sesión y notas de decisión',
          duration: 'Sesiones enfocadas programadas',
        },
      ],
    },
    approach: {
      eyebrow: 'Enfoque de ingeniería',
      title: 'Evidencia antes que abstracción',
      items: [
        {
          title: 'Aclarar la decisión',
          body: 'Comenzar por usuarios, restricciones, fallos y la decisión de negocio que apoya la interfaz.',
        },
        {
          title: 'Diseñar el sistema',
          body: 'Elegir límites de componentes, datos, estado y renderizado adecuados al producto.',
        },
        {
          title: 'Verificar el resultado',
          body: 'Usar tipos, pruebas, revisión de accesibilidad, presupuestos de rendimiento y entrega documentada.',
        },
      ],
    },
    collaboration: {
      eyebrow: 'Colaboración remota',
      title: 'El trabajo permanece visible entre zonas horarias',
      lead: 'Trabajo desde India y estoy preparado para colaboración remota. El solapamiento y la capacidad semanal se confirman antes del proyecto.',
      items: [
        {
          title: 'Asíncrono por defecto',
          body: 'El contexto, las decisiones y el progreso por escrito reducen la dependencia de reuniones.',
        },
        {
          title: 'Hitos compartidos',
          body: 'Alcance, revisiones, riesgos y siguientes acciones permanecen visibles.',
        },
        {
          title: 'Revisión y entrega',
          body: 'Los cambios incluyen contexto, documentación y transferencia al equipo responsable.',
        },
      ],
    },
  },
  ar: {
    hero: {
      eyebrow: 'مهندس واجهات أمامية أول · عن بُعد · الهند',
      title: 'أبني منتجات React سريعة ومتاحة لفرق SaaS والمؤسسات.',
      lead: 'أساعد فرق المنتجات على تقديم لوحات بيانات قابلة للتوسع، ومعمارية واجهات، وأنظمة تصميم، وتحسينات أداء باستخدام React وNext.js وTypeScript وAstro.',
      primaryCta: 'عرض دراسات الحالة',
      secondaryCta: 'مناقشة مشروع',
      trustLine:
        'عمل غير متزامن · تحديثات مكتوبة · مراحل مشتركة · مناسب لاتفاقيات السرية',
    },
    work: {
      eyebrow: 'دراسات حالة مختارة',
      title: 'قرارات المعمارية والمنتج ضمن سياقها',
      lead: 'أعمال مجهولة الهوية وعامة تعرض القيود وقرارات التنفيذ وممارسات الإتاحة والأداء.',
      note: 'تُستبعد عمدًا أسماء العملاء والبيانات الخاصة واللقطات والمقاييس غير الموثقة.',
    },
    problems: {
      eyebrow: 'المشكلات التي أحلها',
      title: 'هندسة واجهات لأسطح منتجات معقدة',
      lead: 'دعم مركز حيث تتقاطع قابلية الصيانة والسرعة والإتاحة ووضوح المنتج.',
      signalsLabel: 'مؤشرات شائعة',
      outcomeLabel: 'النتيجة',
      items: [
        {
          title: 'تحديث تطبيقات React',
          body: 'تحسين أنماط المكونات والحالة الهشة مع الحفاظ على استمرارية المنتج.',
          signals: [
            'مكونات تخلط جلب البيانات والحالة والتخطيط',
            'تمرير الخصائص عبر طبقات كثيرة أو حالة عامة كحل مؤقت',
            'أخطاء جديدة بعد تغييرات روتينية في الواجهة',
          ],
          outcome:
            'خطة ترحيل تدريجية بحدود واضحة للمكونات والحالة، تُنفذ دون تجميد الميزات.',
        },
        {
          title: 'أداء الواجهات',
          body: 'اكتشاف وترتيب مشكلات العرض والأصول والتفاعل وCore Web Vitals.',
          signals: [
            'بطء LCP أو INP في البيانات الميدانية أو اختبارات Lighthouse المعملية',
            'حزم JavaScript كبيرة عند التحميل الأول',
            'تفاعلات متقطعة على الأجهزة المتوسطة',
          ],
          outcome:
            'قائمة إصلاحات مرتبة حسب Core Web Vitals مع قياسات قبل التحسين وبعده.',
        },
        {
          title: 'لوحات بيانات كثيفة',
          body: 'إنشاء تسلسل معلومات واضح وحالات تحميل وفراغ وخطأ وصلاحيات مرنة.',
          signals: [
            'جداول ورسوم بيانية تبطؤ مع نمو البيانات',
            'حالات تحميل أو فراغ أو خطأ غير واضحة',
            'مرشحات وعروض تختلف حسب دور المستخدم',
          ],
          outcome:
            'لوحة سهلة المسح بعقود بيانات مضبوطة الأنواع وحالات مرنة لكل لوحة.',
        },
        {
          title: 'واجهات متاحة',
          body: 'تحسين الدلالات ولوحة المفاتيح والتركيز والنماذج والتقنيات المساعدة.',
          signals: [
            'عناصر تحكم لا يمكن الوصول إليها أو تشغيلها بلوحة المفاتيح',
            'غياب التسميات أو ترتيب التركيز أو إعلانات قارئ الشاشة',
            'طلبات العملاء أو المشتريات لإثبات التوافق مع WCAG 2.2 AA',
          ],
          outcome:
            'نتائج مرتبة حسب الخطورة وإصلاحات مرتبطة بمعايير نجاح WCAG 2.2 AA.',
        },
        {
          title: 'أنظمة التصميم',
          body: 'بناء مكونات ورموز وتوثيق وأنماط تبنٍ قابلة للصيانة.',
          signals: [
            'المكون نفسه مبني بطرق مختلفة في كل فريق',
            'رموز تصميم تختلف بين Figma والشيفرة',
            'مراجعات بطيئة بسبب عدم الاتساق البصري',
          ],
          outcome: 'مكتبة مكونات ورموز موثقة في Storybook يمكن للفرق توسيعها.',
        },
        {
          title: 'مراجعات المعمارية',
          body: 'تقييم الحدود وملكية الحالة واستراتيجية العرض والاختبارات ومخاطر التسليم.',
          signals: [
            'قاعدة شيفرة موروثة بعد تغييرات في الفريق',
            'ملكية غير واضحة للحالة وجلب البيانات والتوجيه',
            'تزايد مخاطر التسليم قبل إصدار رئيسي',
          ],
          outcome:
            'سجل قرارات معمارية وخارطة إعادة هيكلة مرتبة حسب المخاطر والجهد.',
        },
      ],
    },
    engagements: {
      eyebrow: 'طرق العمل معًا',
      title: 'اختر مستوى الدعم الذي تحتاجه المشكلة',
      lead: 'يُؤكد النطاق والجدول بعد مراجعة سياق المنتج وقيوده.',
      fitLabel: 'مناسب لـ',
      deliverablesLabel: 'المخرجات',
      durationLabel: 'المدة',
      items: [
        {
          title: 'مشروع مستقل محدد',
          body: 'ميزة أو لوحة بيانات أو جزء من نظام تصميم أو مبادرة تحديث محددة.',
          fit: 'فرق لديها نتيجة ومسؤول واضحان',
          deliverables: 'تنفيذ واختبارات وتوثيق وتسليم',
          duration: 'تُحدد بعد الاستكشاف',
        },
        {
          title: 'هندسة منتج بدوام جزئي',
          body: 'تسليم واجهات مستمر إلى جانب فريق منتج قائم.',
          fit: 'فرق تحتاج خبرة واجهات أولى',
          deliverables: 'تسليم تدريجي ومراجعات وتحديثات ونقل معرفة',
          duration: 'السعة والمدة تحتاجان تأكيدًا',
        },
        {
          title: 'تدقيق تقني',
          body: 'مراجعة مركزة للأداء أو الإتاحة أو المعمارية أو جودة الواجهة.',
          fit: 'فرق تحتاج أدلة مرتبة قبل التنفيذ',
          deliverables: 'نتائج ومخاطر وتوصيات وخطة تحقق',
          duration: 'حسب حجم المنتج وإمكانية الوصول',
        },
        {
          title: 'جلسات استشارية',
          body: 'دعم منظم لقرارات المعمارية أو التسليم أو نظام التصميم.',
          fit: 'قادة يتحققون من نهج أو مفاضلة',
          deliverables: 'تحضير وجلسة وملاحظات قرار',
          duration: 'جلسات مركزة مجدولة',
        },
      ],
    },
    approach: {
      eyebrow: 'منهج الهندسة',
      title: 'الأدلة قبل التجريد',
      items: [
        {
          title: 'توضيح القرار',
          body: 'البدء بالمستخدمين والقيود وحالات الفشل وقرار العمل الذي تدعمه الواجهة.',
        },
        {
          title: 'تصميم النظام',
          body: 'اختيار حدود المكونات والبيانات والحالة والعرض المناسبة للمنتج.',
        },
        {
          title: 'التحقق من النتيجة',
          body: 'استخدام الأنواع والاختبارات ومراجعة الإتاحة وميزانيات الأداء والتسليم الموثق.',
        },
      ],
    },
    collaboration: {
      eyebrow: 'التعاون عن بُعد',
      title: 'يبقى العمل واضحًا عبر المناطق الزمنية',
      lead: 'أعمل من الهند ومجهز للتعاون عن بُعد. يُتفق على ساعات التداخل والسعة الأسبوعية قبل بدء العمل.',
      items: [
        {
          title: 'غير متزامن افتراضيًا',
          body: 'السياق والقرارات وتحديثات التقدم المكتوبة تقلل الاعتماد على الاجتماعات.',
        },
        {
          title: 'مراحل مشتركة',
          body: 'يبقى النطاق ونقاط المراجعة والمخاطر والخطوات التالية واضحة.',
        },
        {
          title: 'المراجعة والتسليم',
          body: 'تشمل التغييرات سياق المراجعة والتوثيق ونقل المعرفة للفريق المسؤول.',
        },
      ],
    },
  },
};

export const getHomepageConversionContent = (locale: Locale) => content[locale];
