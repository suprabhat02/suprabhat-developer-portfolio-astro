import type { Locale } from './config';

type Messages = Record<string, string>;

const es: Messages = {
  skip: 'Saltar al contenido principal',
  'nav.primary': 'Navegación principal',
  'nav.mobile': 'Navegación móvil',
  language: 'Cambiar idioma',
  theme: 'Cambiar tema de color',
  menu: 'Menú',
  'nav.home': 'Inicio',
  'nav.about': 'Sobre mí',
  'nav.skills': 'Habilidades',
  'nav.experience': 'Experiencia',
  'nav.work': 'Proyectos',
  'nav.blog': 'Artículos',
  'nav.contact': 'Contacto',
  'nav.tools': 'Herramientas',
  'nav.recommendations': 'Recomendaciones',
  'nav.services': 'Servicios',
  'nav.faq': 'Preguntas frecuentes',
  'nav.accessibility': 'Accesibilidad',
  'nav.privacy': 'Privacidad',
  'home.eyebrow': 'Ingeniero frontend sénior · India',
  'home.tagline':
    'Rendimiento SaaS | React/Next.js | Core Web Vitals | Accesibilidad',
  'home.lead':
    'Creo interfaces SaaS rápidas y accesibles, paneles de datos y sitios web modernos con React, Next.js y TypeScript.',
  'home.about': 'Sobre mí',
  'home.aboutTitle': 'Ingeniería de interfaces útiles',
  'home.aboutBody':
    'Ayudo a los equipos a crear sistemas de UI rápidos, accesibles y mantenibles, con una arquitectura predecible, componentes reutilizables y presupuestos de rendimiento que funcionan en producción.',
  'home.expertise': 'Especialización',
  'home.skillsTitle': 'Sistemas frontend que perduran',
  'home.experience': 'Experiencia',
  'home.experienceTitle': 'Roles recientes',
  'home.toolbox': 'Herramientas',
  'home.toolsTitle': 'Stack de trabajo diario',
  'home.work': 'Proyectos seleccionados',
  'home.workTitle': 'Trabajo interno de producto',
  'home.recommendations': 'Recomendaciones',
  'home.recommendationsTitle': 'Palabras de colaboradores',
  'home.faq': 'Preguntas frecuentes',
  'home.faqTitle': 'Antes de comenzar',
  'home.contact': 'Iniciar una conversación',
  'home.contactTitle': '¿Tienes una interfaz de producto que mejorar?',
  'home.writing': 'Artículos destacados',
  'home.availability': 'Disponibilidad',
  'home.availabilityLead':
    'Disponible para trabajo freelance y por contrato a distancia en todo el mundo',
  'home.blogLead':
    'Guías prácticas sobre rendimiento, accesibilidad y entrega moderna de interfaces.',
  'home.allArticles': 'Todos los artículos',
  'home.readArticle': 'Leer artículo',
  'home.aboutStatement':
    'Ingeniero de software frontend con más de 6 años creando plataformas SaaS de alto rendimiento, paneles empresariales y sistemas de UI intensivos en datos. Especializado en React, TypeScript y Redux Toolkit, con capacidad full stack mediante FastAPI y PostgreSQL.',
  'home.experienceCta': 'Explorar experiencia',
  'home.expertiseLead':
    'Capacidad full stack, especializado en interfaces de alto rendimiento con API rápidas y seguras mediante tipos.',
  'home.skillsLead':
    'El stack técnico que utilizo para ofrecer sistemas de UI escalables, rápidos y accesibles.',
  'home.skillsCta': 'Hablemos de un reto técnico',
  'home.workLead':
    'Una muestra de trabajo interno de producto centrado en rendimiento, accesibilidad y sistemas de UI escalables.',
  'home.workNote':
    'Trabajo interno, descrito sin nombres de clientes, capturas ni información confidencial.',
  'home.workCta': 'Ver todo el trabajo interno',
  'home.recommendationsLead':
    'Lo que dicen los colaboradores de distintas disciplinas sobre trabajar juntos.',
  'home.recommendationsCta': 'Ver las seis recomendaciones',
  'home.faqLead':
    'Respuestas rápidas sobre servicios, precios y cómo podemos colaborar.',
  'home.ctaTag': '¿Listo para colaborar?',
  'home.ctaTitle': 'Construyamos algo rápido y accesible',
  'home.ctaLead':
    'Comparte un resumen y responderé con un plan claro, calendario y próximos pasos.',
  'home.contactLead':
    '¿Te interesa colaborar? Construyamos algo pulido juntos.',
  'home.contactOptions': 'Opciones de contacto',
  'home.contactForm': 'Formulario de contacto',
  'home.email': 'Correo electrónico',
  'home.message': 'Mensaje',
  'home.preferEmail': '¿Prefieres correo?',
  'home.copyright': 'Todos los derechos reservados.',
  'home.appearance': 'Apariencia',
  'home.dark': 'Oscuro',
  'home.light': 'Claro',
  'home.auto': 'Automático',
  'home.history': 'Historial laboral, más reciente primero',
  'home.promoted': 'Ascendido',
  'trait.performance.title': 'Rendimiento primero',
  'trait.performance.body':
    'Entrego con presupuestos de rendimiento, objetivos de Core Web Vitals y Lighthouse 100 como punto de partida, no como ocurrencia tardía.',
  'trait.accessibility.title': 'Accesibilidad por defecto',
  'trait.accessibility.body':
    'Cumplimiento de WCAG 2.2 AA, navegación por teclado, ARIA y pruebas con lectores de pantalla en cada entrega.',
  'trait.architecture.title': 'Arquitectura escalable',
  'trait.architecture.body':
    'Bibliotecas de componentes reutilizables, tokens de diseño y gestión de estado predecible que los equipos pueden mantener a largo plazo.',
  'trait.fullstack.title': 'Capacidad full stack',
  'trait.fullstack.body':
    'Backends FastAPI + PostgreSQL para plataformas con muchos datos y paneles en tiempo real, con responsabilidad de extremo a extremo.',
  'expertise.frontend.title': 'Ingeniería frontend',
  'expertise.frontend.body':
    'Interfaces SaaS escalables, paneles empresariales y experiencias de alto rendimiento: arquitectura React, sistemas de componentes, optimización de renderizado y accesibilidad desde el primer día.',
  'expertise.backend.title': 'Backend e integración de API',
  'expertise.backend.body':
    'API REST ligeras y rápidas con FastAPI y PostgreSQL para asumir de extremo a extremo plataformas con datos intensivos, paneles en tiempo real y arquitecturas API seguras.',
  'expertise.design.title': 'Sistemas de diseño y rendimiento',
  'expertise.design.body':
    'Arquitecturas de componentes y tokens de diseño escalables para que los equipos entreguen con confianza, con optimización de Core Web Vitals, auditorías de accesibilidad y Lighthouse 100.',
  'experience.topsoe.title': 'Ingeniero de software III',
  'experience.topsoe.b1':
    'Creo interfaces modernas y elegantes con React y TypeScript.',
  'experience.topsoe.b2':
    'Entrego estados de UI predecibles con Redux Toolkit.',
  'experience.topsoe.b3':
    'Colaboro con equipos multidisciplinares en un modelo híbrido.',
  'experience.cognizant.title': 'Asociado de proyectos',
  'experience.cognizant.b1': 'Desarrollé funciones de UI con TypeScript.',
  'experience.cognizant.b2':
    'Trabajé con flujos de datos respaldados por GraphQL.',
  'experience.cognizant.b3': 'Implementé interfaces modernas y adaptables.',
  'experience.trueblue.title': 'Desarrollador web de implementación',
  'experience.trueblue.b1':
    'Implementé actualizaciones de UI adaptables para experiencias web.',
  'experience.trueblue.b2':
    'Integré componentes y aseguré un comportamiento de UI coherente.',
  'experience.mobilecoderz.senior': 'Desarrollador frontend sénior',
  'experience.mobilecoderz.developer': 'Desarrollador frontend',
  'experience.mobilecoderz.senior.b1':
    'Creé experiencias frontend modernas con React y Next.js.',
  'experience.mobilecoderz.senior.b2':
    'Colaboré en la entrega de UI y la integración de componentes.',
  'experience.mobilecoderz.developer.b1':
    'Desarrollé interfaces adaptables y componentes de UI reutilizables.',
  'experience.mobilecoderz.developer.b2':
    'Trabajé con React, TypeScript y CSS moderno.',
  'experience.swaragh.title': 'Desarrollador de UI',
  'experience.swaragh.b1':
    'Creé interfaces adaptables con HTML, CSS y JavaScript.',
  'experience.swaragh.b2':
    'Construí interacciones con jQuery cuando era necesario.',
  'action.work': 'Ver proyectos seleccionados',
  'action.contact': 'Contactar',
  'action.moreAbout': 'Más sobre mi enfoque',
  'action.experience': 'Ver experiencia completa',
  'action.tools': 'Ver todas las herramientas',
  'action.start': 'Contactar con Suprabhat',
  'action.top': 'Volver arriba',
  'page.about.eyebrow': 'Sobre mí',
  'page.about.title': 'Diseñar con claridad, velocidad y acceso',
  'page.about.philosophy': 'Filosofía de diseño',
  'page.skills.eyebrow': 'Habilidades',
  'page.skills.title': 'Especialización en ingeniería frontend',
  'page.experience.eyebrow': 'Experiencia',
  'page.experience.title': 'Seis años entregando interfaces',
  'page.tools.eyebrow': 'Herramientas',
  'page.tools.title': 'Un stack de trabajo enfocado',
  'page.work.eyebrow': 'Proyectos',
  'page.work.title': 'Trabajo interno de producto seleccionado',
  'page.recommendations.eyebrow': 'Recomendaciones',
  'page.recommendations.title': 'Lo que dicen los colaboradores',
  'page.services.eyebrow': 'Servicios',
  'page.services.title': 'Servicios de ingeniería frontend',
  'page.faq.eyebrow': 'Preguntas frecuentes',
  'page.faq.title': 'Trabajar juntos',
  'page.contact.eyebrow': 'Contacto',
  'page.contact.title': 'Hablemos del trabajo',
  'page.accessibility.eyebrow': 'Accesibilidad',
  'page.accessibility.title': 'Características de accesibilidad',
  'page.accessibility.body':
    'Este sitio utiliza secciones semánticas, foco de teclado visible, un enlace para saltar al contenido, preferencias de movimiento reducido, títulos descriptivos y controles etiquetados.',
  'page.accessibility.contact':
    'El contenido sigue siendo legible y navegable sin JavaScript. Si encuentras una barrera, escribe a ',
  'page.privacy.eyebrow': 'Privacidad',
  'page.privacy.title': 'Privacidad del formulario de contacto',
  'page.privacy.body':
    'Este sitio no instala analítica. Al enviar el formulario, tu nombre, correo electrónico y mensaje se envían mediante Web3Forms para que Suprabhat pueda responder a tu consulta.',
  'page.privacy.contact':
    'No incluyas información personal sensible. También puedes escribir a ',
  'page.blog.eyebrow': 'Artículos',
  'page.blog.title': 'Artículos de ingeniería frontend',
  'page.blog.lead':
    'Guías prácticas sobre interfaces accesibles, rendimiento, arquitectura mantenible y entrega profesional de UI.',
  'footer.lead':
    'Ingeniero frontend sénior que crea interfaces de producto rápidas y accesibles.',
  'footer.navigate': 'Navegar',
  'footer.more': 'Más',
  'footer.legal': 'Legal',
  'form.name': 'Nombre',
  'form.email': 'Correo electrónico',
  'form.details': 'Detalles del proyecto',
  'form.send': 'Enviar consulta',
  'form.unavailable':
    'El formulario de contacto no está disponible en este entorno.',
  'form.emailSuprabhat': 'Enviar un correo a Suprabhat',
  'form.errorName': 'Introduce tu nombre.',
  'form.errorEmail': 'Introduce una dirección de correo electrónico válida.',
  'form.errorMessage': 'Cuéntame sobre el proyecto.',
  'form.unconfigured':
    'El formulario de contacto todavía no está configurado. Envía un correo directamente.',
  'form.sending': 'Enviando...',
  'form.success': '¡Mensaje enviado! Responderé en un día laborable.',
  'form.failure': 'Algo salió mal. Envía un correo directamente.',
  'form.networkError': 'Error de red. Envía un correo directamente.',
  'faq.services.q': '¿Qué servicios ofreces?',
  'faq.services.a':
    'Creo sitios web y aplicaciones frontend rápidas y accesibles, incluidos ingeniería de UI, sistemas de diseño, optimización de rendimiento y desarrollo con React/Next.js.',
  'faq.pricing.q': '¿Cómo estableces el precio de los proyectos?',
  'faq.pricing.a':
    'El precio se adapta al alcance y al calendario. Proporciono un presupuesto fijo tras una breve llamada de descubrimiento y un esquema claro de requisitos.',
  'faq.remote.q': '¿Aceptas trabajo internacional o remoto?',
  'faq.remote.a':
    'Sí. Colaboro remotamente con equipos de todo el mundo mediante actualizaciones asíncronas, hitos compartidos y seguimiento transparente del progreso.',
  'faq.timeline.q': '¿Cuál es el plazo habitual?',
  'faq.timeline.a':
    'Los plazos dependen de la complejidad, pero la mayoría de las páginas de destino tardan entre una y dos semanas, y los sitios o aplicaciones multipágina entre tres y seis semanas.',
  'faq.start.q': '¿Cómo iniciamos una colaboración?',
  'faq.start.a':
    'Envía un resumen mediante el formulario de contacto y responderé con próximos pasos, opciones de calendario y una propuesta detallada.',
};

const ar: Messages = {
  skip: 'انتقل إلى المحتوى الرئيسي',
  'nav.primary': 'التنقل الرئيسي',
  'nav.mobile': 'تنقل الجوال',
  language: 'تغيير اللغة',
  theme: 'تبديل سمة الألوان',
  menu: 'القائمة',
  'nav.home': 'الرئيسية',
  'nav.about': 'نبذة عني',
  'nav.skills': 'المهارات',
  'nav.experience': 'الخبرة',
  'nav.work': 'الأعمال',
  'nav.blog': 'المقالات',
  'nav.contact': 'تواصل',
  'nav.tools': 'الأدوات',
  'nav.recommendations': 'التوصيات',
  'nav.services': 'الخدمات',
  'nav.faq': 'الأسئلة الشائعة',
  'nav.accessibility': 'إمكانية الوصول',
  'nav.privacy': 'الخصوصية',
  'home.eyebrow': 'مهندس واجهات أمامية أول · الهند',
  'home.tagline':
    'أداء SaaS | React/Next.js | Core Web Vitals | إمكانية الوصول',
  'home.lead':
    'أبني واجهات SaaS سريعة ومتاحة ولوحات بيانات ومواقع حديثة باستخدام React وNext.js وTypeScript.',
  'home.about': 'نبذة عني',
  'home.aboutTitle': 'هندسة واجهات مفيدة',
  'home.aboutBody':
    'أساعد الفرق على تقديم أنظمة واجهات سريعة ومتاحة وقابلة للصيانة عبر معمارية واضحة ومكونات قابلة لإعادة الاستخدام وميزانيات أداء تصمد في الإنتاج.',
  'home.expertise': 'الخبرات',
  'home.skillsTitle': 'أنظمة واجهات أمامية متينة',
  'home.experience': 'الخبرة',
  'home.experienceTitle': 'الأدوار الحديثة',
  'home.toolbox': 'الأدوات',
  'home.toolsTitle': 'مجموعة العمل اليومية',
  'home.work': 'أعمال مختارة',
  'home.workTitle': 'عمل داخلي على المنتج',
  'home.recommendations': 'التوصيات',
  'home.recommendationsTitle': 'كلمات من المتعاونين',
  'home.faq': 'الأسئلة الشائعة',
  'home.faqTitle': 'قبل أن نبدأ',
  'home.contact': 'ابدأ محادثة',
  'home.contactTitle': 'هل لديك واجهة منتج تحتاج إلى تحسين؟',
  'home.writing': 'مقالات مختارة',
  'home.availability': 'التوافر',
  'home.availabilityLead':
    'متاح للعمل الحر والتعاقدي عن بُعد في جميع أنحاء العالم',
  'home.blogLead': 'أدلة عملية حول الأداء وإمكانية الوصول وتقديم واجهات حديثة.',
  'home.allArticles': 'كل المقالات',
  'home.readArticle': 'قراءة المقال',
  'home.aboutStatement':
    'مهندس برمجيات للواجهات الأمامية بخبرة تزيد على 6 سنوات في بناء منصات SaaS عالية الأداء ولوحات تحكم مؤسسية وأنظمة واجهات كثيفة البيانات. أتخصص في React وTypeScript وRedux Toolkit، مع خبرة شاملة عبر FastAPI وPostgreSQL.',
  'home.experienceCta': 'استكشف الخبرة',
  'home.expertiseLead':
    'خبرة شاملة مع تخصص في واجهات أمامية عالية الأداء مدعومة بواجهات API سريعة وآمنة الأنواع.',
  'home.skillsLead':
    'المجموعة التقنية التي أستخدمها لتقديم أنظمة واجهات قابلة للتوسع وسريعة ومتاحة.',
  'home.skillsCta': 'ناقش تحديًا تقنيًا',
  'home.workLead':
    'لمحة عن أعمال داخلية على المنتج تركز على الأداء وإمكانية الوصول وأنظمة واجهات قابلة للتوسع.',
  'home.workNote':
    'عمل داخلي، موصوف من دون أسماء عملاء أو لقطات شاشة أو تفاصيل سرية.',
  'home.workCta': 'عرض كل الأعمال الداخلية',
  'home.recommendationsLead':
    'ما يقوله شركاء العمل من مختلف التخصصات عن التعاون معًا.',
  'home.recommendationsCta': 'عرض التوصيات الست',
  'home.faqLead': 'إجابات سريعة عن الخدمات والتسعير وطرق التعاون.',
  'home.ctaTag': 'هل أنت مستعد للتعاون؟',
  'home.ctaTitle': 'لنصنع شيئًا سريعًا ومتاحًا',
  'home.ctaLead': 'أرسل موجزًا وسأرد بخطة واضحة وجدول زمني وخطوات تالية.',
  'home.contactLead': 'هل ترغب في التعاون؟ لنبنِ معًا شيئًا متقنًا.',
  'home.contactOptions': 'خيارات التواصل',
  'home.contactForm': 'نموذج التواصل',
  'home.email': 'البريد الإلكتروني',
  'home.message': 'الرسالة',
  'home.preferEmail': 'تفضل البريد الإلكتروني؟',
  'home.copyright': 'جميع الحقوق محفوظة.',
  'home.appearance': 'المظهر',
  'home.dark': 'داكن',
  'home.light': 'فاتح',
  'home.auto': 'تلقائي',
  'home.history': 'السجل المهني، الأحدث أولًا',
  'home.promoted': 'ترقية',
  'trait.performance.title': 'الأداء أولًا',
  'trait.performance.body':
    'أعتمد ميزانيات للأداء وأهداف Core Web Vitals ودرجة Lighthouse 100 كأساس للعمل، لا كفكرة لاحقة.',
  'trait.accessibility.title': 'إتاحة افتراضية',
  'trait.accessibility.body':
    'التزام WCAG 2.2 AA والتنقل بلوحة المفاتيح وARIA والاختبار بقارئات الشاشة في كل تسليم.',
  'trait.architecture.title': 'معمارية قابلة للتوسع',
  'trait.architecture.body':
    'مكتبات مكونات قابلة لإعادة الاستخدام ورموز تصميم وإدارة حالة واضحة يمكن للفرق امتلاكها على المدى الطويل.',
  'trait.fullstack.title': 'خبرة شاملة',
  'trait.fullstack.body':
    'واجهات خلفية FastAPI + PostgreSQL لمنصات كثيفة البيانات ولوحات تحكم فورية، مع مسؤولية كاملة من البداية إلى النهاية.',
  'expertise.frontend.title': 'هندسة الواجهات الأمامية',
  'expertise.frontend.body':
    'بناء واجهات SaaS قابلة للتوسع ولوحات تحكم مؤسسية وواجهات عالية الأداء: معمارية React وأنظمة المكونات وتحسين العرض والإتاحة منذ اليوم الأول.',
  'expertise.backend.title': 'الواجهة الخلفية وتكامل API',
  'expertise.backend.body':
    'بناء واجهات REST خفيفة وعالية الأداء باستخدام FastAPI وPostgreSQL لملكية كاملة لمنصات كثيفة البيانات ولوحات فورية ومعماريات API آمنة.',
  'expertise.design.title': 'أنظمة التصميم والأداء',
  'expertise.design.body':
    'إنشاء معماريات مكونات ورموز تصميم قابلة للتوسع لتقديم واثق، مع تحسين Core Web Vitals وتدقيق الإتاحة ودرجة Lighthouse 100.',
  'experience.topsoe.title': 'مهندس برمجيات III',
  'experience.topsoe.b1':
    'أبني واجهات حديثة وأنيقة باستخدام React وTypeScript.',
  'experience.topsoe.b2': 'أقدم حالة واجهة متوقعة باستخدام Redux Toolkit.',
  'experience.topsoe.b3': 'أتعاون مع فرق متعددة التخصصات ضمن بيئة عمل هجينة.',
  'experience.cognizant.title': 'مساعد مشاريع',
  'experience.cognizant.b1': 'طورت ميزات واجهة مستخدم باستخدام TypeScript.',
  'experience.cognizant.b2': 'عملت مع تدفقات بيانات مدعومة بـ GraphQL.',
  'experience.cognizant.b3': 'نفذت واجهات مستخدم حديثة ومتجاوبة.',
  'experience.trueblue.title': 'مطور ويب للتنفيذ',
  'experience.trueblue.b1': 'نفذت تحديثات واجهة متجاوبة لتجارب الويب.',
  'experience.trueblue.b2': 'دمجت المكونات وضمنت سلوكًا متسقًا للواجهة.',
  'experience.mobilecoderz.senior': 'مطور واجهات أمامية أول',
  'experience.mobilecoderz.developer': 'مطور واجهات أمامية',
  'experience.mobilecoderz.senior.b1':
    'أنشأت تجارب واجهات أمامية حديثة باستخدام React وNext.js.',
  'experience.mobilecoderz.senior.b2':
    'تعاونت في تقديم الواجهات وتكامل المكونات.',
  'experience.mobilecoderz.developer.b1':
    'طورت واجهات متجاوبة ومكونات واجهة قابلة لإعادة الاستخدام.',
  'experience.mobilecoderz.developer.b2':
    'عملت عبر React وTypeScript وCSS الحديث.',
  'experience.swaragh.title': 'مطور واجهات مستخدم',
  'experience.swaragh.b1':
    'أنشأت واجهات متجاوبة باستخدام HTML وCSS وJavaScript.',
  'experience.swaragh.b2': 'أنشأت تفاعلات باستخدام jQuery عند الحاجة.',
  'action.work': 'عرض الأعمال المختارة',
  'action.contact': 'تواصل',
  'action.moreAbout': 'المزيد عن منهجي',
  'action.experience': 'عرض الخبرة الكاملة',
  'action.tools': 'عرض كل الأدوات',
  'action.start': 'تواصل مع سوبراهات',
  'action.top': 'العودة للأعلى',
  'page.about.eyebrow': 'نبذة عني',
  'page.about.title': 'التصميم من أجل الوضوح والسرعة والإتاحة',
  'page.about.philosophy': 'فلسفة التصميم',
  'page.skills.eyebrow': 'المهارات',
  'page.skills.title': 'خبرة هندسة الواجهات الأمامية',
  'page.experience.eyebrow': 'الخبرة',
  'page.experience.title': 'ست سنوات في تقديم الواجهات',
  'page.tools.eyebrow': 'الأدوات',
  'page.tools.title': 'مجموعة عمل مركزة',
  'page.work.eyebrow': 'الأعمال',
  'page.work.title': 'أعمال داخلية مختارة للمنتج',
  'page.recommendations.eyebrow': 'التوصيات',
  'page.recommendations.title': 'ما يقوله المتعاونون',
  'page.services.eyebrow': 'الخدمات',
  'page.services.title': 'خدمات هندسة الواجهات الأمامية',
  'page.faq.eyebrow': 'الأسئلة الشائعة',
  'page.faq.title': 'العمل معًا',
  'page.contact.eyebrow': 'تواصل',
  'page.contact.title': 'دعنا نناقش العمل',
  'page.accessibility.eyebrow': 'إمكانية الوصول',
  'page.accessibility.title': 'ميزات إمكانية الوصول',
  'page.accessibility.body':
    'يستخدم هذا الموقع عناصر دلالية ومؤشر تركيز واضحًا للوحة المفاتيح ورابطًا لتجاوز المحتوى وتفضيلات تقليل الحركة وعناوين وصفية وعناصر تحكم معنونة.',
  'page.accessibility.contact':
    'يبقى المحتوى مقروءًا وقابلًا للتنقل دون JavaScript. إذا واجهت عائقًا، راسل ',
  'page.privacy.eyebrow': 'الخصوصية',
  'page.privacy.title': 'خصوصية نموذج الاتصال',
  'page.privacy.body':
    'لا يثبت هذا الموقع أدوات تحليلات. عند إرسال النموذج، يُرسل اسمك وبريدك الإلكتروني ورسالتك عبر Web3Forms ليتمكن سوبراهات من الرد على استفسارك.',
  'page.privacy.contact': 'لا تُدرج معلومات شخصية حساسة. يمكنك أيضًا مراسلة ',
  'page.blog.eyebrow': 'المقالات',
  'page.blog.title': 'مقالات هندسة الواجهات الأمامية',
  'page.blog.lead':
    'أدلة عملية حول الواجهات المتاحة والأداء والمعمارية القابلة للصيانة وتقديم واجهات احترافية.',
  'footer.lead': 'مهندس واجهات أمامية أول يبني واجهات منتجات سريعة ومتاحة.',
  'footer.navigate': 'التنقل',
  'footer.more': 'المزيد',
  'footer.legal': 'قانوني',
  'form.name': 'الاسم',
  'form.email': 'البريد الإلكتروني',
  'form.details': 'تفاصيل المشروع',
  'form.send': 'إرسال الاستفسار',
  'form.unavailable': 'نموذج الاتصال غير متاح في هذه البيئة.',
  'form.emailSuprabhat': 'مراسلة سوبراهات',
  'form.errorName': 'أدخل اسمك.',
  'form.errorEmail': 'أدخل عنوان بريد إلكتروني صحيحًا.',
  'form.errorMessage': 'أخبرني عن المشروع.',
  'form.unconfigured':
    'نموذج التواصل غير مُعد بعد. يرجى إرسال بريد إلكتروني مباشرةً.',
  'form.sending': 'جارٍ الإرسال...',
  'form.success': 'تم إرسال الرسالة! سأرد خلال يوم عمل واحد.',
  'form.failure': 'حدث خطأ ما. يرجى إرسال بريد إلكتروني مباشرةً.',
  'form.networkError': 'خطأ في الشبكة. يرجى إرسال بريد إلكتروني مباشرةً.',
  'faq.services.q': 'ما الخدمات التي تقدمها؟',
  'faq.services.a':
    'أبني مواقع وتطبيقات واجهات أمامية سريعة ومتاحة، بما في ذلك هندسة UI وأنظمة التصميم وتحسين الأداء وتطوير React/Next.js.',
  'faq.pricing.q': 'كيف تسعّر المشاريع؟',
  'faq.pricing.a':
    'يتحدد السعر حسب النطاق والجدول الزمني. أقدم عرضًا ثابتًا بعد مكالمة استكشافية قصيرة ومخطط متطلبات واضح.',
  'faq.remote.q': 'هل تقبل العمل الدولي أو عن بُعد؟',
  'faq.remote.a':
    'نعم. أتعاون عن بُعد مع فرق حول العالم عبر تحديثات غير متزامنة ومعالم مشتركة وتتبع واضح للتقدم.',
  'faq.timeline.q': 'ما هو الجدول الزمني المعتاد؟',
  'faq.timeline.a':
    'يعتمد الجدول الزمني على التعقيد، لكن معظم الصفحات المقصودة تستغرق من أسبوع إلى أسبوعين، والمواقع أو التطبيقات متعددة الصفحات من ثلاثة إلى ستة أسابيع.',
  'faq.start.q': 'كيف نبدأ التعاون؟',
  'faq.start.a':
    'أرسل ملخصًا عبر نموذج الاتصال وسأرد بالخطوات التالية وخيارات الجدول الزمني ومقترح تفصيلي.',
};

const messages: Partial<Record<Locale, Messages>> = { es, ar };

export const t = (locale: Locale, key: string, fallback: string) =>
  messages[locale]?.[key] ?? fallback;
