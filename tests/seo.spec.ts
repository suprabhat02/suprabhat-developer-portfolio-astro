import { expect, test } from '@playwright/test';
import { access, readdir, readFile } from 'node:fs/promises';
import { getSectionPageImage, sectionPages } from '../src/data/pageSeo';
import { getProfile, profile, profileStack } from '../src/data/profile';
import { reactSmartCopy, reactInpChunker } from '../src/data/openSource';
import { t } from '../src/i18n/messages';

test('about identity facts and FAQ use published data in every locale', async ({
  page,
}) => {
  for (const locale of ['en', 'es', 'ar'] as const) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    const localizedProfile = getProfile(locale);
    await page.goto(`${prefix}/about/`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute(
      'dir',
      locale === 'ar' ? 'rtl' : 'ltr',
    );
    const facts = page.locator('[data-identity-summary]');
    await expect(facts.locator('dt')).toHaveCount(5);
    await expect(facts.locator('p')).toHaveText(t(locale, 'identity.summary'));
    await expect(facts).toContainText(profile.name);
    await expect(facts).toContainText(localizedProfile.eyebrow.from);
    for (const technology of profileStack)
      await expect(facts).toContainText(technology);
    for (const project of [reactSmartCopy, reactInpChunker]) {
      await expect(facts.locator(`a[href="${project.links.docs}"]`)).toHaveText(
        project.name,
      );
      await expect(
        facts.locator(`a[href="${prefix}/work/${project.id}/"]`),
      ).toContainText(project.name);
    }
    await page.goto(`${prefix}/faq/`);
    const question = t(locale, 'faq.identity.q');
    const answer = t(locale, 'faq.identity.a');
    const entry = page
      .locator('.faq-list details')
      .filter({ hasText: question });
    await expect(entry.locator('summary')).toHaveText(question);
    await expect(entry.locator('p')).toHaveText(answer);
    expect(answer).not.toBe(t(locale, 'identity.summary'));
    const questions = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .evaluate((element) => {
        const schema = JSON.parse(element.textContent ?? '{}') as {
          '@graph': { '@type': string; mainEntity?: unknown }[];
        };
        return schema['@graph'].find((node) => node['@type'] === 'FAQPage')
          ?.mainEntity;
      });
    expect(questions).toContainEqual({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    });
  }
});

test('entity graphs use supported types, unique definitions and visible identity facts', async ({
  page,
}) => {
  const personId = 'https://suprabhat-dev.com/#person';
  const supportedTypes = new Set([
    'Person',
    'Occupation',
    'EducationalOrganization',
    'Place',
    'PostalAddress',
    'Organization',
    'ContactPoint',
    'WebSite',
    'WebPage',
    'ProfilePage',
    'ProfessionalService',
    'OfferCatalog',
    'Offer',
    'Service',
    'SoftwareSourceCode',
    'ItemList',
    'ListItem',
    'BreadcrumbList',
    'TechArticle',
    'BlogPosting',
  ]);
  const collectNodes = (value: unknown): Record<string, unknown>[] => {
    if (Array.isArray(value)) return value.flatMap(collectNodes);
    if (!value || typeof value !== 'object') return [];
    const node = value as Record<string, unknown>;
    return [node, ...Object.values(node).flatMap(collectNodes)];
  };

  for (const locale of ['en', 'es', 'ar'] as const) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    for (const route of [
      '/',
      '/about/',
      '/work/performance-modernization/',
      '/blog/frontend-code-review-checklist/',
    ]) {
      await page.goto(`${prefix}${route}`);
      const structuredData = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      const nodes = collectNodes(JSON.parse(structuredData ?? '{}'));
      const definitions = nodes.filter(
        (node) => node['@id'] && Object.keys(node).length > 1,
      );
      const definedIds = definitions.map((node) => node['@id']);
      expect(new Set(definedIds).size).toBe(definedIds.length);
      const people = nodes.filter((node) => node['@type'] === 'Person');
      expect(people).toHaveLength(1);
      expect(people[0]).toMatchObject({
        '@id': personId,
        name: profile.name,
        alternateName: ['Suprabhat', 'Shubh'],
        jobTitle: getProfile(locale).title,
        sameAs: profile.social.map((social) => social.href),
      });
      await expect(
        page.getByText(getProfile(locale).title, { exact: false }).first(),
      ).toBeVisible();
      if (route === '/' || route === '/about/') {
        expect(people[0]?.knowsAbout).toEqual(profileStack);
        for (const technology of profileStack)
          await expect(
            page.locator('main').getByText(technology).first(),
          ).toBeVisible();
      } else {
        expect(people[0]).not.toHaveProperty('knowsAbout');
      }
      for (const node of nodes) {
        if (node['@id'] && Object.keys(node).length === 1)
          expect(definedIds).toContain(node['@id']);
        if (typeof node['@type'] !== 'string') continue;
        expect(supportedTypes.has(node['@type'])).toBe(true);
        if (
          [
            'ProfessionalService',
            'Service',
            'ItemList',
            'BreadcrumbList',
          ].includes(node['@type'])
        )
          expect(node).not.toHaveProperty('inLanguage');
        if (node['@type'] === 'ProfessionalService') {
          expect(node).not.toHaveProperty('provider');
          expect(node).not.toHaveProperty('serviceType');
        }
        if (['author', 'publisher', 'maintainer'].some((key) => key in node)) {
          for (const key of ['author', 'publisher', 'maintainer'])
            if (key in node) expect(node[key]).toEqual({ '@id': personId });
        }
      }
    }
  }
});

test('section share images are distinct, compact and present in all locales', async ({
  page,
}) => {
  const dist = new URL('../dist/', import.meta.url);
  const images = new Set<string>();
  for (const section of sectionPages) {
    const image = getSectionPageImage(section);
    const data = await readFile(new URL(`.${image}`, dist));
    expect(data.length).toBeLessThan(150_000);
    images.add(image);
    for (const prefix of ['', '/es', '/ar']) {
      await page.goto(`${prefix}/${section}/`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        `https://suprabhat-dev.com${image}`,
      );
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        `https://suprabhat-dev.com${image}`,
      );
      await expect(
        page.locator('meta[property="og:image:width"]'),
      ).toHaveAttribute('content', '1200');
      await expect(
        page.locator('meta[property="og:image:height"]'),
      ).toHaveAttribute('content', '630');
      await expect(
        page.locator('meta[property="og:image:alt"]'),
      ).toHaveAttribute('content', /\S/);
    }
  }
  expect(images.size).toBe(sectionPages.length);
});

test('localized contact thanks pages are noindex and excluded from the sitemap', async ({
  page,
}) => {
  const sitemap = await readFile(
    new URL('../dist/sitemap-0.xml', import.meta.url),
    'utf8',
  );
  for (const prefix of ['', '/es', '/ar']) {
    const path = `${prefix}/contact/thanks/`;
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,follow',
    );
    await expect(page.locator('html')).toHaveAttribute(
      'dir',
      prefix === '/ar' ? 'rtl' : 'ltr',
    );
    expect(sitemap).not.toContain(path);
  }
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
    'react-inp-chunker',
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
          '@id',
          'about',
          'author',
          'dateModified',
          'datePublished',
          'description',
          'headline',
          'image',
          'inLanguage',
          'mainEntityOfPage',
          'publisher',
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

  const englishHome = await readGraph('/');
  expect(findSchema(englishHome, 'WebSite')).toMatchObject({
    name: 'Suprabhat Kumar',
    alternateName: 'suprabhat-dev.com',
    url: 'https://suprabhat-dev.com/',
  });

  const spanishServices = await readGraph('/es/services/');
  expect(findSchema(spanishServices, 'WebPage')).toMatchObject({
    inLanguage: 'es',
  });
  expect(findSchema(spanishServices, 'Person')).toMatchObject({
    jobTitle: 'Ingeniero Frontend Sénior',
  });
  expect(findSchema(spanishServices, 'ProfessionalService')).toMatchObject({
    name: 'Suprabhat Kumar - Servicios de ingeniería frontend',
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

  await expect(page).toHaveTitle(
    'Suprabhat Kumar | Frontend Engineer, React & TypeScript',
  );

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

test('privacy metadata describes analytics consistently in every locale', async ({
  page,
}) => {
  for (const path of ['/privacy/', '/es/privacy/', '/ar/privacy/']) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,follow',
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Cloudflare Web Analytics/,
    );
  }
});

test('resume downloads and experience history match the verified PDF', async ({
  page,
}) => {
  const resumeHref =
    '/assets/suprabhat-kumar-senior-frontend-engineer-resume.pdf';
  const workHistory = [
    {
      path: '/experience/',
      swaraghTitle: 'UI Developer',
      cognizantTitle: 'Associate – Projects (Frontend Developer)',
    },
    {
      path: '/es/experience/',
      swaraghTitle: 'Desarrollador de UI',
      cognizantTitle: 'Asociado – Proyectos (Desarrollador Frontend)',
    },
    {
      path: '/ar/experience/',
      swaraghTitle: 'مطور واجهات مستخدم',
      cognizantTitle: 'مساعد – المشاريع (مطوّر واجهات أمامية)',
    },
  ];

  for (const { path, swaraghTitle, cognizantTitle } of workHistory) {
    await page.goto(path);
    const cognizant = page.locator('.xp-item').filter({
      hasText: 'Cognizant',
    });
    const swaragh = page.locator('.xp-item').filter({
      hasText: 'Swaragh Technologies',
    });

    await expect(cognizant).toContainText(cognizantTitle);
    await expect(cognizant).toContainText('BMW Group');
    await expect(cognizant).toContainText('AG Grid');
    await expect(swaragh).toContainText(swaraghTitle);
    for (const skill of [
      'HTML5',
      'CSS3',
      'JavaScript',
      'jQuery',
      'Bootstrap',
      'Sass',
    ]) {
      await expect(swaragh).toContainText(skill);
    }
  }

  for (const path of [
    '/',
    '/es/',
    '/ar/',
    '/about/',
    '/es/about/',
    '/ar/about/',
    '/experience/',
    '/es/experience/',
    '/ar/experience/',
  ]) {
    await page.goto(path);
    await expect(
      page.locator('a[download][href="' + resumeHref + '"]').first(),
    ).toHaveAttribute('href', resumeHref);
  }

  const response = await page.request.get(resumeHref);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
  const pdf = await response.body();
  expect(pdf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
  expect(pdf.length).toBeGreaterThan(50000);
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

test('Person schema includes public profiles and collaboration without changing home location', async ({
  page,
}) => {
  type JsonLdNode = {
    '@type'?: string;
    '@graph'?: JsonLdNode[];
    sameAs?: string[];
    knowsAbout?: string[];
    description?: string;
    homeLocation?: { address: { addressCountry: string } };
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
    const countries =
      path === '/ar/'
        ? ['الدنمارك', 'الصين', 'ألمانيا', 'أستراليا', 'نيوزيلندا']
        : path === '/es/'
          ? ['Dinamarca', 'China', 'Alemania', 'Australia', 'Nueva Zelanda']
          : ['Denmark', 'China', 'Germany', 'Australia', 'New Zealand'];
    for (const country of countries) {
      expect(person?.description, path).toContain(country);
    }
    expect(person?.homeLocation?.address.addressCountry, path).toBe('IN');
    expect(person?.sameAs, path).toHaveLength(6);
    const visibleProfiles = await page
      .locator('footer .footer-profiles a[rel~="me"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(visibleProfiles.sort(), path).toEqual(
      [...(person?.sameAs ?? [])].sort(),
    );
    for (const href of person?.sameAs ?? []) {
      await expect(
        page.locator(
          `#contact .contact-links-list a[rel~="me"][href="${href}"]`,
        ),
      ).toHaveCount(1);
    }
    expect(person?.knowsAbout, path).toEqual(profileStack);
  }
});

test('collaboration countries remain tied to the confirmed employers', async ({
  page,
}) => {
  for (const [prefix, germany, australia, newZealand] of [
    ['', 'Germany', 'Australia', 'New Zealand'],
    ['/es', 'Alemania', 'Australia', 'Nueva Zelanda'],
    ['/ar', 'ألمانيا', 'أستراليا', 'نيوزيلندا'],
  ] as const) {
    await page.goto(`${prefix}/experience/`);
    const cognizant = page.locator('.xp-item').filter({ hasText: 'Cognizant' });
    const trueblue = page.locator('.xp-item').filter({ hasText: 'TrueBlue' });
    await expect(cognizant).toContainText(germany);
    await expect(cognizant).toContainText('BMW');
    await expect(trueblue).toContainText(australia);
    await expect(trueblue).toContainText(newZealand);
    await page.goto(`${prefix}/about/`);
    for (const country of [germany, australia, newZealand]) {
      await expect(page.locator('main')).toContainText(country);
    }
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
      expect(datePublished, where).toMatch(
        /^\d{4}-\d{2}-\d{2}T00:00:00\+05:30$/,
      );
      expect(dateModified, where).toMatch(
        /^\d{4}-\d{2}-\d{2}T00:00:00\+05:30$/,
      );
      expect(dateModified >= datePublished, where).toBe(true);
      expect(dateModified.slice(0, 10), where).not.toBe('2026-09-06');
      if (!publishedOnPlaceholderDate.has(entry.name)) {
        expect(datePublished.slice(0, 10), where).not.toBe('2026-09-06');
      }
      const dates = `${datePublished}/${dateModified}`;
      expect(datesBySlug.get(entry.name) ?? dates, where).toBe(dates);
      datesBySlug.set(entry.name, dates);
    }
  }
  expect(datesBySlug.size).toBe(8);
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
  expect(pages).toHaveLength(24);

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
  ).toMatchObject({
    datePublished: '2026-10-15T00:00:00+05:30',
    dateModified: '2026-10-19T00:00:00+05:30',
  });

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

test('indexable HTML pages have unique titles and canonical sitemap entries', async () => {
  const dist = new URL('../dist/', import.meta.url);
  const htmlFiles = (await readdir(dist, { recursive: true })).filter((file) =>
    file.endsWith('.html'),
  );
  const sitemap = await readFile(new URL('sitemap-0.xml', dist), 'utf-8');
  const indexNowKey = (
    await readFile(new URL('indexnow-key.txt', dist), 'utf-8')
  ).trim();
  expect(indexNowKey).toMatch(/^[A-Za-z0-9-]{8,128}$/);
  const sitemapUrls = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url),
  );
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const canonicals = new Map<string, string>();

  expect(htmlFiles.length).toBeGreaterThan(100);
  expect(sitemapUrls.size).toBeGreaterThan(70);

  for (const file of htmlFiles) {
    const path = file.replaceAll('\\', '/');
    const html = await readFile(new URL(path, dist), 'utf-8');
    const is404 = /(?:^|\/)404(?:\.html|\/index\.html)$/.test(path);
    const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const description = html
      .match(/<meta name="description" content="([^"]*)"/i)?.[1]
      ?.trim();
    const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];

    expect(title).toBeTruthy();
    expect(description).toBeTruthy();
    expect(robots).toMatch(
      /^(?:index|noindex),follow(?:,max-image-preview:large)?$/,
    );

    if (is404) {
      expect(robots).toBe('noindex,follow');
      expect(canonical).toBeUndefined();
      continue;
    }

    expect(canonical).toBeTruthy();
    expect(canonicals.get(canonical!)).toBeUndefined();
    canonicals.set(canonical!, path);

    if (robots?.split(',').includes('index')) {
      expect(robots).toContain('max-image-preview:large');
      expect(sitemapUrls.has(canonical!)).toBe(true);
      expect(titles.get(title!)).toBeUndefined();
      titles.set(title!, path);
      expect(descriptions.get(description!)).toBeUndefined();
      descriptions.set(description!, path);
    } else {
      expect(sitemapUrls.has(canonical!)).toBe(false);
    }
  }
});

test('all generated indexable pages have crawlable links and reciprocal language metadata', async ({
  page,
}) => {
  const dist = new URL('../dist/', import.meta.url);
  const files = (await readdir(dist, { recursive: true })).filter((file) =>
    file.endsWith('.html'),
  );
  const sources = await Promise.all(
    files.map(async (file) => ({
      file,
      html: await readFile(new URL(file.replaceAll('\\', '/'), dist), 'utf8'),
    })),
  );
  const documents = await page.evaluate(
    (items) =>
      items.map(({ file, html }) => {
        const document = new DOMParser().parseFromString(html, 'text/html');
        const meta = (selector: string) =>
          document.querySelector(selector)?.getAttribute('content');
        return {
          file,
          title: document.title,
          description: meta('meta[name="description"]'),
          robots: meta('meta[name="robots"]'),
          canonical: document
            .querySelector('link[rel="canonical"]')
            ?.getAttribute('href'),
          lang: document.documentElement.lang,
          dir: document.documentElement.dir,
          h1Count: document.querySelectorAll('main h1').length,
          text: document.querySelector('main')?.textContent?.trim(),
          ogTitle: meta('meta[property="og:title"]'),
          ogDescription: meta('meta[property="og:description"]'),
          ogUrl: meta('meta[property="og:url"]'),
          ogImage: meta('meta[property="og:image"]'),
          twitterImage: meta('meta[name="twitter:image"]'),
          missingAlt: document.querySelectorAll('img:not([alt])').length,
          ids: [...document.querySelectorAll('[id]')].map(
            (element) => element.id,
          ),
          links: [...document.querySelectorAll('a[href]')].map(
            (anchor) => anchor.getAttribute('href') ?? '',
          ),
          navigationLinks: [
            ...document.querySelectorAll(
              'header nav a[href], footer nav a[href]',
            ),
          ].map((anchor) => anchor.getAttribute('href') ?? ''),
          alternates: [...document.querySelectorAll('link[hreflang]')].map(
            (link) => ({
              lang: link.getAttribute('hreflang'),
              href: link.getAttribute('href'),
            }),
          ),
          schemas: [
            ...document.querySelectorAll('script[type="application/ld+json"]'),
          ].map((script) => JSON.parse(script.textContent ?? '{}')),
        };
      }),
    sources,
  );
  const indexable = documents.filter((document) =>
    document.robots?.split(',').includes('index'),
  );
  const byCanonical = new Map(
    documents
      .filter((document) => document.canonical)
      .map((document) => [document.canonical, document]),
  );
  const incoming = new Set<string>();
  for (const document of indexable) {
    expect(document.description?.length, document.file).toBeGreaterThanOrEqual(
      120,
    );
    expect(document.description?.length, document.file).toBeLessThanOrEqual(
      155,
    );
    expect(document.h1Count, document.file).toBe(1);
    expect(document.text, document.file).toBeTruthy();
    expect(document.dir, document.file).toBe(
      document.lang === 'ar' ? 'rtl' : 'ltr',
    );
    expect(document.ogTitle, document.file).toBe(document.title);
    expect(document.ogDescription, document.file).toBe(document.description);
    expect(document.ogUrl, document.file).toBe(document.canonical);
    expect(document.ogImage, document.file).toMatch(
      /^https:\/\/suprabhat-dev\.com\//,
    );
    expect(document.twitterImage, document.file).toBe(document.ogImage);
    expect(document.missingAlt, document.file).toBe(0);
    expect(document.schemas.length, document.file).toBeGreaterThan(0);
    expect(document.robots, document.file).not.toMatch(
      /nosnippet|noarchive|nocache|noimageindex/,
    );
    for (const alternate of document.alternates) {
      const target = byCanonical.get(alternate.href);
      expect(
        target,
        `${document.file} alternate ${alternate.href}`,
      ).toBeDefined();
      if (alternate.lang !== 'x-default')
        expect(target?.lang).toBe(alternate.lang);
      expect(
        target?.alternates.some(
          (item) =>
            item.lang === document.lang && item.href === document.canonical,
        ),
      ).toBe(true);
    }
    const canonical = new URL(document.canonical!);
    const identityPath = canonical.pathname.replace(/^\/(es|ar)(?=\/)/, '');
    if (
      [
        '/',
        '/about/',
        '/services/',
        '/work/',
        '/contact/',
        '/blog/',
        '/work/react-smart-copy/',
        '/work/react-inp-chunker/',
      ].includes(identityPath)
    ) {
      expect(document.description, document.file).toMatch(
        /Suprabhat Kumar|سوبرابهات كومار/,
      );
    }
    if (identityPath === '/') {
      const locale =
        document.lang === 'ar' ? 'ar' : document.lang === 'es' ? 'es' : 'en';
      expect(document.title).toBe(t(locale, 'seo.homeTitle'));
      expect(document.title.length).toBeLessThanOrEqual(60);
      expect(document.title).toMatch(/^(Suprabhat Kumar|سوبرابهات كومار) \| /);
    }
    const checkSchema = (value: unknown) => {
      if (Array.isArray(value)) return value.forEach(checkSchema);
      if (!value || typeof value !== 'object') return;
      const node = value as Record<string, unknown>;
      if (node['@type'] === 'Person')
        expect(node, document.file).not.toHaveProperty('inLanguage');
      if (node['@type'] === 'ProfessionalService') {
        expect(node['@id'], document.file).toBe(
          'https://suprabhat-dev.com/#service',
        );
        if (/^\/(?:(?:es|ar)\/)?$/.test(canonical.pathname)) {
          expect(node.image, document.file).toBe(document.ogImage);
          expect(node, document.file).not.toHaveProperty('address');
          expect(node, document.file).not.toHaveProperty('priceRange');
        }
      }
      if (node['@type'] === 'BlogPosting' || node['@type'] === 'TechArticle') {
        expect(node['@id'], document.file).toBe(`${canonical.href}#article`);
        for (const key of ['datePublished', 'dateModified']) {
          expect(node[key], document.file).toMatch(
            /^\d{4}-\d{2}-\d{2}T00:00:00\+05:30$/,
          );
          expect(Number.isFinite(Date.parse(String(node[key])))).toBe(true);
        }
        expect(node.publisher, document.file).toMatchObject({
          '@id': 'https://suprabhat-dev.com/#person',
        });
      }
      if (node['@type'] === 'ProfilePage') {
        expect(node.dateModified, document.file).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(node, document.file).not.toHaveProperty('dateCreated');
      }
      Object.values(node).forEach(checkSchema);
    };
    document.schemas.forEach(checkSchema);
    for (const href of document.navigationLinks) {
      const targetUrl = new URL(href, canonical);
      targetUrl.hash = '';
      const target = byCanonical.get(targetUrl.href);
      if (!target || /\/(?:privacy)\/$/.test(targetUrl.pathname)) continue;
      expect(
        target.robots?.split(','),
        `${document.file} navigation ${href}`,
      ).not.toContain('noindex');
    }
    for (const href of document.links) {
      const targetUrl = new URL(href, canonical);
      if (targetUrl.origin !== canonical.origin) continue;
      const fragment = targetUrl.hash;
      targetUrl.hash = '';
      targetUrl.search = '';
      if (
        !targetUrl.pathname.endsWith('/') &&
        !targetUrl.pathname.endsWith('.html')
      )
        continue;
      const target = byCanonical.get(targetUrl.href);
      expect(target, `${document.file} link ${href}`).toBeDefined();
      expect(
        targetUrl.pathname,
        `${document.file} discovery ${href}`,
      ).not.toMatch(/\/skills\/$/);
      if (targetUrl.href !== canonical.href) incoming.add(targetUrl.href);
      if (fragment)
        expect(target?.ids, `${document.file} anchor ${href}`).toContain(
          decodeURIComponent(fragment.slice(1)),
        );
    }
  }
  for (const document of indexable)
    expect(
      incoming.has(document.canonical!),
      `Orphan page: ${document.file}`,
    ).toBe(true);
  console.log(
    `Validated crawlability and metadata for ${indexable.length} indexable HTML pages.`,
  );
});

test('react-inp-chunker case study and both libraries meet the SEO contract', async () => {
  const dist = new URL('../dist/', import.meta.url);
  const read = (path: string) => readFile(new URL(path, dist), 'utf-8');
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
  const site = 'https://suprabhat-dev.com';
  const sitemap = await read('sitemap-0.xml');
  const libraries = ['react-smart-copy', 'react-inp-chunker'];

  for (const prefix of ['', 'es/', 'ar/']) {
    const url = `${site}/${prefix}work/react-inp-chunker/`;
    const html = await read(`${prefix}work/react-inp-chunker/index.html`);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
    const description =
      html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
    expect(title, prefix).toContain('react-inp-chunker');
    expect(title.length, prefix).toBeLessThanOrEqual(60);
    expect(description.length, prefix).toBeGreaterThan(70);
    expect(description.length, prefix).toBeLessThanOrEqual(160);
    expect(html).toContain(`<link rel="canonical" href="${url}"`);
    for (const [lang, href] of [
      ['en', `${site}/work/react-inp-chunker/`],
      ['es', `${site}/es/work/react-inp-chunker/`],
      ['ar', `${site}/ar/work/react-inp-chunker/`],
      ['x-default', `${site}/work/react-inp-chunker/`],
    ]) {
      expect(html, `${prefix} ${lang}`).toContain(
        `<link rel="alternate" hreflang="${lang}" href="${href}"`,
      );
    }
    expect(sitemap).toMatch(
      new RegExp(
        `<loc>${url.replaceAll('.', '\\.')}</loc><lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`,
      ),
    );

    const graph = graphOf(html);
    expect(graph.find((node) => node['@type'] === 'TechArticle')).toMatchObject(
      { url, image: `${site}/images/work/react-inp-chunker-og-1200x630.png` },
    );
    expect(
      graph.find((node) => node['@type'] === 'SoftwareSourceCode'),
    ).toMatchObject({
      '@id': `${site}/#react-inp-chunker`,
      name: 'react-inp-chunker',
      codeRepository: 'https://github.com/suprabhat02/react-inp-chunker',
      license: 'https://opensource.org/licenses/MIT',
    });

    // The homepage graph and #work section carry both libraries.
    const home = await read(`${prefix}index.html`);
    const projects = graphOf(home)
      .filter((node) => node['@type'] === 'SoftwareSourceCode')
      .map((node) => node.name);
    expect(projects, prefix).toEqual(libraries);
    for (const library of libraries) {
      expect(home, `${prefix} ${library}`).toContain(
        `data-project="${library}"`,
      );
      expect(home, `${prefix} ${library}`).toContain(
        `href="/${prefix}work/${library}/"`,
      );
    }
  }
});
