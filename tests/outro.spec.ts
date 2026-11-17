import { expect, test } from '@playwright/test';
import { t, type MessageKey } from '../src/i18n/messages';
import { axe, scrollToVisible } from './helpers';

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

  for (const width of [390, 768, 1280, 1440]) {
    test(`signal field avoids copy and aligns to grid: ${locale} ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const field = page.locator('.po-field');
      await expect(field).toHaveAttribute('aria-hidden', 'true');
      await expect(field).toHaveAttribute('data-motion-scope', '');
      await scrollToVisible(field);
      await expect(field).not.toHaveAttribute('data-offscreen');
      const geometry = await field.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const copy = element.parentElement!.querySelector('.po-cta-copy')!;
        const ancestors: string[] = [];
        for (
          let ancestor = element.parentElement;
          ancestor;
          ancestor = ancestor.parentElement
        ) {
          if (getComputedStyle(ancestor).contentVisibility === 'auto')
            ancestors.push(ancestor.className);
        }
        return {
          field: rect.toJSON(),
          copy: copy.getBoundingClientRect().toJSON(),
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
          dots: Array.from(element.children)
            .filter((node) => getComputedStyle(node).display !== 'none')
            .map((node) => {
              const dot = node.getBoundingClientRect();
              return {
                inline:
                  getComputedStyle(element).direction === 'rtl'
                    ? rect.right - dot.left - dot.width / 2
                    : dot.left + dot.width / 2 - rect.left,
                block: dot.top + dot.height / 2 - rect.top,
              };
            }),
        };
      });
      expect(geometry.ancestors).toEqual([]);
      expect(geometry.overlaps).toEqual([]);
      expect(geometry.field.width).toBeGreaterThan(0);
      expect(geometry.field.height).toBeGreaterThan(0);
      if (width <= 760) {
        expect(geometry.field.top).toBeGreaterThan(geometry.copy.bottom);
        expect(geometry.dots.length).toBe(9);
      } else {
        if (locale === 'ar')
          expect(geometry.field.right).toBeLessThan(geometry.copy.left);
        else expect(geometry.field.left).toBeGreaterThan(geometry.copy.right);
        expect(geometry.dots.length).toBeGreaterThanOrEqual(16);
        expect(geometry.dots.length).toBeLessThanOrEqual(20);
      }
      for (const dot of geometry.dots) {
        for (const position of [dot.inline, dot.block]) {
          const node = Math.round((position - 7) / 14) * 14 + 7;
          expect(Math.abs(position - node)).toBeLessThanOrEqual(0.5);
        }
      }
      expect(
        await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        ),
      ).toBe(false);
    });
  }

  test(`signals pause offscreen and respond to CTA intent: ${locale}`, async ({
    page,
  }) => {
    await page.goto(path);
    const field = page.locator('.po-field');
    await expect(field).toHaveAttribute('data-offscreen', '');
    expect(
      await field.evaluate((element) =>
        element
          .getAnimations({ subtree: true })
          .every((animation) => animation.playState === 'paused'),
      ),
    ).toBe(true);
    await scrollToVisible(field);
    await expect(field).not.toHaveAttribute('data-offscreen');
    expect(
      await field.evaluate((element) =>
        element
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === 'running'),
      ),
    ).toBe(true);
    await expect(field).toHaveCSS('opacity', '0.55');
    for (const link of await page.locator('.po-actions a').all()) {
      await link.focus();
      await expect(link).toBeFocused();
      await expect(field).toHaveCSS('opacity', '1');
    }
    await page.locator('.po-link').first().focus();
    await expect(field).toHaveCSS('opacity', '0.55');
    if (await page.evaluate(() => matchMedia('(hover: hover)').matches)) {
      for (const link of await page.locator('.po-actions a').all()) {
        await link.hover();
        await expect(field).toHaveCSS('opacity', '1');
        await page.mouse.move(0, 0);
        await expect(field).toHaveCSS('opacity', '0.55');
      }
    }
  });

  test(`reduced motion keeps static signals and still cards: ${locale}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await scrollToVisible(page.locator('.po-cta'));
    const field = page.locator('.po-field');
    await page.locator('.po-actions a').first().focus();
    expect(
      await field.evaluate(
        (element) => element.getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
    const dots = await field
      .locator('span')
      .evaluateAll((elements) =>
        elements
          .filter((element) => getComputedStyle(element).display !== 'none')
          .map((element) => Number(getComputedStyle(element).opacity)),
      );
    expect(dots.filter((opacity) => opacity > 0).length).toBeGreaterThan(0);
    expect(dots.filter((opacity) => opacity === 0).length).toBeGreaterThan(0);
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
    await page.emulateMedia({ forcedColors: 'active' });
    await expect(field).toHaveCSS('visibility', 'hidden');
  });
}
