import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  return rss({
    title: 'Suprabhat Kumar — Frontend Engineering',
    description:
      'Practical writing about frontend performance, accessibility, and modern UI delivery.',
    customData: '<language>en</language>',
    site: context.site,
    items: posts.map((post) => ({ ...post.data, link: `/blog/${post.id}/` })),
  });
}
