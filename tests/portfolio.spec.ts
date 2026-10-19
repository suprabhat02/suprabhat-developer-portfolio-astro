import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { access, readdir, readFile } from 'node:fs/promises';

// axe-core ships its only WCAG 2.2 AA rule, target-size, disabled by default.
const axe = (page: Page) =>
  new AxeBuilder({ page }).options({
    rules: { 'target-size': { enabled: true } },
  });

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

test('resume download and contact draft persistence work', async ({ page }) => {
  await page.goto('/');

  const resumeLink = page.getByRole('link', { name: 'Download résumé' });
  await expect(resumeLink).toHaveAttribute('download', '');
  const resumeResponse = await page.request.get(
    '/assets/suprabhat-kumar-senior-frontend-engineer-resume.pdf',
  );
  expect(resumeResponse.status()).toBe(200);
  expect(resumeResponse.headers()['content-type']).toContain('application/pdf');

  const projectForm = page.locator('#homepage-contact-form');
  await projectForm.locator('[name="name"]').fill('Saved draft name');
  await expect(projectForm.locator('[data-draft-status]')).toContainText(
    'Draft saved on this device',
  );

  await page.reload();
  await expect(projectForm.locator('[name="name"]')).toHaveValue(
    'Saved draft name',
  );
  await expect(projectForm.locator('[data-draft-status]')).toContainText(
    'Draft restored from this device',
  );
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

test('case studies expose localized proof and outcomes', async ({ page }) => {
  const slugs = [
    'analytics-command-center',
    'design-system-uplift',
    'performance-modernization',
    'portfolio-seo-i18n-system',
    'accessible-contact-workflow',
    'frontend-quality-system',
    'react-smart-copy',
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
        page.getByRole('heading', {
          name: localeCheck.outcomes,
          exact: true,
        }),
      ).toBeVisible();

      const structuredData = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      const graph = (
        JSON.parse(structuredData ?? '{}') as {
          '@graph'?: Array<Record<string, unknown>>;
        }
      )['@graph'];
      const articles = (graph ?? []).filter(
        (node) => node['@type'] === 'TechArticle',
      );
      expect(articles).toHaveLength(1);
      expect(Object.keys(articles[0] ?? {}).sort()).toEqual(
        [
          '@type',
          'about',
          'author',
          'dateModified',
          'datePublished',
          'description',
          'headline',
          'image',
          'inLanguage',
          'mainEntityOfPage',
          'url',
        ].sort(),
      );
      expect(structuredData).not.toMatch(
        /hasPart|articleBody|"@type":"(?:CreativeWork|Thing)"/,
      );
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
  await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute(
    'href',
    '/sitemap-index.xml',
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
  await expect(page.locator('.article-list article')).toHaveCount(7);
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
  // Markdown task-list checkboxes are named by their item text.
  const taskCheckboxes = page.locator('.prose input[type="checkbox"]');
  expect(await taskCheckboxes.count()).toBeGreaterThan(0);
  for (const checkbox of await taskCheckboxes.all()) {
    await expect(checkbox).toHaveAttribute('aria-label', /\S/);
  }
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
    expect(body).toContain(
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    );
    expect(body).toContain(
      `<atom:link href="https://suprabhat-dev.com${feedPath}" rel="self" type="application/rss+xml"/>`,
    );
    // One channel-level <language>; RSS items have no such element.
    expect(body.match(/<language>/g)).toHaveLength(1);
    expect(body).toContain(`<language>${language}</language>`);
    expect(body).toMatch(
      /<pubDate>\w{3}, \d{2} \w{3} \d{4} 00:00:00 \+0530<\/pubDate>/,
    );
    expect(body).not.toContain('GMT</pubDate>');
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

test('motion layer is progressive, accessible, and honors reduced motion', async ({
  page,
}) => {
  // Three full-page axe scans plus a reduced-motion reload: long journey.
  test.slow();
  await page.goto('/');

  // Native effects only: no UI-framework runtime, islands, or hydration.
  await expect(page.locator('astro-island')).toHaveCount(0);
  const scriptSources = await page
    .locator('script[src]')
    .evaluateAll((scripts) =>
      scripts.map((script) => (script as HTMLScriptElement).src),
    );
  for (const source of scriptSources) {
    expect(source).not.toMatch(/react|preact|framer|motion\.dev|vue|svelte/i);
  }

  // Decorative duplicates never reach assistive technology.
  const flipLabel = page.locator('.hero-flip .sr-only');
  await expect(flipLabel).toHaveCount(1);
  await expect(page.locator('.hero-flip .fx-flip')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(page.locator('.kw-marquee')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  for (const clone of await page
    .locator('#recommendations [data-clone]')
    .all()) {
    await expect(clone).toHaveAttribute('aria-hidden', 'true');
  }

  // Reduced motion: animations stop and marquee clones are removed.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const reduced = await page.evaluate(() => {
    const track = document.querySelector('.recs-track');
    const clone = document.querySelector('.recs-track > [data-clone]');
    const aurora = document.querySelector('.fx-aurora-flow');
    return {
      trackAnimation: track ? getComputedStyle(track).animationName : '',
      cloneDisplay: clone ? getComputedStyle(clone).display : '',
      auroraAnimation: aurora ? getComputedStyle(aurora).animationName : '',
    };
  });
  expect(reduced).toEqual({
    trackAnimation: 'none',
    cloneDisplay: 'none',
    auroraAnimation: 'none',
  });
  const reducedOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(reducedOverflow).toBe(false);

  // Light theme and RTL inner pages remain axe-clean with effects applied.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => localStorage.setItem('sk-theme', 'light'));
  for (const path of ['/', '/ar/', '/work/performance-modernization/']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const results = await axe(page).analyze();
    expect(results.violations, path).toEqual([]);
  }
});

test('open-source spotlight links react-smart-copy and copies the install command', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/work/`);
    const card = page.locator('.oss-card');
    await expect(card).toBeVisible();
    for (const href of [
      'https://suprabhat02.github.io/react-smart-copy/',
      'https://github.com/suprabhat02/react-smart-copy',
      'https://www.npmjs.com/package/react-smart-copy',
    ]) {
      const link = card.locator(`a[href="${href}"]`);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(
      card.locator(`a[href="${prefix}/work/react-smart-copy/"]`),
    ).toBeVisible();
  }

  await page.goto('/work/');
  const button = page.locator('.oss-card .copy-btn');
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('data-state', 'copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'npm install react-smart-copy',
  );
  await expect(button).toHaveAttribute('data-state', 'idle', {
    timeout: 4000,
  });

  await page.goto('/work/react-smart-copy/');
  const structuredData = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join('');
  expect(structuredData).toContain('SoftwareSourceCode');
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

test('living cards render decorative scenes with depth and stay static at rest', async ({
  page,
}) => {
  await page.goto('/');
  const cards = page.locator('.fx-live');
  expect(await cards.count()).toBeGreaterThanOrEqual(17);
  // Every living card has the full effect stack and a decorative scene.
  const summary = await cards.evaluateAll((elements) =>
    elements.map((card) => ({
      glow: card.hasAttribute('data-glow'),
      tilt: card.hasAttribute('data-tilt'),
      border: card.classList.contains('fx-card-gradient'),
      sceneHidden:
        card.querySelector('.lv-scene')?.getAttribute('aria-hidden') ?? null,
    })),
  );
  for (const card of summary) {
    expect(card).toEqual({
      glow: true,
      tilt: true,
      border: true,
      sceneHidden: 'true',
    });
  }
  // Nothing animates on a clock until a card is engaged (touch screens tie
  // the scenes to scrolling instead, which is not time-based).
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === 'running' &&
            animation.timeline instanceof DocumentTimeline &&
            animation.effect instanceof KeyframeEffect &&
            animation.effect.target instanceof Element &&
            animation.effect.target.closest('.lv-scene'),
        ).length,
  );
  expect(running).toBe(0);
});

test('hero uses the aurora backdrop and a plain-text name', async ({
  page,
}) => {
  for (const prefix of ['', '/ar']) {
    await page.goto(`${prefix}/`);
    const hero = page.locator('#home');
    await expect(hero.locator('.fx-aurora-bg')).toHaveCount(1);
    await expect(hero.locator('.fx-grid')).toHaveCount(0);
    await expect(page.locator('#hero-name .fx-gradient-text')).toHaveCount(0);
    const fill = await page
      .locator('#hero-name')
      .evaluate((element) => getComputedStyle(element).webkitTextFillColor);
    expect(fill).not.toBe('rgba(0, 0, 0, 0)');
  }
});

test('CTA globe loads lazily, is described, and marks India', async ({
  page,
}) => {
  const globeRequests: string[] = [];
  page.on('request', (request) => {
    if (/\/globe\.[\w-]+\.js$/.test(new URL(request.url()).pathname)) {
      globeRequests.push(request.url());
    }
  });
  await page.goto('/ar/');
  await page.waitForLoadState('load');
  expect(globeRequests).toHaveLength(0);

  const globe = page.locator('[data-globe]');
  await expect(globe).toHaveAttribute('role', 'img');
  await expect(globe).toHaveAttribute('data-home-label', 'الهند');
  await expect(globe).toHaveAttribute('aria-label', /الهند/);
  await globe.scrollIntoViewIfNeeded();
  await expect(globe).toHaveAttribute('data-ready', '', { timeout: 15_000 });
  // The first frame paints on the next animation frame after mounting.
  await expect
    .poll(() =>
      globe.locator('canvas').evaluate((canvas) => {
        const context = (canvas as HTMLCanvasElement).getContext('2d');
        if (!context) return 0;
        const { width, height } = canvas as HTMLCanvasElement;
        const pixels = context.getImageData(0, 0, width, height).data;
        let opaque = 0;
        for (let index = 3; index < pixels.length; index += 4 * 97) {
          if ((pixels[index] ?? 0) > 0) opaque++;
        }
        return opaque;
      }),
    )
    .toBeGreaterThan(100);
  await expect(page.locator('.cta-band .fx-meteors')).toHaveCSS(
    'container-type',
    'size',
  );
});

test('contact form shows placeholders and toasts, resetting only on success', async ({
  page,
}) => {
  let succeed = false;
  await page.route('https://api.web3forms.com/submit', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: succeed }),
    }),
  );
  await page.goto('/');
  const form = page.locator('#homepage-contact-form');
  for (const name of ['name', 'email', 'company', 'message']) {
    await expect(form.locator(`[name="${name}"]`)).toHaveAttribute(
      'placeholder',
      /\S/,
    );
  }
  for (const name of ['project_type', 'budget', 'timeline']) {
    await expect(
      form.locator(`[name="${name}"] option[value=""]`),
    ).toHaveAttribute('disabled', '');
  }

  await form.evaluate((element) => {
    const key = element.querySelector<HTMLInputElement>('[name="access_key"]');
    if (key) key.value = 'test-key';
  });
  await form.locator('[name="name"]').fill('Test Person');
  await form.locator('[name="email"]').fill('test@example.com');
  await form.locator('[name="project_type"]').selectOption('design-system');
  await form.locator('[name="budget"]').selectOption('5k-15k');
  await form.locator('[name="timeline"]').selectOption('exploring');
  await form.locator('[name="message"]').fill('Need a design system.');

  await form.getByRole('button', { name: 'Send enquiry' }).click();
  const failure = page.locator('.toast--error');
  await expect(failure).toBeVisible();
  await expect(failure).toHaveAttribute('role', 'alert');
  await expect(failure).toContainText('Message not sent');
  await expect(form.locator('[name="name"]')).toHaveValue('Test Person');

  succeed = true;
  await form.getByRole('button', { name: 'Send enquiry' }).click();
  const success = page.locator('.toast--success');
  await expect(success).toBeVisible();
  await expect(success).toContainText('Message sent');
  await expect(form.locator('[name="name"]')).toHaveValue('');
  await expect(form.locator('[name="budget"]')).toHaveValue('');
  await expect(page.locator('[data-toast-region]')).toHaveAttribute(
    'aria-live',
    'polite',
  );

  await success.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(success).toHaveCount(0);
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

test('services page is fully localized, including structured data', async ({
  page,
}) => {
  await page.goto('/ar/services/');
  const main = page.locator('main');
  for (const english of ['Best for:', 'Deliverables:', 'Duration:', 'Six ']) {
    await expect(main).not.toContainText(english);
  }
  await expect(main).toContainText('المخرجات:');
  const structuredData = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join('');
  expect(structuredData).not.toContain('Best for:');
});

test('compact header and About photo', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = await page.locator('.site-header').evaluate((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      width: box.width,
      center: box.left + box.width / 2,
      viewportCenter: document.documentElement.clientWidth / 2,
      blur: style.backdropFilter,
    };
  });
  expect(header.width).toBeLessThan(900);
  // Fixed elements center on the full window, which includes the reserved
  // scrollbar gutter (scrollbar-gutter: stable), so allow half a gutter.
  expect(Math.abs(header.center - header.viewportCenter)).toBeLessThan(9);
  expect(header.blur).toContain('blur');

  const photo = page.locator('.about-photo img');
  await expect(photo).toHaveAttribute('loading', 'lazy');
  await expect(photo).toHaveAttribute('alt', /Suprabhat Kumar/);
});

test('scenes play on tap on touch screens and never on scroll', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/');
  const card = page.locator('.engagement-card').first();
  await card.scrollIntoViewIfNeeded();
  const running = () =>
    page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.playState === 'running' &&
              animation.effect instanceof KeyframeEffect &&
              animation.effect.target instanceof Element &&
              animation.effect.target.closest('.lv-scene'),
          ).length,
    );
  expect(await running()).toBe(0);
  await card.locator('h3').tap();
  await expect(card).toHaveAttribute('data-active', '');
  expect(await running()).toBeGreaterThan(0);
  await page.locator('#engagements .section-head').tap();
  await expect(card).not.toHaveAttribute('data-active', '');
  await context.close();
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

test('long page and article headings wrap instead of clipping', async ({
  page,
}) => {
  const paths = [
    '/blog/accessibility-in-react-what-developers-skip/',
    '/es/blog/accessibility-in-react-what-developers-skip/',
    '/ar/blog/accessibility-in-react-what-developers-skip/',
    '/accessibility/',
    '/es/work/analytics-command-center/',
  ];
  for (const width of [360, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const overflowing = await page
        .locator('h1, h2, h3')
        .evaluateAll((headings) =>
          headings
            .filter((heading) => heading.scrollWidth > heading.clientWidth)
            .map((heading) => heading.textContent?.trim()),
        );
      expect(overflowing, `${path} at ${width}px`).toEqual([]);
    }
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

test('Person sameAs links every public profile in all locales', async ({
  page,
}) => {
  type JsonLdNode = {
    '@type'?: string;
    '@graph'?: JsonLdNode[];
    sameAs?: string[];
  };
  for (const path of ['/', '/es/', '/ar/']) {
    await page.goto(path);
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts.map((script) => JSON.parse(script.textContent ?? 'null')),
      );
    const person = (blocks as (JsonLdNode | JsonLdNode[])[])
      .flat()
      .flatMap((node) => node['@graph'] ?? [node])
      .find((node) => node['@type'] === 'Person');
    expect(person?.sameAs, path).toEqual(
      expect.arrayContaining([
        'https://x.com/SuprabhatKarn97',
        'https://dev.to/suprabhat02',
        'https://suprabhatkumar.hashnode.dev',
      ]),
    );
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
      'index,follow',
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

test('case-study dates come from data, not the old 2026-09-06 placeholder', async () => {
  type JsonLdNode = {
    '@type'?: string;
    '@graph'?: JsonLdNode[];
    datePublished?: string;
    dateModified?: string;
  };
  // git log --reverse -S: these three slugs were first committed on 2026-09-06.
  const publishedOnPlaceholderDate = new Set([
    'portfolio-seo-i18n-system',
    'accessible-contact-workflow',
    'frontend-quality-system',
  ]);
  const dist = new URL('../dist/', import.meta.url);
  const datesBySlug = new Map<string, string>();
  for (const dir of ['work', 'es/work', 'ar/work']) {
    for (const entry of await readdir(new URL(`${dir}/`, dist), {
      withFileTypes: true,
    })) {
      if (!entry.isDirectory()) continue;
      const html = await readFile(
        new URL(`${dir}/${entry.name}/index.html`, dist),
        'utf-8',
      );
      const article = [
        ...html.matchAll(
          /<script type="application\/ld\+json">(.*?)<\/script>/gs,
        ),
      ]
        .flatMap(([, json]) =>
          json ? [JSON.parse(json) as JsonLdNode | JsonLdNode[]] : [],
        )
        .flat()
        .flatMap((node) => node['@graph'] ?? [node])
        .find((node) => node['@type'] === 'TechArticle');
      const where = `${dir}/${entry.name}`;
      const { datePublished = '', dateModified = '' } = article ?? {};
      expect(datePublished, where).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateModified, where).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateModified >= datePublished, where).toBe(true);
      expect(dateModified, where).not.toBe('2026-09-06');
      if (!publishedOnPlaceholderDate.has(entry.name)) {
        expect(datePublished, where).not.toBe('2026-09-06');
      }
      const dates = `${datePublished}/${dateModified}`;
      expect(datesBySlug.get(entry.name) ?? dates, where).toBe(dates);
      datesBySlug.set(entry.name, dates);
    }
  }
  expect(datesBySlug.size).toBe(7);
});

test('every case study shares its own built image, not the default', async () => {
  const dist = new URL('../dist/', import.meta.url);
  const pages = (
    await Promise.all(
      ['work', 'es/work', 'ar/work'].map(async (dir) =>
        (await readdir(new URL(`${dir}/`, dist), { withFileTypes: true }))
          .filter((entry) => entry.isDirectory())
          .map((entry) => `${dir}/${entry.name}/index.html`),
      ),
    )
  ).flat();
  expect(pages).toHaveLength(21);

  for (const path of pages) {
    const html = await readFile(new URL(path, dist), 'utf-8');
    const ogImage = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    expect(ogImage, path).toMatch(
      /^https:\/\/suprabhat-dev\.com\/images\/work\/[a-z0-9-]+-og-1200x630\.png$/,
    );
    expect(ogImage, path).not.toContain('og-image.jpg');
    const { pathname } = new URL(ogImage!);
    await expect(
      access(new URL(`.${pathname}`, dist)),
    ).resolves.toBeUndefined();
    expect(html, path).toContain(`"image":"${ogImage}"`);
  }
});

test('structured data never contains a raw "<" that could close its script', async () => {
  const dist = new URL('../dist/', import.meta.url);
  const htmlFiles = (await readdir(dist, { recursive: true })).filter((file) =>
    file.endsWith('.html'),
  );
  expect(htmlFiles.length).toBeGreaterThan(100);
  let blocks = 0;
  for (const file of htmlFiles) {
    const html = await readFile(
      new URL(file.replaceAll('\\', '/'), dist),
      'utf-8',
    );
    for (const [, json = ''] of html.matchAll(
      /<script type="application\/ld\+json">(.*?)<\/script>/gs,
    )) {
      blocks++;
      expect(json, file).not.toContain('<');
      expect(() => JSON.parse(json), file).not.toThrow();
    }
  }
  expect(blocks).toBeGreaterThan(100);
});

test('share metadata, page types and sitemap dates follow the SEO contract', async () => {
  const dist = new URL('../dist/', import.meta.url);
  const read = (path: string) => readFile(new URL(path, dist), 'utf-8');
  const metaValues = (html: string, property: string) =>
    [
      ...html.matchAll(
        new RegExp(
          `<meta (?:property|name)="${property}" content="([^"]*)"`,
          'g',
        ),
      ),
    ].map(([, value]) => value);
  const graphOf = (html: string) =>
    [
      ...html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ].flatMap(([, json]) => {
      const data = JSON.parse(json ?? '{}') as {
        '@graph'?: Array<Record<string, unknown>>;
      };
      return data['@graph'] ?? [];
    });

  // Article: cover alt, Open Graph article fields, date-only everywhere.
  const article = await read(
    'blog/accessibility-in-react-what-developers-skip/index.html',
  );
  const articleAlt =
    'Accessibility in React: What Most Developers Skip — article cover';
  expect(metaValues(article, 'og:image:alt')).toEqual([articleAlt]);
  expect(metaValues(article, 'twitter:image:alt')).toEqual([articleAlt]);
  expect(metaValues(article, 'article:published_time')).toEqual(['2026-10-15']);
  expect(metaValues(article, 'article:modified_time')).toEqual(['2026-10-15']);
  expect(metaValues(article, 'article:author')).toEqual([
    'https://suprabhat-dev.com/about/',
  ]);
  expect(metaValues(article, 'article:tag')).toEqual([
    'Accessibility',
    'Frontend',
    'TypeScript',
    'UI Engineering',
  ]);
  expect(
    graphOf(article).find((node) => node['@type'] === 'BlogPosting'),
  ).toMatchObject({ datePublished: '2026-10-15', dateModified: '2026-10-15' });

  // Case study card and portrait card alts; no article fields off articles.
  const caseStudy = await read('work/react-smart-copy/index.html');
  expect(metaValues(caseStudy, 'og:image:alt')).toEqual([
    'react-smart-copy — case study card',
  ]);
  expect(metaValues(caseStudy, 'article:published_time')).toEqual([]);
  const home = await read('index.html');
  expect(metaValues(home, 'og:image:alt')[0]).toMatch(/^Suprabhat Kumar, /);

  // About is a ProfilePage about the Person; FAQPage lives only on /faq/.
  for (const prefix of ['', 'es/', 'ar/']) {
    const about = graphOf(await read(`${prefix}about/index.html`));
    expect(
      about.find((node) => String(node['@id']).endsWith('/about/#webpage')),
    ).toMatchObject({
      '@type': 'ProfilePage',
      mainEntity: { '@id': 'https://suprabhat-dev.com/#person' },
    });
    const homeGraph = graphOf(await read(`${prefix}index.html`));
    expect(homeGraph.some((node) => node['@type'] === 'FAQPage')).toBe(false);
    const faq = graphOf(await read(`${prefix}faq/index.html`));
    expect(faq.some((node) => node['@type'] === 'FAQPage')).toBe(true);
  }

  // No midnight-UTC timestamps anywhere in pages, feeds or sitemaps.
  const files = (await readdir(dist, { recursive: true })).filter((file) =>
    /\.(?:html|xml)$/.test(file),
  );
  for (const file of files) {
    expect(await read(file.replaceAll('\\', '/')), file).not.toMatch(
      /\d{4}-\d{2}-\d{2}T00:00:00(?:\.000)?Z/,
    );
  }

  // Lastmod is always date-only. Posts and case studies always have one;
  // static pages have one when the build had full git history (CI does).
  const sitemap = await read('sitemap-0.xml');
  const entries = [
    ...sitemap.matchAll(
      /<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g,
    ),
  ];
  expect(entries.length).toBeGreaterThan(70);
  for (const [, loc = '', lastmod] of entries) {
    if (/\/(?:blog|work)\/[^/]+\/$/.test(loc))
      expect(lastmod, loc).toBeDefined();
    if (lastmod !== undefined) {
      expect(lastmod, loc).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  }
  expect(sitemap).toContain(
    '<loc>https://suprabhat-dev.com/work/performance-modernization/</loc><lastmod>2026-09-04</lastmod>',
  );
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
