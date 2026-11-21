'use client';

import { useQuoteCart } from './quote-cart-provider';

export function QuotePreviewCard() {
  const { cart, restored } = useQuoteCart();
  const hasItems = restored && cart.items.length > 0;
  const count = cart.items.length;

  return (
    <div className="quote-preview-card" aria-label="Vista previa de tu resumen para WhatsApp">
      <div className="quote-preview-header">
        <span className="quote-preview-dot" aria-hidden="true" />
        <span className="quote-preview-tag">
          {hasItems ? `Tu evento actual · ${count} ${count === 1 ? 'servicio' : 'servicios'}` : 'Así llega tu consulta'}
        </span>
      </div>
      <div className="quote-preview-body">
        {hasItems ? (
          <ul className="quote-preview-list">
            {cart.items.slice(0, 3).map((item) => (
              <li key={item.itemId}>
                <span>{item.entryId.replace(/-/g, ' ')}</span>
                <strong>× {item.quantity}</strong>
              </li>
            ))}
            {count > 3 ? (
              <li className="quote-preview-more">+{count - 3} servicios más incluidos</li>
            ) : null}
          </ul>
        ) : (
          <p className="quote-preview-sample">
            “Hola, quisiera cotizar Buffet criollo + Menaje + 2 mozos para 30 personas en Miraflores…”
          </p>
        )}
      </div>
      <div className="quote-preview-steps" aria-hidden="true">
        <span data-ready="true">1. Servicios</span>
        <span>2. Fecha y distrito</span>
        <span>3. WhatsApp directo</span>
      </div>
    </div>
  );
}
