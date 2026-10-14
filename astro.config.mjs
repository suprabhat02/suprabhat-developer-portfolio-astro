import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { readFileSync, readdirSync } from 'node:fs';
import { URL } from 'node:url';
import { satteri } from '@astrojs/markdown-satteri';
import taskListLabels from './src/lib/taskListLabels.mjs';

const siteUrl = 'https://suprabhat-dev.com';
const nonDefaultLocalePattern = /^\/(?:es|ar)(?=\/|$)/;

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
        return (
          !/\/404(?:\/|\.html)?$/.test(pathname) &&
          !/\/blog\/tags\//.test(pathname)
        );
      },
      serialize: (item) => {
        const lastmod = postLastmod.get(item.url);
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
  ],
});
