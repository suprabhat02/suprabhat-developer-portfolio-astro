import type { Locale } from '../i18n/config';
import type { CaseStudy, CaseStudyProof } from './caseStudies';

type CaseStudyBase = Omit<CaseStudy, 'proof'>;

export const additionalCaseStudies: Record<Locale, readonly CaseStudyBase[]> = {
  en: [
    {
      slug: 'portfolio-seo-i18n-system',
      title: 'Portfolio SEO and i18n system',
      seoTitle:
        'Portfolio SEO and i18n System Case Study | Astro, Hreflang, Structured Data',
      description:
        'A frontend architecture case study showing how a static Astro portfolio became localized, crawlable, accessible, and performance-focused without client-side content dependencies.',
      eyebrow: 'Case study · Portfolio architecture',
      summary:
        'A production portfolio architecture designed for recruiters, search engines, assistive technology, and AI crawlers. The work turned localized pages, case studies, schema, navigation, and content discovery into one coherent static system.',
      confidentialityNote:
        'This is a public portfolio-system case study. Private implementation notes, unpublished analytics, credentials, and third-party service details are intentionally excluded.',
      meta: [
        { label: 'Project type', value: 'Astro portfolio and SEO system' },
        { label: 'Role', value: 'Frontend architect and technical writer' },
        {
          label: 'Primary focus',
          value: 'i18n, structured data, crawlability',
        },
        { label: 'Stack area', value: 'Astro, TypeScript, static rendering' },
      ],
      tags: [
        'Astro',
        'Technical SEO',
        'i18n',
        'hreflang',
        'Structured data',
        'Static performance',
      ],
      sections: [
        {
          id: 'context',
          heading: 'Context',
          body: [
            'A portfolio has to do more than look polished. It must help recruiters understand role fit quickly, help search engines discover every important page, and help crawlers extract accurate structured meaning from static HTML.',
            'The existing foundation already used Astro and strong metadata, but the site needed stronger localized content depth, clearer case-study entry points, consistent recruiter hierarchy, and crawlable relationships between homepage, work pages, articles, and language alternates.',
          ],
        },
        {
          id: 'problem',
          heading: 'Problem',
          body: [
            'Portfolio sites often fail when they treat SEO, i18n, accessibility, and performance as separate checklists. That creates pages that may validate technically but still feel thin, hard to navigate, or inconsistent across locales.',
            'The challenge was to improve discovery and credibility without adding heavy JavaScript, visual instability, or a different UI model for each language.',
          ],
          bullets: [
            'Recruiters needed a faster path from hero message to proof, stack, experience, and case studies.',
            'Localized pages needed equivalent structure, not partial copies with mixed-language sections.',
            'Case studies needed clear role, constraints, decisions, outcomes, and related service signals.',
            'Search engines needed stable canonical URLs, alternates, semantic headings, and structured data.',
          ],
        },
        {
          id: 'approach',
          heading: 'Approach',
          body: [
            'The architecture was treated as a content system, not a collection of separate pages. Reusable localized data powers homepage work cards, work index pages, dynamic case-study routes, page metadata, and structured content surfaces.',
            'The implementation kept the important content in server-rendered HTML. Language switching, headings, links, cards, and case-study details remain crawlable without waiting for client-side hydration.',
          ],
          bullets: [
            'Used typed content records so every locale exposes the same page model and proof structure.',
            'Kept case-study URLs predictable across English, Spanish, and Arabic routes.',
            'Linked homepage work cards and index pages directly to detail pages for crawler and user reachability.',
            'Used semantic sections, lists, breadcrumbs, and table-of-contents links to make pages easy to parse.',
          ],
        },
        {
          id: 'localization',
          heading: 'Localization and RTL decisions',
          body: [
            'Localization was handled as full page parity rather than translated labels only. Spanish and Arabic versions receive localized titles, descriptions, summaries, proof panels, outcomes, next steps, service tags, and page navigation.',
            'Arabic typography required different spacing behavior from Latin content. The page rules avoid excessive letter spacing, preserve logical reading order, and allow long technical terms to wrap without causing horizontal overflow.',
          ],
          bullets: [
            'Localized visible content, metadata, accessibility labels, breadcrumbs, and CTA text.',
            'Preserved one shared layout system while respecting `lang` and `dir` attributes.',
            'Allowed technical terms such as Astro, TypeScript, SEO, and Core Web Vitals to remain readable inside Arabic copy.',
            'Used static links and language alternates instead of runtime-only route switching.',
          ],
        },
        {
          id: 'performance-seo',
          heading: 'Performance and SEO decisions',
          body: [
            'The system favors static rendering, typed data, predictable internal links, and minimal client-side behavior. This improves first paint reliability and makes the site understandable to search engines, accessibility tooling, and language-aware crawlers.',
            'The case-study model also supports richer structured data because each page has explicit headings, sections, article body text, keywords, related services, and language-specific metadata.',
          ],
          bullets: [
            'Kept portfolio proof content server-rendered and available in the initial HTML response.',
            'Avoided JavaScript-only content discovery for work, articles, and core navigation.',
            'Aligned page titles, meta descriptions, H1s, section headings, and JSON-LD with the same localized topic.',
            'Maintained Lighthouse-friendly layout stability by using stable spacing, responsive grids, and reduced motion rules.',
          ],
        },
        {
          id: 'lab-results',
          heading: 'Desktop lab results',
          body: [
            'A desktop Lighthouse lab run measured the public portfolio at 99 for Performance and 100 for Accessibility, Best Practices, and SEO. The same run reported First Contentful Paint at 0.6 seconds, Largest Contentful Paint at 0.8 seconds, Total Blocking Time at 0 milliseconds, and Cumulative Layout Shift at 0.001.',
            'The measured transfer payload was approximately 168 KiB with approximately 0 milliseconds of JavaScript execution. These figures describe one desktop laboratory run only. They are not field data and do not guarantee mobile, network, device, or global performance.',
          ],
          bullets: [
            'Performance: 99',
            'Accessibility: 100',
            'Best Practices: 100',
            'SEO: 100',
            'FCP: 0.6 s · LCP: 0.8 s · TBT: 0 ms · CLS: 0.001',
            'Approximate payload: 168 KiB · Approximate JavaScript execution: 0 ms',
          ],
        },
      ],
      outcomes: [
        'A stronger recruiter journey from hero summary to proof, case studies, experience, and contact.',
        'Six crawlable case-study pages per supported locale using one consistent content model.',
        'Localized SEO surfaces across titles, descriptions, internal links, structured data, and page copy.',
        'A maintainable architecture where future case studies can be added without duplicating page logic.',
      ],
      nextSteps: [
        'Add verified search-console insights after enough production data exists.',
        'Publish visual diagrams for the content and route model when useful for recruiters.',
        'Continue expanding case-study topics around measurable product and engineering work.',
      ],
      relatedServices: [
        'Astro portfolio architecture',
        'Technical SEO',
        'Internationalization',
        'Structured data implementation',
      ],
    },
    {
      slug: 'accessible-contact-workflow',
      title: 'Accessible contact workflow',
      seoTitle:
        'Accessible Contact Workflow Case Study | Lead UX, Forms, Privacy, Frontend',
      description:
        'A frontend case study about designing a low-friction contact workflow with accessible labels, validation, fallback contact paths, privacy clarity, and crawlable conversion content.',
      eyebrow: 'Case study · Conversion UX',
      summary:
        'A contact and lead-qualification workflow designed to make the next step obvious for clients while keeping the form accessible, lightweight, privacy-aware, and reliable when JavaScript or third-party form handling is unavailable.',
      confidentialityNote:
        'This case study describes implementation patterns and product decisions. Inquiry details, private messages, conversion data, and service-provider credentials are not included.',
      meta: [
        { label: 'Project type', value: 'Contact and lead workflow' },
        { label: 'Role', value: 'Frontend UX and accessibility engineering' },
        {
          label: 'Primary focus',
          value: 'Forms, fallback paths, trust signals',
        },
        { label: 'Stack area', value: 'Astro, HTML forms, progressive UX' },
      ],
      tags: [
        'Accessible forms',
        'Lead UX',
        'Progressive enhancement',
        'Privacy copy',
        'No-JS fallback',
        'Conversion clarity',
      ],
      sections: [
        {
          id: 'context',
          heading: 'Context',
          body: [
            'A portfolio contact flow is a product surface. It has to help a real person decide whether to start a conversation, explain what information is useful, and provide a fallback when embedded form delivery is unavailable.',
            'The goal was to create a lightweight workflow that supports recruiter messages, freelance project inquiries, and technical collaboration requests without turning the contact page into a complex application.',
          ],
        },
        {
          id: 'problem',
          heading: 'Problem',
          body: [
            'Many portfolio forms optimize for visual simplicity but miss practical failure states. Users may not know what to write, assistive technology may not get clear labels, and third-party form services can be unavailable in local or restricted environments.',
            'The workflow also needed to avoid dark-pattern conversion language. Clear expectations, privacy notes, and direct email fallback matter more than aggressive lead capture.',
          ],
          bullets: [
            'The form needed explicit labels, validation messages, and predictable keyboard behavior.',
            'The page needed a direct email path if the form provider was unavailable.',
            'The copy needed to tell visitors what project context to include.',
            'The implementation had to stay light enough for a static Astro site.',
          ],
        },
        {
          id: 'approach',
          heading: 'Approach',
          body: [
            'The contact workflow was structured around progressive reliability. The primary form remains semantic HTML, while supporting copy, labels, validation text, and fallback email routes remain visible and crawlable.',
            'Instead of hiding important instructions inside JavaScript behavior, the page explains the useful input upfront: project type, constraints, timing, and contact preference.',
          ],
          bullets: [
            'Used labeled fields and concise helper copy so the form is understandable without visual context.',
            'Kept fallback email links visible when form delivery cannot be configured safely.',
            'Localized contact labels and error messages so non-English routes are complete.',
            'Kept the conversion path short: understand fit, submit details, or use email directly.',
          ],
        },
        {
          id: 'accessibility',
          heading: 'Accessibility and trust decisions',
          body: [
            'The form design treats accessibility as part of trust. A user should be able to navigate by keyboard, understand required fields, recover from validation errors, and choose an alternate path without guessing.',
            'Privacy copy is intentionally plain. It explains what happens when a message is sent and discourages sending sensitive personal information through a project inquiry form.',
          ],
          bullets: [
            'Labels and validation copy use direct language instead of placeholder-only instructions.',
            'Contact options are exposed as real links, not only decorative icons.',
            'Error and success states are written as action-oriented feedback.',
            'The workflow avoids unnecessary analytics scripts on the contact path.',
          ],
        },
        {
          id: 'performance-seo',
          heading: 'Performance and SEO decisions',
          body: [
            'Contact pages are often excluded from SEO thinking, but they are important conversion and trust pages. This implementation keeps contact information, service fit, privacy notes, and fallback routes available in the initial document.',
            'The page avoids heavy client-side dependencies and keeps layout stable so mobile visitors can reach the form or email link without fighting popups, shifting content, or hidden controls.',
          ],
          bullets: [
            'Used semantic form markup and crawlable mail links.',
            'Kept the page readable without JavaScript-dependent rendering.',
            'Localized labels and support copy to preserve trust across languages.',
            'Avoided layout shifts around form state and contact option cards.',
          ],
        },
      ],
      outcomes: [
        'A clearer contact journey for recruiters, clients, and technical collaborators.',
        'Accessible form structure with localized labels, validation language, and fallback routes.',
        'Lower operational risk when a third-party form provider is unavailable.',
        'Better trust signals through explicit privacy, response, and project-context copy.',
      ],
      nextSteps: [
        'Measure real inquiry quality only through privacy-safe, consent-aware signals.',
        'Add optional project-type presets if future visitor behavior shows repeated patterns.',
        'Continue testing the contact path with keyboard-only and reduced-motion settings.',
      ],
      relatedServices: [
        'Accessible form engineering',
        'Conversion-focused frontend',
        'Progressive enhancement',
        'Privacy-aware UX writing',
      ],
    },
    {
      slug: 'frontend-quality-system',
      title: 'Frontend quality system',
      seoTitle:
        'Frontend Quality System Case Study | Accessibility, Playwright, Astro Checks',
      description:
        'A frontend engineering case study for a quality system that combines typed content, accessibility checks, crawlable routes, responsive layout validation, and static build confidence.',
      eyebrow: 'Case study · Engineering quality',
      summary:
        'A practical quality system designed to protect portfolio credibility: typed content data, static route generation, accessibility tests, visual consistency checks, internal-link coverage, and build-time feedback before changes reach production.',
      confidentialityNote:
        'This case study focuses on public engineering patterns. Private CI settings, credentials, deployment secrets, and unpublished monitoring details are excluded.',
      meta: [
        {
          label: 'Project type',
          value: 'Frontend quality and regression system',
        },
        { label: 'Role', value: 'Frontend architecture and test strategy' },
        {
          label: 'Primary focus',
          value: 'Accessibility, SEO, route confidence',
        },
        { label: 'Stack area', value: 'Astro, TypeScript, Playwright, axe' },
      ],
      tags: [
        'Playwright',
        'Accessibility testing',
        'Astro check',
        'Typed content',
        'SEO regression',
        'Responsive QA',
      ],
      sections: [
        {
          id: 'context',
          heading: 'Context',
          body: [
            'A polished portfolio can regress quickly when content, layout, localization, and SEO are edited at the same time. The site needed a quality layer that catches structural issues without requiring a heavy application runtime.',
            'The quality system had to support a static Astro architecture while validating the details that matter to recruiters and search engines: one H1, crawlable links, localized language attributes, accessible controls, stable responsive layouts, and working case-study routes.',
          ],
        },
        {
          id: 'problem',
          heading: 'Problem',
          body: [
            'Manual review is not enough for a multilingual portfolio. A small copy edit can break an Arabic layout, a route change can remove a case study from discovery, and a design tweak can create horizontal overflow on mobile.',
            'The challenge was to create meaningful checks that protect production quality without turning the project into a slow, over-engineered test suite.',
          ],
          bullets: [
            'Localized pages needed consistent shell, controls, and card styling.',
            'Dynamic case-study routes needed to remain reachable in every supported language.',
            'Accessibility rules needed automated coverage for core pages.',
            'Performance-sensitive architecture needed to avoid accidental Astro islands or client-side routing.',
          ],
        },
        {
          id: 'approach',
          heading: 'Approach',
          body: [
            'The system combines static typing, content-driven route generation, build-time checks, and focused browser tests. Each layer catches a different class of regression while keeping the runtime site simple.',
            'Tests emphasize user-visible and crawler-visible behavior rather than implementation trivia: headings, links, language attributes, structured data, image loading hints, theme controls, and horizontal overflow.',
          ],
          bullets: [
            'Typed case-study records make missing fields visible during development.',
            'Astro build checks validate pages before deployment.',
            'Playwright verifies crawlable routes, navigation behavior, localized controls, and responsive overflow.',
            'axe coverage catches accessibility violations on representative pages.',
          ],
        },
        {
          id: 'seo-accessibility',
          heading: 'SEO and accessibility decisions',
          body: [
            'The same structure that helps accessibility also helps crawlers. Clear headings, real links, semantic lists, language attributes, and server-rendered content make the site easier for people, search engines, and AI agents to interpret.',
            'The quality system therefore checks for discoverability and accessibility together instead of treating them as separate disciplines.',
          ],
          bullets: [
            'Verified that important routes use localized `lang` and `dir` attributes.',
            'Checked structured data for localized article body, proof sections, and outcomes.',
            'Guarded against accidental client-side-only navigation in the static shell.',
            'Kept visual consistency checks focused on shared tokens such as radius, cards, and controls.',
          ],
        },
        {
          id: 'performance',
          heading: 'Performance decisions',
          body: [
            'The quality approach protects performance by preventing accidental complexity. The site can remain mostly static, images can be optimized through Astro, and dynamic behavior can stay limited to necessary controls.',
            'Instead of adding more runtime monitoring code, the implementation prioritizes build confidence, stable HTML, and deterministic layouts that Lighthouse and real users can evaluate reliably.',
          ],
          bullets: [
            'Kept automated checks focused enough to run during normal development.',
            'Validated that non-hero images keep lazy loading and async decoding.',
            'Protected the zero-island static homepage expectation in browser tests.',
            'Checked horizontal overflow so mobile and RTL layouts remain stable.',
          ],
        },
      ],
      outcomes: [
        'A stronger safety net for accessibility, route reachability, localization, and SEO regressions.',
        'More confidence when adding new case-study content across English, Spanish, and Arabic.',
        'A static-first site architecture that avoids unnecessary hydration and runtime routing.',
        'A repeatable QA pattern for future portfolio and marketing-site work.',
      ],
      nextSteps: [
        'Add screenshot comparison only for high-risk components if visual regressions become frequent.',
        'Track Lighthouse reports during deployment when CI infrastructure is available.',
        'Expand tests around new content types as the blog and case-study library grows.',
      ],
      relatedServices: [
        'Frontend test strategy',
        'Accessibility QA',
        'SEO regression testing',
        'Static-site architecture',
      ],
    },
  ],
  es: [
    {
      slug: 'portfolio-seo-i18n-system',
      title: 'Sistema SEO e i18n para portfolio',
      seoTitle:
        'Caso de estudio de SEO e i18n para portfolio | Astro, hreflang y datos estructurados',
      description:
        'Caso de arquitectura frontend sobre cómo un portfolio Astro estático se volvió localizado, rastreable, accesible y orientado al rendimiento sin depender de contenido renderizado en cliente.',
      eyebrow: 'Caso de estudio · Arquitectura de portfolio',
      summary:
        'Una arquitectura de portfolio pensada para recruiters, motores de búsqueda, tecnologías de asistencia y crawlers de IA. El trabajo convirtió páginas localizadas, casos de estudio, schema, navegación y descubrimiento de contenido en un sistema estático coherente.',
      confidentialityNote:
        'Este es un caso de estudio público sobre el sistema del portfolio. Se excluyen notas privadas de implementación, analítica no publicada, credenciales y detalles de servicios externos.',
      meta: [
        { label: 'Tipo de proyecto', value: 'Portfolio Astro y sistema SEO' },
        { label: 'Rol', value: 'Arquitecto frontend y redactor técnico' },
        {
          label: 'Enfoque principal',
          value: 'i18n, datos estructurados y rastreo',
        },
        { label: 'Área técnica', value: 'Astro, TypeScript y render estático' },
      ],
      tags: [
        'Astro',
        'SEO técnico',
        'i18n',
        'hreflang',
        'Datos estructurados',
        'Rendimiento estático',
      ],
      sections: [
        {
          id: 'context',
          heading: 'Contexto',
          body: [
            'Un portfolio debe hacer más que verse pulido. Tiene que ayudar a recruiters a entender el encaje rápidamente, ayudar a buscadores a descubrir cada página importante y permitir que los crawlers extraigan significado estructurado desde HTML estático.',
            'La base existente ya usaba Astro y una capa sólida de metadatos, pero el sitio necesitaba más profundidad localizada, entradas más claras a casos de estudio, una jerarquía más útil para recruiters y relaciones rastreables entre inicio, proyectos, artículos y alternates de idioma.',
          ],
        },
        {
          id: 'problem',
          heading: 'Problema',
          body: [
            'Muchos portfolios fallan cuando tratan SEO, i18n, accesibilidad y rendimiento como listas separadas. El resultado puede validar técnicamente, pero sentirse superficial, difícil de navegar o inconsistente entre idiomas.',
            'El reto era mejorar descubrimiento y credibilidad sin añadir JavaScript pesado, inestabilidad visual ni un modelo de UI distinto para cada idioma.',
          ],
          bullets: [
            'Los recruiters necesitaban un camino más rápido desde el mensaje principal hasta pruebas, stack, experiencia y casos de estudio.',
            'Las páginas localizadas necesitaban estructura equivalente, no copias parciales con secciones mezcladas.',
            'Los casos de estudio necesitaban rol, restricciones, decisiones, resultados y servicios relacionados.',
            'Los buscadores necesitaban URLs canónicas, alternates, encabezados semánticos y datos estructurados.',
          ],
        },
        {
          id: 'approach',
          heading: 'Enfoque',
          body: [
            'La arquitectura se trató como un sistema de contenido, no como páginas separadas. Datos localizados y tipados alimentan tarjetas de inicio, índice de trabajo, rutas dinámicas de casos, metadatos y superficies estructuradas.',
            'La implementación mantiene el contenido importante en HTML renderizado por servidor. El cambio de idioma, encabezados, enlaces, tarjetas y detalles de casos siguen siendo rastreables sin hidratación del cliente.',
          ],
          bullets: [
            'Usé registros de contenido tipados para que cada idioma exponga el mismo modelo de página y prueba.',
            'Mantuve URLs predecibles para casos en inglés, español y árabe.',
            'Enlacé tarjetas de inicio e índices directamente a páginas de detalle para usuarios y crawlers.',
            'Usé secciones semánticas, listas, breadcrumbs y tabla de contenidos para facilitar el análisis.',
          ],
        },
        {
          id: 'localization',
          heading: 'Localización y decisiones RTL',
          body: [
            'La localización se trató como paridad completa de página, no solo como etiquetas traducidas. Las versiones en español y árabe reciben títulos, descripciones, resúmenes, paneles de prueba, resultados, próximos pasos, servicios y navegación localizados.',
            'La tipografía árabe requiere reglas de espaciado distintas al contenido latino. Las reglas evitan tracking excesivo, preservan el orden lógico de lectura y permiten que términos técnicos largos se partan sin crear overflow horizontal.',
          ],
          bullets: [
            'Localicé contenido visible, metadatos, etiquetas accesibles, breadcrumbs y CTA.',
            'Preservé un único sistema visual mientras se respetan `lang` y `dir`.',
            'Mantuve términos como Astro, TypeScript, SEO y Core Web Vitals legibles dentro del texto árabe.',
            'Usé enlaces estáticos y alternates de idioma en lugar de cambios de ruta solo por runtime.',
          ],
        },
        {
          id: 'performance-seo',
          heading: 'Decisiones de rendimiento y SEO',
          body: [
            'El sistema prioriza render estático, datos tipados, enlaces internos predecibles y comportamiento mínimo en cliente. Esto mejora la fiabilidad del primer render y hace el sitio entendible para buscadores, herramientas de accesibilidad y crawlers sensibles al idioma.',
            'El modelo de caso de estudio también permite datos estructurados más ricos porque cada página tiene encabezados, secciones, cuerpo de artículo, palabras clave, servicios relacionados y metadatos específicos de idioma.',
          ],
          bullets: [
            'Mantuve el contenido de prueba profesional renderizado en el HTML inicial.',
            'Evité descubrimiento de contenido dependiente solo de JavaScript.',
            'Alineé títulos, descripciones, H1, secciones y JSON-LD con el mismo tema localizado.',
            'Mantuve estabilidad visual con espaciados, grids responsive y reglas de movimiento reducido.',
          ],
        },
      ],
      outcomes: [
        'Un recorrido más claro para recruiters desde resumen inicial hasta pruebas, casos, experiencia y contacto.',
        'Seis páginas de caso de estudio rastreables por cada idioma soportado con un modelo consistente.',
        'Superficies SEO localizadas en títulos, descripciones, enlaces internos, datos estructurados y contenido.',
        'Una arquitectura mantenible donde futuros casos se agregan sin duplicar lógica de páginas.',
      ],
      nextSteps: [
        'Agregar datos verificados de Search Console cuando exista suficiente información en producción.',
        'Publicar diagramas visuales del modelo de contenido y rutas cuando aporten valor a recruiters.',
        'Seguir ampliando casos con trabajo de producto e ingeniería medible.',
      ],
      relatedServices: [
        'Arquitectura de portfolio en Astro',
        'SEO técnico',
        'Internacionalización',
        'Implementación de datos estructurados',
      ],
    },
    {
      slug: 'accessible-contact-workflow',
      title: 'Flujo de contacto accesible',
      seoTitle:
        'Caso de estudio de flujo de contacto accesible | UX de leads, formularios y privacidad',
      description:
        'Caso frontend sobre el diseño de un flujo de contacto con etiquetas accesibles, validación, vías alternativas, claridad de privacidad y contenido de conversión rastreable.',
      eyebrow: 'Caso de estudio · UX de conversión',
      summary:
        'Un flujo de contacto y calificación de leads diseñado para que el siguiente paso sea obvio para clientes, manteniendo el formulario accesible, ligero, claro sobre privacidad y fiable cuando JavaScript o el proveedor externo no están disponibles.',
      confidentialityNote:
        'Este caso describe patrones de implementación y decisiones de producto. No incluye consultas privadas, mensajes, datos de conversión ni credenciales del proveedor.',
      meta: [
        { label: 'Tipo de proyecto', value: 'Flujo de contacto y leads' },
        { label: 'Rol', value: 'Ingeniería frontend de UX y accesibilidad' },
        {
          label: 'Enfoque principal',
          value: 'Formularios, fallback y confianza',
        },
        {
          label: 'Área técnica',
          value: 'Astro, formularios HTML y UX progresiva',
        },
      ],
      tags: [
        'Formularios accesibles',
        'UX de leads',
        'Mejora progresiva',
        'Texto de privacidad',
        'Fallback sin JS',
        'Claridad de conversión',
      ],
      sections: [
        {
          id: 'context',
          heading: 'Contexto',
          body: [
            'Un flujo de contacto en un portfolio es una superficie de producto. Debe ayudar a una persona real a decidir si inicia una conversación, explicar qué información es útil y ofrecer una alternativa cuando el envío embebido no funciona.',
            'El objetivo fue crear un flujo ligero que soporte mensajes de recruiters, consultas freelance y solicitudes de colaboración técnica sin convertir la página en una aplicación compleja.',
          ],
        },
        {
          id: 'problem',
          heading: 'Problema',
          body: [
            'Muchos formularios de portfolio optimizan la simplicidad visual pero olvidan estados de fallo reales. El usuario puede no saber qué escribir, la tecnología asistiva puede recibir etiquetas pobres y los servicios externos pueden no estar disponibles en entornos restringidos.',
            'El flujo también debía evitar lenguaje agresivo de conversión. Expectativas claras, notas de privacidad y un email directo importan más que capturar leads a cualquier costo.',
          ],
          bullets: [
            'El formulario necesitaba etiquetas explícitas, mensajes de validación y navegación por teclado predecible.',
            'La página necesitaba email directo si el proveedor de formularios no estaba disponible.',
            'El texto debía explicar qué contexto del proyecto conviene incluir.',
            'La implementación tenía que seguir siendo ligera para un sitio Astro estático.',
          ],
        },
        {
          id: 'approach',
          heading: 'Enfoque',
          body: [
            'El flujo se estructuró alrededor de fiabilidad progresiva. El formulario principal sigue siendo HTML semántico, mientras que instrucciones, etiquetas, validación y rutas de email permanecen visibles y rastreables.',
            'En lugar de ocultar instrucciones dentro de JavaScript, la página explica desde el inicio el input útil: tipo de proyecto, restricciones, tiempos y preferencia de contacto.',
          ],
          bullets: [
            'Usé campos etiquetados y texto de ayuda conciso para que el formulario funcione sin contexto visual.',
            'Mantuve enlaces de email visibles cuando el envío no puede configurarse con seguridad.',
            'Localicé etiquetas y mensajes de error para que las rutas no inglesas sean completas.',
            'Reduje el camino de conversión: entender encaje, enviar detalles o usar email.',
          ],
        },
        {
          id: 'accessibility',
          heading: 'Accesibilidad y confianza',
          body: [
            'El diseño del formulario trata la accesibilidad como parte de la confianza. El usuario debe poder navegar con teclado, entender campos obligatorios, recuperarse de errores y elegir una alternativa sin adivinar.',
            'El texto de privacidad es deliberadamente claro. Explica qué ocurre al enviar un mensaje y desaconseja incluir información personal sensible en una consulta de proyecto.',
          ],
          bullets: [
            'Las etiquetas y validaciones usan lenguaje directo, no solo placeholders.',
            'Las opciones de contacto son enlaces reales, no únicamente iconos decorativos.',
            'Los estados de error y éxito se escriben como feedback accionable.',
            'El flujo evita scripts de analítica innecesarios en la ruta de contacto.',
          ],
        },
        {
          id: 'performance-seo',
          heading: 'Rendimiento y SEO',
          body: [
            'Las páginas de contacto suelen quedar fuera del SEO, pero son importantes para conversión y confianza. Esta implementación mantiene información de contacto, encaje de servicios, privacidad y rutas alternativas disponibles en el documento inicial.',
            'La página evita dependencias pesadas de cliente y mantiene layout estable para que usuarios móviles lleguen al formulario o email sin popups, saltos de contenido ni controles ocultos.',
          ],
          bullets: [
            'Usé marcado semántico de formulario y enlaces de correo rastreables.',
            'Mantuve la página legible sin renderizado dependiente de JavaScript.',
            'Localicé etiquetas y textos de apoyo para preservar confianza entre idiomas.',
            'Evité desplazamientos de layout alrededor de estados de formulario y tarjetas de contacto.',
          ],
        },
      ],
      outcomes: [
        'Un recorrido de contacto más claro para recruiters, clientes y colaboradores técnicos.',
        'Estructura de formulario accesible con etiquetas, validación y rutas alternativas localizadas.',
        'Menor riesgo operativo cuando un proveedor externo de formularios no está disponible.',
        'Mejores señales de confianza mediante texto explícito de privacidad, respuesta y contexto de proyecto.',
      ],
      nextSteps: [
        'Medir calidad de consultas solo con señales seguras, respetuosas de privacidad y consentimiento.',
        'Agregar presets opcionales de tipo de proyecto si el comportamiento futuro muestra patrones repetidos.',
        'Seguir probando el flujo con teclado y preferencias de movimiento reducido.',
      ],
      relatedServices: [
        'Ingeniería de formularios accesibles',
        'Frontend orientado a conversión',
        'Mejora progresiva',
        'UX writing con privacidad',
      ],
    },
    {
      slug: 'frontend-quality-system',
      title: 'Sistema de calidad frontend',
      seoTitle:
        'Caso de estudio de sistema de calidad frontend | Accesibilidad, Playwright y Astro',
      description:
        'Caso de ingeniería frontend para un sistema de calidad que combina contenido tipado, pruebas de accesibilidad, rutas rastreables, validación responsive y confianza de build estático.',
      eyebrow: 'Caso de estudio · Calidad de ingeniería',
      summary:
        'Un sistema práctico de calidad diseñado para proteger la credibilidad del portfolio: datos tipados, generación estática de rutas, pruebas de accesibilidad, consistencia visual, cobertura de enlaces internos y feedback de build antes de producción.',
      confidentialityNote:
        'Este caso se centra en patrones públicos de ingeniería. Se excluyen configuración privada de CI, credenciales, secretos de despliegue y monitoreo no publicado.',
      meta: [
        { label: 'Tipo de proyecto', value: 'Calidad frontend y regresión' },
        {
          label: 'Rol',
          value: 'Arquitectura frontend y estrategia de pruebas',
        },
        { label: 'Enfoque principal', value: 'Accesibilidad, SEO y rutas' },
        { label: 'Área técnica', value: 'Astro, TypeScript, Playwright y axe' },
      ],
      tags: [
        'Playwright',
        'Pruebas de accesibilidad',
        'Astro check',
        'Contenido tipado',
        'Regresión SEO',
        'QA responsive',
      ],
      sections: [
        {
          id: 'context',
          heading: 'Contexto',
          body: [
            'Un portfolio pulido puede romperse rápido cuando se editan contenido, layout, localización y SEO al mismo tiempo. El sitio necesitaba una capa de calidad que detectara problemas estructurales sin exigir un runtime pesado.',
            'El sistema debía soportar una arquitectura Astro estática mientras validaba detalles importantes para recruiters y buscadores: un solo H1, enlaces rastreables, atributos de idioma, controles accesibles, layouts responsive y rutas de casos funcionales.',
          ],
        },
        {
          id: 'problem',
          heading: 'Problema',
          body: [
            'La revisión manual no basta para un portfolio multilingüe. Una edición pequeña puede romper un layout árabe, un cambio de ruta puede ocultar un caso de estudio y un ajuste visual puede crear overflow horizontal en móvil.',
            'El reto fue crear comprobaciones relevantes que protejan calidad de producción sin convertir el proyecto en una suite lenta o sobrediseñada.',
          ],
          bullets: [
            'Las páginas localizadas necesitaban shell, controles y tarjetas consistentes.',
            'Las rutas dinámicas de casos debían seguir accesibles en cada idioma.',
            'Las reglas de accesibilidad necesitaban cobertura automatizada en páginas clave.',
            'La arquitectura sensible al rendimiento debía evitar islands o routing de cliente accidentales.',
          ],
        },
        {
          id: 'approach',
          heading: 'Enfoque',
          body: [
            'El sistema combina tipado estático, generación de rutas desde contenido, comprobaciones de build y pruebas de navegador enfocadas. Cada capa detecta una clase distinta de regresión y mantiene simple el runtime.',
            'Las pruebas priorizan comportamiento visible para usuarios y crawlers: encabezados, enlaces, atributos de idioma, datos estructurados, carga de imágenes, controles de tema y overflow horizontal.',
          ],
          bullets: [
            'Los registros tipados de casos hacen visibles campos faltantes durante desarrollo.',
            'Astro build valida páginas antes del despliegue.',
            'Playwright verifica rutas, navegación, controles localizados y overflow responsive.',
            'axe aporta cobertura contra violaciones de accesibilidad en páginas representativas.',
          ],
        },
        {
          id: 'seo-accessibility',
          heading: 'SEO y accesibilidad',
          body: [
            'La misma estructura que ayuda a la accesibilidad también ayuda a crawlers. Encabezados claros, enlaces reales, listas semánticas, atributos de idioma y contenido server-rendered facilitan la interpretación para personas, buscadores y agentes de IA.',
            'Por eso el sistema de calidad revisa descubrimiento y accesibilidad juntos en lugar de tratarlos como disciplinas aisladas.',
          ],
          bullets: [
            'Verifiqué que rutas importantes usen `lang` y `dir` localizados.',
            'Comprobé datos estructurados con cuerpo de artículo, pruebas y resultados localizados.',
            'Protegí contra navegación accidental solo de cliente en el shell estático.',
            'Mantuve pruebas de consistencia visual centradas en tokens compartidos como radios, tarjetas y controles.',
          ],
        },
        {
          id: 'performance',
          heading: 'Decisiones de rendimiento',
          body: [
            'El enfoque protege rendimiento evitando complejidad accidental. El sitio puede seguir siendo mayoritariamente estático, las imágenes pueden optimizarse mediante Astro y el comportamiento dinámico queda limitado a controles necesarios.',
            'En vez de añadir más código de monitoreo en runtime, la implementación prioriza confianza de build, HTML estable y layouts deterministas que Lighthouse y usuarios reales puedan evaluar de forma fiable.',
          ],
          bullets: [
            'Mantuve pruebas lo bastante enfocadas para ejecutarse durante desarrollo normal.',
            'Validé que imágenes no hero mantengan lazy loading y async decoding.',
            'Protegí la expectativa de homepage estática sin islands.',
            'Comprobé overflow horizontal para conservar estabilidad móvil y RTL.',
          ],
        },
      ],
      outcomes: [
        'Una red de seguridad más fuerte para accesibilidad, rutas, localización y regresiones SEO.',
        'Más confianza al agregar contenido de casos en inglés, español y árabe.',
        'Una arquitectura static-first que evita hidratación y routing innecesarios.',
        'Un patrón de QA repetible para futuros portfolios y sitios de marketing.',
      ],
      nextSteps: [
        'Agregar comparación visual solo en componentes de alto riesgo si aparecen regresiones frecuentes.',
        'Registrar reportes Lighthouse durante despliegue cuando exista infraestructura CI.',
        'Ampliar pruebas sobre nuevos tipos de contenido a medida que crezcan blog y casos.',
      ],
      relatedServices: [
        'Estrategia de pruebas frontend',
        'QA de accesibilidad',
        'Pruebas de regresión SEO',
        'Arquitectura de sitio estático',
      ],
    },
  ],
  ar: [
    {
      slug: 'portfolio-seo-i18n-system',
      title: 'نظام SEO وتدويل لمحفظة الأعمال',
      seoTitle:
        'دراسة حالة لنظام SEO وتدويل المحفظة | Astro وhreflang والبيانات المنظمة',
      description:
        'دراسة حالة في معمارية الواجهة توضح كيف أصبح موقع Astro ثابتًا ومحليًا وقابلًا للفهرسة ومتاحًا ومركزًا على الأداء دون الاعتماد على محتوى عميل ثقيل.',
      eyebrow: 'دراسة حالة · معمارية المحفظة',
      summary:
        'معمارية محفظة أعمال مصممة للمسؤولين عن التوظيف ومحركات البحث وتقنيات المساعدة وزواحف الذكاء الاصطناعي. جمع العمل الصفحات المحلية ودراسات الحالة وschema والتنقل واكتشاف المحتوى في نظام ثابت واحد.',
      confidentialityNote:
        'هذه دراسة عامة عن نظام المحفظة. لا تتضمن ملاحظات تنفيذ خاصة أو تحليلات غير منشورة أو بيانات اعتماد أو تفاصيل خدمات خارجية.',
      meta: [
        { label: 'نوع المشروع', value: 'محفظة Astro ونظام SEO' },
        { label: 'الدور', value: 'معماري واجهات وكاتب تقني' },
        {
          label: 'التركيز الأساسي',
          value: 'التدويل والبيانات المنظمة وقابلية الفهرسة',
        },
        { label: 'النطاق التقني', value: 'Astro وTypeScript والعرض الثابت' },
      ],
      tags: [
        'Astro',
        'SEO تقني',
        'i18n',
        'hreflang',
        'بيانات منظمة',
        'أداء ثابت',
      ],
      sections: [
        {
          id: 'context',
          heading: 'السياق',
          body: [
            'محفظة الأعمال لا يكفي أن تبدو مصقولة. يجب أن تساعد مسؤولي التوظيف على فهم الملاءمة بسرعة، وتساعد محركات البحث على اكتشاف كل صفحة مهمة، وتسمح للزواحف باستخراج معنى منظم من HTML ثابت.',
            'كانت القاعدة الحالية تستخدم Astro وطبقة بيانات وصفية جيدة، لكن الموقع احتاج إلى محتوى محلي أعمق، ومداخل أوضح لدراسات الحالة، وهرمية أفضل للتوظيف، وروابط قابلة للفهرسة بين الصفحة الرئيسية والأعمال والمقالات وبدائل اللغة.',
          ],
        },
        {
          id: 'problem',
          heading: 'المشكلة',
          body: [
            'تفشل مواقع المحافظ عندما تتعامل مع SEO والتدويل والإتاحة والأداء كقوائم منفصلة. قد تكون الصفحات صحيحة تقنيًا لكنها رقيقة أو صعبة التصفح أو غير متسقة بين اللغات.',
            'كان التحدي هو تحسين الاكتشاف والمصداقية دون إضافة JavaScript ثقيل أو حركة layout غير مستقرة أو نموذج واجهة مختلف لكل لغة.',
          ],
          bullets: [
            'احتاج مسؤولو التوظيف إلى مسار أسرع من الرسالة الرئيسية إلى الدليل والمهارات والخبرة ودراسات الحالة.',
            'احتاجت الصفحات المحلية إلى بنية مكافئة لا نسخًا جزئية بلغات مختلطة.',
            'احتاجت دراسات الحالة إلى دور وقيود وقرارات ونتائج وخدمات مرتبطة.',
            'احتاجت محركات البحث إلى روابط canonical وalternates وعناوين دلالية وبيانات منظمة.',
          ],
        },
        {
          id: 'approach',
          heading: 'النهج',
          body: [
            'تم التعامل مع المعمارية كنظام محتوى لا كمجموعة صفحات منفصلة. بيانات محلية typed تغذي بطاقات الصفحة الرئيسية وفهرس الأعمال ومسارات دراسات الحالة والبيانات الوصفية والأسطح المنظمة.',
            'يحافظ التنفيذ على المحتوى المهم داخل HTML المعروض من الخادم. تغيير اللغة والعناوين والروابط والبطاقات وتفاصيل الحالات تبقى قابلة للفهرسة دون انتظار hydration من العميل.',
          ],
          bullets: [
            'استخدمت سجلات محتوى typed حتى تعرض كل لغة نموذج الصفحة وإثبات المشروع نفسه.',
            'حافظت على URLs متوقعة لدراسات الحالة في الإنجليزية والإسبانية والعربية.',
            'ربطت بطاقات الصفحة الرئيسية وصفحات الفهرس مباشرة بصفحات التفاصيل للمستخدمين والزواحف.',
            'استخدمت أقسامًا دلالية وقوائم وbreadcrumbs وجدول محتويات لتسهيل الفهم.',
          ],
        },
        {
          id: 'localization',
          heading: 'التوطين وقرارات RTL',
          body: [
            'تم التعامل مع التوطين كتكافؤ كامل للصفحة، لا كترجمة تسميات فقط. تحصل النسخ الإسبانية والعربية على عناوين وأوصاف وملخصات ولوحات إثبات ونتائج وخطوات تالية وخدمات وتنقل محلي.',
            'تحتاج الطباعة العربية إلى سلوك تباعد مختلف عن المحتوى اللاتيني. القواعد تتجنب letter spacing الزائد، وتحافظ على ترتيب القراءة المنطقي، وتسمح للمصطلحات التقنية الطويلة بالالتفاف دون overflow أفقي.',
          ],
          bullets: [
            'تمت ترجمة المحتوى المرئي والبيانات الوصفية وتسميات الإتاحة وbreadcrumbs وCTA.',
            'تم الحفاظ على نظام تصميم واحد مع احترام `lang` و`dir`.',
            'بقيت مصطلحات مثل Astro وTypeScript وSEO وCore Web Vitals واضحة داخل النص العربي.',
            'استخدمت روابط ثابتة وبدائل لغة بدل تبديل مسارات يعتمد على runtime فقط.',
          ],
        },
        {
          id: 'performance-seo',
          heading: 'قرارات الأداء وSEO',
          body: [
            'يفضل النظام العرض الثابت والبيانات typed والروابط الداخلية المتوقعة وسلوك عميل محدود. هذا يحسن موثوقية أول عرض ويجعل الموقع مفهومًا لمحركات البحث وأدوات الإتاحة والزواحف الواعية باللغة.',
            'يدعم نموذج دراسة الحالة بيانات منظمة أغنى لأن كل صفحة تملك عناوين وأقسامًا ونص article body وكلمات مفتاحية وخدمات مرتبطة وبيانات لغة خاصة.',
          ],
          bullets: [
            'حافظت على محتوى الإثبات المهني معروضًا في HTML الأولي.',
            'تجنبت اكتشاف المحتوى المعتمد فقط على JavaScript.',
            'ربطت العناوين والوصف وH1 والأقسام وJSON-LD بالموضوع المحلي نفسه.',
            'حافظت على استقرار Lighthouse عبر مسافات ثابتة وشبكات responsive وقواعد reduced motion.',
          ],
        },
      ],
      outcomes: [
        'رحلة أوضح لمسؤولي التوظيف من الملخص إلى الدليل ودراسات الحالة والخبرة والتواصل.',
        'ست صفحات دراسات حالة قابلة للفهرسة لكل لغة مدعومة باستخدام نموذج محتوى واحد.',
        'أسطح SEO محلية عبر العناوين والأوصاف والروابط الداخلية والبيانات المنظمة والنص.',
        'معمارية قابلة للصيانة تسمح بإضافة حالات مستقبلية دون تكرار منطق الصفحات.',
      ],
      nextSteps: [
        'إضافة رؤى موثقة من Search Console بعد توفر بيانات إنتاج كافية.',
        'نشر مخططات مرئية لنموذج المحتوى والمسارات عندما تكون مفيدة للتوظيف.',
        'توسيع دراسات الحالة حول أعمال منتج وهندسة قابلة للقياس.',
      ],
      relatedServices: [
        'معمارية محافظ Astro',
        'SEO تقني',
        'التدويل',
        'تنفيذ البيانات المنظمة',
      ],
    },
    {
      slug: 'accessible-contact-workflow',
      title: 'مسار تواصل متاح',
      seoTitle:
        'دراسة حالة لمسار تواصل متاح | UX للعملاء المحتملين والنماذج والخصوصية',
      description:
        'دراسة Frontend حول تصميم مسار تواصل قليل الاحتكاك مع تسميات متاحة، تحقق، مسارات بديلة، وضوح خصوصية، ومحتوى تحويل قابل للفهرسة.',
      eyebrow: 'دراسة حالة · UX للتحويل',
      summary:
        'مسار تواصل وتأهيل عملاء محتملين يجعل الخطوة التالية واضحة للعملاء، مع إبقاء النموذج متاحًا وخفيفًا وواضحًا حول الخصوصية وموثوقًا عند غياب JavaScript أو مزود النموذج الخارجي.',
      confidentialityNote:
        'تصف هذه الدراسة أنماط التنفيذ وقرارات المنتج. لا تتضمن تفاصيل الاستفسارات أو الرسائل الخاصة أو بيانات التحويل أو بيانات اعتماد المزود.',
      meta: [
        { label: 'نوع المشروع', value: 'مسار تواصل وتأهيل عملاء' },
        { label: 'الدور', value: 'هندسة UX وإتاحة للواجهة' },
        { label: 'التركيز الأساسي', value: 'النماذج والمسارات البديلة والثقة' },
        { label: 'النطاق التقني', value: 'Astro ونماذج HTML وتحسين تدريجي' },
      ],
      tags: [
        'نماذج متاحة',
        'UX للعملاء المحتملين',
        'تحسين تدريجي',
        'نص الخصوصية',
        'بديل دون JS',
        'وضوح التحويل',
      ],
      sections: [
        {
          id: 'context',
          heading: 'السياق',
          body: [
            'مسار التواصل في المحفظة هو سطح منتج. يجب أن يساعد شخصًا حقيقيًا على قرار بدء محادثة، ويوضح المعلومات المفيدة، ويوفر بديلًا عندما لا يعمل إرسال النموذج المدمج.',
            'كان الهدف إنشاء مسار خفيف يدعم رسائل مسؤولي التوظيف واستفسارات العمل الحر وطلبات التعاون التقني دون تحويل صفحة التواصل إلى تطبيق معقد.',
          ],
        },
        {
          id: 'problem',
          heading: 'المشكلة',
          body: [
            'تركز نماذج كثيرة على البساطة البصرية لكنها تهمل حالات الفشل العملية. قد لا يعرف المستخدم ماذا يكتب، وقد لا تحصل تقنيات المساعدة على تسميات واضحة، وقد تتوقف خدمات النماذج في بيئات محلية أو مقيدة.',
            'احتاج المسار أيضًا إلى تجنب لغة تحويل مضللة. التوقعات الواضحة وملاحظات الخصوصية ورابط البريد المباشر أهم من التقاط lead بأي ثمن.',
          ],
          bullets: [
            'احتاج النموذج إلى تسميات صريحة ورسائل تحقق وسلوك لوحة مفاتيح متوقع.',
            'احتاجت الصفحة إلى مسار بريد مباشر إذا لم يكن مزود النموذج متاحًا.',
            'احتاج النص إلى توضيح سياق المشروع المطلوب من الزائر.',
            'كان التنفيذ يجب أن يبقى خفيفًا لموقع Astro ثابت.',
          ],
        },
        {
          id: 'approach',
          heading: 'النهج',
          body: [
            'تم بناء المسار حول موثوقية تدريجية. يبقى النموذج الأساسي HTML دلاليًا، بينما تظل التعليمات والتسميات ونص التحقق وروابط البريد ظاهرة وقابلة للفهرسة.',
            'بدل إخفاء التعليمات داخل JavaScript، تشرح الصفحة مبكرًا المعلومات المفيدة: نوع المشروع والقيود والتوقيت وتفضيل التواصل.',
          ],
          bullets: [
            'استخدمت حقولًا معنونة ونص مساعدة مختصرًا حتى يكون النموذج مفهومًا دون سياق بصري.',
            'حافظت على روابط البريد ظاهرة عندما لا يمكن تهيئة الإرسال بأمان.',
            'تمت ترجمة التسميات ورسائل الأخطاء حتى تكون المسارات غير الإنجليزية كاملة.',
            'بقي مسار التحويل قصيرًا: فهم الملاءمة، إرسال التفاصيل، أو استخدام البريد مباشرة.',
          ],
        },
        {
          id: 'accessibility',
          heading: 'الإتاحة والثقة',
          body: [
            'يتعامل تصميم النموذج مع الإتاحة كجزء من الثقة. يجب أن يستطيع المستخدم التنقل بلوحة المفاتيح، وفهم الحقول المطلوبة، والتعافي من أخطاء التحقق، واختيار مسار بديل دون تخمين.',
            'نص الخصوصية واضح عمدًا. يشرح ما يحدث عند إرسال الرسالة وينصح بعدم إرسال معلومات شخصية حساسة عبر نموذج استفسار مشروع.',
          ],
          bullets: [
            'تستخدم التسميات والتحقق لغة مباشرة بدل الاعتماد على placeholders فقط.',
            'خيارات التواصل روابط حقيقية وليست أيقونات زخرفية فقط.',
            'حالات الخطأ والنجاح مكتوبة كتغذية راجعة قابلة للتصرف.',
            'يتجنب المسار scripts تحليل غير ضرورية في صفحة التواصل.',
          ],
        },
        {
          id: 'performance-seo',
          heading: 'الأداء وSEO',
          body: [
            'غالبًا تُستبعد صفحات التواصل من تفكير SEO، لكنها مهمة للتحويل والثقة. يحافظ التنفيذ على معلومات التواصل وملاءمة الخدمات والخصوصية والمسارات البديلة داخل الوثيقة الأولية.',
            'تتجنب الصفحة اعتماديات عميل ثقيلة وتحافظ على layout مستقر حتى يصل مستخدمو الجوال إلى النموذج أو البريد دون نوافذ مزعجة أو قفزات محتوى أو عناصر مخفية.',
          ],
          bullets: [
            'استخدمت markup دلاليًا للنموذج وروابط بريد قابلة للفهرسة.',
            'حافظت على الصفحة قابلة للقراءة دون render يعتمد على JavaScript.',
            'ترجمت التسميات ونصوص الدعم للحفاظ على الثقة بين اللغات.',
            'تجنبت layout shifts حول حالات النموذج وبطاقات خيارات التواصل.',
          ],
        },
      ],
      outcomes: [
        'رحلة تواصل أوضح للمسؤولين عن التوظيف والعملاء والمتعاونين التقنيين.',
        'بنية نموذج متاحة مع تسميات وتحقيق ومسارات بديلة محلية.',
        'مخاطر تشغيلية أقل عند عدم توفر مزود نماذج خارجي.',
        'إشارات ثقة أفضل عبر نص واضح حول الخصوصية والاستجابة وسياق المشروع.',
      ],
      nextSteps: [
        'قياس جودة الاستفسارات فقط عبر إشارات آمنة وتحترم الخصوصية والموافقة.',
        'إضافة خيارات نوع مشروع اختيارية إذا أظهر السلوك المستقبلي أنماطًا متكررة.',
        'مواصلة اختبار المسار بلوحة المفاتيح وإعدادات reduced motion.',
      ],
      relatedServices: [
        'هندسة نماذج متاحة',
        'Frontend موجه للتحويل',
        'تحسين تدريجي',
        'UX writing يحترم الخصوصية',
      ],
    },
    {
      slug: 'frontend-quality-system',
      title: 'نظام جودة Frontend',
      seoTitle:
        'دراسة حالة لنظام جودة Frontend | الإتاحة وPlaywright وفحوص Astro',
      description:
        'دراسة هندسية لنظام جودة يجمع المحتوى typed وفحوص الإتاحة والمسارات القابلة للفهرسة والتحقق responsive وثقة build ثابت.',
      eyebrow: 'دراسة حالة · جودة هندسية',
      summary:
        'نظام جودة عملي يحمي مصداقية المحفظة: بيانات محتوى typed، توليد مسارات ثابت، اختبارات إتاحة، فحوص اتساق بصري، تغطية روابط داخلية، وتغذية راجعة من build قبل الإنتاج.',
      confidentialityNote:
        'تركز هذه الدراسة على أنماط هندسية عامة. لا تتضمن إعدادات CI خاصة أو بيانات اعتماد أو أسرار نشر أو تفاصيل مراقبة غير منشورة.',
      meta: [
        { label: 'نوع المشروع', value: 'نظام جودة وانحدار Frontend' },
        { label: 'الدور', value: 'معمارية Frontend واستراتيجية اختبارات' },
        { label: 'التركيز الأساسي', value: 'الإتاحة وSEO وثقة المسارات' },
        { label: 'النطاق التقني', value: 'Astro وTypeScript وPlaywright وaxe' },
      ],
      tags: [
        'Playwright',
        'اختبار الإتاحة',
        'Astro check',
        'محتوى typed',
        'انحدار SEO',
        'QA responsive',
      ],
      sections: [
        {
          id: 'context',
          heading: 'السياق',
          body: [
            'يمكن أن تتراجع جودة محفظة مصقولة بسرعة عندما يتم تعديل المحتوى والlayout والتوطين وSEO معًا. احتاج الموقع إلى طبقة جودة تلتقط المشكلات البنيوية دون runtime ثقيل.',
            'كان على النظام دعم معمارية Astro ثابتة مع التحقق من التفاصيل المهمة للتوظيف والبحث: H1 واحد، روابط قابلة للفهرسة، سمات لغة، عناصر تحكم متاحة، layouts responsive، ومسارات دراسات حالة تعمل.',
          ],
        },
        {
          id: 'problem',
          heading: 'المشكلة',
          body: [
            'المراجعة اليدوية لا تكفي لمحفظة متعددة اللغات. تعديل نص بسيط قد يكسر layout عربيًا، وتغيير مسار قد يخفي دراسة حالة، وتعديل بصري قد يخلق overflow أفقيًا على الجوال.',
            'كان التحدي إنشاء فحوص ذات معنى تحمي جودة الإنتاج دون تحويل المشروع إلى test suite بطيئة أو مبالغ فيها.',
          ],
          bullets: [
            'احتاجت الصفحات المحلية إلى shell وعناصر تحكم وبطاقات متسقة.',
            'احتاجت مسارات دراسات الحالة الديناميكية إلى البقاء قابلة للوصول في كل لغة.',
            'احتاجت قواعد الإتاحة إلى تغطية آلية للصفحات الأساسية.',
            'احتاجت المعمارية الحساسة للأداء إلى تجنب Astro islands أو client routing بالخطأ.',
          ],
        },
        {
          id: 'approach',
          heading: 'النهج',
          body: [
            'يجمع النظام بين typing ثابت وتوليد مسارات من المحتوى وفحوص build واختبارات متصفح مركزة. كل طبقة تلتقط نوعًا مختلفًا من الانحدار مع إبقاء runtime بسيطًا.',
            'تركز الاختبارات على السلوك المرئي للمستخدمين والزواحف بدل تفاصيل تنفيذية غير مهمة: العناوين، الروابط، سمات اللغة، البيانات المنظمة، تلميحات تحميل الصور، عناصر الثيم، وoverflow الأفقي.',
          ],
          bullets: [
            'تجعل سجلات دراسات الحالة typed الحقول الناقصة واضحة أثناء التطوير.',
            'تتحقق Astro build من الصفحات قبل النشر.',
            'يتحقق Playwright من المسارات والتنقل والعناصر المحلية وoverflow responsive.',
            'توفر axe تغطية لمخالفات الإتاحة في صفحات ممثلة.',
          ],
        },
        {
          id: 'seo-accessibility',
          heading: 'SEO والإتاحة',
          body: [
            'البنية نفسها التي تساعد الإتاحة تساعد الزواحف أيضًا. العناوين الواضحة والروابط الحقيقية والقوائم الدلالية وسمات اللغة والمحتوى server-rendered تجعل الموقع أسهل تفسيرًا للناس ومحركات البحث ووكلاء الذكاء الاصطناعي.',
            'لذلك يفحص نظام الجودة قابلية الاكتشاف والإتاحة معًا بدل التعامل معهما كتخصصين منفصلين.',
          ],
          bullets: [
            'تحققت من استخدام `lang` و`dir` المحليين في المسارات المهمة.',
            'فحصت البيانات المنظمة للجسم المقال ولوحات الإثبات والنتائج المحلية.',
            'حميت shell الثابت من تنقل يعتمد على العميل فقط بالخطأ.',
            'ركزت فحوص الاتساق البصري على tokens مشتركة مثل radius والبطاقات وعناصر التحكم.',
          ],
        },
        {
          id: 'performance',
          heading: 'قرارات الأداء',
          body: [
            'يحمي نهج الجودة الأداء عبر منع التعقيد العرضي. يمكن للموقع أن يبقى ثابتًا في معظمه، وتُحسن الصور عبر Astro، ويبقى السلوك الديناميكي محدودًا لعناصر التحكم الضرورية.',
            'بدل إضافة المزيد من كود المراقبة في runtime، يعطي التنفيذ الأولوية لثقة build وHTML مستقر وlayouts حتمية يستطيع Lighthouse والمستخدمون تقييمها بثقة.',
          ],
          bullets: [
            'حافظت على الفحوص مركزة بما يكفي للتشغيل أثناء التطوير العادي.',
            'تحققت من بقاء الصور غير الرئيسية lazy loading وasync decoding.',
            'حميت توقع homepage ثابت دون islands.',
            'فحصت overflow الأفقي حتى تبقى تخطيطات الجوال وRTL مستقرة.',
          ],
        },
      ],
      outcomes: [
        'شبكة أمان أقوى ضد انحدارات الإتاحة والمسارات والتوطين وSEO.',
        'ثقة أكبر عند إضافة محتوى دراسات حالة بالإنجليزية والإسبانية والعربية.',
        'معمارية static-first تتجنب hydration وتوجيه runtime غير الضروري.',
        'نمط QA قابل للتكرار لمحافظ ومواقع تسويق مستقبلية.',
      ],
      nextSteps: [
        'إضافة مقارنة لقطات فقط للمكونات عالية المخاطر إذا تكررت الانحدارات البصرية.',
        'تسجيل تقارير Lighthouse أثناء النشر عندما تتوفر بنية CI مناسبة.',
        'توسيع الاختبارات حول أنواع محتوى جديدة مع نمو المدونة ومكتبة الحالات.',
      ],
      relatedServices: [
        'استراتيجية اختبارات Frontend',
        'QA للإتاحة',
        'اختبارات انحدار SEO',
        'معمارية مواقع ثابتة',
      ],
    },
  ],
};

export const additionalCaseStudyProof: Record<
  Locale,
  Record<string, readonly CaseStudyProof[]>
> = {
  en: {
    'portfolio-seo-i18n-system': [
      {
        id: 'role',
        heading: 'My role',
        items: [
          'Defined the localized content model, route strategy, internal-link structure, and recruiter-facing information hierarchy.',
          'Wrote crawlable case-study content and aligned titles, descriptions, headings, service topics, and schema-ready article bodies.',
          'Kept the architecture static-first so search engines and assistive technologies can read the same meaningful HTML as users.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        items: [
          'The site needed consistent UI across English, Spanish, and Arabic without introducing separate layout forks.',
          'Localized content had to be complete enough to index, not partial labels around English body copy.',
          'Performance and Lighthouse stability had to remain strong while adding richer content and more pages.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Key decisions',
        items: [
          'Used typed localized records so case-study pages, work cards, route generation, and schema content share one source of truth.',
          'Linked every case study from both homepage and work index pages to keep discovery simple for users and crawlers.',
          'Improved RTL typography and wrapping rules instead of hiding long localized content or shortening proof detail.',
        ],
      },
    ],
    'accessible-contact-workflow': [
      {
        id: 'role',
        heading: 'My role',
        items: [
          'Designed the contact flow as a product experience with clear fields, fallback paths, privacy copy, and localized validation language.',
          'Balanced conversion clarity with accessibility requirements so the form works for keyboard, screen-reader, and no-JavaScript contexts.',
          'Kept the workflow lightweight enough for a static portfolio while preserving trust and operational reliability.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        items: [
          'The form provider may be unavailable in local, restricted, or unconfigured environments.',
          'The flow had to serve recruiters, freelance clients, and technical collaborators without becoming a long questionnaire.',
          'The page needed privacy clarity without adding analytics-heavy tracking or intrusive conversion scripts.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Key decisions',
        items: [
          'Kept direct email fallback visible so the user always has a reliable way to start a conversation.',
          'Used explicit labels, validation messages, and project-context guidance instead of placeholder-only instructions.',
          'Localized the workflow so trust and error recovery remain clear across English, Spanish, and Arabic routes.',
        ],
      },
    ],
    'frontend-quality-system': [
      {
        id: 'role',
        heading: 'My role',
        items: [
          'Built the quality strategy around route reachability, accessibility, localized shell consistency, structured data, and mobile overflow checks.',
          'Connected typed content to static route generation so adding pages improves discovery without duplicating rendering logic.',
          'Used targeted browser tests to protect high-impact SEO and UX behavior while keeping the production runtime simple.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Constraints',
        items: [
          'The portfolio needed confidence without becoming a heavy application with unnecessary client-side hydration.',
          'Tests had to catch meaningful regressions while staying maintainable for a small static site.',
          'Arabic and mobile layouts needed explicit overflow protection because long localized strings can expose weak card and timeline rules.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Key decisions',
        items: [
          'Protected semantic expectations such as one H1, localized `lang` and `dir`, real links, and schema-bearing case-study pages.',
          'Added route coverage for every case-study slug across supported locales.',
          'Kept CSS fixes token-based so visual consistency improves without redesigning the site.',
        ],
      },
    ],
  },
  es: {
    'portfolio-seo-i18n-system': [
      {
        id: 'role',
        heading: 'Mi rol',
        items: [
          'Definí el modelo de contenido localizado, la estrategia de rutas, la estructura de enlaces internos y la jerarquía de información para recruiters.',
          'Escribí contenido rastreable para casos de estudio y alineé títulos, descripciones, encabezados, temas de servicio y cuerpos listos para schema.',
          'Mantuve una arquitectura static-first para que buscadores y tecnologías de asistencia lean el mismo HTML significativo que los usuarios.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Restricciones',
        items: [
          'El sitio necesitaba UI consistente en inglés, español y árabe sin crear layouts separados por idioma.',
          'El contenido localizado debía ser suficientemente completo para indexar, no solo etiquetas traducidas alrededor de texto en inglés.',
          'La estabilidad de rendimiento y Lighthouse debía mantenerse mientras se añadían más contenido y páginas.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Decisiones clave',
        items: [
          'Usé registros localizados tipados para que páginas, tarjetas, rutas y contenido de schema compartan una sola fuente de verdad.',
          'Enlacé cada caso desde inicio y desde el índice de trabajo para simplificar descubrimiento para usuarios y crawlers.',
          'Mejoré tipografía RTL y reglas de wrapping en lugar de ocultar contenido largo o reducir el detalle de prueba.',
        ],
      },
    ],
    'accessible-contact-workflow': [
      {
        id: 'role',
        heading: 'Mi rol',
        items: [
          'Diseñé el flujo de contacto como experiencia de producto con campos claros, alternativas, texto de privacidad y validación localizada.',
          'Equilibré claridad de conversión con accesibilidad para teclado, lector de pantalla y contextos sin JavaScript.',
          'Mantuve el flujo suficientemente ligero para un portfolio estático sin perder confianza ni fiabilidad operativa.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Restricciones',
        items: [
          'El proveedor del formulario puede no estar disponible en entornos locales, restringidos o sin configuración.',
          'El flujo debía servir a recruiters, clientes freelance y colaboradores técnicos sin convertirse en un cuestionario largo.',
          'La página necesitaba claridad de privacidad sin añadir tracking pesado ni scripts intrusivos de conversión.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Decisiones clave',
        items: [
          'Mantuve visible el fallback por email para que el usuario siempre tenga una forma fiable de iniciar conversación.',
          'Usé etiquetas explícitas, mensajes de validación y guía de contexto del proyecto en lugar de instrucciones solo en placeholders.',
          'Localicé el flujo para que confianza y recuperación de errores sigan claras en inglés, español y árabe.',
        ],
      },
    ],
    'frontend-quality-system': [
      {
        id: 'role',
        heading: 'Mi rol',
        items: [
          'Construí la estrategia de calidad alrededor de rutas, accesibilidad, consistencia localizada, datos estructurados y overflow móvil.',
          'Conecté contenido tipado con generación estática de rutas para que añadir páginas mejore descubrimiento sin duplicar renderizado.',
          'Usé pruebas de navegador enfocadas para proteger SEO y UX de alto impacto manteniendo simple el runtime de producción.',
        ],
      },
      {
        id: 'constraints',
        heading: 'Restricciones',
        items: [
          'El portfolio necesitaba confianza sin convertirse en una aplicación pesada con hidratación innecesaria.',
          'Las pruebas debían detectar regresiones relevantes y seguir siendo mantenibles para un sitio estático pequeño.',
          'Los layouts árabes y móviles necesitaban protección explícita contra overflow por textos localizados largos.',
        ],
      },
      {
        id: 'decisions',
        heading: 'Decisiones clave',
        items: [
          'Protegí expectativas semánticas como un solo H1, `lang` y `dir` localizados, enlaces reales y páginas con schema.',
          'Agregué cobertura de rutas para cada slug de caso de estudio en los idiomas soportados.',
          'Mantuve arreglos CSS basados en tokens para mejorar consistencia sin rediseñar el sitio.',
        ],
      },
    ],
  },
  ar: {
    'portfolio-seo-i18n-system': [
      {
        id: 'role',
        heading: 'دوري',
        items: [
          'حددت نموذج المحتوى المحلي، واستراتيجية المسارات، وبنية الروابط الداخلية، وهرمية المعلومات المناسبة لمسؤولي التوظيف.',
          'كتبت محتوى دراسات حالة قابلًا للفهرسة وربطت العناوين والأوصاف والعناوين الداخلية وموضوعات الخدمات وأجسام المقال الجاهزة للschema.',
          'حافظت على معمارية static-first حتى تقرأ محركات البحث وتقنيات المساعدة نفس HTML المفيد الذي يقرأه المستخدمون.',
        ],
      },
      {
        id: 'constraints',
        heading: 'القيود',
        items: [
          'احتاج الموقع إلى UI متسقة في الإنجليزية والإسبانية والعربية دون إنشاء layouts منفصلة.',
          'كان يجب أن يكون المحتوى المحلي كاملًا بما يكفي للفهرسة، لا مجرد تسميات مترجمة حول نص إنجليزي.',
          'كان يجب الحفاظ على الأداء واستقرار Lighthouse أثناء إضافة محتوى وصفحات أكثر.',
        ],
      },
      {
        id: 'decisions',
        heading: 'القرارات الرئيسية',
        items: [
          'استخدمت سجلات محلية typed حتى تشترك صفحات الحالات والبطاقات والمسارات ومحتوى schema في مصدر حقيقة واحد.',
          'ربطت كل دراسة حالة من الصفحة الرئيسية ومن فهرس الأعمال لتسهيل الاكتشاف للمستخدمين والزواحف.',
          'حسنت قواعد RTL والالتفاف بدل إخفاء المحتوى المحلي الطويل أو تقليل تفاصيل الإثبات.',
        ],
      },
    ],
    'accessible-contact-workflow': [
      {
        id: 'role',
        heading: 'دوري',
        items: [
          'صممت مسار التواصل كتجربة منتج تتضمن حقولًا واضحة ومسارات بديلة ونص خصوصية ولغة تحقق محلية.',
          'وازنت بين وضوح التحويل ومتطلبات الإتاحة حتى يعمل النموذج مع لوحة المفاتيح وقارئات الشاشة وغياب JavaScript.',
          'حافظت على المسار خفيفًا بما يكفي لمحفظة ثابتة مع الحفاظ على الثقة والموثوقية التشغيلية.',
        ],
      },
      {
        id: 'constraints',
        heading: 'القيود',
        items: [
          'قد لا يكون مزود النموذج متاحًا في بيئات محلية أو مقيدة أو غير مهيأة.',
          'كان يجب أن يخدم المسار مسؤولي التوظيف والعملاء المستقلين والمتعاونين التقنيين دون أن يصبح استبيانًا طويلًا.',
          'احتاجت الصفحة إلى وضوح خصوصية دون إضافة tracking ثقيل أو scripts تحويل مزعجة.',
        ],
      },
      {
        id: 'decisions',
        heading: 'القرارات الرئيسية',
        items: [
          'حافظت على بديل البريد ظاهرًا حتى يمتلك المستخدم دائمًا طريقة موثوقة لبدء محادثة.',
          'استخدمت تسميات صريحة ورسائل تحقق وإرشاد سياق المشروع بدل تعليمات placeholders فقط.',
          'ترجمت المسار حتى تبقى الثقة والتعافي من الأخطاء واضحين عبر الإنجليزية والإسبانية والعربية.',
        ],
      },
    ],
    'frontend-quality-system': [
      {
        id: 'role',
        heading: 'دوري',
        items: [
          'بنيت استراتيجية الجودة حول قابلية الوصول للمسارات والإتاحة واتساق shell المحلي والبيانات المنظمة وفحوص overflow على الجوال.',
          'ربطت المحتوى typed بتوليد المسارات الثابتة حتى تؤدي إضافة الصفحات إلى تحسين الاكتشاف دون تكرار منطق العرض.',
          'استخدمت اختبارات متصفح مركزة لحماية سلوك SEO وUX عالي التأثير مع إبقاء runtime الإنتاج بسيطًا.',
        ],
      },
      {
        id: 'constraints',
        heading: 'القيود',
        items: [
          'احتاجت المحفظة إلى ثقة دون أن تتحول إلى تطبيق ثقيل مع hydration غير ضروري.',
          'كان يجب أن تلتقط الاختبارات انحدارات مهمة مع أن تبقى قابلة للصيانة لموقع ثابت صغير.',
          'احتاجت تخطيطات العربية والجوال إلى حماية صريحة من overflow بسبب السلاسل المحلية الطويلة.',
        ],
      },
      {
        id: 'decisions',
        heading: 'القرارات الرئيسية',
        items: [
          'حميت توقعات دلالية مثل H1 واحد و`lang` و`dir` محليين وروابط حقيقية وصفحات تحمل schema.',
          'أضفت تغطية مسارات لكل slug دراسة حالة في اللغات المدعومة.',
          'حافظت على إصلاحات CSS مبنية على tokens حتى تتحسن الاتساقية دون إعادة تصميم الموقع.',
        ],
      },
    ],
  },
};
