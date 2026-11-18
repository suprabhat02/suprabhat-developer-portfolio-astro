type TokenVariable = `--${string}`;

interface DotGlowConfig {
  gap: number;
  radius: number;
  opacity: number;
  speedMin: number;
  speedMax: number;
  speedScale: number;
  colorVar: TokenVariable;
  glowColorVar: TokenVariable;
}

interface Dots {
  x: Float32Array;
  y: Float32Array;
  phase: Float32Array;
  speed: Float32Array;
}

const FRAME_INTERVAL = 1000 / 30;
const CIRCLE_END_ANGLE = Math.PI * 2;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const readNumber = (
  value: string | undefined,
  fallback: number,
  min: number,
  max: number,
): number => {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clamp(parsed, min, max) : fallback;
};

const readVariable = (
  value: string | undefined,
  fallback: TokenVariable,
): TokenVariable =>
  value?.startsWith('--') ? (value as TokenVariable) : fallback;

const readConfig = (host: HTMLElement): DotGlowConfig => {
  const speedMin = readNumber(host.dataset.speedMin, 0.4, 0, 10);
  const speedMax = readNumber(host.dataset.speedMax, 1.3, 0, 10);
  return {
    gap: readNumber(host.dataset.gap, 12, 4, 64),
    radius: readNumber(host.dataset.radius, 2, 0.5, 8),
    opacity: readNumber(host.dataset.opacity, 0.6, 0, 1),
    speedMin: Math.min(speedMin, speedMax),
    speedMax: Math.max(speedMin, speedMax),
    speedScale: readNumber(host.dataset.speedScale, 1, 0, 10),
    colorVar: readVariable(host.dataset.colorVar, '--text-3'),
    glowColorVar: readVariable(host.dataset.glowColorVar, '--accent-fill'),
  };
};

const createDots = (
  width: number,
  height: number,
  config: DotGlowConfig,
): Dots => {
  const cols = Math.ceil(width / config.gap) + 2;
  const rows = Math.ceil(height / config.gap) + 2;
  const count = (cols + 1) * (rows + 1);
  const dots: Dots = {
    x: new Float32Array(count),
    y: new Float32Array(count),
    phase: new Float32Array(count),
    speed: new Float32Array(count),
  };
  let index = 0;

  for (let i = -1; i < cols; i++) {
    for (let j = -1; j < rows; j++) {
      dots.x[index] = i * config.gap + (j % 2 === 0 ? 0 : config.gap * 0.5);
      dots.y[index] = j * config.gap;
      dots.phase[index] = Math.random() * Math.PI * 2;
      dots.speed[index] =
        config.speedMin + Math.random() * (config.speedMax - config.speedMin);
      index++;
    }
  }

  return dots;
};

export function mountDotGlow(host: HTMLElement): () => void {
  const canvas = host.querySelector('canvas');
  if (!canvas) throw new Error('Dotted glow canvas is missing.');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Dotted glow 2D context is unavailable.');

  const config = readConfig(host);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const forcedColors = window.matchMedia('(forced-colors: active)');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let dots: Dots = {
    x: new Float32Array(),
    y: new Float32Array(),
    phase: new Float32Array(),
    speed: new Float32Array(),
  };
  let color = '';
  let glowColor = '';
  let visible = false;
  let frame = 0;
  let lastDraw = 0;

  const readColors = () => {
    const probe = document.createElement('span');
    probe.hidden = true;
    host.append(probe);
    probe.style.color = `var(${config.colorVar})`;
    color = getComputedStyle(probe).color;
    probe.style.color = `var(${config.glowColorVar})`;
    glowColor = getComputedStyle(probe).color;
    probe.remove();
  };

  const canAnimate = () =>
    !reducedMotion.matches &&
    !forcedColors.matches &&
    visible &&
    !document.hidden &&
    width > 0 &&
    height > 0;

  const cancel = () => {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const draw = (now: number, allowOffscreen = false) => {
    if (!width || !height) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    if (forcedColors.matches) return;
    if (
      !reducedMotion.matches &&
      !allowOffscreen &&
      (!visible || document.hidden)
    ) {
      return;
    }

    context.save();
    context.fillStyle = color;
    const time = reducedMotion.matches
      ? 0
      : (now / 1000) * Math.max(config.speedScale, 0);
    const radius = config.radius;
    const opacity = config.opacity;
    const { x, y, phase, speed } = dots;
    let shadowBlur = 0;
    let shadowColor = 'transparent';

    for (let i = 0; i < x.length; i++) {
      const mod = (time * speed[i]! + phase[i]!) % 2;
      const lin = mod < 1 ? mod : 2 - mod;
      const alpha = 0.25 + 0.55 * lin;
      const nextShadowBlur = alpha > 0.6 ? (6 * (alpha - 0.6)) / 0.4 : 0;
      const nextShadowColor = alpha > 0.6 ? glowColor : 'transparent';

      if (nextShadowBlur !== shadowBlur) {
        context.shadowBlur = nextShadowBlur;
        shadowBlur = nextShadowBlur;
      }
      if (nextShadowColor !== shadowColor) {
        context.shadowColor = nextShadowColor;
        shadowColor = nextShadowColor;
      }

      context.globalAlpha = alpha * opacity;
      context.beginPath();
      context.arc(x[i]!, y[i]!, radius, 0, CIRCLE_END_ANGLE);
      context.fill();
    }

    context.restore();
    lastDraw = now;
    host.setAttribute('data-ready', '');
  };

  const schedule = () => {
    if (frame || !canAnimate()) return;
    frame = requestAnimationFrame((now) => {
      frame = 0;
      if (!canAnimate()) return;
      if (now - lastDraw < FRAME_INTERVAL) {
        schedule();
        return;
      }
      draw(now);
      schedule();
    });
  };

  const clear = () => {
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
  };

  readColors();

  const resize = new ResizeObserver(([entry]) => {
    if (!entry) return;
    width = entry.contentRect.width;
    height = entry.contentRect.height;
    dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = createDots(width, height, config);
    draw(reducedMotion.matches ? 0 : performance.now(), true);
    schedule();
  });
  resize.observe(host);

  const visibility = new IntersectionObserver(([entry]) => {
    if (!entry) return;
    visible = entry.isIntersecting;
    if (visible) schedule();
    else cancel();
  });
  visibility.observe(host);

  const onVisibilityChange = () => {
    if (document.hidden) cancel();
    else schedule();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const theme = new MutationObserver(() => {
    readColors();
    draw(reducedMotion.matches ? 0 : performance.now(), true);
    schedule();
  });
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const onReducedMotionChange = () => {
    cancel();
    if (forcedColors.matches) clear();
    else draw(reducedMotion.matches ? 0 : performance.now(), true);
    schedule();
  };
  reducedMotion.addEventListener('change', onReducedMotionChange);

  const onForcedColorsChange = () => {
    cancel();
    if (forcedColors.matches) clear();
    else draw(reducedMotion.matches ? 0 : performance.now(), true);
    schedule();
  };
  forcedColors.addEventListener('change', onForcedColorsChange);

  return () => {
    cancel();
    resize.disconnect();
    visibility.disconnect();
    theme.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.removeEventListener('change', onReducedMotionChange);
    forcedColors.removeEventListener('change', onForcedColorsChange);
  };
}
