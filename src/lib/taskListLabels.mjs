/**
 * Sätteri hast plugin: gives Markdown task-list checkboxes an accessible name.
 *
 * GitHub-flavored Markdown renders `- [ ] item` as a disabled, unlabeled
 * `<input type="checkbox">`, which fails WCAG 4.1.2 (axe rule `label`).
 * The text of the owning list item becomes the checkbox's `aria-label`, so
 * screen readers announce the state together with the item it belongs to.
 *
 * @returns {import('satteri').HastPluginDefinition}
 */
export default function taskListLabels() {
  return {
    name: 'task-list-labels',
    element: {
      filter: ['input'],
      visit(node, ctx) {
        const properties = node.properties ?? {};
        if (properties.type !== 'checkbox' || properties.ariaLabel) return;

        const item = ctx.parent(node);
        if (!item || item.type !== 'element' || item.tagName !== 'li') return;

        const label = ctx.textContent(item).replace(/\s+/g, ' ').trim();
        if (label) ctx.setProperty(node, 'ariaLabel', label);
      },
    },
  };
}
