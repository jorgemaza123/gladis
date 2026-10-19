'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { initialEnquiry, type EnquiryService, type EnquiryEvent } from '@/lib/initial-enquiry';
import { serviceGroup, serviceGroupOrder } from '@/lib/service-groups';
import { useQuoteCart } from './quote-cart-provider';
import { useAttribution } from './attribution-provider';

export function InitialEnquiry({
  entries,
  detailedId,
  event,
}: {
  entries: (EnquiryService & { kind: string; category: string })[];
  detailedId: string;
  event: EnquiryEvent;
}) {
  const { cart, restored } = useQuoteCart();
  const { recordCta } = useAttribution();
  const id = useId();
  const [topic, setTopic] = useState('');
  const [note, setNote] = useState('');
  const enquiry = initialEnquiry({ entries, cart, topic, note, event });
  const hasSelection = cart.items.length > 0;
  const hasPrimary = cart.items.some((item) => item.itemId === cart.primaryItemId);

  return (
    <section className="initial-enquiry" id="consulta-inicial" aria-labelledby={`${id}-title`}>
      <div className="initial-enquiry-heading">
        <h2 id={`${id}-title`}>¿Aún estás definiendo tu evento?</h2>
        <a href={`#${detailedId}`} className="text-link">Ya tengo los datos: preparar cotización</a>
      </div>
      <p>Consulta por WhatsApp aunque todavía no tengas fecha, cantidades o preferencias. El precio y la disponibilidad se confirman después.</p>
      {hasSelection ? (
        <p className="initial-enquiry-selection">Incluiremos los {cart.items.length} {cart.items.length === 1 ? 'servicio que elegiste' : 'servicios que elegiste'}. El principal determina qué equipo recibe toda la consulta.</p>
      ) : (
        <label className="field" htmlFor={`${id}-service`}>
          ¿Sobre qué necesitas orientación?
          <select id={`${id}-service`} value={topic} onChange={(event) => setTopic(event.target.value)} disabled={!restored}>
            <option value="">Elige un servicio o pide orientación</option>
            <optgroup label="Todavía no he elegido un servicio">
              <option value="orientacion-cocina">Cocina, alimentación, bar o menaje</option>
              <option value="orientacion-eventos">Otros servicios para mi evento</option>
            </optgroup>
            {serviceGroupOrder.map((group) => {
              const items = entries.filter((entry) => serviceGroup(entry) === group);
              return items.length ? (
                <optgroup key={group} label={group}>
                  {items.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
                </optgroup>
              ) : null;
            })}
          </select>
        </label>
      )}
      <label className="field" htmlFor={`${id}-note`}>
        Cuéntanos tu idea (opcional)
        <textarea id={`${id}-note`} value={note} maxLength={1200} rows={2} onChange={(event) => setNote(event.target.value)} placeholder="Por ejemplo: estoy organizando un cumpleaños y necesito orientación." />
      </label>
      {restored && enquiry ? (
        <>
          <p className="initial-enquiry-recipient">Te atenderá <strong>{enquiry.recipientLabel}</strong> · +51 {enquiry.destination.slice(2, 5)} {enquiry.destination.slice(5, 8)} {enquiry.destination.slice(8)}</p>
          <Link className="button" href={enquiry.href} target="_blank" rel="noopener noreferrer" onClick={() => recordCta(enquiry.entryId, 'quote_form')}>
            Consultar por WhatsApp <span aria-hidden="true">↗</span>
          </Link>
        </>
      ) : (
        <p className="field-help">{!restored ? 'Preparando tu selección…' : hasSelection && !hasPrimary ? 'Elige el servicio principal en la selección de abajo para dirigir tu consulta.' : hasSelection || topic ? 'No pudimos preparar el mensaje completo. Revisa tu selección o continúa con la cotización detallada.' : 'Elige una opción para consultar con el equipo correspondiente.'}</p>
      )}
      <p className="field-help">El mensaje se abre en WhatsApp para que lo revises antes de enviarlo. Esta consulta no confirma una reserva.</p>
    </section>
  );
}
