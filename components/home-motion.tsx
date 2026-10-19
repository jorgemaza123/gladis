'use client';

import { useEffect } from 'react';
import '@/app/immersive-motion.css';

export function HomeMotion() {
  useEffect(() => {
    const root = document.getElementById('contenido');
    if (!root) return;
    const debug = process.env.NODE_ENV !== 'production' &&
      new URLSearchParams(window.location.search).get('motionDebug') === '1';
    const section = root.querySelector<HTMLElement>('#completa-tu-evento');
    if (!section) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([import('@/lib/immersive-motion'), import('@/lib/c4-motion')]).then(([{ createImmersiveMotion }, { c4MotionRange }]) => {
      if (disposed) return;
      const controller = createImmersiveMotion(root, { debug });
      cleanup = () => controller.destroy();
      controller.register({
        element: section,
        // Structural read only during the controller's batched geometry pass.
        range: (device) => c4MotionRange(section.offsetHeight, device),
      });
    }).catch(() => {
      cleanup?.();
      // The server-rendered directory and its static rule remain usable.
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);
  return null;
}
