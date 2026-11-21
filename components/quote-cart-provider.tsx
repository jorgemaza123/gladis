'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  QUOTE_CART_STORAGE_KEY,
  adaptLegacyQuoteDraft,
  emptyQuoteCart,
  quoteCartReducer,
  restoreQuoteCart,
  serializeQuoteCart,
  type QuoteCartAction,
} from '@/lib/quote-cart';
import type { CartV2, QuoteItemV2 } from '@/models/quote-v2';

const legacyStorageKey = 'catering.quote-draft.v2';
type RemovedCartItem = {
  item: QuoteItemV2;
  wasPrimary: boolean;
};
type QuoteCartContextValue = {
  cart: CartV2;
  restored: boolean;
  restoreNotice: string;
  lastRemoved: RemovedCartItem | null;
  undoRemove: () => void;
  dismissRemoved: () => void;
  dispatch: (action: QuoteCartAction) => void;
  add: (
    entryId: string,
    quantity?: number,
    optionValues?: Record<string, string>,
  ) => void;
};
const QuoteCartContext = createContext<QuoteCartContextValue | null>(null);

function createItemId() {
  return crypto.randomUUID();
}

export function QuoteCartProvider({
  entryIds,
  personEntryIds,
  children,
}: {
  entryIds: string[];
  personEntryIds: string[];
  children: React.ReactNode;
}) {
  const [cart, dispatch] = useReducer(
    quoteCartReducer,
    undefined,
    emptyQuoteCart,
  );
  const [restored, setRestored] = useState(false);
  const [restoreNotice, setRestoreNotice] = useState('');
  const [lastRemoved, setLastRemoved] = useState<RemovedCartItem | null>(null);
  const validEntryIds = useMemo(() => new Set(entryIds), [entryIds]);
  const personEntries = useMemo(() => new Set(personEntryIds), [personEntryIds]);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const stored = sessionStorage.getItem(QUOTE_CART_STORAGE_KEY);
        const restoredCart = restoreQuoteCart(stored);
        if (stored) {
          dispatch({ type: 'reset' });
          for (const item of restoredCart.cart.items.filter((item) =>
            validEntryIds.has(item.entryId),
          ))
            dispatch({ type: 'add', item });
          dispatch({
            type: 'setPrimary',
            itemId: restoredCart.cart.primaryItemId,
          });
          if (restoredCart.discarded)
            setRestoreNotice(
              'Tu selección anterior no se pudo recuperar o venció. Elige de nuevo los servicios.',
            );
        } else {
          const legacy = adaptLegacyQuoteDraft(
            sessionStorage.getItem(legacyStorageKey),
            validEntryIds,
            createItemId,
          );
          if (legacy.cart.items.length) {
            for (const item of legacy.cart.items)
              dispatch({ type: 'add', item });
            try {
              sessionStorage.setItem(
                QUOTE_CART_STORAGE_KEY,
                serializeQuoteCart(legacy.cart),
              );
            } catch {}
          }
          if (legacy.discarded)
            setRestoreNotice(
              'Parte del borrador anterior no se pudo recuperar.',
            );
        }
      } catch {
        setRestoreNotice(
          'Tu selección estará disponible mientras recorres la web, pero se perderá al cerrar o recargar esta pestaña.',
        );
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
  const value = useMemo<QuoteCartContextValue>(
    () => ({
      cart,
      restored,
      restoreNotice,
      lastRemoved,
      undoRemove: () => {
        if (!lastRemoved) return;
        dispatch({ type: 'add', item: lastRemoved.item });
        if (lastRemoved.wasPrimary) {
          dispatch({ type: 'setPrimary', itemId: lastRemoved.item.itemId });
        }
        setLastRemoved(null);
      },
      dismissRemoved: () => setLastRemoved(null),
      dispatch: (action) => {
        if (action.type === 'remove') {
          const target = cart.items.find((i) => i.itemId === action.itemId);
          if (target) {
            setLastRemoved({
              item: target,
              wasPrimary: cart.primaryItemId === target.itemId,
            });
          }
        } else if (action.type === 'add' || action.type === 'reset') {
          setLastRemoved(null);
        }
        dispatch(action);
      },
      add: (entryId, quantity = 1, optionValues = {}) => {
        if (
          !validEntryIds.has(entryId) ||
          cart.items.some((item) => item.entryId === entryId)
        )
          return;
        setLastRemoved(null);
        dispatch({
          type: 'add',
          item: {
            itemId: createItemId(),
            entryId,
            quantity: personEntries.has(entryId) && quantity === 1 ? 0 : quantity,
            optionValues,
          },
        });
      },
    }),
    [cart, restored, restoreNotice, lastRemoved, validEntryIds, personEntries],
  );
  return (
    <QuoteCartContext.Provider value={value}>
      {children}
    </QuoteCartContext.Provider>
  );
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (!context)
    throw new Error('useQuoteCart debe usarse dentro de QuoteCartProvider.');
  return context;
}
