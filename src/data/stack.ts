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
 * fill the grid row by row: narrow + wide, wide + narrow, half + half. A wide
 * card holds a longer list, so both cards in a row need the same number of
 * logo rows and end level. Typing it as a record makes a new group fail the
 * build until it has a card.
 */
const cards: Record<ToolGroupId, StackCard> = {
  languages: { shape: 'narrow', scene: 'editor' },
  data: { shape: 'wide', scene: 'store' },
  styling: { shape: 'wide', scene: 'responsive' },
  backend: { shape: 'narrow', scene: 'query' },
  workflow: { shape: 'half', scene: 'review' },
  design: { shape: 'half', scene: 'handoff' },
};

export interface StackItem {
  label: string;
  /** The technology's local logo, or `null` when it has none. */
  logo: { src: string; invert: boolean } | null;
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
      items: items.map((label) => ({
        label,
        logo: getSkillLogos(label)[0] ?? null,
      })),
    };
  });

  const shown = new Set(
    groups.flatMap((group) =>
      group.items.flatMap((item) => (item.logo ? [item.logo.src] : [])),
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
