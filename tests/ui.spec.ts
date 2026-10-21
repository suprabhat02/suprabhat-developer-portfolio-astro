import { expect, test } from '@playwright/test';
import { axe } from './helpers';

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

test('open-source spotlight links react-smart-copy and copies the install command', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  for (const prefix of ['', '/es', '/ar']) {
    await page.goto(`${prefix}/work/`);
    const card = page.locator('.oss-card');
    await expect(card).toBeVisible();
    for (const href of [
      'https://suprabhat02.github.io/react-smart-copy/',
      'https://github.com/suprabhat02/react-smart-copy',
      'https://www.npmjs.com/package/react-smart-copy',
    ]) {
      const link = card.locator(`a[href="${href}"]`);
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    await expect(
      card.locator(`a[href="${prefix}/work/react-smart-copy/"]`),
    ).toBeVisible();
  }

  await page.goto('/work/');
  const button = page.locator('.oss-card .copy-btn');
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('data-state', 'copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'npm install react-smart-copy',
  );
  await expect(button).toHaveAttribute('data-state', 'idle', {
    timeout: 4000,
  });

  await page.goto('/work/react-smart-copy/');
  const structuredData = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).join('');
  expect(structuredData).toContain('SoftwareSourceCode');
});

test('living cards render decorative scenes with depth and stay static at rest', async ({
  page,
}) => {
  await page.goto('/');
  const cards = page.locator('.fx-live');
  expect(await cards.count()).toBeGreaterThanOrEqual(17);
  // Every living card has the full effect stack and a decorative scene.
  const summary = await cards.evaluateAll((elements) =>
    elements.map((card) => ({
      glow: card.hasAttribute('data-glow'),
      tilt: card.hasAttribute('data-tilt'),
      border: card.classList.contains('fx-card-gradient'),
      sceneHidden:
        card.querySelector('.lv-scene')?.getAttribute('aria-hidden') ?? null,
    })),
  );
  for (const card of summary) {
    expect(card).toEqual({
      glow: true,
      tilt: true,
      border: true,
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

test('hero uses the aurora backdrop and a plain-text name', async ({
  page,
}) => {
  for (const prefix of ['', '/ar']) {
    await page.goto(`${prefix}/`);
    const hero = page.locator('#home');
    await expect(hero.locator('.fx-aurora-bg')).toHaveCount(1);
    await expect(hero.locator('.fx-grid')).toHaveCount(0);
    await expect(page.locator('#hero-name .fx-gradient-text')).toHaveCount(0);
    const fill = await page
      .locator('#hero-name')
      .evaluate((element) => getComputedStyle(element).webkitTextFillColor);
    expect(fill).not.toBe('rgba(0, 0, 0, 0)');
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

test('scroll-linked progress indicators run in the production build', async ({
  page,
}) => {
  await page.goto('/about/');
  const bar = page.locator('.site-header .hdr-progress');
  const timelines = await page.evaluate(() =>
    ['.hdr-progress', '.btt-ring'].map((selector) => {
      const style = getComputedStyle(document.querySelector(selector)!);
      return [style.animationName, style.animationTimeline];
    }),
  );
  expect(timelines).toEqual([
    ['fx-grow-x', expect.stringMatching(/^scroll\(root/)],
    ['fx-ring', expect.stringMatching(/^scroll\(root/)],
  ]);
  const scaleX = () =>
    bar.evaluate(
      (element) => new DOMMatrix(getComputedStyle(element).transform).a,
    );
  expect(await scaleX()).toBeLessThan(0.05);
  // Re-scroll on each poll: lazily rendered sections can still settle height.
  await expect
    .poll(async () => {
      await page.evaluate(() =>
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'instant',
        }),
      );
      return scaleX();
    })
    .toBeGreaterThan(0.95);
  await expect(page.locator('[data-btt]')).toBeVisible();

  await page.goto('/experience/');
  await expect(page.locator('.xp-rail-fill')).toHaveCSS(
    'animation-timeline',
    '--xp-timeline',
  );
});
