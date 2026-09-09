# Plataforma de catering — primera base funcional

Este repositorio contiene la aplicación. En el espacio de trabajo original vive en `web/`; los HTML y capturas de Stitch permanecen intactos en las carpetas del directorio superior y no forman parte de este repositorio.

## Ejecutar en local

Requiere Node 22.13 o posterior.

```powershell
git clone https://github.com/jorgemaza123/web-gladis.git
cd web-gladis
npm install
node scripts/setup.mjs
npx wrangler d1 migrations apply DB --local --config wrangler.local.json
npm run dev
```

Abre la dirección que imprime el servidor. El panel está en `/admin`. La clave local es el valor de `ADMIN_PASSWORD` del archivo privado `.dev.vars`. Nunca debe ponerse en el código, Git ni una variable pública. En alojamiento se configura como secreto del servidor. Una clave no configurada o de menos de 24 caracteres deshabilita el acceso.

## Uso del panel

1. Configuración: cambia nombre, frase, contacto, WhatsApp, navegación y pie de página.
2. Biblioteca: sube fotos JPG/PNG/WebP de hasta 5 MB. Escribe su texto alternativo y guarda. Los archivos se almacenan en R2; sus referencias se guardan en la base de datos.
3. Servicios o Menús: crea un contenido, selecciona una imagen, completa el texto y su SEO. Elige Publicado y guarda. Los borradores no tienen página pública.
4. Secciones de inicio: cambia títulos, fotos, visibilidad y orden. Los listados del inicio muestran los elementos publicados marcados como destacados.
5. SEO: configura el dominio HTTPS real. Mantén la indexación apagada hasta verificar el contenido y sustituir las muestras. Cada detalle tiene título, descripción, imagen social y canonical generado con ese dominio.

Guardar aplica todas las modificaciones pendientes. Ver web abre la última versión guardada. Si otra sesión guardó antes, se rechaza la sobrescritura y se pide recargar. La sesión de acceso caduca como máximo a las 8 horas y también al cambiar de día UTC o al rotar la clave.

## Arquitectura

- TypeScript, React y Vinext: HTML generado en el servidor, rutas por slug, componentes reutilizables y CSS local sin Tailwind CDN.
- `models/content.ts`: tipos del contenido.
- `data/demo.ts`: datos iniciales separados de la presentación. No se vuelven a cargar encima de los cambios del administrador.
- `repositories/site.ts`: acceso a D1. Un documento versionado mantiene el guardado de esta primera etapa atómico. No usa localStorage. La capa permite migrar a colecciones normalizadas o a otro CMS sin cambiar las plantillas públicas.
- `db/schema.ts` y `drizzle/`: esquema y migraciones versionadas. No se crean tablas durante las peticiones.
- `lib/validation.ts`: validación del lado del servidor; rechaza slugs duplicados, referencias inexistentes, URL inseguras y activación de SEO con modo demo.
- `components/public.tsx`: registro de bloques disponibles.
- `components/admin.tsx`: editor de colecciones, bloques, imágenes, configuración y SEO.
- `app/api/`: sesiones con cookie HttpOnly, comprobación de origen para cambios, contenido y archivos. No se envía la contraseña al cliente desde el servidor.

La base D1 y el almacén R2 locales quedan en `.wrangler/`. No equivalen al almacenamiento alojado: cada entorno conserva sus propios contenidos. Las fotos iniciales son las URL de muestra de Stitch; deben sustituirse por archivos propios antes del lanzamiento.

## SEO implementado

HTML rastreable, un H1 por página, navegación semántica, breadcrumbs visibles, metatítulo y descripción editables por detalle e inicio, Open Graph y Twitter con la imagen elegida, canonical desde dominio configurado, estado noindex y sitemap solo con páginas publicadas indexables. `/admin` no es indexable y no publica el documento CMS sin autenticación. El dominio no se deduce de cabeceras de visitantes. No se generan reseñas, precios, direcciones ni páginas repetidas por distrito.

## Alcance y siguiente etapa

Esta entrega inicia la implementación; no cubre todavía el prompt completo de Stitch.

- Cotizador de tres pasos y resumen para WhatsApp con selección preservada. No guarda solicitudes ni simula envíos. Falta el registro de solicitudes y su panel de seguimiento.
- Acceso con una clave de administración. Falta identidad individual, recuperación, roles, auditoría y endurecimiento operativo para administración multiusuario.
- Faltan modelos y editores especializados de platos, precios, modalidades, paquetes, cobertura, testimonios, galerías múltiples, relaciones entre servicios y menús, y opciones controladas de colores/tipografías/logo.
- Las páginas de listado y algunos textos comerciales del cotizador todavía usan textos de plantilla; deben incorporarse a la configuración antes de considerar todo el contenido administrable.
- Se puede crear y duplicar contenido, despublicarlo y ordenarlo; no hay borrado ni historial editorial, previsualización de borradores, redirecciones automáticas al cambiar slugs o archivado separado del borrador.
- Biblioteca con subida múltiple, búsqueda, alt y selección. Pendientes transformación responsive, compresión, dimensiones, punto focal, reemplazo, limpieza de archivos huérfanos y borrado con comprobación de uso. Por ahora subir imágenes web optimizadas.
- Faltan datos estructurados comerciales cuando se confirme la información real del negocio, analítica consentida y revisión editorial local de SEO.
- El guardado agregado está limitado a 300 contenidos, 300 imágenes y aproximadamente 1 MB de metadatos. Para un catálogo mayor, paginar y normalizar colecciones en el repositorio.
- Revisar avisos de dependencias del scaffold antes de un lanzamiento público; se aplicó la corrección de React 19.2.8. Vinext es una dependencia beta, por lo que conviene valorar su estabilidad para producción.

## Verificación

```powershell
npx tsc --noEmit
npm run build
# Con el servidor de desarrollo activo:
node scripts/smoke.mjs
```

La prueba de integración crea contenido temporal, verifica acceso, CSRF, borradores, publicación, SEO en HTML, H1, configuración compartida, conflictos de guardado y carga/selección de imagen. Restaura el documento original al terminar. Una imagen mínima de prueba queda en el almacenamiento local sin referencia. No se han hecho pruebas visuales en navegador ni auditoría Lighthouse.
