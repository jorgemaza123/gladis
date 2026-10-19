export type MotionDevice = {
  width: number;
  height: number;
  breakpoint: 'desktop' | 'tablet' | 'mobile';
  pointer: 'fine' | 'coarse' | 'none';
  hover: boolean;
  reduced: boolean;
};

/** Viewport fractions: section top meets start; section bottom meets end. */
export type MotionRange = { start?: number; end?: number };
export type MotionSection = {
  element: HTMLElement;
  range?: MotionRange | ((device: MotionDevice) => MotionRange);
  onProgress?: (progress: number, device: MotionDevice) => void;
};

export function motionProgress(scroll: number, start: number, end: number) {
  return Math.max(0, Math.min(1, (scroll - start) / Math.max(1, end - start)));
}

function preserve(element: HTMLElement, attributes: string[]) {
  const values = attributes.map((name) => [name, element.getAttribute(name)] as const);
  return () => values.forEach(([name, value]) => {
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  });
}

/** One Home owner; no wheel/touch handling, animation clock or layout styling. */
export function createImmersiveMotion(root: HTMLElement, { debug = false } = {}) {
  const queries = {
    fine: window.matchMedia('(pointer: fine)'),
    coarse: window.matchMedia('(pointer: coarse)'),
    hover: window.matchMedia('(hover: hover)'),
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)'),
  };
  const features = {
    scrollTimeline: (window.CSS?.supports('animation-timeline', 'scroll()') &&
      window.CSS.supports('scroll-timeline-name', '--motion')) ?? false,
    viewTimeline: (window.CSS?.supports('animation-timeline', 'view()') &&
      window.CSS.supports('view-timeline-name', '--motion')) ?? false,
  };
  const readDevice = (): MotionDevice => ({
    width: window.innerWidth,
    height: window.innerHeight,
    breakpoint: window.innerWidth >= 961 ? 'desktop' : window.innerWidth > 760 ? 'tablet' : 'mobile',
    pointer: queries.fine.matches ? 'fine' : queries.coarse.matches ? 'coarse' : 'none',
    hover: queries.hover.matches,
    reduced: queries.reduced.matches,
  });
  let device = readDevice();
  type Section = MotionSection & {
    start: number;
    end: number;
    top: number;
    bottom: number;
    progress: number;
    active: boolean;
    focused: boolean;
    anchor: boolean;
    restore: () => void;
  };
  const sections = new Map<HTMLElement, Section>();
  const restoreRoot = preserve(root, ['data-motion-device', 'data-motion-status', 'data-motion-debug']);
  let intersection: IntersectionObserver | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let frame = 0;
  let epoch = 0;
  let dirty = false;
  let listening = false;
  let mounted = false;
  let disposed = false;
  const stats = { frames: 0, measurements: 0, writes: 0, samples: [] as number[] };
  const canRun = () => !disposed && !device.reduced && document.visibilityState === 'visible';

  function snapshot() {
    const sorted = [...stats.samples].sort((a, b) => a - b);
    return {
      device,
      features,
      status: device.reduced ? 'reduced' : document.visibilityState === 'visible' ? 'ready' : 'paused',
      pendingFrames: frame ? 1 : 0,
      scrollListener: listening,
      sections: [...sections.values()].map((section) => ({
        id: section.element.dataset.motionSection || section.element.id || section.element.className,
        progress: Number(Math.max(0, section.progress).toFixed(4)),
        active: section.active,
        settled: section.focused ? 'focus' : section.anchor ? 'anchor' : null,
      })),
      ...(debug ? { stats: {
        frames: stats.frames,
        measurements: stats.measurements,
        writes: stats.writes,
        samples: sorted.length,
        p95ms: sorted[Math.max(0, Math.ceil(sorted.length * 0.95) - 1)] ?? 0,
      } } : {}),
    };
  }

  function publish() {
    root.dataset.motionDevice = device.breakpoint;
    root.dataset.motionStatus = device.reduced ? 'reduced' : canRun() ? 'ready' : 'paused';
    if (debug) root.dataset.motionDebug = JSON.stringify(snapshot());
  }

  function write(section: Section, progress: number) {
    const value = device.reduced ? 1 : Math.max(0, Math.min(1, progress));
    const state = device.reduced ? 'reduced' : section.active ? 'active' : 'idle';
    if (section.element.dataset.motionState !== state) section.element.dataset.motionState = state;
    if (section.focused || section.anchor || device.reduced) {
      const settled = section.focused ? 'focus' : section.anchor ? 'anchor' : 'reduced';
      if (section.element.dataset.motionSafe !== settled) section.element.dataset.motionSafe = settled;
    } else if (section.element.hasAttribute('data-motion-safe')) {
      section.element.removeAttribute('data-motion-safe');
    }
    if (section.progress !== value) {
      section.progress = value;
      section.element.style.setProperty('--motion-progress', value.toFixed(5));
      if (debug) stats.writes++;
      section.onProgress?.(value, device);
    }
  }

  function measure() {
    // Structural reads are batched before any CSS-variable writes, never per scroll frame.
    const scroll = window.scrollY;
    for (const section of sections.values()) {
      const rect = section.element.getBoundingClientRect();
      const range = typeof section.range === 'function' ? section.range(device) : section.range;
      section.top = rect.top + scroll;
      section.bottom = section.top + rect.height;
      section.start = section.top - device.height * (range?.start ?? 1);
      section.end = section.bottom - device.height * (range?.end ?? 0);
      if (debug) stats.measurements++;
    }
    dirty = false;
  }

  function update(reconcile = false) {
    const scroll = window.scrollY;
    for (const section of sections.values()) {
      if (!reconcile && intersection && !section.active) continue;
      section.active = section.bottom >= scroll - 200 && section.top <= scroll + device.height + 200;
      write(section, motionProgress(scroll, section.start, section.end));
    }
    syncScrollListener();
  }

  function requestUpdate() {
    if (!canRun() || frame || !sections.size) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      if (!canRun()) return;
      const started = debug ? window.performance.now() : 0;
      const reconcile = dirty;
      if (dirty) measure();
      update(reconcile);
      if (debug) {
        stats.frames++;
        stats.samples.push(window.performance.now() - started);
        if (stats.samples.length > 128) stats.samples.shift();
      }
      publish();
    });
  }

  function onScroll() {
    for (const section of sections.values()) section.anchor = false;
    // Older browsers without IO gate the same cached geometry without layout reads.
    if (!intersection) {
      const scroll = window.scrollY;
      const nearby = [...sections.values()].some((section) =>
        section.bottom >= scroll - 200 && section.top <= scroll + device.height + 200);
      if (!nearby) {
        for (const section of sections.values()) {
          section.active = false;
          write(section, motionProgress(scroll, section.start, section.end));
        }
        publish();
        return;
      }
    }
    requestUpdate();
  }

  function syncScrollListener() {
    const needed = canRun() && sections.size > 0 &&
      (!intersection || [...sections.values()].some((section) => section.active));
    if (needed === listening) return;
    listening = needed;
    if (needed) window.addEventListener('scroll', onScroll, { passive: true });
    else window.removeEventListener('scroll', onScroll);
  }

  function stopSensors() {
    epoch++;
    intersection?.disconnect();
    resizeObserver?.disconnect();
    intersection = undefined;
    resizeObserver = undefined;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener('scroll', onScroll);
    listening = false;
    for (const section of sections.values()) section.active = false;
  }

  function refresh() {
    dirty = true;
    requestUpdate();
  }

  function restart() {
    stopSensors();
    device = readDevice();
    if (canRun() && sections.size) {
      measure();
      if ('IntersectionObserver' in window) {
        const currentEpoch = epoch;
        intersection = new IntersectionObserver((entries) => {
          if (epoch !== currentEpoch || !canRun()) return;
          for (const entry of entries) {
            const section = sections.get(entry.target as HTMLElement);
            if (!section) continue;
            section.active = entry.isIntersecting;
            // A fast jump can skip a whole chapter. Set its endpoint immediately.
            write(section, motionProgress(window.scrollY, section.start, section.end));
          }
          syncScrollListener();
          if (entries.some((entry) => entry.isIntersecting)) requestUpdate();
          publish();
        }, { rootMargin: '200px 0px', threshold: 0 });
        for (const section of sections.values()) intersection.observe(section.element);
      }
      if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(refresh);
        resizeObserver.observe(root);
        for (const section of sections.values()) resizeObserver.observe(section.element);
      }
      update(true);
    } else if (device.reduced) {
      for (const section of sections.values()) write(section, 1);
    }
    publish();
  }

  function onResize() {
    const next = readDevice();
    if (next.breakpoint !== device.breakpoint) restart();
    else {
      device = next;
      refresh();
      publish();
    }
  }

  function settle(target: EventTarget | null, anchor = false) {
    const targetElement = target instanceof Element ? target : null;
    for (const section of sections.values()) {
      if (anchor) section.anchor = section.element.contains(targetElement);
      else section.focused = section.element.contains(targetElement);
      write(section, section.progress);
    }
    requestUpdate();
    publish();
  }

  function onFocus(event: FocusEvent) { settle(event.target); }
  function onBlur(event: FocusEvent) { settle(event.relatedTarget); }
  function onHash() {
    let id: string;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!id) return;
    settle(document.getElementById(id), true);
  }

  function mount() {
    if (mounted) return;
    mounted = true;
    for (const query of Object.values(queries)) query.addEventListener('change', restart);
    window.addEventListener('resize', onResize);
    window.addEventListener('hashchange', onHash);
    document.addEventListener('visibilitychange', restart);
    root.addEventListener('focusin', onFocus);
    root.addEventListener('focusout', onBlur);
    root.addEventListener('toggle', refresh, true);
  }

  function unmount() {
    stopSensors();
    for (const query of Object.values(queries)) query.removeEventListener('change', restart);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('hashchange', onHash);
    document.removeEventListener('visibilitychange', restart);
    root.removeEventListener('focusin', onFocus);
    root.removeEventListener('focusout', onBlur);
    root.removeEventListener('toggle', refresh, true);
    mounted = false;
    restoreRoot();
  }

  function register(config: MotionSection) {
    if (disposed) throw new Error('Motion controller has been destroyed');
    if (!root.contains(config.element) || sections.has(config.element)) {
      throw new Error('Motion section must be unique and inside its Home root');
    }
    const { element } = config;
    const restoreAttributes = preserve(element, ['data-motion-section', 'data-motion-state', 'data-motion-safe']);
    const oldProgress = element.style.getPropertyValue('--motion-progress');
    const oldPriority = element.style.getPropertyPriority('--motion-progress');
    if (!element.hasAttribute('data-motion-section')) {
      element.dataset.motionSection = element.id || `section-${sections.size + 1}`;
    }
    sections.set(element, {
      ...config, start: 0, end: 1, top: 0, bottom: 0, progress: -1, active: false,
      focused: element.contains(document.activeElement), anchor: false,
      restore: () => {
        restoreAttributes();
        if (oldProgress) element.style.setProperty('--motion-progress', oldProgress, oldPriority);
        else element.style.removeProperty('--motion-progress');
      },
    });
    mount();
    restart();
    onHash();
    let registered = true;
    return () => {
      if (!registered || disposed) return;
      registered = false;
      sections.get(element)?.restore();
      sections.delete(element);
      if (sections.size) restart();
      else unmount();
    };
  }

  return {
    register,
    refresh,
    snapshot,
    destroy() {
      if (disposed) return;
      disposed = true;
      unmount();
      for (const section of sections.values()) section.restore();
      sections.clear();
    },
  };
}
