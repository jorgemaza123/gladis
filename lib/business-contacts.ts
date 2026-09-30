import {
  BUSINESS_CONTACTS,
  businessOwnerIds,
  type BusinessContact,
  type BusinessOwnerId,
} from '../config/business-contacts';

export type BusinessContactMap = Readonly<
  Record<BusinessOwnerId, BusinessContact>
>;

export type PublicBusinessContact = {
  ownerId: BusinessOwnerId | null;
  label: string | null;
  available: boolean;
};

export function isBusinessOwnerId(value: unknown): value is BusinessOwnerId {
  return (
    typeof value === 'string' &&
    (businessOwnerIds as readonly string[]).includes(value)
  );
}

export function isValidWhatsAppNumber(value: unknown): value is string {
  return typeof value === 'string' && /^[1-9][0-9]{7,14}$/.test(value);
}

export function getBusinessContact(
  ownerId: unknown,
  contacts: BusinessContactMap = BUSINESS_CONTACTS,
): BusinessContact | null {
  if (!isBusinessOwnerId(ownerId)) return null;
  const contact = contacts[ownerId];
  return contact?.enabled ? contact : null;
}

export function resolveBusinessContact(
  ownerId: unknown,
  contacts: BusinessContactMap = BUSINESS_CONTACTS,
): PublicBusinessContact {
  if (!isBusinessOwnerId(ownerId))
    return { ownerId: null, label: null, available: false };

  const contact = getBusinessContact(ownerId, contacts);
  return {
    ownerId,
    label: contact?.label || null,
    available: !!contact && isValidWhatsAppNumber(contact.whatsapp),
  };
}

export function resolveWhatsAppDestination(
  ownerId: unknown,
  contacts: BusinessContactMap = BUSINESS_CONTACTS,
): string | null {
  const contact = getBusinessContact(ownerId, contacts);
  return contact && isValidWhatsAppNumber(contact.whatsapp)
    ? contact.whatsapp
    : null;
}
