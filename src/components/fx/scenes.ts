/**
 * Registry of the animated mini-scenes rendered by `LiveScene.astro`.
 *
 * Content data references a scene by name (never by list position), so a
 * locale can publish different items, or reorder them, without a card ever
 * showing a visual that contradicts its copy.
 */
export const sceneNames = [
  /** Three-stage plan, build and launch timeline completing. */
  'pipeline',
  /** Loading filmstrip: an incomplete slow page becomes complete and fast. */
  'perf',
  /** Tangled connections settle into a clean layered graph. */
  'graph',
  /** Out-of-order responses: stale arrivals fade, only the newest fills the screen. */
  'advisory',
  /** Dashboard filter applies, KPI tiles appear and a line chart draws. */
  'chart',
  /** One button repeated consistently in a grid of sizes and states. */
  'tokens',
  /** Contrast improves, focus traverses controls and an accessibility badge passes. */
  'a11y',
  /** Browser page assembled from navigation through hero to content cards. */
  'browser',
  /** Scattered question cards converge into one clear goal card with a check. */
  'clarify',
  /** Three-tier architecture block diagram whose connectors draw in order. */
  'blueprint',
  /** Four quality checks tick green one by one, ending in a verified shield. */
  'quality',
  /** Two people in different time zones exchange messages and pin a decision. */
  'chat',
  /** Roadmap flags fill in and an amber risk resolves. */
  'milestones',
  /** Documents and a key pass from one person to a team with item checks. */
  'merge',
  /** Orbits around a core: the React + TypeScript stack. */
  'orbit',
  /** Americas, Europe and India pins with the shared overlap window. */
  'zones',
  /** Loose component chips wiring themselves into a page frame. */
  'components',
  /** A marker sprints down a track trailing speed streaks to a finish line. */
  'race',
  /** A speaker's sound waves highlight each caption line as it is read. */
  'voice',
  /** Three vitals rings fill to green one after another. */
  'vitals',
  /** Focus hops key to key across a keyboard row to an activated key. */
  'keys',
  /** A root node branches into children, which branch again. */
  'branch',
  /** A pulse travels the connector between a UI layer and a data layer. */
  'bridge',
  /** App window whose sidebar, top bar, tiles and table assemble into a tidy layout. */
  'layout',
  /** Browser, server and database: a locked request leaves, verified rows return. */
  'flow',
  /** Palette and spacing scale feed three matching controls; a speed gauge hits green. */
  'system',
  /** A line typed in an editor; the preview updates and the file has no errors. */
  'editor',
  /** A dispatched action passes its schema, updates the store, notifies subscribers. */
  'store',
  /** One page at 1280px and reflowed at 390px, the same card picked in both. */
  'responsive',
  /** A GET request runs its SQL; three rows return with 200 OK. */
  'query',
  /** A selected, measured button becomes a documented, checked component. */
  'handoff',
  /** A pull request: its diff, three passing checks, approved and merged. */
  'review',
] as const;

export type SceneName = (typeof sceneNames)[number];
