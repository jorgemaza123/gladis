export const GA4_MEASUREMENT_ID = 'G-0RDQQZPL5B';
export const ANALYTICS_CONSENT_STORAGE_KEY = 'gladys.analytics-consent.v1';

export type AnalyticsConsentDecision = 'granted' | 'denied';
export type AnalyticsConsentState = AnalyticsConsentDecision | null;

export type QuoteStartedParams = {
  placement: string;
  serviceId?: string | null;
  itemsCount?: number;
};

export type WhatsAppLeadParams = {
  leadType: 'initial_enquiry' | 'detailed_quote';
  serviceId?: string | null;
  itemsCount?: number;
  recipientTeam?: string | null;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readStoredAnalyticsConsent(): AnalyticsConsentState {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredAnalyticsConsent(
  decision: AnalyticsConsentDecision,
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, decision);
  } catch {}
}

export function clearGaCookies(): void {
  if (typeof document === 'undefined') return;
  try {
    const cookies = document.cookie.split(';');
    for (const raw of cookies) {
      const name = raw.split('=')[0]?.trim();
      if (name === '_ga' || name?.startsWith('_ga_')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      }
    }
  } catch {}
}

function sanitizeTagValue(value: string | null | undefined, max = 80): string {
  if (!value) return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

export function sendGa4Event(
  eventName: 'page_view' | 'quote_started' | 'generate_lead',
  params: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', eventName, params);
}

export function buildQuoteStartedParams(
  input: QuoteStartedParams,
): Record<string, string | number> {
  return {
    source_placement: sanitizeTagValue(input.placement, 40) || 'navigation',
    service_id: sanitizeTagValue(input.serviceId, 80) || 'general',
    items_count: Math.max(0, Math.min(50, Number(input.itemsCount) || 0)),
  };
}

export function buildWhatsAppLeadParams(
  input: WhatsAppLeadParams,
): Record<string, string | number> {
  return {
    contact_channel: 'whatsapp',
    lead_type: input.leadType,
    service_id: sanitizeTagValue(input.serviceId, 80) || 'general',
    items_count: Math.max(0, Math.min(50, Number(input.itemsCount) || 0)),
    recipient_team: sanitizeTagValue(input.recipientTeam, 80) || 'general',
  };
}
