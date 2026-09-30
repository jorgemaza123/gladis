# 14. Clarificar portada, categorías y navegación comercial

Estado inicial: TODO. Anterior: [13. Recomendaciones visuales](13-recomendaciones-visuales.md). Siguiente: [15. Fichas comerciales](15-fichas-comerciales-y-personalizados.md).

## Objetivo adaptado

Facilitar el descubrimiento del catálogo público desde la portada sin declarar una jerarquía comercial que los datos no confirman. La marca permanece provisional y las fotos continúan identificadas como demostración.

## Alcance

1. Derivar los enlaces de cabecera y pie de `settings.navigation`, ocultando rutas a categorías o fichas que no tengan contenido público disponible.
2. Añadir bajo el hero un explorador de categorías construido desde `contentKinds`, las entradas publicadas y el título de catálogo configurado. Una categoría publicada nueva aparece sin editar JSX; no hay una lista comercial fija.
3. Mantener un solo H1, el hero como inicio de lectura y los CTA existentes de hero, cabecera y pie. Estos continúan usando `QuoteCta` con ubicaciones `hero`, `navigation` y `footer`.
4. Ajustar sólo estilos con los tokens existentes para jerarquía, contraste, foco y adaptación móvil. Las animaciones existentes siguen siendo progresivas y respetan reduced motion.

## Fuera de alcance

- No modificar `data/demo.ts` para inventar alquileres, regalos, responsables, servicios cotizables o casos de éxito.
- No introducir CMS, API, base de datos, teléfonos en componentes ni mensajes automáticos de WhatsApp.
- No afirmar comprobación visual de anchos que no se haya ejecutado en un navegador.

## Verificación

Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test`, `npm.cmd run build` y `git diff --check`. Las revisiones reales de 320, 390, 768 y 1440 px, navegación móvil y foco requieren servidor local aislado y se registran como pendientes hasta efectuarlas.

## Traspaso exacto

La tarea 15 hereda `publicNavigation`, `CatalogNavigation`, los tokens actuales y la proyección pública. Las fichas nuevas deben usar los datos editoriales existentes y no añadir responsables por inferencia.
