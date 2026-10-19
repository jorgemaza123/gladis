'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { observeHeroVideo, type HeroVideoState } from '@/lib/hero-video';
import { QuoteCta } from './quote-cta';

export function StoryHero({ serviceSearch }: { serviceSearch: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const playback = useRef<ReturnType<typeof observeHeroVideo> | null>(null);
  const [state, setState] = useState<HeroVideoState>({
    ready: false,
    active: false,
    allowed: false,
  });

  useEffect(() => {
    const root = section.current;
    const media = video.current;
    if (!root || !media) return;

    const controller = observeHeroVideo(
      root,
      media,
      {
        mobile: '/videos/gladys-story-mobile.mp4',
        desktop: '/videos/gladys-story-desktop.mp4',
      },
      setState,
    );
    playback.current = controller;
    return () => {
      controller.dispose();
      playback.current = null;
    };
  }, []);

  return (
    <section
      className="story-hero"
      ref={section}
      aria-labelledby="home-title"
      data-video-allowed={state.allowed}
    >
      <div className="story-stage">
        <div className="story-media" aria-hidden="true">
          <picture className="story-poster">
            <source
              media="(max-width: 760px)"
              srcSet="/videos/gladys-story-poster-mobile.webp"
            />
            <img src="/videos/gladys-story-poster.webp" alt="" />
          </picture>
          <video
            ref={video}
            id="home-story-video"
            className={state.ready ? 'is-ready' : ''}
            loop
            muted
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
          <div className="story-shade" />
        </div>
        <div className="story-content wrap">
          <div className="story-arrival">
            <div className="story-chapter" data-active="true">
              <p>Soluciones para celebraciones y eventos en Lima</p>
              <h1 id="home-title">
                <span className="story-title-line">
                  <span>Tú celebra.</span>
                </span>{' '}
                <span className="story-title-line">
                  <span>Nosotros te ayudamos con</span>
                </span>{' '}
                <span className="story-title-line">
                  <span>lo que necesitas.</span>
                </span>
              </h1>
              <span>
                Cocina, bartender, menaje, mozos, alquileres, personalizados y
                flores. Contrata un servicio o combina varios en Lima
                Metropolitana.
              </span>
              <div className="story-actions">
                <QuoteCta
                  className="button"
                  placement="hero"
                >
                  Armar mi evento <i aria-hidden="true">↗</i>
                </QuoteCta>
                {serviceSearch}
              </div>
            </div>
          </div>
        </div>
        <button
          className="story-video-toggle"
          type="button"
          onClick={() => playback.current?.toggle()}
          aria-controls="home-story-video"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            {state.active ? (
              <>
                <path d="M8 5v14" />
                <path d="M16 5v14" />
              </>
            ) : (
              <path d="m8 4 12 8-12 8V4Z" />
            )}
          </svg>
          {state.active ? 'Pausar video' : 'Reproducir video'}
        </button>
        <div className="story-guide-arrival" aria-hidden="true">
          <p className="story-scroll-cue">
            <span className="story-scroll-cue-inner">
              <span>↓</span> Descubre lo que podemos preparar
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
