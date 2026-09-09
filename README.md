# Plataforma de catering

Web con contenido editable, renderizado en servidor y cotizador. El nombre continúa provisional. Las siguientes iteraciones se concentran en la experiencia pública; la ampliación del CMS queda pausada por petición del usuario.

## Desarrollo local

Requiere Node 22.13 o posterior.

```powershell
npm install
node scripts/setup.mjs
npx wrangler d1 migrations apply DB --local --config wrangler.local.json
npm run dev
```

El sitio está en la dirección que imprime el servidor; administración en `/admin`. `.dev.vars` contiene la clave privada de arranque y no se versiona. `ADMIN_PASSWORD` sólo crea el primer propietario cuando se introduce correctamente; después se utiliza su contraseña almacenada como hash. Cambiar esa variable no cambia la contraseña de un usuario existente. Las sesiones individuales caducan a las ocho horas y pueden revocarse.

## Experiencia pública

- Portada compuesta por bloques configurables; navegación móvil, jerarquía editorial, colores y tipografía controlados por configuración.
- Catálogos con búsqueda, filtros y paginación. Detalles con relaciones entre propuestas, platos, modalidades y complementos, condiciones y galerías según los datos publicados.
- Fotografías responsive, dimensiones reservadas, carga diferida y prioridad para la imagen principal. La subida desde el editor genera WebP de hasta 480, 960 y 1600 píxeles sin ampliar la imagen original; admite archivos fuente de hasta 10 MB y 24 megapíxeles.
- Animaciones discretas con IntersectionObserver y CSS, respetando movimiento reducido. El contenido permanece visible sin JavaScript.
- Cotizador con borrador temporal en esta pestaña (24 horas), propuesta y complementos independientes, consentimiento y revisión previa. Enviar registra una referencia; reintentar no duplica la solicitud. WhatsApp es una acción adicional que prepara un mensaje.
- Los textos comerciales, imágenes y ofertas proceden de los datos, separados de las plantillas. Los datos de demostración no representan condiciones comerciales confirmadas.

## SEO

HTML inicial rastreable, un H1 por página, títulos y descripciones por contenido/listado, canonical, Open Graph, sitemap y breadcrumbs. Cambiar un slug publicado crea una redirección permanente hacia su dirección actual. Robots permite rastrear imágenes propias en `/api/media/` cuando se activa la indexación. Las búsquedas filtradas se excluyen del índice.

La demostración permanece fuera de Google. Antes de habilitar la indexación hay que confirmar dominio, información del negocio, oferta, fotografías propias y sus textos alternativos. Los datos estructurados comerciales sólo se generan con información verificada. No se inventan reseñas ni valoraciones.

## Base técnica existente

React, TypeScript y Vinext sobre Workers, D1 y R2. Los registros se almacenan en colecciones normalizadas; las versiones evitan sobrescrituras concurrentes y el historial conserva las últimas 30 versiones. La migración mantiene la tabla original y permite leer los datos anteriores. El guardado editorial sigue siendo agregado y las páginas aún leen el conjunto de contenido: no supone paginación total del almacenamiento en todos los recorridos.

Existen roles propietario, editor y consulta, auditoría, previsualización autenticada de borradores y solicitudes con seguimiento. Cada solicitud conserva una instantánea de la propuesta original. El límite de contenido es 5000 entradas y 5000 imágenes, sujeto también al límite de tamaño de la petición.

Los datos locales de D1/R2 viven en `.wrangler/` y son independientes de cualquier alojamiento. La eliminación física de archivos huérfanos está desactivada: sólo se informa su cantidad hasta disponer de coordinación atómica con la publicación. El historial editorial no sustituye copias de seguridad externas.

Los enlaces internos usan navegación de documento; las imágenes usan la canalización responsive propia, por lo que las reglas específicas de Next Link/Image están desactivadas en esos casos.

## Verificación

```powershell
npm run typecheck
npm run lint
npm run build
npm test
# Con el servidor local activo:
npm run test:integration
npm audit
```

Las pruebas cubren autenticación y permisos, CSRF, publicación y borradores, referencias de imágenes, SEO en HTML, redirecciones, conflictos de escritura, validación de cotizaciones, idempotencia, instantáneas e historial. Las pruebas de integración crean datos temporales y restauran el contenido previo; pueden dejar imágenes de prueba sin referencia en R2 local.

Se revisaron portada y cotizador en navegador, incluyendo tamaños móviles, navegación y revisión de la solicitud. No se ha realizado una auditoría Lighthouse ni una medición de conversiones; no se atribuye una puntuación 10/10. Vinext continúa en beta. No se han activado analítica de terceros, publicación pública ni indexación de la demostración.
