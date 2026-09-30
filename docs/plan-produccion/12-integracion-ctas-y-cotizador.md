# 12. Conectar CTA y cotizador estático

Estado inicial: TODO. Anterior: [11. Mensaje WhatsApp](11-mensaje-whatsapp-y-confirmacion.md). Siguiente: [13. Recomendaciones visuales](13-recomendaciones-visuales.md).

## Objetivo adaptado

Conectar los CTA públicos con la bolsa temporal y el cotizador sin API, base de datos, CMS remoto, referencias ni eventos persistentes. La conversación se prepara sólo para el responsable de la oferta principal, según la configuración central.

La arquitectura vigente está definida en [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md) y prevalece sobre la versión anterior de esta tarea.

## Alcance

1. Crear `components/quote-cta.tsx`. Recibe `entryId` opcional, `placement`, etiqueta y ruta alternativa real. Antes de navegar registra el CTA en sesión; si el ID fue proyectado por `QuoteCartProvider`, lo añade a la bolsa temporal.
2. Usarlo en cabecera, pie, portada, bloques, tarjetas y ficha. Un CTA genérico no añade una oferta ni usa un número global: lleva a `/cotizar`, donde la persona debe elegir una principal.
3. Proyectar al cotizador únicamente los campos públicos necesarios, incluido `requestable` y `quoteConfig`. Cuando existe una bolsa, su principal determina la propuesta, los requisitos opcionales de fecha/distrito/asistentes y el destino de WhatsApp; los demás ítems se muestran como complementos del mensaje. La edición de cantidad y opciones permanece en el diálogo de la bolsa.
4. Retirar cualquier `wa.me` directo de componentes públicos. Sólo `lib/whatsapp-message.ts` construye el enlace cuando el principal posee un destino válido.
5. Mantener el primer origen del cliente en `sessionStorage`; cada CTA actualiza sólo el último toque. No se registra analítica ni se guardan datos de contacto o solicitudes.

## Fuera de alcance

- No crear `lib/events.ts`, rutas `/api`, tablas, migraciones, referencias o simulaciones de envío.
- No marcar datos de demostración como cotizables ni deducir propietario desde el título.
- No afirmar entrega de WhatsApp por abrir el enlace.

## Verificación

Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test`, `npm.cmd run build` y `git diff --check`. Buscar `wa.me` y comprobar que no quedan enlaces directos fuera del generador. Las comprobaciones reales de teclado, navegación, recarga y WhatsApp requieren un catálogo confirmado y un servidor local aislado; se documentan como pendientes, no como aprobadas.

## Limitación actual

El formulario heredado sigue siendo la pantalla de datos del cotizador. No se implementa guardado, referencias ni validación de servidor porque la web es estática. La integración visual de una oferta concreta queda pendiente hasta que haya datos comerciales confirmados; no se deben alterar los ejemplos para forzarla.

## Traspaso exacto

La tarea 13 puede usar `QuoteCta` con `placement="recommendation"` y un `entryId` sólo si la recomendación ya es publicada, cotizable, tiene propietario y `quoteConfig`. Debe conservar la bolsa y el principal; no puede introducir almacenamiento permanente ni rutas API.
