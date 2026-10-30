import type { Locale } from '../i18n/config';
import type {
  CaseStudy,
  CaseStudyProject,
  CaseStudyProof,
} from './caseStudies';

/**
 * Open-source work. Facts are taken from each published npm package and its
 * README (react-smart-copy 1.14.0, react-inp-chunker 0.2.0); update them when
 * a release changes them.
 */

export interface OpenSourceLinks {
  readonly docs: string;
  readonly repository: string;
  readonly npm: string;
}

export type OpenSourceProjectId = 'react-smart-copy' | 'react-inp-chunker';

export interface OpenSourceProject {
  readonly id: OpenSourceProjectId;
  readonly name: string;
  readonly install: string;
  readonly license: 'MIT';
  readonly language: 'TypeScript';
  readonly runtime: string;
  readonly links: OpenSourceLinks;
}

export const reactSmartCopy: OpenSourceProject = {
  id: 'react-smart-copy',
  name: 'react-smart-copy',
  install: 'npm install react-smart-copy',
  license: 'MIT',
  language: 'TypeScript',
  runtime: 'React 18 and 19',
  links: {
    docs: 'https://suprabhat02.github.io/react-smart-copy/',
    repository: 'https://github.com/suprabhat02/react-smart-copy',
    npm: 'https://www.npmjs.com/package/react-smart-copy',
  },
} as const;

export const reactInpChunker: OpenSourceProject = {
  id: 'react-inp-chunker',
  name: 'react-inp-chunker',
  install: 'npm install react-inp-chunker',
  license: 'MIT',
  language: 'TypeScript',
  runtime: 'React 18 and 19',
  links: {
    docs: 'https://suprabhat02.github.io/react-inp-chunker/',
    repository: 'https://github.com/suprabhat02/react-inp-chunker',
    npm: 'https://www.npmjs.com/package/react-inp-chunker',
  },
} as const;

const openSourceProjects: Record<OpenSourceProjectId, OpenSourceProject> = {
  'react-smart-copy': reactSmartCopy,
  'react-inp-chunker': reactInpChunker,
};

export const isOpenSourceProjectId = (id: string): id is OpenSourceProjectId =>
  id in openSourceProjects;

export const getOpenSourceProject = (
  id: OpenSourceProjectId,
): OpenSourceProject => openSourceProjects[id];

/** Copy for the homepage spotlight card and the work index. */
export interface OpenSourceCopy {
  readonly eyebrow: string;
  readonly tagline: string;
  readonly description: string;
  readonly facts: readonly string[];
  readonly installLabel: string;
  readonly linksLabel: string;
  readonly docsLabel: string;
  readonly repositoryLabel: string;
  readonly npmLabel: string;
  readonly caseStudyLabel: string;
  /** License, language, and runtime summary line. */
  readonly meta: string;
}

const openSourceCopy: Record<Locale, OpenSourceCopy> = {
  en: {
    eyebrow: 'Open source · npm package',
    tagline: 'Headless, type-safe clipboard interactions for React',
    description:
      'A React library that handles the whole copy interaction, not only the clipboard call: copying, copied, failed, retry, and paste, with honest error states, hover, focus, and touch reveal, and screen-reader announcements built in.',
    facts: [
      'Zero runtime dependencies',
      'React 18 and 19, SSR and Next.js App Router safe',
      'Typed, classified errors instead of silent failures',
      'Keyboard-first triggers and screen-reader announcements',
      'Framework-agnostic core for plain JavaScript',
    ],
    installLabel: 'Install command',
    linksLabel: 'Project links',
    docsLabel: 'Docs and live demo',
    repositoryLabel: 'Source on GitHub',
    npmLabel: 'Package on npm',
    caseStudyLabel: 'Read the case study',
    meta: 'MIT license · TypeScript · React 18 and 19',
  },
  es: {
    eyebrow: 'Código abierto · paquete npm',
    tagline: 'Interacciones de portapapeles headless y tipadas para React',
    description:
      'Una biblioteca de React que gestiona toda la interacción de copiar, no solo la llamada al portapapeles: copiando, copiado, error, reintento y pegado, con estados de error honestos, aparición por hover, foco o toque, y anuncios para lectores de pantalla incluidos.',
    facts: [
      'Sin dependencias en tiempo de ejecución',
      'React 18 y 19, compatible con SSR y Next.js App Router',
      'Errores tipados y clasificados en lugar de fallos silenciosos',
      'Controles pensados para teclado y anuncios para lectores de pantalla',
      'Núcleo independiente del framework para JavaScript sin React',
    ],
    installLabel: 'Comando de instalación',
    linksLabel: 'Enlaces del proyecto',
    docsLabel: 'Documentación y demo',
    repositoryLabel: 'Código en GitHub',
    npmLabel: 'Paquete en npm',
    caseStudyLabel: 'Leer el caso de estudio',
    meta: 'Licencia MIT · TypeScript · React 18 y 19',
  },
  ar: {
    eyebrow: 'مفتوح المصدر · حزمة npm',
    tagline: 'تفاعلات حافظة بلا واجهة مفروضة وآمنة الأنواع لـ React',
    description:
      'مكتبة React تدير تفاعل النسخ كاملًا وليس استدعاء الحافظة فقط: جارٍ النسخ، تم النسخ، فشل، إعادة المحاولة، واللصق، مع حالات خطأ صادقة، وإظهار عند المرور أو التركيز أو اللمس، وإعلانات مدمجة لقارئات الشاشة.',
    facts: [
      'بلا اعتماديات وقت التشغيل',
      'React 18 و19، وآمنة مع SSR وNext.js App Router',
      'أخطاء مصنفة ومضبوطة الأنواع بدل الفشل الصامت',
      'عناصر تحكم تبدأ بلوحة المفاتيح وإعلانات لقارئات الشاشة',
      'نواة مستقلة عن الإطار لاستخدامها مع JavaScript فقط',
    ],
    installLabel: 'أمر التثبيت',
    linksLabel: 'روابط المشروع',
    docsLabel: 'التوثيق والعرض الحي',
    repositoryLabel: 'الشيفرة على GitHub',
    npmLabel: 'الحزمة على npm',
    caseStudyLabel: 'اقرأ دراسة الحالة',
    meta: 'ترخيص MIT · TypeScript · React 18 و19',
  },
};

const reactInpChunkerCopy: Record<Locale, OpenSourceCopy> = {
  en: {
    eyebrow: 'Open source · npm package',
    tagline:
      'Chunk heavy React work and yield to the main thread to protect INP',
    description:
      'A headless React and TypeScript library that splits heavy synchronous work into time slices of a few milliseconds and yields to the main thread between them, so clicks and typing stay responsive and Interaction to Next Paint (INP) stays good.',
    facts: [
      'Yields with scheduler.yield(), then MessageChannel, then setTimeout',
      '5 ms time slices by default, with pause, resume, and cancel',
      'React 18 and 19, safe for server rendering',
      'React-free core for plain TypeScript, Web Workers, and Node',
      'No dependencies beyond React; ESM and CommonJS builds',
    ],
    installLabel: 'Install command',
    linksLabel: 'Project links',
    docsLabel: 'Docs and live playground',
    repositoryLabel: 'Source on GitHub',
    npmLabel: 'Package on npm',
    caseStudyLabel: 'Read the case study',
    meta: 'MIT license · TypeScript · React 18 and 19',
  },
  es: {
    eyebrow: 'Código abierto · paquete npm',
    tagline:
      'Divide el trabajo pesado de React y cede el hilo principal para proteger el INP',
    description:
      'Una biblioteca headless de React y TypeScript que divide el trabajo síncrono pesado en franjas de pocos milisegundos y cede el hilo principal entre ellas, para que los clics y la escritura sigan respondiendo y la métrica Interaction to Next Paint (INP) se mantenga buena.',
    facts: [
      'Cede el control con scheduler.yield(), luego MessageChannel y luego setTimeout',
      'Franjas de 5 ms por defecto, con pausa, reanudación y cancelación',
      'React 18 y 19, compatible con renderizado en servidor',
      'Núcleo sin React para TypeScript, Web Workers y Node',
      'Sin dependencias además de React; builds ESM y CommonJS',
    ],
    installLabel: 'Comando de instalación',
    linksLabel: 'Enlaces del proyecto',
    docsLabel: 'Documentación y playground',
    repositoryLabel: 'Código en GitHub',
    npmLabel: 'Paquete en npm',
    caseStudyLabel: 'Leer el caso de estudio',
    meta: 'Licencia MIT · TypeScript · React 18 y 19',
  },
  // TODO(ar-review): confirm "إعادة التحكم إلى الخيط الرئيسي" (yield to the
  // main thread) and "شرائح زمنية" (time slices).
  ar: {
    eyebrow: 'مفتوح المصدر · حزمة npm',
    tagline:
      'تقسيم عمل React الثقيل وإعادة التحكم إلى الخيط الرئيسي لحماية مؤشر INP',
    description:
      'مكتبة React وTypeScript بلا واجهة مفروضة تقسم العمل المتزامن الثقيل إلى شرائح زمنية من بضع أجزاء من الثانية، وتعيد التحكم إلى الخيط الرئيسي بينها، فتبقى النقرات والكتابة سريعة الاستجابة ويبقى مؤشر Interaction to Next Paint (INP) جيدًا.',
    facts: [
      'تعيد التحكم عبر scheduler.yield() ثم MessageChannel ثم setTimeout',
      'شرائح زمنية مدتها 5 ملي ثانية افتراضيًا، مع الإيقاف المؤقت والاستئناف والإلغاء',
      'React 18 و19، وآمنة مع العرض على الخادم',
      'نواة لا تعتمد على React لاستخدامها مع TypeScript وWeb Workers وNode',
      'بلا اعتماديات غير React، مع إصدارات ESM وCommonJS',
    ],
    installLabel: 'أمر التثبيت',
    linksLabel: 'روابط المشروع',
    docsLabel: 'التوثيق وساحة التجربة الحية',
    repositoryLabel: 'الشيفرة على GitHub',
    npmLabel: 'الحزمة على npm',
    caseStudyLabel: 'اقرأ دراسة الحالة',
    meta: 'ترخيص MIT · TypeScript · React 18 و19',
  },
};

export const getOpenSourceCopy = (
  locale: Locale,
  id: OpenSourceProjectId = 'react-smart-copy',
): OpenSourceCopy =>
  id === 'react-inp-chunker'
    ? reactInpChunkerCopy[locale]
    : openSourceCopy[locale];

type CaseStudyBase = Omit<CaseStudy, 'proof'>;

const projectLinks = (
  project: OpenSourceProject,
  copy: OpenSourceCopy,
): CaseStudyProject => ({
  install: project.install,
  installLabel: copy.installLabel,
  linksLabel: copy.linksLabel,
  links: [
    { label: copy.docsLabel, href: project.links.docs },
    { label: copy.repositoryLabel, href: project.links.repository },
    { label: copy.npmLabel, href: project.links.npm },
  ],
});

export const reactSmartCopyCaseStudy: Record<Locale, CaseStudyBase> = {
  en: {
    slug: 'react-smart-copy',
    datePublished: '2026-10-03',
    dateModified: '2026-10-19',
    title: 'react-smart-copy',
    seoTitle: 'react-smart-copy Case Study | React Clipboard Library',
    description:
      'How react-smart-copy, an open-source TypeScript library, handles React copy and paste with typed errors, screen-reader announcements, and no dependencies.',
    eyebrow: 'Case study · Open source',
    summary:
      'An open-source, headless React library for clipboard interactions. It models the full interaction around a copy (copying, copied, failed, retry, and paste) so product teams get honest feedback, accessible triggers, and typed errors without writing the same fragile clipboard code again.',
    confidentialityNote:
      'This is a public open-source project. The source code, documentation, live demo, and releases are publicly available under the MIT license.',
    meta: [
      { label: 'Project type', value: 'Open-source React library on npm' },
      { label: 'Role', value: 'Author and maintainer' },
      { label: 'Primary focus', value: 'Accessibility, typed errors, DX' },
      { label: 'Stack area', value: 'TypeScript, React 18+, Clipboard API' },
    ],
    tags: [
      'Open source',
      'React',
      'TypeScript',
      'Clipboard API',
      'Accessibility',
      'npm package',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Context',
        body: [
          'Copy buttons appear in almost every product: API keys, IDs, email addresses, invite links, and code samples. They are usually written as a single clipboard call with a "Copied" message, and they are rewritten in every codebase.',
          'That single call hides most of the real behavior. Browsers refuse clipboard writes outside HTTPS, block them when focus moves, support only some formats, and report failures inconsistently. The interface around the call has to explain all of that to the person who pressed the button.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        body: [
          'Typical copy implementations fail in ways users cannot see and teams rarely test. The goal was a library that treats the copy interaction as product behavior with defined states, not as a utility function.',
        ],
        bullets: [
          'Failures such as an insecure context or a denied permission often no-op silently.',
          'A copy takes a few milliseconds, so naive status text flashes "Copying…" for one frame and resizes the button.',
          'Copy buttons hidden with display: none on hover are unreachable by keyboard.',
          'Results are rarely announced to screen-reader users.',
          'Server rendering can mismatch when components read the browser clipboard during render.',
        ],
      },
      {
        id: 'approach',
        heading: 'Approach',
        body: [
          'The library is built in layers. A framework-agnostic core holds a copy state machine, payload validation, a browser clipboard adapter, and error classification. The React layer adds hooks and a compound CopyField component on top of that core.',
          'Every state is explicit and observable: idle, copying, copied, and error. Two statuses separate logic from display: the real status changes instantly for tests and logic, while the display status only shows "Copying…" when a copy is slow and then holds it long enough to avoid a blink.',
        ],
        bullets: [
          'Copies text, rich HTML with a required plain-text fallback, PNG images, JSON, and several formats at once.',
          'Pastes text, HTML, and screenshots through usePaste, with keyboard paste that needs no permission prompt.',
          'CopyGroup coordinates rows so only one shows "Copied" at a time.',
          'A capture entry point copies an SVG or a piece of UI as a PNG.',
          'Custom adapters let hosts such as Electron provide their own clipboard.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Accessibility decisions',
        body: [
          'Accessibility rules are part of the components rather than documentation for consumers to remember. The trigger is always a real button, and its accessible name stays stable while the result is announced separately.',
        ],
        bullets: [
          'Triggers are reachable with Tab and activate with Enter or Space.',
          'Revealed actions stay in the DOM and the tab order; they are hidden with opacity, never display: none.',
          'Keyboard focus pins the reveal; a mouse click does not.',
          'The trigger is never disabled while copying, so keyboard focus is not lost.',
          'The live region is mounted before its first message, so the first announcement is not missed.',
          'Animations respect prefers-reduced-motion.',
        ],
      },
      {
        id: 'reliability',
        heading: 'Errors, SSR, and footprint',
        body: [
          'Every failure is a typed, classified error such as unsupported, insecure-context, permission-denied, not-focused, unsupported-format, or too-large, and each one states whether a retry can help. Nothing fails silently.',
          'The React entry ships with "use client" and never touches window during render, so server and first client render match in Next.js. The package has zero runtime dependencies, and the README reports about 3.5 kB for useCopy and 5.6 kB for all copy features, minified and compressed with Brotli.',
        ],
      },
    ],
    outcomes: [
      'Published on npm as react-smart-copy under the MIT license, with documentation and a live demo on GitHub Pages.',
      'Supports copy for text, rich HTML, PNG, JSON, and multi-format payloads, plus paste for text, HTML, and images.',
      'Replaces silent clipboard failures with typed errors that state whether a retry can help.',
      'Runs on this portfolio through its framework-agnostic core, powering the copy buttons without loading React.',
    ],
    nextSteps: [
      'Read the documentation and try the live demo.',
      'Install it with npm install react-smart-copy.',
      'Report issues or contribute on GitHub.',
    ],
    relatedServices: [
      'Defined React frontend project',
      'Design system engineering',
      'Accessibility audit',
    ],
    project: projectLinks(reactSmartCopy, openSourceCopy.en),
  },
  es: {
    slug: 'react-smart-copy',
    datePublished: '2026-10-03',
    dateModified: '2026-10-19',
    title: 'react-smart-copy',
    seoTitle: 'react-smart-copy | Biblioteca de portapapeles para React',
    description:
      'Cómo react-smart-copy, biblioteca TypeScript de código abierto, gestiona copiar y pegar en React con errores tipados, anuncios accesibles y sin dependencias.',
    eyebrow: 'Caso de estudio · Código abierto',
    summary:
      'Una biblioteca de React headless y de código abierto para interacciones con el portapapeles. Modela toda la interacción alrededor de una copia (copiando, copiado, error, reintento y pegado) para que los equipos obtengan respuestas honestas, controles accesibles y errores tipados sin reescribir el mismo código frágil.',
    confidentialityNote:
      'Es un proyecto público de código abierto. El código, la documentación, la demo y las versiones están disponibles públicamente bajo la licencia MIT.',
    meta: [
      {
        label: 'Tipo de proyecto',
        value: 'Biblioteca React de código abierto en npm',
      },
      { label: 'Rol', value: 'Autor y mantenedor' },
      {
        label: 'Enfoque principal',
        value: 'Accesibilidad, errores tipados, DX',
      },
      { label: 'Área técnica', value: 'TypeScript, React 18+, Clipboard API' },
    ],
    tags: [
      'Código abierto',
      'React',
      'TypeScript',
      'Clipboard API',
      'Accesibilidad',
      'Paquete npm',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Contexto',
        body: [
          'Los botones de copiar aparecen en casi todos los productos: claves de API, identificadores, correos, enlaces de invitación y ejemplos de código. Suelen escribirse como una sola llamada al portapapeles con un mensaje de "Copiado", y se reescriben en cada base de código.',
          'Esa llamada oculta casi todo el comportamiento real. Los navegadores rechazan escrituras fuera de HTTPS, las bloquean si cambia el foco, solo admiten algunos formatos y reportan fallos de forma inconsistente. La interfaz debe explicar todo eso a quien pulsó el botón.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problema',
        body: [
          'Las implementaciones habituales fallan de formas que el usuario no ve y que los equipos rara vez prueban. El objetivo era una biblioteca que trate la copia como comportamiento de producto con estados definidos, no como una función utilitaria.',
        ],
        bullets: [
          'Fallos como un contexto inseguro o un permiso denegado suelen no hacer nada en silencio.',
          'Una copia tarda unos milisegundos, así que un texto de estado ingenuo muestra "Copiando…" durante un fotograma y cambia el tamaño del botón.',
          'Los botones ocultos con display: none al pasar el cursor no se alcanzan con el teclado.',
          'El resultado rara vez se anuncia a usuarios de lectores de pantalla.',
          'El renderizado en servidor puede no coincidir cuando un componente lee el portapapeles durante el render.',
        ],
      },
      {
        id: 'approach',
        heading: 'Enfoque',
        body: [
          'La biblioteca se construye por capas. Un núcleo independiente del framework contiene una máquina de estados de copia, validación de contenido, un adaptador del portapapeles del navegador y la clasificación de errores. La capa de React añade hooks y un componente compuesto CopyField sobre ese núcleo.',
          'Cada estado es explícito y observable: idle, copying, copied y error. Dos estados separan la lógica de la presentación: el estado real cambia al instante para lógica y pruebas, mientras que el estado visible solo muestra "Copiando…" cuando la copia es lenta y lo mantiene lo suficiente para evitar parpadeos.',
        ],
        bullets: [
          'Copia texto, HTML enriquecido con texto plano obligatorio, imágenes PNG, JSON y varios formatos a la vez.',
          'Pega texto, HTML y capturas con usePaste, y el pegado con teclado no pide permisos.',
          'CopyGroup coordina filas para que solo una muestre "Copiado" a la vez.',
          'Un punto de entrada de captura copia un SVG o una parte de la interfaz como PNG.',
          'Los adaptadores personalizados permiten que entornos como Electron aporten su propio portapapeles.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'Decisiones de accesibilidad',
        body: [
          'Las reglas de accesibilidad forman parte de los componentes, no de una documentación que el equipo deba recordar. El control siempre es un botón real y su nombre accesible se mantiene estable mientras el resultado se anuncia por separado.',
        ],
        bullets: [
          'Los controles se alcanzan con Tab y se activan con Enter o Espacio.',
          'Las acciones reveladas permanecen en el DOM y en el orden de tabulación; se ocultan con opacidad, nunca con display: none.',
          'El foco de teclado fija la aparición; un clic de ratón no.',
          'El botón nunca se deshabilita mientras copia, así el foco de teclado no se pierde.',
          'La región en vivo se monta antes de su primer mensaje, para no perder el primer anuncio.',
          'Las animaciones respetan prefers-reduced-motion.',
        ],
      },
      {
        id: 'reliability',
        heading: 'Errores, SSR y tamaño',
        body: [
          'Cada fallo es un error tipado y clasificado, como unsupported, insecure-context, permission-denied, not-focused, unsupported-format o too-large, e indica si un reintento puede ayudar. Nada falla en silencio.',
          'La entrada de React incluye "use client" y nunca accede a window durante el render, así que el servidor y el primer render del cliente coinciden en Next.js. El paquete no tiene dependencias en tiempo de ejecución, y el README indica unos 3,5 kB para useCopy y 5,6 kB para todas las funciones de copia, minificados y comprimidos con Brotli.',
        ],
      },
    ],
    outcomes: [
      'Publicado en npm como react-smart-copy bajo la licencia MIT, con documentación y demo en GitHub Pages.',
      'Copia texto, HTML enriquecido, PNG, JSON y contenido multiformato, y pega texto, HTML e imágenes.',
      'Sustituye los fallos silenciosos del portapapeles por errores tipados que indican si conviene reintentar.',
      'Funciona en este portfolio mediante su núcleo independiente del framework, en los botones de copiar, sin cargar React.',
    ],
    nextSteps: [
      'Lee la documentación y prueba la demo.',
      'Instálalo con npm install react-smart-copy.',
      'Informa de problemas o contribuye en GitHub.',
    ],
    relatedServices: [
      'Proyecto frontend React definido',
      'Ingeniería de sistemas de diseño',
      'Auditoría de accesibilidad',
    ],
    project: projectLinks(reactSmartCopy, openSourceCopy.es),
  },
  ar: {
    slug: 'react-smart-copy',
    datePublished: '2026-10-03',
    dateModified: '2026-10-19',
    title: 'react-smart-copy',
    seoTitle: 'react-smart-copy | مكتبة حافظة لـ React تراعي إمكانية الوصول',
    description:
      'كيف تدير react-smart-copy، وهي مكتبة TypeScript مفتوحة المصدر، النسخ واللصق في React بأخطاء محددة الأنواع وإعلانات لقارئات الشاشة ودون اعتماديات.',
    eyebrow: 'دراسة حالة · مفتوح المصدر',
    summary:
      'مكتبة React مفتوحة المصدر وبلا واجهة مفروضة لتفاعلات الحافظة. تصمم التفاعل الكامل حول النسخ (جارٍ النسخ، تم النسخ، فشل، إعادة المحاولة، واللصق) لتحصل الفرق على استجابة صادقة وعناصر تحكم متاحة وأخطاء مضبوطة الأنواع دون إعادة كتابة الشيفرة الهشة نفسها.',
    confidentialityNote:
      'هذا مشروع عام مفتوح المصدر. الشيفرة والتوثيق والعرض الحي والإصدارات متاحة للجميع بموجب ترخيص MIT.',
    meta: [
      { label: 'نوع المشروع', value: 'مكتبة React مفتوحة المصدر على npm' },
      { label: 'الدور', value: 'المؤلف والمشرف على الصيانة' },
      {
        label: 'التركيز الأساسي',
        value: 'الإتاحة والأخطاء المضبوطة وتجربة المطور',
      },
      { label: 'النطاق التقني', value: 'TypeScript وReact 18+ وClipboard API' },
    ],
    tags: [
      'مفتوح المصدر',
      'React',
      'TypeScript',
      'Clipboard API',
      'إمكانية الوصول',
      'حزمة npm',
    ],
    sections: [
      {
        id: 'context',
        heading: 'السياق',
        body: [
          'تظهر أزرار النسخ في معظم المنتجات تقريبًا: مفاتيح API والمعرفات وعناوين البريد وروابط الدعوة وأمثلة الشيفرة. غالبًا ما تُكتب كاستدعاء واحد للحافظة مع رسالة "تم النسخ"، وتُعاد كتابتها في كل قاعدة شيفرة.',
          'يخفي ذلك الاستدعاء معظم السلوك الحقيقي. ترفض المتصفحات الكتابة خارج HTTPS، وتمنعها عند انتقال التركيز، وتدعم بعض الصيغ فقط، وتبلغ عن الفشل بطرق غير متسقة. على الواجهة أن تشرح كل ذلك لمن ضغط الزر.',
        ],
      },
      {
        id: 'problem',
        heading: 'المشكلة',
        body: [
          'تفشل تطبيقات النسخ المعتادة بطرق لا يراها المستخدم ونادرًا ما تختبرها الفرق. كان الهدف مكتبة تتعامل مع النسخ كسلوك منتج بحالات محددة، لا كدالة مساعدة.',
        ],
        bullets: [
          'أخطاء مثل السياق غير الآمن أو رفض الإذن كثيرًا ما تمر بصمت دون أي أثر.',
          'يستغرق النسخ بضع أجزاء من الثانية، فيظهر نص "جارٍ النسخ…" لإطار واحد ويتغير حجم الزر.',
          'أزرار النسخ المخفية بـ display: none عند المرور لا يمكن الوصول إليها بلوحة المفاتيح.',
          'نادرًا ما تُعلن النتيجة لمستخدمي قارئات الشاشة.',
          'قد لا يتطابق العرض على الخادم عندما يقرأ المكون الحافظة أثناء العرض.',
        ],
      },
      {
        id: 'approach',
        heading: 'النهج',
        body: [
          'بُنيت المكتبة على طبقات. تضم نواة مستقلة عن الإطار آلة حالات للنسخ، والتحقق من المحتوى، ومحول حافظة المتصفح، وتصنيف الأخطاء. وتضيف طبقة React خطافات ومكون CopyField مركبًا فوق تلك النواة.',
          'كل حالة صريحة وقابلة للمراقبة: idle وcopying وcopied وerror. وتفصل حالتان بين المنطق والعرض: تتغير الحالة الفعلية فورًا للمنطق والاختبارات، بينما لا تُظهر حالة العرض "جارٍ النسخ…" إلا عندما يكون النسخ بطيئًا ثم تبقيها مدة كافية لتجنب الوميض.',
        ],
        bullets: [
          'تنسخ النص وHTML الغني مع نص بديل إلزامي وصور PNG وJSON وعدة صيغ معًا.',
          'تلصق النص وHTML ولقطات الشاشة عبر usePaste، واللصق بلوحة المفاتيح لا يطلب إذنًا.',
          'ينسق CopyGroup الصفوف بحيث يظهر "تم النسخ" في صف واحد فقط في كل مرة.',
          'تنسخ نقطة دخول الالتقاط عنصر SVG أو جزءًا من الواجهة كصورة PNG.',
          'تتيح المحولات المخصصة لبيئات مثل Electron توفير حافظتها الخاصة.',
        ],
      },
      {
        id: 'accessibility',
        heading: 'قرارات إمكانية الوصول',
        body: [
          'قواعد الإتاحة جزء من المكونات نفسها، لا توثيقًا على الفريق تذكره. زر التشغيل دائمًا زر حقيقي، ويبقى اسمه المتاح ثابتًا بينما تُعلن النتيجة بشكل منفصل.',
        ],
        bullets: [
          'يمكن الوصول إلى الأزرار بمفتاح Tab وتفعيلها بمفتاح Enter أو المسافة.',
          'تبقى الإجراءات المخفية في DOM وترتيب التنقل، وتُخفى بالشفافية وليس بـ display: none.',
          'يثبت تركيز لوحة المفاتيح الإظهار، أما نقرة الفأرة فلا.',
          'لا يُعطل الزر أثناء النسخ، فلا يضيع تركيز لوحة المفاتيح.',
          'تُركب المنطقة الحية قبل رسالتها الأولى حتى لا يضيع الإعلان الأول.',
          'تحترم الحركات تفضيل prefers-reduced-motion.',
        ],
      },
      {
        id: 'reliability',
        heading: 'الأخطاء وSSR والحجم',
        body: [
          'كل فشل خطأ مصنف ومضبوط النوع مثل unsupported وinsecure-context وpermission-denied وnot-focused وunsupported-format وtoo-large، ويوضح كل منها هل تفيد إعادة المحاولة. لا شيء يفشل بصمت.',
          'تأتي نقطة دخول React مع "use client" ولا تصل إلى window أثناء العرض، فيتطابق عرض الخادم وأول عرض للعميل في Next.js. لا تملك الحزمة اعتماديات وقت تشغيل، ويذكر README نحو 3.5 كيلوبايت لـ useCopy و5.6 كيلوبايت لكل ميزات النسخ بعد التصغير والضغط بـ Brotli.',
        ],
      },
    ],
    outcomes: [
      'منشورة على npm باسم react-smart-copy بترخيص MIT، مع توثيق وعرض حي على GitHub Pages.',
      'تدعم نسخ النص وHTML الغني وPNG وJSON والمحتوى متعدد الصيغ، ولصق النص وHTML والصور.',
      'تستبدل فشل الحافظة الصامت بأخطاء مضبوطة الأنواع توضح هل تفيد إعادة المحاولة.',
      'تعمل في هذا الموقع عبر نواتها المستقلة عن الإطار لتشغيل أزرار النسخ دون تحميل React.',
    ],
    nextSteps: [
      'اقرأ التوثيق وجرّب العرض الحي.',
      'ثبّتها بالأمر npm install react-smart-copy.',
      'أبلغ عن المشكلات أو ساهم على GitHub.',
    ],
    relatedServices: [
      'مشروع واجهة React محدد',
      'هندسة نظام التصميم',
      'تدقيق إمكانية الوصول',
    ],
    project: projectLinks(reactSmartCopy, openSourceCopy.ar),
  },
};

export const reactSmartCopyProof: Record<Locale, readonly CaseStudyProof[]> = {
  en: [
    {
      id: 'role',
      heading: 'My role',
      items: [
        'Designed the API, state model, and accessibility contract, and wrote the library in strict TypeScript.',
        'Wrote the documentation, the support matrix of what browsers can and cannot copy, and the live demo.',
        'Published and maintain the package on npm under the MIT license.',
      ],
    },
    {
      id: 'constraints',
      heading: 'Constraints',
      items: [
        'The library could promise only what browsers actually support, and had to report everything else as a typed error.',
        'It had to stay unstyled and work with Tailwind, CSS modules, CSS-in-JS, and component libraries.',
        'It had to be safe for server rendering, React StrictMode, and both React 18 and 19.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Key decisions',
      items: [
        'Split a framework-agnostic core from the React layer so the same state machine runs anywhere.',
        'Separated the real status from the display status to prevent flicker and layout shift.',
        'Built keyboard access, stable names, and live-region announcements into the components by default.',
      ],
    },
  ],
  es: [
    {
      id: 'role',
      heading: 'Mi rol',
      items: [
        'Diseñé la API, el modelo de estados y el contrato de accesibilidad, y escribí la biblioteca en TypeScript estricto.',
        'Redacté la documentación, la matriz de lo que los navegadores pueden copiar y la demo.',
        'Publico y mantengo el paquete en npm bajo la licencia MIT.',
      ],
    },
    {
      id: 'constraints',
      heading: 'Restricciones',
      items: [
        'La biblioteca solo podía prometer lo que los navegadores admiten y debía reportar todo lo demás como un error tipado.',
        'Debía ser sin estilos y funcionar con Tailwind, CSS modules, CSS-in-JS y bibliotecas de componentes.',
        'Debía ser segura para renderizado en servidor, React StrictMode y React 18 y 19.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Decisiones clave',
      items: [
        'Separé un núcleo independiente del framework de la capa de React para que la misma máquina de estados funcione en cualquier entorno.',
        'Separé el estado real del estado visible para evitar parpadeos y cambios de tamaño.',
        'Integré por defecto el acceso por teclado, nombres estables y anuncios en región en vivo.',
      ],
    },
  ],
  ar: [
    {
      id: 'role',
      heading: 'دوري',
      items: [
        'صممت الواجهة البرمجية ونموذج الحالات وعقد الإتاحة، وكتبت المكتبة بلغة TypeScript الصارمة.',
        'كتبت التوثيق وجدول ما تستطيع المتصفحات نسخه وما لا تستطيع، والعرض الحي.',
        'أنشر الحزمة على npm وأتولى صيانتها بترخيص MIT.',
      ],
    },
    {
      id: 'constraints',
      heading: 'القيود',
      items: [
        'لم يكن للمكتبة أن تعد إلا بما تدعمه المتصفحات فعلًا، وأن تبلغ عن كل ما عداه كخطأ مضبوط النوع.',
        'كان عليها أن تبقى بلا تنسيقات وأن تعمل مع Tailwind وCSS modules وCSS-in-JS ومكتبات المكونات.',
        'كان عليها أن تكون آمنة مع العرض على الخادم وReact StrictMode وReact 18 و19.',
      ],
    },
    {
      id: 'decisions',
      heading: 'القرارات الرئيسية',
      items: [
        'فصلت نواة مستقلة عن الإطار عن طبقة React لتعمل آلة الحالات نفسها في أي بيئة.',
        'فصلت الحالة الفعلية عن حالة العرض لمنع الوميض وتغير الحجم.',
        'دمجت الوصول بلوحة المفاتيح والأسماء الثابتة وإعلانات المنطقة الحية في المكونات افتراضيًا.',
      ],
    },
  ],
};

/** Facts below come from the react-inp-chunker 0.2.0 README and package.json. */
export const reactInpChunkerCaseStudy: Record<Locale, CaseStudyBase> = {
  en: {
    slug: 'react-inp-chunker',
    datePublished: '2026-10-30',
    dateModified: '2026-10-30',
    title: 'react-inp-chunker',
    seoTitle: 'react-inp-chunker Case Study | React INP Library',
    description:
      'How react-inp-chunker, an open-source TypeScript library, splits heavy React work into short slices and yields to the main thread to protect INP.',
    eyebrow: 'Case study · Open source',
    summary:
      'An open-source, headless React and TypeScript library that keeps heavy synchronous work from blocking user input. It processes work in time slices of a few milliseconds and yields to the main thread between them, so long-running updates do not cost Interaction to Next Paint (INP).',
    confidentialityNote:
      'This is a public open-source project. The source code, documentation, live playground, and releases are publicly available under the MIT license.',
    meta: [
      { label: 'Project type', value: 'Open-source React library on npm' },
      { label: 'Role', value: 'Author and maintainer' },
      { label: 'Primary focus', value: 'INP, main-thread scheduling, DX' },
      { label: 'Stack area', value: 'TypeScript, React 18+, Scheduler API' },
    ],
    tags: [
      'Open source',
      'React',
      'TypeScript',
      'INP',
      'Core Web Vitals',
      'npm package',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Context',
        body: [
          'One thread runs a page’s JavaScript, handles every click and key press, and paints the screen. Filtering thousands of rows, parsing a large CSV, or building a search index inside a React component holds that thread, and any input that arrives meanwhile waits in a queue.',
          'A task longer than 50 ms is a long task, and an interaction that lands in one is the most common way to fail Interaction to Next Paint (INP), the Core Web Vital for responsiveness.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problem',
        body: [
          'The work itself is often necessary and cannot simply be made faster. The goal was a small, typed primitive that makes sure the work never holds the main thread for more than a few milliseconds at a time, without asking teams to restructure their components.',
        ],
        bullets: [
          'A long synchronous loop blocks clicks, typing, and painting until it returns.',
          'Yielding by hand with nested setTimeout calls is clamped to a minimum delay of about 4 ms and spreads scheduling logic through components.',
          'Progress, pause, resume, and cancel have to reach React state without tearing under concurrent rendering.',
          'No state update may arrive after a component unmounts.',
        ],
      },
      {
        id: 'approach',
        heading: 'Approach',
        body: [
          'The library processes items back to back until the time slice (5 ms by default) is used up, or until the browser reports pending input. It then yields so the browser can handle input and paint, and resumes where it stopped.',
          'It yields with the best tool the browser has: scheduler.yield() where it is supported, MessageChannel in Safari and older browsers, and setTimeout(0) as the last resort.',
        ],
        bullets: [
          'useChunkedTask runs one function over a list and re-renders with progress once per slice, not once per item.',
          'useDeferredTask runs work written as a generator and pauses at each yield once the slice is used up.',
          'react-inp-chunker/core exposes createChunkScheduler and createDeferredTask without importing React, for plain TypeScript, a Web Worker, or a Node script.',
          'Both engines expose start, pause, resume, cancel, a subscribe and getSnapshot pair, and a settled promise that always resolves.',
          'batchSize and collectResults tune work at the extremes; most code needs neither.',
        ],
      },
      {
        id: 'guarantees',
        heading: 'Guarantees and developer feedback',
        body: [
          'A slice overruns by at most one item, or batchSize items if that option is raised, because the clock is read after every item. A settled task never reports its results a render late, nothing runs after cancel(), and no state update arrives after unmount.',
          'In development, a single item that blocks for more than 50 ms is reported with its index, and work cheap enough that the clock read dominates gets a batchSize suggestion. Both warnings are compiled out of the production build that bundlers select through the production export condition.',
        ],
      },
      {
        id: 'reliability',
        heading: 'Compatibility, quality, and footprint',
        body: [
          'The package supports React 18 and 19, Node 18, 20, 22, and 24, ESM and CommonJS, and server rendering, where both hooks render an idle state and run nothing. The test suite runs on both React majors at 100% statement, branch, function, and line coverage.',
          'It has no dependencies beyond React. The README reports 1.83 kB for useChunkedTask, 1.72 kB for useDeferredTask, 1.34 kB for createChunkScheduler without React, and 2.35 kB for everything, minified and compressed with Brotli. Releases are published from CI through npm Trusted Publishing with signed provenance.',
        ],
      },
    ],
    outcomes: [
      'Published on npm as react-inp-chunker under the MIT license, with documentation and a live playground on GitHub Pages.',
      'Provides two React hooks, useChunkedTask and useDeferredTask, and a React-free core that runs the same scheduling engine.',
      'Keeps each slice of work to a few milliseconds by default, so input handling and painting can run between slices.',
      'Checks its compatibility claims, including React 18 and 19, four Node versions, ESM, and CommonJS, on every push.',
    ],
    nextSteps: [
      'Read the documentation and try the live playground.',
      'Install it with npm install react-inp-chunker.',
      'Report issues or contribute on GitHub.',
    ],
    relatedServices: [
      'Frontend performance audit',
      'React and TypeScript architecture review',
      'SaaS dashboard development',
    ],
    project: projectLinks(reactInpChunker, reactInpChunkerCopy.en),
  },
  es: {
    slug: 'react-inp-chunker',
    datePublished: '2026-10-30',
    dateModified: '2026-10-30',
    title: 'react-inp-chunker',
    seoTitle: 'react-inp-chunker | Biblioteca de React para el INP',
    description:
      'Cómo react-inp-chunker, biblioteca TypeScript de código abierto, divide el trabajo pesado de React en franjas y cede el hilo principal para proteger el INP.',
    eyebrow: 'Caso de estudio · Código abierto',
    summary:
      'Una biblioteca de React y TypeScript headless y de código abierto que evita que el trabajo síncrono pesado bloquee la entrada del usuario. Procesa el trabajo en franjas de pocos milisegundos y cede el hilo principal entre ellas, para que las actualizaciones largas no perjudiquen la métrica Interaction to Next Paint (INP).',
    confidentialityNote:
      'Es un proyecto público de código abierto. El código, la documentación, el playground y las versiones están disponibles públicamente bajo la licencia MIT.',
    meta: [
      {
        label: 'Tipo de proyecto',
        value: 'Biblioteca React de código abierto en npm',
      },
      { label: 'Rol', value: 'Autor y mantenedor' },
      {
        label: 'Enfoque principal',
        value: 'INP, planificación del hilo principal, DX',
      },
      { label: 'Área técnica', value: 'TypeScript, React 18+, Scheduler API' },
    ],
    tags: [
      'Código abierto',
      'React',
      'TypeScript',
      'INP',
      'Core Web Vitals',
      'Paquete npm',
    ],
    sections: [
      {
        id: 'context',
        heading: 'Contexto',
        body: [
          'Un solo hilo ejecuta el JavaScript de una página, atiende cada clic y cada tecla y pinta la pantalla. Filtrar miles de filas, analizar un CSV grande o construir un índice de búsqueda dentro de un componente de React ocupa ese hilo, y cualquier interacción que llegue mientras tanto espera en una cola.',
          'Una tarea de más de 50 ms es una tarea larga, y una interacción que coincide con una es la causa más común de no superar Interaction to Next Paint (INP), la Core Web Vital de capacidad de respuesta.',
        ],
      },
      {
        id: 'problem',
        heading: 'Problema',
        body: [
          'El trabajo suele ser necesario y no siempre puede hacerse más rápido. El objetivo era una primitiva pequeña y tipada que garantice que el trabajo nunca ocupe el hilo principal más de unos milisegundos seguidos, sin obligar a los equipos a reestructurar sus componentes.',
        ],
        bullets: [
          'Un bucle síncrono largo bloquea los clics, la escritura y el pintado hasta que termina.',
          'Ceder el control a mano con setTimeout anidados tiene un retardo mínimo de unos 4 ms y reparte la lógica de planificación por los componentes.',
          'El progreso, la pausa, la reanudación y la cancelación deben llegar al estado de React sin inconsistencias en el renderizado concurrente.',
          'Ninguna actualización de estado puede llegar después de desmontar un componente.',
        ],
      },
      {
        id: 'approach',
        heading: 'Enfoque',
        body: [
          'La biblioteca procesa elementos uno tras otro hasta agotar la franja de tiempo (5 ms por defecto) o hasta que el navegador indica que hay una interacción pendiente. Entonces cede el control para que el navegador atienda la entrada y pinte, y continúa donde se detuvo.',
          'Cede el control con la mejor herramienta disponible en el navegador: scheduler.yield() donde se admite, MessageChannel en Safari y navegadores antiguos, y setTimeout(0) como último recurso.',
        ],
        bullets: [
          'useChunkedTask aplica una función a una lista y vuelve a renderizar con el progreso una vez por franja, no una vez por elemento.',
          'useDeferredTask ejecuta trabajo escrito como generador y se detiene en cada yield cuando se agota la franja.',
          'react-inp-chunker/core ofrece createChunkScheduler y createDeferredTask sin importar React, para TypeScript sin framework, un Web Worker o un script de Node.',
          'Ambos motores ofrecen start, pause, resume, cancel, un par subscribe y getSnapshot, y una promesa settled que siempre se resuelve.',
          'batchSize y collectResults ajustan los casos extremos; la mayoría del código no necesita ninguno.',
        ],
      },
      {
        id: 'guarantees',
        heading: 'Garantías y avisos para desarrollo',
        body: [
          'Una franja se excede como máximo en un elemento, o en batchSize elementos si se aumenta esa opción, porque el reloj se lee después de cada elemento. Una tarea terminada nunca informa de sus resultados un render tarde, nada se ejecuta después de cancel() y ninguna actualización de estado llega tras desmontar.',
          'En desarrollo, un elemento que bloquea más de 50 ms se informa con su índice, y el trabajo tan barato que domina la lectura del reloj recibe una sugerencia de batchSize. Ambos avisos se eliminan del build de producción que los bundlers eligen mediante la condición de exportación production.',
        ],
      },
      {
        id: 'reliability',
        heading: 'Compatibilidad, calidad y tamaño',
        body: [
          'El paquete admite React 18 y 19, Node 18, 20, 22 y 24, ESM y CommonJS, y renderizado en servidor, donde ambos hooks renderizan un estado inactivo y no ejecutan nada. La suite de pruebas se ejecuta en ambas versiones mayores de React con un 100% de cobertura de sentencias, ramas, funciones y líneas.',
          'No tiene dependencias además de React. El README indica 1,83 kB para useChunkedTask, 1,72 kB para useDeferredTask, 1,34 kB para createChunkScheduler sin React y 2,35 kB para todo, minificados y comprimidos con Brotli. Las versiones se publican desde CI mediante npm Trusted Publishing con procedencia firmada.',
        ],
      },
    ],
    outcomes: [
      'Publicado en npm como react-inp-chunker bajo la licencia MIT, con documentación y playground en GitHub Pages.',
      'Ofrece dos hooks de React, useChunkedTask y useDeferredTask, y un núcleo sin React que ejecuta el mismo motor de planificación.',
      'Mantiene cada franja de trabajo en pocos milisegundos por defecto, para que la entrada y el pintado puedan ejecutarse entre franjas.',
      'Comprueba en cada push su compatibilidad declarada, incluidos React 18 y 19, cuatro versiones de Node, ESM y CommonJS.',
    ],
    nextSteps: [
      'Lee la documentación y prueba el playground.',
      'Instálalo con npm install react-inp-chunker.',
      'Informa de problemas o contribuye en GitHub.',
    ],
    relatedServices: [
      'Auditoría de rendimiento frontend',
      'Revisión de arquitectura React y TypeScript',
      'Desarrollo de dashboards SaaS',
    ],
    project: projectLinks(reactInpChunker, reactInpChunkerCopy.es),
  },
  // TODO(ar-review): confirm the Arabic technical phrasing in this study:
  // "إعادة التحكم إلى الخيط الرئيسي" (yield to the main thread), "شريحة زمنية"
  // (time slice), "مهمة طويلة" (long task), "التمزق" (tearing) and
  // "ساحة التجربة الحية" (live playground).
  ar: {
    slug: 'react-inp-chunker',
    datePublished: '2026-10-30',
    dateModified: '2026-10-30',
    title: 'react-inp-chunker',
    seoTitle: 'react-inp-chunker | مكتبة React لحماية مؤشر INP',
    description:
      'كيف تقسم react-inp-chunker، وهي مكتبة TypeScript مفتوحة المصدر، عمل React الثقيل إلى شرائح قصيرة وتعيد التحكم إلى الخيط الرئيسي لحماية مؤشر INP.',
    eyebrow: 'دراسة حالة · مفتوح المصدر',
    summary:
      'مكتبة React وTypeScript مفتوحة المصدر وبلا واجهة مفروضة تمنع العمل المتزامن الثقيل من حجب تفاعل المستخدم. تعالج العمل في شرائح زمنية من بضع أجزاء من الثانية وتعيد التحكم إلى الخيط الرئيسي بينها، فلا تضر التحديثات الطويلة بمؤشر Interaction to Next Paint (INP).',
    confidentialityNote:
      'هذا مشروع عام مفتوح المصدر. الشيفرة والتوثيق وساحة التجربة الحية والإصدارات متاحة للجميع بموجب ترخيص MIT.',
    meta: [
      { label: 'نوع المشروع', value: 'مكتبة React مفتوحة المصدر على npm' },
      { label: 'الدور', value: 'المؤلف والمشرف على الصيانة' },
      {
        label: 'التركيز الأساسي',
        value: 'مؤشر INP وجدولة الخيط الرئيسي وتجربة المطور',
      },
      { label: 'النطاق التقني', value: 'TypeScript وReact 18+ وScheduler API' },
    ],
    tags: [
      'مفتوح المصدر',
      'React',
      'TypeScript',
      'INP',
      'Core Web Vitals',
      'حزمة npm',
    ],
    sections: [
      {
        id: 'context',
        heading: 'السياق',
        body: [
          'يشغّل خيط واحد شيفرة JavaScript في الصفحة، ويعالج كل نقرة وكل ضغطة مفتاح، ويرسم الشاشة. تصفية آلاف الصفوف أو تحليل ملف CSV كبير أو بناء فهرس بحث داخل مكون React يشغل ذلك الخيط، وأي تفاعل يصل في أثناء ذلك ينتظر في طابور.',
          'المهمة التي تتجاوز 50 ملي ثانية مهمة طويلة، والتفاعل الذي يقع في أثنائها هو أكثر الأسباب شيوعًا للإخفاق في مؤشر Interaction to Next Paint (INP)، وهو مقياس Core Web Vitals لسرعة الاستجابة.',
        ],
      },
      {
        id: 'problem',
        heading: 'المشكلة',
        body: [
          'كثيرًا ما يكون العمل نفسه ضروريًا ولا يمكن تسريعه ببساطة. كان الهدف أداة صغيرة مضبوطة الأنواع تضمن ألا يشغل العمل الخيط الرئيسي أكثر من بضع أجزاء من الثانية في كل مرة، دون أن تضطر الفرق إلى إعادة هيكلة مكوناتها.',
        ],
        bullets: [
          'تحجب الحلقة المتزامنة الطويلة النقرات والكتابة والرسم حتى تنتهي.',
          'إعادة التحكم يدويًا باستدعاءات setTimeout المتداخلة مقيدة بتأخير أدنى يقارب 4 ملي ثانية، وتوزع منطق الجدولة على المكونات.',
          'يجب أن يصل التقدم والإيقاف المؤقت والاستئناف والإلغاء إلى حالة React دون تمزق في العرض المتزامن.',
          'لا يجوز أن يصل أي تحديث للحالة بعد إزالة المكون.',
        ],
      },
      {
        id: 'approach',
        heading: 'النهج',
        body: [
          'تعالج المكتبة العناصر واحدًا تلو الآخر حتى تنفد الشريحة الزمنية (5 ملي ثانية افتراضيًا)، أو حتى يبلغ المتصفح عن تفاعل معلق. عندها تعيد التحكم ليعالج المتصفح الإدخال ويرسم، ثم تستأنف من حيث توقفت.',
          'تعيد التحكم بأفضل أداة يوفرها المتصفح: scheduler.yield() حيث يكون مدعومًا، وMessageChannel في Safari والمتصفحات الأقدم، وsetTimeout(0) كحل أخير.',
        ],
        bullets: [
          'يطبق useChunkedTask دالة واحدة على قائمة، ويعيد العرض مع التقدم مرة واحدة لكل شريحة لا لكل عنصر.',
          'يشغّل useDeferredTask عملًا مكتوبًا كمولّد، ويتوقف عند كل yield عندما تنفد الشريحة.',
          'توفر react-inp-chunker/core الدالتين createChunkScheduler وcreateDeferredTask دون استيراد React، لاستخدامهما مع TypeScript فقط أو داخل Web Worker أو في سكربت Node.',
          'يوفر المحركان start وpause وresume وcancel، والزوج subscribe وgetSnapshot، ووعد settled يُحسم دائمًا.',
          'يضبط الخياران batchSize وcollectResults الحالات القصوى، ولا يحتاج معظم الشيفرة إلى أي منهما.',
        ],
      },
      {
        id: 'guarantees',
        heading: 'الضمانات وتنبيهات التطوير',
        body: [
          'لا تتجاوز الشريحة حدها بأكثر من عنصر واحد، أو بعدد batchSize من العناصر إذا رُفع هذا الخيار، لأن الساعة تُقرأ بعد كل عنصر. ولا تبلغ المهمة المكتملة عن نتائجها متأخرة بعرض واحد، ولا يعمل شيء بعد cancel()، ولا يصل أي تحديث للحالة بعد إزالة المكون.',
          'في بيئة التطوير، يُبلغ عن أي عنصر واحد يحجب الخيط أكثر من 50 ملي ثانية مع رقمه، ويحصل العمل الرخيص الذي تطغى عليه قراءة الساعة على اقتراح لقيمة batchSize. وتُزال التنبيهات كلها من نسخة الإنتاج التي تختارها أدوات الحزم عبر شرط التصدير production.',
        ],
      },
      {
        id: 'reliability',
        heading: 'التوافق والجودة والحجم',
        body: [
          'تدعم الحزمة React 18 و19، وNode 18 و20 و22 و24، وESM وCommonJS، والعرض على الخادم حيث يعرض الخطافان حالة خاملة ولا يشغّلان شيئًا. وتعمل مجموعة الاختبارات على الإصدارين الرئيسيين من React بتغطية 100% للعبارات والفروع والدوال والأسطر.',
          'لا تعتمد الحزمة على شيء غير React. ويذكر README حجم 1.83 كيلوبايت لـ useChunkedTask و1.72 كيلوبايت لـ useDeferredTask و1.34 كيلوبايت لـ createChunkScheduler دون React و2.35 كيلوبايت للحزمة كاملة بعد التصغير والضغط بـ Brotli. وتُنشر الإصدارات من CI عبر npm Trusted Publishing مع إثبات مصدر موقّع.',
        ],
      },
    ],
    outcomes: [
      'منشورة على npm باسم react-inp-chunker بترخيص MIT، مع توثيق وساحة تجربة حية على GitHub Pages.',
      'توفر خطافين لـ React هما useChunkedTask وuseDeferredTask، ونواة لا تعتمد على React تشغّل محرك الجدولة نفسه.',
      'تُبقي كل شريحة عمل في حدود بضع أجزاء من الثانية افتراضيًا، فيمكن معالجة الإدخال والرسم بين الشرائح.',
      'تتحقق في كل دفع من ادعاءات التوافق، ومنها React 18 و19 وأربعة إصدارات من Node وESM وCommonJS.',
    ],
    nextSteps: [
      'اقرأ التوثيق وجرّب ساحة التجربة الحية.',
      'ثبّتها بالأمر npm install react-inp-chunker.',
      'أبلغ عن المشكلات أو ساهم على GitHub.',
    ],
    relatedServices: [
      'تدقيق أداء الواجهات',
      'مراجعة معمارية React وTypeScript',
      'تطوير لوحات SaaS',
    ],
    project: projectLinks(reactInpChunker, reactInpChunkerCopy.ar),
  },
};

export const reactInpChunkerProof: Record<Locale, readonly CaseStudyProof[]> = {
  en: [
    {
      id: 'role',
      heading: 'My role',
      items: [
        'Designed the API, the scheduling engine, and the state model, and wrote the library in strict TypeScript.',
        'Wrote the documentation and the live playground, which runs the same work with and without chunking.',
        'Published and maintain the package on npm under the MIT license.',
      ],
    },
    {
      id: 'constraints',
      heading: 'Constraints',
      items: [
        'The library could not make the work faster, only make sure it never holds the main thread for more than a few milliseconds at a time.',
        'It had to stay headless and work in React 18 and 19, under server rendering, and outside React.',
        'Results had to stay consistent under concurrent React, with nothing running after cancel or unmount.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Key decisions',
      items: [
        'Split a React-free scheduling core from the hooks so the same engine runs in plain TypeScript, a Web Worker, or Node.',
        'Read the clock after every item to bound each slice overrun to one item, and added batchSize for work too cheap to time item by item.',
        'Chose the yield mechanism per browser: scheduler.yield(), then MessageChannel, then setTimeout.',
      ],
    },
  ],
  es: [
    {
      id: 'role',
      heading: 'Mi rol',
      items: [
        'Diseñé la API, el motor de planificación y el modelo de estados, y escribí la biblioteca en TypeScript estricto.',
        'Redacté la documentación y el playground, que ejecuta el mismo trabajo con y sin división en franjas.',
        'Publico y mantengo el paquete en npm bajo la licencia MIT.',
      ],
    },
    {
      id: 'constraints',
      heading: 'Restricciones',
      items: [
        'La biblioteca no podía hacer el trabajo más rápido, solo garantizar que nunca ocupe el hilo principal más de unos milisegundos seguidos.',
        'Debía ser headless y funcionar en React 18 y 19, con renderizado en servidor y fuera de React.',
        'Los resultados debían ser coherentes en React concurrente, sin nada en ejecución tras cancelar o desmontar.',
      ],
    },
    {
      id: 'decisions',
      heading: 'Decisiones clave',
      items: [
        'Separé un núcleo de planificación sin React de los hooks para que el mismo motor funcione en TypeScript, un Web Worker o Node.',
        'Leo el reloj después de cada elemento para limitar el exceso de cada franja a un elemento, y añadí batchSize para trabajo demasiado barato para medirlo elemento a elemento.',
        'Elegí el mecanismo para ceder el control según el navegador: scheduler.yield(), luego MessageChannel y luego setTimeout.',
      ],
    },
  ],
  ar: [
    {
      id: 'role',
      heading: 'دوري',
      items: [
        'صممت الواجهة البرمجية ومحرك الجدولة ونموذج الحالات، وكتبت المكتبة بلغة TypeScript الصارمة.',
        'كتبت التوثيق وساحة التجربة الحية التي تشغّل العمل نفسه مع التقسيم ودونه.',
        'أنشر الحزمة على npm وأتولى صيانتها بترخيص MIT.',
      ],
    },
    {
      id: 'constraints',
      heading: 'القيود',
      items: [
        'لم يكن بوسع المكتبة أن تجعل العمل أسرع، بل أن تضمن ألا يشغل الخيط الرئيسي أكثر من بضع أجزاء من الثانية في كل مرة.',
        'كان عليها أن تبقى بلا واجهة مفروضة وأن تعمل مع React 18 و19 ومع العرض على الخادم وخارج React.',
        'كان على النتائج أن تبقى متسقة في React المتزامن، دون أن يعمل شيء بعد الإلغاء أو إزالة المكون.',
      ],
    },
    {
      id: 'decisions',
      heading: 'القرارات الرئيسية',
      items: [
        'فصلت نواة جدولة لا تعتمد على React عن الخطافات ليعمل المحرك نفسه مع TypeScript أو داخل Web Worker أو في Node.',
        'أقرأ الساعة بعد كل عنصر لأحصر تجاوز كل شريحة في عنصر واحد، وأضفت batchSize للعمل الأرخص من أن يُقاس عنصرًا عنصرًا.',
        'اخترت آلية إعادة التحكم بحسب المتصفح: scheduler.yield() ثم MessageChannel ثم setTimeout.',
      ],
    },
  ],
};

/** SoftwareSourceCode JSON-LD for a project (no @context; the layout adds it). */
const getOpenSourceSchema = (
  project: OpenSourceProject,
  copy: OpenSourceCopy,
  details: { runtimePlatform: string; keywords: string },
  siteUrl: string,
  language: string,
) => ({
  '@type': 'SoftwareSourceCode',
  '@id': `${siteUrl}/#${project.id}`,
  name: project.name,
  description: copy.description,
  inLanguage: language,
  url: project.links.docs,
  codeRepository: project.links.repository,
  sameAs: [project.links.npm, project.links.repository],
  programmingLanguage: ['TypeScript', 'JavaScript'],
  runtimePlatform: details.runtimePlatform,
  license: 'https://opensource.org/licenses/MIT',
  isAccessibleForFree: true,
  keywords: details.keywords,
  author: { '@id': `${siteUrl}/#person` },
  maintainer: { '@id': `${siteUrl}/#person` },
});

export const getReactSmartCopySchema = (
  siteUrl: string,
  language: string,
  locale: Locale,
) =>
  getOpenSourceSchema(
    reactSmartCopy,
    openSourceCopy[locale],
    {
      runtimePlatform: 'React 18 and 19, modern browsers',
      keywords:
        'react, clipboard, copy to clipboard, paste, accessibility, typescript, headless',
    },
    siteUrl,
    language,
  );

export const getReactInpChunkerSchema = (
  siteUrl: string,
  language: string,
  locale: Locale,
) =>
  getOpenSourceSchema(
    reactInpChunker,
    reactInpChunkerCopy[locale],
    {
      runtimePlatform: 'React 18 and 19, modern browsers, Node.js 18+',
      keywords:
        'react, typescript, inp, interaction to next paint, core web vitals, performance, scheduler.yield, main thread, headless',
    },
    siteUrl,
    language,
  );

/** The project schema for an open-source case-study slug, if it has one. */
export const getOpenSourceSchemaForSlug = (
  slug: string,
  siteUrl: string,
  language: string,
  locale: Locale,
) => {
  if (slug === reactSmartCopy.id) {
    return getReactSmartCopySchema(siteUrl, language, locale);
  }
  if (slug === reactInpChunker.id) {
    return getReactInpChunkerSchema(siteUrl, language, locale);
  }
  return undefined;
};
