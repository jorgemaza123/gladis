'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { observeHeroVideo, type HeroVideoState } from '@/lib/hero-video';
import { QuoteCta } from './quote-cta';

export function StoryHero() {
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
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="story-shade" aria-hidden="true" />
        <div className="story-content wrap">
          <div className="story-chapter" data-active="true">
            <p>Soluciones para celebraciones y eventos en Lima</p>
            <h1 id="home-title">
              Tú celebra. Nosotros te ayudamos con lo que necesitas.
            </h1>
            <span>
              Cocina, bartender, menaje, mozos, alquileres, personalizados y
              flores. Contrata un servicio o combina varios en Lima
              Metropolitana.
            </span>
            <div className="story-actions">
              <QuoteCta
                className="button"
                entryId="buffet-para-eventos"
                placement="hero"
              >
                Armar mi evento <i aria-hidden="true">↗</i>
              </QuoteCta>
              <Link href="#servicios">Explorar soluciones</Link>
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
        <p className="story-scroll-cue" aria-hidden="true">
          <span>↓</span> Descubre lo que podemos preparar
        </p>
      </div>
    </section>
  );
}
