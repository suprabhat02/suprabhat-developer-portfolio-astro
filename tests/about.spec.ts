import { expect, test, type Page } from '@playwright/test';
import { getCareerPath } from '../src/data/careerRoute';
import { getHomepageConversionContent } from '../src/data/homepageConversion';
import { getProfile } from '../src/data/profile';
import { t } from '../src/i18n/messages';
import { setPreference } from './helpers';

const locales = ['en', 'es', 'ar'] as const;
const pathFor = (locale: (typeof locales)[number]) =>
  locale === 'en' ? '/about/' : `/${locale}/about/`;

/** Station centres and the two ends of each leg's road, in page pixels. */
const roadGeometry = (page: Page) =>
  page.locator('.ab-leg').evaluateAll((legs) =>
    legs.map((leg) => {
      const node = leg.querySelector('.ab-node')!.getBoundingClientRect();
      const path = leg.querySelector<SVGPathElement>('.ab-road-base');
      const toScreen = (at: number) => {
        if (!path) return null;
        const point = path.getPointAtLength(at);
        const matrix = path.getScreenCTM()!;
        const screen = new DOMPoint(point.x, point.y).matrixTransform(matrix);
        return { x: screen.x, y: screen.y };
      };
      return {
        node: { x: node.left + node.width / 2, y: node.top + node.height / 2 },
        start: toScreen(0),
        end: path ? toScreen(path.getTotalLength()) : null,
      };
    }),
  );

const hasOverflow = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );

for (const locale of locales) {
  test(`about path lists every employer, oldest first: ${locale}`, async ({
    page,
  }) => {
    const legs = getCareerPath(locale);
    await page.goto(pathFor(locale));
    const path = page.getByRole('list', { name: t(locale, 'nav.experience') });
    const items = path.locator(':scope > li');
    await expect(items).toHaveCount(legs.length);
    for (const [index, leg] of legs.entries()) {
      const item = items.nth(index);
      await expect(item.getByRole('heading', { level: 3 })).toHaveText(
        leg.company,
      );
      await expect(item.locator('.ab-leg-dates')).toHaveText(leg.dates);
      for (const role of leg.roles)
        await expect(item).toContainText(role.title);
    }
    await expect(path.locator('.ab-leg--current')).toHaveCount(1);
    await expect(path.locator('.ab-leg-promo')).toHaveText(
      t(locale, 'home.promoted'),
    );
  });

  test(`about chapters keep the published paragraphs: ${locale}`, async ({
    page,
  }) => {
    const profile = getProfile(locale);
    await page.goto(pathFor(locale));
    const chapters = page.locator('.ab-ch:not(.ab-creed)');
    await expect(chapters).toHaveCount(profile.about.length);
    const titles = [
      t(locale, 'home.about'),
      t(locale, 'home.experience'),
      t(locale, 'home.expertiseTitle'),
      getHomepageConversionContent(locale).approach.eyebrow,
      t(locale, 'home.availability'),
    ];
    for (const [index, body] of profile.about.entries()) {
      const chapter = chapters.nth(index);
      await expect(chapter.getByRole('heading', { level: 2 })).toHaveText(
        titles[index] ?? '',
      );
      await expect(chapter.locator('.ab-ch-body > p')).toHaveText(body);
    }
    // Four chapter scenes and the philosophy scene, all decorative.
    await expect(page.locator('.ab-sc[aria-hidden="true"]')).toHaveCount(5);
    await expect(page.locator('.ab-creed-text')).toHaveText(profile.philosophy);
  });

  test(`about hero shows the portrait eagerly: ${locale}`, async ({ page }) => {
    await page.goto(pathFor(locale));
    const portrait = page.locator('.ab-portrait img');
    await expect(portrait).toHaveAttribute(
      'alt',
      getProfile(locale).portrait.alt,
    );
    await expect(portrait).toHaveAttribute('loading', 'eager');
    await expect(portrait).toHaveAttribute('src', /portrait-1100/);
  });
}

for (const width of [1440, 1040, 768, 390, 320]) {
  for (const locale of locales) {
    test(`about path stations sit on the road at ${width}px: ${locale}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathFor(locale));
      await setPreference(page, 'motion', 'off');
      const legs = await roadGeometry(page);
      for (const [index, leg] of legs.entries()) {
        const next = legs[index + 1];
        if (!leg.start || !leg.end || !next) continue;
        expect(Math.abs(leg.start.x - leg.node.x)).toBeLessThan(1.5);
        expect(Math.abs(leg.start.y - leg.node.y)).toBeLessThan(1.5);
        expect(Math.abs(leg.end.x - next.node.x)).toBeLessThan(1.5);
        expect(Math.abs(leg.end.y - next.node.y)).toBeLessThan(1.5);
      }
      // Every leg but the last owns a stretch of road.
      expect(legs.filter((leg) => leg.start).length).toBe(legs.length - 1);
      expect(await hasOverflow(page)).toBe(false);
    });
  }
}

test('about path rests drawn with motion off and builds on scroll otherwise', async ({
  page,
}) => {
  const attached = () =>
    page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) =>
            (animation.effect as KeyframeEffect | null)?.target?.closest?.(
              '.ab-path, .ab-sc',
            ),
          ).length,
    );
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/about/');
  const scrollDriven = await page.evaluate(() =>
    CSS.supports('animation-timeline: view()'),
  );
  if (scrollDriven) expect(await attached()).toBeGreaterThan(0);

  await setPreference(page, 'motion', 'off');
  await page.goto('/about/');
  expect(await attached()).toBe(0);
  for (const lit of await page.locator('.ab-road--lit').all())
    await expect(lit).toHaveCSS('clip-path', 'none');
  for (const node of await page.locator('.ab-node-lit').all())
    await expect(node).toHaveCSS('opacity', '1');
});
