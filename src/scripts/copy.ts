/**
 * Wires every `[data-copy-value]` button to a react-smart-copy state machine.
 * The library owns clipboard access, error classification, retries, and the
 * auto-reset to idle; this file only maps its states onto the DOM.
 */
import {
  createCopyCoordinator,
  createCopyMachine,
  type CopyState,
} from 'react-smart-copy/core';

// One "Copied" at a time across the page, like the library's <CopyGroup>.
const coordinator = createCopyCoordinator();

const announce = (region: HTMLElement | null, message: string) => {
  if (!region) return;
  // Clear first so repeating the same message is announced again.
  region.textContent = '';
  window.requestAnimationFrame(() => {
    region.textContent = message;
  });
};

function wire(button: HTMLButtonElement) {
  const region =
    button.parentElement?.querySelector<HTMLElement>('[data-copy-status]') ??
    null;
  const machine = createCopyMachine({ resetAfterMs: 2000, coordinator });
  machine.connect();

  let previous: CopyState['status'] = 'idle';
  machine.subscribe(() => {
    const { status } = machine.getSnapshot();
    // "copying" lasts a few milliseconds; keep the idle label to avoid flicker.
    button.dataset.state = status === 'copying' ? previous : status;
    if (status === previous) return;
    if (status === 'copied') {
      announce(region, button.dataset.announceCopied ?? '');
    } else if (status === 'error') {
      announce(region, button.dataset.announceFailed ?? '');
    }
    if (status !== 'copying') previous = status;
  });

  button.addEventListener('click', () => {
    const state = machine.getSnapshot();
    void (state.status === 'error'
      ? machine.retry()
      : machine.copy(button.dataset.copyValue ?? ''));
  });
  button.hidden = false;
}

document
  .querySelectorAll<HTMLButtonElement>('button[data-copy-value]')
  .forEach(wire);
