/**
 * Palette contrast gate.
 *
 * Derives every colour role exactly as src/styles/tokens.css does, converts
 * OKLCH -> sRGB with CSS Color 4 style chroma-reduction gamut mapping, and
 * reports WCAG 2.1 contrast for the pairs that actually ship as text.
 *
 *   node scripts/palette-check.mjs
 *
 * Exits non-zero if any text pair falls below 4.5:1, so it can gate a commit.
 * Edit CANDIDATES below. Seeds are [primary-h, secondary-h, neutral-h, chroma],
 * matching the four --seed-* variables in tokens.css.
 */

/* ── Candidates to test ──────────────────────────────────────────────── */
const CANDIDATES = [
  {
    name: 'Current (emerald + magenta)',
    seeds: [158, 335, 250, 0.2],
    split: false,
  },
  // Add candidates here. Set split:true for a high-chroma hue that needs the
  // text-safe / bright-fill split (see "The light-mode trap" in the README).

  // Family A: single hue (secondary-h === primary-h).
  {
    name: 'A1 Cobalt on warm carbon',
    seeds: [262, 262, 55, 0.2],
    split: false,
  },
  {
    name: 'A2 Jade on green-black (tonal)',
    seeds: [170, 170, 160, 0.17],
    split: false,
  },
  {
    name: 'A3 Ice cyan on violet ink',
    seeds: [208, 208, 290, 0.13],
    split: true,
  },
  {
    name: 'A4 Signal gold on plum-black',
    seeds: [88, 88, 330, 0.15],
    split: true,
  },
  {
    name: 'A5 Hot magenta on teal-black',
    seeds: [345, 345, 200, 0.2],
    split: false,
  },
  {
    name: 'A6 Ultraviolet on olive-black',
    seeds: [300, 300, 110, 0.18],
    split: false,
  },

  // Family B: two hue, primary-to-secondary spread inside 40-80 degrees.
  {
    name: 'B1 Aurora: jade to cyan on violet ink',
    seeds: [165, 212, 298, 0.17],
    split: false,
  },
  {
    name: 'B2 Infrared: pink to coral on green-black',
    seeds: [352, 32, 162, 0.19],
    split: false,
  },
  {
    name: 'B3 Deep sea: cobalt to cyan on warm carbon',
    seeds: [258, 205, 50, 0.19],
    split: false,
  },
  {
    name: 'B4 Dusk: rose to amber on teal-black',
    seeds: [8, 68, 198, 0.18],
    split: false,
  },
  {
    name: 'B5 Solar: gold to orange on indigo ink',
    seeds: [90, 45, 270, 0.15],
    split: true,
  },
  {
    name: 'B6 Glacier: ice cyan to mint on cocoa-black',
    seeds: [205, 160, 30, 0.13],
    split: true,
  },
];

/* ── OKLCH -> sRGB ───────────────────────────────────────────────────── */
const oklchToLinear = (L, C, h) => {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

const inGamut = (rgb) => rgb.every((c) => c >= -1e-4 && c <= 1 + 1e-4);

/** Reduce chroma until the colour fits sRGB, the way browsers do. */
const gamutMap = (L, C, h) => {
  if (inGamut(oklchToLinear(L, C, h)))
    return { rgb: oklchToLinear(L, C, h), clipped: false };
  let lo = 0;
  let hi = C;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToLinear(L, mid, h))) lo = mid;
    else hi = mid;
  }
  return { rgb: oklchToLinear(L, lo, h), clipped: true };
};

const encode = (c) => {
  const v = Math.min(1, Math.max(0, c));
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
};

const hex = ([L, C, h]) =>
  `#${gamutMap(L, C, h)
    .rgb.map((c) =>
      Math.round(encode(c) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

const luminance = ([L, C, h]) => {
  const [r, g, b] = gamutMap(L, C, h).rgb.map((c) => {
    const s = encode(c);
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (fg, bg) => {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/* ── Role derivation, mirroring tokens.css ───────────────────────────── */
const roles = ([P, S, N, C], split) => {
  const dark = {
    bg: [0.15, 0.035, N],
    'bg-card': [0.2, 0.04, N],
    surface: [0.18, 0.037, N],
    'surface-strong': [0.22, 0.042, N],
    text: [0.97, 0.012, N],
    'text-2': [0.82, 0.035, N],
    'text-3': [0.71, 0.04, N],
    accent: [split ? 0.78 : 0.72, C, P],
    'accent-strong': [split ? 0.84 : 0.81, C * (split ? 0.72 : 0.7), P],
    'accent-2': [split ? 0.6 : 0.82, C * (split ? 0.9 : 0.65), S],
    'on-accent': [0.14, 0.03, N],
  };
  dark['accent-fill'] = dark.accent;
  dark['on-accent-fill'] = dark['on-accent'];

  const light = {
    bg: [0.985, 0.006, N],
    'bg-card': [1, 0, N],
    surface: [1, 0, N],
    'surface-strong': [0.97, 0.012, N],
    text: [0.2, 0.04, N],
    'text-2': [0.38, 0.045, N],
    'text-3': [0.48, 0.045, N],
    accent: [split ? 0.46 : 0.48, C * 0.55, P],
    'accent-strong': [split ? 0.42 : 0.43, C * 0.5, P],
    'accent-2': [split ? 0.72 : 0.5, C * (split ? 0.95 : 0.85), S],
    'on-accent': [1, 0, N],
  };
  light['accent-fill'] = split ? [0.88, C, P] : light.accent;
  light['on-accent-fill'] = split ? [0.22, 0.03, N] : light['on-accent'];

  // Shiki keywords use --accent-2; a split palette's bright accent-2 is not
  // text-safe, so the picker preview maps them to --accent instead.
  for (const set of [dark, light]) {
    set['code-keyword'] = split ? set.accent : set['accent-2'];
  }

  return { dark, light };
};

/* ── The pairs that actually ship as text ────────────────────────────── */
const PAIRS = [
  ['body text on page', 'text', 'bg'],
  ['secondary text on page', 'text-2', 'bg'],
  ['tertiary text on card', 'text-3', 'bg-card'],
  ['accent as text on page', 'accent', 'bg'],
  ['accent as text on card', 'accent', 'bg-card'],
  ['accent ink on card', 'accent-strong', 'bg-card'],
  ['label on accent fill', 'on-accent', 'accent'],
  ['label on bright fill', 'on-accent-fill', 'accent-fill'],
  ['code keyword on surface', 'code-keyword', 'surface'],
];

const hueGap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
};

/* ── Report ──────────────────────────────────────────────────────────── */
let failed = false;

for (const { name, seeds, split } of CANDIDATES) {
  const [P, S, N] = seeds;
  const { dark, light } = roles(seeds, split);
  let worst = Infinity;

  console.log(`\n${'='.repeat(72)}`);
  console.log(
    `${name}   seeds=[${seeds.join(', ')}]${split ? '  (split accent)' : ''}`,
  );
  console.log(
    `  gradient spread ${hueGap(P, S)}deg  |  accent vs background ${hueGap(P, N)}deg`,
  );
  console.log(
    `  dark  accent ${hex(dark.accent)}  fill ${hex(dark['accent-fill'])}  a2 ${hex(dark['accent-2'])}  bg ${hex(dark.bg)}`,
  );
  console.log(
    `  light accent ${hex(light.accent)}  fill ${hex(light['accent-fill'])}  a2 ${hex(light['accent-2'])}  bg ${hex(light.bg)}`,
  );

  for (const [theme, set] of [
    ['dark', dark],
    ['light', light],
  ]) {
    for (const [label, fg, bg] of PAIRS) {
      const ratio = contrast(set[fg], set[bg]);
      worst = Math.min(worst, ratio);
      if (ratio < 4.5) {
        failed = true;
        console.log(
          `    FAIL ${theme.padEnd(5)} ${label.padEnd(24)} ${ratio.toFixed(2)}:1`,
        );
      }
    }
  }
  console.log(
    `  worst text pair: ${worst.toFixed(2)}:1  ${worst >= 4.5 ? 'PASSES AA' : 'BELOW AA'}`,
  );
}

console.log(
  `\n${failed ? 'Some pairs are below AA.' : 'All candidates pass AA in both themes.'}`,
);
process.exit(failed ? 1 : 0);
