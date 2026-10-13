# Auditoría final antes de producción — Gladys

Fecha: 2026-10-12

## Resultado ejecutivo

- URLs indexables antes: **93**.
- URLs indexables después: **90**.
- Páginas eliminadas o fusionadas físicamente: **0**. Las rutas siguen accesibles para no romper enlaces.
- Nuevos `noindex,follow`: **3**.
- Páginas funcionales que ya eran `noindex`: `/cotizar` y `/privacidad`.
- Servicios auditados: **40**; 10 directos y 30 coordinados con aliados.
- Eventos auditados: **18**.
- Guías auditadas: **19**.
- Hubs auditados: **8**.

## Consolidaciones y canibalización

| Ruta noindexada | URL principal | Motivo |
|---|---|---|
| `/servicios/bebidas-barra-eventos` | `/servicios/bar-bartender` | La intención comercial de barra para eventos queda cubierta por bartender. |
| `/tipos-evento/desayunos-corporativos-lima` | `/servicios/desayunos-corporativos-coffee-break` | El servicio es la respuesta principal a la misma búsqueda transaccional. |
| `/tipos-evento/catering-eventos-empresariales-lima` | `/empresas` | El hub empresarial concentra la coordinación B2B completa. |

También se diferenciaron explícitamente estas intenciones:

- Cocina: preparación y menú personalizado; buffet: formato de servicio y montaje de alimentos.
- Cumpleaños general: celebración familiar o adulta; cumpleaños infantil: necesidades de niños y familias.
- Matrimonio: recepción completa; matrimonio civil: celebración íntima posterior a la ceremonia.
- Hubs de alquileres, personalizados, entretenimiento, producción y foto/video: orientación y comparación; fichas individuales: contratación concreta.

## Contenido y servicios aliados

- Ninguna URL indexable quedó por debajo de 240 palabras tras excluir módulos compartidos de navegación y cotización.
- Ningún par comparte 50% o más de secuencias exactas de cinco palabras; ese umbral identifica páginas donde solo cambian términos puntuales.
- Se revisaron los 30 servicios `partner`. El copy indica coordinación con aliados, confirmación previa y disponibilidad sujeta a evaluación.
- No se publican existencias, cantidades, propiedad de equipos, precios fijos ni disponibilidad garantizada.
- Las introducciones, detalles, proceso y preguntas frecuentes se ajustaron al servicio o evento correspondiente.

## Arquitectura comercial

- El Home conserva esta jerarquía: propuesta de Gladys, Cocina, Bartender, Menaje, más soluciones, eventos, empresas y cotización.
- Los 40 servicios no se muestran como un listado plano en el hero; se descubren mediante familias y el explorador.
- Los ocho hubs explican qué resuelven, para quién son, opciones principales, criterios de elección, servicios relacionados y CTA.
- Las 18 páginas de eventos enlazan servicios pertinentes, permiten seleccionar opciones y cotizar sin otra navegación obligatoria.
- Las 19 guías responden intenciones informativas distintas e incorporan recomendaciones y enlaces comerciales contextuales.
- `/paginas/nosotros` dejó de estar huérfana al añadirse al footer.

## Cotizador y WhatsApp

- Los 40 servicios seleccionables usan nombres visibles y estados comerciales válidos; ningún servicio `planned` entra al flujo.
- El mensaje incluye servicios, evento, fecha, distrito, número de invitados y notas sin repetir bloques.
- `51923106197`: los 9 servicios de cocina, alimentación, catering, bar y menaje.
- `51902843481`: los otros 31 servicios de personal, alquileres, entretenimiento, producción, decoración, fotografía, video y personalizados.
- Si se seleccionan servicios de ambos grupos, el servicio principal determina el responsable y el mensaje conserva la consulta completa.
- El campo de invitados inicia vacío y muestra `Ej. 50` como placeholder.

## Validación visual

- Viewports comprobados: 360, 390, 430, 1280 y 1440 px.
- Se revisaron inicio, menú móvil, footer, los ocho hubs y rutas representativas de servicios, eventos, guías y cotización.
- Sin desbordamiento horizontal, texto cortado, botones tapados, imágenes visibles rotas ni elementos bloqueados por animación.
- Menú móvil legible y operable; recorrido completo hacia abajo y hacia arriba sin contenido que quede transparente.
- Consola del navegador sin errores en las rutas comprobadas.

## SEO técnico

- Sitemap: 90 URLs indexables.
- Titles y H1: 90 únicos.
- Canonical, meta description, Open Graph, breadcrumbs, JSON-LD e indexabilidad comprobados por URL.
- 144 enlaces internos comprobados sin destino roto; 404 verificada.
- `robots.txt` permite Googlebot, Bingbot, OAI-SearchBot y el rastreador genérico; restringe rutas administrativas.
- La configuración local no demuestra indexación real ni Core Web Vitals de usuarios reales.

## Pruebas finales

- `npm run typecheck`: aprobado.
- `npm run lint`: aprobado.
- `npm run quality`: aprobado; incluye 22 pruebas de movimiento, comercio, seguridad, activos y build de producción.
- `npm run test:seo`: aprobado; 90 URLs, 90 titles, 90 H1 y 144 enlaces internos.
- `npm run test:content`: aprobado; 0 páginas delgadas y 0 pares con riesgo alto de plantilla.
- Evidencia por URL: `docs/seo/evidencia/auditoria-contenido.json`.

## Decisiones externas pendientes

- Confirmar dominio definitivo, correo, horario y perfiles sociales reales.
- Configurar Google Business Profile, Search Console y Bing Webmaster Tools.
- Validar CDN/firewall y mediciones de Core Web Vitals después del despliegue.

No se realizó commit ni push.
