import type { AttributionV1 } from '@/models/quote-v2';

export const ATTRIBUTION_STORAGE_KEY = 'catering.attribution.v1';
export const ctaPlacements = [
  'hero',
  'navigation',
  'footer',
  'catalog_card',
  'service_detail',
  'recommendation',
  'cart',
  'quote_form',
  'external_catalog',
] as const;
export type CtaPlacement = (typeof ctaPlacements)[number];

type LocationInput = { pathname: string; search?: string; referrer?: string };
const attributionChannels = [
  'organic',
  'paid',
  'social',
  'referral',
  'direct_unknown',
] as const;
const validEntryId = (value: string | null): value is string =>
  typeof value === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(value);
const safeUtmValue = (value: string) => {
  const clean = Array.from(value)
    .filter((character) => character >= ' ' && character !== String.fromCharCode(127))
    .join('')
    .trim();
  if (
    !clean ||
    clean.length > 80 ||
    /@|https?:\/\/|www\.|[?&#]/i.test(clean) ||
    /\+?\d[\d\s()-]{6,}\d/.test(clean)
  )
    return undefined;
  return clean;
};

export function sanitizePath(pathname: string) {
  return /^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(pathname) ? pathname : '/';
}

export function sanitizeReferrerHost(referrer: string | undefined) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    return host && host.length <= 253 ? host : null;
  } catch {
    return null;
  }
}

export function sanitizeUtm(search = '') {
  const params = new URLSearchParams(search);
  const source = safeUtmValue(params.get('utm_source') || '');
  const medium = safeUtmValue(params.get('utm_medium') || '');
  const campaign = safeUtmValue(params.get('utm_campaign') || '');
  return {
    ...(source ? { source } : {}),
    ...(medium ? { medium } : {}),
    ...(campaign ? { campaign } : {}),
  };
}

export function classifyChannel(
  utm: AttributionV1['utm'],
  referrerHost: string | null,
): AttributionV1['channel'] {
  if (/^(paid|cpc|ppc|display|social_paid)$/i.test(utm.medium || '')) return 'paid';
  if (referrerHost && /(^|\.)(google|bing|duckduckgo|yahoo)\./i.test(referrerHost)) return 'organic';
  if (referrerHost && /(^|\.)(facebook|instagram|tiktok|linkedin|youtube|x|twitter)\./i.test(referrerHost)) return 'social';
  return referrerHost ? 'referral' : 'direct_unknown';
}

export function createAttribution(
  location: LocationInput,
  now = new Date(),
): AttributionV1 {
  const landingPath = sanitizePath(location.pathname);
  const referrerHost = sanitizeReferrerHost(location.referrer);
  const utm = sanitizeUtm(location.search);
  return {
    schemaVersion: 1,
    landingPath,
    acquisitionEntryId: null,
    lastTouchPath: landingPath,
    referrerHost,
    channel: classifyChannel(utm, referrerHost),
    utm,
    ctaPlacement: 'navigation',
    capturedAt: now.toISOString(),
  };
}

export function createCtaContext(
  attribution: AttributionV1,
  entryId: string | null,
  placement: CtaPlacement,
  pathname: string,
  now = new Date(),
): AttributionV1 {
  return {
    ...attribution,
    acquisitionEntryId: attribution.acquisitionEntryId || (validEntryId(entryId) ? entryId : null),
    lastTouchPath: sanitizePath(pathname),
    ctaPlacement: placement,
    capturedAt: now.toISOString(),
  };
}

function isAttribution(value: unknown): value is AttributionV1 {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<AttributionV1>;
  if (!item.utm || typeof item.utm !== 'object') return false;
  const utm = item.utm as Record<string, unknown>;
  const utmKeys = Object.keys(utm);
  return item.schemaVersion === 1 &&
    typeof item.landingPath === 'string' && item.landingPath === sanitizePath(item.landingPath) &&
    typeof item.lastTouchPath === 'string' && item.lastTouchPath === sanitizePath(item.lastTouchPath) &&
    (item.acquisitionEntryId === null || (typeof item.acquisitionEntryId === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(item.acquisitionEntryId))) &&
    (item.referrerHost === null || (typeof item.referrerHost === 'string' && /^[a-z0-9.-]{1,253}$/.test(item.referrerHost))) &&
    typeof item.channel === 'string' &&
    attributionChannels.includes(item.channel as AttributionV1['channel']) &&
    typeof item.ctaPlacement === 'string' &&
    ctaPlacements.includes(item.ctaPlacement as CtaPlacement) &&
    typeof item.capturedAt === 'string' &&
    utmKeys.every((key) => ['source', 'medium', 'campaign'].includes(key) && typeof utm[key] === 'string' && safeUtmValue(utm[key]) === utm[key]);
}

export function validCtaPlacement(value: string): value is CtaPlacement {
  return ctaPlacements.includes(value as CtaPlacement);
}

export function restoreAttribution(raw: string | null): AttributionV1 | null {
  if (!raw) return null;
  try {
    const item = JSON.parse(raw);
    return isAttribution(item) ? item : null;
  } catch {
    return null;
  }
}
