'use client';

import { useState } from 'react';

const CORPORATE_MOMENTS = [
  {
    id: 'coffee',
    time: '08:30',
    label: 'Desayunos & Coffee break',
    detail: 'Montaje temprano para directorios, capacitaciones y recibimiento de equipos.',
  },
  {
    id: 'lunch',
    time: '13:00',
    label: 'Almuerzos ejecutivos',
    detail: 'Buffet o menú servido con menaje y personal coordinado sin interrumpir tu agenda.',
  },
  {
    id: 'evening',
    time: '19:00',
    label: 'Lanzamientos & Fin de año',
    detail: 'Barra, cócteles, mobiliario, sonido y atención integral en una sola propuesta.',
  },
] as const;

export function CompanyMoments() {
  const [activeId, setActiveId] = useState<(typeof CORPORATE_MOMENTS)[number]['id']>('coffee');
  const active = CORPORATE_MOMENTS.find((m) => m.id === activeId) ?? CORPORATE_MOMENTS[0];

  return (
    <div className="company-moments" aria-label="Momentos de un evento corporativo">
      <div className="company-moments-tabs" role="tablist" aria-label="Horarios corporativos">
        {CORPORATE_MOMENTS.map((moment) => {
          const selected = moment.id === activeId;
          return (
            <button
              key={moment.id}
              type="button"
              role="tab"
              aria-selected={selected}
              data-active={selected ? 'true' : undefined}
              className="company-moment-tab"
              onMouseEnter={() => setActiveId(moment.id)}
              onFocus={() => setActiveId(moment.id)}
              onClick={() => setActiveId(moment.id)}
            >
              <span className="company-moment-time">{moment.time}</span>
              <span className="company-moment-name">{moment.label}</span>
            </button>
          );
        })}
      </div>
      <p className="company-moment-detail" role="tabpanel">
        <strong>{active.time} · {active.label}:</strong> {active.detail}
      </p>
    </div>
  );
}
