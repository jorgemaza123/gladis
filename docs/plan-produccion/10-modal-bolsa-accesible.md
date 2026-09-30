# 10. Construir modal de revisión de la bolsa

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [09. Registrar eventos de CTA sin bloquear ventas](09-eventos-de-botones.md).
Siguiente: [11. Crear mensaje y salida WhatsApp después de guardar](11-mensaje-whatsapp-y-confirmacion.md).

## Objetivo

Revisar principal, cantidades, extras y destinatario antes de solicitar.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C2–C3, C5.
- Comprobar el resultado técnico de la tarea 09. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `components/ui/button.tsx`
- `app/globals.css`
- `package.json`

## Archivos que deben provenir de tareas anteriores

- `components/quote-cart-provider.tsx`
- `lib/quote-cart.ts`
- `lib/business-contacts.ts`

## Archivos POR CREAR en esta tarea

- `components/quote-cart-dialog.tsx`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Inspeccionar API instalada de @base-ui/react o usar dialog nativo comprobado; no inventar imports ni añadir otra librería automáticamente.
2. El modal permite revisar líneas, editar cantidades y opciones, seleccionar el principal y quitar líneas. Muestra la etiqueta del responsable y avisa cuando no está disponible. Recibir únicamente el DTO público de etiqueta y disponibilidad; no importar configuración de servidor en el componente cliente. Preparar un espacio de recomendaciones vacío hasta la tarea 13, sin importar componentes que todavía no existen.
3. Principal visiblemente distinguido y extras opcionales. No preseleccionar servicios como venta agregada.
4. Cerrar/Escape conserva selección; foco inicial interior, trapping, fondo inerte, regreso al disparador. Navegación sin JavaScript mantiene enlaces a cotizar/servicios.
5. CTA prepara paso de contacto/confirmación; no simula envío ni abre WhatsApp antes de la tarea 11.

## Aceptación obligatoria

- [ ] Teclado completo, cerrar/reabrir conserva bolsa; principal borrado bloquea continuación hasta elegir.
- [ ] Textos largos y 20 líneas y viewport de 320 px no desbordan; destinos ambas familias correctos.
- [ ] No hay saltos de diseño ni advertencias de hidratación. El fondo queda inerte y fuera de la navegación de teclado mientras el modal está abierto.
- [ ] El contrato activo sigue coherente; todos los consumidores afectados compilan en esta misma tarea.
- [ ] No se introdujeron teléfonos en componentes ni asignaciones comerciales deducidas del título.
- [ ] No se afirmó envío/entrega de WhatsApp por observar un clic.
- [ ] Pruebas y límites registrados en BITACORA; ESTADO actualizado con evidencia.

## Verificación y límites

Ejecutar `npm.cmd run typecheck` y `npm.cmd run lint` cuando cambie código. Ejecutar `npm.cmd run build` cuando cambien rutas/componentes/configuración/runtime. Desde la tarea 02 usar `npm.cmd run test:commerce` sólo después de crear el script real; ampliar casos relevantes, no tests que sólo copien la implementación. `npm.cmd test` corresponde a la suite de seguridad existente.
Las pruebas de integración requieren servidor y almacenamiento AISLADOS según la tarea 01; nunca apuntarlas a producción ni a la DB compartida del usuario. Inspeccionar salida y exit code de cada comando.
No instalar ni invocar Playwright, Lighthouse, test:e2e o scripts inventados: si hace falta una herramienta nueva, comprobar compatibilidad, crear su configuración/entrada explícitamente y anotarlo antes de usarla.
Tareas de contenido/documentación usan sus verificaciones específicas; no repetir builds sin cambios que lo justifiquen.
No enviar mensajes reales, publicar, hacer push ni borrar datos del usuario por cumplir estas instrucciones; aplicar la autorización vigente a la acción concreta.

## Traspaso exacto

API real del diálogo y captura de revisión; integración de la tarea 12 usa este componente.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [11. Crear mensaje y salida WhatsApp después de guardar](11-mensaje-whatsapp-y-confirmacion.md).
