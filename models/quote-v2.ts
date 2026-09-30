import type { BusinessOwnerId } from '@/config/business-contacts';
import type { QuoteInput } from '@/models/content';

export type AttributionV1 = {
  schemaVersion: 1;
  landingPath: string;
  acquisitionEntryId: string | null;
  lastTouchPath: string;
  referrerHost: string | null;
  channel: 'organic' | 'paid' | 'social' | 'referral' | 'direct_unknown';
  utm: { source?: string; medium?: string; campaign?: string };
  ctaPlacement: string;
  capturedAt: string;
};

export type QuoteItemV2 = {
  itemId: string;
  entryId: string;
  quantity: number;
  optionValues: Record<string, string>;
};

export type CartV2 = {
  schemaVersion: 2;
  items: QuoteItemV2[];
  primaryItemId: string | null;
  updatedAt: number;
};

export type QuoteInputV2 = {
  schemaVersion: 2;
  requestId: string;
  items: QuoteItemV2[];
  primaryItemId: string;
  event: {
    typeId: string | null;
    typeOther: string;
    date: string | null;
    district: string;
    guests: number | null;
  };
  contact: { name: string; phone: string; email: string };
  notes: string;
  consent: true;
  website: string;
  startedAt: number;
  attribution: AttributionV1;
};

export type QuoteSnapshotV2 = {
  schemaVersion: 2;
  primaryItemId: string;
  ownerId: BusinessOwnerId;
  recipient: { ownerId: BusinessOwnerId; label: string | null; available: boolean };
  items: Array<{
    itemId: string;
    entryId: string;
    title: string;
    quantity: number;
    quantityUnit: 'person' | 'unit' | 'event' | 'hour';
    options: { id: string; label: string; valueId: string; valueLabel: string }[];
    ownerId: BusinessOwnerId;
    price: {
      mode: 'consult' | 'fixed' | 'from';
      amount: number | null;
      currency: 'PEN';
      unit: 'person' | 'event' | 'unit';
      minimum: number | null;
      conditions: string;
    };
  }>;
  event: QuoteInputV2['event'];
  attribution: AttributionV1;
  consentText: string;
};

export type NormalizedQuoteInput =
  | { schemaVersion: 1; input: QuoteInput }
  | { schemaVersion: 2; input: QuoteInputV2 };
