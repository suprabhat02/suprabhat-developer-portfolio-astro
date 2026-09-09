import type { Locale } from '../i18n/config';

export interface Service {
  id: string;
  name: string;
  description: string;
  fit?: string;
  deliverables?: string;
  exclusions?: string;
  duration?: string;
  source: string;
}

export const services: readonly Service[] = [
  {
    id: 'defined-frontend-project',
    name: 'Defined React frontend project',
    description:
      'Deliver a bounded React, Next.js, or TypeScript frontend build with clear outcomes, tests, documentation, and handover.',
    fit: 'SaaS teams, startups, and agencies with an approved scope and product owner',
    deliverables:
      'Scoped implementation, responsive UI, accessibility, browser tests, documentation, and source-code handover after final payment',
    exclusions: 'Ongoing embedded team delivery and maintenance retainers',
    duration: 'Confirmed after discovery',
    source: 'Owner-supplied engagement priorities',
  },
  {
    id: 'performance-audit',
    name: 'Frontend performance audit',
    description:
      'Find the rendering, asset, routing, and interaction bottlenecks slowing a React application.',
    fit: 'SaaS teams with React applications scoring below 70 in Lighthouse lab tests',
    deliverables:
      'Audit report, annotated fix list, priority order, and a 60-minute review call',
    exclusions: 'Implementation of the recommended fixes',
    duration: '5 business days',
    source: 'Owner-supplied service brief',
  },
  {
    id: 'architecture-review',
    name: 'React and TypeScript architecture review',
    description:
      'Review component boundaries, state ownership, data flow, rendering strategy, testing, and delivery risks.',
    fit: 'Engineering managers inheriting or scaling a React codebase',
    deliverables:
      'Architecture decision record, refactor roadmap, and team presentation',
    exclusions: 'Refactoring implementation',
    duration: '1–2 weeks',
    source: 'Owner-supplied service brief',
  },
  {
    id: 'async-architecture-advisory',
    name: 'Async architecture advisory',
    description:
      'Get focused React and TypeScript code review or architecture guidance without joining an embedded delivery team.',
    fit: 'Engineering leads who need a senior second opinion across time zones',
    deliverables:
      'Written review, annotated code findings, recorded walkthrough, and prioritized decision notes',
    exclusions: 'Implementation unless separately scoped',
    duration: 'Scoped per review',
    source: 'Owner-supplied engagement priorities',
  },
  {
    id: 'dashboard-development',
    name: 'SaaS dashboard development',
    description:
      'Build data-heavy admin panels and analytics interfaces with accessible, tested React and TypeScript UI.',
    fit: 'Product teams building dashboards, internal tools, or analytics products',
    deliverables:
      'Responsive dashboard UI, resilient data states, accessibility, and browser tests',
    duration: '3–8 weeks',
    source: 'Owner-supplied service brief',
  },
  {
    id: 'design-system-engineering',
    name: 'Design system engineering',
    description:
      'Standardize UI behavior and visual decisions across products and engineering teams.',
    fit: 'Teams with inconsistent UI across two or more products or three or more engineers',
    deliverables:
      'Component library, design tokens, Storybook documentation, theming, accessibility baseline, and contribution guide',
    duration: '4–10 weeks',
    source: 'Owner-supplied service brief',
  },
  {
    id: 'accessibility-audit',
    name: 'Accessibility audit',
    description:
      'Evaluate key workflows against WCAG 2.2 AA criteria using manual review and axe-based testing.',
    fit: 'Teams serving enterprise clients or regulated industries',
    deliverables:
      'Audit findings, severity-ranked fix guidance, and one retest round',
    duration: '5–7 business days',
    source: 'Owner-supplied service brief',
  },
  {
    id: 'website-delivery',
    name: 'Website design and development',
    description:
      'Design and build a responsive website with appropriate technology, accessible foundations, SEO metadata, contact delivery, and deployment.',
    fit: 'Startups, businesses, and agencies needing a complete web presence',
    deliverables:
      'Custom design, responsive build, performance testing, accessibility baseline, SEO metadata, contact form, and deployment',
    duration: '1–8 weeks, depending on scope',
    source:
      'Owner-supplied service brief; numeric Lighthouse guarantee intentionally excluded',
  },
] as const;

const localizedServices: Partial<Record<Locale, readonly Service[]>> = {
  es: [
    {
      id: 'defined-frontend-project',
      name: 'Proyecto frontend React definido',
      description:
        'Entrega de un proyecto acotado con React, Next.js o TypeScript, resultados claros, pruebas, documentación y transferencia.',
      fit: 'Equipos SaaS, startups y agencias con alcance aprobado y responsable de producto',
      deliverables:
        'Implementación, UI responsive, accesibilidad, pruebas, documentación y transferencia del código tras el pago final',
      exclusions: 'Trabajo continuo integrado en el equipo y mantenimiento',
      duration: 'Se confirma después del descubrimiento',
      source: 'Prioridades de colaboración confirmadas por el propietario',
    },
    {
      id: 'performance-audit',
      name: 'Auditoría de rendimiento frontend',
      description:
        'Identifica cuellos de botella de renderizado, recursos, rutas e interacción en una aplicación React.',
      fit: 'Equipos SaaS con flujos lentos o resultados débiles en pruebas Lighthouse',
      deliverables:
        'Informe, lista anotada de correcciones, prioridades y llamada de revisión de 60 minutos',
      exclusions: 'Implementación de las correcciones recomendadas',
      duration: '5 días laborables',
      source: 'Brief de servicio confirmado por el propietario',
    },
    {
      id: 'architecture-review',
      name: 'Revisión de arquitectura React y TypeScript',
      description:
        'Revisa límites de componentes, propiedad del estado, flujo de datos, renderizado, pruebas y riesgos de entrega.',
      fit: 'Responsables de ingeniería que heredan o escalan una base React',
      deliverables:
        'Registro de decisión, hoja de ruta de refactorización y presentación al equipo',
      exclusions: 'Implementación de la refactorización',
      duration: '1–2 semanas',
      source: 'Brief de servicio confirmado por el propietario',
    },
    {
      id: 'async-architecture-advisory',
      name: 'Asesoría de arquitectura asíncrona',
      description:
        'Revisión enfocada de código React y TypeScript o guía de arquitectura sin integrarse en el equipo.',
      fit: 'Líderes de ingeniería que necesitan una segunda opinión sénior entre zonas horarias',
      deliverables:
        'Revisión escrita, hallazgos anotados, recorrido grabado y notas de decisión priorizadas',
      exclusions: 'Implementación salvo que se defina por separado',
      duration: 'Según el alcance de la revisión',
      source: 'Prioridades de colaboración confirmadas por el propietario',
    },
    {
      id: 'dashboard-development',
      name: 'Desarrollo de dashboards SaaS',
      description:
        'Construye paneles administrativos y analíticos con UI React y TypeScript accesible y probada.',
      fit: 'Equipos que crean dashboards, herramientas internas o productos analíticos',
      deliverables:
        'UI responsive, estados resilientes, accesibilidad y pruebas de navegador',
      duration: '3–8 semanas',
      source: 'Brief de servicio confirmado por el propietario',
    },
    {
      id: 'design-system-engineering',
      name: 'Ingeniería de sistemas de diseño',
      description:
        'Estandariza el comportamiento y las decisiones visuales entre productos y equipos.',
      fit: 'Equipos con UI inconsistente en varios productos o ingenieros',
      deliverables:
        'Biblioteca de componentes, tokens, Storybook, temas, base de accesibilidad y guía de contribución',
      duration: '4–10 semanas',
      source: 'Brief de servicio confirmado por el propietario',
    },
    {
      id: 'accessibility-audit',
      name: 'Auditoría de accesibilidad',
      description:
        'Evalúa flujos clave según criterios WCAG 2.2 AA mediante revisión manual y axe.',
      fit: 'Equipos que sirven a clientes empresariales o sectores regulados',
      deliverables:
        'Hallazgos priorizados, guía de corrección y una ronda de nueva prueba',
      duration: '5–7 días laborables',
      source: 'Brief de servicio confirmado por el propietario',
    },
    {
      id: 'website-delivery',
      name: 'Diseño y desarrollo de sitios web',
      description:
        'Diseña y construye un sitio responsive con base accesible, metadatos SEO, contacto y despliegue.',
      fit: 'Startups, empresas y agencias que necesitan una presencia web completa',
      deliverables:
        'Diseño, desarrollo responsive, pruebas de rendimiento, base accesible, SEO, formulario y despliegue',
      duration: '1–8 semanas según alcance',
      source: 'Brief de servicio confirmado por el propietario',
    },
  ],
  ar: [
    {
      id: 'defined-frontend-project',
      name: 'مشروع واجهة React محدد',
      description:
        'تنفيذ مشروع محدد باستخدام React أو Next.js أو TypeScript مع نتائج واختبارات وتوثيق وتسليم واضح.',
      fit: 'فرق SaaS والشركات الناشئة والوكالات ذات نطاق معتمد ومسؤول منتج',
      deliverables:
        'تنفيذ وواجهة متجاوبة وإتاحة واختبارات وتوثيق وتسليم الشفرة بعد الدفعة النهائية',
      exclusions: 'العمل المستمر داخل الفريق وعقود الصيانة',
      duration: 'تُحدد بعد جلسة الاستكشاف',
      source: 'أولويات تعاون أكدها مالك الموقع',
    },
    {
      id: 'performance-audit',
      name: 'تدقيق أداء الواجهات',
      description:
        'تحديد اختناقات العرض والأصول والتوجيه والتفاعل التي تبطئ تطبيق React.',
      fit: 'فرق SaaS ذات تدفقات بطيئة أو نتائج مختبرية ضعيفة في Lighthouse',
      deliverables:
        'تقرير وقائمة إصلاحات مشروحة وأولويات ومكالمة مراجعة لمدة 60 دقيقة',
      exclusions: 'تنفيذ الإصلاحات المقترحة',
      duration: '5 أيام عمل',
      source: 'موجز خدمة أكده مالك الموقع',
    },
    {
      id: 'architecture-review',
      name: 'مراجعة معمارية React وTypeScript',
      description:
        'مراجعة حدود المكونات وملكية الحالة وتدفق البيانات والعرض والاختبارات ومخاطر التسليم.',
      fit: 'مديرو الهندسة الذين يرثون قاعدة React أو يوسعونها',
      deliverables: 'سجل قرار معماري وخارطة إعادة هيكلة وعرض للفريق',
      exclusions: 'تنفيذ إعادة الهيكلة',
      duration: '1–2 أسبوع',
      source: 'موجز خدمة أكده مالك الموقع',
    },
    {
      id: 'async-architecture-advisory',
      name: 'استشارة معمارية غير متزامنة',
      description:
        'مراجعة مركزة لشفرة React وTypeScript أو توجيه معماري دون الانضمام إلى فريق التسليم.',
      fit: 'قادة الهندسة الذين يحتاجون رأيًا تقنيًا أول عبر المناطق الزمنية',
      deliverables:
        'مراجعة مكتوبة ونتائج مشروحة وجولة مسجلة وملاحظات قرار مرتبة',
      exclusions: 'التنفيذ ما لم يُحدد منفصلًا',
      duration: 'بحسب نطاق المراجعة',
      source: 'أولويات تعاون أكدها مالك الموقع',
    },
    {
      id: 'dashboard-development',
      name: 'تطوير لوحات SaaS',
      description:
        'بناء لوحات إدارية وتحليلية كثيفة البيانات بواجهة React وTypeScript متاحة ومختبرة.',
      fit: 'فرق تبني لوحات بيانات أو أدوات داخلية أو منتجات تحليلية',
      deliverables: 'واجهة متجاوبة وحالات بيانات مرنة وإتاحة واختبارات متصفح',
      duration: '3–8 أسابيع',
      source: 'موجز خدمة أكده مالك الموقع',
    },
    {
      id: 'design-system-engineering',
      name: 'هندسة نظام التصميم',
      description:
        'توحيد سلوك الواجهة والقرارات البصرية عبر المنتجات وفرق الهندسة.',
      fit: 'فرق لديها واجهات غير متسقة عبر عدة منتجات أو مهندسين',
      deliverables:
        'مكتبة مكونات ورموز تصميم وStorybook وسمات وأساس إتاحة ودليل مساهمة',
      duration: '4–10 أسابيع',
      source: 'موجز خدمة أكده مالك الموقع',
    },
    {
      id: 'accessibility-audit',
      name: 'تدقيق إمكانية الوصول',
      description:
        'تقييم التدفقات الأساسية وفق معايير WCAG 2.2 AA بالمراجعة اليدوية واختبارات axe.',
      fit: 'فرق تخدم عملاء مؤسسات أو قطاعات منظمة',
      deliverables: 'نتائج مرتبة حسب الشدة وإرشادات إصلاح وجولة إعادة اختبار',
      duration: '5–7 أيام عمل',
      source: 'موجز خدمة أكده مالك الموقع',
    },
    {
      id: 'website-delivery',
      name: 'تصميم وتطوير المواقع',
      description:
        'تصميم وبناء موقع متجاوب بأساس متاح وبيانات SEO ونموذج تواصل ونشر.',
      fit: 'شركات ناشئة ومؤسسات ووكالات تحتاج حضورًا رقميًا متكاملًا',
      deliverables:
        'تصميم مخصص وبناء متجاوب واختبارات أداء وأساس إتاحة وSEO ونموذج تواصل ونشر',
      duration: '1–8 أسابيع حسب النطاق',
      source: 'موجز خدمة أكده مالك الموقع',
    },
  ],
};

export const getServices = (locale: Locale) =>
  localizedServices[locale] ?? services;
