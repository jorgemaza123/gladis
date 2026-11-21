export function QuoteTransparency({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`quote-transparency${compact ? ' quote-transparency--compact' : ''}`}
      aria-label="Cómo calculamos tu propuesta"
    >
      <div className="quote-transparency-grid">
        <div className="quote-transparency-factors">
          <p className="section-kicker">Cotización a medida, sin letra pequeña</p>
          <h3>¿Cómo calculamos tu propuesta?</h3>
          <p>
            No usamos tarifas rígidas porque cada celebración cambia según el lugar, la carta y la atención. Revisamos cuatro datos reales antes de darte un monto cerrado:
          </p>
          <ul>
            <li><strong>Invitados aproximados</strong> para ajustar porciones y personal.</li>
            <li><strong>Formato de servicio</strong> (solo entrega, buffet asistido o atención completa).</li>
            <li><strong>Distrito en Lima Metropolitana</strong> para coordinar acceso y traslado.</li>
            <li><strong>Complementos combinados</strong> en una sola cotización sin recargos sorpresa.</li>
          </ul>
        </div>
        <div className="quote-transparency-promise">
          <p className="section-kicker">Qué pasa al abrir WhatsApp</p>
          <ol>
            <li>
              <strong>1. Propuesta clara</strong>
              <span>Recibes alcance, disponibilidad y precio exacto por WhatsApp.</span>
            </li>
            <li>
              <strong>2. Ajustes libres</strong>
              <span>Puedes cambiar cantidades, platos o quitar servicios sin compromiso.</span>
            </li>
            <li>
              <strong>3. Reserva solo si te cierra</strong>
              <span>No cobramos por cotizar ni confirmamos nada hasta tu visto bueno.</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
