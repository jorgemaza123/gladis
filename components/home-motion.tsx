'use client';

import { useEffect } from 'react';
import '@/app/immersive-motion.css';
import '@/app/company-motion.css';
import '@/app/process-motion.css';

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
    const processSection = root.querySelector<HTMLElement>('#como-cotizar');

    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([import('@/lib/immersive-motion'), import('@/lib/c4-motion'), import('@/lib/occasion-motion'), import('@/lib/company-motion'), import('@/lib/process-motion')]).then(([{ createImmersiveMotion }, { c4MotionRange }, { occasionMotionRange, occasionVisualPhase }, { companyMotionRange }, { processMotionRange, processVisualPhase }]) => {
      if (disposed) return;
      const controller = createImmersiveMotion(root, { debug });
      const previousPhase = occasions?.getAttribute('data-occasion-phase');
      const previousProcessPhase = processSection?.getAttribute('data-process-phase');
      cleanup = () => {
        controller.destroy();
        if (occasions) {
          if (previousPhase == null) occasions.removeAttribute('data-occasion-phase');
          else occasions.setAttribute('data-occasion-phase', previousPhase);
        }
        if (processSection) {
          if (previousProcessPhase == null) processSection.removeAttribute('data-process-phase');
          else processSection.setAttribute('data-process-phase', previousProcessPhase);
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
      const markers = processSection?.querySelectorAll<HTMLElement>('.conversation-steps li > span');
      if (processSection && markers?.length === 3) controller.register({
        element: processSection,
        range: (device) => {
          // Stable marker geometry, batched with the shared controller's resize pass.
          const top = processSection.getBoundingClientRect().top;
          return processMotionRange({
            height: processSection.offsetHeight,
            firstTop: markers[0].getBoundingClientRect().top - top,
            lastTop: markers[2].getBoundingClientRect().top - top,
          }, device);
        },
        onProgress: (progress) => {
          const phase = processVisualPhase(progress);
          if (processSection.dataset.processPhase !== phase) processSection.dataset.processPhase = phase;
        },
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
