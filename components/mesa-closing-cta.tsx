'use client';

import { useQuoteCart } from './quote-cart-provider';

export function MesaClosingLabel() {
  const { cart, restored } = useQuoteCart();
  const count = restored ? cart.items.length : 0;

  return (
    <>
      {count > 0
        ? `Revisar mis ${count} ${count === 1 ? 'servicio' : 'servicios'} y cotizar`
        : 'Cotizar mi evento'}{' '}
      <span aria-hidden="true">↗</span>
    </>
  );
}
