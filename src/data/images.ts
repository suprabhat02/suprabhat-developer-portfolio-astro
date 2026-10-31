export const heroPortraitWidths = [288, 360, 450, 560, 720, 880];

/** Viewports where the hero portrait renders above the fold. */
export const heroPortraitPreloadMedia = '(min-width: 1041px)';

// Matches the rendered portrait width measured at each layout breakpoint.
export const heroPortraitSizes =
  '(max-width: 760px) min(322px, calc(82vw - 51px)), (max-width: 1040px) 422px, min(442px, calc(42vw - 44px))';

export const heroPortraitQuality = 62;
