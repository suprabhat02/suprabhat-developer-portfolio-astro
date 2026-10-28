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

const verifiedKey = (await fetchText(keyLocation)).trim();
if (verifiedKey !== key) {
  throw new Error(
    'The deployed IndexNow key file does not match the repository key.',
  );
}

const sitemapIndexUrl = new URL('/sitemap-index.xml', site).href;
const sitemapIndex = await fetchText(sitemapIndexUrl);
const childSitemaps = [
  ...sitemapIndex.matchAll(
    /<sitemap\b[^>]*>\s*<loc>([\s\S]*?)<\/loc>\s*<\/sitemap>/g,
  ),
].map(([, loc]) => decodeXml(loc.trim()));
const sitemapUrls = childSitemaps.length ? childSitemaps : [sitemapIndexUrl];
const urls = new Set();

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

const urlList = [...urls];
if (urlList.length === 0) {
  throw new Error('No canonical URLs were found in the deployed sitemap.');
}
if (urlList.length > 10000) {
  throw new Error(
    'The sitemap contains more URLs than one IndexNow request supports.',
  );
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
  `IndexNow accepted a submission containing ${urlList.length} canonical sitemap URLs.`,
);
