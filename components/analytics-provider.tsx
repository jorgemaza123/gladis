'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  GA4_MEASUREMENT_ID,
  buildQuoteStartedParams,
  buildWhatsAppLeadParams,
  clearGaCookies,
  readStoredAnalyticsConsent,
  sendGa4Event,
  writeStoredAnalyticsConsent,
  type AnalyticsConsentState,
  type QuoteStartedParams,
  type WhatsAppLeadParams,
} from '@/lib/analytics';

type AnalyticsContextValue = {
  consent: AnalyticsConsentState;
  ready: boolean;
  bannerOpen: boolean;
  accept: () => void;
  reject: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
  trackQuoteStarted: (params: QuoteStartedParams) => void;
  trackWhatsAppLead: (params: WhatsAppLeadParams) => void;
};

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);
const GA4_SCRIPT_ID = 'gladys-ga4-gtag';

function ensureGa4Loaded(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params -- gtag requires native IArguments.
      window.dataLayer?.push(arguments);
    };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('set', { send_page_view: false });
    window.gtag('js', new Date());
    // Disable automatic page_view to avoid duplicates with SPA route tracking.
    window.gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: false,
      anonymize_ip: true,
    });
  } else {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  if (!document.getElementById(GA4_SCRIPT_ID)) {
    const script = document.createElement('script');
    script.id = GA4_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  const [consent, setConsent] = useState<AnalyticsConsentState>(null);
  const [ready, setReady] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);
  const quoteSessionTracked = useRef(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = readStoredAnalyticsConsent();
      setConsent(stored);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (consent === 'granted') {
      ensureGa4Loaded();
      if (lastTrackedPath.current !== pathname) {
        lastTrackedPath.current = pathname;
        sendGa4Event('page_view', {
          page_path: pathname,
          page_location: window.location.origin + pathname,
          page_title: document.title,
        });
      }
      return;
    }

    lastTrackedPath.current = null;
    if (consent === 'denied') {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
      clearGaCookies();
    }
  }, [consent, pathname, ready]);

  const accept = useCallback(() => {
    writeStoredAnalyticsConsent('granted');
    setConsent('granted');
    setBannerOpen(false);
  }, []);

  const reject = useCallback(() => {
    writeStoredAnalyticsConsent('denied');
    setConsent('denied');
    setBannerOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    setBannerOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setBannerOpen(false);
  }, []);

  const trackQuoteStarted = useCallback(
    (params: QuoteStartedParams) => {
      if (consent !== 'granted' || quoteSessionTracked.current) return;
      quoteSessionTracked.current = true;
      sendGa4Event('quote_started', buildQuoteStartedParams(params));
    },
    [consent],
  );

  const trackWhatsAppLead = useCallback(
    (params: WhatsAppLeadParams) => {
      if (consent !== 'granted') return;
      sendGa4Event('generate_lead', buildWhatsAppLeadParams(params));
    },
    [consent],
  );

  const value = useMemo<AnalyticsContextValue>(
    () => ({
      consent,
      ready,
      bannerOpen,
      accept,
      reject,
      openPreferences,
      closePreferences,
      trackQuoteStarted,
      trackWhatsAppLead,
    }),
    [
      consent,
      ready,
      bannerOpen,
      accept,
      reject,
      openPreferences,
      closePreferences,
      trackQuoteStarted,
      trackWhatsAppLead,
    ],
  );

  const showBanner = ready && (consent === null || bannerOpen);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
      {showBanner ? (
        <aside
          className="analytics-consent-banner"
          aria-label="Preferencias de analítica"
        >
          <div className="analytics-consent-copy">
            <p>
              Usamos analítica anónima para medir visitas y consultas al cotizador, sin registrar nombres ni teléfonos.{' '}
              <Link href="/privacidad">Ver privacidad</Link>
            </p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" className="ghost small" onClick={reject}>
              Rechazar
            </button>
            <button type="button" className="button small" onClick={accept}>
              Aceptar analítica
            </button>
            {consent !== null ? (
              <button
                type="button"
                className="text-link analytics-consent-close"
                onClick={closePreferences}
                aria-label="Cerrar preferencias de analítica"
              >
                Cerrar
              </button>
            ) : null}
          </div>
        </aside>
      ) : null}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextValue {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error('useAnalytics debe usarse dentro de AnalyticsProvider.');
  }
  return ctx;
}
