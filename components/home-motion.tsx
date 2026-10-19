'use client';

import { useEffect } from 'react';
import '@/app/immersive-motion.css';

export function HomeMotion() {
  useEffect(() => {
    const root = document.getElementById('contenido');
    if (!root) return;
    const debug = process.env.NODE_ENV !== 'production' &&
      new URLSearchParams(window.location.search).get('motionDebug') === '1';
    const sections = debug
      ? [...root.querySelectorAll<HTMLElement>('#completa-tu-evento, #ocasiones, .company-gateway, #como-cotizar, .mesa-invitation')]
      : [...root.querySelectorAll<HTMLElement>('[data-motion-section]')];
    if (!sections.length) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import('@/lib/immersive-motion').then(({ createImmersiveMotion }) => {
      if (disposed) return;
      const controller = createImmersiveMotion(root, { debug });
      cleanup = () => controller.destroy();
      for (const element of sections) controller.register({ element });
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);
  return null;
}
