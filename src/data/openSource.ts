import type { Locale } from '../i18n/config';
import type { CaseStudy, CaseStudyProof } from './caseStudies';

/**
 * Open-source work. Facts are taken from the published npm package and its
 * README (react-smart-copy 1.1.0); update them when a release changes them.
 */

export interface OpenSourceLinks {
  readonly docs: string;
  readonly repository: string;
  readonly npm: string;
}

export interface OpenSourceProject {
  readonly id: 'react-smart-copy';
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

export const getOpenSourceCopy = (locale: Locale): OpenSourceCopy =>
  openSourceCopy[locale];

type CaseStudyBase = Omit<CaseStudy, 'proof'>;

const projectLinks = (copy: OpenSourceCopy): CaseStudy['project'] => ({
  install: reactSmartCopy.install,
  installLabel: copy.installLabel,
  linksLabel: copy.linksLabel,
  links: [
    { label: copy.docsLabel, href: reactSmartCopy.links.docs },
    { label: copy.repositoryLabel, href: reactSmartCopy.links.repository },
    { label: copy.npmLabel, href: reactSmartCopy.links.npm },
  ],
});

export const reactSmartCopyCaseStudy: Record<Locale, CaseStudyBase> = {
  en: {
    slug: 'react-smart-copy',
    title: 'react-smart-copy',
    seoTitle:
      'react-smart-copy Case Study | Accessible, Type-Safe React Clipboard Library',
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
          'The React entry ships with "use client" and never touches window during render, so server and first client render match in Next.js. The package has zero runtime dependencies, and the README reports about 3.2 kB for useCopy and 5.4 kB for all copy features, minified and compressed with Brotli.',
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
    project: projectLinks(openSourceCopy.en),
  },
  es: {
    slug: 'react-smart-copy',
    title: 'react-smart-copy',
    seoTitle:
      'Caso de estudio react-smart-copy | Biblioteca de portapapeles accesible y tipada para React',
    description:
      'Cómo react-smart-copy, una biblioteca de TypeScript de código abierto, gestiona copiar y pegar en React con errores tipados, anuncios accesibles y sin dependencias.',
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
          'La entrada de React incluye "use client" y nunca accede a window durante el render, así que el servidor y el primer render del cliente coinciden en Next.js. El paquete no tiene dependencias en tiempo de ejecución, y el README indica unos 3,2 kB para useCopy y 5,4 kB para todas las funciones de copia, minificados y comprimidos con Brotli.',
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
    project: projectLinks(openSourceCopy.es),
  },
  ar: {
    slug: 'react-smart-copy',
    title: 'react-smart-copy',
    seoTitle:
      'دراسة حالة react-smart-copy | مكتبة حافظة متاحة وآمنة الأنواع لـ React',
    description:
      'كيف تدير react-smart-copy، وهي مكتبة TypeScript مفتوحة المصدر، النسخ واللصق في React بأخطاء مضبوطة الأنواع وإعلانات متاحة ودون اعتماديات.',
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
          'تأتي نقطة دخول React مع "use client" ولا تصل إلى window أثناء العرض، فيتطابق عرض الخادم وأول عرض للعميل في Next.js. لا تملك الحزمة اعتماديات وقت تشغيل، ويذكر README نحو 3.2 كيلوبايت لـ useCopy و5.4 كيلوبايت لكل ميزات النسخ بعد التصغير والضغط بـ Brotli.',
        ],
      },
    ],
    outcomes: [
      'منشورة على npm باسم react-smart-copy بترخيص MIT، مع توثيق وعرض حي على GitHub Pages.',
      'تدعم نسخ النص وHTML الغني وPNG وJSON والمحتوى متعدد الصيغ، ولصق النص وHTML والصور.',
      'تستبدل فشل الحافظة الصامت بأخطاء مضبوطة الأنواع توضح هل تفيد إعادة المحاولة.',
      'تعمل في هذه المحفظة عبر نواتها المستقلة عن الإطار لتشغيل أزرار النسخ دون تحميل React.',
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
    project: projectLinks(openSourceCopy.ar),
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

/** SoftwareSourceCode JSON-LD for the project (no @context; the layout adds it). */
export const getReactSmartCopySchema = (
  siteUrl: string,
  language: string,
  locale: Locale,
) => ({
  '@type': 'SoftwareSourceCode',
  '@id': `${siteUrl}/#${reactSmartCopy.id}`,
  name: reactSmartCopy.name,
  description: openSourceCopy[locale].description,
  inLanguage: language,
  url: reactSmartCopy.links.docs,
  codeRepository: reactSmartCopy.links.repository,
  sameAs: [reactSmartCopy.links.npm, reactSmartCopy.links.repository],
  programmingLanguage: ['TypeScript', 'JavaScript'],
  runtimePlatform: 'React 18 and 19, modern browsers',
  license: 'https://opensource.org/licenses/MIT',
  isAccessibleForFree: true,
  keywords:
    'react, clipboard, copy to clipboard, paste, accessibility, typescript, headless',
  author: { '@id': `${siteUrl}/#person` },
  maintainer: { '@id': `${siteUrl}/#person` },
});
