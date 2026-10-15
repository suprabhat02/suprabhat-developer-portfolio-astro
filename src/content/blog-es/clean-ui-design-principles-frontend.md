---
title: 'Principios de UI limpia que todo ingeniero frontend debería conocer'
seoTitle: 'Principios de UI limpia para ingenieros frontend'
description: 'La UI limpia es una propiedad de ingeniería: escalas de espaciado, tokens de color OKLCH, presupuestos de movimiento y contraste medible en el código.'
pubDate: 2026-10-14
heroImage: /images/blog/clean-ui-design-principles-frontend-cover-1600x840.png
tags: ['Diseño UI', 'Sistemas de diseño', 'Accesibilidad', 'Rendimiento']
draft: false
---

«Limpio» suele tratarse como una cuestión de gusto. Para un ingeniero frontend es algo más útil: un conjunto de restricciones que se pueden escribir, revisar y probar.

El argumento de diseño a favor de la contención se explica en [por qué una UI limpia y minimalista funciona en sitios profesionales](/es/blog/why-clean-minimal-ui-professional-website/). Este artículo trata la parte de implementación: cómo el espaciado, el color, el movimiento y el contraste se convierten en sistemas dentro del código, y cómo saber si una interfaz realmente se está volviendo más limpia.

## Qué significa «limpio» en el código

Una interfaz parece desordenada cuando contiene muchos valores casi idénticos. Separaciones de 14 y 15 píxeles, tres grises ligeramente distintos, transiciones de 150, 180 y 200 milisegundos. Los usuarios rara vez identifican la causa, pero notan el resultado: la página se siente inestable y nada parece alinearse.

En el código, una interfaz limpia tiene cuatro propiedades:

- **Pocos valores distintos.** Espaciado, color, radios y duraciones salen de conjuntos pequeños y deliberados.
- **Decisiones con nombre.** Cada valor tiene un nombre ligado a su función, como `--text` o `--accent`, y no a su aspecto.
- **Estados completos.** Hover, foco, deshabilitado, carga, vacío y error usan el mismo vocabulario que el estado por defecto.
- **Calidad medible.** El contraste, los desplazamientos de layout y el coste en el hilo principal se comprueban con herramientas, no a ojo.

Por eso la solución técnica al ruido visual no es pulir más. Es reducir los valores posibles y convertir cada uno en una decisión con nombre.

## El espaciado como sistema

El espaciado comunica relaciones. Los elementos que van juntos están más cerca que los que no. Cuando el espaciado se elige caso a caso, esas relaciones se vuelven ambiguas, porque una separación de `0.6rem` y otra de `0.75rem` se ven distintas sin significar nada distinto.

Una escala de espaciado elimina esa ambigüedad. Una escala contenida como `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem` y `4rem` cubre casi cualquier layout. Usa los pasos pequeños dentro de un grupo y los grandes entre grupos, para que la propia distancia explique la estructura.

Dos hábitos de implementación ayudan a que la escala se mantenga:

- **Deja que los contenedores gestionen el espaciado.** Usa `gap` en contenedores flex y grid en lugar de márgenes en los hijos. El componente no necesita saber dónde se coloca.
- **Usa propiedades lógicas.** Escribe `margin-inline-start` y `padding-block` en lugar de left, right, top y bottom. Así los layouts se reflejan correctamente en idiomas de derecha a izquierda sin una segunda hoja de estilos.

La diferencia se ve mejor de lo que se describe. Los dos paneles siguientes tienen el mismo contenido.

<figure>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1.5rem;">
<div style="padding-block: 0.6rem 2.2rem; padding-inline: 1.7rem 0.4rem; border: 1px solid var(--line); border-radius: var(--radius-card); background: var(--surface);">
<p style="margin: 0 0 0.1rem; color: var(--text); font-weight: 700;">Espaciado improvisado</p>
<p style="margin: 0 0 1.9rem; color: var(--muted);">Informe semanal de uso con los últimos totales por región.</p>
<p style="margin: 0 0 0.2rem; color: var(--muted);">Actualizado hace dos horas</p>
<span style="display: inline-block; margin-block-start: 0.1rem; margin-inline-start: 0.6rem; padding: 0.25rem 1.3rem; border-radius: var(--radius-control); background: var(--accent); color: var(--on-accent); font-weight: 700;">Abrir informe</span>
</div>
<div style="display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; border: 1px solid var(--line); border-radius: var(--radius-card); background: var(--surface);">
<div style="display: flex; flex-direction: column; gap: 0.5rem;">
<p style="margin: 0; color: var(--text); font-weight: 700;">Escala de espaciado</p>
<p style="margin: 0; color: var(--muted);">Informe semanal de uso con los últimos totales por región.</p>
<p style="margin: 0; color: var(--muted);">Actualizado hace dos horas</p>
</div>
<span style="align-self: flex-start; padding: 0.5rem 1rem; border-radius: var(--radius-control); background: var(--accent); color: var(--on-accent); font-weight: 700;">Abrir informe</span>
</div>
</div>
<figcaption>El primer panel elige cada margen y relleno por separado. El segundo usa dos pasos de una misma escala: 0.5rem dentro del grupo de texto y 1rem entre el grupo y la acción.</figcaption>
</figure>

## Tokens de color con OKLCH

Los tokens de color asignan una función a cada color. Los componentes piden `--text`, `--surface` o `--accent`, nunca un valor literal. Cambiar la paleta significa cambiar los tokens, no buscar en todas las hojas de estilos.

OKLCH hace este sistema más predecible que hex o HSL. Separa luminosidad, croma y tono en canales independientes, y su canal de luminosidad refleja lo claro que se percibe realmente un color. Si cada función mantiene una luminosidad fija, el tono puede cambiar y el contraste se mantiene prácticamente igual.

Este sitio usa ese enfoque. Cada color se deriva en OKLCH a partir de unos pocos valores semilla, y los componentes solo usan tokens de función:

```css
:root {
  --seed-primary-h: 225;
  --seed-neutral-h: 235;
  --seed-chroma: 0.2;
  --text: oklch(0.97 0.012 var(--seed-neutral-h));
  --accent: oklch(0.72 var(--seed-chroma) var(--seed-primary-h));
}

[data-theme='light'] {
  --accent: oklch(0.5 var(--seed-chroma) var(--seed-primary-h));
}
```

Cambiar `--seed-primary-h` actualiza botones, enlaces, anillos de foco y degradados a la vez, en ambos temas. Las funciones por defecto alcanzan al menos 4.5:1 en todos los roles de texto sobre todas las superficies en ambos temas, lo que cumple el umbral WCAG AA para texto normal.

Hay dos precauciones. La luminosidad OKLCH no es lo mismo que una ratio de contraste WCAG, así que verifica el contraste con herramientas en lugar de fiarte solo de los números. Y deriva los matices con `color-mix()` a partir de funciones existentes en lugar de añadir literales nuevos, para que el conjunto de tokens siga siendo pequeño.

## Movimiento que se gana su lugar

El movimiento forma parte de la limpieza visual. Una interfaz en la que todo se mueve es tan ruidosa como una en la que cada separación es distinta. Da a cada animación un trabajo: confirmar una acción, mostrar un cambio de estado o dirigir la atención. Si una animación no tiene trabajo, elimínala.

El movimiento también tiene un coste de rendimiento, y es fácil subestimarlo. Al perfilar este sitio aparecieron dos patrones que parecían inofensivos pero empeoraban las métricas de Lighthouse:

- Una animación infinita dentro de una sección con `content-visibility: auto` costaba unos 3 segundos de trabajo en el hilo principal por cada 5 segundos en reposo.
- Animar `background-position` para un degradado con brillo costaba algo parecido y repintaba el encabezado principal en cada fotograma.

Las reglas resultantes son sencillas. Las animaciones continuas solo usan `transform`, que se ejecuta en el compositor. El texto nunca pasa por una opacidad parcial, porque un texto semitransparente falla las comprobaciones de contraste mientras se anima. Las animaciones fuera de pantalla se pausan. Y `prefers-reduced-motion: reduce` debe detener todas las animaciones; una regla general como esta es un buen punto de partida para cualquier proyecto:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Un presupuesto de movimiento trata la animación como cualquier otro coste: cada una tiene un motivo explícito y el total debe caber dentro del presupuesto de rendimiento.

## Medir la limpieza

La limpieza se vuelve duradera cuando se mide. Algunas comprobaciones útiles:

- **Número de literales.** Busca valores de color crudos en las hojas de estilos fuera del archivo de tokens. En este sitio, ninguna hoja de estilos contiene un literal de color de marca.
- **Número de valores.** Lista los valores distintos de espaciado, radio y duración en uso. Una lista que crece es una señal temprana de deriva.
- **Contraste.** Ejecuta axe en las pruebas end-to-end con ambos temas y en todas las direcciones de texto.
- **Estabilidad del layout.** Vigila el Cumulative Layout Shift y reserva espacio para el contenido que se carga después.
- **Coste en el hilo principal.** Perfila las páginas en reposo en busca de animaciones que nunca se detienen.

El caso de la [mejora del sistema de diseño](/es/work/design-system-uplift/) muestra el mismo principio a escala de equipo: los tokens se alinearon con las restricciones de implementación en lugar de tratarse como valores de diseño estáticos, y los estados repetidos pasaron a primitivas compartidas. Para la arquitectura que hay detrás de esas decisiones, lee las [buenas prácticas de frontend para una UI limpia y escalable](/es/blog/frontend-best-practices-clean-ui/).

Una UI limpia no es un estilo. Es un vocabulario pequeño usado con coherencia y un conjunto de comprobaciones que lo mantiene pequeño.
