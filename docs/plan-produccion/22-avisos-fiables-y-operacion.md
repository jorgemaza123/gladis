# 22. Comunicar claramente la ausencia de solicitudes y avisos

Estado inicial: TODO. Adaptada el 2026-09-30 a la [arquitectura estática](ARQUITECTURA-ESTATICA.md).
Anterior: [21. Delimitar contexto efímero y seguimiento no disponible](21-indicadores-y-seguimiento.md).
Siguiente: [23. Preservar autonomía de los datos sin ampliar el CMS](23-compatibilidad-editorial-minima.md).

## Objetivo

Evitar que una persona visitante o el negocio interpreten que la web guardó una solicitud o envió un aviso cuando sólo preparó una conversación de WhatsApp.

## Antes de editar

- Leer [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md), [ESTADO](ESTADO.md), [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md).
- Confirmar que no existen `repositories/quotes.ts`, `db/schema.ts`, `env.d.ts`, panel de solicitudes, API ni credenciales de notificación activas.
- Inspeccionar `components/quote.tsx`, `lib/whatsapp-message.ts`, `config/business-contacts.ts` y `scripts/security-tests.mjs`.
- No crear colas, adaptadores de mensajería, cron, cuentas, API de WhatsApp ni rutas de notificación.

## Alcance ejecutado

1. Mantener el resultado del cotizador como «Conversación preparada», no como solicitud recibida, reserva o aviso enviado.
2. Cuando el propietario de la oferta principal no tiene un destino válido de WhatsApp, mostrar que no hay canal disponible y que no se guardó ninguna solicitud.
3. Corregir el texto del borrador: sólo selección y datos de evento pueden mantenerse temporalmente en la pestaña; no hay datos de contacto ni registros en servidor.
4. Conservar el enlace de WhatsApp como acción explícita del visitante, sin apertura ni envío automáticos.
5. Probar las reglas de destinatario y la ausencia de API/envío de datos con las suites estáticas existentes.

## Límites

- No hay solicitudes guardadas que puedan abandonarse, ni aviso pendiente, reintento, entrega, responsable atendiente o procedimiento operativo que validar.
- Un clic, apertura o fallo de WhatsApp no puede observarse ni certificarse desde el sitio. La web no afirma entrega de mensaje.
- Para incorporar avisos externos en el futuro se necesita autorización explícita, un servicio de servidor con credenciales, política de privacidad, tratamiento de errores e integración aislada.

## Verificación

- Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test` y `npm.cmd run build` tras el cambio de interfaz.
- Ejecutar `git diff --check`; registrar solamente avisos CRLF preexistentes si aparecen.
- No hacer pruebas de envío ni abrir WhatsApp.

## Traspaso exacto

La tarea 23 debe seguir tratando el contenido como archivos versionados y no puede ampliar un CMS o crear operaciones sobre solicitudes inexistentes. La incorporación futura de alertas debe diseñarse desde cero, no restaurando los módulos retirados.
