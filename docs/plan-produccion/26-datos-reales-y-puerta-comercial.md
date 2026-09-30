# 26. Completar datos reales y validar la oferta antes de indexar

Estado: BLOQUEADO por datos comerciales no confirmados. Anterior: [25. Preparar entorno de ensayo y procedimiento de recuperación](25-entorno-staging-y-recuperacion.md). Siguiente: [27. Validar recorridos reales en el entorno de ensayo](27-aceptacion-integral.md).

## Objetivo

Preparar una oferta comercial real en la fuente estática, sin inventar datos ni habilitar indexación o publicación.

## Arquitectura vigente

La web no usa D1, CMS, API, migraciones ni panel de administración. `data/demo.ts` es la única fuente del contenido público y `config/business-contacts.ts` es la única fuente de teléfonos. Los antiguos componentes `components/admin/content.tsx` y `components/admin/settings.tsx` no existen; no deben recrearse.

## Datos que se deben confirmar antes de editar contenido comercial

- Identidad pública y dominio HTTPS definitivo.
- Teléfono de cocina/bar y confirmación humana del teléfono de Jorge. `DATOS-PENDIENTES.md` menciona `902843481`, pero la configuración activa usa `51902843481`; no elegir ni combinar ninguno sin confirmación expresa.
- Servicios por ID y responsable, mínimos, opciones, horarios, cobertura, logística y condiciones incluidas/excluidas.
- Fotos propias autorizadas, dimensiones, variantes y textos alternativos.
- URL HTTPS de catálogo externo, si existe; si no, conservar el enlace oculto.
- Dirección pública, horario, correo o contacto de privacidad, y textos comerciales/SEO aprobados.

## Pasos cuando los datos estén disponibles

1. Registrar en [DATOS-PENDIENTES](DATOS-PENDIENTES.md) la fuente y fecha de cada confirmación.
2. Editar sólo `data/demo.ts` y, para teléfonos, `config/business-contacts.ts`. Mantener la demostración con `demo: true`, `indexable: false` y `origin: ''` hasta la tarea 28.
3. Para cada oferta cotizable confirmada, declarar de forma explícita `requestable`, `ownerId`, `quoteConfig` y relaciones. No deducir responsable del título; los extras no cambian al destinatario de la oferta principal.
4. Sustituir únicamente imágenes de muestra usadas por contenido publicado por imágenes autorizadas con texto alternativo completo. No crear reseñas, estadísticas ni proyectos ficticios.
5. Ejecutar `npm.cmd run test:commerce`, `npm.cmd test` y `npm.cmd run build`; ejecutar además `npm.cmd run typecheck` y `npm.cmd run lint` si cambia TypeScript. Revisar la salida de `scripts/catalog-readiness.mjs` contra un JSON exportado de los datos sólo cuando haya una entrada real que diagnosticar.

## Límites

No enviar mensajes de WhatsApp, no publicar, no hacer push, no activar indexación, no añadir CMS/base de datos ni convertir el clic en confirmación de envío. La validación local no demuestra que un número tenga cuenta de WhatsApp ni que el contenido esté aprobado comercialmente.

## Aceptación

- [ ] Las confirmaciones comerciales y de teléfonos están registradas con fuente y fecha.
- [ ] El diagnóstico no encuentra ofertas cotizables sin responsable ni reglas completas.
- [ ] El contenido preparado no usa imágenes de demostración y conserva la demo fuera de índice.
- [ ] Las comprobaciones aplicables terminan correctamente y se registran en BITACORA.
- [ ] No hay publicación externa en esta tarea.

## Traspaso exacto

No marcar HECHO sin las confirmaciones anteriores. Con los datos cargados y la demo aún no indexable, continuar con [27. Validar recorridos reales en el entorno de ensayo](27-aceptacion-integral.md); el ensayo remoto sigue requiriendo el destino autorizado que bloquea la tarea 25.
