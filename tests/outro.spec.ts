import { expect, test, type Page } from '@playwright/test';
import { t, type MessageKey } from '../src/i18n/messages';
import { axe, scrollToVisible, setPreference } from './helpers';

declare global {
  interface Window {
    __motionTestRafCount: number;
  }
}

const related = {
  about: ['experience', 'work', 'blog'],
  skills: ['tools', 'work', 'experience'],
  experience: ['work', 'services', 'about'],
  tools: ['work', 'services', 'experience'],
  work: ['blog', 'experience', 'services'],
  recommendations: ['work', 'about', 'experience'],
  services: ['work', 'services', 'about'],
  faq: ['work', 'about', 'experience'],
  blog: ['work', 'about', 'services'],
} as const;

type Destination = (typeof related)[keyof typeof related][number];
const labels: Record<Destination, readonly [MessageKey, MessageKey]> = {
  about: ['nav.about', 'page.about.title'],
  experience: ['nav.experience', 'page.experience.title'],
  work: ['nav.work', 'page.work.title'],
  blog: ['nav.blog', 'page.blog.title'],
  services: ['nav.services', 'page.services.title'],
  tools: ['nav.tools', 'page.tools.title'],
};

const canvasSnapshot = (page: Page) =>
  page.locator('.po-field canvas').evaluate((element) => {
    if (!(element instanceof HTMLCanvasElement))
      throw new Error('Expected the outro canvas.');
    return element.toDataURL();
  });

const paintedPixels = (page: Page) =>
  page.locator('.po-field canvas').evaluate((element) => {
    if (!(element instanceof HTMLCanvasElement))
      throw new Error('Expected the outro canvas.');
    const context = element.getContext('2d');
    if (!context) throw new Error('Expected a 2D canvas context.');
    const pixels = context.getImageData(
      0,
      0,
      element.width,
      element.height,
    ).data;
    let opaque = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if ((pixels[index] ?? 0) > 0) opaque++;
    }
    return opaque;
  });

const sampledCanvas = (page: Page) =>
  page.locator('.po-field canvas').evaluate((element) => {
    if (!(element instanceof HTMLCanvasElement))
      throw new Error('Expected the outro canvas.');
    const context = element.getContext('2d');
    if (!context) throw new Error('Expected a 2D canvas context.');
    const pixels = context.getImageData(
      0,
      0,
      element.width,
      element.height,
    ).data;
    const samples: number[] = [];
    for (let row = 0; row < 48; row++) {
      const y = Math.min(
        element.height - 1,
        Math.floor(((row + 0.5) * element.height) / 48),
      );
      for (let column = 0; column < 128; column++) {
        const x = Math.min(
          element.width - 1,
          Math.floor(((column + 0.5) * element.width) / 128),
        );
        samples.push(pixels[(y * element.width + x) * 4 + 3] ?? 0);
      }
    }
    return samples;
  });

for (const locale of ['en', 'es', 'ar'] as const) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  for (const [route, destinations] of Object.entries(related)) {
    test(`outro preserves related links and actions: ${prefix}/${route}/`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/${route}/`);
      const nav = page.getByRole('navigation', {
        name: t(locale, 'page.related'),
      });
      await expect(nav.locator(':scope > h2')).toHaveCount(1);
      const links = nav.locator(':scope > ul > li > a');
      await expect(links).toHaveCount(3);
      for (const [index, destination] of destinations.entries()) {
        const keys = labels[destination];
        await expect(links.nth(index)).toHaveAttribute(
          'href',
          `${prefix}/${destination}/`,
        );
        await expect(links.nth(index)).toHaveAccessibleName(
          keys.map((key) => t(locale, key)).join(' '),
        );
      }
      const cta = page.getByRole('region', {
        name: t(locale, 'home.ctaTitle'),
      });
      await expect(cta.getByRole('link')).toHaveCount(2);
      await expect(
        cta.getByRole('link', { name: t(locale, 'action.start') }),
      ).toHaveAttribute('href', `${prefix}/contact/`);
      const resume = cta.getByRole('link', {
        name: t(locale, 'action.resume'),
      });
      await expect(resume).toHaveAttribute(
        'href',
        '/assets/suprabhat-kumar-senior-frontend-engineer-resume.pdf',
      );
      await expect(resume).toHaveAttribute('download', '');
    });
  }

  test(`outro is axe-clean in both themes: ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}/about/`);
    await scrollToVisible(page.locator('.po-cta'));
    for (const theme of ['dark', 'light']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      await expect(page.locator('.po-field')).toHaveCSS(
        'opacity',
        theme === 'light' ? '0.45' : '1',
      );
      const results = await axe(page).analyze();
      expect(results.violations, theme).toEqual([]);
      expect(
        [...results.passes, ...results.incomplete].map((rule) => rule.id),
      ).toContain('target-size');
    }
  });
}

for (const locale of ['en', 'ar'] as const) {
  const path = locale === 'en' ? '/about/' : '/ar/about/';
  test(`related cards reflow and show mirrored focus motion: ${locale}`, async ({
    page,
  }) => {
    await page.goto(path);
    for (const width of [320, 1040, 1041, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const boxes = await page
        .locator('.po-link')
        .evaluateAll((links) =>
          links.map((link) => link.getBoundingClientRect().toJSON()),
        );
      const first = boxes[0]!;
      for (const box of boxes.slice(1)) {
        if (width > 1040) {
          expect(box.top).toBe(first.top);
          expect(box.height).toBe(first.height);
          expect(Math.abs(box.width - first.width)).toBeLessThan(1);
        } else {
          expect(box.left).toBe(first.left);
          expect(box.top).toBeGreaterThan(first.bottom);
        }
      }
    }
    const card = page.locator('.po-link').first();
    await scrollToVisible(card);
    await card.focus();
    await expect(card).toHaveCSS('outline-style', 'solid');
    await expect(card).toHaveCSS('outline-width', '3px');
    await expect(card.locator('.po-arrow')).toHaveCSS(
      'transform',
      `matrix(1, 0, 0, 1, ${locale === 'ar' ? -3 : 3}, -3)`,
    );
    await expect
      .poll(() =>
        card
          .locator('.po-icon')
          .evaluate((icon) => getComputedStyle(icon, '::before').opacity),
      )
      .toBe('1');
  });

  for (const width of [390, 760, 768, 1280, 1440]) {
    test(`signal field clears copy and meets card edges: ${locale} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const field = page.locator('.po-field');
      await expect(field).toHaveAttribute('aria-hidden', 'true');
      await expect(field).toHaveAttribute('data-motion-scope');
      const geometry = await field.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const card = element.parentElement!;
        const cardRect = card.getBoundingClientRect();
        const cardStyle = getComputedStyle(card);
        const copy = card.querySelector('.po-cta-copy')!;
        const actionBottom = Math.max(
          ...Array.from(copy.querySelectorAll('a')).map(
            (link) => link.getBoundingClientRect().bottom,
          ),
        );
        const ancestors: string[] = [];
        for (
          let ancestor: Element | null = element.parentElement;
          ancestor;
          ancestor = ancestor.parentElement
        ) {
          if (getComputedStyle(ancestor).contentVisibility === 'auto')
            ancestors.push(ancestor.className);
        }
        return {
          field: rect.toJSON(),
          card: cardRect.toJSON(),
          borders: {
            top: Number.parseFloat(cardStyle.borderTopWidth),
            right: Number.parseFloat(cardStyle.borderRightWidth),
            bottom: Number.parseFloat(cardStyle.borderBottomWidth),
            left: Number.parseFloat(cardStyle.borderLeftWidth),
          },
          copy: copy.getBoundingClientRect().toJSON(),
          actionBottom,
          ancestors,
          overlaps: Array.from(
            copy.querySelectorAll('.eyebrow, h2, .po-cta-lead, a'),
          )
            .filter((node) => {
              const box = node.getBoundingClientRect();
              return (
                rect.left < box.right &&
                rect.right > box.left &&
                rect.top < box.bottom &&
                rect.bottom > box.top
              );
            })
            .map((node) => node.className),
          direction: getComputedStyle(element).direction,
          pointerEvents: getComputedStyle(element).pointerEvents,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        };
      });
      expect(geometry.ancestors).toEqual([]);
      expect(geometry.overlaps).toEqual([]);
      expect(geometry.field.width).toBeGreaterThan(0);
      expect(geometry.field.height).toBeGreaterThan(0);
      expect(geometry.pointerEvents).toBe('none');
      if (width <= 760) {
        expect(geometry.field.top).toBeGreaterThanOrEqual(
          geometry.actionBottom,
        );
        expect(
          Math.abs(
            geometry.field.bottom -
              (geometry.card.bottom - geometry.borders.bottom),
          ),
        ).toBeLessThanOrEqual(1);
        expect(
          Math.abs(
            geometry.field.left - (geometry.card.left + geometry.borders.left),
          ),
        ).toBeLessThanOrEqual(1);
        expect(
          Math.abs(
            geometry.field.right -
              (geometry.card.right - geometry.borders.right),
          ),
        ).toBeLessThanOrEqual(1);
      } else {
        expect(
          Math.abs(
            geometry.field.top - (geometry.card.top + geometry.borders.top),
          ),
        ).toBeLessThanOrEqual(1);
        expect(
          Math.abs(
            geometry.field.bottom -
              (geometry.card.bottom - geometry.borders.bottom),
          ),
        ).toBeLessThanOrEqual(1);
        if (geometry.direction === 'rtl') {
          expect(
            Math.abs(
              geometry.field.left -
                (geometry.card.left + geometry.borders.left),
            ),
          ).toBeLessThanOrEqual(1);
        } else {
          expect(
            Math.abs(
              geometry.field.right -
                (geometry.card.right - geometry.borders.right),
            ),
          ).toBeLessThanOrEqual(1);
        }
      }
      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    });
  }

  test(`canvas appears on demand and paints: ${locale}`, async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => {
      if (/\/dotGlow\.[\w-]+\.js$/.test(new URL(request.url()).pathname)) {
        requests.push(request.url());
      }
    });
    await page.goto(path);
    await page.waitForLoadState('load');
    expect(requests).toHaveLength(0);
    const field = page.locator('.po-field');
    await scrollToVisible(field);
    await expect(field).toHaveAttribute('data-ready', '', { timeout: 15_000 });
    await expect.poll(() => paintedPixels(page)).toBeGreaterThan(0);
    expect(requests).toHaveLength(1);
  });

  test(`canvas animates while visible and pauses offscreen: ${locale}`, async ({
    page,
  }) => {
    await page.goto(path);
    const field = page.locator('.po-field');
    await scrollToVisible(field);
    await expect(field).toHaveAttribute('data-ready', '');
    const first = await canvasSnapshot(page);
    await page.waitForTimeout(400);
    expect(await canvasSnapshot(page)).not.toBe(first);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect
      .poll(
        async () => {
          const before = await canvasSnapshot(page);
          await page.waitForTimeout(500);
          return (await canvasSnapshot(page)) === before;
        },
        { timeout: 3_000 },
      )
      .toBe(true);
  });

  test(`reduced motion draws a theme-aware static canvas: ${locale}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const field = page.locator('.po-field');
    await scrollToVisible(field);
    await expect(field).toHaveAttribute('data-ready', '');
    await expect.poll(() => paintedPixels(page)).toBeGreaterThan(0);
    const dark = await canvasSnapshot(page);
    await page.waitForTimeout(500);
    expect(await canvasSnapshot(page)).toBe(dark);

    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
    });
    await expect.poll(() => canvasSnapshot(page)).not.toBe(dark);
    const light = await canvasSnapshot(page);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
    });
    await expect.poll(() => canvasSnapshot(page)).not.toBe(light);

    const card = page.locator('.po-link').first();
    expect(
      await card.evaluate((element) => {
        if (!(element instanceof HTMLAnchorElement))
          throw new Error('Expected a related-page link.');
        element.focus();
        return element.getAnimations({ subtree: true }).length;
      }),
    ).toBe(0);
    await expect(card).toHaveCSS('transform', 'none');
    await expect(card.locator('.po-arrow')).toHaveCSS('transform', 'none');
    expect(
      await card.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
  });
}

test('the motion setting freezes canvas frames and resumes without a time jump', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__motionTestRafCount = 0;
    const requestFrame = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      window.__motionTestRafCount++;
      return requestFrame(callback);
    };
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about/');
  const field = page.locator('.po-field');
  await scrollToVisible(field);
  await expect(field).toHaveAttribute('data-ready', '');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');

  const readRafCount = () => page.evaluate(() => window.__motionTestRafCount);
  const pausedCanvas = await canvasSnapshot(page);
  await setPreference(page, 'motion', 'on');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'playing');
  await expect.poll(readRafCount).toBeGreaterThan(0);
  await page.waitForTimeout(250);

  await setPreference(page, 'motion', 'off');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  await page.waitForTimeout(100);
  const pausedFrames = await readRafCount();
  const pausedFrame = await canvasSnapshot(page);
  const pausedPixels = await sampledCanvas(page);
  await page.waitForTimeout(400);
  expect(await readRafCount()).toBe(pausedFrames);
  expect(await canvasSnapshot(page)).toBe(pausedFrame);

  await setPreference(page, 'motion', 'on');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'playing');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );
  const resumedPixels = await sampledCanvas(page);
  const changedRatio =
    resumedPixels.filter(
      (pixel, index) => Math.abs(pixel - (pausedPixels[index] ?? pixel)) > 24,
    ).length / resumedPixels.length;
  expect(changedRatio).toBeGreaterThan(0);
  expect(changedRatio).toBeLessThan(0.5);
  expect(pausedCanvas).not.toBe(await canvasSnapshot(page));
});

for (const [locale, path] of [
  ['en', '/about/'],
  ['ar', '/ar/about/'],
] as const) {
  test(`canvas backing store respects DPR cap: ${locale}`, async ({
    browser,
  }) => {
    for (const dpr of [1, 3]) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        deviceScaleFactor: dpr,
      });
      try {
        const page = await context.newPage();
        await page.goto(path);
        const field = page.locator('.po-field');
        await scrollToVisible(field);
        await expect(field).toHaveAttribute('data-ready', '');
        const size = await field.locator('canvas').evaluate((element) => {
          const canvas = element as HTMLCanvasElement;
          const rect = canvas.getBoundingClientRect();
          return {
            width: canvas.width,
            height: canvas.height,
            cssWidth: rect.width,
            cssHeight: rect.height,
            dpr: window.devicePixelRatio,
          };
        });
        const scale = Math.min(2, size.dpr);
        expect(
          Math.abs(size.width - size.cssWidth * scale),
        ).toBeLessThanOrEqual(1);
        expect(
          Math.abs(size.height - size.cssHeight * scale),
        ).toBeLessThanOrEqual(1);
      } finally {
        await context.close();
      }
    }
  });
}

test('canvas is not loaded near the top of the FAQ page', async ({ page }) => {
  await page.setViewportSize({ width: 1350, height: 940 });
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/\/dotGlow\.[\w-]+\.js$/.test(new URL(request.url()).pathname)) {
      requests.push(request.url());
    }
  });
  await page.goto('/faq/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(0);
});

test('forced colors hides the decorative field', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/about/');
  await expect(page.locator('.po-field')).toHaveCSS('visibility', 'hidden');
});
