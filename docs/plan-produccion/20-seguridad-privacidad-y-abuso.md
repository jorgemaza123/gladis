# 20. Reducir exposición y describir privacidad real

Estado inicial: TODO. Adaptada el 2026-09-30 a la [arquitectura estática](ARQUITECTURA-ESTATICA.md).
Anterior: [19. Revisar teclado, accesibilidad y respuesta móvil](19-accesibilidad-y-responsive.md).
Siguiente: [21. Mostrar origen, responsable y embudo a los dos operadores](21-indicadores-y-seguimiento.md).

## Objetivo

Evitar recolección y transmisión innecesarias en el catálogo estático. No existen endpoints, cuentas, cookies de analítica, base de datos, CMS ni retención de solicitudes que endurecer.

## Antes de editar

- Leer [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md), [ESTADO](ESTADO.md), [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md).
- Confirmar que los antiguos archivos de API, sesión, autenticación y eventos están retirados; no recrearlos para cumplir el plan anterior.
- Inspeccionar `components/quote.tsx`, `lib/whatsapp-message.ts`, `app/privacidad/page.tsx`, `data/defaults.ts` y `scripts/security-tests.mjs`.
- Mantener que el destino de WhatsApp procede únicamente del propietario de la oferta principal publicada. No introducir teléfono de respaldo ni deducir dueño por título.

## Alcance ejecutado

1. El formulario sólo puede pedir datos necesarios para preparar el mensaje: tipo de evento, fecha, distrito, asistentes, propuesta, complementos y presupuesto. Eliminar nombre, teléfono, correo, comentarios, honeypot y consentimiento de un flujo que ya no recibe solicitudes.
2. Conservar sólo datos temporales no identificatorios en `sessionStorage`; descartar propiedades desconocidas o personales de borradores previos.
3. Explicar en la interfaz y la página de privacidad que no se guarda solicitud ni información de contacto. Abrir WhatsApp es una decisión explícita del visitante; el mensaje contiene sólo los datos de evento que éste introdujo.
4. Confirmar por pruebas estáticas que no hay rutas `app/api`, envío mediante `fetch`/`sendBeacon`, bindings de base de datos ni controles de contacto en el cotizador activo.
5. Conservar la validación de URL HTTPS para catálogos externos y `rel` seguro para enlaces externos ya implementados, sin abrirlos durante la prueba.

## Verificación obligatoria

- Si cambia código: ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test` y `npm.cmd run build`.
- Ejecutar `git diff --check` e informar advertencias de fin de línea sin tratarlas como errores.
- No declarar pruebas de CORS, cuotas IP, CSRF, D1, retención, spam de servidor ni autenticación: no hay servidor ni persistencia que los ejecute.
- No abrir WhatsApp, no enviar mensajes, no publicar ni instalar servicios externos.

## Límites

- El texto no constituye asesoría legal ni una promesa de cumplimiento normativo. Antes de publicar, el responsable debe revisar la política con sus datos y el tratamiento real que adopte.
- El comportamiento de WhatsApp después de que el visitante el abra no se controla ni se verifica desde este sitio.
- Las estructuras V1/V2 y validadores históricos se conservan para compatibilidad de archivos y pruebas puras; no son rutas activas ni reciben datos en la web estática.

## Traspaso exacto

T21 no puede crear paneles, métricas persistentes, sesiones ni eventos remotos. Si necesita mostrar contexto, sólo puede hacerlo en la sesión del navegador y sin datos personales. Cualquier futura reintroducción de captura o almacenamiento requiere una tarea nueva, servicio explícito, política revisada y pruebas aisladas.
