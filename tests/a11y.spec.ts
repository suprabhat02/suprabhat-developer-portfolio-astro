import { expect, test } from '@playwright/test';
import { axe } from './helpers';

test('homepage renders correct structure and passes accessibility', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Suprabhat Kumar/);
  await expect(page.locator('link[rel="icon"][sizes="32x32"]')).toHaveAttribute(
    'href',
    '/assets/favicons/favicon-32x32.png',
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    '/assets/favicons/apple-touch-icon.png',
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    'href',
    '/site.webmanifest',
  );
  // Single H1 — critical SEO requirement
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Suprabhat Kumar',
  );
  await expect(page.locator('.hero-sub')).toContainText(
    'React architecture, SaaS dashboards, and frontend performance',
  );

  // Bento hero sections
  await expect(page.locator('.hero-grid')).toBeVisible();
  await expect(page.locator('.hero-content')).toBeVisible();
  await expect(page.locator('.hero-bottom')).toBeVisible();
  await expect(page.locator('.avail-card')).toBeVisible();
  await expect(page.locator('.hero-recruiter-list dd')).toHaveCount(3);
  await expect(page.locator('.hero-stack-list li')).toHaveCount(5);
  await expect(page.locator('.hero-proof-card')).toHaveCount(3);
  await expect(
    page.locator('.hero-case-card[href="/work/performance-modernization/"]'),
  ).toBeVisible();
  // Lazy by design (below the fold on phones); it must load once in view.
  await expect(page.locator('.hero-portrait-wrap img')).toHaveAttribute(
    'loading',
    'lazy',
  );
  await page.locator('.hero-portrait-wrap').scrollIntoViewIfNeeded();
  // The dev server transcodes the AVIF on first request, so allow for it.
  await expect(page.locator('.hero-portrait-wrap img')).toHaveJSProperty(
    'complete',
    true,
    { timeout: 20_000 },
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('.hero-portrait-wrap img')).toHaveAttribute(
    'srcset',
    /880w/,
  );
  await expect(
    page.locator('.hero-portrait-wrap source[type="image/avif"]'),
  ).toHaveAttribute('srcset', /880w/);
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute(
    'imagesrcset',
    /880w/,
  );
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute(
    'type',
    'image/avif',
  );
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute(
    'media',
    '(min-width: 1041px)',
  );
  await expect(page.locator('link[rel="preload"][as="image"]')).toHaveAttribute(
    'fetchpriority',
    'high',
  );
  await expect(page.locator('.site-nav a[aria-current="page"]')).toHaveCount(1);
  await expect(page.locator('.site-nav a[href="#home"]')).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.site-nav a[aria-current="page"]')).toHaveCount(1);
  await expect(page.locator('.site-nav a[href="#contact"]')).toHaveAttribute(
    'aria-current',
    'page',
  );
  const deferredImages = page.locator('img:not(.hero-portrait-wrap img)');
  await expect(deferredImages).toHaveCount(await deferredImages.count());
  for (const image of await deferredImages.all()) {
    await expect(image).toHaveAttribute('loading', 'lazy');
    await expect(image).toHaveAttribute('decoding', 'async');
  }

  // CTA band geometry — glow orbs must stay absolutely positioned
  const ctaLayout = await page.locator('.cta-band').evaluate((band) => ({
    height: band.getBoundingClientRect().height,
    leftGlowPosition: getComputedStyle(
      band.querySelector('.cta-glow-l') as HTMLElement,
    ).position,
    rightGlowPosition: getComputedStyle(
      band.querySelector('.cta-glow-r') as HTMLElement,
    ).position,
  }));
  // Two columns on desktop, copy above the globe on phones.
  expect(ctaLayout.height).toBeLessThan(1200);
  expect(ctaLayout.leftGlowPosition).toBe('absolute');
  expect(ctaLayout.rightGlowPosition).toBe('absolute');

  // Tech icons stay local, crawlable by adjacent text, and reachable over HTTP.
  for (const technology of [
    'FastAPI',
    'Azure',
    'PostgreSQL',
    'TanStack Query',
    'Bootstrap 5',
    'HTML5',
    'GraphQL',
    'MongoDB',
    'CSS3',
    'Ant Design',
    'Material UI',
    'Zustand',
  ]) {
    await expect(
      page.locator('#tools .tm-grid > .tm-item .tm-chip', {
        hasText: technology,
      }),
    ).toHaveCount(1);
  }
  expect(await page.locator('#skills img').count()).toBeGreaterThan(0);
  await expect(page.locator('#skills img:not([alt=""])')).toHaveCount(0);
  for (const skill of [
    'HTML5',
    'CSS3 + Sass',
    'TanStack Query',
    'GraphQL',
    'Bootstrap 5',
    'MongoDB',
  ]) {
    await expect(page.locator('#skills li', { hasText: skill })).toBeVisible();
  }

  await expect(page.locator('#work .conversion-card')).toHaveCount(3);
  await expect(
    page.locator('#work a[href="/work/performance-modernization/"]'),
  ).toBeVisible();
  const conversionOrder = await page
    .locator('#work, #problems, #engagements, #approach, #blog')
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(conversionOrder).toEqual([
    'work',
    'problems',
    'engagements',
    'approach',
    'blog',
  ]);
  // The marquee repeats quotes as aria-hidden clones; only originals count.
  await expect(
    page.locator('#recommendations .recs-slot:not([data-clone]) .rec-card'),
  ).toHaveCount(3);
  await expect(
    page.locator(
      '#recommendations .recs-slot[data-clone]:not([aria-hidden="true"])',
    ),
  ).toHaveCount(0);
  await expect(page.locator('a[href="/recommendations/"]')).toBeVisible();
  const technologyIconUrls = await page
    .locator('#tools img')
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).src),
    );
  await expect(page.locator('#tools .tm-item')).toHaveCount(28);
  await expect(page.locator('#tools .tm-group')).toHaveCount(6);
  await expect(page.locator('#tools .tm-track')).toHaveCount(0);
  for (const iconUrl of technologyIconUrls) {
    expect((await page.request.get(iconUrl)).status()).toBe(200);
  }

  // Contact form present with required fields
  const projectForm = page.locator('#homepage-contact-form');
  await expect(projectForm).toBeVisible();
  await expect(projectForm).toHaveAttribute(
    'action',
    'https://api.web3forms.com/submit',
  );
  for (const fieldName of ['name', 'email', 'message']) {
    await expect(projectForm.locator(`[name="${fieldName}"]`)).toHaveAttribute(
      'required',
      '',
    );
  }
  await projectForm.getByRole('button', { name: 'Send enquiry' }).click();
  const errorSummary = projectForm.locator('[data-error-summary]');
  await expect(errorSummary).toBeVisible();
  await expect(errorSummary).toBeFocused();
  await expect(errorSummary.locator('a')).toHaveCount(3);

  // No global SPA router: static pages keep navigation crawlable and avoid stale persisted shell state.
  await expect(
    page
      .locator('script[data-astro-rerun]')
      .or(page.locator('astro-client-router')),
  ).toHaveCount(0);
  await expect(page.locator('astro-island')).toHaveCount(0);

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const results = await axe(page).analyze();
  expect(results.violations).toEqual([]);

  await page.goto('/about/');
  await expect(page.locator('.desktop-nav a[href="/about/"]')).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveCount(
    1,
  );
});

test('experience timeline keeps semantic order and heading hierarchy', async ({
  page,
}) => {
  for (const prefix of ['', '/ar']) {
    await page.goto(`${prefix}/experience/`);
    const items = page.locator('.xp-list > .xp-item');
    expect(await items.count()).toBeGreaterThan(1);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('.xp-card h2').first()).toBeVisible();
    const titleSize = await page
      .locator('.xp-card .xp-title')
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(titleSize).toBeLessThanOrEqual(24);
    await expect(page.locator('.xp-item time').first()).toHaveAttribute(
      'datetime',
      /^\d{4}-\d{2}$/,
    );
  }
});

test('footer back-to-top and profile links meet the 24px target size', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ['/', '/es/', '/ar/']) {
    await page.goto(path);
    const targets = page.locator(
      '.footer-bottom > a[href$="#main-content"], .footer-profiles a',
    );
    await expect(targets).toHaveCount(4);
    for (const box of await targets.evaluateAll((links) =>
      links.map((link) => link.getBoundingClientRect().toJSON()),
    )) {
      expect(box.width, path).toBeGreaterThanOrEqual(24);
      expect(box.height, path).toBeGreaterThanOrEqual(24);
    }
    expect(
      await page
        .locator('.footer-profiles a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('rel'))),
    ).toEqual(['me noopener', 'me noopener', 'me noopener']);
  }
});

test('accessibility statement is complete, dated and axe-clean in every locale', async ({
  page,
}) => {
  for (const [prefix, reviewed] of [
    ['', '19 October 2026'],
    ['/es', '19 de octubre de 2026'],
    ['/ar', '19 أكتوبر 2026'],
  ] as const) {
    await page.goto(`${prefix}/accessibility/`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h2')).toHaveCount(5);
    await expect(
      page.locator('main .bullets').first().locator('li'),
    ).toHaveCount(11);
    await expect(
      page.locator('main .bullets').nth(1).locator('li'),
    ).toHaveCount(2);
    await expect(page.locator('main a[href^="mailto:"]')).toHaveCount(1);
    await expect(
      page.locator('.accessibility-reviewed time[datetime="2026-10-19"]'),
    ).toHaveText(reviewed);
    if (prefix === '') {
      const words = await page
        .locator('main')
        .evaluate(
          (main) =>
            (main as HTMLElement).innerText.match(
              /[\p{L}\p{N}][\p{L}\p{N}'’.+×-]*/gu,
            )?.length ?? 0,
        );
      expect(words).toBeGreaterThanOrEqual(250);
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index,follow,max-image-preview:large',
    );
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description?.length, prefix || '/en').toBeGreaterThanOrEqual(120);
    expect(description?.length, prefix || '/en').toBeLessThanOrEqual(155);
    const results = await axe(page).analyze();
    expect(results.violations, prefix || '/en').toEqual([]);
    const ranRules = [...results.passes, ...results.incomplete].map(
      (rule) => rule.id,
    );
    expect(ranRules).toContain('target-size');
  }
});
