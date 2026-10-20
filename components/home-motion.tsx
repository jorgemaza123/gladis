'use client';

import { useEffect } from 'react';
import '@/app/immersive-motion.css';
import '@/app/company-motion.css';

export function HomeMotion() {
  useEffect(() => {
    const root = document.getElementById('contenido');
    if (!root) return;
    const debug = process.env.NODE_ENV !== 'production' &&
      new URLSearchParams(window.location.search).get('motionDebug') === '1';
    const section = root.querySelector<HTMLElement>('#completa-tu-evento');
    if (!section) return;
    const occasions = root.querySelector<HTMLElement>('#ocasiones');
    const company = root.querySelector<HTMLElement>('.company-gateway');

    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([import('@/lib/immersive-motion'), import('@/lib/c4-motion'), import('@/lib/occasion-motion'), import('@/lib/company-motion')]).then(([{ createImmersiveMotion }, { c4MotionRange }, { occasionMotionRange, occasionVisualPhase }, { companyMotionRange }]) => {
      if (disposed) return;
      const controller = createImmersiveMotion(root, { debug });
      const previousPhase = occasions?.getAttribute('data-occasion-phase');
      cleanup = () => {
        controller.destroy();
        if (occasions) {
          if (previousPhase == null) occasions.removeAttribute('data-occasion-phase');
          else occasions.setAttribute('data-occasion-phase', previousPhase);
        }
      };
      controller.register({
        element: section,
        // Structural read only during the controller's batched geometry pass.
        range: (device) => c4MotionRange(section.offsetHeight, device),
      });
      const layout = occasions?.querySelector<HTMLElement>('.occasion-prototype-layout');
      const stage = occasions?.querySelector<HTMLElement>('.occasion-stage');
      if (occasions && layout && stage) controller.register({
        element: occasions,
        range: (device) => occasionMotionRange({
          height: occasions.offsetHeight,
          layoutTop: layout.offsetTop,
          layoutHeight: layout.offsetHeight,
          stageHeight: stage.offsetHeight,
        }, device),
        onProgress: (progress) => {
          const phase = occasionVisualPhase(progress);
          if (occasions.dataset.occasionPhase !== phase) occasions.dataset.occasionPhase = phase;
        },
      });
      if (company) controller.register({
        element: company,
        range: (device) => companyMotionRange(company.offsetHeight, device),
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
