import { expect, test } from '@playwright/test';

test('blog index shows the newest article above the fold, before topics', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/blog/`);
    await page.evaluate(() => document.fonts.ready);
    const newest = page.locator('.article-list > article').first();
    for (const part of [newest.locator('.meta'), newest.locator('h2')]) {
      const box = await part.boundingBox();
      expect(box!.y + box!.height, prefix || '/en').toBeLessThanOrEqual(900);
    }
    await expect(
      page.locator('.article-list > article:first-child + .topic-cloud'),
    ).toHaveCount(1);
  }
});

test('articles show cover, reading time, share links and RSS in every locale', async ({
  page,
}) => {
  const slug = 'accessibility-in-react-what-developers-skip';
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/blog/${slug}/`);
    const canonical = `https://suprabhat-dev.com${prefix}/blog/${slug}/`;

    const cover = page.locator('.article-page header img.article-cover');
    await expect(
      page.locator('.article-page header picture source[type="image/avif"]'),
    ).toHaveCount(1);
    await expect(cover).toHaveAttribute('srcset', /\b400w\b.*\b760w\b/);
    await expect(cover).toHaveAttribute('alt', /\S/);
    await expect(cover).toHaveAttribute('width', '1600');
    await expect(cover).toHaveAttribute('height', '840');
    await expect(cover).not.toHaveAttribute('loading', 'lazy');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/images\/blog\/[a-z0-9-]+-cover-1600x840\.png$/,
    );

    await expect(page.locator('.article-reading-time')).toHaveText(/\d/);

    const share = page.locator('.article-share');
    const hrefs = await share
      .locator('a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs).toEqual([
      expect.stringMatching(
        `^https://x\\.com/intent/tweet\\?url=${encodeURIComponent(canonical)}&text=`,
      ),
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonical)}`,
      `${prefix}/rss.xml`,
    ]);
    const copy = share.locator('button[data-copy-value]');
    await expect(copy).toBeVisible();
    await expect(copy).toHaveAttribute('data-copy-value', canonical);
  }
});
