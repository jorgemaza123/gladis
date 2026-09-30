# 19. Revisar teclado, accesibilidad y respuesta móvil

Estado inicial: TODO. Adaptada el 2026-09-30 a la [arquitectura estática](ARQUITECTURA-ESTATICA.md).
Anterior: [18. Medir y optimizar rendimiento de la experiencia pública](18-imagenes-y-rendimiento.md).
Siguiente: [20. Endurecer los nuevos puntos de entrada y privacidad](20-seguridad-privacidad-y-abuso.md).

## Objetivo

Hacer que el catálogo estático, la bolsa y el cotizador puedan entenderse y operarse con teclado y en pantallas pequeñas. La web no tiene API, CMS, base de datos ni teléfono global de respaldo.

## Antes de editar

- Leer [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md), [ESTADO](ESTADO.md), [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md).
- Inspeccionar `components/public.tsx`, `components/quote.tsx`, `components/quote-cart-dialog.tsx`, `components/photo.tsx` y `app/globals.css` antes de modificarlas.
- No alterar `data/demo.ts` para simular una oferta, responsable, relación comercial o teléfono.
- Mantener que el destinatario de WhatsApp sale sólo del propietario de la oferta principal publicada; los extras nunca lo modifican.

## Alcance ejecutado

1. Revisar por lectura el foco visible global, el diálogo modal de Base UI, las etiquetas de controles, la restauración de bolsa, carga de fotos y reglas de movimiento reducido.
2. Garantizar que una opción declarada requerida en la configuración de una línea de bolsa use validación nativa (`required`) y que los avisos de restauración se anuncien como estado.
3. Mostrar una explicación sin JavaScript: el cotizador prepara la conversación en el navegador y se debe volver a seleccionar la oferta para identificar a su responsable. No se muestra ni infiere un teléfono global.
4. Revisar las reglas de anchura, controles de 44 px, `overflow-wrap`, altura del diálogo y `100dvh` como cobertura estructural de móvil.
5. Intentar una auditoría manual local sin abrir WhatsApp ni enviar datos. Registrar el resultado exacto, sin sustituirla por una afirmación de cumplimiento.

## Verificación obligatoria

- Si cambia código: ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test` y `npm.cmd run build`; inspeccionar salida y código de salida.
- Ejecutar `git diff --check` y registrar advertencias de fin de línea si las hubiera.
- Para cerrar como HECHO se requiere una matriz manual en 320, 360, 390, 768 y 1440 px, zoom 200 %, navegación por teclado, cierre con Escape, retorno de foco, diálogo modal, foto ausente y almacenamiento deshabilitado. No abrir WhatsApp ni declarar envío sólo por llegar a un enlace.
- No instalar herramientas de auditoría, ni añadir API, analítica persistente, D1, CMS o servicios externos para esta tarea.

## Límites de la arquitectura estática

- Si JavaScript o `sessionStorage` fallan, no hay servidor que guarde o enrute solicitudes. La interfaz debe comunicar el límite y no inventar un contacto alternativo.
- La demostración no contiene ofertas cotizables confirmadas, así que no autoriza probar el cambio de principal, los extras ni un destinatario real.
- La auditoría visual requiere un servidor local accesible al navegador de prueba; si ese entorno no responde, la tarea queda BLOQUEADA aunque las verificaciones estáticas pasen.

## Traspaso exacto

La tarea 20 debe conservar los controles accesibles añadidos, revisar cualquier punto de entrada real sin introducir persistencia y no convertir el aviso sin JavaScript en un contacto global. Sólo continuar tras disponer de un servidor aislado accesible y catálogo comercial confirmado para completar la matriz pendiente.
