'use client';

import { useState } from 'react';
import { useQuoteCart } from './quote-cart-provider';
import { useAttribution } from './attribution-provider';
import { useAnalytics } from './analytics-provider';

type PresetItem = {
  entryId: string;
  quantity: number;
};

type EventPreset = {
  id: string;
  badge: string;
  title: string;
  summary: string;
  benefit: string;
  items: PresetItem[];
};

const EVENT_PRESETS: EventPreset[] = [
  {
    id: 'cumpleanos-30',
    badge: '30 personas',
    title: 'Cumpleaños en casa',
    summary: 'Menú criollo + Menaje completo + 2 mozos',
    benefit: 'Ideal para no preocuparte por platos, cubiertos ni servicio en casa.',
    items: [
      { entryId: 'menu-criollo-eventos', quantity: 30 },
      { entryId: 'menaje-evento', quantity: 30 },
      { entryId: 'mozos-evento', quantity: 2 },
    ],
  },
  {
    id: 'coffee-break-25',
    badge: '25 personas',
    title: 'Coffee break corporativo',
    summary: 'Desayuno y coffee break + Menaje + 1 mozo',
    benefit: 'Pensado para reuniones o capacitaciones puntuales sin improvisar.',
    items: [
      { entryId: 'desayuno-corporativo', quantity: 25 },
      { entryId: 'menaje-evento', quantity: 25 },
      { entryId: 'mozos-evento', quantity: 1 },
    ],
  },
  {
    id: 'celebracion-50',
    badge: '50 personas',
    title: 'Celebración o aniversario',
    summary: 'Buffet para eventos + Bartender + Menaje + 3 mozos',
    benefit: 'Cubre comida, barra y atención continua para que solo te dediques a recibir.',
    items: [
      { entryId: 'buffet-para-eventos', quantity: 50 },
      { entryId: 'bar-bartender', quantity: 1 },
      { entryId: 'menaje-evento', quantity: 50 },
      { entryId: 'mozos-evento', quantity: 3 },
    ],
  },
];

export function EventPresets() {
  const { cart, restored, add } = useQuoteCart();
  const { recordCta } = useAttribution();
  const { trackQuoteStarted } = useAnalytics();
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const isPresetLoaded = (preset: EventPreset) =>
    preset.items.every((item) =>
      cart.items.some((cartItem) => cartItem.entryId === item.entryId),
    );

  const applyPreset = (preset: EventPreset) => {
    for (const item of preset.items) {
      add(item.entryId, item.quantity);
    }
    recordCta(preset.items[0]?.entryId || null, 'recommendation');
    trackQuoteStarted({
      placement: 'event_preset',
      serviceId: preset.id,
      itemsCount: Math.max(cart.items.length, preset.items.length),
    });
    setAppliedId(preset.id);
  };

  return (
    <div className="event-presets" aria-label="Plantillas rápidas de evento">
      <div className="event-presets-heading">
        <div>
          <p className="section-kicker">¿No sabes por dónde empezar?</p>
          <h3>Carga una combinación base en 1 clic</h3>
        </div>
        <p>Luego ajustas cantidades o agregas lo que falte antes de abrir WhatsApp.</p>
      </div>
      <div className="event-presets-grid">
        {EVENT_PRESETS.map((preset) => {
          const loaded = isPresetLoaded(preset);
          const active = loaded || appliedId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              className="event-preset-card"
              disabled={!restored}
              data-selected={active ? 'true' : undefined}
              onClick={() => applyPreset(preset)}
            >
              <span className="event-preset-badge">{preset.badge}</span>
              <strong>{preset.title}</strong>
              <span className="event-preset-summary">{preset.summary}</span>
              <span className="event-preset-benefit">{preset.benefit}</span>
              <span className="event-preset-action">
                {active ? '✓ Cargado en Mi evento' : '+ Cargar combinación'}
              </span>
            </button>
          );
        })}
      </div>
      {restored && cart.items.length > 0 ? (
        <output className="event-presets-live-status" aria-live="polite">
          <span>
            Listo en tu evento:{' '}
            <strong>
              {cart.items.length} {cart.items.length === 1 ? 'servicio cargado' : 'servicios cargados'}
            </strong>
          </span>
          <a href="#como-cotizar">Ver cómo se envía por WhatsApp ↓</a>
        </output>
      ) : null}
    </div>
  );
}
