/**
 * Accessible toast notifications.
 *
 * The live region they are added to is created by the contact form script at
 * load (directly on <body>, so `position: fixed` is never trapped by a
 * section with `content-visibility: auto`), because a live region must exist
 * before content is announced into it.
 *
 * - Success toasts are announced politely (they are added to an
 *   `aria-live="polite"` region); error toasts use `role="alert"` so they
 *   interrupt, matching their urgency.
 * - Toasts auto-dismiss, but the timer pauses while the toast is hovered or
 *   focused, and each one has a labelled close button (Esc also closes).
 * - Exit/enter motion is CSS-only and disabled under reduced motion.
 */
export type ToastTone = 'success' | 'error';

/*
 * Usage: dispatch `new CustomEvent('portfolio:toast', { detail })` on
 * `document`, with `detail: ToastOptions`. motion.ts fetches this module on
 * first use, so producers need no runtime import and stay inlinable.
 */

export interface ToastOptions {
  tone: ToastTone;
  title: string;
  message: string;
  /** Accessible name of the close button. */
  dismissLabel: string;
  /** Milliseconds before auto-dismiss; errors stay longer by default. */
  duration?: number;
}

const ICONS: Record<ToastTone, string> = {
  success: 'M20 6 9 17l-5-5',
  error: 'M12 8v5M12 16.5v.01',
};

const SVG_NS = 'http://www.w3.org/2000/svg';
const EXIT_MS = 260;

function createIcon(tone: ToastTone): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ICONS[tone]);
  svg.append(path);
  return svg;
}

export function showToast(
  region: HTMLElement,
  { tone, title, message, dismissLabel, duration }: ToastOptions,
): () => void {
  const toast = document.createElement('div');
  toast.className = `toast toast--${tone}`;
  if (tone === 'error') toast.setAttribute('role', 'alert');

  const icon = document.createElement('span');
  icon.className = 'toast-icon';
  icon.append(createIcon(tone));

  const body = document.createElement('div');
  body.className = 'toast-body';
  const heading = document.createElement('strong');
  heading.textContent = title;
  const text = document.createElement('p');
  text.textContent = message;
  body.append(heading, text);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast-close';
  close.setAttribute('aria-label', dismissLabel);
  close.textContent = '×';

  const progress = document.createElement('span');
  progress.className = 'toast-progress';
  progress.setAttribute('aria-hidden', 'true');

  toast.append(icon, body, close, progress);

  const lifetime = duration ?? (tone === 'error' ? 9000 : 6000);
  toast.style.setProperty('--toast-life', `${lifetime}ms`);

  let remaining = lifetime;
  let startedAt = performance.now();
  let timer = 0;
  let closed = false;

  const dismiss = () => {
    if (closed) return;
    closed = true;
    window.clearTimeout(timer);
    toast.setAttribute('data-leaving', '');
    window.setTimeout(() => toast.remove(), EXIT_MS);
  };

  const resume = () => {
    if (closed) return;
    startedAt = performance.now();
    toast.removeAttribute('data-paused');
    timer = window.setTimeout(dismiss, remaining);
  };

  const pause = () => {
    if (closed) return;
    window.clearTimeout(timer);
    remaining -= performance.now() - startedAt;
    toast.setAttribute('data-paused', '');
  };

  close.addEventListener('click', dismiss);
  toast.addEventListener('pointerenter', pause);
  toast.addEventListener('pointerleave', resume);
  toast.addEventListener('focusin', pause);
  toast.addEventListener('focusout', (event) => {
    if (!toast.contains(event.relatedTarget as Node | null)) resume();
  });
  toast.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dismiss();
  });

  // Newest first; keep at most three on screen.
  region.prepend(toast);
  Array.from(region.children)
    .slice(3)
    .forEach((stale) => stale.remove());
  resume();

  return dismiss;
}
