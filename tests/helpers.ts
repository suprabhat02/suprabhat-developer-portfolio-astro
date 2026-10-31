import AxeBuilder from '@axe-core/playwright';
import { expect, type Locator, type Page } from '@playwright/test';

// axe-core ships its only WCAG 2.2 AA rule, target-size, disabled by default.
export const axe = (page: Page) =>
  new AxeBuilder({ page }).options({
    rules: { 'target-size': { enabled: true } },
  });

export const scrollToVisible = async (target: Locator) => {
  let previousTop: number | undefined;
  await expect
    .poll(async () => {
      const position = await target.evaluate((element) => {
        element.scrollIntoView({ block: 'center', behavior: 'instant' });
        const bounds = element.getBoundingClientRect();
        return {
          top: bounds.top,
          visible:
            bounds.width > 0 &&
            bounds.height > 0 &&
            bounds.top + bounds.height / 2 > 0 &&
            bounds.top + bounds.height / 2 < innerHeight,
        };
      });
      const settled = position.visible && position.top === previousTop;
      previousTop = position.top;
      return settled;
    })
    .toBe(true);
};
