import type { SceneName } from '../components/fx/scenes';
import type { Locale } from '../i18n/config';
import { t } from '../i18n/messages';
import { getSkills } from './skills';
import { getSkillLogos, tools, type ToolGroupId } from './tools';

/** How a group's card sits in the desktop bento (see `.stack-bento`). */
export type StackShape = 'wide' | 'narrow' | 'half';

interface StackCard {
  shape: StackShape;
  scene: SceneName;
}

/**
 * One card per technology group. Key order is card order, and the shapes
 * fill a six-column grid row by row: wide + narrow, narrow + wide, half + half.
 * Typing it as a record makes a new group fail the build until it has a card.
 */
const cards: Record<ToolGroupId, StackCard> = {
  languages: { shape: 'wide', scene: 'editor' },
  data: { shape: 'narrow', scene: 'store' },
  backend: { shape: 'narrow', scene: 'query' },
  styling: { shape: 'wide', scene: 'responsive' },
  workflow: { shape: 'half', scene: 'review' },
  design: { shape: 'half', scene: 'handoff' },
};

export interface StackItem {
  label: string;
  /** Up to two local logos; empty when the technology has none. */
  logos: readonly { src: string; invert: boolean }[];
}

export interface StackGroup extends StackCard {
  id: ToolGroupId;
  title: string;
  description: string;
  items: readonly StackItem[];
}

/**
 * The homepage stack: skills and tools as one list. Names come from
 * `skills.ts`, logos from `tools.ts`, headings and descriptions from
 * `messages.ts`. Fails the build if a group has no skills or a logo in
 * `tools.ts` would no longer be shown.
 */
export const getStack = (locale: Locale): readonly StackGroup[] => {
  const skills = new Map(
    getSkills(locale).skillGroups.map((group) => [group.id, group.items]),
  );
  const groups = (Object.keys(cards) as ToolGroupId[]).map((id) => {
    const items = skills.get(id);
    if (!items || items.length === 0) {
      throw new Error(`No skills are listed for the stack group "${id}".`);
    }
    return {
      id,
      ...cards[id],
      title: t(locale, `page.tools.group.${id}.title`),
      description: t(locale, `page.tools.group.${id}.description`),
      items: items.map((label) => ({ label, logos: getSkillLogos(label) })),
    };
  });

  const shown = new Set(
    groups.flatMap((group) =>
      group.items.flatMap((item) => item.logos.map((logo) => logo.src)),
    ),
  );
  const missing = tools.filter((tool) => !shown.has(tool.icon));
  if (missing.length > 0) {
    throw new Error(
      `Tools without a matching skill in the stack: ${missing
        .map((tool) => tool.name)
        .join(', ')}.`,
    );
  }
  return groups;
};
