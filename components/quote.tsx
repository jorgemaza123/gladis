'use client';
import { useEffect, useRef, useState } from 'react';
import type { ContentEntry, PublicCopy } from '@/models/content';
import { createWhatsAppMessage, createWhatsAppUrl } from '@/lib/whatsapp-message';
import type { PublicBusinessContact } from '@/lib/business-contacts';
import { useQuoteCart } from '@/components/quote-cart-provider';
import { useAttribution } from '@/components/attribution-provider';

// Explicit public projection: never serialize the CMS aggregate into this client.
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
    'id' | 'kind' | 'title' | 'minimumGuests' | 'modalityIds' | 'addOnIds' | 'coverageIds' | 'requestable' | 'quoteConfig'
  > & { recipient: PublicBusinessContact; whatsappDestination: string | null })[];
};
type QuoteFormData = {
  eventTypeId: string;
  eventTypeOther: string;
  date: string;
  district: string;
  people: number;
  selectionId: string;
  modalityId: string;
  addOnIds: string[];
  budget: string;
};
import { todayInLima } from '@/lib/quote-validation';
const storageKey = 'catering.quote-draft.v2';
export function Quote({
  site,
  selection,
}: {
  site: QuoteSite;
  selection: string;
}) {
  const { cart, restored: cartRestored } = useQuoteCart();
  const { recordCta } = useAttribution();
  const [step, setStep] = useState(1),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState(''),
    [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}),
    [result, setResult] = useState(false);
  const lock = useRef(false);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ready) reviewHeading.current?.focus();
  }, [ready]);
  useEffect(() => {
    if (error) errorSummary.current?.focus();
  }, [error]);
  const [data, setData] = useState<QuoteFormData>({
    eventTypeId: '',
    eventTypeOther: '',
    date: '',
    district: '',
    people: 0,
    selectionId: selection,
    modalityId: '',
    addOnIds: [],
    budget: '',
  });
  const c = site.settings.copy;
  const entries = site.entries;
  const events = entries.filter((e) => e.kind === 'tipos-evento');
  const main = entries.filter((e) =>
    ['servicios', 'menus', 'paquetes'].includes(e.kind),
  );
  const cartPrimary = cart.items.find((item) => item.itemId === cart.primaryItemId) || null;
  const cartPrimaryEntry = cartPrimary
    ? entries.find((entry) => entry.id === cartPrimary.entryId)
    : undefined;
  const usingCart = cartRestored && cart.items.length > 0;
  const chosen = usingCart
    ? cartPrimaryEntry
    : main.find((e) => e.id === data.selectionId);
  const modalities = entries.filter(
    (e) =>
      e.kind === 'modalidades' &&
      (!chosen?.modalityIds.length || chosen.modalityIds.includes(e.id)),
  );
  const extras = entries.filter(
    (e) =>
      e.kind === 'complementos' &&
      (!chosen?.addOnIds.length || chosen.addOnIds.includes(e.id)),
  );
  const coverage = entries.filter(
    (e) =>
      e.kind === 'cobertura' &&
      (!chosen?.coverageIds.length || chosen.coverageIds.includes(e.id)),
  );
  const event = events.find((e) => e.id === data.eventTypeId);
  const modality = modalities.find((e) => e.id === data.modalityId);
  const addons = usingCart
    ? cart.items
      .filter((item) => item.itemId !== cart.primaryItemId)
      .map((item) => entries.find((entry) => entry.id === item.entryId))
      .filter((entry): entry is QuoteSite['entries'][number] => !!entry)
    : extras.filter((e) => data.addOnIds.includes(e.id));
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const draft = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
        if (draft && draft.savedAt > Date.now() - 86400000 && draft.data) {
          const saved = draft.data as Partial<QuoteFormData>;
          setData((current) => ({
            ...current,
            eventTypeId: typeof saved.eventTypeId === 'string' ? saved.eventTypeId : '',
            eventTypeOther: typeof saved.eventTypeOther === 'string' ? saved.eventTypeOther : '',
            date: typeof saved.date === 'string' ? saved.date : '',
            district: typeof saved.district === 'string' ? saved.district : '',
            people: typeof saved.people === 'number' ? saved.people : 0,
            selectionId: selection || (typeof saved.selectionId === 'string' ? saved.selectionId : ''),
            modalityId: typeof saved.modalityId === 'string' ? saved.modalityId : '',
            addOnIds: Array.isArray(saved.addOnIds)
              ? saved.addOnIds.filter((id): id is string => typeof id === 'string')
              : [],
            budget: typeof saved.budget === 'string' ? saved.budget : '',
          }));
        }
      } catch {}
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [selection]);
  useEffect(() => {
    if (!loaded || result) return;
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          data: {
            eventTypeId: data.eventTypeId,
            eventTypeOther: data.eventTypeOther,
            date: data.date,
            district: data.district,
            people: data.people,
            selectionId: data.selectionId,
            modalityId: data.modalityId,
            addOnIds: data.addOnIds,
            budget: data.budget,
          },
          savedAt: Date.now(),
        }),
      );
    } catch {
      /* Storage can be disabled. The form remains usable in memory. */
    }
  }, [data, loaded, result]);
  function change<K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) {
    if (lock.current) return;
    setData((d) => ({ ...d, [key]: value }));
    setReady(false);
    setFieldErrors((e) => ({ ...e, [key]: '' }));
    setError('');
  }
  const summary = createWhatsAppMessage({
    introduction: site.settings.whatsappMessage,
    eventType: event?.title || data.eventTypeOther,
    date: data.date,
    district: data.district,
    guests: data.people,
    primary: chosen?.title || 'Necesito orientación',
    extras: addons.map((entry) => entry.title),
    budget: data.budget,
  });
  function send() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      recordCta(chosen?.id || null, 'quote_form');
      setResult(true);
      try {
        sessionStorage.removeItem(storageKey);
      } catch {}
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const field = (
    key:
      | 'date'
      | 'district'
      | 'people'
      | 'budget'
      | 'eventTypeOther',
    label: string,
    type = 'text',
    required = true,
  ) => (
    <label className="field" key={key} htmlFor={`quote-${key}`}>
      {label}
      <input
        id={`quote-${key}`}
        name={key}
        type={type}
        required={required}
        value={data[key] || ''}
        min={
          type === 'number' ? 1 : type === 'date' ? todayInLima() : undefined
        }
        max={type === 'number' ? 100000 : undefined}
        maxLength={150}
        autoComplete="off"
        inputMode={
          type === 'number' ? 'numeric' : undefined
        }
        aria-invalid={!!fieldErrors[key]}
        aria-describedby={fieldErrors[key] ? `error-${key}` : undefined}
        onInput={
          type === 'date'
            ? (e) => change('date', e.currentTarget.value)
            : undefined
        }
        onChange={(e) =>
          change(
            key,
            key === 'people'
              ? Number(e.target.value)
              : (e.target.value as never),
          )
        }
      />
      {fieldErrors[key] && (
        <small id={`error-${key}`} className="field-error">
          {fieldErrors[key]}
        </small>
      )}
    </label>
  );
  const recap = (
    <dl className="quote-recap">
      <div>
        <dt>Evento</dt>
        <dd>{event?.title || data.eventTypeOther || 'Por definir'}</dd>
      </div>
      <div>
        <dt>Fecha y lugar</dt>
        <dd>
          {data.date || 'Por definir'} ·{' '}
          {data.district || 'Distrito por definir'}
        </dd>
      </div>
      <div>
        <dt>Invitados</dt>
        <dd>{data.people || 'Por definir'}</dd>
      </div>
      <div>
        <dt>Propuesta</dt>
        <dd>{chosen?.title || 'Necesito orientación'}</dd>
      </div>
      {modality && (
        <div>
          <dt>Modalidad</dt>
          <dd>{modality.title}</dd>
        </div>
      )}
      {addons.length > 0 && (
        <div>
          <dt>Complementos</dt>
          <dd>{addons.map((e) => e.title).join(', ')}</dd>
        </div>
      )}
      {data.budget && (
        <div>
          <dt>Presupuesto orientativo</dt>
          <dd>{data.budget}</dd>
        </div>
      )}
    </dl>
  );
  const whatsappUrl = createWhatsAppUrl(chosen?.whatsappDestination || null, summary);
  const whatsapp = whatsappUrl ? (
    <a
      className="button secondary"
      target="_blank"
      rel="noreferrer"
      href={whatsappUrl}
    >
      Continuar por WhatsApp ↗
    </a>
  ) : null;
  if (result)
    return (
      <section className="quote-result" aria-live="polite">
        <p className="eyebrow">
          Conversación preparada
        </p>
        <h2>{c.successTitle}</h2>
        <p>
          Esta versión no guarda solicitudes en una base de datos. Puedes abrir
            WhatsApp y decidir si envías el mensaje para continuar la coordinación.
        </p>
        {recap}
        {whatsapp}
        {whatsapp && <p>Abrir WhatsApp no envía el mensaje automáticamente.</p>}
        {!whatsapp && (
          <p className="notice error">
            No hay WhatsApp disponible para esta oferta. No se guardó ninguna solicitud.
          </p>
        )}
        <a className="text-link" href="/">
          Volver al inicio
        </a>
      </section>
    );
  return (
    <div className="quote-layout">
      <div>
        <noscript>
          <output className="notice">
            Esta cotización prepara la conversación en tu navegador. Activa JavaScript y vuelve a seleccionar una oferta para ver el responsable correspondiente.
          </output>
        </noscript>
        <ol className="stepper" aria-label="Pasos de la cotización">
          {['Tu evento', 'La propuesta', 'Revisión'].map((label, i) => (
            <li key={label} aria-current={step === i + 1 ? 'step' : undefined}>
              {i + 1}. {label}
            </li>
          ))}
        </ol>
        <p className="draft-note">
          La selección y los datos del evento se conservan temporalmente en esta
          pestaña. No se registran solicitudes ni datos de contacto en un servidor.
        </p>
        {error && (
          <div
            className="notice error"
            role="alert"
            ref={errorSummary}
            tabIndex={-1}
          >
            {error}
            {Object.values(fieldErrors)
              .filter(Boolean)
              .map((e, i) => (
                <p key={i}>{e}</p>
              ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError('');
            if (step < 3) setStep(step + 1);
            else setReady(true);
          }}
        >
          <fieldset disabled={busy} className="quote-fields">
            <div className="form-grid">
              {step === 1 && (
                <>
                  {events.length > 0 && (
                    <label className="field">
                      Tipo de evento
                      <select
                        value={data.eventTypeId}
                        onChange={(e) => change('eventTypeId', e.target.value)}
                      >
                        <option value="">Otro / describir mi evento</option>
                        {events.map((e) => (
                          <option value={e.id} key={e.id}>
                            {e.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {!data.eventTypeId &&
                    field('eventTypeOther', 'Tipo de evento')}
                  {field('date', 'Fecha del evento', 'date', chosen?.quoteConfig?.dateRequired ?? true)}
                  {field('district', 'Distrito', 'text', chosen?.quoteConfig?.districtRequired ?? true)}
                  {field('people', 'Número de personas', 'number', chosen?.quoteConfig?.guestsRequired ?? true)}
                  <div className="wide">
                    <p className="field-help">{c.coverageTitle}</p>
                    {coverage.length > 0 ? (
                      <p className="field-help">
                        {coverage.map((e) => e.title).join(' · ')}. La disponibilidad
                        final se confirma al coordinar.
                      </p>
                    ) : (
                      <p className="field-help">
                        Indica tu distrito. Confirmaremos cobertura y condiciones antes de coordinar.
                      </p>
                    )}
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  {usingCart && (
                    <p className="wide field-help">
                      Tu bolsa tiene {cart.items.length} {cart.items.length === 1 ? 'oferta' : 'ofertas'}.
                      {chosen ? ` La principal es ${chosen.title}.` : ' Elige una oferta principal en “Revisar bolsa”.'}
                    </p>
                  )}
                  <label className="field wide">
                    Servicio, menú o paquete
                    <select
                      value={data.selectionId}
                      onChange={(e) => {
                        change('selectionId', e.target.value);
                        setData((d) => ({
                          ...d,
                          modalityId: '',
                          addOnIds: [],
                        }));
                      }}
                    >
                      <option value="">Necesito orientación</option>
                      {main.map((e) => (
                        <option value={e.id} key={e.id}>
                          {e.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  {chosen?.minimumGuests && (
                    <p className="wide field-help">
                      Mínimo configurado: {chosen.minimumGuests} personas.
                    </p>
                  )}
                  {modalities.length > 0 && (
                    <label className="field wide">
                      Modalidad
                      <select
                        value={data.modalityId}
                        onChange={(e) => change('modalityId', e.target.value)}
                      >
                        <option value="">Necesito orientación</option>
                        {modalities.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {extras.length > 0 && (
                    <fieldset className="wide addon-options">
                      <legend>Complementos opcionales</legend>
                      {extras.map((e) => (
                        <label className="check" key={e.id}>
                          <input
                            type="checkbox"
                            checked={data.addOnIds.includes(e.id)}
                            onChange={(event) =>
                              change(
                                'addOnIds',
                                event.target.checked
                                  ? [...data.addOnIds, e.id]
                                  : data.addOnIds.filter((id) => id !== e.id),
                              )
                            }
                          />
                          {e.title}
                        </label>
                      ))}
                    </fieldset>
                  )}
                  {field(
                    'budget',
                    'Presupuesto aproximado (opcional)',
                    'text',
                    false,
                  )}
                </>
              )}
              {step === 3 && (
                <>
                  <p className="wide field-help">
                    No pedimos ni guardamos tu nombre, teléfono, correo o comentarios en esta web. Al continuar, podrás decidir si abres WhatsApp y envías el mensaje preparado.
                  </p>
                  <a
                    className="text-link"
                    href="/privacidad"
                  >
                    {c.privacyTitle}
                  </a>
                </>
              )}
            </div>
            <div className="form-actions">
              {step > 1 && (
                <button
                  type="button"
                  className="ghost"
                  onClick={() => {
                    setStep(step - 1);
                    setReady(false);
                  }}
                >
                  ← Atrás
                </button>
              )}
              <button className="button" type="submit">
                {step < 3 ? 'Continuar →' : 'Revisar resumen'}
              </button>
            </div>
          </fieldset>
        </form>
        {ready && (
          <section className="panel quote-review">
            <h2 ref={reviewHeading} tabIndex={-1}>
              Revisa la conversación
            </h2>
            {recap}
            <div className="form-actions">
              <button
                type="button"
                className="button"
                disabled={busy}
                onClick={send}
              >
                {busy ? 'Preparando conversación…' : 'Preparar conversación'}
              </button>
              {!busy && whatsapp}
            </div>
            <p className="field-help">
              Preparar conversación no guarda los datos. Abrir WhatsApp prepara
              un mensaje que tú decides enviar.
            </p>
          </section>
        )}
        <button
          className="text-link reset-draft"
          type="button"
          disabled={busy}
          onClick={() => {
            if (confirm('¿Borrar este borrador y empezar de nuevo?')) {
              try {
                sessionStorage.removeItem(storageKey);
              } catch {}
              window.location.reload();
            }
          }}
        >
          Borrar borrador
        </button>
      </div>
      <aside className="quote-summary">
        <h2>{c.quoteAsideTitle}</h2>
        <p>{c.quoteAsideDescription}</p>
        {recap}
      </aside>
    </div>
  );
}
