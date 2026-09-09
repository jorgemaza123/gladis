import type { MediaAsset, SEOFields } from '@/models/content';
import { useState } from 'react';
export function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint = '',
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="field">
      {label}
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <small>{hint}</small>
    </label>
  );
}
export function Check({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Record<string, string>;
}) {
  return (
    <label className="field">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(options).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
export function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <label className="field">
      {label}
      <input
        type="number"
        min="0"
        step="any"
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value === '' ? null : Number(e.target.value))
        }
      />
    </label>
  );
}
export function Lines({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <Field
      label={label}
      hint="Un elemento por línea"
      multiline
      value={value.join('\n')}
      onChange={(v) => onChange(v.split('\n'))}
    />
  );
}
export function ImagePicker({
  media,
  value,
  onChange,
  label = 'Imagen principal',
}: {
  media: MediaAsset[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [q, Q] = useState('');
  return (
    <details className="image-picker">
      <summary>
        {label}: {media.find((m) => m.id === value)?.alt || 'Sin imagen'}
      </summary>
      <Field
        label="Buscar imagen por descripción o etiqueta"
        value={q}
        onChange={Q}
      />
      <button type="button" className="ghost" onClick={() => onChange('')}>
        Sin imagen
      </button>
      <div className="picker-grid">
        {media
          .filter((m) =>
            `${m.alt} ${(m.tags || []).join(' ')}`
              .toLowerCase()
              .includes(q.toLowerCase()),
          )
          .map((m) => (
            <button
              type="button"
              key={m.id}
              aria-pressed={m.id === value}
              onClick={() => onChange(m.id)}
            >
              <img
                src={m.url}
                alt={m.alt || 'Imagen sin descripción'}
                loading="lazy"
              />
              <span>
                {m.alt || 'Sin descripción'}
                {m.demo ? ' · Muestra' : ''}
              </span>
            </button>
          ))}
      </div>
    </details>
  );
}
export function Multi({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string[];
  options: { id: string; title: string }[];
  onChange: (v: string[]) => void;
}) {
  return (
    <details className="multi-picker">
      <summary>
        {label} ({value.length})
      </summary>
      {options.map((o) => (
        <Check
          key={o.id}
          label={o.title}
          value={value.includes(o.id)}
          onChange={(yes) =>
            onChange(yes ? [...value, o.id] : value.filter((v) => v !== o.id))
          }
        />
      ))}
    </details>
  );
}
export function SeoEditor({
  value,
  onChange,
  url,
  media,
}: {
  value: SEOFields;
  onChange: (v: SEOFields) => void;
  url: string;
  media: MediaAsset[];
}) {
  return (
    <>
      <Field
        label={`Título SEO (${value.title.length})`}
        value={value.title}
        onChange={(title) => onChange({ ...value, title })}
      />
      <Field
        label={`Descripción SEO (${value.description.length})`}
        multiline
        value={value.description}
        onChange={(description) => onChange({ ...value, description })}
      />
      <Field
        label="URL canónica opcional"
        type="url"
        value={value.canonical || ''}
        onChange={(canonical) => onChange({ ...value, canonical })}
      />
      <ImagePicker
        media={media}
        label="Imagen social"
        value={value.imageId || ''}
        onChange={(imageId) => onChange({ ...value, imageId })}
      />
      <Check
        label="Excluir de los buscadores"
        value={value.noindex}
        onChange={(noindex) => onChange({ ...value, noindex })}
      />
      <div className="seo-preview">
        <small>
          {value.canonical || url || 'Configura el dominio público'}
        </small>
        <strong>{value.title || 'Título de la página'}</strong>
        <p>{value.description || 'Descripción pendiente'}</p>
      </div>
    </>
  );
}
