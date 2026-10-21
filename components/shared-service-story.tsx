'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { homeServiceScenes, type HomeSceneLayer } from '@/data/home-service-scenes';

type SharedSceneKey =
  | 'cocina'
  | 'bartender'
  | 'menaje'
  | 'atencion'
  | 'personalizados'
  | 'flores';

function StageLayer({ layer, variant }: { layer: HomeSceneLayer; variant?: string }) {
  return (
    <picture className={`shared-service-layer ${variant ?? `shared-service-layer--${layer.name}`}`}>
      <source media="(max-width: 760px)" srcSet={layer.mobile} />
      <img
        src={layer.desktop}
        width={layer.width}
        height={layer.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
}

export function SharedServiceStory({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeScene, setActiveScene] = useState<SharedSceneKey>('cocina');
  const scenes = homeServiceScenes.slice(0, 6);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return;

    const desktop = window.matchMedia('(min-width: 961px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let tracking = false;

    const stopTracking = () => {
      if (!tracking) return;
      tracking = false;
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActiveScene?.();
      });
    };

    let updateActiveScene: (() => void) | undefined;

    const stop = () => {
      observer?.disconnect();
      observer = undefined;
      stopTracking();
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      updateActiveScene = undefined;
    };

    const start = () => {
      stop();
      if (!desktop.matches || reducedMotion.matches) {
        setActiveScene('cocina');
        return;
      }

      const bartenderPanel = root.querySelector<HTMLElement>(
        '[data-shared-panel="bartender"]',
      );
      const menajePanel = root.querySelector<HTMLElement>('[data-shared-panel="menaje"]');
      const atencionPanel = root.querySelector<HTMLElement>(
        '[data-shared-panel="atencion"]',
      );
      const personalizadosPanel = root.querySelector<HTMLElement>(
        '[data-shared-panel="personalizados"]',
      );
      const floresPanel = root.querySelector<HTMLElement>('[data-shared-panel="flores"]');
      if (
        !bartenderPanel ||
        !menajePanel ||
        !atencionPanel ||
        !personalizadosPanel ||
        !floresPanel
      ) return;

      const bartenderAnchorMargin = Number.parseFloat(window.getComputedStyle(bartenderPanel).scrollMarginTop);
      const menajeAnchorMargin = Number.parseFloat(window.getComputedStyle(menajePanel).scrollMarginTop);

      updateActiveScene = () => {
        const bartenderTop = bartenderPanel.getBoundingClientRect().top;
        const menajeTop = menajePanel.getBoundingClientRect().top;
        const atencionTop = atencionPanel.getBoundingClientRect().top;
        const personalizadosTop = personalizadosPanel.getBoundingClientRect().top;
        const floresTop = floresPanel.getBoundingClientRect().top;
        const enterAt = window.innerHeight * 0.08;
        const attentionEnterAt = window.innerHeight * 0.22;
        const personalizadosEnterAt = window.innerHeight * 0.22;
        const floresEnterAt = window.innerHeight * 0.22;
        const returnAt = window.innerHeight * 0.32;
        // Flores keeps the visual stage until the previous panel occupies almost
        // half the viewport. This prevents Personalizados from returning while
        // the Flores copy is still clearly dominant.
        const floresReturnAt = window.innerHeight * 0.48;

        setActiveScene((current) => {
          const changeScene = (next: SharedSceneKey) => {
            if (next !== current) root.dataset.transitionFrom = current;
            return next;
          };

          // A matching hash settles its landing point; normal hysteresis applies outside it.
          if (
            window.location.hash === '#servicio-bartender' &&
            Math.abs(bartenderTop - bartenderAnchorMargin) <= 2
          ) return changeScene('bartender');
          if (
            window.location.hash === '#servicio-menaje' &&
            Math.abs(menajeTop - menajeAnchorMargin) <= 2
          ) return changeScene('menaje');

          if (current === 'cocina') {
            if (floresTop <= floresEnterAt) return changeScene('flores');
            if (personalizadosTop <= personalizadosEnterAt) return changeScene('personalizados');
            if (atencionTop <= attentionEnterAt) return changeScene('atencion');
            if (menajeTop <= enterAt) return changeScene('menaje');
            if (bartenderTop <= enterAt) return changeScene('bartender');
          }

          if (current === 'bartender') {
            if (floresTop <= floresEnterAt) return changeScene('flores');
            if (personalizadosTop <= personalizadosEnterAt) return changeScene('personalizados');
            if (atencionTop <= attentionEnterAt) return changeScene('atencion');
            if (menajeTop <= enterAt) return changeScene('menaje');
            if (bartenderTop >= returnAt) return changeScene('cocina');
          }

          if (current === 'menaje') {
            if (floresTop <= floresEnterAt) return changeScene('flores');
            if (personalizadosTop <= personalizadosEnterAt) return changeScene('personalizados');
            if (atencionTop <= attentionEnterAt) return changeScene('atencion');
            if (bartenderTop >= returnAt) return changeScene('cocina');
            if (menajeTop >= returnAt) return changeScene('bartender');
          }

          if (current === 'atencion') {
            if (floresTop <= floresEnterAt) return changeScene('flores');
            if (personalizadosTop <= personalizadosEnterAt) return changeScene('personalizados');
            if (bartenderTop >= returnAt) return changeScene('cocina');
            if (menajeTop >= returnAt) return changeScene('bartender');
            if (atencionTop >= returnAt) return changeScene('menaje');
          }

          if (current === 'personalizados') {
            if (floresTop <= floresEnterAt) return changeScene('flores');
            if (bartenderTop >= returnAt) return changeScene('cocina');
            if (menajeTop >= returnAt) return changeScene('bartender');
            if (atencionTop >= returnAt) return changeScene('menaje');
            if (personalizadosTop >= returnAt) return changeScene('atencion');
          }

          if (current === 'flores') {
            if (bartenderTop >= returnAt) return changeScene('cocina');
            if (menajeTop >= returnAt) return changeScene('bartender');
            if (atencionTop >= returnAt) return changeScene('menaje');
            if (personalizadosTop >= returnAt) return changeScene('atencion');
            if (floresTop >= floresReturnAt) return changeScene('personalizados');
          }

          return current;
        });
      };

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            if (!tracking) {
              tracking = true;
              window.addEventListener('scroll', requestUpdate, { passive: true });
              window.addEventListener('resize', requestUpdate);
            }
            requestUpdate();
          } else {
            requestUpdate();
            stopTracking();
          }
        },
        {
          rootMargin: '160px 0px',
          threshold: 0,
        },
      );
      observer.observe(root);
      updateActiveScene();
    };

    start();
    desktop.addEventListener('change', start);
    reducedMotion.addEventListener('change', start);
    return () => {
      stop();
      desktop.removeEventListener('change', start);
      reducedMotion.removeEventListener('change', start);
    };
  }, []);

  return (
    <div
      className="shared-service-story"
      data-active-scene={activeScene}
      ref={rootRef}
    >
      <div className="shared-service-layout">
        <div className="shared-service-stage-column" aria-hidden="true">
          <div className="shared-service-stage">
            <svg
              className="shared-service-thread"
              viewBox="0 0 240 180"
              fill="none"
              aria-hidden="true"
            >
              <path d="M26 142C72 169 98 131 104 91C110 52 145 22 213 43" />
            </svg>
            {scenes.map((scene) => (
              <div
                className={`shared-service-scene shared-service-scene--${scene.key}`}
                data-shared-visual={scene.key}
                key={scene.key}
              >
                {scene.layers
                  .filter((layer) => scene.visualMode === 'cutout' || layer.name === 'main')
                  .map((layer) => <StageLayer key={layer.name} layer={layer} />)}
                {scene.key === 'bartender' ? (
                  <StageLayer
                    layer={scene.layers.find((layer) => layer.name === 'main')!}
                    variant="shared-service-layer--bridge"
                  />
                ) : null}
                {scene.key === 'menaje' ? (
                  <StageLayer
                    layer={scene.layers.find((layer) => layer.name === 'main')!}
                    variant="shared-service-layer--menaje-bridge"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="shared-service-copy-rail">{children}</div>
      </div>
    </div>
  );
}
