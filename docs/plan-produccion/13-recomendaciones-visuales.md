# 13. Recomendar servicios compatibles con tarjetas visuales

Estado inicial: TODO. Anterior: [12. CTA y cotizador estático](12-integracion-ctas-y-cotizador.md). Siguiente: [14. Portada y navegación](14-portada-y-navegacion.md).

## Objetivo adaptado

Mostrar venta cruzada sólo cuando los datos contienen relaciones explícitas válidas. Las recomendaciones son una ayuda para completar la bolsa temporal; no reemplazan la oferta principal, no deciden el destinatario y no guardan actividad en servidor.

La arquitectura de [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md) prevalece sobre instrucciones anteriores que impliquen CMS, API o persistencia.

## Alcance

1. Crear `lib/recommendations.ts` con un resolver puro de un único nivel. Ordena por prioridad, orden editorial y título; acepta el contexto opcional de tipo de evento; limita el resultado a tres.
2. Excluir la propia oferta, líneas ya presentes, borradores, archivados, no cotizables, entradas sin responsable o sin `quoteConfig`. No inferir relaciones ni seguir ciclos de forma recursiva.
3. Crear `components/service-recommendations.tsx`, con imagen de carga diferida, título, motivo proveniente de datos, «Añadir» y «Ver detalles». «Añadir» usa `QuoteCta` con `placement="recommendation"`, conserva el principal y no navega fuera del diálogo.
4. Montarlo en la ficha y dentro de la revisión de bolsa. Si no hay relaciones aptas, no renderiza ningún bloque ni espacio vacío relevante.
5. Informar que los extras no cambian la oferta principal ni su responsable. La configuración central continúa resolviendo el WhatsApp sólo desde el principal.

## Fuera de alcance

- No añadir relaciones al catálogo de demostración ni usar una lista fija en JSX.
- No crear endpoints, métricas, CMS, base de datos ni envío automático de WhatsApp.
- No afirmar reservas, mensajes enviados o coordinación realizada por un clic.

## Verificación

Ampliar `scripts/commerce-tests.mjs` con fixtures aislados de prioridad, contexto, duplicados, líneas existentes y ciclos. Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test`, `npm.cmd run build` y `git diff --check`. Las pruebas de teclado, viewport móvil y navegación real requieren catálogo confirmado y servidor local aislado; no se marcan como verificadas sin realizarlas.

## Traspaso exacto

Las tareas 14 y 15 pueden reutilizar `resolveRecommendations()` y `ServiceRecommendations` con la misma proyección pública. Sólo deben pasar una oferta publicada cotizable con propietario y `quoteConfig`; las relaciones siguen siendo IDs y motivos definidos en datos.
