# 04. Añadir contrato V2 y lectura compatible de solicitudes

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [03. Modelar ofertas, propietarios y reglas por datos](03-ofertas-cotizables-y-responsables.md).
Siguiente: [05. Resolver catálogo, compatibilidad y responsable en servidor](05-motor-validacion-y-destinatario.md).

## Objetivo

Definir líneas, cantidades y principal sin romper solicitudes V1 ni UI actual.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C3–C4.
- Comprobar el resultado técnico de la tarea 03. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `models/content.ts`
- `lib/quote-validation.ts`
- `repositories/quotes.ts`
- `components/admin/quotes.tsx`
- `scripts/platform-tests.mjs`

## Archivos que deben provenir de tareas anteriores

- `scripts/commerce-tests.mjs`

## Archivos POR CREAR en esta tarea

- `models/quote-v2.ts`
- `lib/quote-v2-validation.ts`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Crear los tipos y el esquema exactos de C3. Añadir una representación normalizada que distinga V1 y V2 mediante un discriminante explícito; conservar las exportaciones originales mientras tengan consumidores. Definir también `AttributionV1` en `models/quote-v2.ts` y validar desde ahora su estructura y los límites de C6. La tarea 08 implementa su captura y saneamiento; no debe posponerse un tipo requerido por la API de la tarea 06.
2. Validar UUID de línea/intento, máximo de 20 líneas, principal perteneciente, cantidad finita positiva y opciones como IDs. Validación contra catálogo corresponde a la tarea 05.
3. Versionar snapshot nuevo y lectura de históricos. No reescribir masivamente filas V1.
4. Adecuar consumidores de tipos afectados para que compilen ahora; no importar módulos previstos para pasos posteriores.
5. Añadir casos ficticios de V1 y V2 a `scripts/commerce-tests.mjs`.

## Aceptación obligatoria

- [ ] V1 se lee y muestra sin schemaVersion; V2 conserva todas las líneas.
- [ ] Principal inexistente, UUID duplicado, más de 20 líneas, NaN/infinito y claves inesperadas de autoridad fallan.
- [ ] Modelo compila sin any ni desactivar lint; API pública aún conserva comportamiento V1.
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

Anotar nombres reales del esquema/normalizador V2 para las tareas 05, 06 y 07.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [05. Resolver catálogo, compatibilidad y responsable en servidor](05-motor-validacion-y-destinatario.md).
