import { expect, test } from '@playwright/test';
import { access, readdir, readFile } from 'node:fs/promises';

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
    const authors = body.match(/<author>[^<]*<\/author>/g) ?? [];
    expect(authors.length).toBe(body.match(/<item>/g)?.length);
    expect(new Set(authors)).toEqual(
      new Set([
        '<author>suprabhatkumar02@gmail.com (Suprabhat Kumar)</author>',
      ]),
    );
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
  expect(metaValues(article, 'article:modified_time')).toEqual(['2026-10-19']);
  expect(metaValues(article, 'article:author')).toEqual([
    'https://suprabhat-dev.com/about/',
  ]);
  expect(metaValues(article, 'article:tag')).toEqual([
    'Accessibility',
    'UI Engineering',
  ]);
  expect(
    graphOf(article).find((node) => node['@type'] === 'BlogPosting'),
  ).toMatchObject({ datePublished: '2026-10-15', dateModified: '2026-10-19' });

  // The accessibility article cites its sources inline in every locale.
  for (const prefix of ['', 'es/', 'ar/']) {
    const html = await read(
      `${prefix}blog/accessibility-in-react-what-developers-skip/index.html`,
    );
    for (const href of [
      'https://www.w3.org/TR/WCAG22/',
      'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
      'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
      'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog',
      'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live',
    ]) {
      const links = html.match(new RegExp(`<a href="${href}"[^>]*>`, 'g'));
      expect(links, `${prefix} ${href}`).toEqual([`<a href="${href}">`]);
    }
  }

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
