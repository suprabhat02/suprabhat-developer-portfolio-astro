/**
 * Progressive interaction layer for the motion primitives in
 * `src/styles/motion.css`.
 *
 * Contract:
 * - Pages are complete without this module; it only adds pointer-driven
 *   polish and small state toggles.
 * - All listeners are passive or delegated, and every DOM write is batched
 *   into a single animation frame, so no task approaches the 50 ms
 *   long-task threshold that Total Blocking Time measures.
 * - Pointer effects only run on fine, hover-capable pointers and respect
 *   `prefers-reduced-motion`.
 */

import type { ToastOptions } from './toast';

type Cleanup = () => void;

const media = {
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
  finePointer: window.matchMedia('(hover: hover) and (pointer: fine)'),
} as const;

const allowsPointerMotion = (): boolean =>
  media.finePointer.matches && !media.reducedMotion.matches;

/** Coalesces bursts of events into one call per animation frame. */
function rafThrottle<Args extends unknown[]>(
  callback: (...args: Args) => void,
): (...args: Args) => void {
  let frame = 0;
  let latestArgs: Args | null = null;

  return (...args: Args) => {
    latestArgs = args;
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      if (latestArgs) callback(...latestArgs);
    });
  };
}

const closestFromEvent = <T extends Element>(
  event: Event,
  selector: string,
): T | null =>
  event.target instanceof Element ? event.target.closest<T>(selector) : null;

/* ── Card spotlight: writes the pointer position as CSS variables ──── */

function initPointerGlow(): Cleanup {
  const onMove = rafThrottle((event: PointerEvent) => {
    if (!allowsPointerMotion()) return;
    const card = closestFromEvent<HTMLElement>(event, '[data-glow]');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  });

  document.addEventListener('pointermove', onMove, { passive: true });
  return () => document.removeEventListener('pointermove', onMove);
}

/* ── 3D tilt: rotates the hovered card toward the pointer ──────────── */
/* Also exposes the pointer offset as `--px/--py` for parallax layers. */

const MAX_TILT_DEG = 7;

function initTilt(): Cleanup {
  let active: HTMLElement | null = null;

  const reset = (element: HTMLElement) => {
    element.removeAttribute('data-tilting');
    ['--rx', '--ry', '--px', '--py'].forEach((property) =>
      element.style.removeProperty(property),
    );
  };

  const onMove = rafThrottle((event: PointerEvent) => {
    const card = allowsPointerMotion()
      ? closestFromEvent<HTMLElement>(event, '[data-tilt]')
      : null;

    if (active && active !== card) reset(active);
    active = card;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.setAttribute('data-tilting', '');
    card.style.setProperty('--rx', `${(-y * MAX_TILT_DEG).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${(x * MAX_TILT_DEG).toFixed(2)}deg`);
    // Normalised pointer offset (−0.5…0.5) for parallax layers inside.
    card.style.setProperty('--px', x.toFixed(3));
    card.style.setProperty('--py', y.toFixed(3));
  });

  const onLeaveDocument = () => {
    if (active) reset(active);
    active = null;
  };

  document.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeaveDocument);
  return () => {
    document.removeEventListener('pointermove', onMove);
    document.documentElement.removeEventListener(
      'pointerleave',
      onLeaveDocument,
    );
  };
}

/* ── Card hover effect: one highlight that glides between cards ────── */

function initHoverGroups(): Cleanup {
  const cleanups: Cleanup[] = [];

  document
    .querySelectorAll<HTMLElement>('[data-hover-group]')
    .forEach((group) => {
      const pill = group.querySelector<HTMLElement>(':scope > .fx-hover-pill');
      const itemSelector =
        group.dataset.hoverGroup || ':scope > :not(.fx-hover-pill)';
      if (!pill) return;

      const moveTo = (item: HTMLElement) => {
        const groupRect = group.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        group.style.setProperty('--hx', `${itemRect.left - groupRect.left}px`);
        group.style.setProperty('--hy', `${itemRect.top - groupRect.top}px`);
        group.style.setProperty('--hw', `${itemRect.width}px`);
        group.style.setProperty('--hh', `${itemRect.height}px`);
        group.setAttribute('data-hovering', '');
      };

      const findItem = (event: Event): HTMLElement | null => {
        if (!(event.target instanceof Element)) return null;
        const items = Array.from(
          group.querySelectorAll<HTMLElement>(itemSelector),
        );
        return (
          items.find((item) => item.contains(event.target as Node)) ?? null
        );
      };

      const onEnter = (event: Event) => {
        if (media.reducedMotion.matches) return;
        const item = findItem(event);
        if (item) moveTo(item);
      };
      const onLeave = () => group.removeAttribute('data-hovering');
      const onFocusOut = (event: FocusEvent) => {
        if (!group.contains(event.relatedTarget as Node | null)) onLeave();
      };

      group.addEventListener('pointerover', onEnter, { passive: true });
      group.addEventListener('focusin', onEnter);
      group.addEventListener('pointerleave', onLeave);
      group.addEventListener('focusout', onFocusOut);
      cleanups.push(() => {
        group.removeEventListener('pointerover', onEnter);
        group.removeEventListener('focusin', onEnter);
        group.removeEventListener('pointerleave', onLeave);
        group.removeEventListener('focusout', onFocusOut);
      });
    });

  return () => cleanups.forEach((cleanup) => cleanup());
}

/* ── Header: compact state and back-to-top visibility ──────────────── */

function initScrollState(): Cleanup {
  const header = document.querySelector<HTMLElement>('.site-header');
  const backToTop = document.querySelector<HTMLButtonElement>('[data-btt]');

  const sync = rafThrottle(() => {
    const y = window.scrollY;
    header?.toggleAttribute('data-scrolled', y > 24);
    if (backToTop) backToTop.hidden = y < 600;
  });

  const onTopClick = () =>
    window.scrollTo({
      top: 0,
      behavior: media.reducedMotion.matches ? 'auto' : 'smooth',
    });

  // The markup already matches the top-of-page state, so reading scrollY at
  // boot would only force a layout. Sync once layout has settled instead (to
  // catch restored scroll positions), then on every scroll.
  if (document.readyState === 'complete') sync();
  else window.addEventListener('load', sync, { once: true });
  window.addEventListener('scroll', sync, { passive: true });
  backToTop?.addEventListener('click', onTopClick);
  return () => {
    window.removeEventListener('load', sync);
    window.removeEventListener('scroll', sync);
    backToTop?.removeEventListener('click', onTopClick);
  };
}

/* ── Navigation pill: glides between links while the nav is in use ─── */
/*
 * Measurement happens only inside user-initiated pointer/focus events, never
 * at boot, so loading the page performs no forced synchronous layout. At
 * rest the current link keeps its own CSS highlight.
 */

const PILL_SETTLE_MS = 380;

function initNavIndicator(): Cleanup {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  const pill = nav?.querySelector<HTMLElement>('.nav-pill');
  if (!nav || !pill) return () => undefined;

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a'));
  let settleTimer = 0;

  const place = (link: HTMLAnchorElement) => {
    window.clearTimeout(settleTimer);
    const navRect = nav.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    nav.style.setProperty('--px', `${rect.left - navRect.left}px`);
    nav.style.setProperty('--pw', `${rect.width}px`);
    nav.setAttribute('data-pill', '');
  };

  const onEnter = (event: Event) => {
    if (media.reducedMotion.matches) return;
    const link = closestFromEvent<HTMLAnchorElement>(event, 'a');
    if (link && links.includes(link)) place(link);
  };

  // Glide back to the current link, then hand off to its CSS highlight.
  const onLeave = () => {
    if (!nav.hasAttribute('data-pill')) return;
    const current = links.find(
      (link) => link.getAttribute('aria-current') === 'page',
    );
    if (current) place(current);
    settleTimer = window.setTimeout(
      () => nav.removeAttribute('data-pill'),
      current ? PILL_SETTLE_MS : 0,
    );
  };

  const onFocusOut = (event: FocusEvent) => {
    if (!nav.contains(event.relatedTarget as Node | null)) onLeave();
  };

  nav.addEventListener('pointerover', onEnter, { passive: true });
  nav.addEventListener('focusin', onEnter);
  nav.addEventListener('pointerleave', onLeave);
  nav.addEventListener('focusout', onFocusOut);

  return () => {
    window.clearTimeout(settleTimer);
    nav.removeEventListener('pointerover', onEnter);
    nav.removeEventListener('focusin', onEnter);
    nav.removeEventListener('pointerleave', onLeave);
    nav.removeEventListener('focusout', onFocusOut);
  };
}

/* ── Scroll spy: marks the table-of-contents entry in view ─────────── */

function initScrollSpy(): Cleanup {
  const toc = document.querySelector<HTMLElement>('[data-scrollspy]');
  if (!toc || !('IntersectionObserver' in window)) return () => undefined;

  const links = new Map<string, HTMLAnchorElement>();
  toc.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    links.set(decodeURIComponent(link.hash.slice(1)), link);
  });

  const sections = Array.from(links.keys())
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);

  const setCurrent = (id: string) =>
    links.forEach((link, linkId) => {
      if (linkId === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setCurrent(visible[0].target.id);
    },
    { rootMargin: '-20% 0px -65% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
  return () => observer.disconnect();
}

/* ── In-view gating: infinite effects only run while visible ──────── */
/*
 * Offscreen infinite animations still cost main-thread time in Chrome
 * (measured: ~300 ms per 5 s at 4x CPU throttling for one meteor shower).
 * Each `[data-motion-scope]` is paused by CSS while it is marked
 * `data-offscreen`; without JavaScript nothing is ever paused.
 */

function initInViewMotion(): Cleanup {
  const scopes = document.querySelectorAll<HTMLElement>('[data-motion-scope]');
  if (!scopes.length || !('IntersectionObserver' in window)) {
    return () => undefined;
  }

  // Marks only the affected subtree, so style invalidation stays local.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting),
      );
    },
    { rootMargin: '160px 0px' },
  );

  scopes.forEach((scope) => observer.observe(scope));
  return () => observer.disconnect();
}

/* ── Living cards on touch screens: arm scenes near the viewport ───── */
/*
 * Scene animations exist only while they can play (see scenes.css). Touch
 * screens have no hover, so scenes are tied to scrolling instead; this
 * marks cards near the viewport so only those few carry animations.
 */

function initLiveScenes(): Cleanup {
  // Mirrors the `@media (hover: none)` block in scenes.css.
  const noHover = window.matchMedia('(hover: none)').matches;
  if (!noHover || media.reducedMotion.matches) return () => undefined;
  const cards = document.querySelectorAll<HTMLElement>('.fx-live');
  if (!cards.length || !('IntersectionObserver' in window)) {
    return () => undefined;
  }
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) =>
        entry.target.toggleAttribute('data-inview', entry.isIntersecting),
      ),
    { rootMargin: '25% 0px' },
  );
  cards.forEach((card) => observer.observe(card));
  return () => observer.disconnect();
}

/* ── Globe: fetch the renderer only when one approaches the viewport ─ */

function initLazyGlobes(): Cleanup {
  const hosts = document.querySelectorAll<HTMLElement>('[data-globe]');
  if (!hosts.length || !('IntersectionObserver' in window)) {
    return () => undefined;
  }
  const unmounts: Cleanup[] = [];
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        import('./globe')
          .then(({ mountGlobe }) =>
            unmounts.push(mountGlobe(entry.target as HTMLElement)),
          )
          .catch((error: unknown) => console.error(error));
      }),
    { rootMargin: '400px 0px' },
  );
  hosts.forEach((host) => observer.observe(host));
  return () => {
    observer.disconnect();
    unmounts.forEach((unmount) => unmount());
  };
}

/* ── Toasts: render requests from any script (see scripts/toast.ts) ── */

function initToasts(): Cleanup {
  const onToast = (event: Event) => {
    const region = document.querySelector<HTMLElement>('[data-toast-region]');
    if (!region || !(event instanceof CustomEvent)) return;
    const detail = event.detail as ToastOptions;
    import('./toast')
      .then(({ showToast }) => showToast(region, detail))
      .catch((error: unknown) => console.error(error));
  };
  document.addEventListener('portfolio:toast', onToast);
  return () => document.removeEventListener('portfolio:toast', onToast);
}

/* ── Boot ──────────────────────────────────────────────────────────── */

const initializers: ReadonlyArray<() => Cleanup> = [
  initInViewMotion,
  initScrollState,
  initNavIndicator,
  initScrollSpy,
  initPointerGlow,
  initTilt,
  initHoverGroups,
  initLiveScenes,
  initLazyGlobes,
  initToasts,
];

const boot = () => {
  initializers.forEach((initialize) => {
    try {
      initialize();
    } catch (error) {
      // An enhancement failing must never break the page.
      console.error(error);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
