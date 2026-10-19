import { expect, test } from '@playwright/test';

test('locale fallback and contact state are explicit', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'سوبرابهات',
  );
  await expect(page.locator('.hero-sub')).toContainText(
    'منتجات React سريعة ومتاحة',
  );
  await expect(page.getByLabel('نوع المشروع *', { exact: true })).toBeVisible();
  await expect(page.locator('.brand')).toHaveAttribute('href', '/ar/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index,follow',
  );

  await page.goto('/es/');
  await expect(page.locator('.brand')).toHaveAttribute('href', '/es/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Suprabhat Kumar',
  );
  await expect(page.locator('.hero-sub')).toContainText(
    'productos React rápidos y accesibles',
  );
  await expect(
    page.getByLabel('Tipo de proyecto *', { exact: true }),
  ).toBeVisible();

  await page.goto('/contact/');
  await expect(
    page.locator(
      'form.contact-form, .notice a[href="mailto:suprabhatkumar02@gmail.com"]',
    ),
  ).toHaveCount(1);

  for (const path of ['/contact/', '/es/contact/', '/ar/contact/']) {
    await page.goto(path);
    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  }

  await page.goto('/recommendations/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index,follow',
  );
  await expect(page.locator('blockquote')).toHaveCount(6);
  await expect(page.locator('main')).toContainText('Sonu Gagan Karn');

  await page.goto('/404.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  await expect(page.locator('.not-found-page')).toBeVisible();
  await expect(page.locator('.not-found-code')).toHaveText('404');
  await expect(page.locator('.not-found-links a')).toHaveCount(4);
  await expect(page.locator('.not-found-links a[href="/"]')).toBeVisible();
  await expect(page.locator('.not-found-links a[href="/work/"]')).toBeVisible();
  await expect(page.locator('.not-found-links a[href="/blog/"]')).toBeVisible();
  await expect(
    page.locator('.not-found-links a[href="/contact/"]'),
  ).toBeVisible();
  await expect(page.locator('link[hreflang]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(
    page.locator('script[type="application/ld+json"]'),
  ).not.toContainText('workTranslation');

  await page.goto('/es/404/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  await expect(
    page.locator('.not-found-links a[href="/es/work/"]'),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('página');
  await expect(
    page.locator('script[type="application/ld+json"]'),
  ).not.toContainText('workTranslation');

  await page.goto('/ar/404/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  await expect(
    page.locator('.not-found-links a[href="/ar/work/"]'),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(
    page.locator('script[type="application/ld+json"]'),
  ).not.toContainText('workTranslation');
});

test('shared shell styling and controls stay consistent across locales', async ({
  page,
}) => {
  // Walks a dozen pages and three locale switches; give it a long-journey budget.
  test.slow();
  await page.setViewportSize({ width: 1280, height: 900 });

  const readShellStyles = async (path: string) => {
    await page.goto(path);

    return page.evaluate(() => {
      const styleFor = (selector: string) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing selector: ${selector}`);
        return getComputedStyle(element);
      };
      return {
        controlRadius: styleFor('.theme-toggle').borderRadius,
        hasHorizontalOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
        headerRadius: styleFor('.site-header').borderRadius,
        navRadius: styleFor('.site-nav a').borderRadius,
        themeIconCount: document.querySelectorAll(
          '.theme-toggle-icon .theme-icon-sun, .theme-toggle-icon .theme-icon-moon',
        ).length,
      };
    });
  };

  const baseline = await readShellStyles('/');
  expect(baseline).toMatchObject({
    controlRadius: '6px',
    headerRadius: '12px',
    navRadius: '4px',
    themeIconCount: 2,
  });

  for (const route of ['/es/', '/ar/', '/about/', '/es/about/', '/ar/about/']) {
    const styles = await readShellStyles(route);
    expect(styles).toEqual(baseline);
    expect(styles.hasHorizontalOverflow).toBe(false);
  }

  for (const route of [
    '/',
    '/es/',
    '/ar/',
    '/skills/',
    '/es/skills/',
    '/ar/skills/',
    '/work/performance-modernization/',
    '/es/work/performance-modernization/',
    '/ar/work/performance-modernization/',
  ]) {
    await page.goto(route);
    const cardRadius = await page
      .locator(
        '.hero-card, .grid article, .case-study-note, .article-list article, .contact-form',
      )
      .first()
      .evaluate((element) => getComputedStyle(element).borderRadius);
    expect(cardRadius).toBe('10px');
  }

  await page.goto('/about/');
  const languageButton = page.locator('#lang-dd-btn');
  await expect(languageButton).toHaveAttribute(
    'aria-label',
    'EN: Change language, current language: English',
  );
  await expect(page.locator('.theme-toggle')).toHaveAttribute(
    'aria-label',
    'Switch to light color theme',
  );
  await languageButton.click();
  await expect(languageButton).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#lang-dd .hdr-menu a[lang="en"]')).toHaveAttribute(
    'href',
    '/about/',
  );
  await expect(page.locator('#lang-dd .hdr-menu a[lang="es"]')).toHaveAttribute(
    'href',
    '/es/about/',
  );
  await expect(page.locator('#lang-dd .hdr-menu a[lang="ar"]')).toHaveAttribute(
    'href',
    '/ar/about/',
  );

  await page.locator('#lang-dd .hdr-menu a[lang="es"]').click();
  await expect(page).toHaveURL('/es/about/');
  await page.waitForLoadState('load');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('#lang-label')).toHaveText('ES');
  await expect(page.locator('#lang-dd-btn')).toHaveAttribute(
    'aria-label',
    'ES: Cambiar idioma, idioma actual: Español',
  );
  await expect(page.locator('#lang-dd .hdr-menu a[lang="ar"]')).toHaveAttribute(
    'aria-label',
    'Cambiar idioma a árabe',
  );
  await expect(
    page.locator('footer nav[aria-label="Enlaces del sitio"]'),
  ).toBeVisible();
  await expect(page.locator('footer a[aria-label="Feed RSS"]')).toBeVisible();
  await expect(page.locator('.theme-toggle')).toHaveAttribute(
    'aria-label',
    'Cambiar a tema claro',
  );

  await page.locator('#lang-dd-btn').click();
  await page.locator('#lang-dd .hdr-menu a[lang="ar"]').click();
  await expect(page).toHaveURL('/ar/about/');
  await page.waitForLoadState('load');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#lang-label')).toHaveText('AR');
  await expect(page.locator('#lang-dd-btn')).toHaveAttribute(
    'aria-label',
    'AR: تغيير اللغة، اللغة الحالية: العربية',
  );
  await expect(page.locator('#lang-dd .hdr-menu a[lang="en"]')).toHaveAttribute(
    'aria-label',
    'تغيير اللغة إلى الإنجليزية',
  );
  await expect(
    page.locator('footer nav[aria-label="روابط الموقع"]'),
  ).toBeVisible();
  await expect(page.locator('footer a[aria-label="خلاصة RSS"]')).toBeVisible();

  await page.locator('#lang-dd-btn').click();
  await page.locator('#lang-dd .hdr-menu a[lang="en"]').click();
  await expect(page).toHaveURL('/about/');
  await page.waitForLoadState('load');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('#lang-label')).toHaveText('EN');

  await page.goto('/');
  const html = page.locator('html');
  const themeButton = page.locator('.theme-toggle');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(themeButton).toHaveAttribute('aria-pressed', 'false');
  await expect(themeButton).toHaveAttribute(
    'aria-label',
    'Switch to light color theme',
  );
  await themeButton.click();
  await expect(html).toHaveAttribute('data-theme', 'light');
  await expect(themeButton).toHaveAttribute('aria-pressed', 'true');
  await expect(themeButton).toHaveAttribute(
    'aria-label',
    'Switch to dark color theme',
  );
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('sk-theme')))
    .toBe('light');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
});

test('mobile header controls sit at the inline end in every direction', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  for (const prefix of ['', '/ar']) {
    await page.goto(`${prefix}/`);
    const gaps = await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const brand = document.querySelector('.site-header .brand');
      const actions = document.querySelector('.site-header .header-actions');
      if (!header || !brand || !actions) return null;
      const h = header.getBoundingClientRect();
      const b = brand.getBoundingClientRect();
      const a = actions.getBoundingClientRect();
      const rtl = document.documentElement.dir === 'rtl';
      return {
        brand: rtl ? h.right - b.right : b.left - h.left,
        actions: rtl ? a.left - h.left : h.right - a.right,
      };
    });
    expect(gaps).not.toBeNull();
    expect(Math.abs((gaps?.brand ?? 0) - (gaps?.actions ?? 99))).toBeLessThan(
      2,
    );
  }
});

test('language switcher targets translated posts and tags, never 404s', async ({
  page,
}) => {
  const switcherHrefs = () =>
    page
      .locator('#lang-dd .hdr-menu a')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).pathname),
      );

  await page.goto('/es/blog/frontend-code-review-checklist/');
  expect(await switcherHrefs()).toEqual([
    '/blog/frontend-code-review-checklist/',
    '/es/blog/frontend-code-review-checklist/',
    '/ar/blog/frontend-code-review-checklist/',
  ]);

  await page.goto('/es/blog/tags/accesibilidad/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex,follow',
  );
  const tagHrefs = await switcherHrefs();
  expect(tagHrefs[0]).toBe('/blog/tags/accessibility/');
  for (const path of tagHrefs) {
    expect((await page.request.get(path)).status(), path).toBe(200);
  }

  await page.goto('/404.html');
  expect(await switcherHrefs()).toEqual(['/', '/es/', '/ar/']);
});

test('tools page groups every tool exactly once in every locale', async ({
  page,
}) => {
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/tools/`);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main .lead')).toHaveText(/\S{20,}|\S+ \S+/);
    await expect(page.locator('.tool-group h2')).toHaveCount(5);
    await expect(page.locator('.tool-practice')).toHaveCount(5);
    if (prefix === '') {
      const words = await page
        .locator('main')
        .evaluate(
          (main) =>
            (main as HTMLElement).innerText.match(
              /[\p{L}\p{N}][\p{L}\p{N}'’.+-]*/gu,
            )?.length ?? 0,
        );
      expect(words).toBeGreaterThanOrEqual(250);
    }
    const names = await page.locator('.tool-grid li span').allTextContents();
    expect(names, prefix || '/en').toHaveLength(20);
    expect(new Set(names).size, prefix || '/en').toBe(20);
    await expect(page.locator('.tool-closing a')).toHaveAttribute(
      'href',
      `${prefix}/work/`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'index,follow',
    );
  }
});
