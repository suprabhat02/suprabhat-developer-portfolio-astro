/**
 * Carousel controls (see src/components/Carousel.astro).
 *
 * The track scrolls natively; this module only adds what CSS cannot:
 * - previous/next buttons that move by the number of slides in view,
 * - the "how far along" counter and the buttons' end states,
 * - the progress thumb's size, and its position where scroll timelines are
 *   unsupported.
 *
 * Layout is measured only when the carousel is resized, never while
 * scrolling: the scroll handler reads `scrollLeft` and writes once per frame,
 * and only what changed. Values the thumb needs are written on the thumb
 * itself, so a scroll frame never restyles the slides or re-lays out the
 * controls (which made the rail flicker in Safari).
 */

type Cleanup = () => void;

interface Metrics {
  /** Distance between the starts of two neighbouring slides. */
  stride: number;
  /** Inline size of one slide. */
  slide: number;
  /** Inline size of the area slides are laid out in (track minus gutters). */
  view: number;
  /** Furthest the track can scroll. */
  max: number;
  count: number;
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const hasScrollTimeline =
  CSS.supports('animation-timeline', 'scroll()') &&
  CSS.supports('timeline-scope', '--cx-scroll');

/** Quiet time after the last scroll event before a press counts as done. */
const SETTLE_MS = 160;

/** Pixels within which the track counts as resting on an edge. */
const EDGE_TOLERANCE = 2;

const pad = (value: number): string => String(value).padStart(2, '0');

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

function mountCarousel(root: HTMLElement): Cleanup {
  const track = root.querySelector<HTMLElement>('[data-carousel-track]');
  if (!track) return () => undefined;

  const buttons = Array.from(
    root.querySelectorAll<HTMLButtonElement>('[data-carousel-step]'),
  );
  const current = root.querySelector<HTMLElement>('[data-carousel-current]');
  const thumb = root.querySelector<HTMLElement>('[data-carousel-thumb]');
  /** Last values written to the DOM, so unchanged frames write nothing. */
  let shownSeen = '';
  let shownProgress = '';
  const shownDisabled = new WeakMap<HTMLButtonElement, boolean>();
  let metrics: Metrics | null = null;
  let frame = 0;
  /** Where a button press is heading, while that scroll is still running. */
  let destination: number | null = null;
  let settleTimer = 0;

  /** Scroll distance from the start edge, positive in both directions. */
  const offset = (): number => Math.abs(track.scrollLeft);

  /** A track that takes focus to be scrolled gives it up when nothing scrolls. */
  const focusable = track.hasAttribute('data-carousel-focusable');
  const setStatic = (isStatic: boolean) => {
    root.toggleAttribute('data-static', isStatic);
    if (!focusable) return;
    if (isStatic) track.removeAttribute('tabindex');
    else track.setAttribute('tabindex', '0');
  };

  const measure = () => {
    const slides = Array.from(track.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    const [first, second] = slides;
    if (!first) {
      metrics = null;
      // Nothing to scroll through: keep the controls out of sight.
      setStatic(true);
      return;
    }
    const styles = getComputedStyle(track);
    const gutters =
      parseFloat(styles.paddingInlineStart) +
      parseFloat(styles.paddingInlineEnd);
    const width = first.getBoundingClientRect().width;
    const stride = second
      ? Math.abs(
          second.getBoundingClientRect().left -
            first.getBoundingClientRect().left,
        )
      : width;
    metrics = {
      stride: stride || width,
      slide: width,
      view: track.clientWidth - gutters,
      max: Math.max(0, track.scrollWidth - track.clientWidth),
      count: slides.length,
    };
    setStatic(metrics.max < EDGE_TOLERANCE);
    thumb?.style.setProperty(
      '--cx-view',
      `${clamp((track.clientWidth / track.scrollWidth) * 100, 8, 100)}%`,
    );
  };

  const render = () => {
    frame = 0;
    if (!metrics) return;
    const { stride, slide, view, max, count } = metrics;
    const position = offset();
    // Scroll positions are fractional on scaled displays and in RTL.
    const atStart = position < EDGE_TOLERANCE;
    const atEnd = position > max - EDGE_TOLERANCE;
    // The last slide that is fully on screen: "seen up to here".
    const seen = atEnd
      ? count
      : clamp(Math.floor((position + view - slide + 1) / stride) + 1, 1, count);
    const label = pad(seen);
    if (current && label !== shownSeen) {
      current.textContent = label;
      shownSeen = label;
    }
    buttons.forEach((button) => {
      const disabled =
        Number(button.dataset.carouselStep) < 0 ? atStart : atEnd;
      if (shownDisabled.get(button) === disabled) return;
      button.setAttribute('aria-disabled', String(disabled));
      shownDisabled.set(button, disabled);
    });
    if (!hasScrollTimeline && thumb) {
      const progress = (max > 0 ? clamp(position / max, 0, 1) : 0).toFixed(4);
      if (progress !== shownProgress) {
        thumb.style.setProperty('--cx-progress', progress);
        shownProgress = progress;
      }
    }
  };

  const settle = () => {
    destination = null;
  };

  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
    // `scrollend` is not universal, so also settle once scrolling goes quiet.
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, SETTLE_MS);
  };

  const onClick = (event: Event) => {
    const button =
      event.target instanceof Element
        ? event.target.closest<HTMLButtonElement>('[data-carousel-step]')
        : null;
    if (!button || !metrics) return;
    if (button.getAttribute('aria-disabled') === 'true') return;
    const { stride, slide, view, max } = metrics;
    // Move by as many whole slides as fit, so no slide is ever skipped.
    const slidesPerMove = Math.max(
      1,
      Math.floor((view + stride - slide + 1) / stride),
    );
    // Count from where the last press is heading, not from a position that
    // is still animating, so quick presses add up instead of cancelling out.
    const from = Math.round((destination ?? offset()) / stride);
    const step = Number(button.dataset.carouselStep) * slidesPerMove;
    destination = clamp((from + step) * stride, 0, max);
    const inline = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
    track.scrollTo({
      left: destination * inline,
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });
  };

  const resize = new ResizeObserver(() => {
    settle();
    measure();
    if (!frame) frame = window.requestAnimationFrame(render);
  });

  measure();
  render();
  resize.observe(track);
  track.addEventListener('scroll', onScroll, { passive: true });
  track.addEventListener('scrollend', settle, { passive: true });
  // A swipe or wheel takes over from a button press that is still running.
  track.addEventListener('pointerdown', settle, { passive: true });
  track.addEventListener('wheel', settle, { passive: true });
  root.addEventListener('click', onClick);
  root.setAttribute('data-ready', '');

  return () => {
    window.cancelAnimationFrame(frame);
    window.clearTimeout(settleTimer);
    resize.disconnect();
    track.removeEventListener('scroll', onScroll);
    track.removeEventListener('scrollend', settle);
    track.removeEventListener('pointerdown', settle);
    track.removeEventListener('wheel', settle);
    root.removeEventListener('click', onClick);
    root.removeAttribute('data-ready');
    root.removeAttribute('data-static');
    if (focusable) track.setAttribute('tabindex', '0');
    thumb?.style.removeProperty('--cx-view');
    thumb?.style.removeProperty('--cx-progress');
  };
}

export function mountCarousels(roots: Iterable<HTMLElement>): Cleanup {
  const cleanups = Array.from(roots, mountCarousel);
  return () => cleanups.forEach((cleanup) => cleanup());
}
