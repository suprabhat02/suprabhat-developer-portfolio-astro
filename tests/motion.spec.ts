import { expect, test } from '@playwright/test';
import { t } from '../src/i18n/messages';
import { axe } from './helpers';

for (const locale of ['en', 'es', 'ar'] as const) {
  const prefix = locale === 'en' ? '' : `/${locale}`;

  test(`motion preference is accessible and persists: ${locale}`, async ({
    page,
  }) => {
    await page.goto(`${prefix}/about/`);
    const toggle = page.getByRole('button', {
      name: t(locale, 'motion.toggle'),
    });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.focus();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
    expect(await page.evaluate(() => localStorage.getItem('sk-motion'))).toBe(
      'paused',
    );

    await page.reload();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
    await expect(
      page.getByRole('main').getByRole('heading', { level: 1 }),
    ).toBeVisible();

    const scriptRequests: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'script')
        scriptRequests.push(request.url());
    });
    await page.waitForLoadState('networkidle');
    const scriptsBeforeToggle = [...scriptRequests];
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).toHaveAttribute(
      'data-motion',
      'playing',
    );
    expect(scriptRequests).toEqual(scriptsBeforeToggle);
    expect(await page.evaluate(() => localStorage.getItem('sk-motion'))).toBe(
      'playing',
    );

    await page.reload();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('html')).toHaveAttribute(
      'data-motion',
      'playing',
    );
    const results = await axe(page).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('system reduced motion is the default and an explicit choice overrides it', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: t('en', 'motion.toggle') });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  expect(
    await page.evaluate(() => localStorage.getItem('sk-motion')),
  ).toBeNull();
  await expect(page.locator('.recs-track')).toHaveCSS('animation-name', 'none');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'playing');
  if (await page.evaluate(() => matchMedia('(hover: hover)').matches))
    await page.locator('.hero-content').hover();
  else await page.locator('.hero-name').tap();
  await expect(page.locator('.hero')).toHaveAttribute('data-engaged', '');
  await expect(page.locator('.fx-aurora-flow')).toHaveCSS(
    'animation-name',
    'fx-aurora-flow',
  );
});

test('motion toggle remains usable when its storage key is blocked', async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    const getItem = Storage.prototype.getItem;
    const setItem = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) {
      if (key === 'sk-motion')
        throw new DOMException('Blocked', 'SecurityError');
      return getItem.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === 'sk-motion')
        throw new DOMException('Blocked', 'SecurityError');
      return setItem.call(this, key, value);
    };
  });
  await page.goto('/about/');
  const toggle = page.getByRole('button', { name: t('en', 'motion.toggle') });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  expect(pageErrors).toEqual([]);
});
