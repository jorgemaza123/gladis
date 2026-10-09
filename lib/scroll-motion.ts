/** Enhances visible HTML; no content is hidden while waiting for JavaScript. */
export function observeScrollMotion(root: HTMLElement) {
  const revealSelector = '[data-reveal]';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = new WeakSet<HTMLElement>();
  const pending = new Set<HTMLElement>();
  const targetOwners = new Map<Element, HTMLElement>();
  const ownerTargets = new Map<HTMLElement, HTMLElement>();
  let intersection: IntersectionObserver | undefined;
  let mutations: MutationObserver | undefined;

  function targetFor(element: HTMLElement) {
    return element.dataset.reveal === 'service'
      ? element.querySelector<HTMLElement>('.service-visual') || element
      : element;
  }

  function unobserve(element: HTMLElement) {
    const target = ownerTargets.get(element);
    if (target) {
      intersection?.unobserve(target);
      targetOwners.delete(target);
      ownerTargets.delete(element);
    }
    pending.delete(element);
  }

  function arrive(element: HTMLElement, settle = false) {
    if (settle) element.dataset.motionSettled = 'true';
    element.classList.add('arrived');
    unobserve(element);
  }

  function observe(element: HTMLElement, target: HTMLElement) {
    pending.add(element);
    targetOwners.set(target, element);
    ownerTargets.set(element, target);
    intersection?.observe(target);
  }

  function registerElement(element: HTMLElement, resume = false) {
    if (seen.has(element) && !resume) return;
    seen.add(element);
    const target = targetFor(element);
    const bounds = target.getBoundingClientRect();
    // Already visible HTML must not move backwards or acquire a curtain during
    // late hydration. Only content still below the viewport receives an entrance.
    if (element.classList.contains('arrived') || bounds.top < window.innerHeight) {
      arrive(element, true);
    } else {
      observe(element, target);
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
    const affected = new Set<HTMLElement>();

    for (const record of records) {
      for (const node of record.removedNodes) {
        for (const element of collectRevealElements(node)) removed.add(element);
      }
      for (const node of record.addedNodes) {
        for (const element of collectRevealElements(node)) added.add(element);
      }
      if (record.target instanceof Element) {
        const owner = record.target.closest<HTMLElement>(revealSelector);
        if (owner && pending.has(owner)) affected.add(owner);
      }
    }

    // A move within the root appears as remove + add. Keep its observation alive.
    for (const element of removed) {
      if (root.contains(element) || !pending.has(element)) continue;
      unobserve(element);
      seen.delete(element);
    }
    for (const element of added) {
      if (root.contains(element)) registerElement(element);
    }
    // A replaced service visual may have no data-reveal attribute of its own.
    for (const element of affected) {
      if (!root.contains(element) || !pending.has(element)) continue;
      if (targetFor(element) === ownerTargets.get(element)) continue;
      unobserve(element);
      registerElement(element, true);
    }
  }

  function registerCurrent() {
    root
      .querySelectorAll<HTMLElement>(revealSelector)
      .forEach((element) => registerElement(element, seen.has(element)));
  }

  function focus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    let element = event.target.closest<HTMLElement>(revealSelector);
    while (element && root.contains(element)) {
      arrive(element, true);
      element = element.parentElement?.closest<HTMLElement>(revealSelector) || null;
    }
  }

  function stop() {
    intersection?.disconnect();
    mutations?.disconnect();
    intersection = undefined;
    mutations = undefined;
    pending.clear();
    targetOwners.clear();
    ownerTargets.clear();
    root.removeAttribute('data-scroll-motion');
  }

  function syncPreference() {
    stop();
    if (preference.matches || !('IntersectionObserver' in window)) return;
    intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = targetOwners.get(entry.target);
          if (
            !element || !pending.has(element) || !root.contains(element) ||
            !root.contains(entry.target) || !element.contains(entry.target)
          ) continue;
          // A tall illustration cannot reach 55% in a short landscape viewport.
          // Reuse the lower observed threshold there so its entrance can finish.
          const entranceRatio = element.dataset.reveal === 'service' &&
            entry.boundingClientRect.height * 0.55 <=
              (entry.rootBounds?.height ?? window.innerHeight) ? 0.55 : 0.18;
          if (entry.isIntersecting) {
            // Geometry belongs to the visual, not the potentially much taller
            // service article. A jump into it settles without a late entrance.
            if (
              element.matches(':focus-within') ||
              entry.boundingClientRect.top <= window.innerHeight * 0.2
            ) {
              arrive(element, true);
            } else if (
              entry.intersectionRatio >= entranceRatio
            ) {
              arrive(element);
            }
          } else if (entry.boundingClientRect.bottom <= 0) {
            // Settle a scene above the viewport when the observer reports it.
            arrive(element, true);
          }
        }
      },
      { threshold: [0.18, 0.55], rootMargin: '0px 0px -10% 0px' },
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
