'use client';
import { useEffect, useRef, useState } from 'react';
import type { ContentEntry, PublicCopy, QuoteInput } from '@/models/content';

// Explicit public projection: never serialize the CMS aggregate into this client.
export type QuoteSite = {
  settings: {
    whatsapp: string;
    whatsappMessage: string;
    copy: Pick<
      PublicCopy,
      | 'consent'
      | 'coverageTitle'
      | 'privacyTitle'
      | 'quoteAsideDescription'
      | 'quoteAsideTitle'
      | 'successDescription'
      | 'successTitle'
    >;
  };
  entries: Pick<
    ContentEntry,
    'id' | 'kind' | 'title' | 'minimumGuests' | 'modalityIds' | 'addOnIds'
  >[];
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
  const [step, setStep] = useState(1),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState(''),
    [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}),
    [result, setResult] = useState<{ reference: string; demo: boolean } | null>(
      null,
    );
  const lock = useRef(false);
  const reviewHeading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ready) reviewHeading.current?.focus();
  }, [ready]);
  useEffect(() => {
    if (error) errorSummary.current?.focus();
  }, [error]);
  const [data, setData] = useState<QuoteInput>({
    requestId: '',
    eventTypeId: '',
    eventTypeOther: '',
    date: '',
    district: '',
    people: 0,
    selectionId: selection,
    modalityId: '',
    addOnIds: [],
    budget: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
    consent: false,
    website: '',
    startedAt: 0,
  });
  const c = site.settings.copy;
  const entries = site.entries;
  const events = entries.filter((e) => e.kind === 'tipos-evento');
  const main = entries.filter((e) =>
    ['servicios', 'menus', 'paquetes'].includes(e.kind),
  );
  const chosen = main.find((e) => e.id === data.selectionId);
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
  const event = events.find((e) => e.id === data.eventTypeId);
  const modality = modalities.find((e) => e.id === data.modalityId);
  const addons = extras.filter((e) => data.addOnIds.includes(e.id));
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const draft = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
        if (draft && draft.savedAt > Date.now() - 86400000 && draft.data) {
          setData((current) => ({
            ...current,
            ...draft.data,
            selectionId: selection || draft.data.selectionId,
            consent: false,
            requestId: draft.data.requestId || crypto.randomUUID(),
          }));
        } else
          setData((d) => ({
            ...d,
            requestId: crypto.randomUUID(),
            startedAt: Date.now(),
          }));
      } catch {
        setData((d) => ({
          ...d,
          requestId: crypto.randomUUID(),
          startedAt: Date.now(),
        }));
      }
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
        JSON.stringify({ data, savedAt: Date.now() }),
      );
    } catch {
      /* Storage can be disabled. The form remains usable in memory. */
    }
  }, [data, loaded, result]);
  function change<K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) {
    if (lock.current) return;
    setData((d) => ({ ...d, [key]: value }));
    setReady(false);
    setFieldErrors((e) => ({ ...e, [key]: '' }));
    setError('');
  }
  const summary = `${site.settings.whatsappMessage}\n${result ? `Referencia: ${result.reference}\n` : ''}\nEvento: ${event?.title || data.eventTypeOther}\nFecha: ${data.date}\nDistrito: ${data.district}\nPersonas: ${data.people}\nPropuesta: ${chosen?.title || 'Necesito orientación'}\nModalidad: ${modality?.title || 'Por coordinar'}\nComplementos: ${addons.map((e) => e.title).join(', ') || 'Ninguno seleccionado'}\nPresupuesto orientativo: ${data.budget || 'Por definir'}\nNombre: ${data.name}\nTeléfono: ${data.phone}\nCorreo: ${data.email || 'No indicado'}\nComentarios: ${data.notes}`;
  async function send() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!r.ok) {
        if (r.headers.get('content-type')?.includes('application/json')) {
          const failure = (await r.json()) as {
            message: string;
            errors: Record<string, string>;
          };
          setFieldErrors(failure.errors || {});
          throw new Error(failure.message);
        }
        throw new Error(await r.text());
      }
      const saved = (await r.json()) as { reference: string; demo: boolean };
      setResult(saved);
      try {
        sessionStorage.removeItem(storageKey);
      } catch {}
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'No se pudo conectar. Tu borrador se conserva para reintentar.',
      );
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
      | 'name'
      | 'phone'
      | 'email'
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
        maxLength={key === 'phone' ? 25 : 150}
        autoComplete={
          key === 'name'
            ? 'name'
            : key === 'phone'
              ? 'tel'
              : key === 'email'
                ? 'email'
                : 'off'
        }
        inputMode={
          key === 'phone' ? 'tel' : type === 'number' ? 'numeric' : undefined
        }
        pattern={key === 'phone' ? '[+()0-9\\s-]{7,25}' : undefined}
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
      {data.name && (
        <div>
          <dt>Contacto</dt>
          <dd>
            {data.name} · {data.phone}
            {data.email && ` · ${data.email}`}
          </dd>
        </div>
      )}
      {data.notes && (
        <div>
          <dt>Comentarios</dt>
          <dd>{data.notes}</dd>
        </div>
      )}
    </dl>
  );
  const whatsapp = site.settings.whatsapp ? (
    <a
      className="button secondary"
      target="_blank"
      rel="noreferrer"
      href={`https://wa.me/${site.settings.whatsapp}?text=${encodeURIComponent(summary)}`}
    >
      Continuar por WhatsApp ↗
    </a>
  ) : null;
  if (result)
    return (
      <section className="quote-result" aria-live="polite">
        <p className="eyebrow">
          {result.demo
            ? 'Solicitud de demostración guardada'
            : 'Solicitud registrada'}
        </p>
        <h2>{c.successTitle}</h2>
        <p>
          {result.demo
            ? 'Este registro es una prueba del sistema; no confirma una reserva ni solicita atención comercial.'
            : c.successDescription}
        </p>
        <p className="reference">{result.reference}</p>
        {recap}
        {whatsapp}
        {whatsapp && <p>Abrir WhatsApp no envía el mensaje automáticamente.</p>}
        <a className="text-link" href="/">
          Volver al inicio
        </a>
      </section>
    );
  return (
    <div className="quote-layout">
      <div>
        <ol className="stepper" aria-label="Pasos de la cotización">
          {['Tu evento', 'La propuesta', 'Contacto'].map((label, i) => (
            <li key={label} aria-current={step === i + 1 ? 'step' : undefined}>
              {i + 1}. {label}
            </li>
          ))}
        </ol>
        <p className="draft-note">
          El borrador se conserva temporalmente en esta pestaña. No se registra
          hasta pulsar Enviar solicitud.
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
                  {field('date', 'Fecha del evento', 'date')}
                  {field('district', 'Distrito')}
                  {field('people', 'Número de personas', 'number')}
                  <div className="wide">
                    <p className="field-help">{c.coverageTitle}</p>
                    {entries.filter((e) => e.kind === 'cobertura').length >
                      0 && (
                      <p className="field-help">
                        {entries
                          .filter((e) => e.kind === 'cobertura')
                          .map((e) => e.title)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                </>
              )}
              {step === 2 && (
                <>
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
                  <label className="field wide">
                    Comentarios y necesidades (opcional)
                    <textarea
                      maxLength={2500}
                      value={data.notes}
                      onChange={(e) => change('notes', e.target.value)}
                    />
                  </label>
                </>
              )}
              {step === 3 && (
                <>
                  {field('name', 'Nombre')}
                  {field('phone', 'Teléfono', 'tel')}
                  {field('email', 'Correo (opcional)', 'email', false)}
                  <label className="check wide">
                    <input
                      required
                      type="checkbox"
                      checked={data.consent}
                      onChange={(e) => change('consent', e.target.checked)}
                    />
                    {c.consent}
                  </label>
                  <a
                    className="text-link"
                    target="_blank"
                    rel="noreferrer"
                    href="/privacidad"
                  >
                    {c.privacyTitle} ↗
                  </a>
                  <label className="honeypot" aria-hidden="true">
                    Sitio web
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      value={data.website}
                      onChange={(e) => change('website', e.target.value)}
                    />
                  </label>
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
              Revisa tu solicitud
            </h2>
            {recap}
            <div className="form-actions">
              <button
                type="button"
                className="button"
                disabled={busy}
                onClick={send}
              >
                {busy ? 'Guardando solicitud…' : 'Enviar solicitud'}
              </button>
              {!busy && whatsapp}
            </div>
            <p className="field-help">
              Enviar solicitud guarda los datos. Abrir WhatsApp prepara un
              mensaje que tú decides enviar.
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
