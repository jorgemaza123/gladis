# 06. Persistir solicitudes V2 con compatibilidad e idempotencia

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [05. Resolver catálogo, compatibilidad y responsable en servidor](05-motor-validacion-y-destinatario.md).
Siguiente: [07. Crear bolsa de cotización persistente entre páginas](07-estado-carrito-persistente.md).

## Objetivo

Guardar una solicitud completa y asignada antes de cualquier salida hacia WhatsApp.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C3–C5.
- Comprobar el resultado técnico de la tarea 05. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `repositories/quotes.ts`
- `db/schema.ts`
- `drizzle.config.ts`
- `app/api/quotes/route.ts`
- `app/api/quotes/[id]/route.ts`
- `components/admin/quotes.tsx`

## Archivos que deben provenir de tareas anteriores

- `models/quote-v2.ts`
- `lib/quote-v2-validation.ts`
- `lib/resolve-quote.ts`

## Archivos POR CREAR en esta tarea

- Ninguno.

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Extender POST según discriminante schemaVersion; V1 sigue aceptado durante transición. Validar con el resolver de la tarea 05 y persistir snapshot V2 completo.
2. Conservar las columnas JSON existentes cuando sean suficientes. Si hacen falta índices o columnas, generar una migración nueva con la herramienta instalada; nunca editar migraciones existentes.
3. Mismo requestId/payload retorna referencia previa y snapshot original. Payload diferente devuelve 409. Resolver reintento antes de releer catálogo cambiante.
4. GET/PATCH/DELETE y la proyección del panel leen V1 y V2. No exponer detalles al público por referencia. Para POST de cotizaciones, elevar deliberadamente el límite actual de 16 KB a 32 KiB, según C3 y C4, y mantener la lectura del cuerpo acotada durante la recepción. Ajustar las pruebas de borde al nuevo límite; no cambiar los límites de sesión ni de eventos. Clasificar errores y no filtrar mensajes internos de D1.
5. La respuesta V2 provisional es `{reference,demo,recipient}`, sin enlace todavía; definir `recipient` con la forma de C5. La tarea 11 completa la respuesta. Conservar la respuesta V1 durante la transición y adaptar los consumidores afectados para que la compilación siga pasando.

## Aceptación obligatoria

- [ ] Persistencia sobre DB de pruebas; dos solicitudes concurrentes idénticas producen una fila.
- [ ] Mismo ID distinto payload devuelve 409; precio/título editados después no alteran snapshot.
- [ ] V1 sigue visible/exportable; API anónima no lista ni recupera datos de otros; cuerpo excesivo devuelve 413; fallo DB devuelve 503 sin detalles SQL.
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

Registrar forma de respuesta y migración real; fixtures válidos para UI y la tarea 11.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [07. Crear bolsa de cotización persistente entre páginas](07-estado-carrito-persistente.md).
