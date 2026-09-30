'use client';

import type { ReactNode } from 'react';
import { useAttribution } from '@/components/attribution-provider';
import { useQuoteCart } from '@/components/quote-cart-provider';
import type { CtaPlacement } from '@/lib/attribution';

type QuoteCtaProps = {
  entryId?: string | null;
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
  placement,
  href = '/cotizar',
  className,
  mode = 'navigate',
  addToCart = true,
  target,
  rel,
  children,
}: QuoteCtaProps) {
  const { add } = useQuoteCart();
  const { recordCta } = useAttribution();
  const destination = quoteHref(href, entryId);

  if (mode === 'add') return (
    <button
      className={className}
      onClick={() => {
        recordCta(entryId, placement);
        if (entryId && addToCart) add(entryId);
      }}
      type="button"
    >
      {children}
    </button>
  );

  return (
    <a
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
    </a>
  );
}
