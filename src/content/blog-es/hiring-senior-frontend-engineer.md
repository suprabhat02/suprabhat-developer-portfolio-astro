---
title: 'Qué buscar al contratar a un ingeniero frontend'
seoTitle: 'Contratar a un ingeniero frontend sénior: qué buscar'
description: 'Qué distingue a un ingeniero frontend sénior de uno de nivel medio: arquitectura, accesibilidad, i18n, rendimiento y preguntas para la entrevista.'
pubDate: 2026-10-14
tags: ['Frontend', 'Revisión de código', 'Accesibilidad', 'Rendimiento']
draft: false
---

La mayoría de los procesos de selección frontend comprueban si el candidato sabe usar un framework. Es un filtro razonable para un puesto junior, pero dice poco sobre la seniority. Un ingeniero de nivel medio construye la pantalla del ticket. Un ingeniero sénior decide cómo se construirán las veinte pantallas siguientes y detecta cuáles se romperán primero.

Esta guía está escrita para responsables de contratación y líderes técnicos. Describe qué separa el trabajo frontend sénior de una implementación competente y qué preguntas revelan la diferencia.

## Más allá del framework

El conocimiento de un framework caduca rápido. Lo que perdura está debajo: HTML semántico, el pipeline de renderizado del navegador, el comportamiento de la red, la propiedad del estado y la forma en que los usuarios recorren de verdad una interfaz.

Un ingeniero frontend sénior trata el framework como una herramienta más. Pregúntale cómo construiría una funcionalidad y fíjate en si hace preguntas antes de dar respuestas:

- ¿Qué intenta hacer el usuario y qué información necesita?
- ¿Qué estados existen además del ideal: carga, vacío, parcial, error y acceso restringido?
- ¿Hace falta JavaScript, o puede hacer el trabajo el servidor o el paso de build?
- ¿Quién más mantendrá este código y qué necesitará entender?

Observa su criterio con los compromisos. Cada abstracción, dependencia y funcionalidad en el cliente tiene un coste. Un perfil sénior explica el coste de su enfoque preferido con la misma claridad que sus ventajas, y sabe decir cuándo elegiría algo más sencillo.

## Decisiones de arquitectura que escalan

La arquitectura es donde la seniority se hace visible con el tiempo. Una mala arquitectura frontend rara vez falla de inmediato. Falla cuando llega el segundo equipo, cuando cambian los requisitos o cuando el producto añade un nuevo rol de usuario.

Los buenos candidatos hablan con concreción de:

- **Límites de componentes.** Qué partes gestionan comportamiento, cuáles son layout y cuáles pertenecen a una sola funcionalidad y no a la capa compartida.
- **Propiedad del estado.** La diferencia entre datos del servidor, estado en la URL, estado de formulario y estado temporal de la interfaz, y por qué mezclarlos provoca errores.
- **Contratos explícitos.** Props tipadas y estados con nombre que hacen visibles los casos límite en el código en lugar de esconderlos en condicionales.
- **Bases compartidas.** Tokens de diseño y componentes compartidos que hacen que la implementación correcta sea más fácil que la inconsistente.

Pide un ejemplo en el que haya eliminado complejidad, no solo uno en el que haya añadido un sistema. Simplificar un componente sobreabstraído suele ser una señal más fuerte que construir uno nuevo.

Busca también evidencias de un sistema de calidad. Un ingeniero sénior protege sus decisiones con automatización: comprobación de tipos, linting, pruebas end-to-end y análisis de accesibilidad que se ejecutan antes de cada release. El caso del [sistema de calidad frontend](/es/work/frontend-quality-system/) es un ejemplo de ese enfoque: combina contenido tipado, comprobaciones de accesibilidad, rutas rastreables y validación del layout responsive.

## Accesibilidad e internacionalización

La accesibilidad y la internacionalización son áreas donde muchos candidatos, por lo demás sólidos, muestran carencias, y por eso son buenas señales de contratación.

En accesibilidad, mira más allá de conocer ARIA. Un perfil sénior empieza por el HTML nativo, prueba con teclado de forma rutinaria y entiende la gestión del foco en diálogos, menús y navegación en el cliente. Trata el contraste, las etiquetas y los mensajes de error como criterios de aceptación y no como detalles finales. También conoce los límites de las herramientas automáticas: un análisis con axe detecta defectos conocidos, pero no confirma que un flujo sea usable.

En internacionalización, pregunta por algo más que textos traducidos. Un ingeniero sénior debería poder hablar de:

- Layouts que aguantan textos traducidos más largos sin romperse
- Idiomas de derecha a izquierda, propiedades CSS lógicas e iconos reflejados
- Fechas, números y monedas según la configuración regional
- URLs localizadas, `hreflang` y visibilidad en buscadores para cada idioma

El caso del [sistema de SEO e i18n del portfolio](/es/work/portfolio-seo-i18n-system/) muestra cómo se combinan estas cuestiones en un sitio estático que sirve varios idiomas sin depender de contenido cargado en el cliente.

## Responsabilidad sobre el rendimiento

Los ingenieros de nivel medio arreglan problemas de rendimiento cuando alguien los reporta. Los sénior se responsabilizan del rendimiento: fijan presupuestos, miden en condiciones realistas y evitan regresiones antes de que lleguen a producción.

Atiende a los detalles. Un buen candidato explica los Core Web Vitals (Largest Contentful Paint, Interaction to Next Paint y Cumulative Layout Shift) y relaciona cada uno con decisiones de implementación. Sabe que los desplazamientos de layout suelen venir de contenido sin espacio reservado, que las interacciones lentas suelen venir de demasiado trabajo síncrono en los manejadores de eventos, y que el pintado más grande a menudo se retrasa por peticiones que compiten entre sí más que por el propio framework.

Responsabilizarse también significa cuestionar lo establecido. ¿Esta página necesita un framework en el cliente? ¿Esta dependencia justifica su tamaño? ¿Este trabajo puede hacerse en tiempo de build? Los ingenieros que se hacen estas preguntas mantienen los productos rápidos sin proyectos heroicos de optimización más adelante.

## Preguntas para la entrevista

Las preguntas más reveladoras piden razonar sobre situaciones reales en lugar de recitar definiciones:

1. Explícame la API de un componente que hayas diseñado. ¿Qué dejaste fuera a propósito?
2. Háblame de una decisión frontend que luego revertiste. ¿Qué aprendiste?
3. ¿Cómo revisarías una pull request que añade un diálogo modal?
4. Un dashboard va lento tras la última release. ¿Qué compruebas primero?
5. ¿Cómo decides si un nuevo estado va en la URL, en la caché del servidor o en el estado local del componente?
6. ¿Cómo prepararías una interfaz existente para una traducción al árabe?
7. ¿Qué automatizarías antes de que el equipo pase de tres a diez ingenieros?

Las buenas respuestas incluyen restricciones, compromisos y verificación. Las flojas solo describen el camino ideal. Pedir al candidato que revise una pull request real, con una estructura como este [checklist de revisión de código frontend](/es/blog/frontend-code-review-checklist/), suele revelar más que un ejercicio en la pizarra.

Antes de contratar, también ayuda saber en qué punto está tu frontend actual. Marca cada afirmación que sea cierta hoy:

<fieldset class="scorecard">
<legend>Evalúa tu frontend actual</legend>
<ul>
<li><label><input type="checkbox" name="scorecard" value="states" /> Cada vista de datos diseña sus estados de carga, vacío y error.</label></li>
<li><label><input type="checkbox" name="scorecard" value="components" /> Los componentes compartidos tienen contratos tipados y documentados.</label></li>
<li><label><input type="checkbox" name="scorecard" value="tokens" /> Los colores y el espaciado salen de tokens de diseño, no de literales.</label></li>
<li><label><input type="checkbox" name="scorecard" value="keyboard" /> Todos los flujos se pueden completar solo con el teclado.</label></li>
<li><label><input type="checkbox" name="scorecard" value="axe" /> Se ejecutan comprobaciones automáticas de accesibilidad antes de cada release.</label></li>
<li><label><input type="checkbox" name="scorecard" value="vitals" /> Los Core Web Vitals se miden y tienen presupuestos acordados.</label></li>
<li><label><input type="checkbox" name="scorecard" value="dependencies" /> Cada nueva dependencia necesita un motivo explícito.</label></li>
<li><label><input type="checkbox" name="scorecard" value="i18n" /> Los layouts soportan textos traducidos más largos e idiomas de derecha a izquierda.</label></li>
<li><label><input type="checkbox" name="scorecard" value="tests" /> Las pruebas end-to-end cubren los recorridos de usuario más importantes.</label></li>
<li><label><input type="checkbox" name="scorecard" value="review" /> La revisión de código sigue un checklist compartido y basado en el riesgo.</label></li>
</ul>
<p class="scorecard-total">Tu puntuación: <span class="scorecard-value"></span> / 10</p>
</fieldset>

Una puntuación baja no es un fracaso. Es un mapa de dónde tendrá más impacto la experiencia frontend sénior, ya venga de una nueva contratación o de [servicios de ingeniería frontend](/es/services/) especializados.
