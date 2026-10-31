import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { satteri } from '@astrojs/markdown-satteri';
import taskListLabels from './src/lib/taskListLabels.mjs';
import { getCaseStudies } from './src/data/caseStudies.ts';

const siteUrl = 'https://suprabhat-dev.com';
const nonDefaultLocalePattern = /^\/(?:es|ar)(?=\/|$)/;
const localePrefixes = { en: '', es: '/es', ar: '/ar' };

const defaultLocaleUrlFor = (url) => {
  const parsedUrl = new URL(url);
  const defaultPath = parsedUrl.pathname.replace(nonDefaultLocalePattern, '');
  return new URL(defaultPath || '/', siteUrl).href;
};

// Post URL -> updatedDate ?? pubDate, read from frontmatter for sitemap lastmod.
const postLastmod = new Map(
  [
    ['blog', ''],
    ['blog-es', '/es'],
    ['blog-ar', '/ar'],
  ].flatMap(([dir, prefix]) =>
    readdirSync(new URL(`./src/content/${dir}/`, import.meta.url))
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const source = readFileSync(
          new URL(`./src/content/${dir}/${file}`, import.meta.url),
          'utf8',
        );
        const date = (field) =>
          source.match(new RegExp(`^${field}:\\s*['"]?([\\d-]+)`, 'm'))?.[1];
        return [
          `${siteUrl}${prefix}/blog/${file.replace(/\.md$/, '')}/`,
          date('updatedDate') ?? date('pubDate'),
        ];
      })
      .filter(([, date]) => date),
  ),
);

// Case study URL -> dateModified from its data (itself taken from git history).
const caseStudyLastmod = new Map(
  Object.entries(localePrefixes).flatMap(([locale, prefix]) =>
    getCaseStudies(locale).map((caseStudy) => [
      `${siteUrl}${prefix}/work/${caseStudy.slug}/`,
      caseStudy.dateModified,
    ]),
  ),
);

// Static pages -> date of the last commit touching the files they render
// from. A shallow clone reports its single commit for every path, so there
// (or without git) lastmod is left out rather than guessed.
const git = (args) =>
  execFileSync('git', args, {
    cwd: fileURLToPath(new URL('.', import.meta.url)),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
const hasFullHistory = (() => {
  try {
    return git(['rev-parse', '--is-shallow-repository']) === 'false';
  } catch {
    return false;
  }
})();
const sectionSources = (locale) => [
  locale === 'en'
    ? 'src/pages/[page].astro'
    : 'src/pages/[locale]/[...page].astro',
  'src/components/PageContent.astro',
  'src/data/pageSeo.ts',
  'src/i18n/messages.ts',
];
const pageSources = {
  '/': (locale) => [
    locale === 'en'
      ? 'src/pages/index.astro'
      : 'src/pages/[locale]/index.astro',
    'src/components/Homepage.astro',
    'src/components/HomepageConversion.astro',
    'src/components/HomepageHead.astro',
    'src/components/ExperienceTimeline.astro',
    'src/components/OpenSourceSpotlight.astro',
    'src/data',
    'src/i18n/messages.ts',
  ],
  '/about/': (locale) => [...sectionSources(locale), 'src/data/profile.ts'],
  '/experience/': (locale) => [
    ...sectionSources(locale),
    'src/data/experience.ts',
    'src/components/ExperienceTimeline.astro',
  ],
  '/tools/': (locale) => [...sectionSources(locale), 'src/data/tools.ts'],
  '/work/': (locale) => [
    ...sectionSources(locale),
    'src/data/work.ts',
    'src/data/caseStudies.ts',
    'src/data/additionalCaseStudies.ts',
    'src/data/openSource.ts',
    'src/components/OpenSourceSpotlight.astro',
  ],
  '/recommendations/': (locale) => [
    ...sectionSources(locale),
    'src/data/recommendations.ts',
  ],
  '/services/': (locale) => [...sectionSources(locale), 'src/data/services.ts'],
  '/faq/': (locale) => [
    ...sectionSources(locale),
    'src/data/faqs.ts',
    'src/components/FAQList.astro',
  ],
  '/contact/': (locale) => [
    ...sectionSources(locale),
    'src/data/profile.ts',
    'src/components/ContactForm.astro',
  ],
  '/accessibility/': sectionSources,
  '/blog/': (locale) => [
    ...sectionSources(locale),
    'src/data/blog.ts',
    `src/content/${locale === 'en' ? 'blog' : `blog-${locale}`}`,
  ],
};
const staticPageLastmod = new Map(
  hasFullHistory
    ? Object.entries(localePrefixes).flatMap(([locale, prefix]) =>
        Object.entries(pageSources).map(([path, sources]) => [
          `${siteUrl}${prefix}${path}`,
          git(['log', '-1', '--format=%cs', '--', ...sources(locale)]),
        ]),
      )
    : [],
);

// The sitemap library prints every lastmod as a UTC timestamp. These are all
// calendar days, so rewrite "YYYY-MM-DDT00:00:00.000Z" back to "YYYY-MM-DD".
const dateOnlySitemapLastmod = {
  name: 'date-only-sitemap-lastmod',
  hooks: {
    'astro:build:done': ({ dir }) => {
      for (const file of readdirSync(dir)) {
        if (!/^sitemap-.*\.xml$/.test(file)) continue;
        const path = new URL(file, dir);
        const xml = readFileSync(path, 'utf8');
        writeFileSync(
          path,
          xml.replace(
            /<lastmod>(\d{4}-\d{2}-\d{2})T00:00:00\.000Z<\/lastmod>/g,
            '<lastmod>$1</lastmod>',
          ),
        );
      }
    },
  },
};

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({ hastPlugins: [taskListLabels()] }),
    // Code colors come from role tokens in global.css, so they follow the theme.
    shikiConfig: { theme: 'css-variables' },
  },
  vite: {
    optimizeDeps: {
      // Pre-bundle client-only deps at dev-server start; discovering them on
      // first use makes Vite re-optimize and reload every open page.
      include: ['react-smart-copy/core'],
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
          ar: 'ar',
        },
      },
      filter: (page) => {
        const pathname = new URL(page).pathname;
        // Tag archives are noindex, so they stay out of the sitemap too.
        // Keep the page list in sync with NOINDEX_PAGES in src/config/site.ts.
        return (
          !/\/404(?:\/|\.html)?$/.test(pathname) &&
          !/\/blog\/tags\//.test(pathname) &&
          !/\/contact\/thanks\/$/.test(pathname) &&
          !/^(?:\/(?:es|ar))?\/(?:privacy|skills)\/$/.test(pathname)
        );
      },
      serialize: (item) => {
        const lastmod =
          postLastmod.get(item.url) ??
          caseStudyLastmod.get(item.url) ??
          staticPageLastmod.get(item.url);
        const dated = lastmod ? { ...item, lastmod } : item;
        if (!dated.links?.length) return dated;

        return {
          ...dated,
          links: [
            ...dated.links,
            {
              lang: 'x-default',
              url: defaultLocaleUrlFor(item.url),
            },
          ],
        };
      },
    }),
    dateOnlySitemapLastmod,
  ],
});
