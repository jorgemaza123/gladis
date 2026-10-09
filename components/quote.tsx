'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import type { ContentEntry, PublicCopy } from '@/models/content';
import {
  createWhatsAppMessage,
  createWhatsAppUrl,
} from '@/lib/whatsapp-message';
import type { PublicBusinessContact } from '@/lib/business-contacts';
import { useQuoteCart } from './quote-cart-provider';
import { useAttribution } from './attribution-provider';
import { EventSelection } from './event-selection';
import {
  describeItem,
  selectionErrors,
  type EventEntry,
} from '@/lib/event-selection';
import { todayInLima } from '@/lib/quote-validation';

export type QuoteSite = {
  settings: {
    whatsappMessage: string;
    copy: Pick<
      PublicCopy,
      | 'coverageTitle'
      | 'privacyTitle'
      | 'quoteAsideDescription'
      | 'quoteAsideTitle'
      | 'successDescription'
      | 'successTitle'
    >;
  };
  entries: (Pick<
    ContentEntry,
    | 'id'
    | 'kind'
    | 'title'
    | 'minimumGuests'
    | 'modalityIds'
    | 'addOnIds'
    | 'coverageIds'
    | 'requestable'
    | 'quoteConfig'
  > & {
    recipient: PublicBusinessContact;
    whatsappDestination: string | null;
  })[];
};
const storageKey = 'catering.event-details.v1';
const emptyEvent = {
  occasion: '',
  date: '',
  district: '',
  guests: '',
  budget: '',
};
export function Quote({
  site,
  selection,
  occasion = '',
}: {
  site: QuoteSite;
  selection: string;
  occasion?: string;
}) {
  const { cart, restored, add, restoreNotice } = useQuoteCart();
  const { attribution, recordCta } = useAttribution();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(() => ({ ...emptyEvent, occasion }));
  const [loaded, setLoaded] = useState(false);
  const [attemptedStep, setAttemptedStep] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showServices, setShowServices] = useState(false);
  const initialized = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorHeading = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formId = useId();
  const entries = site.entries.filter(
    (e): e is typeof e & EventEntry => e.requestable && !!e.quoteConfig,
  );
  const primary = cart.items.find((i) => i.itemId === cart.primaryItemId);
  const chosen = entries.find((e) => e.id === primary?.entryId);
  const validation = selectionErrors(cart, entries);
  useEffect(() => {
    if (restored && !initialized.current) {
      initialized.current = true;
      if (selection) add(selection);
    }
  }, [restored, selection, add]);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
        if (
          saved?.savedAt > Date.now() - 86400000 &&
          saved.savedAt <= Date.now() &&
          saved.data
        ) {
          const next = { ...emptyEvent };
          for (const key of Object.keys(next) as (keyof typeof next)[])
            if (typeof saved.data[key] === 'string')
              next[key] = saved.data[key].slice(0, 150);
          if (occasion) next.occasion = occasion;
          setData(next);
        } else if (occasion) {
          setData({ ...emptyEvent, occasion });
        }
      } catch {}
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [occasion]);
  useEffect(() => {
    if (loaded) {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ data, savedAt: Date.now() }),
        );
      } catch {}
    }
  }, [loaded, data]);
  useEffect(() => {
    if (step > 1) heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (!attemptCount) return;
    const firstInvalid =
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    (firstInvalid || errorHeading.current)?.focus();
  }, [attemptCount]);
  const selected = cart.items.flatMap((item) => {
    const entry = entries.find((e) => e.id === item.entryId);
    return entry ? [{ item, entry, detail: describeItem(item, entry) }] : [];
  });
  const summary = createWhatsAppMessage({
    introduction: site.settings.whatsappMessage,
    eventType: data.occasion,
    date: data.date,
    district: data.district,
    guests: Number(data.guests),
    primary: chosen?.title || '',
    extras: selected
      .filter(({ item }) => item.itemId !== cart.primaryItemId)
      .map(({ entry }) => entry.title),
    budget: data.budget,
    items: selected.map(
      ({ item, entry, detail }) =>
        `${item.itemId === cart.primaryItemId ? 'Principal' : 'Adicional'}: ${entry.title} — ${detail}`,
    ),
    origin: attribution
      ? `Entrada: ${attribution.landingPath}; origen: ${attribution.acquisitionEntryId || 'consulta general'}; canal: ${attribution.channel}; campaña: ${Object.values(attribution.utm).join(' / ') || 'sin campaña'}; última página: ${attribution.lastTouchPath}`
      : '',
  });
  function getEventFieldErrors() {
    const next: Partial<Record<keyof typeof emptyEvent, string>> = {};
    if (!data.occasion.trim())
      next.occasion = 'Cuéntanos qué tipo de evento estás organizando.';
    if (
      data.date &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
        data.date < todayInLima() ||
        Number.isNaN(Date.parse(data.date)) ||
        new Date(data.date).toISOString().slice(0, 10) !== data.date)
    )
      next.date = 'Elige una fecha de hoy en adelante.';
    else if (
      selected.some(({ entry }) => entry.quoteConfig.dateRequired) &&
      !data.date
    )
      next.date = 'Indica la fecha del evento.';
    if (
      selected.some(({ entry }) => entry.quoteConfig.districtRequired) &&
      !data.district.trim()
    )
      next.district = 'Indica el distrito del evento.';
    if (
      selected.some(({ entry }) => entry.quoteConfig.guestsRequired) &&
      !data.guests
    )
      next.guests = 'Indica el número estimado de invitados.';
    else if (
      data.guests &&
      (!Number.isInteger(Number(data.guests)) ||
        Number(data.guests) < 1 ||
        Number(data.guests) > 100000)
    )
      next.guests = 'Revisa el número de invitados.';
    return next;
  }
  const eventFieldErrors = getEventFieldErrors();
  const eventErrors = Object.values(eventFieldErrors);
  const errors =
    attemptedStep === step
      ? step === 1
        ? validation
        : step === 2
          ? eventErrors
          : []
      : [];
  const personEstimates = selected.filter(
    ({ item, entry }) =>
      entry.quoteConfig.quantityUnit === 'person' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 100000 &&
      String(item.quantity) !== data.guests,
  );
  const url =
    validation.length || eventErrors.length
      ? null
      : createWhatsAppUrl(chosen?.whatsappDestination || null, summary);
  function advance() {
    if (step >= 3) return;
    if (validation.length) {
      setAttemptedStep(1);
      setStep(1);
      setAttemptCount((count) => count + 1);
      return;
    }
    if (step === 2 && eventErrors.length) {
      setAttemptedStep(2);
      setAttemptCount((count) => count + 1);
      return;
    }
    setAttemptedStep(0);
    setStep(step + 1);
  }
  const field = (
    key: keyof typeof emptyEvent,
    label: string,
    type = 'text',
    required = false,
  ) => {
    const error = attemptedStep === 2 ? eventFieldErrors[key] : undefined;
    const errorId = formId + '-' + key + '-error';
    return (
      <label className="field" key={key}>
        {label}
        <input
          type={type}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          value={data[key]}
          placeholder={key === 'guests' ? 'Ej. 50' : undefined}
          maxLength={150}
          onInput={
            type === 'date'
              ? (e) => setData({ ...data, [key]: e.currentTarget.value })
              : undefined
          }
          min={
            type === 'date' ? todayInLima() : type === 'number' ? 1 : undefined
          }
          max={type === 'number' ? 100000 : undefined}
          onChange={(e) => setData({ ...data, [key]: e.target.value })}
        />
        {error && (
          <span className="field-error" id={errorId}>
            {error}
          </span>
        )}
      </label>
    );
  };
  return (
    <div className="quote-layout">
      <div>
        <noscript>
          <p className="notice">
            Activa JavaScript para preparar tu selección y abrir el WhatsApp del
            responsable.
          </p>
        </noscript>
        <ol className="stepper" aria-label="Pasos de la cotización">
          {['Tu selección', 'Tu evento', 'Revisa y conversa'].map(
            (label, index) => (
              <li
                key={label}
                aria-current={step === index + 1 ? 'step' : undefined}
              >
                <span>{index + 1}</span>
                {label}
              </li>
            ),
          )}
        </ol>
        {restoreNotice && <p className="notice">{restoreNotice}</p>}
        {!!errors.length && (
          <div
            role="alert"
            className="notice error"
            tabIndex={-1}
            ref={errorHeading}
          >
            {errors.map((e) => (
              <p key={e}>{e}</p>
            ))}
          </div>
        )}
        <h2 className="quote-step-title" ref={heading} tabIndex={-1}>
          {
            [
              '¿Qué necesitas para celebrar?',
              'Cuéntanos de tu evento',
              'Todo listo para conversar',
            ][step - 1]
          }
        </h2>
        <form
          ref={formRef}
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            advance();
          }}
        >
          {step === 1 && (
            <>
              <p>
                {cart.items.length
                  ? 'Revisa lo que elegiste. El servicio principal define quién recibe toda tu consulta; puedes sumar otros cuando quieras.'
                  : 'Elige lo que necesitas. Después podrás añadir otros servicios y consultar todo en una sola conversación.'}
              </p>
              {!!cart.items.length && (
                <EventSelection entries={entries} showErrors={attemptedStep === 1} />
              )}
              {chosen && (
                <p className="quote-recipient-inline">
                  Toda la consulta irá a <strong>{chosen.recipient.label}</strong>
                  {chosen.whatsappDestination &&
                    ' · +51 ' + chosen.whatsappDestination.slice(2)}
                </p>
              )}
              <div
                className="service-picker"
                id={formId + '-services'}
                aria-label="Servicios disponibles"
                hidden={!!cart.items.length && !showServices}
              >
                {entries
                  .filter((entry) => !cart.items.some((item) => item.entryId === entry.id))
                  .map((entry) => (
                    <button
                      type="button"
                      key={entry.id}
                      disabled={!restored}
                      onClick={() => {
                        add(entry.id);
                        recordCta(entry.id, 'quote_form');
                        setShowServices(true);
                      }}
                    >
                      + {entry.title}
                    </button>
                  ))}
              </div>
              {!!cart.items.length && cart.items.length < entries.length && (
                <button
                  type="button"
                  className="ghost quote-services-toggle"
                  aria-expanded={showServices}
                  aria-controls={formId + '-services'}
                  onClick={() => setShowServices((open) => !open)}
                >
                  {showServices ? 'Ocultar otros servicios' : 'Añadir otro servicio'}
                </button>
              )}
              <p className="field-help">
                Puedes empezar con cantidades aproximadas. Por WhatsApp
                confirmaremos el precio, la disponibilidad y los detalles.
              </p>
            </>
          )}
          {step === 2 && (
            <>
              <div className="form-grid">
                {field('occasion', '¿Qué vas a celebrar?', 'text', true)}
                {field(
                  'date',
                  'Fecha del evento',
                  'date',
                  selected.some(({ entry }) => entry.quoteConfig.dateRequired),
                )}
                {field(
                  'district',
                  'Distrito de Lima Metropolitana',
                  'text',
                  selected.some(
                    ({ entry }) => entry.quoteConfig.districtRequired,
                  ),
                )}
                {field(
                  'guests',
                  '¿Cuántos invitados esperas?',
                  'number',
                  selected.some(
                    ({ entry }) => entry.quoteConfig.guestsRequired,
                  ),
                )}
                {!!personEstimates.length && (
                  <div className="guest-copy">
                    <p>Si son las mismas personas, puedes reutilizar la cantidad:</p>
                    {personEstimates.map(({ item, entry }) => (
                      <button
                        type="button"
                        className="text-link"
                        key={item.itemId}
                        onClick={() =>
                          setData({ ...data, guests: String(item.quantity) })
                        }
                      >
                        Usar {item.quantity} de {entry.title}
                      </button>
                    ))}
                  </div>
                )}
                {field('budget', 'Presupuesto que tienes en mente (opcional)')}
              </div>
              <p className="field-help">
                Llegamos a todo Lima Metropolitana. Con el distrito y la fecha
                podremos coordinar el traslado y el acceso al lugar.
              </p>
            </>
          )}
          {step === 3 && (
            <section className="event-review">
              <dl className="quote-recap">
                <div>
                  <dt>Celebración</dt>
                  <dd>{data.occasion}</dd>
                </div>
                <div>
                  <dt>Fecha y lugar</dt>
                  <dd>
                    {data.date || 'Por definir'} ·{' '}
                    {data.district || 'Por definir'}
                  </dd>
                </div>
                <div>
                  <dt>Invitados</dt>
                  <dd>{data.guests || 'Por definir'}</dd>
                </div>
                {data.budget && (
                  <div>
                    <dt>Presupuesto aproximado</dt>
                    <dd>{data.budget}</dd>
                  </div>
                )}
              </dl>
              <ul className="review-services">
                {selected.map(({ item, entry, detail }) => (
                  <li key={item.itemId}>
                    <strong>{entry.title}</strong>
                    {item.itemId === cart.primaryItemId && (
                      <span className="principal-label">Principal</span>
                    )}
                    <p>{detail}</p>
                  </li>
                ))}
              </ul>
              <div className="recipient-card">
                <p>Tu consulta la recibe</p>
                <strong>
                  {chosen?.recipient.label || 'Elige un servicio principal'}
                </strong>
                <p>
                  {chosen?.whatsappDestination
                    ? `+51 ${chosen.whatsappDestination.slice(2, 5)} ${chosen.whatsappDestination.slice(5, 8)} ${chosen.whatsappDestination.slice(8)}`
                    : 'Contacto no disponible'}
                </p>
              </div>
              {url ? (
                <Link
                  className="button whatsapp-action"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => recordCta(chosen?.id || null, 'quote_form')}
                >
                  Abrir WhatsApp <span aria-hidden="true">↗</span>
                </Link>
              ) : (
                <p role="alert" className="notice error">
                  {[...validation, ...eventErrors].join(' ') ||
                    'El contacto no está disponible o el resumen es demasiado extenso. Reduce la selección e inténtalo de nuevo.'}
                </p>
              )}
              <p className="field-help">
                Podrás revisar el mensaje en WhatsApp antes de enviarlo.
                La reserva se coordina después, al confirmar los detalles.
              </p>
              <details className="message-preview">
                <summary>Ver el mensaje completo</summary>
                <pre>{summary}</pre>
              </details>
            </section>
          )}
          <div className="form-actions">
            {step > 1 && (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setStep(step - 1);
                  setAttemptedStep(0);
                }}
              >
                Volver a editar
              </button>
            )}
            {step < 3 && (
              <button type="submit" className="button" disabled={!restored}>
                {step === 1 ? 'Continuar con mi evento' : 'Revisar mi consulta'}
              </button>
            )}
          </div>
        </form>
        <p className="draft-note">
          Tu selección se conserva en esta pestaña durante 24 horas, si tu
          navegador lo permite. <Link href="/privacidad">Privacidad</Link>
        </p>
      </div>
      <aside className="quote-aside">
        <span className="table-symbol" aria-hidden="true">
          ✳
        </span>
        <h2>Tu celebración empieza con una conversación.</h2>
        <p>
          Si todavía estás viendo opciones, cuéntanos tu idea y el presupuesto
          que tienes en mente. Lo vamos pensando contigo.
        </p>
        <hr />
        <p>Todos los precios se consultan por WhatsApp.</p>
        {chosen && (
          <p>
            <strong>Te atenderá:</strong>
            <br />
            {chosen.recipient.label}
          </p>
        )}
      </aside>
    </div>
  );
}
