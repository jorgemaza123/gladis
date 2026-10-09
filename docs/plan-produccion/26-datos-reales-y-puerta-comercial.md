# 26. Completar datos reales y validar la oferta antes de indexar

Estado: HECHO localmente el 2026-10-01. Anterior: [25. Preparar entorno de ensayo y procedimiento de recuperación](25-entorno-staging-y-recuperacion.md). Siguiente: [27. Validar recorridos reales en el entorno de ensayo](27-aceptacion-integral.md).

## Objetivo

Preparar una oferta comercial confirmada en la fuente estática, sin inventar datos ni publicar por esta tarea.

## Arquitectura vigente

La web no usa D1, CMS, API, migraciones ni panel de administración. `data/demo.ts` es la única fuente del contenido público y `config/business-contacts.ts` es la única fuente de teléfonos. Los antiguos componentes `components/admin/content.tsx` y `components/admin/settings.tsx` no existen; no deben recrearse.

## Datos confirmados para esta preparación

- Marca pública: Gladys. URL operativa: `https://gladis-vr6r.vercel.app`.
- Cocina, buffet, bartender y menaje: `923106197`. Complementos y producción: `902843481`.
- Cobertura: todo Lima Metropolitana. Todos los precios: consulta por WhatsApp.
- Servicios por ID y responsable explícito; mínimos referenciales y condiciones sujetas a confirmación.
- Tres imágenes locales generadas con IA, con textos alternativos y aviso visible de que son referenciales; no se presentan como trabajos realizados.
- URL HTTPS de catálogo externo, si existe; si no, conservar el enlace oculto.
- Dirección pública, horario, correo o contacto de privacidad, y textos comerciales/SEO aprobados.

## Pasos cuando los datos estén disponibles

1. Registrar en [DATOS-PENDIENTES](DATOS-PENDIENTES.md) la fuente y fecha de cada confirmación.
2. Editar sólo `data/demo.ts` y, para teléfonos, `config/business-contacts.ts`. Configurar indexación únicamente con autorización comercial expresa, datos confirmados y URL HTTPS registrada; el despliegue sigue siendo una tarea separada.
3. Para cada oferta cotizable confirmada, declarar de forma explícita `requestable`, `ownerId`, `quoteConfig` y relaciones. No deducir responsable del título; los extras no cambian al destinatario de la oferta principal.
4. Sustituir únicamente imágenes de muestra usadas por contenido publicado por imágenes autorizadas con texto alternativo completo. No crear reseñas, estadísticas ni proyectos ficticios.
5. Ejecutar `npm.cmd run test:commerce`, `npm.cmd test` y `npm.cmd run build`; ejecutar además `npm.cmd run typecheck` y `npm.cmd run lint` si cambia TypeScript. Revisar la salida de `scripts/catalog-readiness.mjs` contra un JSON exportado de los datos sólo cuando haya una entrada real que diagnosticar.

## Límites

No enviar mensajes de WhatsApp, no publicar, no hacer push, no activar indexación, no añadir CMS/base de datos ni convertir el clic en confirmación de envío. La validación local no demuestra que un número tenga cuenta de WhatsApp ni que el contenido esté aprobado comercialmente.

## Aceptación

- [x] Las confirmaciones comerciales y de teléfonos están registradas con fuente y fecha.
- [x] El diagnóstico no encuentra ofertas cotizables sin responsable ni reglas completas.
- [x] Las imágenes referenciales están identificadas como generadas con IA y tienen texto alternativo completo.
- [x] Las comprobaciones aplicables terminan correctamente y se registran en BITACORA.
- [x] No hubo publicación externa en esta tarea.

## Traspaso exacto

Con los datos cargados y el commit local validado, continuar con [27. Validar recorridos reales en el entorno de ensayo](27-aceptacion-integral.md) después de desplegar este commit en la URL autorizada.
