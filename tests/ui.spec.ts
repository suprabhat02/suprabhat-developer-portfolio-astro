import { expect, test } from '@playwright/test';
import { axe, scrollToVisible } from './helpers';

test('grouped skills and tools keep local logos and readable reduced-motion content in every locale', async ({
  page,
}) => {
  test.slow();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const technologies = [
    ['CSS3', 'css3.svg'],
    ['Ant Design', 'antdesign.svg'],
    ['Material UI', 'materialui.svg'],
    ['Zustand', 'zustand.webp'],
    ['shadcn/ui', 'shadcnui.svg'],
    ['GitHub Actions', 'githubactions.svg'],
    ['Zod', 'zod.svg'],
    ['Astro', 'astro.svg'],
  ] as const;
  for (const prefix of ['', '/es', '/ar']) {
    for (const route of ['/', '/skills/', '/tools/']) {
      await page.goto(`${prefix}${route}`);
      const region = page.locator(route === '/' ? '#skills' : 'main');
      for (const [name, file] of technologies) {
        const icon = region
          .locator(`img[src="/assets/techicons/${file}"]`)
          .first();
        await expect(icon).toHaveAttribute('alt', '');
        await expect(region).toContainText(name);
        expect((await page.request.get(`/assets/techicons/${file}`)).ok()).toBe(
          true,
        );
      }
      if (route === '/') {
        await expect(page.locator('#tools .tm-group')).toHaveCount(6);
        await expect(page.locator('#skills .skill-col')).toHaveCount(6);
        await expect(page.locator('#tools .tm-item')).toHaveCount(28);
        const names = await page.locator('#tools .tm-name').allTextContents();
        expect(new Set(names).size).toBe(28);
        for (const [name] of technologies) expect(names).toContain(name);
        for (const [group, members] of Object.entries({
          languages: ['Astro', 'jQuery'],
          data: ['Zod', 'Zustand', 'GraphQL'],
          styling: ['CSS3', 'shadcn/ui', 'Material UI'],
          backend: ['FastAPI', 'PostgreSQL', 'MongoDB'],
          design: ['Figma', 'Storybook'],
          workflow: ['GitHub Actions', 'Azure', 'Git'],
        })) {
          for (const member of members) {
            await expect(
              page.locator(`[data-skill-group="${group}"]`),
            ).toContainText(member);
            await expect(
              page.locator(`[aria-labelledby="tool-group-${group}"] .tm-name`),
            ).toContainText([member]);
          }
        }
        await page.locator('#tools').scrollIntoViewIfNeeded();
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        const supportsTimeline = await page.evaluate(() =>
          CSS.supports('animation-timeline', 'view()'),
        );
        await expect(page.locator('#tools .tm-item').first()).toHaveCSS(
          'animation-name',
          supportsTimeline ? 'fx-reveal' : 'none',
        );
        if (supportsTimeline) {
          await expect(page.locator('#tools .tm-item').first()).toHaveCSS(
            'animation-timeline',
            'view()',
          );
        }
        await page.emulateMedia({ reducedMotion: 'reduce' });
        expect(
          await page.locator('#tools .tm-item').evaluateAll((items) =>
            items.every((item) => {
              const style = getComputedStyle(item);
              return style.animationName === 'none' && style.opacity === '1';
            }),
          ),
        ).toBe(true);
        for (const theme of ['dark', 'light']) {
          await page.evaluate((value) => {
            document.documentElement.dataset.theme = value;
          }, theme);
          const backgrounds = await page
            .locator('#collaboration .lv-scene')
            .evaluateAll((scenes) =>
              scenes.map((scene) => getComputedStyle(scene).backgroundImage),
            );
          expect(backgrounds).toHaveLength(3);
          for (const background of backgrounds)
            expect(background).toContain('radial-gradient');
        }
      }
      const layout = await region.evaluate((element) => ({
        direction: getComputedStyle(element).direction,
        overflow: document.documentElement.scrollWidth > innerWidth,
        clipped: [
          ...element.querySelectorAll('h3, .tm-name, .skill-ul li'),
        ].some((item) => item.scrollWidth > item.clientWidth + 1),
      }));
      expect(layout).toEqual({
        direction: prefix === '/ar' ? 'rtl' : 'ltr',
        overflow: false,
        clipped: false,
      });
      if ((page.viewportSize()?.width ?? 0) > 1000) {
        const selectors =
          route === '/'
            ? ['#skills .skill-col', '#tools .tm-group']
            : route === '/skills/'
              ? ['[data-skill-group]']
              : ['.tool-group'];
        for (const selector of selectors) {
          await scrollToVisible(page.locator(selector).first());
          const rowSizes = await page
            .locator(selector)
            .evaluateAll((groups) => {
              const rows = new Map<number, number>();
              for (const group of groups) {
                const top = Math.round(group.getBoundingClientRect().top);
                rows.set(top, (rows.get(top) ?? 0) + 1);
              }
              return [...rows.values()];
            });
          expect(rowSizes, `${prefix}${route} ${selector}`).toEqual([3, 3]);
        }
      }
    }
  }
});

test('hero rotating phrases stay vertically centered and unclipped', async ({
  page,
}, testInfo) => {
  test.slow();
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/`);
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator('.hero-flip');
    if (await page.evaluate(() => matchMedia('(max-width: 560px)').matches)) {
      await expect(hero).toBeHidden();
      continue;
    }
    await hero.scrollIntoViewIfNeeded();
    await expect(hero.locator('.fx-flip-track')).toHaveCSS(
      'animation-name',
      'fx-flip',
    );
    await expect
      .poll(() =>
        hero
          .locator('.fx-flip-track')
          .evaluate((track) => track.getAnimations().length),
      )
      .toBe(1);
    const positions = await hero.evaluate((element) => {
      const label = element
        .querySelector('.hero-flip-label')!
        .getBoundingClientRect();
      const slot = element.querySelector('.fx-flip')!.getBoundingClientRect();
      const track = element.querySelector('.fx-flip-track')!;
      const animation = track.getAnimations()[0]!;
      animation.pause();
      const centers = [0, 5250, 9000, 12750].map((time, index) => {
        animation.currentTime = time;
        const word = track.children[index]!;
        const bounds = word.getBoundingClientRect();
        return {
          offset: Math.abs(
            bounds.top + bounds.height / 2 - slot.top - slot.height / 2,
          ),
          clipped: word.scrollWidth > slot.width + 1,
        };
      });
      animation.currentTime = 0;
      return {
        labelAligned:
          Math.abs(label.top + label.height / 2 - slot.top - slot.height / 2) <
            1 || label.bottom <= slot.top,
        centers,
      };
    });
    expect(positions.labelAligned, prefix).toBe(true);
    for (const position of positions.centers) {
      expect(position.offset, prefix).toBeLessThan(1);
      expect(position.clipped, prefix).toBe(false);
    }
    await expect(hero.locator('.sr-only')).toHaveCount(1);
    await expect(hero.locator('.fx-flip')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    for (const theme of ['dark', 'light']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      await page.screenshot({
        path: testInfo.outputPath(
          `hero-alignment-${prefix.slice(1) || 'en'}-${theme}.png`,
        ),
      });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(hero.locator('.fx-flip-track')).toHaveCSS(
      'animation-name',
      'none',
    );
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});

test('major-device journeys preserve navigation, themes, content and form validation', async ({
  page,
}, testInfo) => {
  test.slow();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let submissions = 0;
  await page.route('https://api.web3forms.com/**', async (route) => {
    submissions += 1;
    await route.abort();
  });
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/`);
    await page.evaluate(() => document.fonts.ready);
    const menu = page.locator('button[aria-controls="mob-menu"]');
    if (await menu.isVisible()) {
      await menu.click();
      await expect(menu).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('#mob-menu')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
    }
    for (const theme of ['light', 'dark']) {
      if ((await page.locator('html').getAttribute('data-theme')) !== theme) {
        await page.locator('.theme-toggle').click();
      }
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect
        .poll(() => page.evaluate(() => localStorage.getItem('sk-theme')))
        .toBe(theme);
      await page.screenshot({
        path: testInfo.outputPath(
          `homepage-${prefix.slice(1) || 'en'}-${theme}.png`,
        ),
      });
    }
    for (const route of [
      '',
      'about/',
      'skills/',
      'experience/',
      'work/performance-modernization/',
      'blog/accessibility-in-react-what-developers-skip/',
      'contact/',
    ]) {
      if (route) await page.goto(`${prefix}/${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('html')).toHaveAttribute(
        'dir',
        prefix === '/ar' ? 'rtl' : 'ltr',
      );
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      const layout = await page.evaluate(() => ({
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
        clipped: [...document.querySelectorAll('main h1,main h2,main h3')]
          .filter(
            (element) =>
              element.clientWidth > 0 &&
              element.scrollWidth > element.clientWidth + 1,
          )
          .map((element) => element.textContent?.trim()),
      }));
      expect(layout, `${prefix}/${route}`).toEqual({
        overflow: false,
        clipped: [],
      });
    }
    await page.goto(`${prefix}/`);
    const form = page.locator('#homepage-contact-form');
    const submit = form.locator('button[type="submit"]');
    await scrollToVisible(submit);
    await submit.click();
    await expect(form.locator('[data-error-summary]')).toBeVisible();
    await expect(form.locator('[data-error-summary]')).toBeFocused();
    await expect(form.locator('[data-error-summary] a')).toHaveCount(6);
  }
  expect(submissions).toBe(0);
  expect(errors).toEqual([]);
});

test('resume download and contact draft persistence work', async ({ page }) => {
  await page.goto('/');

  const resumeLink = page.getByRole('link', { name: 'Download résumé' });
  await expect(resumeLink).toHaveAttribute('download', '');
  const resumeResponse = await page.request.get(
    '/assets/suprabhat-kumar-senior-frontend-engineer-resume.pdf',
  );
  expect(resumeResponse.status()).toBe(200);
  expect(resumeResponse.headers()['content-type']).toContain('application/pdf');

  const projectForm = page.locator('#homepage-contact-form');
  await projectForm.locator('[name="name"]').fill('Saved draft name');
  await expect(projectForm.locator('[data-draft-status]')).toContainText(
    'Draft saved on this device',
  );

  await page.reload();
  await expect(projectForm.locator('[name="name"]')).toHaveValue(
    'Saved draft name',
  );
  await expect(projectForm.locator('[data-draft-status]')).toContainText(
    'Draft restored from this device',
  );
});

test('motion layer is progressive, accessible, and honors reduced motion', async ({
  page,
}) => {
  // Three full-page axe scans plus a reduced-motion reload: long journey.
  test.slow();
  await page.goto('/');

  // Native effects only: no UI-framework runtime, islands, or hydration.
  await expect(page.locator('astro-island')).toHaveCount(0);
  const scriptSources = await page
    .locator('script[src]')
    .evaluateAll((scripts) =>
      scripts.map((script) => (script as HTMLScriptElement).src),
    );
  for (const source of scriptSources) {
    expect(source).not.toMatch(/react|preact|framer|motion\.dev|vue|svelte/i);
  }

  // Decorative duplicates never reach assistive technology.
  const flipLabel = page.locator('.hero-flip .sr-only');
  await expect(flipLabel).toHaveCount(1);
  await expect(page.locator('.hero-flip .fx-flip')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(page.locator('.kw-marquee')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  for (const clone of await page
    .locator('#recommendations [data-clone]')
    .all()) {
    await expect(clone).toHaveAttribute('aria-hidden', 'true');
  }

  // Reduced motion: animations stop and marquee clones are removed.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const reduced = await page.evaluate(() => {
    const track = document.querySelector('.recs-track');
    const clone = document.querySelector('.recs-track > [data-clone]');
    const aurora = document.querySelector('.fx-aurora-flow');
    return {
      trackAnimation: track ? getComputedStyle(track).animationName : '',
      cloneDisplay: clone ? getComputedStyle(clone).display : '',
      auroraAnimation: aurora ? getComputedStyle(aurora).animationName : '',
    };
  });
  expect(reduced).toEqual({
    trackAnimation: 'none',
    cloneDisplay: 'none',
    auroraAnimation: 'none',
  });
  const reducedOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(reducedOverflow).toBe(false);

  // Light theme and RTL inner pages remain axe-clean with effects applied.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => localStorage.setItem('sk-theme', 'light'));
  for (const path of ['/', '/ar/', '/work/performance-modernization/']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const results = await axe(page).analyze();
    expect(results.violations, path).toEqual([]);
  }
});

test('open-source spotlights link both libraries and copy their install commands', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const libraries = ['react-smart-copy', 'react-inp-chunker'] as const;
  for (const prefix of ['', '/es', '/ar']) {
    for (const path of [`${prefix}/`, `${prefix}/work/`]) {
      await page.goto(path);
      const cards = page.locator(
        path === `${prefix}/` ? '#work .oss-card' : '.oss-card',
      );
      await expect(cards).toHaveCount(libraries.length);
      for (const library of libraries) {
        const card = page.locator(`.oss-card[data-project="${library}"]`);
        await expect(card).toBeVisible();
        for (const href of [
          `https://suprabhat02.github.io/${library}/`,
          `https://github.com/suprabhat02/${library}`,
          `https://www.npmjs.com/package/${library}`,
        ]) {
          const link = card.locator(`a[href="${href}"]`);
          await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
        await expect(
          card.locator(`a[href="${prefix}/work/${library}/"]`),
        ).toBeVisible();
      }
    }
  }

  await page.goto('/work/');
  for (const library of libraries) {
    const button = page.locator(
      `.oss-card[data-project="${library}"] .copy-btn`,
    );
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toHaveAttribute('data-state', 'copied');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      `npm install ${library}`,
    );
    await expect(button).toHaveAttribute('data-state', 'idle', {
      timeout: 4000,
    });
  }

  for (const library of libraries) {
    await page.goto(`/work/${library}/`);
    const structuredData = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).join('');
    expect(structuredData).toContain('SoftwareSourceCode');
    expect(structuredData).toContain(
      `"codeRepository":"https://github.com/suprabhat02/${library}"`,
    );
  }
});

test('living cards render decorative scenes with depth and stay static at rest', async ({
  page,
}) => {
  await page.goto('/');
  const cards = page.locator('.fx-live');
  expect(await cards.count()).toBeGreaterThanOrEqual(17);
  const summary = await cards.evaluateAll((elements) =>
    elements.map((card) => ({
      glow: card.hasAttribute('data-glow'),
      tilt: card.hasAttribute('data-tilt'),
      border: card.classList.contains('fx-card-gradient'),
      frameRadiusMatches:
        getComputedStyle(card, '::before').borderTopLeftRadius ===
        getComputedStyle(card).borderTopLeftRadius,
      sceneHidden:
        card.querySelector('.lv-scene')?.getAttribute('aria-hidden') ?? null,
    })),
  );
  for (const card of summary) {
    expect(card).toEqual({
      glow: true,
      tilt: false,
      border: true,
      frameRadiusMatches: true,
      sceneHidden: 'true',
    });
  }
  // Nothing animates on a clock until a card is engaged (touch screens tie
  // the scenes to scrolling instead, which is not time-based).
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.playState === 'running' &&
            animation.timeline instanceof DocumentTimeline &&
            animation.effect instanceof KeyframeEffect &&
            animation.effect.target instanceof Element &&
            animation.effect.target.closest('.lv-scene'),
        ).length,
  );
  expect(running).toBe(0);
});

test('card depth keeps fixed accent corners and respects reduced motion', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Pointer perspective requires a fine pointer');
  await page.goto('/');
  const card = page.locator('.fx-live').first();
  await card.scrollIntoViewIfNeeded();
  for (const theme of ['dark', 'light']) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    await page.mouse.move(0, 0);
    const restingMask = await card.evaluate(
      (element) => getComputedStyle(element, '::before').maskSize,
    );
    await card.hover({ position: { x: 30, y: 30 } });
    await expect(card).toHaveAttribute('data-parallax', '');
    await expect
      .poll(() =>
        card.evaluate((element) => {
          const style = getComputedStyle(element);
          const matrix = new DOMMatrixReadOnly(style.transform);
          const frame = getComputedStyle(element, '::before');
          const probe = document.createElement('span');
          probe.style.color = 'var(--accent-fill)';
          element.append(probe);
          const accent = getComputedStyle(probe).color;
          probe.remove();
          return {
            tilted: Math.abs(matrix.m13) > 0.01,
            lifted: matrix.m42 < -5,
            orange: frame.borderTopColor === accent,
          };
        }),
      )
      .toEqual({ tilted: true, lifted: true, orange: true });
    expect(
      await card.evaluate(
        (element) => getComputedStyle(element, '::before').maskSize,
      ),
    ).toBe(restingMask);
    await page.mouse.move(0, 0);
    await expect(card).not.toHaveAttribute('data-parallax', '');
  }
  await card.hover({ position: { x: 30, y: 30 } });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(card).not.toHaveAttribute('data-parallax', '');
  await expect(card).toHaveCSS('transform', 'none');
});

test('MobileCoderz progression fits each locale and theme', async ({
  page,
}) => {
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/experience/`);
    const card = page.locator('.xp-card--progression');
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator('.xp-title')).toHaveText('MobileCoderz');
    await expect(card.locator('.xp-role')).toHaveCount(2);
    await expect(card.locator('.xp-role').first()).toHaveClass(
      /xp-role--promoted/,
    );
    for (const theme of ['dark', 'light']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const layout = await card.evaluate((element) => ({
        direction: getComputedStyle(element).direction,
        overflow: [...element.querySelectorAll('h2,h3,h4,p,li')].some(
          (child) => child.scrollWidth > child.clientWidth + 1,
        ),
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
      }));
      expect(layout).toEqual({
        direction: prefix === '/ar' ? 'rtl' : 'ltr',
        overflow: false,
        pageOverflow: false,
      });
    }
  }
});

test('collaboration meteors share the subdued CTA treatment', async ({
  page,
}) => {
  for (const prefix of ['', '/ar']) {
    await page.goto(`${prefix}/`);
    const treatments = await page
      .locator(':is(.collaboration-section, .cta-band) .fx-meteors')
      .evaluateAll((elements) =>
        elements.map((element) => ({
          opacity: getComputedStyle(element).opacity,
          mask: getComputedStyle(element).maskImage,
        })),
      );
    expect(treatments).toHaveLength(2);
    expect(treatments[0]).toEqual(treatments[1]);
    expect(Number(treatments[0]?.opacity)).toBeLessThanOrEqual(0.55);
  }
});

test('hero proof cards have clearance and no continuous frame border', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const row = page.locator('.hero-proof-grid');
  await row.scrollIntoViewIfNeeded();
  const cards = row.locator('.hero-proof-card');
  for (const theme of ['dark', 'light']) {
    await page.evaluate((value) => {
      document.documentElement.dataset.theme = value;
    }, theme);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      if (!isMobile) await card.hover({ position: { x: 20, y: 20 } });
      await expect
        .poll(() =>
          card.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            const parent = element.parentElement!.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              verticalClearance:
                rect.top > parent.top && rect.bottom < parent.bottom,
              border: style.borderTopColor,
              background: style.backgroundClip.includes('border-box'),
            };
          }),
        )
        .toEqual({
          verticalClearance: true,
          border: 'rgba(0, 0, 0, 0)',
          background: false,
        });
    }
  }
  const borders = await page
    .locator('.fx-card-gradient')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).borderTopColor),
    );
  expect(borders.every((color) => color === 'rgba(0, 0, 0, 0)')).toBe(true);
});

test('alternate homepage sections share the Tools dot pattern', async ({
  page,
}) => {
  await page.goto('/');
  const sections = await page
    .locator('section.section-alt')
    .evaluateAll((elements) =>
      elements.map((element) => ({
        id: element.id,
        patterns: element.querySelectorAll('.fx-dots').length,
        image: getComputedStyle(element.querySelector('.fx-dots')!)
          .backgroundImage,
      })),
    );
  expect(sections.some((section) => section.id === 'skills')).toBe(true);
  expect(sections.every((section) => section.patterns === 1)).toBe(true);
  expect(new Set(sections.map((section) => section.image)).size).toBe(1);
});

test('world map renders verified routes, portrait and localized responsive layout', async ({
  page,
}, testInfo) => {
  test.slow();
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/`);
    const map = page.locator('.world-map');
    await map.scrollIntoViewIfNeeded();
    await expect(map.locator('svg')).toHaveAttribute(
      'aria-label',
      /India|الهند/,
    );
    await expect(map.locator('.world-map-route')).toHaveCount(5);
    // Packets travel with composited transforms, and the 52px avatar is a
    // responsive asset rather than the full-size portrait file.
    await expect(map.locator('.world-map-packet').first()).toHaveCSS(
      'offset-path',
      'none',
    );
    await expect(map.locator('img')).toHaveAttribute(
      'srcset',
      /\/_astro\/suprabhat\.[\w-]+\.webp 52w, .+ 104w/,
    );
    expect(
      Number(await map.locator('svg').getAttribute('data-land-points')),
    ).toBeGreaterThan(1000);
    await map.locator('img').scrollIntoViewIfNeeded();
    await expect
      .poll(async () => {
        await map
          .locator('img')
          .evaluate((image) =>
            image.scrollIntoView({ block: 'center', behavior: 'instant' }),
          );
        return map.locator('img').evaluate((image) => {
          const bounds = image.getBoundingClientRect();
          return bounds.top >= 0 && bounds.bottom <= innerHeight;
        });
      })
      .toBe(true);
    await expect
      .poll(() =>
        map
          .locator('img')
          .evaluate(
            (image) =>
              image instanceof HTMLImageElement &&
              image.complete &&
              image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    const countries =
      prefix === '/ar'
        ? ['الهند', 'الدنمارك', 'الصين', 'ألمانيا', 'أستراليا', 'نيوزيلندا']
        : prefix === '/es'
          ? [
              'India',
              'Dinamarca',
              'China',
              'Alemania',
              'Australia',
              'Nueva Zelanda',
            ]
          : [
              'India',
              'Denmark',
              'China',
              'Germany',
              'Australia',
              'New Zealand',
            ];
    await expect(map.locator('.world-map-locations li')).toHaveText(countries);
    for (const country of countries) {
      await expect(map.locator('svg')).toHaveAttribute(
        'aria-label',
        new RegExp(country),
      );
    }
    const cards = page.locator('.collaboration-layout > .fx-live');
    await expect(cards).toHaveCount(3);
    for (const scene of ['chat', 'milestones', 'merge']) {
      await expect(cards.locator(`.lv-scene--${scene} svg`)).toHaveCount(1);
    }
    for (const theme of ['dark', 'light']) {
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      const result = await page
        .locator('.collaboration-layout')
        .evaluate((element) => ({
          overflow: [...element.querySelectorAll('h3,p,strong,span,li')].some(
            (child) => child.scrollWidth > child.clientWidth + 1,
          ),
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          direction: getComputedStyle(element).direction,
          mapDirection: getComputedStyle(element.querySelector('svg')!)
            .direction,
          overlap: [...element.children].some((child, index, children) => {
            const bounds = child.getBoundingClientRect();
            return children.slice(index + 1).some((other) => {
              const next = other.getBoundingClientRect();
              return (
                bounds.left < next.right - 1 &&
                bounds.right > next.left + 1 &&
                bounds.top < next.bottom - 1 &&
                bounds.bottom > next.top + 1
              );
            });
          }),
        }));
      expect(result).toEqual({
        overflow: false,
        pageOverflow: false,
        direction: prefix === '/ar' ? 'rtl' : 'ltr',
        mapDirection: 'ltr',
        overlap: false,
      });
      await page.locator('.collaboration-layout').screenshot({
        path: testInfo.outputPath(
          `world-map-${prefix.slice(1) || 'en'}-${theme}.png`,
        ),
      });
    }
  }
  const map = page.locator('.world-map');
  await map.scrollIntoViewIfNeeded();
  await expect(map).not.toHaveAttribute('data-offscreen', '');
  await expect(map.locator('.world-map-packet').first()).toHaveCSS(
    'animation-play-state',
    'running',
  );
  await page.locator('#home').scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute('data-offscreen', '');
  await expect(map.locator('.world-map-packet').first()).toHaveCSS(
    'animation-play-state',
    'paused',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.world-map-packet').first()).toHaveCSS(
    'display',
    'none',
  );
  await expect(page.locator('.world-map-halo').first()).toHaveCSS(
    'animation-name',
    'none',
  );
});

test('collaboration bento preserves hover and tap scene animations', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');
  const cards = page.locator('.collaboration-layout > .fx-live');
  for (const card of await cards.all()) {
    await page.mouse.move(0, 0);
    await scrollToVisible(card);
    const running = () =>
      card
        .locator('.lv-scene')
        .evaluate(
          (scene) =>
            scene
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length,
        );
    await expect.poll(running).toBe(0);
    if (isMobile) {
      await card.dispatchEvent('pointerdown', {
        pointerId: 17,
        pointerType: 'touch',
        isPrimary: true,
        clientX: 40,
        clientY: 40,
      });
      await card.dispatchEvent('pointerup', {
        pointerId: 17,
        pointerType: 'touch',
        isPrimary: true,
        clientX: 40,
        clientY: 100,
      });
      await expect(card).not.toHaveAttribute('data-active', '');
      await card.tap();
      await expect(card).toHaveAttribute('data-active', '');
    } else {
      await card.hover();
    }
    await expect.poll(running).toBeGreaterThan(0);
    if (isMobile) {
      const heading = page.locator('#collaboration .section-head');
      await scrollToVisible(heading);
      await heading.tap();
    } else {
      await page.mouse.move(0, 0);
    }
    await expect.poll(running).toBe(0);
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await cards
      .locator('.lv-scene')
      .evaluateAll(
        (scenes) =>
          scenes.flatMap((scene) => scene.getAnimations({ subtree: true }))
            .length,
      ),
  ).toBe(0);
});

test('hero uses the aurora backdrop and a plain-text name', async ({
  page,
  isMobile,
}) => {
  for (const prefix of ['', '/es', '/ar']) {
    // Playwright keeps the virtual pointer position across navigations, and
    // (0, 0) sits on the hero itself. Park the pointer outside the viewport
    // first, otherwise the previous locale's hover/tap fires pointerover on
    // the freshly loaded hero and engages the aurora before the idle
    // assertion below runs.
    await page.mouse.move(-10, -10);
    await page.goto(`${prefix}/`);
    const hero = page.locator('#home');
    await expect(page.locator('.site-header')).toHaveCSS(
      'animation-name',
      'none',
    );
    await expect(page.locator('.site-header')).toHaveCSS('opacity', '1');
    await expect(hero.locator('.fx-aurora-bg')).toHaveCount(1);
    await expect(hero.locator('.fx-aurora-bg')).toHaveCSS(
      'max-block-size',
      '1024px',
    );
    await expect(hero.locator('.fx-grid')).toHaveCount(0);
    await expect(page.locator('#hero-name .fx-gradient-text')).toHaveCount(0);
    const fill = await page
      .locator('#hero-name')
      .evaluate((element) => getComputedStyle(element).webkitTextFillColor);
    expect(fill).not.toBe('rgba(0, 0, 0, 0)');
    const flow = hero.locator('.fx-aurora-flow');
    // Idle: a static first frame, so no large blended animation layer is
    // promoted before first paint.
    await expect(flow).toHaveCSS('animation-name', 'none');
    if (isMobile) {
      await hero.locator('.hero-name').tap();
      await expect(hero).toHaveAttribute('data-active', '');
    } else {
      await hero.locator('.hero-content').hover();
    }
    await expect(hero).toHaveAttribute('data-engaged', '');
    await expect(flow).toHaveCSS('animation-name', 'fx-aurora-flow');
    await expect(flow).toHaveCSS('animation-play-state', 'running');
    await page.mouse.move(-10, -10);
    await hero.locator('a.btn').first().focus();
    await expect(flow).toHaveCSS('animation-play-state', 'running');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(flow).toHaveCSS('animation-name', 'none');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});

test('CTA globe loads lazily, is described, and marks India', async ({
  page,
}) => {
  const globeRequests: string[] = [];
  page.on('request', (request) => {
    if (/\/globe\.[\w-]+\.js$/.test(new URL(request.url()).pathname)) {
      globeRequests.push(request.url());
    }
  });
  await page.goto('/ar/');
  await page.waitForLoadState('load');
  expect(globeRequests).toHaveLength(0);

  const globe = page.locator('[data-globe]');
  await expect(globe).toHaveAttribute('role', 'img');
  await expect(globe).toHaveAttribute('data-home-label', 'الهند');
  await expect(globe).toHaveAttribute('aria-label', /الهند/);
  await globe.scrollIntoViewIfNeeded();
  await expect(globe).toHaveAttribute('data-ready', '', { timeout: 15_000 });
  // The first frame paints on the next animation frame after mounting.
  await expect
    .poll(() =>
      globe.locator('canvas').evaluate((canvas) => {
        const context = (canvas as HTMLCanvasElement).getContext('2d');
        if (!context) return 0;
        const { width, height } = canvas as HTMLCanvasElement;
        const pixels = context.getImageData(0, 0, width, height).data;
        let opaque = 0;
        for (let index = 3; index < pixels.length; index += 4 * 97) {
          if ((pixels[index] ?? 0) > 0) opaque++;
        }
        return opaque;
      }),
    )
    .toBeGreaterThan(100);
  await expect(page.locator('.cta-band .fx-meteors')).toHaveCSS(
    'container-type',
    'size',
  );
});

test('contact form shows placeholders and toasts, resetting only on success', async ({
  page,
}) => {
  let succeed = false;
  await page.route('https://api.web3forms.com/submit', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: succeed }),
    }),
  );
  await page.goto('/');
  const form = page.locator('#homepage-contact-form');
  for (const name of ['name', 'email', 'company', 'message']) {
    await expect(form.locator(`[name="${name}"]`)).toHaveAttribute(
      'placeholder',
      /\S/,
    );
  }
  for (const name of ['project_type', 'budget', 'timeline']) {
    await expect(
      form.locator(`[name="${name}"] option[value=""]`),
    ).toHaveAttribute('disabled', '');
  }

  await form.evaluate((element) => {
    const key = element.querySelector<HTMLInputElement>('[name="access_key"]');
    if (key) key.value = 'test-key';
  });
  await form.locator('[name="name"]').fill('Test Person');
  await form.locator('[name="email"]').fill('test@example.com');
  await form.locator('[name="project_type"]').selectOption('design-system');
  await form.locator('[name="budget"]').selectOption('5k-15k');
  await form.locator('[name="timeline"]').selectOption('exploring');
  await form.locator('[name="message"]').fill('Need a design system.');

  await form.getByRole('button', { name: 'Send enquiry' }).click();
  const failure = page.locator('.toast--error');
  await expect(failure).toBeVisible();
  await expect(failure).toHaveAttribute('role', 'alert');
  await expect(failure).toContainText('Message not sent');
  await expect(form.locator('[name="name"]')).toHaveValue('Test Person');

  succeed = true;
  await form.getByRole('button', { name: 'Send enquiry' }).click();
  const success = page.locator('.toast--success');
  await expect(success).toBeVisible();
  await expect(success).toContainText('Message sent');
  await expect(form.locator('[name="name"]')).toHaveValue('');
  await expect(form.locator('[name="budget"]')).toHaveValue('');
  await expect(page.locator('[data-toast-region]')).toHaveAttribute(
    'aria-live',
    'polite',
  );

  await success.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(success).toHaveCount(0);
});

test('compact header and About photo', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = await page.locator('.site-header').evaluate((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      width: box.width,
      center: box.left + box.width / 2,
      viewportCenter: document.documentElement.clientWidth / 2,
      blur: style.backdropFilter,
    };
  });
  expect(header.width).toBeLessThan(900);
  // Fixed elements center on the full window, which includes the reserved
  // scrollbar gutter (scrollbar-gutter: stable), so allow half a gutter.
  expect(Math.abs(header.center - header.viewportCenter)).toBeLessThan(9);
  expect(header.blur).toContain('blur');

  const photo = page.locator('.about-photo img');
  await expect(photo).toHaveAttribute('loading', 'lazy');
  await expect(photo).toHaveAttribute('alt', /Suprabhat Kumar/);
});

test('scenes play on tap on touch screens and never on scroll', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('/');
  const card = page.locator('.engagement-card').first();
  await card.scrollIntoViewIfNeeded();
  const running = () =>
    page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.playState === 'running' &&
              animation.effect instanceof KeyframeEffect &&
              animation.effect.target instanceof Element &&
              animation.effect.target.closest('.lv-scene'),
          ).length,
    );
  expect(await running()).toBe(0);
  await card.locator('h3').tap();
  await expect(card).toHaveAttribute('data-active', '');
  expect(await running()).toBeGreaterThan(0);
  await page.locator('#engagements .section-head').tap();
  await expect(card).not.toHaveAttribute('data-active', '');
  await context.close();
});

test('long page and article headings wrap instead of clipping', async ({
  page,
}) => {
  const paths = [
    '/blog/accessibility-in-react-what-developers-skip/',
    '/es/blog/accessibility-in-react-what-developers-skip/',
    '/ar/blog/accessibility-in-react-what-developers-skip/',
    '/accessibility/',
    '/es/work/analytics-command-center/',
  ];
  for (const width of [360, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const overflowing = await page
        .locator('h1, h2, h3')
        .evaluateAll((headings) =>
          headings
            .filter((heading) => heading.scrollWidth > heading.clientWidth)
            .map((heading) => heading.textContent?.trim()),
        );
      expect(overflowing, `${path} at ${width}px`).toEqual([]);
    }
  }
});

test('scroll-linked back-to-top ring runs in the production build', async ({
  page,
}) => {
  await page.goto('/about/');
  await expect(page.locator('.btt-ring')).toHaveCSS(
    'animation-name',
    'fx-ring',
  );
  await expect(page.locator('.btt-ring')).toHaveCSS(
    'animation-timeline',
    /^scroll\(root/,
  );
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  await expect(page.locator('[data-btt]')).toBeVisible();

  await page.goto('/experience/');
  await expect(page.locator('.xp-rail-fill')).toHaveCSS(
    'animation-timeline',
    '--xp-timeline',
  );
});
