import type { Locale } from '../i18n/config';
import { getExperience, type Position } from './experience';
import { getProfile } from './profile';

/**
 * The About page's career path: one leg per employer, oldest first, from
 * `experience.ts`, each with its sentence of the career story from
 * `profile.ts`. Nothing here is a new fact; the only derived value is each
 * leg's tenure in months, which sizes the stretch of road after it.
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

export interface PathRole {
  readonly title: string;
  /** True when this title was reached by promotion inside the company. */
  readonly promotion: boolean;
}

export interface PathLeg {
  readonly id: string;
  readonly company: string;
  /** Titles held at this company, oldest first. */
  readonly roles: readonly PathRole[];
  readonly startYear: string;
  /** Localized "start – end" range, as the Experience page prints it. */
  readonly dates: string;
  /** Localized end label ("Present" for the current role). */
  readonly endLabel: string;
  readonly current: boolean;
  /** Whole months from start to end (at least 1); sizes the leg. */
  readonly months: number;
  /** This employer's sentence of the career story, when it has one. */
  readonly story: string | null;
}

const rolesOf = (position: Position): PathRole[] => {
  if (position.roles?.length) {
    return [...position.roles].reverse().map((role) => ({
      title: role.title,
      promotion: Boolean(role.promotion),
    }));
  }
  return position.title ? [{ title: position.title, promotion: false }] : [];
};

export const getCareerPath = (
  locale: Locale,
  now: Date = new Date(),
): readonly PathLeg[] => {
  const positions = getExperience(locale);
  const stories = getProfile(locale).career.byEmployer;
  // A sentence keyed to an id that no employer has would never be shown.
  const orphans = Object.keys(stories).filter(
    (id) => !positions.some((position) => position.id === id),
  );
  if (orphans.length > 0) {
    throw new Error(
      `careerRoute: career story for unknown employer(s) ${orphans.join(', ')} in profile.ts (${locale})`,
    );
  }
  return [...positions]
    .sort((a, b) => toMonthIndex(a.start, now) - toMonthIndex(b.start, now))
    .map((position) => {
      const endLabel = position.endLabel ?? position.end;
      return {
        id: position.id,
        company: position.company,
        roles: rolesOf(position),
        startYear: position.start.split(' ')[1] ?? position.start,
        dates: `${position.startLabel ?? position.start} – ${endLabel}`,
        endLabel,
        current: position.end === 'Present',
        months: Math.max(
          1,
          toMonthIndex(position.end, now) - toMonthIndex(position.start, now),
        ),
        story: stories[position.id] ?? null,
      };
    });
};
