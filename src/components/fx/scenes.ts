/**
 * Registry of the animated mini-scenes rendered by `LiveScene.astro`.
 *
 * Content data references a scene by name (never by list position), so a
 * locale can publish different items, or reorder them, without a card ever
 * showing a visual that contradicts its copy.
 */
export const sceneNames = [
  /** Scope → build → test → ship pipeline filling up. */
  'pipeline',
  /** Waterfall bars shrinking while a score ring climbs to 100. */
  'perf',
  /** Architecture graph: edges redraw while a scanner flags a risky node. */
  'graph',
  /** Two time zones exchanging review packets along an arc. */
  'advisory',
  /** Dashboard line chart drawing over growing bars. */
  'chart',
  /** Design tokens flowing into a themed component. */
  'tokens',
  /** Keyboard focus hopping across controls, each passing its check. */
  'a11y',
  /** Browser window whose sections build in, with a clicking cursor. */
  'browser',
  /** Magnifier scanning a brief and surfacing the key decision. */
  'scan',
  /** Isometric UI, state and data layers separating into a system. */
  'stack',
  /** Checklist ticking through to a passing quality gate. */
  'verify',
  /** Async conversation with a typing indicator. */
  'chat',
  /** Delivery track reaching each milestone, flag at the finish. */
  'milestones',
  /** Feature branch committing and merging back into main. */
  'merge',
  /** Orbits around a core: the React + TypeScript stack. */
  'orbit',
  /** Americas, Europe and India pins with the shared overlap window. */
  'zones',
] as const;

export type SceneName = (typeof sceneNames)[number];
