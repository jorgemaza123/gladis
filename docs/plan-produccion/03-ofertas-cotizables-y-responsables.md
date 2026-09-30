# 03. Modelar ofertas, propietarios y reglas por datos

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [02. Centralizar los dos contactos comerciales](02-contactos-centralizados.md).
Siguiente: [04. Añadir contrato V2 y lectura compatible de solicitudes](04-contrato-carrito-v2.md).

## Objetivo

Una oferta puede ser principal o extra sin duplicarse ni inferir su responsable por nombre.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C1–C2.
- Comprobar el resultado técnico de la tarea 02. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `models/content.ts`
- `data/defaults.ts`
- `data/demo.ts`
- `lib/validation.ts`
- `repositories/site.ts`
- `components/admin/content.tsx`
- `components/admin/settings.tsx`

## Archivos que deben provenir de tareas anteriores

- Ninguno.

## Archivos POR CREAR en esta tarea

- `scripts/catalog-readiness.mjs`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Añadir C2 de manera compatible: tipos, emptyEntry, normalizeSite y Zod en el mismo cambio. Preservar campos al leer/guardar con editores existentes; no rediseñar panel.
2. Crear un diagnóstico de catálogo que reciba una exportación saneada o datos ficticios y enumere IDs sin responsable, reglas incompletas y referencias inválidas. El modo predeterminado debe ser de sólo lectura.
3. Mapear únicamente datos confirmados por ID; propuestas nuevas como toldos/bartender son borradores si faltan condiciones/fotos. No convertir automáticamente todos los complementos o páginas.
4. Mantener ownerId separado de provider y prominence. Nuevas ofertas requestable necesitan owner explícito; no dejar una futura oferta gastronómica caer al número Jorge por defecto.
5. Añadir los textos comerciales necesarios a `data/defaults.ts`, con sus tipos y normalización. No insertar listas de servicios dentro de componentes.

## Aceptación obligatoria

- [ ] Documento antiguo normaliza sin borrar contenido; guardar y recargar preserva campos nuevos.
- [ ] Cotizable sin propietario falla validación; artículo informativo no necesita uno.
- [ ] Cambiar título/slug no cambia dueño; referencias inválidas/ciclos no causan render recursivo.
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

Exportaciones y diagnóstico disponibles; lista de asignaciones pendientes por ID registrada.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [04. Añadir contrato V2 y lectura compatible de solicitudes](04-contrato-carrito-v2.md).
