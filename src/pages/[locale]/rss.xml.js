import { createLocalizedBlogRss } from '../../data/blogRss';

export function getStaticPaths() {
  return ['es', 'ar'].map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export async function GET(context) {
  return createLocalizedBlogRss(context, context.props.locale);
}
