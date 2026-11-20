/** Diagram scenes beside the About chapters (see AboutScene.astro). */
export const aboutSceneNames = [
  /** About me: six year-arcs fill a ring wired to four kinds of product. */
  'built',
  /** Core expertise: a growing product; cost stays low, unlike the typical curve. */
  'contain',
  /** Engineering approach: loading, then error, then the ideal result. */
  'states',
  /** Availability: an IST clock with evening hours, wired to six focus areas. */
  'reach',
  /** Design philosophy: clutter sends the eye on a zigzag; clarity leads to one action. */
  'decide',
] as const;

export type AboutSceneName = (typeof aboutSceneNames)[number];
