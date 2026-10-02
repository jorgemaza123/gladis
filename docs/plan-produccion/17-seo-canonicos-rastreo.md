# 17. Corregir SEO técnico y señales de indexación

Estado: HECHO el 2026-10-01. Anterior: [16. Ocasiones y cobertura](16-ocasiones-y-cobertura-lima.md). Siguiente: [18. Rendimiento](18-imagenes-y-rendimiento.md).

## Objetivo adaptado

Preparar canónicas, robots y sitemap coherentes para la futura publicación de contenido estático confirmado. La demostración mantiene `noindex` y no activa rastreo.

## Alcance

1. Crear `catalogUrlPolicy()` para canónicas de catálogo: la base usa su propia URL; `pagina=N` válida conserva sólo ese parámetro; UTM no afecta canónica ni indexación; `q`, `categoria` y `modalidad` son `noindex` y no contaminan la canónica.
2. Redirigir permanentemente `pagina=1`, parámetros de página inválidos y páginas fuera de rango a la página canónica válida, evitando respuestas 200 para una paginación inexistente.
3. Mantener demostración, borradores, cotizador y configuración no apta para indexar fuera del sitemap. El sitemap sólo se llena al activar datos no demo, origen HTTPS e indexación confirmada.
4. Simplificar `robots.txt` para la arquitectura estática: no declara rutas API o preview retiradas.
5. Eliminar la lectura SEO de `settings.whatsapp`. Sin contacto principal de negocio confirmado, el dato estructurado omite teléfono; tampoco inventa dirección, valoraciones, productos o precios.

## Fuera de alcance

- No activar `indexable`, cambiar el origen, publicar sitemap o modificar los datos demo.
- No crear URLs geográficas masivas, datos estructurados comerciales no confirmados, API, CMS o base de datos.
- No declarar indexación real sin revisar HTML, origen y contenido de producción.

## Verificación

Ampliar pruebas aisladas para página 2 con UTM, filtros con UTM, página 1 canónica y omisión del teléfono legado. Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test`, `npm.cmd run build` y `git diff --check`. La matriz de HTML inicial, redirecciones HTTP y sitemap en origen real queda pendiente de un servidor aislado y datos confirmados.

## Traspaso exacto

La tarea 18 puede medir la web estática manteniendo los metadatos actuales. La tarea 26 debe confirmar origen, entidad, dirección y decisión de indexación antes de activar rastreo; si sigue sin contacto principal, el teléfono estructurado permanece omitido.
