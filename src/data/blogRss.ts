import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_URL } from '../config/site';
import { localePrefix, type Locale } from '../i18n/config';
import {
  getBlogFeedHref,
  getBlogFeedMeta,
  getBlogPostHref,
  getBlogPosts,
  toRssDate,
} from './blog';

export const createLocalizedBlogRss = async (
  context: APIContext,
  locale: Locale,
) => {
  const site = context.site ?? new URL(SITE_URL);
  const feedMeta = getBlogFeedMeta(locale);
  const posts = await getBlogPosts(locale);
  const blogUrl = new URL(`${localePrefix(locale)}/blog/`, site).href;
  const feedUrl = new URL(getBlogFeedHref(locale), site).href;

  return rss({
    title: feedMeta.title,
    description: feedMeta.description,
    site,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: [
      `<language>${feedMeta.language}</language>`,
      `<link>${blogUrl}</link>`,
      `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    ].join(''),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      link: getBlogPostHref(locale, post.id),
      categories: post.data.tags,
      author: 'Suprabhat Kumar',
      // Written here: @astrojs/rss would print a midnight-UTC timestamp.
      customData: `<pubDate>${toRssDate(post.data.pubDate)}</pubDate>`,
    })),
  });
};
