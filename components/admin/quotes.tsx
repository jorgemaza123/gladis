import { useEffect, useState, useRef } from 'react';
import { type QuoteRequest, type QuoteStatus } from '@/models/content';
import { Field, Select } from './fields';
const statusNames: Record<QuoteStatus, string> = {
  new: 'Nueva',
  reviewing: 'En revisión',
  quoted: 'Cotizada',
  confirmed: 'Confirmada',
  closed: 'Cerrada',
};
async function json(
  r: Response,
): Promise<{ items: QuoteRequest[]; total: number; pageSize: number }> {
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
function safeCell(v: string | number | null | undefined) {
  const s = String(v ?? '');
  return (
    '"' + (/^[\s]*[=+\-@]/.test(s) ? "'" + s : s).replace(/"/g, '""') + '"'
  );
}
export function QuotesEditor({ readonly = false }: { readonly?: boolean }) {
  const [items, I] = useState<QuoteRequest[]>([]),
    [page, P] = useState(1),
    [total, T] = useState(0),
    [size, S] = useState(20),
    [q, Q] = useState(''),
    [status, F] = useState(''),
    [selected, E] = useState<QuoteRequest | null>(null),
    [busy, B] = useState(false),
    [error, R] = useState(''),
    [refresh, V] = useState(0);
  const lock = useRef(false);
  useEffect(() => {
    const ctrl = new AbortController();
    queueMicrotask(() => {
      if (!ctrl.signal.aborted) {
        B(true);
        R('');
      }
    });
    fetch(
      `/api/quotes?page=${page}&status=${encodeURIComponent(status)}&q=${encodeURIComponent(q)}`,
      { signal: ctrl.signal },
    )
      .then(json)
      .then((d) => {
        if (ctrl.signal.aborted) return;
        I(d.items);
        T(d.total);
        S(d.pageSize);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') R(e.message);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) B(false);
      });
    return () => ctrl.abort();
  }, [page, status, q, refresh]);
  async function mutation(remove = false) {
    if (!selected || lock.current || readonly) return;
    if (
      remove &&
      !confirm(
        `¿Eliminar permanentemente los datos de ${selected.reference}? Esta acción no se puede deshacer.`,
      )
    )
      return;
    lock.current = true;
    B(true);
    R('');
    try {
      const r = await fetch(`/api/quotes/${selected.id}`, {
        method: remove ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: selected.version,
          ...(!remove
            ? { status: selected.status, notes: selected.notes }
            : {}),
        }),
      });
      if (!r.ok) throw new Error(await r.text());
      E(remove ? null : await r.json());
      V((v) => v + 1);
    } catch (e) {
      R(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      lock.current = false;
      B(false);
    }
  }
  return (
    <div className="panel">
      <h2>Solicitudes recibidas</h2>
      <p>
        Los cambios de estado y las notas se guardan por solicitud. La
        exportación contiene únicamente la página visible.
      </p>
      <fieldset disabled={busy}>
        <div className="form-grid">
          <Field
            label="Buscar solicitudes"
            value={q}
            onChange={(v) => {
              Q(v);
              P(1);
            }}
          />
          <Select
            label="Estado"
            value={status}
            options={{ '': 'Todos', ...statusNames }}
            onChange={(v) => {
              F(v);
              P(1);
            }}
          />
        </div>
        <button
          className="ghost"
          disabled={!items.length}
          onClick={() => {
            const rows = [
              [
                'Referencia',
                'Fecha',
                'Estado',
                'Nombre',
                'Teléfono',
                'Email',
                'Evento',
                'Distrito',
                'Personas',
                'Selección',
              ],
              ...items.map((x) => [
                x.reference,
                x.createdAt,
                statusNames[x.status],
                x.input.name,
                x.input.phone,
                x.input.email,
                x.snapshot.eventType,
                x.input.district,
                x.input.people,
                x.snapshot.selection,
              ]),
            ];
            const url = URL.createObjectURL(
              new Blob(
                [
                  '\uFEFF' +
                    rows.map((row) => row.map(safeCell).join(',')).join('\r\n'),
                ],
                { type: 'text/csv;charset=utf-8' },
              ),
            );
            const a = document.createElement('a');
            a.href = url;
            a.download = `solicitudes-pagina-${page}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Exportar página CSV
        </button>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Cliente</th>
                <th>Evento</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>
                    {x.reference}
                    {x.demo ? ' · Demo' : ''}
                  </td>
                  <td>{x.input.name}</td>
                  <td>
                    {x.input.date}
                    <br />
                    {x.input.district}
                  </td>
                  <td>{statusNames[x.status]}</td>
                  <td>
                    <button className="ghost" onClick={() => E(x)}>
                      Abrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          {total} solicitudes · Página {page}
        </p>
        <div className="admin-actions">
          <button
            className="ghost"
            disabled={page <= 1}
            onClick={() => P((v) => v - 1)}
          >
            Anterior
          </button>
          <button
            className="ghost"
            disabled={page * size >= total}
            onClick={() => P((v) => v + 1)}
          >
            Siguiente
          </button>
        </div>
        {selected && (
          <article className="quote-admin">
            <h3>
              {selected.reference} · {selected.input.name}
            </h3>
            <p>
              {selected.input.phone} · {selected.input.email}
            </p>
            <p>
              {selected.snapshot.eventType} · {selected.input.date} ·{' '}
              {selected.input.district} · {selected.input.people} personas
            </p>
            <p>
              Propuesta: {selected.snapshot.selection || 'Por definir'} ·
              Modalidad: {selected.snapshot.modality || 'Por definir'}
            </p>
            <p>
              Complementos: {selected.snapshot.addOns.join(', ') || 'Ninguno'}
            </p>
            <p>Presupuesto: {selected.input.budget || 'Sin indicar'}</p>
            <p>
              Consulta del cliente: {selected.input.notes || 'Sin comentarios'}
            </p>
            <p>Consentimiento registrado: {selected.snapshot.consentText}</p>
            <small>
              Recibida: {new Date(selected.createdAt).toLocaleString('es-PE')} ·
              Última actualización:{' '}
              {new Date(selected.updatedAt).toLocaleString('es-PE')} · Revisión{' '}
              {selected.version}
            </small>
            <fieldset disabled={readonly}>
              <Select
                label="Estado de seguimiento"
                value={selected.status}
                options={statusNames}
                onChange={(v) => E({ ...selected, status: v as QuoteStatus })}
              />
              <Field
                label="Notas internas de seguimiento"
                multiline
                value={selected.notes}
                onChange={(notes) => E({ ...selected, notes })}
              />
              <div className="admin-actions">
                <button
                  className="button secondary"
                  onClick={() => void mutation()}
                >
                  Guardar seguimiento
                </button>
                <button className="ghost" onClick={() => E(null)}>
                  Cerrar detalle
                </button>
                <button className="ghost" onClick={() => void mutation(true)}>
                  Eliminar datos personales
                </button>
              </div>
            </fieldset>
          </article>
        )}
      </fieldset>
      <p aria-live="polite">{busy ? 'Cargando…' : ''}</p>
      <p role="alert">{error}</p>
    </div>
  );
}
