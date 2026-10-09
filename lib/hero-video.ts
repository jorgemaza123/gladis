export type HeroVideoState = {
  ready: boolean;
  active: boolean;
  allowed: boolean;
};

type DataConnection = EventTarget & { saveData?: boolean };

/** Sources stay absent until visibility and visitor preferences permit playback. */
export function observeHeroVideo(
  root: HTMLElement,
  media: HTMLVideoElement,
  sources: { mobile: string; desktop: string },
  onState: (state: HeroVideoState) => void,
) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: DataConnection })
    .connection;
  const source = window.matchMedia('(max-width: 760px)').matches
    ? sources.mobile
    : sources.desktop;
  let inViewport = false;
  let optedIn = false;
  let userPaused = false;
  let blocked = false;
  let pending = false;
  let attached = false;
  let disposed = false;
  let request = 0;
  let saveData = Boolean(connection?.saveData);
  let state: HeroVideoState = { ready: false, active: false, allowed: false };

  const update = (next: Partial<HeroVideoState>) => {
    if (
      disposed ||
      Object.entries(next).every(
        ([key, value]) => state[key as keyof HeroVideoState] === value,
      )
    )
      return;
    state = { ...state, ...next };
    onState(state);
  };
  const allowed = () => optedIn || (!reduced.matches && !saveData);
  const shouldPlay = () =>
    allowed() && inViewport && !document.hidden && !userPaused && !blocked;
  const pause = () => {
    request++;
    pending = false;
    media.pause();
    update({ active: false });
  };
  const sync = () => {
    update({ allowed: allowed() });
    if (!shouldPlay()) {
      pause();
      if (!allowed() && attached) {
        media.removeAttribute('src');
        media.load();
        attached = false;
        update({ ready: false });
      }
      return;
    }
    if (!attached) {
      // Select one rendition, avoiding both mobile and desktop downloads.
      media.src = source;
      media.load();
      attached = true;
    }
    if (pending || !media.paused) return;
    const currentRequest = ++request;
    pending = true;
    update({ active: true });
    void media
      .play()
      .then(() => {
        if (disposed || currentRequest !== request) return;
        pending = false;
        if (!shouldPlay()) pause();
      })
      .catch(() => {
        if (disposed || currentRequest !== request) return;
        pending = false;
        blocked = true;
        update({ active: false });
      });
  };
  const onReady = () => {
    update({ ready: true });
    sync();
  };
  const onPlaying = () => {
    if (shouldPlay()) update({ active: true, ready: true });
    else pause();
  };
  const onPause = () => update({ active: false });
  const onError = () => {
    blocked = true;
    pause();
    update({ ready: false });
  };
  const onPreference = () => {
    if (reduced.matches) optedIn = false;
    sync();
  };
  const onConnection = () => {
    const nextSaveData = Boolean(connection?.saveData);
    if (nextSaveData && !saveData) optedIn = false;
    saveData = nextSaveData;
    sync();
  };
  const observer =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          ([entry]) => {
            inViewport =
              entry.isIntersecting && entry.intersectionRatio >= 0.12;
            sync();
          },
          { threshold: 0.12 },
        )
      : undefined;
  media.muted = true;
  media.addEventListener('canplay', onReady);
  media.addEventListener('playing', onPlaying);
  media.addEventListener('pause', onPause);
  media.addEventListener('error', onError);
  reduced.addEventListener('change', onPreference);
  connection?.addEventListener('change', onConnection);
  document.addEventListener('visibilitychange', sync);
  if (observer) observer.observe(root);
  else
    inViewport =
      root.getBoundingClientRect().bottom > 0 &&
      root.getBoundingClientRect().top < window.innerHeight;
  sync();

  return {
    toggle() {
      if (state.active) {
        userPaused = true;
        pause();
      } else {
        optedIn = true;
        userPaused = false;
        blocked = false;
        sync();
      }
    },
    dispose() {
      disposed = true;
      media.removeEventListener('canplay', onReady);
      media.removeEventListener('playing', onPlaying);
      media.removeEventListener('pause', onPause);
      media.removeEventListener('error', onError);
      reduced.removeEventListener('change', onPreference);
      connection?.removeEventListener('change', onConnection);
      document.removeEventListener('visibilitychange', sync);
      observer?.disconnect();
      pause();
      media.removeAttribute('src');
      media.load();
    },
  };
}
