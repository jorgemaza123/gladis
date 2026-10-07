'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { QuoteCta } from './quote-cta';

export function StoryHero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = section.current;
    const media = video.current;
    if (!root || !media) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const play = () => {
      if (reduced.matches || userPaused.current || document.hidden) return;
      const activation = media.play();
      if (activation) activation.then(() => setPaused(false)).catch(() => setPaused(true));
    };
    const onReady = () => {
      setReady(true);
      play();
    };
    const onPreference = () => {
      if (reduced.matches) {
        media.pause();
        setPaused(true);
      } else {
        play();
      }
    };
    const onVisibility = () => {
      if (document.hidden) media.pause();
      else play();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else media.pause();
    }, { threshold: 0.12 });

    media.addEventListener('canplay', onReady, { once: true });
    reduced.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', onVisibility);
    observer.observe(root);
    if (media.readyState >= 3) onReady();

    return () => {
      media.removeEventListener('canplay', onReady);
      reduced.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, []);

  const togglePlayback = () => {
    const media = video.current;
    if (!media) return;
    if (media.paused) {
      userPaused.current = false;
      const activation = media.play();
      if (activation) activation.then(() => setPaused(false)).catch(() => setPaused(true));
    } else {
      userPaused.current = true;
      media.pause();
      setPaused(true);
    }
  };

  return (
    <section className="story-hero" ref={section} aria-labelledby="home-title">
      <div className="story-stage">
        <picture className="story-poster">
          <source media="(max-width: 760px)" srcSet="/videos/gladys-story-poster-mobile.webp" />
          <img src="/videos/gladys-story-poster.webp" alt="" />
        </picture>
        <video
          ref={video}
          className={ready ? 'is-ready' : ''}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/videos/gladys-story-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source media="(max-width: 760px)" src="/videos/gladys-story-mobile.mp4" type="video/mp4" />
          <source src="/videos/gladys-story-desktop.mp4" type="video/mp4" />
        </video>
        <div className="story-shade" aria-hidden="true" />
        <div className="story-content wrap">
          <div className="story-chapter" data-active="true">
            <p>Soluciones para celebraciones y eventos en Lima</p>
            <h1 id="home-title">Tú celebra. Nosotros te ayudamos con lo que necesitas.</h1>
            <span>
              Cocina, bartender, menaje, mozos, alquileres, personalizados y flores.
              Contrata un servicio o combina varios en Lima Metropolitana.
            </span>
            <div className="story-actions">
              <QuoteCta className="button" entryId="buffet-para-eventos" placement="hero">
                Armar mi evento <i aria-hidden="true">↗</i>
              </QuoteCta>
              <Link href="#servicios">Explorar soluciones</Link>
            </div>
          </div>
        </div>
        <button className="story-video-toggle" type="button" onClick={togglePlayback} aria-pressed={paused}>
          <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          {paused ? 'Reproducir video' : 'Pausar video'}
        </button>
        <p className="story-scroll-cue" aria-hidden="true"><span>↓</span> Descubre lo que podemos preparar</p>
      </div>
    </section>
  );
}
