import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_URL } from '../config/site';
import { localeMeta, localePrefix, type Locale } from '../i18n/config';
import { getBlogFeedMeta, getBlogPostHref, getBlogPosts } from './blog';

export const createLocalizedBlogRss = async (
  context: APIContext,
  locale: Locale,
) => {
  const site = context.site ?? new URL(SITE_URL);
  const feedMeta = getBlogFeedMeta(locale);
  const posts = await getBlogPosts(locale);
  const blogUrl = new URL(`${localePrefix(locale)}/blog/`, site).href;

  return rss({
    title: feedMeta.title,
    description: feedMeta.description,
    site,
    customData: [
      `<language>${feedMeta.language}</language>`,
      `<link>${blogUrl}</link>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getBlogPostHref(locale, post.id),
      categories: post.data.tags,
      author: 'Suprabhat Kumar',
      customData: `<language>${localeMeta[locale].htmlLang}</language>`,
    })),
  });
};
