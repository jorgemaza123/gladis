/** Enhances visible HTML; no content is hidden while waiting for JavaScript. */
export function observeScrollMotion(root: HTMLElement) {
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

  function register() {
    // Route/filter replacement must not leave detached cards retained by the observer.
    for (const element of pending) {
      if (!root.contains(element)) {
        intersection?.unobserve(element);
        pending.delete(element);
        seen.delete(element);
      }
    }
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      if (seen.has(element)) return;
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
    });
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
          if (!entry.isIntersecting || !root.contains(entry.target)) continue;
          const element = entry.target as HTMLElement;
          // A fast jump past a scene never replays motion behind the reader.
          arrive(
            element,
            entry.boundingClientRect.bottom <= 0 ||
              element.matches(':focus-within'),
          );
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    );
    root.dataset.scrollMotion = 'ready';
    // Re-register pending nodes after a live preference change.
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      if (!seen.has(element)) return;
      if (
        element.classList.contains('arrived') ||
        element.getBoundingClientRect().top < window.innerHeight * 0.92
      ) {
        arrive(element, true);
      } else observe(element);
    });
    register();
    if ('MutationObserver' in window) {
      mutations = new MutationObserver(register);
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
