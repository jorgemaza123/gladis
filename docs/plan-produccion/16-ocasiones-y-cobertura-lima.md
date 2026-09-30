# 16. Conectar ocasiones y cobertura de Lima Metropolitana

Estado inicial: TODO. Anterior: [15. Fichas comerciales](15-fichas-comerciales-y-personalizados.md). Siguiente: [17. SEO técnico](17-seo-canonicos-rastreo.md).

## Objetivo adaptado

Usar los tipos de evento, cobertura y relaciones por ID ya existentes para orientar la exploración sin crear promesas de zonas atendidas, páginas repetitivas o precios inferidos.

## Alcance

1. Añadir `coverageIds` normalizado a `[]` en cada oferta. La validación exige que cada ID apunte a una entrada `cobertura`.
2. Mostrar las coberturas relacionadas desde la ficha mediante la misma relación explícita que usan los demás bloques vinculados. Los tipos de evento ya conectan sus propuestas mediante sus relaciones existentes, sin listas fijas.
3. Proyectar `coverageIds` al cotizador. Si la propuesta seleccionada declara cobertura, se muestra como información y se aclara que la disponibilidad final se confirma al coordinar. Si no la declara, el formulario pide distrito y explica que la cobertura se confirma antes de coordinar.
4. Mantener las páginas informativas como tales: sus CTA no convierten la página en oferta ni resuelven un responsable por título.

## Fuera de alcance

- No añadir distritos, Callao, bodas, cumpleaños, graduaciones ni eventos corporativos a `data/demo.ts` sin información confirmada.
- No calcular precios, confirmar disponibilidad, publicar domicilio privado ni añadir API, base de datos o CMS.
- No construir una matriz automática de servicios por distrito.

## Verificación

Ampliar las pruebas comerciales con una cobertura válida y una relación hacia un tipo de contenido erróneo. Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test`, `npm.cmd run build` y `git diff --check`. Las pruebas de navegación y consulta de zonas reales requieren datos confirmados y navegador aislado; no se declaran aprobadas sin ello.

## Traspaso exacto

La tarea 17 puede usar relaciones `coverageIds` y `eventTypeIds` sólo como contexto editorial confirmado. No debe crear URLs masivas, datos estructurados ni promesas geográficas cuando estas listas estén vacías.
