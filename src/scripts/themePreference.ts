/**
 * One source of truth for the colour theme.
 *
 * The visitor picks `system`, `light` or `dark`; the choice lives only in
 * this browser (`localStorage` key `sk-theme`). With no saved choice the site
 * stays dark, its designed default. `system` follows
 * `prefers-color-scheme` and keeps following it while the page is open.
 *
 * The inline bootstrap in `BaseLayout.astro` applies the same rules before
 * first paint, so this module only takes over once scripts run.
 */

export type ThemeChoice = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export type ThemeListener = (choice: ThemeChoice, theme: ResolvedTheme) => void;

export interface ThemePreference {
  readonly choice: ThemeChoice;
  readonly theme: ResolvedTheme;
  subscribe(listener: ThemeListener): () => void;
  setChoice(choice: ThemeChoice): void;
}

const STORAGE_KEY = 'sk-theme';
const DEFAULT_CHOICE: ThemeChoice = 'dark';
const lightScheme = window.matchMedia('(prefers-color-scheme: light)');
const listeners = new Set<ThemeListener>();

export const isThemeChoice = (value: unknown): value is ThemeChoice =>
  value === 'system' || value === 'light' || value === 'dark';

const readChoice = (): ThemeChoice => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return isThemeChoice(saved) ? saved : DEFAULT_CHOICE;
  } catch {
    return DEFAULT_CHOICE;
  }
};

const resolve = (next: ThemeChoice): ResolvedTheme =>
  next === 'system' ? (lightScheme.matches ? 'light' : 'dark') : next;

let choice = readChoice();
let theme = resolve(choice);

const apply = () => {
  theme = resolve(choice);
  const root = document.documentElement;
  if (root.dataset.theme !== theme) root.dataset.theme = theme;
  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  const themeColorValue = themeColor?.dataset[theme];
  if (themeColor && themeColorValue && themeColor.content !== themeColorValue)
    themeColor.content = themeColorValue;
  listeners.forEach((listener) => listener(choice, theme));
};

export const themePreference: ThemePreference = {
  get choice() {
    return choice;
  },
  get theme() {
    return theme;
  },
  subscribe(listener) {
    listeners.add(listener);
    listener(choice, theme);
    return () => listeners.delete(listener);
  },
  setChoice(next) {
    choice = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The theme still changes for this page when storage is unavailable.
    }
    apply();
  },
};

lightScheme.addEventListener('change', () => {
  if (choice === 'system') apply();
});

// Another tab changed the theme: follow it so open tabs never disagree.
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  choice = isThemeChoice(event.newValue) ? event.newValue : DEFAULT_CHOICE;
  apply();
});

apply();
