'use client';
import { useEffect } from 'react';
export function Motion({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (
      !enabled ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('arrived');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll('.public-site [data-reveal]')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
  return null;
}
