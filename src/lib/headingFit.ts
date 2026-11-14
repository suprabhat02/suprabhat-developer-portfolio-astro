/**
 * Fits a page title to its box without JavaScript.
 *
 * A browser can only break a line at a space or a hyphen, so the longest run
 * of characters between those is the widest thing the heading must hold. The
 * page sets that length as `--h1-run`, and CSS divides the box width by it to
 * cap the font size. A word that fits is then never split mid-word.
 */
const BREAK_POINTS = /[\s­‐-—-]+/u;

export function longestUnbreakableRun(text: string): number {
  return text
    .split(BREAK_POINTS)
    .reduce((longest, run) => Math.max(longest, [...run].length), 1);
}

/** Inline style that exposes the run length to the `.page h1` / `.article-page h1` rules. */
export function headingFitStyle(title: string): string {
  return `--h1-run:${longestUnbreakableRun(title)}`;
}
