import { expect, test } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

for (const route of ['/', '/es/', '/ar/']) {
  test(`scene guardrails outside existing visual-story coverage: ${route}`, async ({
    page,
  }) => {
    await page.goto(route);
    const scenes = page.locator('.lv-scene');
    expect(await scenes.count()).toBeGreaterThan(0);
    await expect(
      page.locator(
        '.lv-scene filter, .lv-scene [filter], .lv-defs filter, .lv-defs [filter]',
      ),
    ).toHaveCount(0);
    const inlineFilters = await page
      .locator('.lv-scene [style], .lv-defs [style]')
      .evaluateAll((elements) =>
        elements
          .filter((element) =>
            /(?:^|;)\s*filter\s*:\s*url\s*\(/i.test(
              element.getAttribute('style') ?? '',
            ),
          )
          .map((element) => element.outerHTML),
      );
    expect(inlineFilters).toEqual([]);

    // ui.spec.ts already checks these five sections in every locale.
    const remaining = await scenes.evaluateAll((elements) => {
      const covered =
        '#expertise, #approach, #engagements, #collaboration, #blog';
      const stack = [
        'editor',
        'store',
        'responsive',
        'query',
        'handoff',
        'review',
      ];
      return elements
        .filter(
          (element) =>
            !element.closest(covered) &&
            !stack.some((name) =>
              element.classList.contains(`lv-scene--${name}`),
            ),
        )
        .map((element) => ({
          scene: element.className,
          codeTones: element.querySelectorAll('.ty-kw, .ty-type').length,
          labels: element.querySelectorAll('text').length,
        }));
    });
    expect(remaining.length).toBeGreaterThan(0);
    for (const scene of remaining) {
      expect(scene.codeTones, scene.scene).toBe(0);
      expect(scene.labels, scene.scene).toBeLessThanOrEqual(3);
    }
  });
}

test('source colors use tokens except documented alpha masks and the dev palette', async () => {
  const styles = join(root, 'src', 'styles');
  const components = join(root, 'src', 'components');
  const files = [
    ...(await readdir(styles))
      .filter((name) => name.endsWith('.css') && name !== 'tokens.css')
      .map((name) => join(styles, name)),
    ...(await readdir(components, { recursive: true }))
      .filter((name) => name.endsWith('.astro'))
      .map((name) => join(components, name)),
  ];
  expect(files.length).toBeGreaterThan(0);

  // THEMING.md permits black mask stops: only their alpha affects rendering.
  const alphaMaskFiles = new Set([
    'src/styles/global.css',
    'src/styles/motion.css',
    'src/styles/homepage.css',
  ]);
  const violations: string[] = [];
  for (const file of files) {
    const name = relative(root, file).split(sep).join('/');
    // This dev-only lab must declare candidate palettes independently of the
    // selected tokens. Its absence from every production HTML file is checked below.
    if (name === 'src/components/fx/PalettePicker.astro') continue;

    let source = (await readFile(file, 'utf8')).replace(
      /\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g,
      '',
    );
    if (alphaMaskFiles.has(name)) {
      source = source.replace(
        /(?:^|\n)[ \t]*(?:mask(?:-image)?|--meteor-fade)\s*:[^;]+;/g,
        (declaration) => {
          // homepage.css's --meteor-fade is used solely as mask-image; its
          // 35%-alpha black stops dim meteors, not paint the page.
          if (
            declaration.includes('--meteor-fade') &&
            name !== 'src/styles/homepage.css'
          )
            return declaration;
          return declaration.replace(
            /#000\b|rgb\(0 0 0 \/ 0\.35\)/g,
            'transparent',
          );
        },
      );
    }
    const literals = source.match(
      /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(\s*[+-]?(?:\d|\.\d)/gi,
    );
    if (literals) violations.push(`${name}: ${literals.join(', ')}`);
  }
  expect(violations).toEqual([]);

  const dist = join(root, 'dist');
  const pages = (await readdir(dist, { recursive: true })).filter((name) =>
    name.endsWith('.html'),
  );
  expect(pages.length).toBeGreaterThan(0);
  for (const file of pages) {
    expect(await readFile(join(dist, file), 'utf8'), file).not.toContain(
      'data-palette-picker',
    );
  }
});
