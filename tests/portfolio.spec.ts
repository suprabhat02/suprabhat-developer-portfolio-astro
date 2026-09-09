import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

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
  await expect(page.locator('.hero-portrait-wrap img')).toHaveJSProperty(
    'complete',
    true,
  );
  await expect(page.locator('.hero-portrait-wrap img')).toHaveAttribute(
    'fetchpriority',
    'high',
  );
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
  expect(ctaLayout.height).toBeLessThan(700);
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
  ]) {
    await expect(
      page.locator('#tools .tm-grid > .tm-item .tm-chip', {
        hasText: technology,
      }),
    ).toHaveCount(1);
  }
  await expect(page.locator('#skills img')).toHaveCount(0);
  for (const skill of [
    'HTML5 + CSS3 + Sass',
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
  await expect(page.locator('.rec-card')).toHaveCount(3);
  await expect(page.locator('a[href="/recommendations/"]')).toBeVisible();
  const technologyIconUrls = await page
    .locator('#tools img')
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).src),
    );
  await expect(page.locator('#tools .tm-item')).toHaveCount(20);
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
  for (const fieldName of [
    'name',
    'email',
    'project_type',
    'budget',
    'timeline',
    'message',
  ]) {
    await expect(projectForm.locator(`[name="${fieldName}"]`)).toHaveAttribute(
      'required',
      '',
    );
  }
  await projectForm.getByRole('button', { name: 'Send enquiry' }).click();
  const errorSummary = projectForm.locator('[data-error-summary]');
  await expect(errorSummary).toBeVisible();
  await expect(errorSummary).toBeFocused();
  await expect(errorSummary.locator('a')).toHaveCount(6);

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

  const results = await new AxeBuilder({ page }).analyze();
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

test('locale fallback and contact state are explicit', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Suprabhat Kumar',
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
    controlRadius: '10px',
    headerRadius: '20px',
    navRadius: '6px',
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
    expect(cardRadius).toBe('16px');
  }

  await page.goto('/about/');
  const languageButton = page.locator('#lang-dd-btn');
  await expect(languageButton).toHaveAttribute(
    'aria-label',
    'Change language, current language: English',
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
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('#lang-label')).toHaveText('ES');
  await expect(page.locator('#lang-dd-btn')).toHaveAttribute(
    'aria-label',
    'Cambiar idioma, idioma actual: Español',
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
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('#lang-label')).toHaveText('AR');
  await expect(page.locator('#lang-dd-btn')).toHaveAttribute(
    'aria-label',
    'تغيير اللغة، اللغة الحالية: العربية',
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

test('case studies expose localized proof and outcomes', async ({ page }) => {
  const slugs = [
    'analytics-command-center',
    'design-system-uplift',
    'performance-modernization',
    'portfolio-seo-i18n-system',
    'accessible-contact-workflow',
    'frontend-quality-system',
  ];
  const localeChecks = [
    {
      prefix: '',
      proof: 'Project proof',
      role: 'My role',
      constraints: 'Constraints',
      decisions: 'Key decisions',
      outcomes: 'Outcomes',
    },
    {
      prefix: '/es',
      proof: 'Prueba del proyecto',
      role: 'Mi rol',
      constraints: 'Restricciones',
      decisions: 'Decisiones clave',
      outcomes: 'Resultados',
    },
    {
      prefix: '/ar',
      proof: 'إثبات المشروع',
      role: 'دوري',
      constraints: 'القيود',
      decisions: 'القرارات الرئيسية',
      outcomes: 'النتائج',
    },
  ];

  for (const localeCheck of localeChecks) {
    for (const slug of slugs) {
      await page.goto(`${localeCheck.prefix}/work/${slug}/`);

      await expect(
        page.getByRole('heading', { name: localeCheck.proof }),
      ).toBeVisible();
      await expect(page.locator('.case-study-proof-card')).toHaveCount(3);
      await expect(
        page.getByRole('heading', { name: localeCheck.role }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: localeCheck.constraints }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: localeCheck.decisions }),
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: localeCheck.outcomes }),
      ).toBeVisible();

      const structuredData = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      expect(structuredData).toContain('TechArticle');
      expect(structuredData).toContain('articleBody');
      expect(structuredData).toContain('hasPart');
      expect(structuredData).toContain(localeCheck.role);
      expect(structuredData).toContain(localeCheck.constraints);
      expect(structuredData).toContain(localeCheck.decisions);
      expect(structuredData).toContain(localeCheck.outcomes);
    }
  }
});

test('localized structured data uses page language and alternates', async ({
  page,
}) => {
  const readGraph = async (path: string) => {
    await page.goto(path);
    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    if (!structuredData) throw new Error(`Missing JSON-LD on ${path}`);
    const parsed = JSON.parse(structuredData) as {
      '@graph': Array<Record<string, unknown>>;
    };
    return parsed['@graph'];
  };

  const findSchema = (graph: Array<Record<string, unknown>>, type: string) =>
    graph.find((entry) => entry['@type'] === type);

  const spanishServices = await readGraph('/es/services/');
  expect(findSchema(spanishServices, 'WebPage')).toMatchObject({
    inLanguage: 'es',
  });
  expect(findSchema(spanishServices, 'Person')).toMatchObject({
    jobTitle: 'Ingeniero Frontend Sénior',
    inLanguage: 'es',
  });
  expect(findSchema(spanishServices, 'ProfessionalService')).toMatchObject({
    name: 'Suprabhat Kumar - Servicios de ingeniería frontend',
    inLanguage: 'es',
    areaServed: 'Todo el mundo',
  });
  expect(JSON.stringify(spanishServices)).toContain(
    'Proyecto frontend React definido',
  );

  const arabicFaq = await readGraph('/ar/faq/');
  expect(findSchema(arabicFaq, 'WebPage')).toMatchObject({
    inLanguage: 'ar',
  });
  expect(findSchema(arabicFaq, 'Person')).toMatchObject({
    jobTitle: 'مهندس واجهات أمامية أول',
    inLanguage: 'ar',
  });
  expect(findSchema(arabicFaq, 'FAQPage')).toMatchObject({
    inLanguage: 'ar',
  });
  expect(JSON.stringify(arabicFaq)).toContain('ما الخدمات التي تقدمها؟');

  await page.goto('/ar/work/performance-modernization/');
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    'https://suprabhat-dev.com/work/performance-modernization/',
  );
  await expect(page.locator('link[hreflang="es"]')).toHaveAttribute(
    'href',
    'https://suprabhat-dev.com/es/work/performance-modernization/',
  );
  await expect(page.locator('link[hreflang="ar"]')).toHaveAttribute(
    'href',
    'https://suprabhat-dev.com/ar/work/performance-modernization/',
  );
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://suprabhat-dev.com/work/performance-modernization/',
  );
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

  const sitemap = await readFile(
    new URL('../dist/sitemap-0.xml', import.meta.url),
    'utf-8',
  );
  expect(sitemap).not.toContain('404');
  expect(sitemap).toContain('/recommendations/');

  const hostingerRootFallback = await readFile(
    new URL('../dist/.htaccess', import.meta.url),
    'utf-8',
  );
  expect(hostingerRootFallback).toContain('ErrorDocument 404 /404.html');
  expect(hostingerRootFallback).toContain(
    'Cache-Control "public, max-age=31536000, immutable"',
  );
  expect(hostingerRootFallback).toContain('BROTLI_COMPRESS');

  const hostingerSpanishFallback = await readFile(
    new URL('../dist/es/.htaccess', import.meta.url),
    'utf-8',
  );
  expect(hostingerSpanishFallback).toContain('ErrorDocument 404 /es/404/');

  const hostingerArabicFallback = await readFile(
    new URL('../dist/ar/.htaccess', import.meta.url),
    'utf-8',
  );
  expect(hostingerArabicFallback).toContain('ErrorDocument 404 /ar/404/');

  const netlifyConfig = await readFile(
    new URL('../netlify.toml', import.meta.url),
    'utf-8',
  );
  expect(netlifyConfig).toContain('Content-Security-Policy-Report-Only');
  expect(netlifyConfig).toContain(
    'Cache-Control = "public, max-age=31536000, immutable"',
  );
  expect(netlifyConfig).toContain('X-Frame-Options = "DENY"');
  expect(netlifyConfig).not.toContain(
    'Strict-Transport-Security = "max-age=31536000; includeSubDomains"',
  );

  const llms = await page.request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain(
    '# Suprabhat Kumar (Shubh) — Senior Front-End Engineer',
  );
  expect(await llms.text()).toContain(
    'https://suprabhat-dev.com/sitemap-index.xml',
  );

  await page.goto('/blog/');
  await expect(page.locator('.article-list article')).toHaveCount(3);
  await expect(
    page.locator('link[type="application/rss+xml"][href="/rss.xml"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('link[type="application/rss+xml"][href="/es/rss.xml"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('link[type="application/rss+xml"][href="/ar/rss.xml"]'),
  ).toHaveCount(1);
  await expect(
    page.locator('.topic-cloud a[href="/blog/tags/accessibility/"]'),
  ).toBeVisible();
  await expect(
    page.locator('.article-list a[rel="tag"][href^="/blog/tags/"]'),
  ).not.toHaveCount(0);

  await page.goto('/es/blog/');
  await expect(
    page.locator('.topic-cloud a[href="/es/blog/tags/accesibilidad/"]'),
  ).toBeVisible();
  await expect(page.locator('footer a[aria-label="Feed RSS"]')).toHaveAttribute(
    'href',
    '/es/rss.xml',
  );

  await page.goto('/ar/blog/');
  const arabicTopicPath = await page
    .locator('.topic-cloud a')
    .first()
    .evaluate((link) => (link as HTMLAnchorElement).pathname);
  expect(arabicTopicPath).toMatch(/^\/ar\/blog\/tags\//);
  expect((await page.request.get(arabicTopicPath)).status()).toBe(200);
  await expect(page.locator('footer a[href="/ar/rss.xml"]')).toBeVisible();

  await page.goto('/blog/frontend-code-review-checklist/');
  await expect(page.locator('.article-related article')).toHaveCount(2);
  await expect(
    page.locator('a[rel="tag"][href="/blog/tags/accessibility/"]').first(),
  ).toBeVisible();

  for (const { feedPath, language, blogPath } of [
    { feedPath: '/rss.xml', language: 'en', blogPath: '/blog/' },
    { feedPath: '/es/rss.xml', language: 'es', blogPath: '/es/blog/' },
    { feedPath: '/ar/rss.xml', language: 'ar', blogPath: '/ar/blog/' },
  ]) {
    const response = await page.request.get(feedPath);
    expect(response.status(), `Expected ${feedPath} to resolve`).toBe(200);
    const body = await response.text();
    expect(body).toContain('<rss version="2.0">');
    expect(body).toContain(`<language>${language}</language>`);
    expect(body).toContain(`https://suprabhat-dev.com${blogPath}`);
  }

  await page.goto('/blog/');
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
