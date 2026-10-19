---
title: 'Accesibilidad en React: lo que la mayoría de desarrolladores pasa por alto'
seoTitle: 'Accesibilidad en React: lo que casi todos olvidan'
description: 'Gestión del foco, teclado, regiones ARIA live y pruebas con lectores de pantalla: los fallos de accesibilidad en React que afectan a usuarios reales.'
pubDate: 2026-10-15
updatedDate: 2026-10-19
heroImage: /images/blog/accessibility-in-react-what-developers-skip-cover-1600x840.png
tags: ['Accesibilidad', 'Ingeniería UI']
draft: false
---

La mayoría de los consejos de accesibilidad para React son consejos para páginas estáticas. Añade texto alternativo, etiqueta los campos, revisa el contraste, ejecuta Lighthouse. Todo eso importa, y nada de eso toca los problemas que hacen que una aplicación React sea difícil de usar con teclado o con un lector de pantalla.

Esos problemas nacen justo de lo que hace útil a React: la interfaz cambia sin cargar una página nueva. Se abre un modal, cambia la ruta, aparece un toast, una lista se filtra sola. Cada cambio es evidente para quien mira la pantalla e invisible para quien no la ve, a menos que el código lo comunique de forma deliberada.

Este artículo cubre las carencias que más veo en bases de código React: el foco tras los cambios dinámicos, el comportamiento del teclado en componentes a medida, las regiones live y una rutina de pruebas con lectores de pantalla que detecta lo que las herramientas automáticas no pueden ver.

## Por qué la mayoría de los consejos de accesibilidad en React se quedan cortos

Los analizadores automáticos como axe y Lighthouse hacen bien una cosa: inspeccionar el documento en un momento concreto. Encuentran etiquetas ausentes, botones vacíos, atributos ARIA no válidos y contraste insuficiente. Son [defectos reales](https://www.w3.org/TR/WCAG22/), y todo proyecto debería bloquearlos en la integración continua.

Lo que un analizador no ve es el comportamiento a lo largo del tiempo. No sabe que el foco desapareció en el `body` al cerrar tu modal. No puede detectar que tu desplegable a medida ignora las flechas del teclado, ni que un usuario de lector de pantalla no oyó nada cuando un formulario se guardó con éxito. Una página puede sacar un 100 y seguir siendo inutilizable sin ratón.

La solución es tratar la accesibilidad como diseño de interacción, no como higiene del marcado. Ante cada cambio de estado de la interfaz, hazte tres preguntas:

- ¿Dónde está el foco del teclado después de este cambio?
- ¿Cómo se entera un usuario de lector de pantalla de que algo ha cambiado?
- ¿Se puede realizar sin puntero cada acción que provocó el cambio?

El resto del artículo aplica esas preguntas a los patrones que fallan con más frecuencia.

## Gestión del foco tras cambios dinámicos de contenido

Cuando el contenido cambia y el foco se queda donde estaba, los usuarios de teclado y de lector de pantalla pierden su posición. Cuando se elimina contenido que tenía el foco dentro, el foco vuelve al `body` del documento y la siguiente pulsación de Tab empieza desde lo alto de la página.

### Modales

Un [diálogo modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) debe mover el foco a su interior al abrirse, mantenerlo dentro mientras está abierto, cerrarse con Escape y devolver el foco al elemento que lo abrió. Hacerlo a mano implica escribir una trampa de foco, aplicar `inert` al fondo y gestionar el bloqueo del scroll.

El [elemento nativo `<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) hace casi todo por ti. `showModal()` vuelve inerte el resto de la página, mueve el foco al diálogo y lo cierra con Escape. Tú sigues siendo responsable de un detalle: devolver el foco de forma fiable y mantener sincronizado el estado de React.

```tsx
import { useEffect, useId, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    returnFocusRef.current?.focus();
    // Escape closes the dialog natively; tell the parent so state stays in sync.
    if (open) onClose();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onClose={handleClose}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button type="button" onClick={onClose}>
        Close
      </button>
    </dialog>
  );
}
```

El evento `close` se dispara tanto cuando el componente padre pone `open` a `false` como cuando el usuario pulsa Escape, así que un solo manejador cubre ambos casos. `useId` mantiene válida la asociación con el título cuando hay varios diálogos en la misma página.

### Cambios de ruta

En un sitio renderizado en el servidor, cada navegación carga un documento nuevo y los lectores de pantalla anuncian el título de la página. En un enrutador del lado del cliente, la URL cambia y el contenido se sustituye, pero el foco se queda en el enlace pulsado, que quizá ya no exista. Muchos lectores de pantalla no anuncian nada.

Mueve el foco al encabezado principal tras la navegación y actualiza el título del documento:

```tsx
import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageHeadingProps {
  title: string;
  children: ReactNode;
}

export function PageHeading({ title, children }: PageHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [pathname, title]);

  return (
    <h1 ref={headingRef} tabIndex={-1}>
      {children}
    </h1>
  );
}
```

`tabIndex={-1}` permite enfocar el encabezado por código sin añadirlo al orden de tabulación. Saltarse el primer renderizado es importante: en la carga inicial, el navegador y el lector de pantalla ya gestionan el documento nuevo, y robar el foco haría que el usuario se saltara el enlace para omitir contenido y la navegación.

### Toasts y actualizaciones en línea

Los toasts no deben tomar el foco. Mover el foco a una notificación interrumpe lo que el usuario estaba haciendo y lo deja en una región que desaparecerá en pocos segundos. Anuncia los toasts mediante una región live, como se explica más abajo.

La excepción es un toast que contiene una decisión necesaria, como «Deshacer eliminación». Si la acción importa, no debe estar en un toast que caduca. Usa un diálogo, o mantén el control para deshacer en la página, donde el usuario pueda alcanzarlo.

## Navegación por teclado en componentes a medida

Los elementos nativos traen su comportamiento de teclado. Un `<button>` responde a Enter y a Espacio; un `<select>` responde a las flechas y a la escritura anticipada. Cuando un equipo los sustituye por componentes a medida, el diseño visual suele sobrevivir y el contrato de teclado, no.

La WAI-ARIA Authoring Practices Guide (APG) documenta el comportamiento de teclado esperado para cada widget compuesto. Trátala como la especificación, y trata los roles ARIA como una promesa: si añades `role="tablist"`, los usuarios esperan el [comportamiento de teclado de unas pestañas](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

### Pestañas

Las pestañas usan un `tabIndex` itinerante: solo la pestaña seleccionada está en el orden de tabulación y las flechas se mueven entre pestañas. Después, Tab lleva al panel activo.

```tsx
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

interface TabItem {
  label: string;
  content: ReactNode;
}

export function Tabs({ items }: { items: TabItem[] }) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const select = (index: number) => {
    setSelected(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div>
      <div role="tablist" aria-label="Project details" onKeyDown={onKeyDown}>
        {items.map((item, index) => (
          <button
            key={item.label}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === selected}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== selected}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

Hay dos detalles fáciles de pasar por alto. En diseños de derecha a izquierda, ArrowRight y ArrowLeft deben intercambiar su significado, así que lee `document.dir` o pasa la dirección como parámetro. Y si cambiar de pestaña lanza una petición costosa, usa la activación manual: las flechas mueven el foco, y Enter o Espacio seleccionan.

### Comboboxes

El combobox es el widget a medida que más a menudo está roto. El patrón de la APG mantiene el foco del DOM en el campo de texto y usa `aria-activedescendant` para señalar la opción resaltada, con `aria-expanded` en el campo y `aria-controls` apuntando a la lista. Flecha abajo abre la lista, Enter selecciona y Escape cierra la lista sin borrar el texto.

Que funcione bien en cada combinación de lector de pantalla y navegador lleva semanas de pruebas. Salvo que el combobox sea tu producto, usa una implementación mantenida y probada, como React Aria, Downshift o Radix, y dedica tu tiempo a los estados que lo rodean: resultados cargando, sin resultados y errores.

### Selectores de fecha

Antes de construir un selector de fecha, comprueba si `<input type="date">` cubre el requisito. Te da entrada por teclado, formato localizado y el calendario accesible de la plataforma sin coste. Una cuadrícula de calendario a medida necesita navegación con flechas por día y por semana, Re Pág y Av Pág por mes, una cuadrícula etiquetada y una selección anunciada. Es mucho comportamiento que mantener para un campo en el que la mayoría de los usuarios preferiría escribir.

## Regiones ARIA live: cuándo usarlas y cuándo no

Una región live indica a las tecnologías de asistencia que anuncien los cambios de su contenido sin mover el foco. Es la herramienta adecuada para mensajes de estado: «Guardado», «3 resultados», «Subida completada».

El error más común es crear la región live en el mismo momento que el mensaje. Los lectores de pantalla vigilan las regiones que ya existen en el documento; una región insertada junto con su texto a menudo no se anuncia. Renderiza la región una vez, déjala vacía y cambia su texto.

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

const AnnounceContext = createContext<(message: string) => void>(() => {});

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  const announce = useCallback((next: string) => {
    setMessage('');
    // Clearing first lets the same message be announced twice in a row.
    requestAnimationFrame(() => setMessage(next));
  }, []);

  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <div role="status" className="visually-hidden">
        {message}
      </div>
    </AnnounceContext.Provider>
  );
}

export const useAnnounce = () => useContext(AnnounceContext);
```

`role="status"` es una región live educada: espera a que el lector de pantalla termine la frase en curso. La clase `visually-hidden` debe ocultar el texto visualmente sin sacarlo del árbol de accesibilidad, así que usa una utilidad basada en recorte, no `display: none`. Después, un componente llama a `announce('Changes saved')` tras un guardado correcto.

Igual de importante es saber cuándo no usarla:

- **No uses `role="alert"` para mensajes rutinarios.** Los anuncios asertivos interrumpen al usuario a mitad de frase. Resérvalos para errores que requieren atención inmediata.
- **No pongas [`aria-live`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live) en contenedores grandes.** Una región live que envuelve una lista de resultados completa leerá en voz alta cada fila que cambie.
- **No anuncies lo que el foco ya comunica.** Si mueves el foco a un encabezado o a un resumen de errores, el lector de pantalla lo lee. Anunciarlo de nuevo duplica el mensaje.
- **No uses regiones live para los errores de un formulario al enviarlo.** Mueve el foco a un resumen de errores al principio del formulario, con enlaces a cada campo no válido. Así el usuario tiene una lista por la que puede navegar, no una frase que oye una sola vez.

## Flujo de pruebas con lectores de pantalla

No hace falta ser un usuario experto de lectores de pantalla para encontrar los errores importantes. Hace falta una rutina repetible, aplicada a los flujos que importan, con las dos combinaciones que usan la mayoría de los usuarios.

### NVDA con Chrome en Windows

NVDA es gratuito y muy utilizado. Instálalo, abre tu aplicación en Chrome y activa el Visualizador de voz desde el menú de NVDA para leer lo que se anuncia.

- Recorre el flujo principal con Tab y escucha el nombre, el rol y el estado de cada control.
- Pulsa H para moverte entre encabezados en modo exploración, y NVDA+F7 para abrir la lista de elementos. La estructura debe tener sentido sin la parte visual.
- Provoca cada cambio dinámico: abre y cierra el modal, cambia de ruta, guarda el formulario, aplica un filtro. Confirma que cada cambio se anuncia o que el foco se mueve a un lugar con sentido.

### VoiceOver con Safari en macOS

VoiceOver viene con macOS. Actívalo y desactívalo con Comando+F5. La tecla modificadora de VoiceOver es Control+Opción.

- Usa VO+Flecha derecha para recorrer el contenido de forma lineal.
- Abre el rotor con VO+U para revisar encabezados, enlaces, regiones y controles de formulario.
- Repite las mismas comprobaciones de cambios dinámicos que hiciste con NVDA. Safari y Chrome exponen el árbol de accesibilidad de forma distinta, así que los errores suelen aparecer solo en una de las dos combinaciones.

Escribe los flujos: iniciar sesión, buscar, completar el formulario principal, recuperarse de un error. Ejecútalos antes de cada release y añade la parte de teclado a tus pruebas end-to-end para que no puedan romperse sin que nadie lo note. El [checklist de revisión de código frontend](/es/blog/frontend-code-review-checklist/) muestra dónde encajan las comprobaciones de teclado y foco en una revisión, y el caso de estudio del [flujo de contacto accesible](/es/work/accessible-contact-workflow/) aplica la misma forma de pensar a las etiquetas, la validación y las vías de contacto alternativas.

## Checklist práctico de auditoría

Usa esta lista en cualquier pantalla de React que cambie sin cargar una página nueva:

- El foco entra en un modal al abrirse y vuelve al disparador al cerrarse.
- Escape cierra cada modal, popover y menú.
- Tras un cambio de ruta en el cliente, el foco pasa al encabezado de la nueva página y el título del documento se actualiza.
- Los toasts nunca toman el foco, y cualquier toast con una acción tiene una alternativa que no caduca.
- Cada widget a medida sigue el patrón de teclado de la APG para su rol.
- Solo una pestaña de cada lista de pestañas está en el orden de tabulación, y las flechas respetan la dirección del texto.
- Los comboboxes usan una biblioteca probada o una implementación de `aria-activedescendant` probada a fondo.
- Las regiones live existen en el documento antes de que cambien sus mensajes.
- `role="alert"` se reserva para errores urgentes.
- Los errores de un formulario al enviarlo mueven el foco a un resumen de errores con enlaces a cada campo.
- Cada cambio dinámico se comprueba con NVDA y Chrome, y con VoiceOver y Safari.
- Los recorridos con teclado de los flujos críticos están cubiertos por pruebas end-to-end.

## Conclusiones clave

- Los analizadores automáticos revisan el marcado en un momento concreto; la mayoría de los errores de accesibilidad en React ocurren entre un momento y otro.
- Cada cambio de estado necesita una decisión sobre el foco y sobre cómo se anuncia.
- El elemento nativo `<dialog>` resuelve casi todo el comportamiento de un modal; tú sigues siendo responsable de devolver el foco y sincronizar el estado.
- Los widgets a medida deben implementar todo el contrato de teclado que promete su rol ARIA, o usar una biblioteca probada.
- Las regiones live deben existir antes de que cambie su contenido, y la mayoría de los mensajes deben ser educados.
- Dos combinaciones de lector de pantalla, NVDA con Chrome y VoiceOver con Safari, detectan la mayoría de los problemas reales.
