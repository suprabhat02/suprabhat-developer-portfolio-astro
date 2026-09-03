import type { Locale } from '../i18n/config';

export interface CaseStudySection {
  id: string;
  heading: string;
  body: readonly string[];
  bullets?: readonly string[];
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export type CaseStudyProofId = 'role' | 'constraints' | 'decisions';

export interface CaseStudyProof {
  id: CaseStudyProofId;
  heading: string;
  items: readonly string[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  summary: string;
  confidentialityNote: string;
  meta: readonly CaseStudyMetric[];
  tags: readonly string[];
  proof: readonly CaseStudyProof[];
  sections: readonly CaseStudySection[];
  outcomes: readonly string[];
  nextSteps: readonly string[];
  relatedServices: readonly string[];
}

type CaseStudyBase = Omit<CaseStudy, 'proof'>;

const analyticsCommandCenter: Record<Locale, CaseStudyBase> = {
  en: {
    slug: 'analytics-command-center',
    title: 'Analytics command center',
    seoTitle:
      'Analytics Command Center Case Study | React Dashboard UI Engineering',
    description:
      'An anonymized frontend case study for a role-based analytics dashboard with accessible charts, resilient data states, performance, and scalable React UI.',
    eyebrow: 'Case study · Internal product work',
    summary:
      'A role-based analytics dashboard designed to help product and operations teams review critical signals, compare trends, and make faster decisions without relying on fragile exports or overloaded reporting screens.',
    confidentialityNote:
      'This case study is anonymized. Client names, screenshots, proprietary workflows, private datasets, and exact business metrics are intentionally excluded.',
    meta: [
      { label: 'Project type', value: 'Data-heavy SaaS dashboard' },
      { label: 'Role', value: 'Frontend architecture and UI engineering' },
      { label: 'Primary focus', value: 'Accessibility, performance, data UX' },
      { label: 'Stack area', value: 'React, TypeScript, state and API flows' },
    ],
    tags: [
      'React dashboard',
      'TypeScript',
      'Accessible charts',
      'Data UX',
      'Role-based UI',
      'Core Web Vitals',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Context',
        body: [
          'The product needed a clearer analytics workspace for users who depended on changing data to make operational decisions. The existing experience spread related information across separate views, which made comparisons slow and increased the chance that important states were missed.',
          'The goal was not to create a decorative dashboard. The goal was to make a dense product surface easier to scan, safer to use, and more resilient when data was loading, partial, stale, or unavailable.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        body: [
          'Data-heavy interfaces fail when they treat every number, chart, filter, and table as equally important. Users need a clear hierarchy, predictable interaction states, and enough context to understand what changed before they decide what to do next.',
          'The dashboard also needed to support different user roles without turning the UI into a collection of one-off screens. That created a design and engineering constraint: the experience had to adapt to permissions while keeping the same mental model.',
        ],
        bullets: [
          'Important metrics needed to be visible without burying supporting details.',
          'Charts needed accessible labels, summaries, and non-color-only meaning.',
          'Loading, empty, error, and partial-data states needed first-class design.',
          'Role-specific views needed to share reusable UI patterns.',
          'The page needed to stay responsive and stable as panels updated.',
        ],
      },
      {
        id: 'approach',
        heading: 'Approach',
        body: [
          'I approached the work as a product interface system rather than a single dashboard page. The first step was to separate primary decision signals from secondary investigation details, then map those groups to reusable cards, chart panels, filters, and table patterns.',
          'Each module was designed around a stable state contract: loading, populated, filtered-empty, unavailable, and error. This reduced conditional rendering surprises and made the UI easier to reason about in code review.',
        ],
        bullets: [
          'Defined a scan-first page structure with summary cards before detailed panels.',
          'Separated display components from data-shaping logic to keep UI code maintainable.',
          'Used typed props and explicit state names so edge cases were visible in implementation.',
          'Kept filters, chart summaries, and table states consistent across role-based views.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Accessibility decisions',
        body: [
          'Analytics products often over-rely on visual chart interpretation. The case-study approach treated charts as one representation of data, not the only source of meaning.',
          'Where a visual pattern could hide meaning from keyboard or assistive-technology users, the interface provided text labels, summaries, or adjacent structured values. Interaction states were designed so users did not need to infer meaning from color alone.',
        ],
        bullets: [
          'Semantic headings kept the dashboard navigable by section.',
          'Chart panels included descriptive labels and supporting text where needed.',
          'Focus states, keyboard paths, and control labels remained visible and predictable.',
          'Empty and error states explained what happened and what the user could do next.',
        ],
      },
      {
        id: 'performance',
        heading: 'Performance and stability',
        body: [
          'The dashboard was structured to keep the initial decision layer lightweight. Expensive panels and secondary details were treated as progressive disclosure rather than required first paint content.',
          'The implementation avoided layout surprises by reserving stable regions for cards, tables, and chart containers. Data changes could update content without forcing the whole page to reflow around newly inserted UI.',
        ],
        bullets: [
          'Prioritized above-the-fold summary content before deep analysis panels.',
          'Kept component boundaries small enough to avoid unnecessary re-render cascades.',
          'Reserved space for dynamic states so loading and populated views remained stable.',
          'Reduced avoidable UI work in lists, cards, and chart-adjacent summaries.',
        ],
      },
      {
        id: 'seo',
        heading: 'Why this case study matters',
        body: [
          'This project demonstrates the kind of frontend engineering that matters for SaaS products: not only building screens, but shaping information architecture, accessibility, state handling, and performance into one coherent interface.',
          'For recruiters, engineering managers, and product teams, the important signal is the working method: clarify the decision task, design for real data states, build reusable UI primitives, and keep the product fast enough to use under pressure.',
        ],
      },
    ],
    outcomes: [
      'A clearer role-based dashboard structure for complex analytics workflows.',
      'Reusable UI patterns for summary cards, chart panels, filters, tables, and resilient states.',
      'Accessible data presentation patterns that did not depend on color or visuals alone.',
      'A more maintainable frontend foundation for future analytics modules.',
    ],
    nextSteps: [
      'Add approved screenshots or diagrams when confidentiality allows.',
      'Publish measured performance and adoption metrics only after they can be verified.',
      'Extend the pattern library for additional reporting and monitoring workflows.',
    ],
    relatedServices: [
      'Dashboard UI engineering',
      'SaaS frontend development',
      'Accessibility-focused UI',
      'Performance optimization',
    ],
  },
  es: {
    slug: 'analytics-command-center',
    title: 'Centro de control analítico',
    seoTitle: 'Caso de estudio de centro analítico | Dashboard React accesible',
    description:
      'Caso frontend anonimizado de un dashboard analítico por roles con gráficos accesibles, estados resilientes, rendimiento y arquitectura UI en React.',
    eyebrow: 'Caso de estudio · Trabajo interno de producto',
    summary:
      'Un dashboard analítico basado en roles, diseñado para que equipos de producto y operaciones revisen señales críticas, comparen tendencias y tomen decisiones con mayor rapidez sin depender de exportaciones frágiles ni pantallas de reporting sobrecargadas.',
    confidentialityNote:
      'Este caso de estudio está anonimizado. Se excluyen intencionalmente nombres de clientes, capturas, flujos propietarios, datasets privados y métricas exactas de negocio.',
    meta: [
      { label: 'Tipo de proyecto', value: 'Dashboard SaaS intensivo en datos' },
      { label: 'Rol', value: 'Arquitectura frontend e ingeniería UI' },
      {
        label: 'Enfoque principal',
        value: 'Accesibilidad, rendimiento y UX de datos',
      },
      {
        label: 'Área técnica',
        value: 'React, TypeScript, estado y flujos API',
      },
    ],
    tags: [
      'Dashboard React',
      'TypeScript',
      'Gráficos accesibles',
      'UX de datos',
      'UI basada en roles',
      'Core Web Vitals',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Contexto',
        body: [
          'El producto necesitaba un espacio analítico más claro para usuarios que dependían de datos cambiantes para tomar decisiones operativas. La experiencia existente distribuía información relacionada en vistas separadas, lo que ralentizaba las comparaciones y aumentaba la posibilidad de perder estados importantes.',
          'El objetivo no era crear un dashboard decorativo. El objetivo era hacer que una superficie de producto densa fuera más fácil de escanear, más segura de usar y más resiliente cuando los datos estuvieran cargando, incompletos, obsoletos o no disponibles.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problema',
        body: [
          'Las interfaces con muchos datos fallan cuando tratan cada número, gráfico, filtro y tabla como si tuviera la misma importancia. Los usuarios necesitan jerarquía clara, estados de interacción predecibles y contexto suficiente para entender qué cambió antes de decidir qué hacer.',
          'El dashboard también debía soportar distintos roles de usuario sin convertir la UI en una colección de pantallas aisladas. Eso creó una restricción de diseño e ingeniería: la experiencia debía adaptarse a permisos sin romper el mismo modelo mental.',
        ],
        bullets: [
          'Las métricas importantes debían ser visibles sin ocultar detalles de apoyo.',
          'Los gráficos necesitaban etiquetas, resúmenes y significado no dependiente solo del color.',
          'Los estados de carga, vacío, error y datos parciales necesitaban diseño propio.',
          'Las vistas por rol debían compartir patrones reutilizables de UI.',
          'La página debía mantenerse responsive y estable mientras los paneles se actualizaban.',
        ],
      },
      {
        id: 'approach',
        heading: 'Enfoque',
        body: [
          'Abordé el trabajo como un sistema de interfaz de producto, no como una única página de dashboard. El primer paso fue separar las señales principales de decisión de los detalles secundarios de investigación, y luego mapear esos grupos a tarjetas, paneles de gráficos, filtros y patrones de tabla reutilizables.',
          'Cada módulo se diseñó alrededor de un contrato de estado estable: cargando, con datos, vacío por filtro, no disponible y error. Esto redujo sorpresas en el renderizado condicional y facilitó razonar sobre la UI durante la revisión de código.',
        ],
        bullets: [
          'Definí una estructura escaneable con tarjetas resumen antes de los paneles de detalle.',
          'Separé componentes visuales de la lógica de transformación de datos.',
          'Usé props tipadas y nombres de estado explícitos para visibilizar casos límite.',
          'Mantuve filtros, resúmenes de gráficos y estados de tabla consistentes entre vistas por rol.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Decisiones de accesibilidad',
        body: [
          'Los productos analíticos suelen depender demasiado de la interpretación visual de gráficos. Este enfoque trató los gráficos como una representación de los datos, no como la única fuente de significado.',
          'Cuando un patrón visual podía ocultar significado para usuarios de teclado o tecnologías de asistencia, la interfaz ofrecía etiquetas, resúmenes o valores estructurados cercanos. Los estados de interacción se diseñaron para no depender solo del color.',
        ],
        bullets: [
          'Los encabezados semánticos mantuvieron el dashboard navegable por secciones.',
          'Los paneles de gráficos incluyeron etiquetas descriptivas y texto de apoyo cuando era necesario.',
          'Los estados de foco, rutas de teclado y etiquetas de controles permanecieron visibles y predecibles.',
          'Los estados vacíos y de error explicaban qué ocurrió y qué podía hacer el usuario después.',
        ],
      },
      {
        id: 'performance',
        heading: 'Rendimiento y estabilidad',
        body: [
          'El dashboard se estructuró para mantener ligera la capa inicial de decisión. Los paneles costosos y detalles secundarios se trataron como divulgación progresiva, no como contenido obligatorio del primer render.',
          'La implementación evitó sorpresas de layout reservando regiones estables para tarjetas, tablas y contenedores de gráficos. Los cambios de datos podían actualizar contenido sin obligar a toda la página a reacomodarse alrededor de UI insertada tarde.',
        ],
        bullets: [
          'Priorización del contenido resumen above-the-fold antes de paneles de análisis profundo.',
          'Límites de componente suficientemente pequeños para evitar cascadas de render innecesarias.',
          'Espacio reservado para estados dinámicos, manteniendo estables carga y vista poblada.',
          'Reducción de trabajo de UI evitable en listas, tarjetas y resúmenes junto a gráficos.',
        ],
      },
      {
        id: 'seo',
        heading: 'Por qué importa este caso',
        body: [
          'Este proyecto muestra el tipo de ingeniería frontend que importa en productos SaaS: no solo construir pantallas, sino unir arquitectura de información, accesibilidad, manejo de estado y rendimiento en una interfaz coherente.',
          'Para reclutadores, engineering managers y equipos de producto, la señal importante es el método de trabajo: aclarar la tarea de decisión, diseñar para estados reales de datos, construir primitivas reutilizables y mantener el producto suficientemente rápido para usarse bajo presión.',
        ],
      },
    ],
    outcomes: [
      'Una estructura de dashboard basada en roles más clara para flujos analíticos complejos.',
      'Patrones reutilizables para tarjetas resumen, paneles de gráficos, filtros, tablas y estados resilientes.',
      'Patrones accesibles de presentación de datos que no dependían solo del color o lo visual.',
      'Una base frontend más mantenible para futuros módulos analíticos.',
    ],
    nextSteps: [
      'Añadir capturas o diagramas aprobados cuando la confidencialidad lo permita.',
      'Publicar métricas medidas de rendimiento y adopción solo cuando puedan verificarse.',
      'Extender la biblioteca de patrones para flujos adicionales de reporting y monitorización.',
    ],
    relatedServices: [
      'Ingeniería de UI para paneles',
      'Desarrollo frontend SaaS',
      'UI centrada en accesibilidad',
      'Optimización de rendimiento',
    ],
  },
  ar: {
    slug: 'analytics-command-center',
    title: 'مركز تحكم للتحليلات',
    seoTitle: 'دراسة حالة لمركز تحكم تحليلي | هندسة واجهات لوحات React',
    description:
      'دراسة حالة Frontend مجهولة للوحة تحليلات قائمة على الأدوار، مع رسوم متاحة، حالات بيانات مرنة، أداء قوي، ومعمارية UI باستخدام React.',
    eyebrow: 'دراسة حالة · عمل داخلي على المنتج',
    summary:
      'لوحة تحليلات قائمة على الأدوار صُممت لمساعدة فرق المنتج والعمليات على مراجعة الإشارات المهمة، ومقارنة الاتجاهات، واتخاذ قرارات أسرع دون الاعتماد على تصديرات هشة أو شاشات تقارير مزدحمة.',
    confidentialityNote:
      'دراسة الحالة هذه مجهولة. تُستبعد عمدًا أسماء العملاء، ولقطات الشاشة، وسير العمل الخاص، ومجموعات البيانات الخاصة، والمقاييس التجارية الدقيقة.',
    meta: [
      { label: 'نوع المشروع', value: 'لوحة SaaS كثيفة البيانات' },
      { label: 'الدور', value: 'معمارية Frontend وهندسة UI' },
      {
        label: 'التركيز الأساسي',
        value: 'إمكانية الوصول، الأداء، وتجربة البيانات',
      },
      {
        label: 'النطاق التقني',
        value: 'React وTypeScript وحالة الواجهة وتدفقات API',
      },
    ],
    tags: [
      'لوحة React',
      'TypeScript',
      'رسوم بيانية متاحة',
      'تجربة البيانات',
      'واجهة قائمة على الأدوار',
      'Core Web Vitals',
    ],
    sections: [
      {
        id: 'context',
        heading: 'السياق',
        body: [
          'كان المنتج يحتاج إلى مساحة تحليلات أوضح للمستخدمين الذين يعتمدون على بيانات متغيرة لاتخاذ قرارات تشغيلية. كانت التجربة السابقة توزع المعلومات المرتبطة عبر مشاهد منفصلة، مما جعل المقارنة أبطأ وزاد احتمال تفويت حالات مهمة.',
          'لم يكن الهدف إنشاء لوحة زخرفية. كان الهدف جعل سطح منتج كثيف أسهل في المسح البصري، وأكثر أمانًا في الاستخدام، وأكثر مرونة عندما تكون البيانات قيد التحميل أو جزئية أو قديمة أو غير متاحة.',
        ],
      },
      {
        id: 'problem',
        heading: 'المشكلة',
        body: [
          'تفشل الواجهات كثيفة البيانات عندما تتعامل مع كل رقم ورسم وفلتر وجدول كأن له الأهمية نفسها. يحتاج المستخدمون إلى هرمية واضحة، وحالات تفاعل متوقعة، وسياق كافٍ لفهم ما تغيّر قبل تحديد الإجراء التالي.',
          'كان على اللوحة أيضًا دعم أدوار مستخدم مختلفة دون تحويل الواجهة إلى مجموعة شاشات منفصلة. خلق ذلك قيدًا تصميميًا وهندسيًا: يجب أن تتكيف التجربة مع الصلاحيات مع الحفاظ على نموذج ذهني واحد.',
        ],
        bullets: [
          'كان يجب إظهار المقاييس المهمة دون دفن التفاصيل الداعمة.',
          'احتاجت الرسوم البيانية إلى تسميات وملخصات ومعنى لا يعتمد على اللون وحده.',
          'احتاجت حالات التحميل والفراغ والخطأ والبيانات الجزئية إلى تصميم واضح.',
          'كان يجب أن تشترك مشاهد الأدوار في أنماط UI قابلة لإعادة الاستخدام.',
          'كان يجب أن تبقى الصفحة متجاوبة ومستقرة أثناء تحديث اللوحات.',
        ],
      },
      {
        id: 'approach',
        heading: 'النهج',
        body: [
          'تعاملت مع العمل كنظام واجهة منتج، وليس كصفحة لوحة واحدة. كانت الخطوة الأولى فصل إشارات القرار الأساسية عن تفاصيل الاستكشاف الثانوية، ثم تحويل هذه المجموعات إلى بطاقات ولوحات رسوم وفلاتر وجداول قابلة لإعادة الاستخدام.',
          'صُمم كل مكوّن حول عقد حالة مستقر: تحميل، بيانات موجودة، فراغ بسبب الفلترة، غير متاح، وخطأ. قلل ذلك مفاجآت العرض الشرطي وجعل مراجعة الكود أوضح.',
        ],
        bullets: [
          'تعريف بنية سهلة المسح تبدأ ببطاقات ملخص قبل لوحات التفاصيل.',
          'فصل مكونات العرض عن منطق تشكيل البيانات للحفاظ على قابلية الصيانة.',
          'استخدام خصائص typed وأسماء حالات صريحة لإظهار الحالات الحدية في التنفيذ.',
          'الحفاظ على اتساق الفلاتر وملخصات الرسوم وحالات الجداول عبر مشاهد الأدوار.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'قرارات إمكانية الوصول',
        body: [
          'تعتمد منتجات التحليلات كثيرًا على تفسير الرسوم بصريًا. تعامل هذا النهج مع الرسوم البيانية كتمثيل واحد للبيانات، لا كمصدر المعنى الوحيد.',
          'عندما كان النمط البصري قد يخفي المعنى عن مستخدمي لوحة المفاتيح أو التقنيات المساعدة، وفرت الواجهة تسميات أو ملخصات أو قيمًا منظمة قريبة. وصُممت حالات التفاعل بحيث لا يحتاج المستخدم إلى استنتاج المعنى من اللون فقط.',
        ],
        bullets: [
          'حافظت العناوين الدلالية على قابلية التنقل داخل اللوحة حسب الأقسام.',
          'تضمنت لوحات الرسوم تسميات وصفية ونصًا داعمًا عند الحاجة.',
          'بقيت حالات التركيز ومسارات لوحة المفاتيح وتسميات عناصر التحكم واضحة ومتوقعة.',
          'شرحت حالات الفراغ والخطأ ما حدث وما يمكن للمستخدم فعله بعد ذلك.',
        ],
      },
      {
        id: 'performance',
        heading: 'الأداء والاستقرار',
        body: [
          'نُظمت اللوحة لإبقاء طبقة القرار الأولى خفيفة. عوملت اللوحات المكلفة والتفاصيل الثانوية كتدرج في الكشف، لا كمحتوى إلزامي في أول رسم للصفحة.',
          'تجنّب التنفيذ مفاجآت التخطيط عبر حجز مناطق مستقرة للبطاقات والجداول وحاويات الرسوم. وبذلك يمكن لتغيرات البيانات تحديث المحتوى دون إجبار الصفحة كلها على إعادة التموضع حول واجهة تُدرج متأخرًا.',
        ],
        bullets: [
          'إعطاء أولوية لمحتوى الملخص الظاهر أولًا قبل لوحات التحليل العميق.',
          'إبقاء حدود المكونات صغيرة بما يكفي لتجنب سلاسل render غير ضرورية.',
          'حجز مساحة للحالات الديناميكية حتى تبقى حالتا التحميل والبيانات مستقرتين.',
          'تقليل عمل UI غير الضروري في القوائم والبطاقات والملخصات القريبة من الرسوم.',
        ],
      },
      {
        id: 'seo',
        heading: 'لماذا تهم هذه الدراسة',
        body: [
          'يوضح هذا المشروع نوع هندسة الواجهات الأمامية المهم في منتجات SaaS: ليس بناء الشاشات فقط، بل دمج معمارية المعلومات وإمكانية الوصول وإدارة الحالة والأداء في واجهة واحدة متماسكة.',
          'بالنسبة لمسؤولي التوظيف ومديري الهندسة وفرق المنتج، الإشارة المهمة هي طريقة العمل: توضيح مهمة القرار، التصميم لحالات بيانات حقيقية، بناء وحدات UI قابلة لإعادة الاستخدام، والحفاظ على سرعة المنتج تحت الضغط.',
        ],
      },
    ],
    outcomes: [
      'بنية لوحة أوضح قائمة على الأدوار لتدفقات تحليلات معقدة.',
      'أنماط UI قابلة لإعادة الاستخدام لبطاقات الملخص ولوحات الرسوم والفلاتر والجداول والحالات المرنة.',
      'أنماط عرض بيانات متاحة لا تعتمد على اللون أو الشكل البصري وحده.',
      'أساس Frontend أكثر قابلية للصيانة لموديلات تحليلات مستقبلية.',
    ],
    nextSteps: [
      'إضافة لقطات أو مخططات معتمدة عندما تسمح السرية بذلك.',
      'نشر مقاييس أداء واستخدام مقاسة فقط بعد إمكانية التحقق منها.',
      'توسيع مكتبة الأنماط لتدفقات إضافية في التقارير والمراقبة.',
    ],
    relatedServices: [
      'هندسة واجهات لوحات البيانات',
      'تطوير واجهات SaaS',
      'واجهات تركز على إمكانية الوصول',
      'تحسين الأداء',
    ],
  },
};

const designSystemUplift: Record<Locale, CaseStudyBase> = {
  en: {
    slug: 'design-system-uplift',
    title: 'Design system uplift',
    seoTitle: 'Design System Uplift Case Study | Scalable React UI',
    description:
      'An anonymized frontend case study about improving a design system with reusable React components, clearer tokens, accessibility, and scalable UI governance.',
    eyebrow: 'Case study · Internal product work',
    summary:
      'A design system improvement effort focused on reducing UI drift, making shared components easier to adopt, and giving teams a more reliable foundation for building consistent product interfaces.',
    confidentialityNote:
      'This case study is anonymized. Client names, screenshots, proprietary workflows, private component APIs, and internal adoption data are intentionally excluded.',
    meta: [
      { label: 'Project type', value: 'Design system modernization' },
      { label: 'Role', value: 'Frontend component architecture' },
      { label: 'Primary focus', value: 'Consistency, accessibility, reuse' },
      { label: 'Stack area', value: 'React, TypeScript, tokens and UI states' },
    ],
    tags: [
      'Design systems',
      'React components',
      'TypeScript',
      'Accessibility',
      'Design tokens',
      'UI governance',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Context',
        body: [
          'The product had grown across multiple teams and feature areas, but the interface patterns had not stayed fully aligned. Similar buttons, cards, forms, and layout primitives behaved differently depending on where they were implemented.',
          'The work was not a cosmetic refresh. The goal was to create a stronger frontend foundation so teams could ship UI faster without introducing new inconsistencies, accessibility regressions, or duplicated component logic.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        body: [
          'A design system loses value when teams cannot trust it. If components are hard to extend, unclear in edge cases, or disconnected from product needs, engineers eventually bypass the system and rebuild local variants.',
          'The product needed a shared component layer that handled real interaction states, responsive behavior, accessible markup, and visual consistency without forcing every feature team to solve the same UI problems again.',
        ],
        bullets: [
          'Repeated UI patterns existed with small but costly behavior differences.',
          'Component APIs needed clearer boundaries and typed usage contracts.',
          'Design tokens needed to support consistent spacing, color, and typography decisions.',
          'Form, focus, loading, empty, disabled, and error states needed predictable defaults.',
          'Documentation needed to explain when and how to use each pattern.',
        ],
      },
      {
        id: 'approach',
        heading: 'Approach',
        body: [
          'I treated the design system as product infrastructure, not a gallery of components. The first step was to identify repeated patterns that carried real product risk: forms, buttons, cards, layouts, feedback states, and navigation elements.',
          'Each component was shaped around a stable contract: what it renders, what states it owns, what should remain composable, and which decisions belong to product screens instead of the shared layer.',
        ],
        bullets: [
          'Audited repeated UI patterns and grouped them by product intent.',
          'Refined reusable components around typed props and explicit state variants.',
          'Kept layout primitives flexible while making core interaction states consistent.',
          'Aligned tokens with implementation constraints instead of treating them as static design values.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Accessibility decisions',
        body: [
          'Shared components are a high-leverage place to improve accessibility because one strong pattern can prevent many repeated defects. The uplift prioritized semantic HTML, visible focus, keyboard behavior, and clear labeling.',
          'The system avoided hiding accessibility decisions inside visual styling alone. Components exposed the props and structure needed for product teams to provide meaningful labels, descriptions, and status messages.',
        ],
        bullets: [
          'Interactive components used semantic elements before custom behavior.',
          'Focus-visible styles stayed consistent across themes and states.',
          'Form controls supported labels, descriptions, validation text, and disabled states.',
          'Color was not the only signal for destructive, warning, selected, or error states.',
        ],
      },
      {
        id: 'performance',
        heading: 'Performance and maintainability',
        body: [
          'A design system should reduce frontend work, not add runtime cost. The implementation focused on small components, predictable composition, and avoiding abstractions that made screens harder to optimize.',
          'The uplift also reduced maintenance risk by making edge cases visible in component APIs and docs. Engineers could see supported variants instead of reverse-engineering local implementation details.',
        ],
        bullets: [
          'Kept shared components focused enough to avoid heavy all-purpose APIs.',
          'Separated styling tokens from product data and business logic.',
          'Reduced duplicated UI code by moving repeated states into shared primitives.',
          'Made responsive and theme behavior predictable across component families.',
        ],
      },
      {
        id: 'seo',
        heading: 'Why this case study matters',
        body: [
          'This project demonstrates frontend engineering beyond page implementation: component architecture, accessibility, collaboration with design, and maintainable UI systems that help product teams move faster.',
          'For engineering managers and product teams, the key signal is the method: identify repeated product patterns, define reliable contracts, document real usage, and build components that make the correct implementation easier than the inconsistent one.',
        ],
      },
    ],
    outcomes: [
      'A clearer shared component foundation for product teams working across related UI surfaces.',
      'More consistent handling of core states such as loading, disabled, validation, empty, and error.',
      'Improved accessibility defaults in reusable patterns instead of one-off screen fixes.',
      'A more maintainable frontend system for future feature work and design iteration.',
    ],
    nextSteps: [
      'Add approved component screenshots or diagrams when confidentiality allows.',
      'Publish adoption or defect-reduction metrics only after they can be verified.',
      'Continue expanding documentation around usage guidance, anti-patterns, and migration paths.',
    ],
    relatedServices: [
      'Design system engineering',
      'React component architecture',
      'Accessibility-focused UI',
      'Frontend maintainability',
    ],
  },
  es: {
    slug: 'design-system-uplift',
    title: 'Mejora del sistema de diseño',
    seoTitle: 'Caso de sistema de diseño | UI React escalable',
    description:
      'Caso frontend anonimizado sobre mejora de un sistema de diseño con componentes React reutilizables, tokens claros, accesibilidad y gobierno UI.',
    eyebrow: 'Caso de estudio · Trabajo interno de producto',
    summary:
      'Una mejora del sistema de diseño enfocada en reducir divergencias de UI, facilitar la adopción de componentes compartidos y dar a los equipos una base más fiable para construir interfaces consistentes.',
    confidentialityNote:
      'Este caso de estudio está anonimizado. Se excluyen nombres de clientes, capturas, flujos propietarios, APIs privadas de componentes y datos internos de adopción.',
    meta: [
      {
        label: 'Tipo de proyecto',
        value: 'Modernización de sistema de diseño',
      },
      { label: 'Rol', value: 'Arquitectura frontend de componentes' },
      {
        label: 'Enfoque principal',
        value: 'Consistencia, accesibilidad y reutilización',
      },
      {
        label: 'Área técnica',
        value: 'React, TypeScript, tokens y estados UI',
      },
    ],
    tags: [
      'Sistemas de diseño',
      'Componentes React',
      'TypeScript',
      'Accesibilidad',
      'Tokens de diseño',
      'Gobierno UI',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Contexto',
        body: [
          'El producto había crecido entre varios equipos y áreas funcionales, pero los patrones de interfaz no se habían mantenido completamente alineados. Botones, tarjetas, formularios y primitivas de layout similares se comportaban de forma distinta según dónde se implementaban.',
          'El trabajo no era un rediseño visual. El objetivo era crear una base frontend más sólida para que los equipos pudieran entregar UI con mayor rapidez sin añadir nuevas inconsistencias, regresiones de accesibilidad o lógica duplicada.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problema',
        body: [
          'Un sistema de diseño pierde valor cuando los equipos no pueden confiar en él. Si los componentes son difíciles de extender, poco claros en casos límite o desconectados de necesidades reales del producto, los equipos terminan creando variantes locales.',
          'El producto necesitaba una capa compartida de componentes que resolviera estados reales de interacción, comportamiento responsive, marcado accesible y consistencia visual sin obligar a cada equipo a resolver los mismos problemas de UI otra vez.',
        ],
        bullets: [
          'Existían patrones repetidos con pequeñas diferencias de comportamiento.',
          'Las APIs de componentes necesitaban límites más claros y contratos tipados.',
          'Los tokens debían sostener decisiones consistentes de espaciado, color y tipografía.',
          'Los estados de formulario, foco, carga, vacío, deshabilitado y error necesitaban defaults predecibles.',
          'La documentación debía explicar cuándo y cómo usar cada patrón.',
        ],
      },
      {
        id: 'approach',
        heading: 'Enfoque',
        body: [
          'Traté el sistema de diseño como infraestructura de producto, no como una galería de componentes. El primer paso fue identificar patrones repetidos con riesgo real: formularios, botones, tarjetas, layouts, feedback y navegación.',
          'Cada componente se definió alrededor de un contrato estable: qué renderiza, qué estados controla, qué debe seguir siendo componible y qué decisiones pertenecen a las pantallas de producto.',
        ],
        bullets: [
          'Audité patrones repetidos y los agrupé por intención de producto.',
          'Refiné componentes reutilizables con props tipadas y variantes explícitas.',
          'Mantuve flexibles las primitivas de layout y consistentes los estados de interacción.',
          'Alineé tokens con restricciones de implementación, no solo con valores visuales estáticos.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Decisiones de accesibilidad',
        body: [
          'Los componentes compartidos son un punto de alto impacto para mejorar accesibilidad porque un patrón fuerte evita muchos defectos repetidos. La mejora priorizó HTML semántico, foco visible, teclado y etiquetado claro.',
          'El sistema evitó ocultar decisiones de accesibilidad únicamente en estilos visuales. Los componentes expusieron estructura y props para que los equipos pudieran aportar etiquetas, descripciones y mensajes de estado significativos.',
        ],
        bullets: [
          'Los componentes interactivos usaron elementos semánticos antes que comportamiento custom.',
          'Los estilos de foco visible se mantuvieron consistentes entre temas y estados.',
          'Los controles de formulario soportaron etiquetas, descripciones, validación y estados deshabilitados.',
          'El color no fue la única señal para estados destructivos, de alerta, selección o error.',
        ],
      },
      {
        id: 'performance',
        heading: 'Rendimiento y mantenibilidad',
        body: [
          'Un sistema de diseño debe reducir trabajo frontend, no añadir coste en runtime. La implementación se enfocó en componentes pequeños, composición predecible y evitar abstracciones que dificultaran optimizar pantallas.',
          'La mejora también redujo riesgo de mantenimiento al hacer visibles los casos límite en APIs y documentación. Los equipos podían ver variantes soportadas sin investigar detalles internos de implementaciones locales.',
        ],
        bullets: [
          'Componentes compartidos acotados para evitar APIs genéricas demasiado pesadas.',
          'Separación entre tokens de estilo, datos de producto y lógica de negocio.',
          'Reducción de código UI duplicado moviendo estados repetidos a primitivas compartidas.',
          'Comportamiento responsive y de tema más predecible entre familias de componentes.',
        ],
      },
      {
        id: 'seo',
        heading: 'Por qué importa este caso',
        body: [
          'Este proyecto muestra ingeniería frontend más allá de implementar páginas: arquitectura de componentes, accesibilidad, colaboración con diseño y sistemas UI mantenibles que ayudan a los equipos a avanzar más rápido.',
          'Para managers de ingeniería y equipos de producto, la señal clave es el método: identificar patrones repetidos, definir contratos fiables, documentar usos reales y construir componentes que hagan más fácil la implementación correcta.',
        ],
      },
    ],
    outcomes: [
      'Una base de componentes compartidos más clara para equipos trabajando en superficies de UI relacionadas.',
      'Manejo más consistente de estados como carga, deshabilitado, validación, vacío y error.',
      'Mejores defaults de accesibilidad en patrones reutilizables en lugar de arreglos aislados.',
      'Un sistema frontend más mantenible para futuras funcionalidades e iteraciones de diseño.',
    ],
    nextSteps: [
      'Añadir capturas o diagramas aprobados cuando la confidencialidad lo permita.',
      'Publicar métricas de adopción o reducción de defectos solo cuando puedan verificarse.',
      'Ampliar documentación con guías de uso, anti-patrones y rutas de migración.',
    ],
    relatedServices: [
      'Ingeniería de sistemas de diseño',
      'Arquitectura de componentes React',
      'UI centrada en accesibilidad',
      'Mantenibilidad frontend',
    ],
  },
  ar: {
    slug: 'design-system-uplift',
    title: 'تحسين نظام التصميم',
    seoTitle: 'دراسة نظام تصميم | واجهات React قابلة للتوسع',
    description:
      'دراسة حالة Frontend مجهولة حول تحسين نظام تصميم بمكونات React قابلة لإعادة الاستخدام، وتوكنات أوضح، وإتاحة، وحوكمة UI.',
    eyebrow: 'دراسة حالة · عمل داخلي على المنتج',
    summary:
      'جهد لتحسين نظام التصميم بهدف تقليل تباين الواجهات، وتسهيل اعتماد المكونات المشتركة، ومنح الفرق أساسًا أكثر موثوقية لبناء واجهات منتج متسقة.',
    confidentialityNote:
      'دراسة الحالة هذه مجهولة. تُستبعد أسماء العملاء، ولقطات الشاشة، وسير العمل الخاص، وواجهات المكونات الخاصة، وبيانات الاعتماد الداخلية عمدًا.',
    meta: [
      { label: 'نوع المشروع', value: 'تحديث نظام تصميم' },
      { label: 'الدور', value: 'معمارية مكونات Frontend' },
      { label: 'التركيز الأساسي', value: 'الاتساق، الإتاحة، وإعادة الاستخدام' },
      {
        label: 'النطاق التقني',
        value: 'React وTypeScript والتوكنات وحالات UI',
      },
    ],
    tags: [
      'أنظمة التصميم',
      'مكونات React',
      'TypeScript',
      'إمكانية الوصول',
      'توكنات التصميم',
      'حوكمة UI',
    ],
    sections: [
      {
        id: 'context',
        heading: 'السياق',
        body: [
          'كان المنتج قد توسع عبر عدة فرق ومناطق وظيفية، لكن أنماط الواجهة لم تبقَ متوافقة بالكامل. أزرار وبطاقات ونماذج وعناصر تخطيط متشابهة كانت تتصرف بطرق مختلفة حسب مكان تنفيذها.',
          'لم يكن العمل تحديثًا بصريًا فقط. كان الهدف إنشاء أساس Frontend أقوى حتى تستطيع الفرق تسليم الواجهات بسرعة أكبر دون إضافة تناقضات جديدة أو تراجعات في الإتاحة أو منطق مكونات مكرر.',
        ],
      },
      {
        id: 'problem',
        heading: 'المشكلة',
        body: [
          'يفقد نظام التصميم قيمته عندما لا تستطيع الفرق الوثوق به. إذا كانت المكونات صعبة التوسيع أو غير واضحة في الحالات الحدية أو بعيدة عن احتياجات المنتج، تبدأ الفرق ببناء نسخ محلية.',
          'احتاج المنتج إلى طبقة مكونات مشتركة تتعامل مع حالات التفاعل الحقيقية، والاستجابة للشاشات، والترميز المتاح، والاتساق البصري دون أن يحل كل فريق المشكلات نفسها من جديد.',
        ],
        bullets: [
          'كانت هناك أنماط UI متكررة مع اختلافات صغيرة لكنها مكلفة في السلوك.',
          'احتاجت APIs المكونات إلى حدود أوضح وعقود استخدام typed.',
          'احتاجت التوكنات إلى دعم قرارات متسقة في المسافات والألوان والطباعة.',
          'احتاجت حالات النماذج والتركيز والتحميل والفراغ والتعطيل والخطأ إلى defaults واضحة.',
          'احتاجت الوثائق إلى شرح متى وكيف يُستخدم كل نمط.',
        ],
      },
      {
        id: 'approach',
        heading: 'النهج',
        body: [
          'تعاملت مع نظام التصميم كبنية تحتية للمنتج، وليس كمعرض مكونات. كانت الخطوة الأولى تحديد الأنماط المتكررة التي تحمل مخاطرة حقيقية: النماذج، الأزرار، البطاقات، التخطيطات، حالات التغذية الراجعة، والتنقل.',
          'صُمم كل مكوّن حول عقد مستقر: ما الذي يعرضه، وما الحالات التي يملكها، وما الذي يجب أن يبقى قابلاً للتركيب، وما القرارات التي تخص شاشات المنتج بدل الطبقة المشتركة.',
        ],
        bullets: [
          'تدقيق أنماط UI المتكررة وتجميعها حسب هدف المنتج.',
          'تحسين المكونات القابلة لإعادة الاستخدام باستخدام props typed وحالات صريحة.',
          'الحفاظ على مرونة عناصر التخطيط مع توحيد حالات التفاعل الأساسية.',
          'مواءمة التوكنات مع قيود التنفيذ بدل اعتبارها قيمًا تصميمية ثابتة فقط.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'قرارات إمكانية الوصول',
        body: [
          'المكونات المشتركة نقطة ذات تأثير عالٍ لتحسين الإتاحة، لأن نمطًا قويًا واحدًا يمنع عيوبًا كثيرة متكررة. أعطى التحسين أولوية لـ HTML الدلالي، والتركيز المرئي، وسلوك لوحة المفاتيح، والتسميات الواضحة.',
          'لم يخفِ النظام قرارات الإتاحة داخل التنسيق البصري فقط. وفرت المكونات البنية والخصائص اللازمة كي تضيف فرق المنتج تسميات وأوصافًا ورسائل حالة ذات معنى.',
        ],
        bullets: [
          'استخدمت المكونات التفاعلية عناصر دلالية قبل السلوك المخصص.',
          'بقيت أنماط focus-visible متسقة عبر السمات والحالات.',
          'دعمت عناصر النماذج التسميات والأوصاف ونصوص التحقق وحالات التعطيل.',
          'لم يكن اللون الإشارة الوحيدة لحالات الحذف أو التحذير أو التحديد أو الخطأ.',
        ],
      },
      {
        id: 'performance',
        heading: 'الأداء وقابلية الصيانة',
        body: [
          'يجب أن يقلل نظام التصميم عمل Frontend، لا أن يضيف تكلفة تشغيلية. ركز التنفيذ على مكونات صغيرة، وتركيب متوقع، وتجنب تجريدات تجعل الشاشات أصعب في التحسين.',
          'قلل التحسين أيضًا مخاطر الصيانة عبر جعل الحالات الحدية واضحة في APIs والوثائق. استطاع المهندسون رؤية الأنماط المدعومة بدل تفكيك تفاصيل تنفيذ محلية.',
        ],
        bullets: [
          'إبقاء المكونات المشتركة مركزة لتجنب APIs عامة وثقيلة.',
          'فصل توكنات التنسيق عن بيانات المنتج ومنطق الأعمال.',
          'تقليل كود UI المكرر بنقل الحالات المتكررة إلى primitives مشتركة.',
          'جعل سلوك الاستجابة والسمات أكثر توقعًا عبر عائلات المكونات.',
        ],
      },
      {
        id: 'seo',
        heading: 'لماذا تهم هذه الدراسة',
        body: [
          'يوضح هذا المشروع هندسة Frontend تتجاوز تنفيذ الصفحات: معمارية المكونات، والإتاحة، والتعاون مع التصميم، وأنظمة UI قابلة للصيانة تساعد فرق المنتج على التحرك بسرعة أكبر.',
          'بالنسبة لمديري الهندسة وفرق المنتج، الإشارة الأساسية هي طريقة العمل: تحديد الأنماط المتكررة، تعريف عقود موثوقة، توثيق الاستخدام الحقيقي، وبناء مكونات تجعل التنفيذ الصحيح أسهل من النسخ غير المتسقة.',
        ],
      },
    ],
    outcomes: [
      'أساس أوضح للمكونات المشتركة لفرق تعمل على واجهات منتج مترابطة.',
      'تعامل أكثر اتساقًا مع حالات مثل التحميل والتعطيل والتحقق والفراغ والخطأ.',
      'إعدادات إتاحة أفضل داخل الأنماط القابلة لإعادة الاستخدام بدل إصلاحات شاشة منفصلة.',
      'نظام Frontend أكثر قابلية للصيانة للميزات المستقبلية وتكرارات التصميم.',
    ],
    nextSteps: [
      'إضافة لقطات أو مخططات معتمدة عندما تسمح السرية بذلك.',
      'نشر مقاييس الاعتماد أو تقليل العيوب فقط بعد إمكانية التحقق منها.',
      'توسيع الوثائق حول إرشادات الاستخدام والأنماط الخاطئة ومسارات الترحيل.',
    ],
    relatedServices: [
      'هندسة أنظمة التصميم',
      'معمارية مكونات React',
      'واجهات تركز على إمكانية الوصول',
      'قابلية صيانة Frontend',
    ],
  },
};

const performanceModernization: Record<Locale, CaseStudyBase> = {
  en: {
    slug: 'performance-modernization',
    title: 'Performance modernization',
    seoTitle: 'Performance Modernization Case Study | Core Web Vitals',
    description:
      'An anonymized frontend case study about improving perceived speed, rendering stability, asset delivery, and Core Web Vitals for a complex product UI.',
    eyebrow: 'Case study · Internal product work',
    summary:
      'A frontend modernization effort focused on making a complex product interface feel faster, load more predictably, and remain stable as users moved through data-heavy screens.',
    confidentialityNote:
      'This case study is anonymized. Client names, screenshots, private routes, proprietary measurements, and exact performance metrics are intentionally excluded.',
    meta: [
      { label: 'Project type', value: 'Frontend performance modernization' },
      { label: 'Role', value: 'Performance-focused UI engineering' },
      { label: 'Primary focus', value: 'Speed, stability, rendering cost' },
      {
        label: 'Stack area',
        value: 'Assets, routing, React rendering and UX states',
      },
    ],
    tags: [
      'Core Web Vitals',
      'Frontend performance',
      'Rendering optimization',
      'Asset strategy',
      'React',
      'UX stability',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Context',
        body: [
          'The product interface had accumulated performance pressure over time. More screens, richer UI states, heavier assets, and deeper data flows made the experience feel slower than the product value justified.',
          'The goal was not to chase a single synthetic score. The goal was to improve the parts of performance users actually feel: faster meaningful content, fewer layout jumps, smoother interactions, and clearer loading behavior.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        body: [
          'Performance issues in mature frontend products usually come from many small costs stacking together. Images, scripts, re-rendering, routing boundaries, state updates, and layout shifts can each look acceptable in isolation while the combined experience feels heavy.',
          'The UI also needed to stay understandable while data loaded. A fast blank screen is not useful; users need progressive content, stable placeholders, and clear states when information is delayed or unavailable.',
        ],
        bullets: [
          'Initial screens needed clearer prioritization of above-the-fold content.',
          'Large assets and secondary UI needed better loading strategy.',
          'Dynamic content needed reserved space to reduce layout movement.',
          'Component updates needed tighter boundaries to avoid unnecessary rendering work.',
          'Loading and unavailable states needed to communicate progress without visual noise.',
        ],
      },
      {
        id: 'approach',
        heading: 'Approach',
        body: [
          'I approached the work as a performance budget across the whole user path rather than a single page audit. The first step was to separate critical content from secondary detail and make the initial path lighter.',
          'The implementation focused on predictable rendering, stable layout regions, clearer asset decisions, and UI states that helped users understand progress without introducing additional motion or reflow.',
        ],
        bullets: [
          'Prioritized meaningful content and reduced avoidable work before first interaction.',
          'Reviewed component boundaries so frequent state changes stayed localized.',
          'Reserved dimensions for dynamic panels, media, and content blocks.',
          'Separated critical UI from secondary detail that could load later.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Accessibility decisions',
        body: [
          'Performance and accessibility were treated as connected concerns. A page that shifts unexpectedly, hides focus, or loads controls without context creates friction for keyboard and assistive-technology users.',
          'The modernization kept loading states understandable, preserved focus behavior, and avoided visual-only progress indicators when users needed actual status or next-step guidance.',
        ],
        bullets: [
          'Loading and error states used readable text, not only animation or color.',
          'Stable layout regions reduced unexpected movement during interaction.',
          'Keyboard focus remained visible and predictable as content updated.',
          'Reduced-motion preferences were respected where motion was not essential.',
        ],
      },
      {
        id: 'performance',
        heading: 'Performance and stability',
        body: [
          'The most valuable improvements came from reducing unnecessary frontend work and making the page structure more predictable. This included reviewing asset priority, render boundaries, dynamic state handling, and layout reservations.',
          'The work also made performance easier to maintain by turning implicit expectations into implementation patterns. New UI could follow the same principles instead of repeating earlier cost accumulation.',
        ],
        bullets: [
          'Improved asset prioritization for critical versus secondary content.',
          'Reduced avoidable render cascades in frequently updated interface regions.',
          'Kept skeletons and populated states aligned to avoid layout shifts.',
          'Used progressive disclosure for heavy sections that were not needed immediately.',
        ],
      },
      {
        id: 'seo',
        heading: 'Why this case study matters',
        body: [
          'This project demonstrates the practical side of frontend performance: not only tooling and metrics, but user-path decisions, rendering architecture, resilient states, and maintainable constraints.',
          'For product teams, the key signal is that performance is designed into the interface. It is shaped through content priority, component boundaries, asset strategy, accessibility, and the discipline to keep future UI from becoming expensive by default.',
        ],
      },
    ],
    outcomes: [
      'A more predictable frontend experience across complex and data-heavy UI paths.',
      'Clearer prioritization of critical content, secondary panels, and deferred detail.',
      'More stable loading patterns that reduced avoidable layout movement.',
      'A maintainable performance approach teams could reuse in future feature work.',
    ],
    nextSteps: [
      'Publish exact Core Web Vitals and before-after measurements only after they can be verified.',
      'Add approved diagrams showing the performance decision model when confidentiality allows.',
      'Continue applying the same performance budget to new product surfaces.',
    ],
    relatedServices: [
      'Performance optimization',
      'Core Web Vitals improvement',
      'React rendering optimization',
      'Frontend architecture review',
    ],
  },
  es: {
    slug: 'performance-modernization',
    title: 'Modernización de rendimiento',
    seoTitle: 'Caso de modernización de rendimiento | Core Web Vitals',
    description:
      'Caso frontend anonimizado sobre velocidad percibida, estabilidad de render, entrega de activos y Core Web Vitals en una UI de producto compleja.',
    eyebrow: 'Caso de estudio · Trabajo interno de producto',
    summary:
      'Una modernización frontend enfocada en hacer que una interfaz de producto compleja se sintiera más rápida, cargara de forma más predecible y permaneciera estable al navegar por pantallas intensivas en datos.',
    confidentialityNote:
      'Este caso de estudio está anonimizado. Se excluyen nombres de clientes, capturas, rutas privadas, mediciones propietarias y métricas exactas de rendimiento.',
    meta: [
      {
        label: 'Tipo de proyecto',
        value: 'Modernización de rendimiento frontend',
      },
      { label: 'Rol', value: 'Ingeniería UI enfocada en rendimiento' },
      {
        label: 'Enfoque principal',
        value: 'Velocidad, estabilidad y coste de render',
      },
      {
        label: 'Área técnica',
        value: 'Activos, rutas, render React y estados UX',
      },
    ],
    tags: [
      'Core Web Vitals',
      'Rendimiento frontend',
      'Optimización de render',
      'Estrategia de activos',
      'React',
      'Estabilidad UX',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Contexto',
        body: [
          'La interfaz de producto había acumulado presión de rendimiento con el tiempo. Más pantallas, estados UI más ricos, activos más pesados y flujos de datos más profundos hacían que la experiencia se sintiera más lenta de lo que justificaba el valor del producto.',
          'El objetivo no era perseguir una única puntuación sintética. El objetivo era mejorar las partes del rendimiento que el usuario siente: contenido útil más rápido, menos saltos de layout, interacciones más fluidas y estados de carga más claros.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problema',
        body: [
          'Los problemas de rendimiento en productos frontend maduros suelen venir de muchos costes pequeños acumulados. Imágenes, scripts, re-renders, límites de ruta, actualizaciones de estado y cambios de layout pueden parecer aceptables por separado, pero juntos vuelven pesada la experiencia.',
          'La UI también debía seguir siendo comprensible mientras cargaban los datos. Una pantalla en blanco rápida no ayuda; los usuarios necesitan contenido progresivo, placeholders estables y estados claros cuando la información tarda o no está disponible.',
        ],
        bullets: [
          'Las pantallas iniciales necesitaban priorizar mejor el contenido visible primero.',
          'Los activos grandes y la UI secundaria necesitaban una estrategia de carga más clara.',
          'El contenido dinámico necesitaba espacio reservado para reducir movimiento de layout.',
          'Las actualizaciones de componentes necesitaban límites más precisos para evitar renders innecesarios.',
          'Los estados de carga y no disponibilidad debían comunicar progreso sin ruido visual.',
        ],
      },
      {
        id: 'approach',
        heading: 'Enfoque',
        body: [
          'Abordé el trabajo como un presupuesto de rendimiento para todo el recorrido de usuario, no como una auditoría de una sola página. El primer paso fue separar contenido crítico de detalle secundario y aligerar la ruta inicial.',
          'La implementación se centró en render predecible, regiones de layout estables, mejores decisiones de activos y estados UI que explicaran el progreso sin introducir movimiento o reflow adicional.',
        ],
        bullets: [
          'Priorización de contenido significativo y reducción de trabajo evitable antes de la primera interacción.',
          'Revisión de límites de componentes para mantener localizados los cambios de estado frecuentes.',
          'Reserva de dimensiones para paneles dinámicos, medios y bloques de contenido.',
          'Separación de UI crítica y detalle secundario que podía cargar más tarde.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Decisiones de accesibilidad',
        body: [
          'Rendimiento y accesibilidad se trataron como preocupaciones conectadas. Una página que se mueve inesperadamente, oculta el foco o carga controles sin contexto crea fricción para usuarios de teclado y tecnologías de asistencia.',
          'La modernización mantuvo los estados de carga comprensibles, preservó el comportamiento de foco y evitó indicadores solo visuales cuando los usuarios necesitaban estado real o guía de siguiente paso.',
        ],
        bullets: [
          'Los estados de carga y error usaron texto legible, no solo animación o color.',
          'Las regiones estables redujeron movimientos inesperados durante la interacción.',
          'El foco de teclado permaneció visible y predecible mientras el contenido cambiaba.',
          'Se respetaron preferencias de movimiento reducido cuando la animación no era esencial.',
        ],
      },
      {
        id: 'performance',
        heading: 'Rendimiento y estabilidad',
        body: [
          'Las mejoras más valiosas vinieron de reducir trabajo frontend innecesario y hacer la estructura de página más predecible. Esto incluyó revisar prioridad de activos, límites de render, estados dinámicos y reservas de layout.',
          'El trabajo también hizo el rendimiento más mantenible al convertir expectativas implícitas en patrones de implementación. La nueva UI podía seguir los mismos principios sin repetir la acumulación de costes previa.',
        ],
        bullets: [
          'Mejor priorización de activos para contenido crítico frente a secundario.',
          'Reducción de cascadas de render evitables en regiones que se actualizan con frecuencia.',
          'Alineación entre skeletons y estados poblados para evitar saltos de layout.',
          'Divulgación progresiva para secciones pesadas que no eran necesarias de inmediato.',
        ],
      },
      {
        id: 'seo',
        heading: 'Por qué importa este caso',
        body: [
          'Este proyecto muestra el lado práctico del rendimiento frontend: no solo herramientas y métricas, sino decisiones de recorrido, arquitectura de render, estados resilientes y restricciones mantenibles.',
          'Para equipos de producto, la señal clave es que el rendimiento se diseña dentro de la interfaz. Se construye con prioridad de contenido, límites de componentes, estrategia de activos, accesibilidad y disciplina para que la UI futura no nazca cara por defecto.',
        ],
      },
    ],
    outcomes: [
      'Una experiencia frontend más predecible en recorridos complejos e intensivos en datos.',
      'Priorización más clara entre contenido crítico, paneles secundarios y detalle diferido.',
      'Patrones de carga más estables que redujeron movimiento de layout evitable.',
      'Un enfoque de rendimiento mantenible que los equipos pueden reutilizar en futuras funcionalidades.',
    ],
    nextSteps: [
      'Publicar métricas exactas de Core Web Vitals y antes-después solo cuando puedan verificarse.',
      'Añadir diagramas aprobados del modelo de decisiones de rendimiento cuando la confidencialidad lo permita.',
      'Seguir aplicando el mismo presupuesto de rendimiento a nuevas superficies de producto.',
    ],
    relatedServices: [
      'Optimización de rendimiento',
      'Mejora de Core Web Vitals',
      'Optimización de render React',
      'Revisión de arquitectura frontend',
    ],
  },
  ar: {
    slug: 'performance-modernization',
    title: 'تحديث الأداء',
    seoTitle: 'دراسة تحديث أداء | Core Web Vitals',
    description:
      'دراسة حالة Frontend مجهولة حول تحسين السرعة المحسوسة، وثبات العرض، وتسليم الأصول، وCore Web Vitals لواجهة منتج معقدة.',
    eyebrow: 'دراسة حالة · عمل داخلي على المنتج',
    summary:
      'جهد تحديث Frontend ركز على جعل واجهة منتج معقدة تبدو أسرع، وتحمّل بشكل أكثر توقعًا، وتبقى مستقرة أثناء تنقل المستخدمين عبر شاشات كثيفة البيانات.',
    confidentialityNote:
      'دراسة الحالة هذه مجهولة. تُستبعد أسماء العملاء، ولقطات الشاشة، والمسارات الخاصة، والقياسات المملوكة، ومقاييس الأداء الدقيقة عمدًا.',
    meta: [
      { label: 'نوع المشروع', value: 'تحديث أداء Frontend' },
      { label: 'الدور', value: 'هندسة UI مركزة على الأداء' },
      { label: 'التركيز الأساسي', value: 'السرعة، الاستقرار، وتكلفة العرض' },
      { label: 'النطاق التقني', value: 'الأصول، التوجيه، عرض React وحالات UX' },
    ],
    tags: [
      'Core Web Vitals',
      'أداء Frontend',
      'تحسين العرض',
      'استراتيجية الأصول',
      'React',
      'استقرار UX',
    ],
    sections: [
      {
        id: 'context',
        heading: 'السياق',
        body: [
          'تراكم ضغط الأداء في واجهة المنتج مع الوقت. شاشات أكثر، وحالات UI أغنى، وأصول أثقل، وتدفقات بيانات أعمق جعلت التجربة تبدو أبطأ مما يناسب قيمة المنتج.',
          'لم يكن الهدف ملاحقة نتيجة اختبار واحدة. كان الهدف تحسين أجزاء الأداء التي يشعر بها المستخدم: محتوى مفيد أسرع، قفزات layout أقل، تفاعلات أكثر سلاسة، وسلوك تحميل أوضح.',
        ],
      },
      {
        id: 'problem',
        heading: 'المشكلة',
        body: [
          'مشكلات الأداء في منتجات Frontend الناضجة غالبًا تأتي من تراكم تكاليف صغيرة كثيرة. الصور والسكربتات وإعادة العرض وحدود التوجيه وتحديثات الحالة وتحركات layout قد تبدو مقبولة منفردة، لكن التجربة الكلية تصبح ثقيلة.',
          'احتاجت الواجهة أيضًا إلى البقاء مفهومة أثناء تحميل البيانات. شاشة فارغة سريعة ليست مفيدة؛ يحتاج المستخدمون محتوى تدريجيًا، وplaceholders مستقرة، وحالات واضحة عندما تتأخر المعلومات أو لا تتاح.',
        ],
        bullets: [
          'احتاجت الشاشات الأولية إلى أولوية أوضح للمحتوى الظاهر أولًا.',
          'احتاجت الأصول الكبيرة وUI الثانوية إلى استراتيجية تحميل أفضل.',
          'احتاج المحتوى الديناميكي إلى مساحة محجوزة لتقليل حركة layout.',
          'احتاجت تحديثات المكونات إلى حدود أدق لتجنب عمل render غير ضروري.',
          'احتاجت حالات التحميل وعدم التوفر إلى شرح التقدم دون ضجيج بصري.',
        ],
      },
      {
        id: 'approach',
        heading: 'النهج',
        body: [
          'تعاملت مع العمل كميزانية أداء عبر مسار المستخدم كله، وليس كتدقيق صفحة واحدة. كانت الخطوة الأولى فصل المحتوى الحرج عن التفاصيل الثانوية وجعل المسار الأولي أخف.',
          'ركز التنفيذ على عرض متوقع، ومناطق layout مستقرة، وقرارات أوضح للأصول، وحالات UI تساعد المستخدم على فهم التقدم دون إضافة حركة أو reflow زائد.',
        ],
        bullets: [
          'إعطاء أولوية للمحتوى المفيد وتقليل العمل القابل للتجنب قبل أول تفاعل.',
          'مراجعة حدود المكونات حتى تبقى تغييرات الحالة المتكررة محلية.',
          'حجز أبعاد للمناطق الديناميكية والوسائط وكتل المحتوى.',
          'فصل UI الحرج عن التفاصيل الثانوية التي يمكن تحميلها لاحقًا.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'قرارات إمكانية الوصول',
        body: [
          'عومل الأداء وإمكانية الوصول كمسألتين مترابطتين. الصفحة التي تتحرك فجأة أو تخفي التركيز أو تحمل عناصر تحكم دون سياق تسبب احتكاكًا لمستخدمي لوحة المفاتيح والتقنيات المساعدة.',
          'حافظ التحديث على وضوح حالات التحميل، وثبات سلوك التركيز، وتجنب مؤشرات تقدم بصرية فقط عندما يحتاج المستخدمون إلى حالة فعلية أو إرشاد للخطوة التالية.',
        ],
        bullets: [
          'استخدمت حالات التحميل والخطأ نصًا قابلًا للقراءة، لا حركة أو لون فقط.',
          'قللت مناطق layout المستقرة الحركة غير المتوقعة أثناء التفاعل.',
          'بقي تركيز لوحة المفاتيح مرئيًا ومتوقعًا أثناء تحديث المحتوى.',
          'تم احترام تفضيلات تقليل الحركة عندما لا تكون الحركة ضرورية.',
        ],
      },
      {
        id: 'performance',
        heading: 'الأداء والاستقرار',
        body: [
          'جاءت التحسينات الأكثر قيمة من تقليل عمل Frontend غير الضروري وجعل بنية الصفحة أكثر توقعًا. شمل ذلك مراجعة أولوية الأصول، وحدود العرض، والتعامل مع الحالات الديناميكية، وحجز المساحات.',
          'جعل العمل الأداء أسهل في الصيانة عبر تحويل التوقعات الضمنية إلى أنماط تنفيذ. استطاعت UI الجديدة اتباع المبادئ نفسها بدل تكرار تراكم التكاليف السابق.',
        ],
        bullets: [
          'تحسين أولوية الأصول بين المحتوى الحرج والثانوي.',
          'تقليل سلاسل render القابلة للتجنب في مناطق الواجهة كثيرة التحديث.',
          'مواءمة skeletons مع الحالات المكتملة لتجنب قفزات layout.',
          'استخدام الكشف التدريجي للأقسام الثقيلة غير المطلوبة فورًا.',
        ],
      },
      {
        id: 'seo',
        heading: 'لماذا تهم هذه الدراسة',
        body: [
          'يوضح هذا المشروع الجانب العملي لأداء Frontend: ليس الأدوات والمقاييس فقط، بل قرارات مسار المستخدم، ومعمارية العرض، والحالات المرنة، والقيود القابلة للصيانة.',
          'بالنسبة لفرق المنتج، الإشارة الأساسية هي أن الأداء يُصمم داخل الواجهة. يتشكل عبر أولوية المحتوى، وحدود المكونات، واستراتيجية الأصول، والإتاحة، والانضباط حتى لا تصبح UI المستقبلية مكلفة افتراضيًا.',
        ],
      },
    ],
    outcomes: [
      'تجربة Frontend أكثر توقعًا عبر مسارات UI معقدة وكثيفة البيانات.',
      'أولوية أوضح للمحتوى الحرج واللوحات الثانوية والتفاصيل المؤجلة.',
      'أنماط تحميل أكثر استقرارًا قللت حركة layout القابلة للتجنب.',
      'نهج أداء قابل للصيانة يمكن للفرق إعادة استخدامه في أعمال مستقبلية.',
    ],
    nextSteps: [
      'نشر مقاييس Core Web Vitals ونتائج قبل/بعد الدقيقة فقط بعد إمكانية التحقق منها.',
      'إضافة مخططات معتمدة لنموذج قرارات الأداء عندما تسمح السرية بذلك.',
      'مواصلة تطبيق ميزانية الأداء نفسها على مساحات منتج جديدة.',
    ],
    relatedServices: [
      'تحسين الأداء',
      'تحسين Core Web Vitals',
      'تحسين عرض React',
      'مراجعة معمارية Frontend',
    ],
  },
};

const caseStudyProof: Record<
  Locale,
  Record<string, readonly CaseStudyProof[]>
> = {
  en: {
    'analytics-command-center': [
      {
        id: 'role',
        heading: 'My role',
        items: [
          'Owned the frontend architecture, interaction model, and reusable dashboard UI patterns from problem framing through implementation.',
          'Translated product and operations needs into role-based information architecture, state contracts, and accessible React components.',
          'Worked across product, design, and API boundaries so the dashboard could support real decision workflows instead of static reporting screens.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        items: [
          'The interface had to support multiple user roles without fragmenting the product into unrelated screen variants.',
          'Data could be loading, delayed, filtered empty, partially available, stale, or unavailable, and each state needed clear user guidance.',
          'Charts and metric cards had to remain understandable without depending only on color, hover behavior, screenshots, or private datasets.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Key decisions',
        items: [
          'Used a scan-first layout with critical KPIs before trend panels, filters, and deeper tabular investigation.',
          'Defined explicit component state names so loading, empty, error, partial, and unavailable states stayed consistent across modules.',
          'Paired visual charts with labels, summaries, and adjacent structured values so the data remained readable for people and machines.',
        ],
      },
    ],
    'design-system-uplift': [
      {
        id: 'role',
        heading: 'My role',
        items: [
          'Led frontend component architecture for the shared UI layer, including reusable patterns, typed APIs, and implementation guidance.',
          'Audited repeated product surfaces and converted high-value patterns into components teams could adopt without rewriting screens.',
          'Collaborated with design and engineering stakeholders to keep tokens, accessibility behavior, and product constraints aligned.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        items: [
          'The system needed to improve consistency without forcing a risky redesign or blocking active product delivery.',
          'Existing screens used local component variants, inconsistent spacing, and different handling for loading, focus, validation, and error states.',
          'Shared components had to remain flexible enough for product teams while still preventing unsupported visual and behavioral drift.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Key decisions',
        items: [
          'Defined component contracts around product intent, supported states, and accessibility requirements instead of purely visual variants.',
          'Moved recurring states such as loading, empty, disabled, selected, warning, and validation into shared primitives.',
          'Documented usage rules, edge cases, and anti-patterns so the correct implementation path was easier than a local workaround.',
        ],
      },
    ],
    'performance-modernization': [
      {
        id: 'role',
        heading: 'My role',
        items: [
          'Owned the frontend performance pass across rendering, asset delivery, layout stability, route behavior, and user-facing loading states.',
          'Reviewed expensive UI paths and translated performance risk into practical engineering constraints teams could maintain.',
          'Balanced Core Web Vitals, accessibility, and product usability so the interface felt faster without hiding useful context.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        items: [
          'Exact routes, measurements, screenshots, and proprietary performance data could not be published publicly.',
          'The product still needed rich data screens, responsive behavior, theme support, and understandable states during delayed network responses.',
          'Performance improvements had to avoid breaking keyboard flow, reduced-motion preferences, or the visual hierarchy users already understood.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Key decisions',
        items: [
          'Prioritized meaningful above-the-fold content, deferred secondary panels, and reduced non-critical work before first interaction.',
          'Reserved dimensions for media, dynamic panels, and skeleton states to reduce avoidable layout movement.',
          'Tightened component boundaries so frequent state changes stayed local instead of triggering broad render cascades.',
        ],
      },
    ],
  },
  es: {
    'analytics-command-center': [
      {
        id: 'role',
        heading: 'Mi rol',
        items: [
          'Me encargué de la arquitectura frontend, el modelo de interacción y los patrones reutilizables del dashboard desde el análisis del problema hasta la implementación.',
          'Convertí necesidades de producto y operaciones en arquitectura de información por roles, contratos de estado y componentes React accesibles.',
          'Trabajé entre producto, diseño y APIs para que el dashboard soportara flujos reales de decisión, no solo pantallas estáticas de reporting.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Restricciones',
        items: [
          'La interfaz debía soportar varios roles de usuario sin fragmentar el producto en variantes de pantalla desconectadas.',
          'Los datos podían estar cargando, retrasados, vacíos por filtro, parcialmente disponibles, obsoletos o no disponibles, y cada estado necesitaba una guía clara.',
          'Los gráficos y tarjetas de métricas debían seguir siendo comprensibles sin depender solo del color, hover, capturas o datasets privados.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Decisiones clave',
        items: [
          'Usé un layout pensado para escaneo rápido, con KPIs críticos antes de tendencias, filtros e investigación tabular profunda.',
          'Definí nombres explícitos de estado para mantener consistentes carga, vacío, error, parcial y no disponible entre módulos.',
          'Acompañé los gráficos con etiquetas, resúmenes y valores estructurados cercanos para que los datos fueran legibles para personas y máquinas.',
        ],
      },
    ],
    'design-system-uplift': [
      {
        id: 'role',
        heading: 'Mi rol',
        items: [
          'Lideré la arquitectura frontend de la capa UI compartida, incluyendo patrones reutilizables, APIs tipadas y guía de implementación.',
          'Audité superficies de producto repetidas y convertí patrones de alto valor en componentes que los equipos podían adoptar sin reescribir pantallas.',
          'Colaboré con diseño e ingeniería para mantener alineados tokens, comportamiento accesible y restricciones reales del producto.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Restricciones',
        items: [
          'El sistema debía mejorar la consistencia sin forzar un rediseño riesgoso ni bloquear entregas activas del producto.',
          'Las pantallas existentes usaban variantes locales, espaciados inconsistentes y manejos distintos para carga, foco, validación y error.',
          'Los componentes compartidos debían seguir siendo flexibles para los equipos, pero evitar deriva visual y de comportamiento no soportada.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Decisiones clave',
        items: [
          'Definí contratos de componentes alrededor de intención de producto, estados soportados y requisitos de accesibilidad, no solo variantes visuales.',
          'Moví estados recurrentes como carga, vacío, deshabilitado, seleccionado, alerta y validación a primitivas compartidas.',
          'Documenté reglas de uso, casos límite y anti-patrones para que el camino correcto fuera más fácil que un workaround local.',
        ],
      },
    ],
    'performance-modernization': [
      {
        id: 'role',
        heading: 'Mi rol',
        items: [
          'Me encargué del trabajo frontend de rendimiento en renderizado, entrega de activos, estabilidad de layout, rutas y estados de carga visibles para el usuario.',
          'Revisé recorridos UI costosos y convertí riesgos de rendimiento en restricciones prácticas que los equipos pudieran mantener.',
          'Equilibré Core Web Vitals, accesibilidad y usabilidad para que la interfaz se sintiera más rápida sin ocultar contexto útil.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Restricciones',
        items: [
          'No podían publicarse rutas exactas, mediciones, capturas ni datos propietarios de rendimiento.',
          'El producto seguía necesitando pantallas ricas en datos, comportamiento responsive, soporte de tema y estados comprensibles durante respuestas de red lentas.',
          'Las mejoras de rendimiento no podían romper el flujo de teclado, las preferencias de movimiento reducido ni la jerarquía visual ya conocida por los usuarios.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Decisiones clave',
        items: [
          'Priorizé contenido significativo visible primero, diferí paneles secundarios y reduje trabajo no crítico antes de la primera interacción.',
          'Reservé dimensiones para medios, paneles dinámicos y skeleton states para reducir movimiento de layout evitable.',
          'Ajusté límites de componentes para que cambios frecuentes de estado quedaran locales y no dispararan cascadas amplias de render.',
        ],
      },
    ],
  },
  ar: {
    'analytics-command-center': [
      {
        id: 'role',
        heading: 'دوري',
        items: [
          'تولّيت معمارية Frontend ونموذج التفاعل وأنماط لوحة البيانات القابلة لإعادة الاستخدام من صياغة المشكلة حتى التنفيذ.',
          'حوّلت احتياجات المنتج والعمليات إلى معمارية معلومات حسب الأدوار، وعقود حالات واضحة، ومكونات React متاحة.',
          'عملت عبر حدود المنتج والتصميم وواجهات API حتى تدعم اللوحة مسارات قرار حقيقية بدل شاشات تقارير ثابتة.',
        ],
      },
      {
        id: 'constraints',
        heading: 'القيود',
        items: [
          'كان يجب أن تدعم الواجهة عدة أدوار مستخدم دون تفكيك المنتج إلى نسخ شاشة غير مترابطة.',
          'قد تكون البيانات قيد التحميل أو متأخرة أو فارغة بسبب الفلترة أو جزئية أو قديمة أو غير متاحة، وكل حالة تحتاج إرشادًا واضحًا.',
          'كان يجب أن تبقى الرسوم وبطاقات المقاييس مفهومة دون الاعتماد فقط على اللون أو hover أو اللقطات أو البيانات الخاصة.',
        ],
      },
      {
        id: 'decisions',
        heading: 'القرارات الرئيسية',
        items: [
          'استخدمت بنية سهلة المسح تبدأ بمؤشرات KPI الحرجة قبل الاتجاهات والفلاتر والتحليل الجدولي الأعمق.',
          'عرّفت أسماء حالات صريحة حتى تبقى حالات التحميل والفراغ والخطأ والبيانات الجزئية وعدم التوفر متسقة بين الوحدات.',
          'دعمت الرسوم بتسميات وملخصات وقيم منظمة قريبة حتى تبقى البيانات قابلة للقراءة للناس والآلات.',
        ],
      },
    ],
    'design-system-uplift': [
      {
        id: 'role',
        heading: 'دوري',
        items: [
          'قدت معمارية Frontend لطبقة UI المشتركة، بما في ذلك الأنماط القابلة لإعادة الاستخدام وواجهات typed وإرشادات التنفيذ.',
          'راجعت واجهات المنتج المتكررة وحوّلت الأنماط عالية القيمة إلى مكونات يمكن للفرق اعتمادها دون إعادة كتابة الشاشات.',
          'تعاونت مع التصميم والهندسة للحفاظ على اتساق التوكنات وسلوك الإتاحة وقيود المنتج الواقعية.',
        ],
      },
      {
        id: 'constraints',
        heading: 'القيود',
        items: [
          'كان على النظام تحسين الاتساق دون فرض إعادة تصميم عالية المخاطر أو تعطيل تسليم المنتج الجاري.',
          'استخدمت الشاشات الحالية نسخًا محلية من المكونات ومسافات غير متسقة ومعالجات مختلفة للتحميل والتركيز والتحقق والأخطاء.',
          'كان يجب أن تبقى المكونات المشتركة مرنة لفرق المنتج مع منع الانحرافات البصرية والسلوكية غير المدعومة.',
        ],
      },
      {
        id: 'decisions',
        heading: 'القرارات الرئيسية',
        items: [
          'عرّفت عقود المكونات حول هدف المنتج والحالات المدعومة ومتطلبات الإتاحة، لا حول المتغيرات البصرية فقط.',
          'نقلت الحالات المتكررة مثل التحميل والفراغ والتعطيل والتحديد والتحذير والتحقق إلى primitives مشتركة.',
          'وثّقت قواعد الاستخدام والحالات الحدية والأنماط الخاطئة حتى يصبح المسار الصحيح أسهل من الحل المحلي المؤقت.',
        ],
      },
    ],
    'performance-modernization': [
      {
        id: 'role',
        heading: 'دوري',
        items: [
          'تولّيت تحسين أداء Frontend عبر العرض وتسليم الأصول وثبات التخطيط وسلوك التوجيه وحالات التحميل الظاهرة للمستخدم.',
          'راجعت مسارات UI المكلفة وحوّلت مخاطر الأداء إلى قيود هندسية عملية يمكن للفرق الحفاظ عليها.',
          'وازنت بين Core Web Vitals وإمكانية الوصول وقابلية الاستخدام حتى تبدو الواجهة أسرع دون إخفاء السياق المفيد.',
        ],
      },
      {
        id: 'constraints',
        heading: 'القيود',
        items: [
          'لا يمكن نشر المسارات الدقيقة أو القياسات أو اللقطات أو بيانات الأداء المملوكة علنًا.',
          'كان المنتج لا يزال يحتاج شاشات غنية بالبيانات، واستجابة للشاشات، ودعم السمات، وحالات مفهومة أثناء تأخر استجابات الشبكة.',
          'كان يجب ألا تكسر تحسينات الأداء مسار لوحة المفاتيح أو تفضيلات تقليل الحركة أو الهرمية البصرية التي اعتادها المستخدمون.',
        ],
      },
      {
        id: 'decisions',
        heading: 'القرارات الرئيسية',
        items: [
          'أعطيت أولوية للمحتوى المفيد الظاهر أولًا، وأجّلت اللوحات الثانوية، وقللت العمل غير الحرج قبل أول تفاعل.',
          'حجزت أبعادًا للوسائط واللوحات الديناميكية وحالات skeleton لتقليل حركة layout القابلة للتجنب.',
          'شدّدت حدود المكونات حتى تبقى تغييرات الحالة المتكررة محلية بدل إطلاق سلاسل render واسعة.',
        ],
      },
    ],
  },
};

const withProof = (caseStudy: CaseStudyBase, locale: Locale): CaseStudy => ({
  ...caseStudy,
  proof: caseStudyProof[locale][caseStudy.slug] ?? [],
});

export const caseStudies: readonly CaseStudy[] = [
  withProof(analyticsCommandCenter.en, 'en'),
  withProof(designSystemUplift.en, 'en'),
  withProof(performanceModernization.en, 'en'),
] as const;

const localizedCaseStudies: Record<Locale, readonly CaseStudy[]> = {
  en: [
    withProof(analyticsCommandCenter.en, 'en'),
    withProof(designSystemUplift.en, 'en'),
    withProof(performanceModernization.en, 'en'),
  ],
  es: [
    withProof(analyticsCommandCenter.es, 'es'),
    withProof(designSystemUplift.es, 'es'),
    withProof(performanceModernization.es, 'es'),
  ],
  ar: [
    withProof(analyticsCommandCenter.ar, 'ar'),
    withProof(designSystemUplift.ar, 'ar'),
    withProof(performanceModernization.ar, 'ar'),
  ],
};

export const getCaseStudies = (locale: Locale): readonly CaseStudy[] =>
  localizedCaseStudies[locale];

export const getCaseStudy = (
  locale: Locale,
  slug: string,
): CaseStudy | undefined =>
  getCaseStudies(locale).find((caseStudy) => caseStudy.slug === slug);
