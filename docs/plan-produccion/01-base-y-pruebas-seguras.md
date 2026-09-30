# 01. Fijar base reproducible y aislar pruebas mutantes

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [Leer README](README.md).
Siguiente: [02. Centralizar los dos contactos comerciales](02-contactos-centralizados.md).

## Objetivo

Obtener una base verificable y evitar que una prueba restaure o borre datos de los dos operadores.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): CONTEXTO completo; C4, C6.
- Comprobar el resultado técnico de la inspección del repositorio. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `package.json`
- `package-lock.json`
- `scripts/smoke.mjs`
- `scripts/platform-tests.mjs`
- `scripts/security-tests.mjs`
- `wrangler.local.json`
- `vite.config.ts`

## Archivos que deben provenir de tareas anteriores

- Ninguno.

## Archivos POR CREAR en esta tarea

- `scripts/assert-test-environment.mjs`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Inspeccionar Git y dependencias reales. Conservar cambios ajenos; no reinstalar ni actualizar por rutina. Registrar HEAD y comandos en BITACORA.
2. Crear una guarda importada antes de cualquier inicio de sesión, `fetch` o escritura en ambos scripts mutantes. Admitir únicamente un origen loopback validado con `URL` y la habilitación explícita `TEST_ALLOW_MUTATIONS=1`. Un `TEST_ORIGIN` ausente, remoto o fuera de la política debe abortar antes de acceder a la red. No basta comprobar si el texto contiene «localhost».
3. Preparar DB/R2 de pruebas en directorio aislado nuevo y servidor con puerto específico. Verificar opción de persistencia soportada por Wrangler/Vite instalado antes de escribir comando; documentarlo. No reutilizar .wrangler del usuario. Crear fixture mínimo de propietario de pruebas; no leer ni copiar la clave real .dev.vars al log.
4. Separar las comprobaciones de base de las pruebas de integración aisladas. Si falta el runtime o hay un bloqueo de permisos, registrarlo sin desactivar controles. Escribir instrucciones exactas para iniciar y detener únicamente el servidor de prueba.
5. No cambiar lógica de ventas en esta tarea.

## Aceptación obligatoria

- [ ] typecheck, lint, build y npm test pasan con estado real.
- [ ] La guarda rechaza https://ejemplo.invalid, dominios cuyo nombre contiene localhost y loopback sin opt-in antes de fetch.
- [ ] Integración en copia aislada restaura sólo sus fixtures; el contenido de la DB de trabajo permanece intacto.
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

Guardar puerto, configuración y comandos REALES del entorno aislado en BITACORA; todas las tareas posteriores los reutilizan.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [02. Centralizar los dos contactos comerciales](02-contactos-centralizados.md).
