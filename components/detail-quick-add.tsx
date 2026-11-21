'use client';

import { useQuoteCart } from './quote-cart-provider';
import { useAttribution } from './attribution-provider';
import { useAnalytics } from './analytics-provider';

export function DetailQuickAddButton({
  entryId,
  entryTitle,
  minimum = 1,
}: {
  entryId: string;
  entryTitle: string;
  minimum?: number;
}) {
  const { cart, restored, add } = useQuoteCart();
  const { recordCta } = useAttribution();
  const { trackQuoteStarted } = useAnalytics();
  const selected = cart.items.some((item) => item.entryId === entryId);

  return (
    <button
      type="button"
      className="detail-quick-add"
      disabled={!restored || selected}
      data-selected={selected ? 'true' : undefined}
      onClick={() => {
        if (selected) return;
        add(entryId, minimum);
        recordCta(entryId, 'service_detail');
        trackQuoteStarted({
          placement: 'service_detail',
          serviceId: entryId,
          itemsCount: cart.items.length + 1,
        });
      }}
    >
      {selected ? `✓ ${entryTitle} en Mi evento` : `+ Sumar ${entryTitle}`}
    </button>
  );
}
