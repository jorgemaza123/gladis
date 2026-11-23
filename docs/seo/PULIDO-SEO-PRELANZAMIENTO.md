# Arquitectura SEO previa al lanzamiento

Fecha: 2026-10-12

## Arquitectura de servicios implementada

- `/servicios` es el hub general para quien sabe qué servicio necesita o quiere explorar toda la oferta.
- El hub organiza la oferta en ocho familias navegables. La cobertura de fotografía y video y la cabina/360 están retiradas del catálogo público.
- Los hubs `/alquiler`, `/entretenimiento`, `/produccion`, `/decoracion` y `/personalizados` conservan una intención especializada y ayudan a comparar opciones de una sola familia.
- `/eventos` organiza la oferta por ocasión; `/empresas`, por necesidad de una organización. No sustituyen al catálogo general.
- Las fichas de alimentación existentes conservan sus rutas y `/menus/menu-criollo-eventos` sigue separada.

La antigua arquitectura de complementos quedó retirada de la navegación, los enlaces internos, el sitemap y las canonicals. Sus rutas permanecen únicamente como origen de redirecciones permanentes `301` de un salto hacia `/servicios`.

## Control de canibalización

| Página | Intención principal |
|---|---|
| `/servicios` | Descubrir o localizar cualquier servicio por familia |
| `/eventos` | Empezar por la ocasión que se está organizando |
| `/empresas` | Resolver reuniones, celebraciones y necesidades de una organización |
| `/alquiler` | Comparar menaje, mobiliario, mantelería, mesas, toldos y vehículo ceremonial |
| `/entretenimiento` | Comparar música, animación y experiencias |
| `/produccion` | Comparar recursos técnicos y audiovisuales |
| `/decoracion` | Comparar ambientación, flores y mesas de postres |
| `/personalizados` | Comparar recuerdos, productos y kits personalizados |

## Cambio futuro al dominio definitivo

El canonical actual permanece en `https://www.gladyseventos.com`.

Cuando se conecte el dominio definitivo hay que cambiar:

1. Mantener `data/demo.ts`: valor `demoContent.settings.origin` en el dominio principal.
2. Mantener `scripts/seo-http-audit.mjs` y `scripts/redirect-tests.mjs` alineados con el origen de producción.
3. Verificar en Vercel que el host temporal y las variantes sin `www` redirijan al dominio canónico.
4. Verificar en Search Console el sitemap y las URLs principales después de cada cambio de arquitectura.

`lib/seo.ts`, el sitemap, robots, Open Graph, breadcrumbs y JSON-LD derivan sus URLs desde `site.settings.origin`; no requieren editar canonicals individualmente.

Después del cambio se deben ejecutar `npm run quality`, `npm run test:seo`, `npm run test:content` y `npm run test:redirects`, comprobar el host anterior y enviar el sitemap del nuevo dominio a los buscadores.

Los registros históricos de `docs/plan-produccion/BITACORA.md` y las evidencias fechadas no se reescriben.

## Validación de la migración

- 37 fichas migradas al nuevo prefijo y una redirección adicional para el hub antiguo.
- 89 URLs indexables en el sitemap; 39 corresponden a fichas bajo `/servicios/`.
- Cero URLs antiguas en el sitemap.
- 89 titles y 89 H1 únicos.
- 139 destinos de enlaces internos comprobados sin errores.
- Todos los redirects antiguos comprobados con estado 301, un solo salto, destino 200 y canonical nueva.
- `npm run typecheck`, `npm run lint`, `npm run quality`, `npm run test:seo`, `npm run test:content` y `npm run test:redirects`: aprobados.
