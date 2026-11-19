export type MotionListener = (paused: boolean) => void;
export type MotionChoice = 'paused' | 'playing' | null;

export interface MotionClock {
  elapsedAt(now?: number): number;
  dispose(): void;
}

export interface MotionPreference {
  /** The visitor's saved choice, or `null` to follow the system setting. */
  readonly choice: MotionChoice;
  readonly isPaused: boolean;
  readonly isSystemReducedMotion: boolean;
  subscribe(listener: MotionListener): () => void;
  setChoice(choice: MotionChoice): void;
  createClock(): MotionClock;
}

const STORAGE_KEY = 'sk-motion';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const listeners = new Set<MotionListener>();

const parseChoice = (value: string | null): MotionChoice =>
  value === 'paused' || value === 'playing' ? value : null;

const readChoice = (): MotionChoice => {
  try {
    return parseChoice(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

let choice = readChoice();
let paused = choice === null ? reducedMotion.matches : choice === 'paused';

const update = (next: boolean) => {
  paused = next;
  if (paused) document.documentElement.dataset.motion = 'paused';
  else if (choice === 'playing')
    document.documentElement.dataset.motion = 'playing';
  else delete document.documentElement.dataset.motion;
  listeners.forEach((listener) => listener(paused));
};

export const motionPreference: MotionPreference = {
  get choice() {
    return choice;
  },
  get isPaused() {
    return paused;
  },
  get isSystemReducedMotion() {
    return choice === null && reducedMotion.matches;
  },
  subscribe(listener) {
    listeners.add(listener);
    listener(paused);
    return () => listeners.delete(listener);
  },
  setChoice(next) {
    choice = next;
    try {
      if (next === null) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Motion still changes for this page when storage is unavailable.
    }
    update(next === null ? reducedMotion.matches : next === 'paused');
  },
  createClock() {
    const startedAt = performance.now();
    let accumulatedPause = 0;
    let pauseStartedAt: number | null = null;
    let pausedElapsed = 0;

    const unsubscribe = motionPreference.subscribe((isPaused) => {
      const now = performance.now();
      if (isPaused) {
        pausedElapsed = Math.max(0, now - startedAt - accumulatedPause);
        pauseStartedAt = now;
      } else if (pauseStartedAt !== null) {
        accumulatedPause += now - pauseStartedAt;
        pauseStartedAt = null;
      }
    });

    return {
      elapsedAt(now = performance.now()) {
        return paused
          ? pausedElapsed
          : Math.max(0, now - startedAt - accumulatedPause);
      },
      dispose: unsubscribe,
    };
  },
};

const onSystemMotionChange = () => {
  if (choice === null) update(reducedMotion.matches);
};

const onStorage = (event: StorageEvent) => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  choice = parseChoice(event.newValue);
  update(choice === null ? reducedMotion.matches : choice === 'paused');
};

reducedMotion.addEventListener('change', onSystemMotionChange);
window.addEventListener('storage', onStorage);
update(paused);
