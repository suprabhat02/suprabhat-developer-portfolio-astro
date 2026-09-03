import { getCollection, type CollectionEntry } from 'astro:content';
import { localeMeta, localePrefix, type Locale } from '../i18n/config';

export type LocalizedBlogPost =
  | CollectionEntry<'blog'>
  | CollectionEntry<'blog-es'>
  | CollectionEntry<'blog-ar'>;

export interface BlogTagGroup {
  tag: string;
  slug: string;
  count: number;
  posts: LocalizedBlogPost[];
}

export interface BlogPostSummary {
  title: string;
  description: string;
  href: string;
  pubDate: Date;
  tags: string[];
}

const blogFeedMeta: Record<
  Locale,
  { title: string; description: string; language: string }
> = {
  en: {
    title: 'Suprabhat Kumar — Frontend Engineering',
    description:
      'Practical writing about frontend performance, accessibility, maintainable architecture, and modern UI delivery.',
    language: 'en',
  },
  es: {
    title: 'Suprabhat Kumar — Ingeniería frontend',
    description:
      'Artículos prácticos sobre rendimiento frontend, accesibilidad, arquitectura mantenible y entrega moderna de interfaces.',
    language: 'es',
  },
  ar: {
    title: 'سوبرابهات كومار — هندسة الواجهات الأمامية',
    description:
      'مقالات عملية حول أداء الواجهات الأمامية وإمكانية الوصول والمعمارية القابلة للصيانة وتقديم واجهات حديثة.',
    language: 'ar',
  },
};

const normalizeTag = (tag: string) => tag.trim().toLocaleLowerCase();

export const getBlogFeedMeta = (locale: Locale) => blogFeedMeta[locale];

export const getBlogPostHref = (locale: Locale, slug: string) =>
  `${localePrefix(locale)}/blog/${slug}/`;

export const getBlogFeedHref = (locale: Locale) =>
  `${localePrefix(locale)}/rss.xml`;

export const slugifyBlogTag = (tag: string) => {
  const slug = tag
    .normalize('NFKD')
    .replace(/\p{Mark}+/gu, '')
    .toLocaleLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return slug || encodeURIComponent(tag);
};

export const getBlogTagHref = (locale: Locale, tag: string) =>
  `${localePrefix(locale)}/blog/tags/${slugifyBlogTag(tag)}/`;

export const getBlogPosts = async (
  locale: Locale,
): Promise<LocalizedBlogPost[]> => {
  const filter = ({ data }: { data: { draft?: boolean } }) => !data.draft;
  const posts =
    locale === 'es'
      ? await getCollection('blog-es', filter)
      : locale === 'ar'
        ? await getCollection('blog-ar', filter)
        : await getCollection('blog', filter);

  return posts.sort(
    (first, second) =>
      second.data.pubDate.valueOf() - first.data.pubDate.valueOf(),
  );
};

export const getBlogTagGroupsFromPosts = (
  locale: Locale,
  posts: LocalizedBlogPost[],
): BlogTagGroup[] => {
  const groups = new Map<string, BlogTagGroup>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const key = normalizeTag(tag);
      const existing = groups.get(key);

      if (existing) {
        existing.count += 1;
        existing.posts.push(post);
      } else {
        groups.set(key, {
          tag,
          slug: slugifyBlogTag(tag),
          count: 1,
          posts: [post],
        });
      }
    }
  }

  return [...groups.values()].sort(
    (first, second) =>
      second.count - first.count ||
      first.tag.localeCompare(second.tag, localeMeta[locale].htmlLang),
  );
};

export const getBlogTagGroups = async (locale: Locale) =>
  getBlogTagGroupsFromPosts(locale, await getBlogPosts(locale));

export const findBlogTagGroup = (
  locale: Locale,
  posts: LocalizedBlogPost[],
  slug: string,
) =>
  getBlogTagGroupsFromPosts(locale, posts).find((group) => group.slug === slug);

export const getRelatedBlogPosts = (
  posts: LocalizedBlogPost[],
  currentPost: LocalizedBlogPost,
  limit = 2,
) => {
  const currentTags = new Set(currentPost.data.tags.map(normalizeTag));
  const scoredPosts = posts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => ({
      post,
      score: post.data.tags.reduce(
        (score, tag) => score + (currentTags.has(normalizeTag(tag)) ? 1 : 0),
        0,
      ),
    }))
    .sort(
      (first, second) =>
        second.score - first.score ||
        second.post.data.pubDate.valueOf() - first.post.data.pubDate.valueOf(),
    );

  return scoredPosts.slice(0, limit).map(({ post }) => post);
};

export const toBlogPostSummary = (
  locale: Locale,
  post: LocalizedBlogPost,
): BlogPostSummary => ({
  title: post.data.title,
  description: post.data.description,
  href: getBlogPostHref(locale, post.id),
  pubDate: post.data.pubDate,
  tags: post.data.tags,
});
