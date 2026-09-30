# Arquitectura estática sin base de datos

Decisión del usuario, 2026-09-30: esta web no usa D1, otra base de datos, CMS remoto, sesiones de administración ni almacenamiento persistente de cotizaciones o métricas.

El contenido público se lee desde `data/demo.ts` mediante `repositories/site.ts` y se modifica en archivos del proyecto. Cada cambio editorial requiere una nueva compilación y publicación autorizada.

La bolsa y el origen de navegación pueden vivir sólo durante la sesión del navegador. No se guardan nombre, teléfono, correo, notas, solicitudes, conversiones ni eventos en el servidor. El formulario prepara una conversación; el usuario decide si abre y envía el mensaje de WhatsApp. No existe una referencia de solicitud, panel CMS, historial, API de cotizaciones, API de eventos ni analítica persistente.

Los documentos anteriores que mencionan D1, Drizzle, R2, migraciones, endpoints administrativos o persistencia describen la arquitectura retirada. No se deben ejecutar. Las tareas 06, 09, 11, 20–23 y 25–29 deben rediseñarse contra estas reglas antes de continuarlas.
