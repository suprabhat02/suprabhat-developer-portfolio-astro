import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs, promisify } from 'node:util';
import { chromium } from '@playwright/test';

const execute = promisify(execFile);
const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
const { values } = parseArgs({
  options: {
    'base-url': { type: 'string', default: 'http://127.0.0.1:4323' },
    paths: { type: 'string', default: '/,/es/,/ar/' },
    profiles: { type: 'string', default: 'mobile,desktop' },
    runs: { type: 'string', default: '3' },
    output: { type: 'string', default: 'lighthouse-reports' },
    verify: { type: 'string' },
  },
});

const failuresFor = (report) => {
  const failures = categories.flatMap((category) => {
    const score = report.categories?.[category]?.score;
    return score === 1
      ? []
      : [`${category}: ${score == null ? 'missing' : score * 100}`];
  });
  if (report.runtimeError)
    failures.push(`runtime: ${report.runtimeError.message}`);
  return failures;
};

if (values.verify) {
  const report = JSON.parse(await readFile(resolve(values.verify), 'utf8'));
  const failures = failuresFor(report);
  console.log(
    failures.length ? `FAIL ${failures.join('; ')}` : 'PASS 100/100/100/100',
  );
  process.exitCode = failures.length ? 1 : 0;
} else {
  const runs = Number(values.runs);
  const profiles = [
    ...new Set(values.profiles.split(',').map((profile) => profile.trim())),
  ];
  const paths = [
    ...new Set(values.paths.split(',').map((path) => path.trim())),
  ];
  const base = new URL(values['base-url']);
  if (!Number.isSafeInteger(runs) || runs < 1)
    throw new Error('--runs must be a positive integer.');
  if (profiles.some((profile) => !['mobile', 'desktop'].includes(profile)))
    throw new Error('Profiles must be mobile or desktop.');
  if (
    paths.some(
      (path) =>
        !path.startsWith('/') ||
        path.startsWith('//') ||
        new URL(path, base).origin !== base.origin,
    )
  )
    throw new Error('Paths must be absolute paths on the audited origin.');
  if (!['http:', 'https:'].includes(base.protocol))
    throw new Error('The audit URL must use HTTP or HTTPS.');

  const startedAt = new Date().toISOString();
  const directory = resolve(values.output, startedAt.replaceAll(/[:.]/g, '-'));
  await mkdir(directory, { recursive: true });
  const cli = fileURLToPath(
    new URL('../cli/index.js', import.meta.resolve('lighthouse')),
  );
  const results = [];

  for (const [pathIndex, path] of paths.entries()) {
    const url = new URL(path, base).href;
    const response = await fetch(url);
    if (response.status !== 200)
      throw new Error(`${url} returned HTTP ${response.status}.`);
    const htmlSha256 = createHash('sha256')
      .update(await response.text())
      .digest('hex');
    for (const profile of profiles) {
      for (let run = 1; run <= runs; run += 1) {
        const reportPath = resolve(
          directory,
          `${pathIndex + 1}-${profile}-${run}.json`,
        );
        const args = [
          cli,
          url,
          '--chrome-flags=--headless',
          `--only-categories=${categories.join(',')}`,
          '--quiet',
          '--output=json',
          `--output-path=${reportPath}`,
        ];
        if (profile === 'desktop') args.push('--preset=desktop');
        try {
          await execute(process.execPath, args, {
            env: { ...process.env, CHROME_PATH: chromium.executablePath() },
            timeout: 180_000,
            maxBuffer: 2 * 1024 * 1024,
          });
          const report = JSON.parse(await readFile(reportPath, 'utf8'));
          const failures = failuresFor(report);
          const scores = Object.fromEntries(
            categories.map((category) => [
              category,
              report.categories?.[category]?.score ?? null,
            ]),
          );
          results.push({
            url,
            profile,
            run,
            htmlSha256,
            lighthouseVersion: report.lighthouseVersion,
            scores,
            failures,
            reportPath,
          });
          console.log(
            `${failures.length ? 'FAIL' : 'PASS'} ${profile} ${path} run ${run}: ${categories.map((category) => (scores[category] == null ? 'missing' : scores[category] * 100)).join('/')}`,
          );
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          results.push({
            url,
            profile,
            run,
            htmlSha256,
            failures: [message],
            reportPath,
          });
          console.error(`FAIL ${profile} ${path} run ${run}: ${message}`);
        }
        await writeFile(
          resolve(directory, 'summary.json'),
          JSON.stringify(
            {
              startedAt,
              nodeVersion: process.version,
              paths,
              profiles,
              runs,
              results,
            },
            null,
            2,
          ),
        );
      }
    }
  }
  const failed = results.filter((result) => result.failures.length > 0);
  console.log(
    `${results.length - failed.length}/${results.length} strict audits passed. Reports: ${directory}`,
  );
  process.exitCode = failed.length ? 1 : 0;
}
