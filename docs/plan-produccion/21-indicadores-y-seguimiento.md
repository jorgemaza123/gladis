# 21. Delimitar contexto efímero y seguimiento no disponible

Estado inicial: TODO. Adaptada el 2026-09-30 a la [arquitectura estática](ARQUITECTURA-ESTATICA.md).
Anterior: [20. Reducir exposición y describir privacidad real](20-seguridad-privacidad-y-abuso.md).
Siguiente: [22. Evitar solicitudes guardadas sin atención](22-avisos-fiables-y-operacion.md).

## Objetivo

Conservar en la pestaña del visitante el contexto mínimo que permite al cotizador mantener el primer origen y el responsable de la oferta principal, sin pretender que sea un indicador operativo para dos personas.

## Resultado de la revisión

La tarea original requería API privada, autenticación, solicitudes persistentes, eventos y panel administrativo. Esos componentes fueron retirados por la arquitectura estática y no se pueden reemplazar por `sessionStorage`: cada visitante controla y pierde su propia sesión, y los operadores no pueden verla de forma segura.

La implementación vigente ya ofrece sólo el contexto permitido:

- `AttributionProvider` conserva en una pestaña la ruta de llegada, host de referencia, UTM saneadas, canal, primer CTA y último CTA.
- `QuoteCartProvider` conserva la bolsa temporal sin datos personales.
- El responsable visible en la bolsa y el destinatario de WhatsApp se resuelven sólo desde la oferta principal publicada. Los extras no lo cambian.
- No hay eventos remotos, solicitudes guardadas, identificadores de personas, contador de clics, CSV, filtros, panel o historial.

## Decisión y límites

- No crear `app/api/metrics/route.ts`, `components/admin/metrics.tsx`, tablas, cuentas o almacenamiento de métricas.
- No presentar un CTA, la preparación del mensaje o la apertura de un enlace como solicitud, envío, venta, persona única o conversión.
- No exponer contexto de una sesión a otro navegador ni persistirlo para operadores.
- Las estructuras V1/V2 históricas sólo se usan en validaciones y pruebas puras; no constituyen una fuente de indicadores activa.

## Verificación

- Ejecutar `npm.cmd run test:commerce` para conservar primer CTA, saneamiento de UTM y la regla de responsable del principal.
- Ejecutar `npm.cmd test` para confirmar que el runtime sigue sin API, base de datos ni envío de datos.
- Registrar códigos de salida y no declarar métricas operativas sin una arquitectura autorizada que las produzca.

## Traspaso exacto

La tarea 22 no debe crear alertas ni operaciones sobre solicitudes inexistentes. Si en el futuro se necesitan indicadores para operadores, se requiere una decisión explícita del usuario para introducir almacenamiento, autenticación, una política de privacidad y pruebas aisladas en una tarea nueva.
