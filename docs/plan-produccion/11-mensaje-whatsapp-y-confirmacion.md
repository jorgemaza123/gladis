# 11. Preparar mensaje y salida WhatsApp sin guardar

Estado revisado: HECHO el 2026-09-30 para la arquitectura estática. Anterior: [10](10-modal-bolsa-accesible.md). Siguiente: [12](12-integracion-ctas-y-cotizador.md).

## Objetivo estático

Preparar un mensaje verificable para el responsable correcto sin API, base de datos, referencia, evento persistente ni envío automático. El usuario decide si abre WhatsApp y si finalmente envía el mensaje.

## Implementación real

- `lib/whatsapp-message.ts` exporta `createWhatsAppMessage()` y `createWhatsAppUrl()`. Limita el mensaje a 2500 caracteres, conserva saltos de línea mediante URL encoding, elimina controles y no incluye nombre, teléfono, correo ni notas libres.
- `app/cotizar/page.tsx` resuelve en servidor estático la etiqueta pública y destino para el `ownerId` de cada oferta mediante la configuración central. El componente cliente recibe sólo el destino ya calculado; no importa teléfonos ni deduce responsables por título.
- `components/quote.tsx` prepara el mensaje con evento, principal, extras, cantidades y presupuesto. No hace `fetch`, no guarda una solicitud y no genera referencia. Si el destino no existe, no genera enlace ni fallback; el resultado explica que no se guardó nada.

## Aceptación adaptada

- [x] Stubs de ambas familias validan URL, encoding, número ausente y ausencia de datos de contacto en `test:commerce`.
- [x] Abrir WhatsApp es un enlace explícito de nueva pestaña; no se abre automáticamente ni se afirma entrega.
- [x] El flujo no contiene API ni persistencia, conforme a [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md).
- [ ] La conexión de todas las superficies y el recorrido V2 completo permanece para la tarea 12, rediseñada contra arquitectura estática.

## Verificación

`npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test` y `npm.cmd run build` finalizaron con exit 0 el 2026-09-30. No se abrió WhatsApp, no se envió mensaje y no se modificaron datos externos.
