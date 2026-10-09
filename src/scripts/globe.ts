/**
 * Dotted collaboration globe (after Aceternity's "GitHub Globe"), drawn on a
 * 2D canvas instead of three.js so it costs a few KB instead of ~600 KB.
 *
 * - Land is a 1.5° Natural Earth mask (src/data/globeLand.ts), thinned per
 *   latitude so dots stay evenly spaced toward the poles.
 * - Arcs travel from India to client hubs; India is tinted and labelled.
 * - Colors are read from the theme tokens and refreshed on theme change.
 * - Work happens only while the globe is on screen and the tab is visible;
 *   with `prefers-reduced-motion: reduce` a single static frame is drawn.
 * - Dragging rotates it (horizontal drags only on touch, so vertical page
 *   scrolling is never captured).
 */
import {
  GLOBE_GRID,
  GLOBE_INDIA_CELLS,
  GLOBE_LAND_MASK,
} from '../data/globeLand';

interface GeoPoint {
  lat: number;
  lng: number;
}

type Vec3 = readonly [number, number, number];

interface Palette {
  land: string;
  home: string;
  arc: string;
  hub: string;
  glow: string;
  sphere: string;
  label: string;
  font: string;
  haloAlpha: number;
}

/** Noida, India: where the work happens. */
const HOME: GeoPoint = { lat: 28.54, lng: 77.39 };

/** Time zones the collaboration section names, plus past team locations. */
const HUBS: readonly GeoPoint[] = [
  { lat: 37.77, lng: -122.42 }, // San Francisco
  { lat: 40.71, lng: -74.01 }, // New York
  { lat: 43.65, lng: -79.38 }, // Toronto
  { lat: 51.51, lng: -0.13 }, // London
  { lat: 52.52, lng: 13.4 }, // Berlin
  { lat: 55.68, lng: 12.57 }, // Copenhagen
  { lat: 25.2, lng: 55.27 }, // Dubai
  { lat: 1.35, lng: 103.82 }, // Singapore
  { lat: 31.23, lng: 121.47 }, // Shanghai
  { lat: -33.87, lng: 151.21 }, // Sydney
];

const DEG = Math.PI / 180;
const ARC_SAMPLES = 56;
const ARC_PERIOD_MS = 4200;
const TILT = 16 * DEG;

const toVec = ({ lat, lng }: GeoPoint): Vec3 => {
  const phi = lat * DEG;
  const lambda = lng * DEG;
  return [
    Math.cos(phi) * Math.sin(lambda),
    Math.sin(phi),
    Math.cos(phi) * Math.cos(lambda),
  ];
};

/** Decodes the land mask into unit vectors, India cells flagged. */
function buildDots(): { points: Float32Array; india: Uint8Array } {
  const { rows, cols, step } = GLOBE_GRID;
  const bytes = Uint8Array.from(atob(GLOBE_LAND_MASK), (char) =>
    char.charCodeAt(0),
  );
  const indiaCells = new Set(GLOBE_INDIA_CELLS);
  const coords: number[] = [];
  const flags: number[] = [];

  for (let row = 0; row < rows; row++) {
    const lat = 90 - (row + 0.5) * step;
    // Keep spacing even: skip columns where meridians converge.
    const stride = Math.max(1, Math.round(1 / Math.cos(lat * DEG)));
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      if (!(bytes[index >> 3] & (1 << (index & 7)))) continue;
      const isIndia = indiaCells.has(index);
      if (col % stride && !isIndia) continue;
      const [x, y, z] = toVec({ lat, lng: -180 + (col + 0.5) * step });
      coords.push(x, y, z);
      flags.push(isIndia ? 1 : 0);
    }
  }

  return { points: Float32Array.from(coords), india: Uint8Array.from(flags) };
}

/** Great-circle arc from `a` to `b`, lifted above the surface mid-way. */
function buildArc(a: Vec3, b: Vec3): Float32Array {
  const dot = Math.min(
    1,
    Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]),
  );
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega) || 1;
  const lift = 0.08 + 0.32 * (omega / Math.PI);
  const out = new Float32Array((ARC_SAMPLES + 1) * 3);

  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const t = i / ARC_SAMPLES;
    const wa = Math.sin((1 - t) * omega) / sinOmega;
    const wb = Math.sin(t * omega) / sinOmega;
    const height = 1 + lift * Math.sin(Math.PI * t);
    out[i * 3] = (wa * a[0] + wb * b[0]) * height;
    out[i * 3 + 1] = (wa * a[1] + wb * b[1]) * height;
    out[i * 3 + 2] = (wa * a[2] + wb * b[2]) * height;
  }
  return out;
}

/**
 * Resolves theme tokens to concrete colors. Tokens may hold expressions
 * such as `light-dark()` or `color-mix()` that canvas cannot parse, so each
 * one is applied to a probe's `color` and read back computed, which the
 * browser resolves for the active color scheme.
 */
const readPalette = (element: HTMLElement): Palette => {
  const probe = document.createElement('span');
  probe.hidden = true;
  element.append(probe);
  const token = (name: string, fallback: string) => {
    probe.style.color = fallback;
    probe.style.color = `var(${name})`;
    return getComputedStyle(probe).color || fallback;
  };
  const palette: Palette = {
    land: token('--text-2', '#a1a1a1'),
    home: token('--accent-2', '#2ec5d3'),
    arc: token('--accent', '#52a8ff'),
    hub: token('--accent-strong', '#8fc2ff'),
    glow: token('--accent-vivid', '#0070f3'),
    sphere: token('--bg-2', '#0a0a0a'),
    label: token('--text', '#ededed'),
    font: getComputedStyle(element).fontFamily,
    // A strong halo reads as haze on light backgrounds; keep it subtle there.
    haloAlpha: document.documentElement.dataset.theme === 'light' ? 0.22 : 0.5,
  };
  probe.remove();
  return palette;
};

export function mountGlobe(host: HTMLElement): () => void {
  const canvas = host.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return () => undefined;
  const ctx = context;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const homeLabel = host.dataset.homeLabel ?? 'India';
  const rtl = document.documentElement.dir === 'rtl';
  const { points, india } = buildDots();
  const home = toVec(HOME);
  const hubs = HUBS.map(toVec);
  const arcs = hubs.map((hub) => buildArc(home, hub));
  const projected = new Float32Array(points.length);

  let palette = readPalette(host);
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let visible = false;
  let start = performance.now();
  let dragYaw = 0;
  let dragPitch = 0;
  let velocity = 0;
  let pointer: { id: number; x: number; y: number } | null = null;

  /** Rotates a unit-sphere point into view space. */
  const rotate = (
    x: number,
    y: number,
    z: number,
    sinYaw: number,
    cosYaw: number,
    sinPitch: number,
    cosPitch: number,
  ): [number, number, number] => {
    const x1 = x * cosYaw - z * sinYaw;
    const z1 = x * sinYaw + z * cosYaw;
    return [x1, y * cosPitch - z1 * sinPitch, y * sinPitch + z1 * cosPitch];
  };

  const draw = (now: number) => {
    if (!width) return;
    const elapsed = reducedMotion.matches ? 0 : now - start;
    // Sway between Europe and East Asia so India stays in view, plus drag.
    const yaw =
      (HOME.lng - 18 + 46 * Math.sin((elapsed / 38000) * Math.PI * 2)) * DEG +
      dragYaw;
    const pitch = TILT + dragPitch;
    const sinYaw = Math.sin(yaw);
    const cosYaw = Math.cos(yaw);
    const sinPitch = Math.sin(pitch);
    const cosPitch = Math.cos(pitch);

    const size = Math.min(width, height);
    // Leaves headroom for arcs, which rise up to ~40% above the surface.
    const radius = size * 0.34;
    const cx = width / 2;
    const cy = height / 2;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Atmosphere and sphere body.
    ctx.globalAlpha = palette.haloAlpha;
    const halo = ctx.createRadialGradient(
      cx,
      cy,
      radius * 0.9,
      cx,
      cy,
      radius * 1.32,
    );
    halo.addColorStop(0, palette.glow);
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.32, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.sphere;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.18;
    const shade = ctx.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.4,
      radius * 0.1,
      cx,
      cy,
      radius,
    );
    shade.addColorStop(0, palette.glow);
    shade.addColorStop(1, 'transparent');
    ctx.fillStyle = shade;
    ctx.fill();

    // Land dots, batched into depth bands to limit state changes.
    const dot = Math.max(1.1, radius * 0.0105);
    for (let i = 0; i < points.length; i += 3) {
      const [x, y, z] = rotate(
        points[i],
        points[i + 1],
        points[i + 2],
        sinYaw,
        cosYaw,
        sinPitch,
        cosPitch,
      );
      projected[i] = cx + x * radius;
      projected[i + 1] = cy - y * radius;
      projected[i + 2] = z;
    }
    const bands: ReadonlyArray<[number, number]> = [
      [0, 0.35],
      [0.35, 0.7],
      [0.7, 1.01],
    ];
    for (const [low, high] of bands) {
      ctx.globalAlpha = 0.22 + high * 0.55;
      ctx.fillStyle = palette.land;
      ctx.beginPath();
      for (let i = 0, d = 0; i < projected.length; i += 3, d++) {
        const z = projected[i + 2];
        if (india[d] || z < low || z >= high) continue;
        ctx.rect(projected[i] - dot / 2, projected[i + 1] - dot / 2, dot, dot);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = palette.home;
    ctx.beginPath();
    for (let i = 0, d = 0; i < projected.length; i += 3, d++) {
      if (!india[d] || projected[i + 2] < 0) continue;
      ctx.rect(
        projected[i] - dot * 0.6,
        projected[i + 1] - dot * 0.6,
        dot * 1.2,
        dot * 1.2,
      );
    }
    ctx.fill();

    // Arcs: a faint trail plus a travelling comet per hub.
    ctx.lineCap = 'round';
    arcs.forEach((arc, arcIndex) => {
      const phase =
        ((elapsed + arcIndex * (ARC_PERIOD_MS / arcs.length) * 1.7) %
          (ARC_PERIOD_MS * 1.4)) /
        ARC_PERIOD_MS;
      const head = reducedMotion.matches ? 1 : Math.min(1, phase);
      const tail = reducedMotion.matches ? 0 : Math.max(0, phase - 0.42);
      let previous: [number, number, boolean] | null = null;

      for (let s = 0; s <= ARC_SAMPLES; s++) {
        const [x, y, z] = rotate(
          arc[s * 3],
          arc[s * 3 + 1],
          arc[s * 3 + 2],
          sinYaw,
          cosYaw,
          sinPitch,
          cosPitch,
        );
        // Points behind the sphere are hidden unless lifted past its rim.
        const shown = z > 0 || x * x + y * y > 1;
        const point: [number, number, boolean] = [
          cx + x * radius,
          cy - y * radius,
          shown,
        ];
        if (previous && previous[2] && shown) {
          const t = s / ARC_SAMPLES;
          const inComet = t >= tail && t <= head;
          ctx.globalAlpha = inComet
            ? 0.25 + 0.75 * ((t - tail) / Math.max(0.001, head - tail))
            : 0.14;
          ctx.strokeStyle = palette.arc;
          ctx.lineWidth = inComet ? Math.max(1.4, radius * 0.008) : 1;
          ctx.beginPath();
          ctx.moveTo(previous[0], previous[1]);
          ctx.lineTo(point[0], point[1]);
          ctx.stroke();
        }
        previous = point;
      }

      // Hub marker, with a ring when the comet lands.
      const [hx, hy, hz] = rotate(
        hubs[arcIndex][0],
        hubs[arcIndex][1],
        hubs[arcIndex][2],
        sinYaw,
        cosYaw,
        sinPitch,
        cosPitch,
      );
      if (hz > 0) {
        const px = cx + hx * radius;
        const py = cy - hy * radius;
        ctx.globalAlpha = 1;
        ctx.fillStyle = palette.hub;
        ctx.beginPath();
        ctx.arc(px, py, dot * 1.3, 0, Math.PI * 2);
        ctx.fill();
        const landed = phase - 1;
        if (!reducedMotion.matches && landed > 0 && landed < 0.35) {
          const progress = landed / 0.35;
          ctx.globalAlpha = 1 - progress;
          ctx.strokeStyle = palette.hub;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(px, py, dot * (1.5 + progress * 5), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    });

    // Home marker: India, with a pulsing ring and its label.
    const [x, y, z] = rotate(
      home[0],
      home[1],
      home[2],
      sinYaw,
      cosYaw,
      sinPitch,
      cosPitch,
    );
    if (z > 0) {
      const px = cx + x * radius;
      const py = cy - y * radius;
      const pulse = reducedMotion.matches ? 0.4 : (elapsed % 1800) / 1800;
      ctx.globalAlpha = 0.9 * (1 - pulse);
      ctx.strokeStyle = palette.home;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, dot * (2 + pulse * 7), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.home;
      ctx.beginPath();
      ctx.arc(px, py, dot * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // Label pill to the right of the marker; `textAlign: left` is
      // physical, so it sits correctly for both reading directions.
      const fontSize = Math.max(11, Math.round(size * 0.032));
      ctx.font = `700 ${fontSize}px ${palette.font}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.direction = rtl ? 'rtl' : 'ltr';
      const labelX = px + dot * 4.5;
      const labelWidth = ctx.measureText(homeLabel).width;
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = palette.sphere;
      ctx.beginPath();
      const pill: [number, number, number, number] = [
        labelX - fontSize * 0.5,
        py - fontSize * 0.85,
        labelWidth + fontSize,
        fontSize * 1.7,
      ];
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(...pill, fontSize * 0.85);
      } else {
        ctx.rect(...pill);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.label;
      ctx.fillText(homeLabel, labelX, py + 1);
    }
    ctx.globalAlpha = 1;
  };

  const loop = (now: number) => {
    frame = 0;
    if (!pointer && Math.abs(velocity) > 0.00005) {
      dragYaw += velocity;
      velocity *= 0.94;
    }
    draw(now);
    if (visible && !reducedMotion.matches && !document.hidden) {
      frame = requestAnimationFrame(loop);
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(loop);
  };

  const resize = new ResizeObserver(([entry]) => {
    const box = entry.contentRect;
    width = box.width;
    height = box.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    schedule();
  });
  resize.observe(canvas);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
  });
  io.observe(host);

  const onVisibility = () => {
    if (!document.hidden) schedule();
  };
  document.addEventListener('visibilitychange', onVisibility);

  const theme = new MutationObserver(() => {
    palette = readPalette(host);
    schedule();
  });
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  const onDown = (event: PointerEvent) => {
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    velocity = 0;
    canvas.setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent) => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const scale = 0.006;
    velocity = dx * scale;
    dragYaw += velocity;
    if (event.pointerType !== 'touch') {
      dragPitch = Math.max(-0.6, Math.min(0.6, dragPitch - dy * scale));
    }
    schedule();
  };
  const onUp = (event: PointerEvent) => {
    if (pointer && event.pointerId === pointer.id) pointer = null;
    schedule();
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  host.setAttribute('data-ready', '');
  start = performance.now();

  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    io.disconnect();
    theme.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
  };
}
