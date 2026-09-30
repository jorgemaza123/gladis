# 05. Resolver catálogo, compatibilidad y responsable en servidor

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [04. Añadir contrato V2 y lectura compatible de solicitudes](04-contrato-carrito-v2.md).
Siguiente: [06. Persistir solicitudes V2 con compatibilidad e idempotencia](06-persistencia-api-cotizacion-v2.md).

## Objetivo

La línea principal, validada en servidor, determina siempre el responsable.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C2–C5.
- Comprobar el resultado técnico de la tarea 04. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `repositories/site.ts`
- `repositories/quotes.ts`
- `lib/auth.ts`

## Archivos que deben provenir de tareas anteriores

- `config/business-contacts.ts`
- `lib/business-contacts.ts`
- `models/quote-v2.ts`
- `lib/quote-v2-validation.ts`
- `scripts/commerce-tests.mjs`

## Archivos POR CREAR en esta tarea

- `lib/resolve-quote.ts`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Crear función pura que recibe V2, catálogo y configuración; devuelve snapshot preparado + diagnóstico de línea/contacto. Sin D1 ni fetch en la función.
2. Resolver sólo ofertas publicadas/requestable; comprobar límites, incrementos, opciones permitidas y mínimos. Usar etiquetas y condiciones del servidor.
3. Extra de otro owner no cambia destino. No confiar owner, nombre, precio ni teléfono del payload.
4. Teléfono ausente produce destinatario conocido pero no disponible; el contrato permite guardar, no fabricar enlace. Cambios del catálogo se explican por línea.
5. Aplicar prueba de cantidades al servidor aunque UI haya validado.

## Aceptación obligatoria

- [ ] Con datos ficticios de propietario explícito: buffet principal con cien sillas adicionales dirige a `cocina`; sillas principales con buffet dirige a `eventos`; bartender principal con regalos dirige a `cocina`; regalos solos dirige a `eventos`.
- [ ] Cambiar principal explícitamente cambia dueño; variar extras no.
- [ ] Owner falsificado rechazado, oferta retirada/opción eliminada marca error de línea, configuración ausente sin fallback.
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

Resolver puro y casos ficticios de la matriz comercial listos para la API de la tarea 06.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [06. Persistir solicitudes V2 con compatibilidad e idempotencia](06-persistencia-api-cotizacion-v2.md).
