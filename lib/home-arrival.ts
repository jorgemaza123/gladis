/** A single page-load entrance. Any navigation intent takes precedence. */
export function observeHomeArrival(header: HTMLElement, enabled: boolean) {
  const page = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (page.dataset.homeArrival === 'complete') return () => {};

  let settled = false;
  let fallback: ReturnType<typeof setTimeout> | undefined;
  const finish = () => {
    if (settled) return;
    settled = true;
    page.dataset.homeArrival = 'complete';
    clearTimeout(fallback);
    fallback = undefined;
    header.removeEventListener('animationend', onEnd);
    window.removeEventListener('scroll', finish);
    window.removeEventListener('wheel', finish);
    window.removeEventListener('touchmove', finish);
    window.removeEventListener('keydown', finish);
    document.removeEventListener('focusin', finish);
    document.removeEventListener('visibilitychange', onVisibility);
    reduced.removeEventListener('change', onPreference);
  };
  const onEnd = (event: AnimationEvent) => {
    if (event.target === header && event.animationName === 'home-navbar-arrive') finish();
  };
  const onVisibility = () => { if (document.hidden) finish(); };
  const onPreference = () => { if (reduced.matches) finish(); };

  const alreadyFocused = document.activeElement && document.activeElement !== document.body;
  if (!enabled || reduced.matches || document.hidden || alreadyFocused || window.scrollY > 4 || window.location.hash) {
    finish();
    return finish;
  }

  page.dataset.homeArrival = 'playing';
  header.addEventListener('animationend', onEnd);
  window.addEventListener('scroll', finish, { passive: true });
  window.addEventListener('wheel', finish, { passive: true });
  window.addEventListener('touchmove', finish, { passive: true });
  window.addEventListener('keydown', finish);
  document.addEventListener('focusin', finish);
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', onPreference);
  // CSS can finish before hydration. This bounds listener lifetime in that case.
  fallback = setTimeout(finish, 3000);
  return finish;
}
