# 15. Completar fichas de servicios y conexión con personalizados

Estado inicial: TODO. Anterior: [14. Portada y navegación](14-portada-y-navegacion.md). Siguiente: [16. Ocasiones y cobertura](16-ocasiones-y-cobertura-lima.md).

## Objetivo adaptado

Permitir que cada ficha muestre únicamente sus propios detalles editoriales y un catálogo externo opcional, sin convertir demostraciones en servicios confirmados ni almacenar datos de visitantes.

## Alcance

1. Añadir a `ContentEntry` los campos normalizados `faqItems`, `processSteps` y `externalCatalog`; los datos antiguos reciben listas vacías y `null`.
2. Validar FAQ y proceso con límites editoriales. `externalCatalog` sólo admite HTTPS sin credenciales; una URL ausente no genera enlace.
3. Renderizar en la ficha sólo proceso, preguntas y catálogo externo que existan en la propia entrada, junto con los detalles, mínimos, logística, galería y recomendaciones ya disponibles.
4. El enlace externo abre explícitamente en una pestaña nueva, no añade datos de contacto a la URL, conserva bolsa/origen de sesión y registra `external_catalog` sin agregar ni reemplazar la oferta principal.

## Fuera de alcance

- No editar `data/demo.ts` para inventar regalos, alquileres, catálogo externo, responsables o testimonios verificados.
- No crear eventos persistentes, API, CMS, base de datos ni envío automático de WhatsApp.
- No afirmar que un enlace externo corresponde a una tienda real hasta tener URL confirmada.

## Verificación

Ampliar las pruebas comerciales con normalización conservadora y URL externa válida, HTTP rechazado y URL con credenciales rechazada. Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test`, `npm.cmd run build` y `git diff --check`. La navegación real al catálogo externo y las fichas con datos comerciales quedan pendientes hasta disponer de esos datos y un navegador aislado.

## Traspaso exacto

La tarea 16 puede usar los campos normalizados sin inferir valores. Para mostrar contenido, debe recibirlo explícitamente en `data/demo.ts` u otra fuente estática autorizada; `externalCatalog` permanece `null` si no existe una URL HTTPS confirmada.
