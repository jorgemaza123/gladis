/** Enhances visible HTML; no content is hidden while waiting for JavaScript. */
export function observeScrollMotion(root: HTMLElement) {
  const revealSelector = '[data-reveal]';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet<HTMLElement>();
  const pending = new Set<HTMLElement>();
  let intersection: IntersectionObserver | undefined;
  let mutations: MutationObserver | undefined;

  function arrive(element: HTMLElement, settle = false) {
    if (settle) element.dataset.motionSettled = 'true';
    element.classList.add('arrived');
    intersection?.unobserve(element);
    pending.delete(element);
  }

  function observe(element: HTMLElement) {
    pending.add(element);
    intersection?.observe(element);
  }

  function registerElement(element: HTMLElement, resume = false) {
    if (seen.has(element) && !resume) return;
    seen.add(element);
    const bounds = element.getBoundingClientRect();
    // Restored scroll positions and in-view route updates stay immediately readable.
    if (
      element.classList.contains('arrived') ||
      bounds.top < window.innerHeight * 0.92
    ) {
      arrive(element, true);
    } else {
      observe(element);
    }
  }

  function collectRevealElements(node: Node) {
    if (!(node instanceof Element)) return [];
    const elements: HTMLElement[] = [];
    if (node.matches(revealSelector)) elements.push(node as HTMLElement);
    node
      .querySelectorAll<HTMLElement>(revealSelector)
      .forEach((element) => elements.push(element));
    return elements;
  }

  function updateMutations(records: MutationRecord[]) {
    const removed = new Set<HTMLElement>();
    const added = new Set<HTMLElement>();

    for (const record of records) {
      for (const node of record.removedNodes) {
        for (const element of collectRevealElements(node)) removed.add(element);
      }
      for (const node of record.addedNodes) {
        for (const element of collectRevealElements(node)) added.add(element);
      }
    }

    // A move within the root appears as remove + add. Keep those observations alive.
    for (const element of removed) {
      if (root.contains(element) || !pending.has(element)) continue;
      intersection?.unobserve(element);
      pending.delete(element);
      seen.delete(element);
    }
    for (const element of added) {
      if (root.contains(element)) registerElement(element);
    }
  }

  function registerCurrent() {
    root
      .querySelectorAll<HTMLElement>(revealSelector)
      .forEach((element) => registerElement(element, seen.has(element)));
  }

  function focus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    let element = event.target.closest<HTMLElement>('[data-reveal]');
    while (element && root.contains(element)) {
      arrive(element, true);
      element =
        element.parentElement?.closest<HTMLElement>('[data-reveal]') || null;
    }
  }

  function stop() {
    intersection?.disconnect();
    mutations?.disconnect();
    intersection = undefined;
    mutations = undefined;
    pending.clear();
    root.removeAttribute('data-scroll-motion');
  }

  function syncPreference() {
    stop();
    if (preference.matches || !('IntersectionObserver' in window)) return;
    intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!root.contains(entry.target)) continue;
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            arrive(element, element.matches(':focus-within'));
          } else if (entry.boundingClientRect.bottom <= 0) {
            // A fast jump can cross the whole scene without ever intersecting it.
            arrive(element, true);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );
    root.dataset.scrollMotion = 'ready';
    // This full scan runs only at startup or after a live preference change.
    registerCurrent();
    if ('MutationObserver' in window) {
      mutations = new MutationObserver(updateMutations);
      mutations.observe(root, { childList: true, subtree: true });
    }
  }

  root.addEventListener('focusin', focus);
  preference.addEventListener('change', syncPreference);
  syncPreference();
  return () => {
    stop();
    root.removeEventListener('focusin', focus);
    preference.removeEventListener('change', syncPreference);
  };
}
