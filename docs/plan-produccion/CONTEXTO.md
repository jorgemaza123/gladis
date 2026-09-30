# Contexto comprobado y límites

Fecha de inspección: 2026-09-18. Repositorio base: commit `d2a337d`.
Raíz de trabajo: `C:/Users/jorge/Desktop/plataforma_web_catering_gladis/web`.
Esta carpeta contiene instrucciones FUTURAS. Su creación no implementa sus funciones.

## Pedido del negocio

- Lima Metropolitana. Protagonistas: preparación de comida, catering, buffet y bartender/bebidas, atendidos por la tía.
- Jorge atiende alquiler de sillas, toldos, decoración, regalos personalizados y demás ofertas fuera de cocina/bar. Tiene otra web de DTF/sublimación, cuya URL aún no se proporcionó.
- Cualquier oferta cotizable puede iniciar la solicitud. El principal elegido determina el responsable del mensaje completo; los extras nunca cambian automáticamente el destinatario.
- Número proporcionado por Jorge: 902843481. Configuración internacional de Perú: 51902843481. Número de cocina pendiente.
- Conservar nombre provisional. No inventar precios, inventario, coberturas específicas, testimonios, teléfono de la tía ni condiciones.
- CMS ampliado permanece pausado. Sólo compatibilidad y controles mínimos para los campos de este recorrido sobre pantallas existentes; no construir otro CMS.
- Objetivo: calidad demostrada en todas las áreas del alcance, no prometer ausencia universal de errores ni resultados SEO garantizados.

## Qué existe

- React 19, TypeScript, Vinext beta, Vite y Zod; versiones exactas en package-lock.json. La arquitectura vigente es estática y no usa D1, R2, Drizzle ni bindings de Cloudflare para datos.
- `models/content.ts`: ContentEntry, SiteSettings, QuoteInput, QuoteRequest. Una selección principal + IDs de extras; un teléfono global.
- `data/defaults.ts`: emptyEntry, defaultSettings, normalizeSite. `data/demo.ts`: contenido estático vigente de la web.
- `repositories/site.ts`: lectura clonada del contenido estático. No hay guardado, historial ni redirecciones persistentes.
- No hay API de cotizaciones ni administración: el formulario prepara la conversación sin guardar datos del cliente.
- `components/public.tsx`: Shell, EntryCards, EntryDetail, bloques y relaciones visuales; un wa.me directo en footer.
- `components/quote.tsx`: formulario por pasos, sessionStorage, mensaje y wa.me calculados en cliente.
- `app/cotizar/page.tsx`: DTO público mínimo; admite principal sólo servicios/menus/paquetes.
- `app/[kind]/page.tsx`, `app/[kind]/[slug]/page.tsx`: listados y detalles genéricos, no rutas dedicadas por negocio.
- `lib/seo.ts`: metadataFor/canonicalFor; canonical personalizado rechaza queries. Listado aplica noindex a cualquier parámetro: corregir paginación/UTM.
- No hay componentes de CMS, subida de archivos, usuarios, sesiones, esquema ni migraciones. La edición se realiza en archivos del proyecto y se revisa antes de una publicación autorizada.
- `vite.config.ts` y `.openai/hosting.json` no declaran bindings de datos ni acreditan un despliegue productivo.
- No existen carrito multiservicio, métricas de origen, notificaciones automáticas ni sus rutas propuestas en el contrato.

## Comprobaciones previas

Typecheck, lint, build y pruebas aisladas de seguridad pasaron el 2026-09-18. No afirmar que esto sigue vigente sin ejecutar la tarea 01. Integración fue validada en la etapa anterior; no volver a ejecutarla sobre datos reales sin guardas. No existe certificación Lighthouse/campo ni ensayo productivo completo.

## Comandos ya existentes (desde web)

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd test
npm.cmd run dev
npm.cmd run test:integration
```
La integración modifica datos y trata de restaurarlos. La tarea 01 debe impedir su uso accidental en producción. En PowerShell validar cada exit code; un comando posterior exitoso no convierte un fallo previo en éxito. Si Node falla por EPERM del entorno, informar la limitación y usar el mecanismo de permisos disponible; no desactivar seguridad ni modificar configuración global de Git. Para leer Git, preferir ejecutar desde web; si hay propiedad dudosa, usar una excepción `git -c safe.directory=<ruta exacta>` sólo para esa llamada.
