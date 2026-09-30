'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ATTRIBUTION_STORAGE_KEY,
  createAttribution,
  createCtaContext,
  restoreAttribution,
  validCtaPlacement,
  type CtaPlacement,
} from '@/lib/attribution';
import type { AttributionV1 } from '@/models/quote-v2';

type AttributionContextValue = {
  attribution: AttributionV1 | null;
  restored: boolean;
  recordCta: (entryId: string | null, placement: CtaPlacement) => AttributionV1;
};
const AttributionContext = createContext<AttributionContextValue | null>(null);

function currentLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    referrer: document.referrer,
  };
}

export function AttributionProvider({ children }: { children: React.ReactNode }) {
  const [attribution, setAttribution] = useState<AttributionV1 | null>(null);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const initial = createAttribution(currentLocation());
      let stored: AttributionV1 | null = null;
      try {
        stored = restoreAttribution(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY));
      } catch {}
      const next = stored
        ? createCtaContext(
            stored,
            null,
            validCtaPlacement(stored.ctaPlacement) ? stored.ctaPlacement : 'navigation',
            window.location.pathname,
          )
        : initial;
      try {
        sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      setAttribution(next);
      setRestored(true);
    });
    return () => {
      active = false;
    };
  }, []);
  const value = useMemo<AttributionContextValue>(() => ({
    attribution,
    restored,
    recordCta: (entryId, placement) => {
      const base = attribution || createAttribution(currentLocation());
      const next = createCtaContext(base, entryId, placement, window.location.pathname);
      try {
        sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      setAttribution(next);
      return next;
    },
  }), [attribution, restored]);
  return <AttributionContext.Provider value={value}>{children}</AttributionContext.Provider>;
}

export function useAttribution() {
  const context = useContext(AttributionContext);
  if (!context) throw new Error('useAttribution debe usarse dentro de AttributionProvider.');
  return context;
}
