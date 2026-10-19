import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

// axe-core ships its only WCAG 2.2 AA rule, target-size, disabled by default.
export const axe = (page: Page) =>
  new AxeBuilder({ page }).options({
    rules: { 'target-size': { enabled: true } },
  });
