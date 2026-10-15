---
title: 'Accessibility in React: What Most Developers Skip'
description: 'Focus management, keyboard nav, ARIA live regions, and screen reader testing — the React a11y gaps that hurt real users.'
pubDate: 2026-10-15
heroImage: /images/blog/accessibility-in-react-what-developers-skip-cover-1600x840.png
tags: ['Accessibility', 'Frontend', 'TypeScript', 'UI Engineering']
draft: false
---

Most React accessibility advice is static-page advice. Add alt text, label your inputs, check contrast, run Lighthouse. All of that matters, and none of it touches the problems that make React apps hard to use with a keyboard or a screen reader.

Those problems come from what makes React useful in the first place: the interface changes without a page load. A modal opens, a route changes, a toast appears, a list filters itself. Each change is obvious to someone looking at the screen and invisible to someone who is not, unless the code deliberately communicates it.

This article covers the gaps I see most often in React codebases: focus after dynamic changes, keyboard behavior in custom components, live regions, and a screen reader testing routine that catches what automated tools cannot.

## Why most React a11y advice stops too early

Automated scanners such as axe and Lighthouse are good at one thing: inspecting the document at a single moment. They find missing labels, empty buttons, invalid ARIA attributes, and low contrast. Those are real defects, and every project should block them in continuous integration.

What a scanner cannot see is behavior over time. It does not know that focus disappeared into the `body` when your modal closed. It cannot tell that your custom dropdown ignores the arrow keys, or that a screen reader user heard nothing when a form saved successfully. A page can score 100 and still be unusable without a mouse.

The fix is to treat accessibility as interaction design, not markup hygiene. For every state change in the interface, ask three questions:

- Where is keyboard focus after this change?
- How does a screen reader user learn that something changed?
- Can every action that triggered the change be performed without a pointer?

The rest of this article applies those questions to the patterns that fail most often.

## Focus management after dynamic content changes

When content changes and focus stays where it was, keyboard and screen reader users lose their place. When content is removed and focus was inside it, focus falls back to the document body, and the next Tab press starts from the top of the page.

### Modals

A modal dialog must move focus into itself when it opens, keep focus inside while it is open, close on Escape, and return focus to the element that opened it. Building that by hand means writing a focus trap, handling `inert` on the background, and managing scroll locking.

The native `<dialog>` element does most of it for you. `showModal()` makes the rest of the page inert, moves focus into the dialog, and closes it on Escape. You still own one detail: returning focus reliably and keeping React state in sync.

```tsx
import { useEffect, useId, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    returnFocusRef.current?.focus();
    // Escape closes the dialog natively; tell the parent so state stays in sync.
    if (open) onClose();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} onClose={handleClose}>
      <h2 id={titleId}>{title}</h2>
      {children}
      <button type="button" onClick={onClose}>
        Close
      </button>
    </dialog>
  );
}
```

The `close` event fires both when the parent sets `open` to `false` and when the user presses Escape, so one handler covers both paths. `useId` keeps the title association valid when several dialogs exist on one page.

### Route changes

In a server-rendered site, every navigation loads a new document, and screen readers announce the new page title. In a client-side router, the URL changes and the content swaps, but focus stays on the link that was clicked, which may no longer exist. Many screen readers announce nothing at all.

Move focus to the main heading after navigation, and update the document title:

```tsx
import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageHeadingProps {
  title: string;
  children: ReactNode;
}

export function PageHeading({ title, children }: PageHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [pathname, title]);

  return (
    <h1 ref={headingRef} tabIndex={-1}>
      {children}
    </h1>
  );
}
```

`tabIndex={-1}` makes the heading focusable by script without adding it to the Tab order. Skipping the first render matters: on initial load, the browser and the screen reader already handle the new document, and stealing focus would skip the user past the skip link and navigation.

### Toasts and inline updates

Toasts should not take focus. Moving focus to a notification interrupts whatever the user was doing and strands them in a region that will disappear in a few seconds. Announce toasts through a live region instead, covered below.

The exception is a toast that contains a required decision, such as "Undo delete". If the action matters, it does not belong in a toast that times out. Use a dialog, or keep the undo control in the page where the user can reach it.

## Keyboard navigation in custom components

Native elements come with keyboard behavior. A `<button>` responds to Enter and Space; a `<select>` responds to arrow keys and typeahead. When a team replaces them with custom components, the visual design usually survives and the keyboard contract usually does not.

The WAI-ARIA Authoring Practices Guide (APG) documents the expected keyboard behavior for each composite widget. Treat it as the specification, and treat the ARIA roles as a promise: if you add `role="tablist"`, users expect tab keyboard behavior.

### Tabs

Tabs use a roving `tabIndex`: only the selected tab is in the Tab order, and the arrow keys move between tabs. Tab then moves into the active panel.

```tsx
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

interface TabItem {
  label: string;
  content: ReactNode;
}

export function Tabs({ items }: { items: TabItem[] }) {
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const select = (index: number) => {
    setSelected(index);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = items.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div>
      <div role="tablist" aria-label="Project details" onKeyDown={onKeyDown}>
        {items.map((item, index) => (
          <button
            key={item.label}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === selected}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={index !== selected}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
```

Two details are easy to miss. In right-to-left layouts, ArrowRight and ArrowLeft should swap meaning, so read `document.dir` or pass the direction in. And if switching tabs triggers an expensive request, use manual activation: arrow keys move focus, and Enter or Space selects.

### Comboboxes

A combobox is the most commonly broken custom widget. The APG pattern keeps DOM focus on the input and uses `aria-activedescendant` to point at the highlighted option, with `aria-expanded` on the input and `aria-controls` referencing the listbox. Down Arrow opens the list, Enter selects, and Escape closes the list without clearing the input.

Getting every screen reader and browser combination right takes weeks of testing. Unless the combobox is your product, use a maintained, tested implementation such as React Aria, Downshift, or Radix, and spend your time on the states around it: loading results, no results, and errors.

### Date pickers

Before building a date picker, check whether `<input type="date">` meets the requirement. It gives you keyboard entry, localized formatting, and the platform's accessible calendar for free. A custom calendar grid needs arrow-key navigation by day and week, Page Up and Page Down by month, a labeled grid, and an announced selection. That is a lot of behavior to own for a field most users would rather type into.

## ARIA live regions: when to use them and when not to

A live region tells assistive technology to announce changes to its content without moving focus. It is the right tool for status messages: "Saved", "3 results", "Upload complete".

The most common bug is creating the live region at the same moment as the message. Screen readers watch regions that already exist in the document; a region inserted together with its text is often not announced. Render the region once, keep it empty, and change its text.

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

const AnnounceContext = createContext<(message: string) => void>(() => {});

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  const announce = useCallback((next: string) => {
    setMessage('');
    // Clearing first lets the same message be announced twice in a row.
    requestAnimationFrame(() => setMessage(next));
  }, []);

  return (
    <AnnounceContext.Provider value={announce}>
      {children}
      <div role="status" className="visually-hidden">
        {message}
      </div>
    </AnnounceContext.Provider>
  );
}

export const useAnnounce = () => useContext(AnnounceContext);
```

`role="status"` is a polite live region: it waits until the screen reader finishes the current sentence. The `visually-hidden` class must hide the text visually while keeping it in the accessibility tree, so use a clip-based utility, not `display: none`. A component then calls `announce('Changes saved')` after a successful save.

Equally important is knowing when not to use one:

- **Do not use `role="alert"` for routine messages.** Assertive announcements interrupt the user mid-sentence. Reserve them for errors that need immediate attention.
- **Do not put `aria-live` on large containers.** A live region wrapping a whole results list will read every changed row aloud.
- **Do not announce what focus already communicates.** If you move focus to a heading or an error summary, the screen reader reads it. Announcing it again duplicates the message.
- **Do not use live regions for form errors on submit.** Move focus to an error summary at the top of the form, with links to each invalid field. That gives users a list they can navigate, not a sentence they hear once.

## Screen reader testing workflow

You do not need to be an expert screen reader user to find the important bugs. You need a repeatable routine, run on the flows that matter, with the two pairings most users rely on.

### NVDA with Chrome on Windows

NVDA is free and widely used. Install it, open your app in Chrome, and turn on the Speech Viewer from the NVDA menu so you can read what is announced.

- Press Tab through the main flow and listen for each control's name, role, and state.
- Press H to move between headings in browse mode, and NVDA+F7 to open the elements list. The structure should make sense without the visuals.
- Trigger every dynamic change: open and close the modal, change the route, save the form, apply a filter. Confirm that each change is announced or that focus moves somewhere sensible.

### VoiceOver with Safari on macOS

VoiceOver ships with macOS. Toggle it with Command+F5. The VoiceOver modifier is Control+Option.

- Use VO+Right Arrow to move through content linearly.
- Open the rotor with VO+U to check headings, links, landmarks, and form controls.
- Repeat the same dynamic-change checks you ran with NVDA. Safari and Chrome expose the accessibility tree differently, so bugs often appear in only one pairing.

Write the flows down: sign in, search, complete the main form, recover from an error. Run them before each release, and add the keyboard parts to your end-to-end tests so they cannot silently regress. The [frontend code review checklist](/blog/frontend-code-review-checklist/) shows where keyboard and focus checks fit into a review, and the [accessible contact workflow](/work/accessible-contact-workflow/) case study applies the same thinking to labels, validation, and fallback contact paths.

## Practical audit checklist

Use this list on any React screen that changes without a page load:

- Focus moves into a modal when it opens and returns to the trigger when it closes.
- Escape closes every modal, popover, and menu.
- After a client-side route change, focus moves to the new page heading and the document title updates.
- Toasts never take focus, and any toast with an action has a non-expiring alternative.
- Every custom widget follows the APG keyboard pattern for its role.
- Only one tab in each tablist is in the Tab order, and arrow keys respect text direction.
- Comboboxes use a tested library or a fully tested `aria-activedescendant` implementation.
- Live regions exist in the document before their messages change.
- `role="alert"` is reserved for urgent errors.
- Form errors on submit move focus to an error summary with links to each field.
- Every dynamic change is checked with NVDA and Chrome, and with VoiceOver and Safari.
- Keyboard paths through critical flows are covered by end-to-end tests.

## Key takeaways

- Automated scanners check markup at one moment; most React accessibility bugs happen between moments.
- Every state change needs a decision about focus and about how it is announced.
- The native `<dialog>` element handles most modal behavior; you still own focus return and state sync.
- Custom widgets must implement the full keyboard contract their ARIA role promises, or use a tested library.
- Live regions must exist before their content changes, and most messages should be polite.
- Two screen reader pairings, NVDA with Chrome and VoiceOver with Safari, catch most real-world issues.
