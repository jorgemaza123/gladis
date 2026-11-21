'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useQuoteCart } from './quote-cart-provider';
import { useAnalytics } from './analytics-provider';

export type FloatingBarEntry = {
  id: string;
  title: string;
  ownerLabel: string;
};

export function FloatingEventBar({ entries }: { entries: FloatingBarEntry[] }) {
  const pathname = usePathname();
  const { cart, restored } = useQuoteCart();
  const { trackQuoteStarted } = useAnalytics();
  const prevCount = useRef<number | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!restored) return;
    if (prevCount.current !== null && cart.items.length > prevCount.current) {
      queueMicrotask(() => setJustAdded(true));
      const timer = window.setTimeout(() => setJustAdded(false), 2200);
      prevCount.current = cart.items.length;
      return () => window.clearTimeout(timer);
    }
    prevCount.current = cart.items.length;
  }, [cart.items.length, restored]);

  if (!restored || pathname === '/cotizar' || cart.items.length === 0) {
    return null;
  }

  const primary = cart.items.find((item) => item.itemId === cart.primaryItemId);
  const primaryEntry = entries.find((entry) => entry.id === primary?.entryId);
  const count = cart.items.length;
  const teamLabel = primaryEntry?.ownerLabel || 'Gladys';

  return (
    <aside
      className="floating-event-bar"
      aria-label="Resumen de tu evento"
      data-just-added={justAdded ? 'true' : undefined}
    >
      <div className="floating-event-bar-info">
        <span className="floating-event-bar-status" aria-live="polite">
          {justAdded ? 'Añadido a tu evento · ' : ''}
          <strong>
            {count} {count === 1 ? 'servicio' : 'servicios'}
          </strong>{' '}
          en tu evento
        </span>
        <span className="floating-event-bar-team">Coordina: {teamLabel}</span>
      </div>
      <Link
        className="button small floating-event-bar-cta"
        href="/cotizar"
        onClick={() =>
          trackQuoteStarted({
            placement: 'floating_bar',
            serviceId: primary?.entryId || 'general',
            itemsCount: count,
          })
        }
      >
        Revisar y cotizar <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
