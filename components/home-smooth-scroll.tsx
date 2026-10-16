'use client';

import { useEffect } from 'react';
import 'lenis/dist/lenis.css';

const DESKTOP_FINE_POINTER_QUERY = '(min-width: 961px) and (hover: hover) and (pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function HomeSmoothScroll() {
  useEffect(() => {
    const forceNative = new URLSearchParams(window.location.search).get('scroll') === 'native';
    const desktopFinePointer = window.matchMedia(DESKTOP_FINE_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    let disposed = false;
    let revision = 0;
    let instance: import('lenis').default | undefined;

    const destroy = () => {
      revision += 1;
      instance?.destroy();
      instance = undefined;
    };

    const sync = async () => {
      destroy();

      if (forceNative || reducedMotion.matches || !desktopFinePointer.matches) {
        return;
      }

      const currentRevision = revision;
      const { default: Lenis } = await import('lenis');
      if (
        disposed
        || currentRevision !== revision
        || reducedMotion.matches
        || !desktopFinePointer.matches
      ) {
        return;
      }

      instance = new Lenis({
        anchors: true,
        autoRaf: true,
        autoResize: true,
        lerp: 0.14,
        overscroll: true,
        respectReducedMotion: true,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        syncTouch: false,
        wheelMultiplier: 1,
        prevent: (node) => Boolean(
          node.closest('[role="dialog"], [data-lenis-prevent], .mobile-menu'),
        ),
      });
    };

    desktopFinePointer.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);
    void sync();

    return () => {
      disposed = true;
      destroy();
      desktopFinePointer.removeEventListener('change', sync);
      reducedMotion.removeEventListener('change', sync);
    };
  }, []);

  return null;
}
