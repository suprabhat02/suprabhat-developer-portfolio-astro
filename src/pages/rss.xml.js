import { createLocalizedBlogRss } from '../data/blogRss';

export async function GET(context) {
  return createLocalizedBlogRss(context, 'en');
}
