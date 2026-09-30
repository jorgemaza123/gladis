'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import {
  QUOTE_CART_STORAGE_KEY,
  adaptLegacyQuoteDraft,
  emptyQuoteCart,
  quoteCartReducer,
  restoreQuoteCart,
  serializeQuoteCart,
  type QuoteCartAction,
} from '@/lib/quote-cart';
import type { CartV2 } from '@/models/quote-v2';

const legacyStorageKey = 'catering.quote-draft.v2';
type QuoteCartContextValue = {
  cart: CartV2;
  restored: boolean;
  restoreNotice: string;
  dispatch: (action: QuoteCartAction) => void;
  add: (entryId: string, quantity?: number, optionValues?: Record<string, string>) => void;
};
const QuoteCartContext = createContext<QuoteCartContextValue | null>(null);

function createItemId() {
  return crypto.randomUUID();
}

export function QuoteCartProvider({
  entryIds,
  children,
}: {
  entryIds: string[];
  children: React.ReactNode;
}) {
  const [cart, dispatch] = useReducer(quoteCartReducer, undefined, emptyQuoteCart);
  const [restored, setRestored] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState('');
  const validEntryIds = useMemo(() => new Set(entryIds), [entryIds]);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const stored = sessionStorage.getItem(QUOTE_CART_STORAGE_KEY);
        const restoredCart = restoreQuoteCart(stored);
        if (stored) {
          dispatch({ type: 'reset' });
          for (const item of restoredCart.cart.items) dispatch({ type: 'add', item });
          dispatch({ type: 'setPrimary', itemId: restoredCart.cart.primaryItemId });
          if (restoredCart.discarded) setRestoreNotice('Se descartó una bolsa de cotización no válida o vencida.');
        } else {
          const legacy = adaptLegacyQuoteDraft(
            sessionStorage.getItem(legacyStorageKey),
            validEntryIds,
            createItemId,
          );
          if (legacy.cart.items.length) {
            for (const item of legacy.cart.items) dispatch({ type: 'add', item });
            try {
              sessionStorage.setItem(QUOTE_CART_STORAGE_KEY, serializeQuoteCart(legacy.cart));
            } catch {}
          }
          if (legacy.discarded) setRestoreNotice('Parte del borrador anterior no se pudo recuperar.');
        }
      } catch {
        setRestoreNotice('La bolsa seguirá disponible durante esta visita, pero no se pudo restaurar.');
      }
      setRestored(true);
    });
    return () => {
      active = false;
    };
  }, [validEntryIds]);
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(QUOTE_CART_STORAGE_KEY, serializeQuoteCart(cart));
    } catch {}
  }, [cart, restored]);
  const value = useMemo<QuoteCartContextValue>(() => ({
    cart,
    restored,
    restoreNotice,
    dispatch,
    add: (entryId, quantity = 1, optionValues = {}) => {
      if (!validEntryIds.has(entryId)) return;
      dispatch({ type: 'add', item: { itemId: createItemId(), entryId, quantity, optionValues } });
    },
  }), [cart, restored, restoreNotice, validEntryIds]);
  return <QuoteCartContext.Provider value={value}>{children}</QuoteCartContext.Provider>;
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (!context) throw new Error('useQuoteCart debe usarse dentro de QuoteCartProvider.');
  return context;
}
