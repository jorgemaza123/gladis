# Plan SEO de lanzamiento de Gladys

## Implementado en código

1. Arquitectura por servicios, eventos, empresas, alquileres, entretenimiento, producción, decoración, foto y personalizados.
2. Páginas comerciales con intención diferenciada, contenido visible, FAQ, CTA e integración con el cotizador.
3. Centro de guías con contenidos de organización, catering, alquileres, entretenimiento y empresa.
4. Enlaces internos desde menú, portada, hubs, fichas, eventos, guías y footer.
5. Schema `Organization`, `Service`, `FAQPage`, `Article` y `BreadcrumbList` donde corresponde.
6. Sitemap, robots, canonical, Open Graph y respuestas 404 controladas.
7. Estados comerciales `active`, `partner`, `planned`, `draft` y `hidden`; solo los dos primeros son públicos.
8. Una sola página de cobertura para Lima Metropolitana, sin duplicación por distrito.

## QA previo a publicar

- `npm run typecheck`
- `npm run lint`
- `npm run test:commerce`
- `npm run test:motion`
- `npm test`
- `npm run test:performance`
- `npm run build`
- Servidor de producción local y `npm run test:seo`

## Trabajo externo al repositorio

- Confirmar el dominio definitivo y actualizar `settings.origin` si cambia.
- Completar correo, horario, dirección pública y redes solo cuando estén verificados.
- Configurar Google Business Profile, Search Console y Bing Webmaster Tools.
- Enviar el sitemap después del despliegue y comprobar indexación, Core Web Vitals y rastreo.
- Sustituir imágenes referenciales únicamente cuando existan fotografías verificadas.

## Límites

- No publicar precios, testimonios, clientes, disponibilidad ni experiencia inventados.
- No crear páginas por distrito, número de invitados o variaciones casi idénticas.
- No indexar administración, privacidad ni flujo de cotización.
