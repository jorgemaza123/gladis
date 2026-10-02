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
    label: 'Cocina, bartender y menaje',
    whatsapp: '51902843481',
    enabled: true,
  },
  eventos: {
    label: 'Complementos y producción',
    whatsapp: '51923106197',
    enabled: true,
  },
};
