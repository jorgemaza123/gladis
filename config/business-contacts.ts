export const businessOwnerIds = ['cocina', 'eventos'] as const;

export type BusinessOwnerId = (typeof businessOwnerIds)[number];

export type BusinessContact = {
  label: string;
  whatsapp: string | null;
  enabled: boolean;
};

export const BUSINESS_CONTACTS: Readonly<
  Record<BusinessOwnerId, BusinessContact>
> = {
  cocina: {
    label: 'Cocina y bar',
    whatsapp: null,
    enabled: true,
  },
  eventos: {
    label: 'Jorge',
    whatsapp: '51902843481',
    enabled: true,
  },
};
