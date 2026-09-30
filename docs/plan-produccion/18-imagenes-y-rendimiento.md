# 18. Medir y optimizar rendimiento de la experiencia pública

Estado inicial: TODO. Anterior: [17. SEO técnico](17-seo-canonicos-rastreo.md). Siguiente: [19. Accesibilidad y móvil](19-accesibilidad-y-responsive.md).

## Objetivo adaptado

Auditar la compilación estática y dejar preparados los criterios de rendimiento sin inventar mediciones de laboratorio, red o campo.

## Auditoría realizada

- `Photo` usa `srcSet`, `sizes`, `width`, `height`, `decoding="async"`, carga diferida por defecto y prioridad alta sólo en las imágenes principales de hero y ficha.
- Las recomendaciones usan `Photo` con carga diferida y un tamaño explícito de tarjeta.
- El build emitió chunks separados para `quote`, `quote-cart-dialog`, `quote-cart-provider`, `attribution-provider`, `service-recommendations`, `photo`, `quote-cta` y `motion`; no se encontró importación de módulos de Workers o administración desde componentes cliente.
- El contenido de demostración usa imágenes remotas sin dimensiones, bytes ni variantes verificables. No se puede calcular transferencia real de imágenes ni afirmar que se cumple el presupuesto móvil.

## Presupuestos y límites

Los presupuestos definidos siguen siendo portada/ficha de hasta 1 MB de imágenes transferidas en móvil y JavaScript propio de interacciones nuevas de hasta 30 KB gzip, sin contar runtime compartido. El build local sólo permitió observar tamaños sin comprimir, no bytes transferidos ni gzip por ruta. No hay muestra de campo: LCP p75, INP p75 y CLS de producción permanecen pendientes.

No se instaló ni invocó Lighthouse, Playwright ni otra herramienta nueva. No se hicieron optimizaciones de código porque no hay un cuello de botella medido; tampoco se eliminó contenido, accesibilidad o el diálogo para alterar resultados.

## Verificación

Ejecutar `npm.cmd run build` y registrar su salida junto con el inventario de chunks. La medición completa requiere una compilación desplegada en un servidor aislado, URL concreta, navegador/dispositivo, red definida y herramienta configurada explícitamente antes de usarla.

## Traspaso exacto

La tarea 19 puede revisar teclado, foco y móvil sin alterar la carga de imágenes. Antes de reclamar rendimiento, la tarea 26 o 27 debe reemplazar las imágenes de demostración por archivos con dimensiones/variantes verificables y registrar una medición reproducible de portada, ficha y cotizador.
