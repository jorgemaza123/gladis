'use client';
import { useEffect, useRef } from 'react';
import { observeScrollMotion } from '@/lib/scroll-motion';
export function Motion({ enabled }: { enabled: boolean }) {
  const anchor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>('.public-site');
    if (enabled && root) return observeScrollMotion(root);
  }, [enabled]);
  return <span ref={anchor} hidden aria-hidden="true" />;
}
