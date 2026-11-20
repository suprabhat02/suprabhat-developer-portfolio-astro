import type { Locale } from '../i18n/config';
import { getExperience, type Position } from './experience';

/**
 * The About hero's career route: one stop per employer, oldest first, placed
 * on a time axis from the first start date to the build date. Every value
 * comes from `experience.ts`; nothing here is a new fact.
 */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Months since year 0 for a `Mon YYYY` date; `Present` maps to `now`. */
export const toMonthIndex = (value: string, now: Date): number => {
  if (value === 'Present') return now.getUTCFullYear() * 12 + now.getUTCMonth();
  const match = /^([A-Z][a-z]{2}) (\d{4})$/.exec(value);
  const month = match
    ? MONTHS.indexOf(match[1] as (typeof MONTHS)[number])
    : -1;
  if (!match || month < 0) {
    throw new Error(
      `careerRoute: unsupported date "${value}" in experience.ts`,
    );
  }
  return Number(match[2]) * 12 + month;
};

export interface RouteStop {
  readonly id: string;
  readonly company: string;
  readonly startYear: string;
  /** Last year, or the localized "Present" label for the current role. */
  readonly endLabel: string;
  readonly current: boolean;
  /** Position on the axis, 0 (first start) to 1 (build date). */
  readonly at: number;
  /** Label row above the line: 0 next to it, 1 above when 0 is taken. */
  readonly row: 0 | 1;
}

export interface RouteYear {
  readonly year: number;
  readonly at: number;
}

export interface CareerRoute {
  readonly stops: readonly RouteStop[];
  /** 1 January of each year inside the axis, for the ruler. */
  readonly years: readonly RouteYear[];
}

const endLabelOf = (position: Position): string =>
  position.end === 'Present'
    ? (position.endLabel ?? position.end)
    : (position.end.split(' ')[1] ?? position.end);

export const getCareerRoute = (
  locale: Locale,
  now: Date = new Date(),
): CareerRoute => {
  const positions = [...getExperience(locale)].sort(
    (a, b) => toMonthIndex(a.start, now) - toMonthIndex(b.start, now),
  );
  const first = positions[0];
  if (!first) return { stops: [], years: [] };
  const from = toMonthIndex(first.start, now);
  const span = Math.max(1, toMonthIndex('Present', now) - from);
  const at = (month: number) =>
    Math.round(((month - from) / span) * 10_000) / 10_000;

  // A label starts at its stop and runs toward the inline end. On the
  // narrowest wide layout (about 700px of track) a character of the company
  // name takes ~0.0136 of the axis and one of the smaller years line ~0.0115;
  // a label moves up a row when it would reach the next label in its row.
  const rowEnds: [number, number] = [-1, -1];
  const labelSpan = (position: Position) =>
    Math.max(
      position.company.length * 0.0136,
      `${position.start.slice(-4)} – ${endLabelOf(position)}`.length * 0.0115,
    ) + 0.012;
  const stops = positions.map((position): RouteStop => {
    const place = at(toMonthIndex(position.start, now));
    const row: 0 | 1 = place >= rowEnds[0] ? 0 : 1;
    rowEnds[row] = place + labelSpan(position);
    return {
      id: position.id,
      company: position.company,
      startYear: position.start.split(' ')[1] ?? position.start,
      endLabel: endLabelOf(position),
      current: position.end === 'Present',
      at: place,
      row,
    };
  });

  const years: RouteYear[] = [];
  for (
    let year = Math.floor(from / 12) + 1;
    year * 12 < from + span;
    year += 1
  ) {
    years.push({ year, at: at(year * 12) });
  }
  return { stops, years };
};
