'use client';

import { useAnalytics } from './analytics-provider';

export function AnalyticsPreferencesButton() {
  const { openPreferences } = useAnalytics();
  return (
    <button
      type="button"
      className="text-link analytics-preferences-trigger"
      onClick={openPreferences}
    >
      Preferencias de analítica
    </button>
  );
}

export function AnalyticsPrivacyControl() {
  const { consent, ready, accept, reject } = useAnalytics();
  const statusLabel = !ready
    ? 'Comprobando preferencia…'
    : consent === 'granted'
      ? 'Analítica aceptada'
      : consent === 'denied'
        ? 'Analítica rechazada'
        : 'Pendiente de elección';

  return (
    <section className="analytics-privacy-control" aria-label="Control de analítica">
      <h2>Preferencias de analítica</h2>
      <p>
        Estado actual: <strong>{statusLabel}</strong>. Puedes cambiar tu elección en cualquier momento.
      </p>
      <div className="analytics-privacy-actions">
        <button
          type="button"
          className={consent === 'granted' ? 'button small' : 'ghost small'}
          onClick={accept}
        >
          Aceptar analítica
        </button>
        <button
          type="button"
          className={consent === 'denied' ? 'button small' : 'ghost small'}
          onClick={reject}
        >
          Rechazar analítica
        </button>
      </div>
    </section>
  );
}
