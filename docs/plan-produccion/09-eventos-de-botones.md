# 09. Registrar eventos de CTA sin bloquear ventas

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [08. Capturar origen inicial y contexto de cada CTA](08-atribucion-origen.md).
Siguiente: [10. Construir modal de revisión de la bolsa](10-modal-bolsa-accesible.md).

## Objetivo

Contar clics y guardados con significado correcto y sin datos personales.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C6.
- Comprobar el resultado técnico de la tarea 08. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `db/schema.ts`
- `lib/auth.ts`
- `env.d.ts`
- `repositories/quotes.ts`

## Archivos que deben provenir de tareas anteriores

- `lib/attribution.ts`

## Archivos POR CREAR en esta tarea

- `app/api/events/route.ts`
- `repositories/events.ts`
- `lib/events.ts`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Crear endpoint POST acotado, mismo origen, validación allowlist, rate limit y fecha y hora del servidor; GET público inexistente.
2. Crear tabla mínima de eventos con ID único y retención configurable; nueva migración y ensayar local. No almacenar payload JSON sin filtrar.
3. Cliente registra sólo si analítica autorizada; no await de métricas en navegación. Dedupe eventId en reintento. Eventos falsificados siguen siendo señales, no verdad comercial.
4. `quote_saved` se registra en el servidor una sola vez por `requestId`, dentro de la transacción de la solicitud o mediante una salida pendiente persistente e idempotente. No aceptarlo como un evento emitido por el navegador. Si los eventos de interfaz se conectan en tareas posteriores, el endpoint no debe inventar interacciones.
5. Probar que un fallo de las métricas opcionales no afecta al botón. No abrir enlaces de WhatsApp ni enviar notificaciones externas.

## Aceptación obligatoria

- [ ] Reintento mismo eventId cuenta una vez; payload datos personales/desconocido no se almacena.
- [ ] POST spam/cuerpo grande limitado; acceso GET devuelve 403 o 405 sin datos.
- [ ] Sin consentimiento no hay eventos opcionales; quote_saved coincide con filas reales, no duplicados.
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

Migración, eventos disponibles y política de retención documentadas para la tarea 21.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [10. Construir modal de revisión de la bolsa](10-modal-bolsa-accesible.md).
