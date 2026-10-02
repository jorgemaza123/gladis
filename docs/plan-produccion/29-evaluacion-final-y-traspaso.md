# 29. Evaluar calidad demostrada y entregar operación

Estado: BLOQUEADO; el plan no termina como publicación comercial. Anterior: [28. Publicar sólo en destino autorizado y verificar captación](28-publicacion-controlada.md).

## Resultado demostrado

La aplicación es una web estática con contenido versionado en `data/demo.ts`, teléfonos centralizados en `config/business-contacts.ts`, bolsa y origen temporales en el navegador, y un enlace de WhatsApp explícito. Las comprobaciones locales vigentes se concentran en `npm run quality`: tipos, lint, reglas comerciales, guardas estáticas y build.

Está documentado cómo editar una oferta, modificar teléfonos en una fuente única y recuperar una revisión del contenido: [README](../../README.md) y [runbook](../operations/release-runbook.md). La prueba de seguridad protege la ausencia de API, base de datos, envío de datos y recolección de contacto innecesaria.

## No demostrado ni habilitado

- Datos comerciales, imágenes propias, identidad, dominio, cobertura, condiciones y teléfonos confirmados.
- Destino HTTPS de ensayo, interacción humana de teclado/viewport/navegador, rendimiento medido y ejecución remota de CI.
- Despliegue, indexación, recuperación remota, Search Console, analítica, métricas, solicitudes, avisos o atención por operadores.
- Envío, entrega o venta por WhatsApp. El enlace sólo prepara una conversación bajo decisión de la persona visitante.

Las tareas 26–28 permanecen bloqueadas por esos prerrequisitos. No se declara una nota global, ausencia total de errores ni aceptación comercial.

## Guía de mantenimiento

1. Cambiar un teléfono sólo en `config/business-contacts.ts`; confirmar el número humano antes de activarlo. Cocina no debe usar el contacto de Jorge como respaldo.
2. Añadir una oferta sólo en `data/demo.ts` con responsable explícito, `quoteConfig` completo y relaciones confirmadas. El destinatario lo decide la oferta principal; los extras no lo alteran.
3. El origen y la bolsa existen sólo en la pestaña del visitante. No se pueden consultar como solicitud, métrica o panel operativo.
4. Antes de un despliegue autorizado, ejecutar `npm ci` y `npm run quality`; seguir el runbook para ensayo y recuperación.
5. Mantener `demo: true`, `indexable: false` y `origin: ''` hasta que estén confirmados datos, dominio y autorización de publicación.

## Puertas para reabrir el cierre

Registrar los datos de la tarea 26 con fuente y fecha, disponer de URL HTTPS y autorización de las tareas 25/28, realizar la aceptación humana de la tarea 27 y documentar los resultados. Después se puede reevaluar esta tarea sin crear CMS, API, base de datos o métricas persistentes.

## Cierre documental

No se hizo push ni publicación. La bitácora y el estado distinguen lo implementado de lo pendiente; revertir este cierre consiste en restaurar estas entradas documentales, sin datos de usuario que recuperar.
