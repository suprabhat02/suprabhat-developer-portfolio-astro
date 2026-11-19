import { expect, test, type Page } from '@playwright/test';
import { t } from '../src/i18n/messages';
import { axe, setPreference } from './helpers';

const isPanelOpen = (page: Page) =>
  page
    .locator('#prefs-panel')
    .evaluate((element) => element.matches(':popover-open'));

const option = (page: Page, group: 'theme' | 'motion', value: string) =>
  page.locator(`#prefs-panel input[name="pref-${group}"][value="${value}"]`);

for (const locale of ['en', 'es', 'ar'] as const) {
  const prefix = locale === 'en' ? '' : `/${locale}`;

  test(`display settings work from the keyboard and persist: ${locale}`, async ({
    page,
  }) => {
    await page.goto(`${prefix}/about/`);
    const trigger = page.getByRole('button', { name: t(locale, 'prefs.open') });
    await expect(trigger).toBeVisible();
    await expect(
      page.getByRole('group', { name: t(locale, 'prefs.label') }),
    ).toBeHidden();

    // Opening keeps focus on the trigger; the panel is next in tab order.
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => isPanelOpen(page)).toBe(true);
    await expect(trigger).toBeFocused();
    await expect(
      page.getByRole('group', { name: t(locale, 'prefs.theme') }),
    ).toBeVisible();
    await expect(
      page.getByRole('group', { name: t(locale, 'prefs.motion') }),
    ).toBeVisible();
    await expect(option(page, 'theme', 'dark')).toBeChecked();
    await expect(option(page, 'motion', 'system')).toBeChecked();

    const panelScan = await axe(page).include('#prefs-panel').analyze();
    expect(panelScan.violations).toEqual([]);

    // Tab reaches the checked theme option, then the checked motion option;
    // arrow keys move within a group (native radio behaviour, both directions).
    await page.keyboard.press('Tab');
    await expect(option(page, 'theme', 'dark')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(option(page, 'motion', 'system')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await expect(option(page, 'motion', 'off')).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
    expect(await page.evaluate(() => localStorage.getItem('sk-motion'))).toBe(
      'paused',
    );
    // A choice never closes the panel; Escape does, and focus comes back.
    await expect.poll(() => isPanelOpen(page)).toBe(true);
    await page.keyboard.press('Escape');
    await expect.poll(() => isPanelOpen(page)).toBe(false);
    await expect(trigger).toBeFocused();

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
    await expect(option(page, 'motion', 'off')).toBeChecked();

    // Back to "System": the stored choice is removed, motion plays again.
    await setPreference(page, 'motion', 'system');
    await expect(page.locator('html')).not.toHaveAttribute('data-motion', /./);
    expect(
      await page.evaluate(() => localStorage.getItem('sk-motion')),
    ).toBeNull();

    for (const theme of ['light', 'dark'] as const) {
      await setPreference(page, 'theme', theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const closed = await axe(page).analyze();
      expect(closed.violations).toEqual([]);
      await page.locator('#prefs-btn').click();
      const open = await axe(page).analyze();
      expect(open.violations).toEqual([]);
      await page.keyboard.press('Escape');
    }
  });
}

test('system reduced motion is the default and an explicit choice overrides it', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  await expect(option(page, 'motion', 'system')).toBeChecked();
  await expect(page.locator('.recs-track')).toHaveCSS('animation-name', 'none');

  await setPreference(page, 'motion', 'on');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'playing');
  if (await page.evaluate(() => matchMedia('(hover: hover)').matches))
    await page.locator('.hero-content').hover();
  else await page.locator('.hero-name').tap();
  await expect(page.locator('.hero')).toHaveAttribute('data-engaged', '');
  await expect(page.locator('.fx-aurora-flow')).toHaveCSS(
    'animation-name',
    'fx-aurora-flow',
  );

  await setPreference(page, 'motion', 'system');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
});

test('display settings keep working when storage is blocked', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const blocked = () => {
      throw new DOMException('Blocked', 'SecurityError');
    };
    Storage.prototype.getItem = blocked;
    Storage.prototype.setItem = blocked;
    Storage.prototype.removeItem = blocked;
  });
  await page.goto('/about/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await setPreference(page, 'motion', 'off');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  await setPreference(page, 'theme', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(pageErrors).toEqual([]);
});

test('without JavaScript the settings stay hidden and languages still open', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();
  await page.goto('/about/');
  await expect(page.locator('#prefs-btn')).toBeHidden();
  await page.locator('#lang-dd-btn').click();
  await expect(page.locator('#lang-menu')).toBeVisible();
  await page.locator('#lang-menu a[lang="es"]').click();
  await expect(page).toHaveURL('/es/about/');
  await context.close();
});

for (const [locale, path] of [
  ['en', '/about/'],
  ['ar', '/ar/about/'],
] as const) {
  test(`display settings fit and mirror at 320 px: ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(path);
    await page.locator('#prefs-btn').click();
    await expect.poll(() => isPanelOpen(page)).toBe(true);
    const layout = await page.evaluate(() => {
      const box = (selector: string) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing selector: ${selector}`);
        return element.getBoundingClientRect();
      };
      const controls = Array.from(
        document.querySelectorAll('.header-actions > *'),
      )
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0);
      const overlaps = controls.some((a, i) =>
        controls
          .slice(i + 1)
          .some((b) => a.left < b.right - 1 && b.left < a.right - 1),
      );
      return {
        button: box('#prefs-btn'),
        panel: box('#prefs-panel'),
        overlaps,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        // The page's laid-out width: excludes a reserved scrollbar gutter.
        viewport: document.documentElement.getBoundingClientRect().width,
        rtl: document.documentElement.dir === 'rtl',
      };
    });
    expect(layout.overlaps).toBe(false);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
    // A visible margin on both sides, never touching the screen edge.
    expect(layout.panel.left).toBeGreaterThanOrEqual(7.5);
    expect(layout.viewport - layout.panel.right).toBeGreaterThanOrEqual(7.5);
    expect(layout.panel.top).toBeGreaterThan(layout.button.bottom);
    // The panel sits at the header's inline end in both directions.
    if (layout.rtl) expect(layout.panel.left).toBeLessThan(10);
    else expect(layout.viewport - layout.panel.right).toBeLessThan(10);
  });
}

test('pausing motion hides nothing that reduced motion shows', async ({
  browser,
}) => {
  const hiddenText = async (paused: boolean) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: paused ? 'no-preference' : 'reduce',
    });
    if (paused)
      await context.addInitScript(() =>
        localStorage.setItem('sk-motion', 'paused'),
      );
    const page = await context.newPage();
    const result: string[] = [];
    for (const path of ['/', '/about/', '/ar/']) {
      await page.goto(path);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
      });
      await page.waitForTimeout(500);
      result.push(
        ...(await page.evaluate(() =>
          Array.from(document.querySelectorAll('main *'))
            .filter((element) =>
              Array.from(element.childNodes).some(
                (node) =>
                  node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
              ),
            )
            .filter((element) => {
              let opacity = 1;
              for (
                let node: Element | null = element;
                node && node !== document.body;
                node = node.parentElement
              )
                opacity *= Number(getComputedStyle(node).opacity);
              return element.getBoundingClientRect().width > 0 && opacity < 0.9;
            })
            .map((element) => element.textContent?.trim().slice(0, 40) ?? ''),
        )),
      );
    }
    await context.close();
    return result;
  };
  const reference = new Set(await hiddenText(false));
  const paused = await hiddenText(true);
  expect(paused.filter((text) => !reference.has(text))).toEqual([]);
});
