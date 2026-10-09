import type { CartV2, QuoteItemV2 } from '@/models/quote-v2';

export const QUOTE_CART_STORAGE_KEY = 'catering.quote-cart.v2';
export const QUOTE_CART_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_ITEMS = 20;

export type QuoteCartAction =
  | { type: 'add'; item: QuoteItemV2 }
  | { type: 'update'; itemId: string; quantity: number; optionValues: Record<string, string> }
  | { type: 'remove'; itemId: string }
  | { type: 'setPrimary'; itemId: string | null }
  | { type: 'reset' };

export type CartRestore = { cart: CartV2; discarded: boolean };

export const emptyQuoteCart = (): CartV2 => ({
  schemaVersion: 2,
  items: [],
  primaryItemId: null,
  updatedAt: 0,
});

function canonicalOptions(options: Record<string, string>) {
  return Object.entries(options)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, value]) => `${id}:${value}`)
    .join('|');
}

function sameVariant(left: QuoteItemV2, right: QuoteItemV2) {
  return left.entryId === right.entryId &&
    canonicalOptions(left.optionValues) === canonicalOptions(right.optionValues);
}

function stamp(cart: CartV2, items: QuoteItemV2[], primaryItemId = cart.primaryItemId): CartV2 {
  return { schemaVersion: 2, items, primaryItemId, updatedAt: Date.now() };
}

export function quoteCartReducer(cart: CartV2, action: QuoteCartAction): CartV2 {
  if (action.type === 'reset') return emptyQuoteCart();
  if (action.type === 'add') {
    if (!Number.isFinite(action.item.quantity) || action.item.quantity < 0) return cart;
    const matching = cart.items.find((item) => sameVariant(item, action.item));
    if (matching)
      return stamp(
        cart,
        cart.items.map((item) =>
          item.itemId === matching.itemId
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item,
        ),
      );
    if (cart.items.length >= MAX_ITEMS || cart.items.some((item) => item.itemId === action.item.itemId))
      return cart;
    return stamp(
      cart,
      [...cart.items, action.item],
      cart.items.length === 0 ? action.item.itemId : cart.primaryItemId,
    );
  }
  if (action.type === 'update') {
    if (!Number.isFinite(action.quantity) || action.quantity < 0) return cart;
    const current = cart.items.find((item) => item.itemId === action.itemId);
    if (!current) return cart;
    const next = { ...current, quantity: action.quantity, optionValues: action.optionValues };
    const matching = cart.items.find(
      (item) => item.itemId !== action.itemId && sameVariant(item, next),
    );
    if (matching)
      return stamp(
        cart,
        cart.items
          .filter((item) => item.itemId !== action.itemId)
          .map((item) =>
            item.itemId === matching.itemId
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        cart.primaryItemId === action.itemId ? matching.itemId : cart.primaryItemId,
      );
    return stamp(
      cart,
      cart.items.map((item) => (item.itemId === action.itemId ? next : item)),
    );
  }
  if (action.type === 'remove') {
    if (!cart.items.some((item) => item.itemId === action.itemId)) return cart;
    return stamp(
      cart,
      cart.items.filter((item) => item.itemId !== action.itemId),
      cart.primaryItemId === action.itemId ? null : cart.primaryItemId,
    );
  }
  if (action.type === 'setPrimary') {
    if (action.itemId !== null && !cart.items.some((item) => item.itemId === action.itemId))
      return cart;
    return stamp(cart, cart.items, action.itemId);
  }
  return cart;
}

function validCart(value: unknown): value is CartV2 {
  if (!value || typeof value !== 'object') return false;
  const cart = value as Partial<CartV2>;
  if (cart.schemaVersion !== 2 || !Array.isArray(cart.items) || typeof cart.updatedAt !== 'number')
    return false;
  if (cart.items.length > MAX_ITEMS || (cart.primaryItemId !== null && typeof cart.primaryItemId !== 'string'))
    return false;
  const ids = new Set<string>();
  for (const item of cart.items) {
    if (!item || typeof item !== 'object' || typeof item.itemId !== 'string' || typeof item.entryId !== 'string' ||
      !Number.isFinite(item.quantity) || item.quantity < 0 || !item.optionValues || typeof item.optionValues !== 'object')
      return false;
    if (ids.has(item.itemId)) return false;
    ids.add(item.itemId);
  }
  return cart.primaryItemId === null || ids.has(cart.primaryItemId);
}

export function restoreQuoteCart(raw: string | null, now = Date.now()): CartRestore {
  if (!raw) return { cart: emptyQuoteCart(), discarded: false };
  try {
    const stored = JSON.parse(raw) as { savedAt?: unknown; cart?: unknown };
    if (typeof stored.savedAt !== 'number' || stored.savedAt < now - QUOTE_CART_TTL_MS || stored.savedAt > now)
      return { cart: emptyQuoteCart(), discarded: true };
    if (!validCart(stored.cart)) return { cart: emptyQuoteCart(), discarded: true };
    return { cart: stored.cart, discarded: false };
  } catch {
    return { cart: emptyQuoteCart(), discarded: true };
  }
}

export function serializeQuoteCart(cart: CartV2, now = Date.now()) {
  return JSON.stringify({ schemaVersion: 2, savedAt: now, cart });
}

export function adaptLegacyQuoteDraft(
  raw: string | null,
  validEntryIds: ReadonlySet<string>,
  createItemId: () => string,
  now = Date.now(),
): CartRestore {
  if (!raw) return { cart: emptyQuoteCart(), discarded: false };
  try {
    const legacy = JSON.parse(raw) as {
      savedAt?: unknown;
      data?: { selectionId?: unknown; addOnIds?: unknown };
    };
    if (!legacy.data || typeof legacy.savedAt !== 'number' || legacy.savedAt < now - QUOTE_CART_TTL_MS)
      return { cart: emptyQuoteCart(), discarded: true };
    const ids = [legacy.data.selectionId, ...(Array.isArray(legacy.data.addOnIds) ? legacy.data.addOnIds : [])]
      .filter((id): id is string => typeof id === 'string' && validEntryIds.has(id));
    const discarded = (typeof legacy.data.selectionId === 'string' && !validEntryIds.has(legacy.data.selectionId)) ||
      (Array.isArray(legacy.data.addOnIds) && legacy.data.addOnIds.some((id) => typeof id !== 'string' || !validEntryIds.has(id)));
    return {
      cart: ids.slice(0, MAX_ITEMS).reduce(
        (cart, entryId) => quoteCartReducer(cart, {
          type: 'add', item: { itemId: createItemId(), entryId, quantity: 1, optionValues: {} },
        }),
        emptyQuoteCart(),
      ),
      discarded: discarded || ids.length > MAX_ITEMS,
    };
  } catch {
    return { cart: emptyQuoteCart(), discarded: true };
  }
}
