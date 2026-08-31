---
title: 'Checklist de revisión de código frontend antes de desplegar'
description: 'Un flujo práctico de revisión para detectar problemas funcionales, de accesibilidad, responsive, rendimiento y mantenibilidad antes de una release frontend.'
pubDate: 2026-08-27
tags: ['Revisión de código', 'Accesibilidad', 'Rendimiento', 'Frontend']
draft: false
---

Una revisión de frontend debe responder a algo más grande que "¿compila el código?". Debe determinar si el cambio funciona para usuarios reales, sigue siendo comprensible para el equipo y se comporta con seguridad ante redes lentas, datos raros, entrada por teclado y distintos tamaños de pantalla.

El mejor orden de revisión sigue el riesgo. Empieza por el comportamiento; después revisa semántica y accesibilidad, layout responsive, rendimiento y mantenibilidad. Una discusión sobre formato no debe tapar un formulario roto o un diálogo inaccesible.

## 1. Confirma el comportamiento previsto

Lee el requisito y usa la interfaz antes de mirar los detalles de implementación. Verifica el camino feliz y luego prueba a propósito estados incómodos:

- Estados de vacío, carga, parcial, error y éxito
- Nombres largos, texto traducido, números grandes y campos opcionales ausentes
- Clics y envíos repetidos
- Navegación hacia atrás y adelante
- Refrescar una URL profunda
- Peticiones de red lentas o fallidas
- Autenticación caducada o permisos insuficientes

En formularios, comprueba que las etiquetas siguen asociadas a los inputs, que los mensajes de validación identifican el problema, que el foco pasa al primer campo inválido cuando corresponde y que los fallos del servidor dejan un estado recuperable. La validación en cliente mejora el feedback, pero no sustituye a la validación en servidor.

Al revisar estado, busca un dueño claro. Los valores derivados normalmente no deben copiarse en otra variable de estado. Datos del servidor, estado en la URL, estado del formulario y estado temporal de la interfaz resuelven problemas distintos y no deben mezclarse sin motivo.

## 2. Revisa la estructura del documento

El HTML semántico ofrece al navegador y a las tecnologías de asistencia un comportamiento útil antes de que corra el JavaScript. Comprueba que la implementación usa:

- Un único `h1` descriptivo para el tema de la página
- Encabezados que describen secciones en jerarquía lógica
- Elementos `button` reales para acciones
- Enlaces para navegar a otra URL
- `nav`, `main`, `article`, `section`, `aside` y `footer` cuando expresan la estructura
- Controles de formulario nativos con etiquetas visibles
- Listas para conjuntos relacionados

Un `div` clicable debe reconstruir el comportamiento de teclado, foco, deshabilitado y un rol accesible. En la mayoría de los casos, sustituirlo por un botón es más simple y más fiable.

ARIA debe complementar la semántica nativa, no competir con ella. Verifica que los IDs referenciados por `aria-labelledby`, `aria-describedby` y `aria-controls` existen y son únicos. Elimina atributos huérfanos tras refactors.

La [página de accesibilidad](/es/accessibility/) del sitio describe las características básicas esperadas en este portfolio.

## 3. Prueba el comportamiento de teclado y foco

Usa la página sin ratón. Quien revise debe poder:

1. Alcanzar cada control interactivo con el teclado.
2. Ver dónde está el foco en todo momento.
3. Operar los controles con sus teclas esperadas.
4. Abrir y cerrar diálogos o menús sin perder el foco.
5. Escapar de interfaces temporales donde Escape es la expectativa.
6. Continuar en un orden lógico cuando cambia el contenido.

En un diálogo modal, el foco debe entrar al diálogo, quedarse dentro mientras esté abierto y volver al disparador al cerrarlo. En navegación en cliente, la nueva página debe tener un título útil y una estrategia de foco deliberada.

No apruebes un cambio que elimine el contorno de foco sin un reemplazo igualmente visible.

## 4. Comprueba el comportamiento responsive con contenido hostil

Una revisión responsive no son tres capturas. Redimensiona de forma continua y busca el punto donde el layout falla. Prueba anchuras móviles estrechas, orientación horizontal, anchuras de tablet y pantallas de escritorio anchas.

Inspecciona elementos con formato fijo: tablas, toolbars, gráficos, grids y diálogos. Comprueba que:

- El texto envuelve sin tapar controles cercanos
- Palabras largas y URLs no fuerzan scroll horizontal en la página
- Los objetivos táctiles tienen separación suficiente
- Las acciones importantes no se mueven de forma impredecible
- Las imágenes reservan sus dimensiones antes de cargarse
- Hacer zoom al 200% no oculta contenido ni acciones
- El orden del contenido sigue teniendo sentido al apilarse en columnas

Las interfaces traducidas suelen revelar supuestos antes que el inglés. Aunque las traducciones no estén disponibles, prueba con cadenas sustitutas más largas en vez de confiar en una longitud perfecta del texto original.

## 5. Protege los Core Web Vitals

La revisión de rendimiento debe conectar decisiones de implementación con trabajo visible para el usuario. Los Core Web Vitals actuales son Largest Contentful Paint (LCP), Interaction to Next Paint (INP) y Cumulative Layout Shift (CLS).

Para LCP, revisa la imagen o encabezado más probablemente mayor. Una imagen hero debe tener dimensiones correctas, un source set responsive y prioridad alta de fetch solo cuando de verdad es el candidato LCP. Evita preloads que compitan.

Para INP, busca handlers de eventos que hagan grandes actualizaciones síncronas, rendericen árboles de componentes excesivos o midan y muten layout repetidamente. Aplicar debounce sirve para algunos eventos, pero no sustituye a reducir el trabajo.

Para CLS, reserva espacio para imágenes, embeds, banners y contenido asíncrono. Evita insertar avisos por encima de la posición actual del usuario tras la carga.

Verifica también:

- Si una nueva dependencia se justifica por el comportamiento que aporta
- Si el código puede ejecutarse en build o en servidor en lugar de en el navegador
- Si el code-splitting por ruta sigue siendo efectivo
- Si las imágenes están correctamente comprimidas y dimensionadas
- Si los scripts de terceros cargan solo cuando se necesitan

En [servicios de ingeniería frontend](/es/services/) hay más detalle sobre este enfoque de implementación.

## 6. Revisa las decisiones de React y TypeScript

En React, verifica que los efectos sincronizan con un sistema externo en lugar de calcular valores que podrían derivarse durante el render. Revisa la limpieza de suscripciones, timers y listeners.

No pidas `useMemo` o `useCallback` de forma automática. Añaden código y pueden ocultar la propiedad de los datos. Úsalos cuando el profiling, la identidad referencial o una estrategia de compilador establecida ofrezcan una razón concreta.

Para TypeScript:

- Prefiere tipos de dominio estrechos frente a objetos amplios
- Evita `any` cuando el límite pueda validarse
- Representa los estados de carga y error de forma explícita
- Valida los datos de API no confiables en el límite
- Mantén las props públicas de los componentes con intención
- Evita aserciones que solo silencian una incertidumbre real

Una aserción de tipo no es validación en tiempo de ejecución. Los datos de APIs, storage, query strings y formularios siguen siendo no confiables en runtime.

## 7. Evalúa mantenibilidad y pruebas

Pregúntate si alguien que no conoce el cambio puede identificar el flujo de datos, el dueño del estado, el comportamiento ante fallos y los puntos de extensión. El naming debe explicar intención. Los comentarios deben conservar el razonamiento no evidente, no narrar sintaxis.

Las pruebas deben cubrir el comportamiento que importa: una regla de validación, un límite de permisos, una interacción con teclado, una ruta de recuperación de error o una transformación con casos borde significativos. Evita pruebas que duplican detalles de implementación y fallan ante refactors inocuos.

Antes de aprobar, ejecuta el formateador, el linter, el chequeador de tipos, las pruebas enfocadas, el build de producción y un escaneo de accesibilidad del repositorio. Los chequeos automatizados no prueban usabilidad, pero son buenos para impedir que fallos conocidos vuelvan.

## Checklist final de revisión

- [ ] Requisitos y casos borde se comportan correctamente
- [ ] La estructura semántica y la de encabezados es significativa
- [ ] El comportamiento de teclado y foco funciona
- [ ] Los layouts en móvil, con zoom y con contenido largo se contienen
- [ ] Se abordan los riesgos de LCP, INP y CLS
- [ ] Efectos y estado en React tienen dueño claro
- [ ] Los datos no confiables se validan en runtime
- [ ] Las pruebas cubren comportamiento relevante, no detalles de implementación
- [ ] Las nuevas dependencias y el JavaScript del cliente están justificados
- [ ] El build de producción y los chequeos automatizados pasan

Una buena revisión es una evaluación compartida del riesgo, no un concurso de estilo. Prioriza los hallazgos por impacto en el usuario, explica por qué importan y distingue lo obligatorio de lo opcional. Así la revisión mantiene rigor sin frenar al equipo con ruido.
