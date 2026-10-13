# Arquitectura SEO actual de Gladys

Actualizado: 2026-10-12.

## Capas públicas

| Capa | Ruta | Intención |
|---|---|---|
| Inicio | `/` | Descubrir la oferta completa y empezar una cotización |
| Servicios | `/servicios` | Explorar todos los servicios cotizables |
| Eventos | `/eventos` | Empezar por el tipo de celebración o evento |
| Empresas | `/empresas` | Resolver necesidades de equipos y organizaciones |
| Alquileres | `/alquiler` | Encontrar menaje, sillas, mesas, toldos, mantelería y mobiliario |
| Entretenimiento | `/entretenimiento` | Encontrar música, animación y experiencias |
| Producción | `/produccion` | Encontrar sonido, luces, pantallas, escenarios y streaming |
| Decoración | `/decoracion` | Encontrar decoración, flores y mesas de postres |
| Fotografía y video | `/foto-video` | Encontrar cobertura audiovisual y cabinas |
| Personalizados | `/personalizados` | Encontrar recuerdos, productos y kits |
| Guías | `/guias` | Resolver preguntas previas a la contratación |
| Cobertura | `/cobertura/lima-metropolitana` | Confirmar atención en Lima Metropolitana |
| Cotización | `/cotizar` | Preparar consulta; `noindex` por ser flujo transaccional |

## Inventario indexable

- 40 servicios cotizables: 10 propios y 30 coordinados con aliados.
- 18 páginas de eventos sociales y empresariales.
- 19 guías informativas.
- 8 hubs temáticos adicionales al inicio y los catálogos.
- Una página de cobertura con los 43 distritos, sin páginas puerta.

## Reglas técnicas

- Canonical autorreferente para páginas indexables.
- Title, description y H1 únicos por URL.
- Breadcrumbs y schema `Service`; `FAQPage` cuando existe FAQ visible; `Article` en guías.
- Sitemap generado solo con rutas indexables y públicas.
- Catálogos sin contenido responden 404.
- Robots permite rastreo general y protege `/admin`.
