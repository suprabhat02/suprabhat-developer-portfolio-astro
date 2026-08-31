import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { URL } from 'node:url';

export default defineConfig({
  site: 'https://suprabhat-dev.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/404\/$/.test(new URL(page).pathname),
    }),
  ],
});
