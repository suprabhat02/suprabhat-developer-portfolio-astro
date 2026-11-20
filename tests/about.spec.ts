import { expect, test, type Page } from '@playwright/test';
import { getCareerRoute } from '../src/data/careerRoute';
import { getHomepageConversionContent } from '../src/data/homepageConversion';
import { getProfile } from '../src/data/profile';
import { t } from '../src/i18n/messages';
import { setPreference } from './helpers';

const locales = ['en', 'es', 'ar'] as const;
const pathFor = (locale: (typeof locales)[number]) =>
  locale === 'en' ? '/about/' : `/${locale}/about/`;

const stopBoxes = (page: Page) =>
  page.locator('.ab-stop').evaluateAll((items) =>
    items.map((item) => {
      const dot = item.querySelector('.ab-stop-dot')?.getBoundingClientRect();
      const text = item.querySelector('.ab-stop-text')?.getBoundingClientRect();
      if (!dot || !text) throw new Error('A route stop lost its markup');
      return {
        x: dot.left + dot.width / 2,
        text: {
          left: text.left,
          right: text.right,
          top: text.top,
          bottom: text.bottom,
        },
      };
    }),
  );

for (const locale of locales) {
  test(`about route lists every employer in order: ${locale}`, async ({
    page,
  }) => {
    const route = getCareerRoute(locale);
    await page.goto(pathFor(locale));
    const stops = page.getByRole('list', { name: t(locale, 'nav.experience') });
    await expect(stops.locator('li')).toHaveCount(route.stops.length);
    for (const [index, stop] of route.stops.entries()) {
      const item = stops.locator('li').nth(index);
      await expect(item).toContainText(stop.company);
      await expect(item).toContainText(stop.startYear);
      await expect(item).toContainText(stop.endLabel);
    }
    await expect(stops.locator('.ab-stop--current')).toHaveCount(1);
  });

  test(`about chapters keep the published paragraphs: ${locale}`, async ({
    page,
  }) => {
    const profile = getProfile(locale);
    await page.goto(pathFor(locale));
    const chapters = page.locator('.ab-ch');
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
      await expect(chapter.locator('p')).toHaveText(body);
    }
    await expect(page.locator('.ab-creed-text')).toHaveText(profile.philosophy);
  });
}

for (const width of [768, 1040, 1440]) {
  for (const locale of locales) {
    test(`about route labels never collide at ${width}px: ${locale}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(pathFor(locale));
      const boxes = await stopBoxes(page);
      const xs = boxes.map((box) => box.x);
      // Oldest first, laid along the reading direction.
      const sorted = [...xs].sort((a, b) => (locale === 'ar' ? b - a : a - b));
      expect(xs).toEqual(sorted);
      for (const [index, a] of boxes.entries()) {
        for (const b of boxes.slice(index + 1)) {
          const overlap =
            a.text.left < b.text.right - 1 &&
            b.text.left < a.text.right - 1 &&
            a.text.top < b.text.bottom - 1 &&
            b.text.top < a.text.bottom - 1;
          expect(overlap).toBe(false);
        }
      }
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(false);
    });
  }
}

test('about route stacks vertically on a 320px phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const locale of locales) {
    await page.goto(pathFor(locale));
    const boxes = await stopBoxes(page);
    for (const [index, box] of boxes.slice(1).entries())
      expect(box.text.top).toBeGreaterThan(boxes[index]?.text.bottom ?? 0);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  }
});

test('about route rests finished and replays only on engagement', async ({
  page,
  isMobile,
}) => {
  const engage = () =>
    isMobile
      ? page.locator('.ab-hero .ph-title').tap()
      : page.locator('.ab-hero .ph-title').hover();
  const running = () =>
    page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) =>
            (animation.effect as KeyframeEffect | null)?.target?.closest?.(
              '.ab-route',
            ),
          ).length,
    );
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/about/');
  expect(await running()).toBe(0);
  await expect(page.locator('.ab-track-fill')).toHaveCSS('transform', 'none');
  await engage();
  await expect.poll(running).toBeGreaterThan(0);

  if (isMobile) await engage();
  else await page.mouse.move(5, 890);
  await setPreference(page, 'motion', 'off');
  await engage();
  expect(await running()).toBe(0);
  await expect(page.locator('.ab-track-fill')).toHaveCSS('transform', 'none');
});
