import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { URL } from 'node:url';

const siteUrl = 'https://suprabhat-dev.com';
const nonDefaultLocalePattern = /^\/(?:es|ar)(?=\/|$)/;

const defaultLocaleUrlFor = (url) => {
  const parsedUrl = new URL(url);
  const defaultPath = parsedUrl.pathname.replace(nonDefaultLocalePattern, '');
  return new URL(defaultPath || '/', siteUrl).href;
};

export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
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
      filter: (page) => !/\/404\/$/.test(new URL(page).pathname),
      serialize: (item) => {
        if (!item.links?.length) return item;

        return {
          ...item,
          links: [
            ...item.links,
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
