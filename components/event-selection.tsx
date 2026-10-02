'use client';
import { useQuoteCart } from './quote-cart-provider';
import { type EventEntry } from '@/lib/event-selection';

export function EventSelection({
  entries,
  prefix = 'event',
}: {
  entries: EventEntry[];
  prefix?: string;
}) {
  const { cart, dispatch } = useQuoteCart();
  return (
    <div className="event-lines">
      {cart.items.map((item) => {
        const entry = entries.find((e) => e.id === item.entryId);
        const primary = item.itemId === cart.primaryItemId;
        return (
          <article
            key={item.itemId}
            className="event-line"
            data-primary={primary}
          >
            <div className="event-line-heading">
              <h3>{entry?.title || 'Servicio no disponible'}</h3>
              <button
                type="button"
                className="remove-service"
                aria-label={`Quitar ${entry?.title || 'servicio'}`}
                onClick={() =>
                  dispatch({ type: 'remove', itemId: item.itemId })
                }
              >
                Quitar
              </button>
            </div>
            {entry && (
              <>
                <label className="check primary-choice">
                  <input
                    type="radio"
                    name={`${prefix}-primary`}
                    checked={primary}
                    onChange={() =>
                      dispatch({ type: 'setPrimary', itemId: item.itemId })
                    }
                  />
                  <span>
                    {primary ? 'Servicio principal' : 'Elegir como principal'}
                  </span>
                </label>
                <div className="event-line-fields">
                  <label className="field">
                    {
                      {
                        person: 'Personas para este servicio',
                        unit: 'Cantidad estimada',
                        hour: 'Horas',
                        event: 'Eventos',
                      }[entry.quoteConfig.quantityUnit]
                    }
                    <input
                      aria-label={`Cantidad de ${entry.title}`}
                      type="number"
                      required
                      min={entry.quoteConfig.minimum}
                      max={entry.quoteConfig.maximum}
                      step={entry.quoteConfig.step}
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch({
                          type: 'update',
                          itemId: item.itemId,
                          quantity: Number(e.target.value),
                          optionValues: item.optionValues,
                        })
                      }
                    />
                  </label>
                  {entry.quoteConfig.options.map((option) => (
                    <label className="field" key={option.id}>
                      {option.label}
                      {!option.required && ' (opcional)'}
                      <select
                        required={option.required}
                        value={item.optionValues[option.id] || ''}
                        onChange={(e) =>
                          dispatch({
                            type: 'update',
                            itemId: item.itemId,
                            quantity: item.quantity,
                            optionValues: {
                              ...item.optionValues,
                              [option.id]: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">Selecciona una opción</option>
                        {option.values.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
