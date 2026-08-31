---
title: 'Front-End Code Review Checklist Before You Ship'
description: 'A practical review flow for catching functional, accessibility, responsive, performance, and maintainability issues before a frontend release.'
pubDate: 2026-08-27
tags: ['Code Review', 'Accessibility', 'Performance', 'Frontend']
draft: false
---

A front-end review should answer a larger question than "does the code compile?" It should establish whether the change works for real users, remains understandable to the team, and behaves safely under slow networks, unusual data, keyboard input, and different screen sizes.

The best review order follows risk. Start with behavior, then examine semantics and accessibility, responsive layout, performance, and maintainability. A formatting discussion should not hide a broken form or an inaccessible dialog.

## 1. Confirm the intended behavior

Read the requirement and use the interface before reviewing implementation details. Verify the normal path, then deliberately test awkward states:

- Empty, loading, partial, error, and success states
- Long names, translated text, large numbers, and missing optional fields
- Repeated clicks and submissions
- Back and forward navigation
- Refreshing a deep URL
- Slow or failed network requests
- Expired authentication or insufficient permissions

For forms, confirm that labels remain associated with inputs, validation messages identify the problem, focus moves to the first invalid field when appropriate, and server failures produce a recoverable state. Client-side validation improves feedback, but it does not replace server-side validation.

When reviewing state, look for a clear owner. Derived values usually should not be copied into another state variable. Server data, URL state, form state, and temporary interface state solve different problems and should not be mixed without a reason.

## 2. Review the document structure

Semantic HTML gives browsers and assistive technology useful behavior before JavaScript runs. Check that the implementation uses:

- One descriptive `h1` for the page topic
- Headings that describe sections in a logical hierarchy
- Real `button` elements for actions
- Links for navigation to another URL
- `nav`, `main`, `article`, `section`, `aside`, and `footer` where they express the structure
- Native form controls with visible labels
- Lists for related sets of items

A clickable `div` must recreate keyboard behavior, focus behavior, disabled behavior, and an accessible role. In most cases, replacing it with a button is simpler and more reliable.

ARIA should supplement native semantics, not compete with them. Verify that IDs referenced by `aria-labelledby`, `aria-describedby`, and `aria-controls` exist and are unique. Remove stale attributes left behind after refactoring.

The site's [accessibility page](/accessibility/) describes the baseline features expected across this portfolio.

## 3. Test keyboard and focus behavior

Use the page without a mouse. A reviewer should be able to:

1. Reach every interactive control with the keyboard.
2. See where focus is at all times.
3. Operate controls with their expected keys.
4. Open and close dialogs or menus without losing focus.
5. Escape temporary interfaces where users expect Escape to work.
6. Continue in a logical order after content changes.

For a modal dialog, focus should enter the dialog, remain within it while open, and return to the trigger when closed. For client-side navigation, the new page must have a useful title and a deliberate focus strategy.

Do not approve a change that removes the focus outline without an equally visible replacement.

## 4. Check responsive behavior with hostile content

A responsive review is not three screenshots. Resize continuously and look for the point where the layout fails. Test narrow mobile widths, landscape orientation, tablet widths, and wide desktop screens.

Inspect fixed-format elements such as tables, toolbars, charts, grids, and dialogs. Confirm that:

- Text wraps without covering nearby controls
- Long words and URLs cannot force horizontal page scrolling
- Touch targets have enough separation
- Important actions do not move unpredictably
- Images reserve their dimensions before loading
- Zooming to 200% does not hide content or actions
- Content order remains meaningful when columns stack

Translated interfaces often reveal assumptions earlier than English. Even before translations are available, test longer substitute strings rather than relying on perfect copy length.

## 5. Protect Core Web Vitals

Performance review should connect implementation choices to user-visible work. The current Core Web Vitals are Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).

For LCP, inspect the likely largest image or heading. A hero image should have correct dimensions, a responsive source set, and high fetch priority only when it is genuinely the LCP candidate. Avoid competing preloads.

For INP, look for event handlers that perform large synchronous updates, render excessive component trees, or repeatedly measure and mutate layout. Debouncing is useful for some events, but it is not a substitute for reducing the work.

For CLS, reserve space for images, embeds, banners, and asynchronous content. Avoid inserting notices above the user's current position after load.

Also check:

- Whether a new dependency is justified by the behavior it provides
- Whether code can run at build time or on the server instead of in the browser
- Whether route-level code splitting remains effective
- Whether images are appropriately compressed and sized
- Whether third-party scripts load only when needed

More detail on the implementation approach appears in [frontend engineering services](/services/).

## 6. Review React and TypeScript decisions

In React, verify that effects synchronize with an external system rather than calculate values that could be derived during render. Check effect cleanup for subscriptions, timers, and event listeners.

Do not request `useMemo` or `useCallback` automatically. They add code and can obscure ownership. Use them when profiling, referential identity, or an established compiler strategy provides a concrete reason.

For TypeScript:

- Prefer narrow domain types over broad objects
- Avoid `any` where the boundary can be validated
- Represent loading and error states explicitly
- Validate untrusted API data at the boundary
- Keep public component props intentional
- Avoid assertions that merely silence a real uncertainty

A type assertion is not runtime validation. Data from APIs, storage, query strings, and forms remains untrusted at runtime.

## 7. Evaluate maintainability and tests

Ask whether a developer unfamiliar with the change can identify the data flow, state owner, failure behavior, and extension points. Naming should explain intent. Comments should preserve non-obvious reasoning rather than narrate syntax.

Tests should cover behavior that matters: a validation rule, permission boundary, keyboard interaction, error recovery path, or transformation with meaningful edge cases. Avoid tests that duplicate implementation details and fail during harmless refactors.

Before approval, run the repository's formatter, linter, type checker, focused tests, production build, and an accessibility scan. Automated checks cannot prove usability, but they are good at preventing known failures from returning.

## Final review checklist

- [ ] Requirements and edge states behave correctly
- [ ] Semantic HTML and heading structure are meaningful
- [ ] Keyboard and focus behavior work
- [ ] Mobile, zoom, and long-content layouts remain contained
- [ ] LCP, INP, and CLS risks are addressed
- [ ] React effects and state have clear ownership
- [ ] Untrusted data is validated at runtime
- [ ] Tests cover important behavior rather than implementation details
- [ ] New dependencies and client-side JavaScript are justified
- [ ] The production build and automated checks pass

A strong review is a shared risk assessment, not a style contest. Prioritize findings by user impact, explain why they matter, and distinguish required fixes from optional suggestions. That keeps review rigorous without slowing the team with noise.
