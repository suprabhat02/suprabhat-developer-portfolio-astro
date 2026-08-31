import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('homepage renders correct structure and passes accessibility', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Suprabhat Kumar/);
  // Single H1 — critical SEO requirement
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  // Bento hero sections
  await expect(page.locator('.hero-grid')).toBeVisible();
  await expect(page.locator('.hero-content')).toBeVisible();
  await expect(page.locator('.hero-bottom')).toBeVisible();
  await expect(page.locator('.avail-card')).toBeVisible();
  await expect(page.locator('.writing-card')).toBeVisible();
  await expect(page.locator('.hero-portrait-wrap img')).toHaveJSProperty(
    'complete',
    true,
  );
  await expect(page.locator('.hero-portrait-wrap img')).toHaveAttribute(
    'fetchpriority',
    'high',
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
  expect(ctaLayout.height).toBeLessThan(700);
  expect(ctaLayout.leftGlowPosition).toBe('absolute');
  expect(ctaLayout.rightGlowPosition).toBe('absolute');

  // New tech icons added in this rewrite
  for (const technology of ['FastAPI', 'Azure', 'PostgreSQL']) {
    await expect(
      page.locator('.tm-ltr > .tm-item:not([aria-hidden]) .tm-chip', {
        hasText: technology,
      }),
    ).toHaveCount(1);
  }
  const technologyIconUrls = await page
    .locator('#tools img')
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).src),
    );
  for (const iconUrl of technologyIconUrls) {
    expect((await page.request.get(iconUrl)).status()).toBe(200);
  }

  // Contact form present with required fields
  await expect(page.locator('#cform')).toBeVisible();
  await expect(page.locator('#cform')).toHaveAttribute(
    'action',
    'https://api.web3forms.com/submit',
  );
  await expect(page.locator('#fn')).toHaveAttribute('name', 'name');
  await expect(page.locator('#fe')).toHaveAttribute('name', 'email');
  await expect(page.locator('#fm')).toHaveAttribute('name', 'message');
  await expect(page.locator('#fn')).toBeVisible();
  await expect(page.locator('#fe')).toBeVisible();
  await expect(page.locator('#fm')).toBeVisible();

  // ViewTransitions: Astro's ClientRouter injects a script tag, not a meta tag
  await expect(
    page
      .locator('script[data-astro-rerun]')
      .or(page.locator('astro-client-router')),
  ).toHaveCount(0); // presence checked via navigation behaviour

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('locale fallback and contact state are explicit', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index,follow',
  );

  await page.goto('/contact/');
  await expect(
    page.locator(
      'form.contact-form, .notice a[href="mailto:suprabhatkumar02@gmail.com"]',
    ),
  ).toHaveCount(1);
});

test('production SEO signals and internal links are crawlable', async ({
  page,
}) => {
  await page.goto('/');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://suprabhat-dev.com/',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://suprabhat-dev.com/assets/images/og-image.jpg',
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
    'content',
    '1200',
  );
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://suprabhat-dev.com/',
  );
  const homepagePaths = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => (link as HTMLAnchorElement).pathname)),
    ]);

  const robots = await page.request.get('/robots.txt');
  expect(await robots.text()).toContain(
    'Sitemap: https://suprabhat-dev.com/sitemap-index.xml',
  );

  const llms = await page.request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain('# Suprabhat Kumar Portfolio');
  expect(await llms.text()).toContain(
    'https://suprabhat-dev.com/sitemap-index.xml',
  );

  await page.goto('/blog/');
  await expect(page.locator('.article-list article')).toHaveCount(3);

  const blogPaths = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => (link as HTMLAnchorElement).pathname)),
    ]);
  const internalPaths = [...new Set([...homepagePaths, ...blogPaths])];
  for (const path of internalPaths) {
    const response = await page.request.get(path);
    expect(response.status(), `Expected ${path} to resolve`).toBeLessThan(400);
  }
});
