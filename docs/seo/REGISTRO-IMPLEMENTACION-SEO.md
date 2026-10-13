# Registro de implementación SEO de Gladys

Última actualización: 2026-10-12

## Estado por fase

| Fase | Estado | Resultado |
|---|---|---|
| Auditoría y arquitectura | Completada | Inventario, intenciones, rutas y reglas técnicas documentadas. |
| Servicios propios | Completada | 10 ofertas activas, cotizables y enlazadas. |
| Servicios de aliados | Completada | 30 páginas pilar publicadas como `partner`, sin promesas ni precios inventados. |
| Eventos sociales y B2B | Completada | 18 páginas con selección de servicios y conversión directa. |
| Hubs y navegación | Completada | Eventos, empresas, alquileres, entretenimiento, producción, decoración, foto y personalizados. |
| Guías | Completada | 19 guías con intención informativa y enlaces comerciales pertinentes. |
| Datos estructurados | Completada | Organization, Service, FAQPage, Article y BreadcrumbList. |
| Cotización | Completada | 40 servicios agrupados; un mensaje y responsable según servicio principal. |
| QA | Completada localmente | Suite completa, build, auditoría individual de contenido/SEO y revisión real en navegador aprobados. |

## Cambios realizados

- Incorporado el catálogo autorizado de servicios propios y coordinados con aliados.
- Añadidas páginas pilar para alimentación, personal, alquileres, producción, entretenimiento, decoración, fotografía y personalizados.
- Añadidos diez eventos: infantiles, quinceaños, baby shower, matrimonio civil, fiestas en casa y cinco verticales B2B.
- Creado `/eventos` y ampliados `/empresas`, `/alquiler` y `/personalizados`.
- Creados `/entretenimiento`, `/produccion`, `/decoracion` y `/foto-video`.
- Reorganizados el menú, footer, portada, explorador y cotizador para mostrar toda la oferta sin saturar el encabezado.
- Fijada la asignación de WhatsApp: `923106197` para los 9 servicios de cocina, alimentación, catering, bar y menaje; `902843481` para los otros 31 servicios.
- Ampliadas las FAQ visibles y añadido schema FAQ en las fichas que las muestran.
- Ampliado el centro a 19 guías originales y útiles.
- Añadidas auditorías automatizadas de sitemap, robots, status, canonical, title, description, H1, JSON-LD, enlaces internos, extensión y similitud del contenido.
- Actualizados los mapas SEO, de servicios, eventos y empresas.
- Consolidadas tres intenciones solapadas mediante `noindex,follow`: bebidas/barra frente a bartender, desayunos corporativos como evento frente al servicio y catering empresarial frente al hub `/empresas`.
- Enlazada `/paginas/nosotros` desde el footer para eliminar la única página huérfana detectada.

## Validación registrada

- `npm run typecheck`: aprobado.
- `npm run test:commerce`: aprobado para 40 servicios, 18 ocasiones y los dos números de WhatsApp.
- `npm run quality`: aprobado; incluye TypeScript, lint, 22 pruebas de movimiento, comercio, seguridad, activos y build.
- `npm run test:seo`: 90 URLs indexables, 90 titles únicos, 90 H1 únicos y 144 enlaces internos verificados.
- `npm run test:content`: 90 URLs auditadas, ninguna por debajo de 240 palabras y ningún par con riesgo alto de plantilla por coincidencia exacta.
- Navegador real: inicio, los ocho hubs y rutas representativas de servicio, evento, guía y cotización sin errores de consola, contenido invisible ni desbordamiento horizontal en 360, 390, 430, 1280 y 1440 px.
- Evidencia detallada: `docs/seo/evidencia/auditoria-contenido.json` y `docs/seo/AUDITORIA-FINAL-PRODUCCION.md`.
- Pulido previo al lanzamiento y decisión pendiente de arquitectura/dominio: `docs/seo/PULIDO-SEO-PRELANZAMIENTO.md`.
- No se ha hecho commit ni push.

## Pendiente fuera del código

- Dominio definitivo, correo, horario, redes, Google Business Profile y herramientas para webmasters.
- Validación de CDN/firewall y rastreo real después del despliegue.

## Regla de mantenimiento

Cada servicio nuevo debe tener responsable, estado comercial, intención propia, metadata, contenido útil, FAQ, enlaces y cotización antes de entrar al sitemap.
