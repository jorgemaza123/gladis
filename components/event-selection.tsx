'use client';
import { useQuoteCart } from './quote-cart-provider';
import { type EventEntry } from '@/lib/event-selection';

export function EventSelection({
  entries,
  prefix = 'event',
  showErrors = false,
}: {
  entries: EventEntry[];
  prefix?: string;
  showErrors?: boolean;
}) {
  const { cart, dispatch } = useQuoteCart();
  return (
    <div className="event-lines">
      {cart.items.map((item) => {
        const entry = entries.find((e) => e.id === item.entryId);
        const primary = item.itemId === cart.primaryItemId;
        const config = entry?.quoteConfig;
        const quantityError =
          showErrors &&
          config &&
          (!Number.isInteger(item.quantity) ||
            item.quantity < config.minimum ||
            item.quantity > config.maximum ||
            (item.quantity - config.minimum) % config.step !== 0)
            ? 'Indica una cantidad entre ' +
              config.minimum +
              ' y ' +
              config.maximum +
              ', en incrementos de ' +
              config.step +
              '.'
            : '';
        const quantityErrorId = prefix + '-' + item.itemId + '-quantity-error';
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
                      aria-invalid={!!quantityError}
                      aria-describedby={quantityError ? quantityErrorId : undefined}
                      min={entry.quoteConfig.minimum}
                      max={entry.quoteConfig.maximum}
                      step={entry.quoteConfig.step}
                      value={item.quantity === 0 ? '' : item.quantity}
                      placeholder={entry.quoteConfig.quantityUnit === 'person' ? 'Ej. 50' : 'Indica una cantidad'}
                      onChange={(e) =>
                        dispatch({
                          type: 'update',
                          itemId: item.itemId,
                          quantity: e.target.value === '' ? 0 : Number(e.target.value),
                          optionValues: item.optionValues,
                        })
                      }
                    />
                    {quantityError && (
                      <span className="field-error" id={quantityErrorId}>
                        {quantityError}
                      </span>
                    )}
                  </label>
                  {entry.quoteConfig.options.map((option) => {
                    const value = item.optionValues[option.id] || '';
                    const optionError =
                      showErrors &&
                      ((option.required && !value) ||
                        (value && !option.values.some((v) => v.id === value)))
                        ? 'Elige ' + option.label.toLowerCase() + '.'
                        : '';
                    const errorId =
                      prefix + '-' + item.itemId + '-' + option.id + '-error';
                    return (
                      <label className="field" key={option.id}>
                        {option.label}
                        {!option.required && ' (opcional)'}
                        <select
                          required={option.required}
                          aria-invalid={!!optionError}
                          aria-describedby={optionError ? errorId : undefined}
                          value={value}
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
                        {optionError && (
                          <span className="field-error" id={errorId}>
                            {optionError}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
