# 02. Centralizar los dos contactos comerciales

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [01. Fijar base reproducible y aislar pruebas mutantes](01-base-y-pruebas-seguras.md).
Siguiente: [03. Modelar ofertas, propietarios y reglas por datos](03-ofertas-cotizables-y-responsables.md).

## Objetivo

Cambiar un único teléfono de configuración y actualizar todos sus futuros destinos.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C1.
- Comprobar el resultado técnico de la tarea 01. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `models/content.ts`
- `data/defaults.ts`
- `lib/validation.ts`
- `components/public.tsx`
- `components/quote.tsx`

## Archivos que deben provenir de tareas anteriores

- Ninguno.

## Archivos POR CREAR en esta tarea

- `config/business-contacts.ts`
- `lib/business-contacts.ts`
- `scripts/commerce-tests.mjs`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Crear sólo la configuración C1: cocina con teléfono null y eventos con número indicado por usuario. Mantener configuración fuera de componentes.
2. Crear funciones puras de consulta/validación de contacto y DTO público de etiqueta/estado. No incorporar teléfonos por servicio.
3. Crear `scripts/commerce-tests.mjs` siguiendo el mecanismo aislado para TypeScript de la suite existente o un mecanismo instalado cuya compatibilidad se haya comprobado. Añadir `test:commerce` a `package.json` antes de invocarlo. Inyectar contactos ficticios en las pruebas; nunca abrir WhatsApp.
4. No retirar aún el campo legado ni romper consumidores; preparar único punto de resolución para las tareas 05, 11 y 12.
5. Documentar que edición central requiere nueva compilación/despliegue y no altera mensajes ya abiertos.

## Aceptación obligatoria

- [ ] Contactos conocidos resuelven etiqueta; ID desconocido/null/inactivo devuelve indisponible.
- [ ] Formato internacional inválido no genera destino. Config fixture cambiada refleja número nuevo.
- [ ] Ningún componente nuevo contiene el literal del teléfono; tareas existentes aún compilan.
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

Anotar las exportaciones reales de configuración y resolución para la tarea 05; comprobar que `test:commerce` ya está disponible.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [03. Modelar ofertas, propietarios y reglas por datos](03-ofertas-cotizables-y-responsables.md).
