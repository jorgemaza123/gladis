'use client';
import Link from 'next/link';

import type { ReactNode } from 'react';
import { useAttribution } from '@/components/attribution-provider';
import { useQuoteCart } from '@/components/quote-cart-provider';
import type { CtaPlacement } from '@/lib/attribution';

type QuoteCtaProps = {
  entryId?: string | null;
  entryTitle?: string;
  placement: CtaPlacement;
  href?: string;
  className?: string;
  mode?: 'navigate' | 'add';
  addToCart?: boolean;
  target?: string;
  rel?: string;
  children: ReactNode;
};

function quoteHref(href: string, entryId: string | null) {
  if (!entryId || !href.startsWith('/')) return href;
  const url = new URL(href, 'https://cotizacion.local');
  url.searchParams.set('seleccion', entryId);
  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Registra el primer CTA en la sesión y, sólo para una oferta cotizable ya
 * proyectada por el servidor, la agrega a la bolsa antes de navegar.
 */
export function QuoteCta({
  entryId = null,
  entryTitle,
  placement,
  href = '/cotizar',
  className,
  mode = 'navigate',
  addToCart = true,
  target,
  rel,
  children,
}: QuoteCtaProps) {
  const { add, cart } = useQuoteCart();
  const { recordCta } = useAttribution();
  const destination = quoteHref(href, entryId);
  const selected =
    !!entryId && cart.items.some((item) => item.entryId === entryId);

  if (mode === 'add')
    return (
      <button
        className={className}
        data-selected={selected ? 'true' : undefined}
        aria-label={
          entryTitle
            ? selected
              ? entryTitle + ' añadido a Mi evento'
              : 'Añadir ' + entryTitle + ' a Mi evento'
            : undefined
        }
        aria-disabled={selected}
        onClick={() => {
          if (selected) return;
          recordCta(entryId, placement);
          if (entryId && addToCart) add(entryId);
        }}
        type="button"
      >
        {selected ? (
          <>
            Añadido
            <svg
              viewBox="0 0 16 16"
              width="15"
              height="15"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="m3 8 3.2 3.2L13 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ) : children}
      </button>
    );

  return (
    <Link
      className={className}
      href={destination}
      target={target}
      rel={rel}
      onClick={() => {
        recordCta(entryId, placement);
        if (entryId && addToCart) add(entryId);
      }}
    >
      {children}
    </Link>
  );
}
