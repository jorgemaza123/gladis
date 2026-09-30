# Plataforma de catering

Web estática y cotizador que prepara la conversación para WhatsApp. El contenido se edita en archivos del proyecto; no usa CMS ni base de datos.

## Desarrollo local

Requiere Node 22.13 o posterior.

```powershell
npm install
npm run dev
```

El sitio está en la dirección que imprime el servidor. No hay panel de administración, cuentas, sesiones ni configuración de base de datos.

## Experiencia pública

- Portada compuesta por bloques configurables; navegación móvil, jerarquía editorial, colores y tipografía controlados por configuración.
- Catálogos con búsqueda, filtros y paginación. Detalles con relaciones entre propuestas, platos, modalidades y complementos, condiciones y galerías según los datos publicados.
- Fotografías responsive, dimensiones reservadas, carga diferida y prioridad para la imagen principal. Las imágenes se definen en los archivos estáticos del proyecto.
- Animaciones discretas con IntersectionObserver y CSS, respetando movimiento reducido. El contenido permanece visible sin JavaScript.
- Cotizador con borrador temporal en esta pestaña (24 horas), propuesta y complementos independientes y revisión previa. No guarda una solicitud ni genera referencia: WhatsApp prepara un mensaje que el usuario decide enviar.
- Los textos comerciales, imágenes y ofertas proceden de los datos, separados de las plantillas. Los datos de demostración no representan condiciones comerciales confirmadas.

## SEO

HTML inicial rastreable, un H1 por página, títulos y descripciones por contenido/listado, canonical, Open Graph, sitemap y breadcrumbs. Las búsquedas filtradas se excluyen del índice.

La demostración permanece fuera de Google. Antes de habilitar la indexación hay que confirmar dominio, información del negocio, oferta, fotografías propias y sus textos alternativos. Los datos estructurados comerciales sólo se generan con información verificada. No se inventan reseñas ni valoraciones.

## Base técnica existente

React, TypeScript y Vinext para una web estática. El contenido se lee desde archivos versionados y se publica sólo mediante un despliegue autorizado. No utiliza base de datos, CMS remoto ni almacenamiento de solicitudes.

No existen roles, panel privado, auditoría, previsualización autenticada ni historial editorial. Conserva una copia del repositorio antes de editar contenido estático.

El procedimiento para un futuro ensayo autorizado y para recuperar una versión está en [docs/operations/release-runbook.md](docs/operations/release-runbook.md). No presupone un dominio ni publica el sitio.

## Edición de una oferta

Edita `data/demo.ts`; esa es la única fuente del contenido público. Para volver cotizable una oferta ya confirmada, declara en la misma entrada `requestable: true`, un `ownerId` válido, `quoteConfig` completo y las relaciones necesarias (`recommendations`, `coverageIds`, FAQ y catálogo externo, si existen). No deduzcas esos valores del título.

Los teléfonos se editan solamente en `config/business-contacts.ts`. Nunca los copies a `data/demo.ts` ni a un componente. Conserva los campos editoriales existentes al modificar una entrada y ejecuta `npm run test:commerce`, `npm test` y `npm run build` antes de un despliegue autorizado.

Los enlaces internos usan navegación de documento; las imágenes usan la canalización responsive propia, por lo que las reglas específicas de Next Link/Image están desactivadas en esos casos.

## Verificación

```powershell
npm run typecheck
npm run lint
npm run build
npm test
npm audit
```

Las pruebas cubren la arquitectura estática, la validación de reglas comerciales, la bolsa temporal y el origen saneado. No hay pruebas de API, autenticación, persistencia, migraciones ni restauración de datos.

No se ha completado una auditoría visual aislada de portada y cotizador, Lighthouse ni medición de conversiones; no se atribuye una puntuación 10/10. Vinext continúa en beta. No se han activado analítica de terceros, publicación pública ni indexación de la demostración.

## Estado de entrega

La base estática y sus comprobaciones locales están preparadas, pero no hay datos comerciales confirmados, URL HTTPS de ensayo ni publicación autorizada. Consulta [docs/plan-produccion/29-evaluacion-final-y-traspaso.md](docs/plan-produccion/29-evaluacion-final-y-traspaso.md) para el alcance demostrado y los pasos de reapertura.
