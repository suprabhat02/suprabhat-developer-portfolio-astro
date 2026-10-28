import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const site = new URL('https://suprabhat-dev.com/');
const key = (
  await readFile(new URL('../public/indexnow-key.txt', import.meta.url), 'utf8')
).trim();
const keyLocation = new URL('/indexnow-key.txt', site).href;
const endpoint = 'https://api.indexnow.org/indexnow';

const decodeXml = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'suprabhat-dev-indexnow/1.0' },
  });
  if (!response.ok) {
    throw new Error(`GET ${url} failed with HTTP ${response.status}`);
  }
  return response.text();
}

function getChangedPaths() {
  const before = process.env.BEFORE_SHA;
  const current = process.env.CURRENT_SHA;

  if (
    !before ||
    !current ||
    !/^[0-9a-f]{40}$/i.test(before) ||
    !/^[0-9a-f]{40}$/i.test(current)
  ) {
    throw new Error('IndexNow requires valid BEFORE_SHA and CURRENT_SHA commit SHAs.');
  }

  const diff = execFileSync(
    'git',
    ['diff', '--name-status', '--find-renames=false', before, current],
    { encoding: 'utf8' },
  );

  return diff
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [status, path] = line.split('\t');
      return { status, path };
    })
    .filter(({ path }) => Boolean(path));
}

const blogPathFor = (sourcePath) => {
  const match = sourcePath.match(
    /^src\/content\/(blog|blog-es|blog-ar)\/(.+)\.md$/,
  );
  if (!match) return undefined;

  const [, collection, sourceSlug] = match;
  const locale =
    collection === 'blog-es' ? 'es' : collection === 'blog-ar' ? 'ar' : 'en';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const slug = sourceSlug.split('/').map(encodeURIComponent).join('/');
  return {
    locale,
    articleUrl: new URL(`${prefix}/blog/${slug}/`, site).href,
    indexUrl: new URL(`${prefix}/blog/`, site).href,
  };
};

const verifiedKey = (await fetchText(keyLocation)).trim();
if (verifiedKey !== key) {
  throw new Error(
    'The deployed IndexNow key file does not match the repository key.',
  );
}

const changes = getChangedPaths();
if (changes.length === 0) {
  console.log('No changed paths found; skipping IndexNow submission.');
  process.exit(0);
}

const blogChanges = changes.map(({ path }) => ({
  path,
  route: blogPathFor(path),
}));
const blogOnly = blogChanges.every(({ route }) => Boolean(route));
const urls = new Set();

if (!blogOnly) {
  const sitemapIndexUrl = new URL('/sitemap-index.xml', site).href;
  const sitemapIndex = await fetchText(sitemapIndexUrl);
  const childSitemaps = [
    ...sitemapIndex.matchAll(
      /<sitemap\b[^>]*>\s*<loc>([\s\S]*?)<\/loc>\s*<\/sitemap>/g,
    ),
  ].map(([, loc]) => decodeXml(loc.trim()));
  const sitemapUrls = childSitemaps.length
    ? childSitemaps
    : [sitemapIndexUrl];

  for (const sitemapUrl of sitemapUrls) {
    const xml = await fetchText(sitemapUrl);
    for (const [, rawUrl] of xml.matchAll(
      /<url\b[^>]*>[\s\S]*?<loc>([\s\S]*?)<\/loc>[\s\S]*?<\/url>/g,
    )) {
      const url = new URL(decodeXml(rawUrl.trim()));
      if (url.protocol === 'https:' && url.hostname === site.hostname) {
        urls.add(url.href);
      }
    }
  }
}

for (const { route } of blogChanges) {
  if (!route) continue;
  // Include deleted article URLs too: IndexNow asks engines to re-crawl them
  // and observe the resulting 404/redirect, even though they left the sitemap.
  urls.add(route.articleUrl);
  urls.add(route.indexUrl);
}

const urlList = [...urls];
if (urlList.length === 0) {
  throw new Error('No changed URLs were resolved for the IndexNow submission.');
}
if (urlList.length > 10000) {
  throw new Error('The URL submission exceeds IndexNow’s 10,000-URL request limit.');
}

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: site.hostname,
    key,
    keyLocation,
    urlList,
  }),
});

if (!response.ok) {
  const detail = (await response.text()).slice(0, 500);
  throw new Error(
    `IndexNow rejected the submission (HTTP ${response.status}): ${detail}`,
  );
}

console.log(
  `IndexNow accepted ${urlList.length} changed URL(s) from ${changes.length} source change(s).`,
);
