# 07. Crear bolsa de cotización persistente entre páginas

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [06. Persistir solicitudes V2 con compatibilidad e idempotencia](06-persistencia-api-cotizacion-v2.md).
Siguiente: [08. Capturar origen inicial y contexto de cada CTA](08-atribucion-origen.md).

## Objetivo

Conservar selección entre navegación, recarga y modal sin guardar datos personales.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C3, C6.
- Comprobar el resultado técnico de la tarea 06. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `app/layout.tsx`
- `components/public.tsx`
- `components/quote.tsx`

## Archivos que deben provenir de tareas anteriores

- `models/quote-v2.ts`
- `scripts/commerce-tests.mjs`

## Archivos POR CREAR en esta tarea

- `lib/quote-cart.ts`
- `components/quote-cart-provider.tsx`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Crear reducer puro con add/update/remove/setPrimary/reset; fusionar entryId+opciones ordenadas. No convertir cantidad de invitados en número de sillas por suposición.
2. Crear un provider cliente con los datos públicos mínimos y persistencia en `sessionStorage`, versionada y con vencimiento de 24 horas. Mantener estable el renderizado inicial del servidor y restaurar la bolsa después del montaje. No acceder a `window` durante SSR. Montarlo en el layout público o en el contenedor verificado que permita comprobar la navegación; no esperar a la tarea 12 para comprobar su funcionamiento.
3. Retirar principal deja primaryItemId null y requiere elección; no sustituirlo por otro automáticamente.
4. Reconocer el borrador legado del cotizador mediante un adaptador explícito cuando sea seguro. Migrar únicamente selecciones válidas, sin copiar nombre, teléfono ni correo a la bolsa. Informar cualquier descarte parcial sin provocar un error de renderizado.
5. Mantener los datos de contacto únicamente en memoria mientras se completa el formulario; después de una recarga, explicar que deben introducirse de nuevo. No incorporar el modal ni efectos de envío todavía.

## Aceptación obligatoria

- [ ] Reducer cubre duplicados, variantes, límites y principal eliminado.
- [ ] Navegar con anchors reales y recargar conserva bolsa; storage bloqueado sigue en memoria.
- [ ] JSON corrupto/expirado/antiguo se recupera sin datos personales ni hydration warnings.
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

Documentar hook/actions reales del provider para las tareas 08, 10 y 12.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [08. Capturar origen inicial y contexto de cada CTA](08-atribucion-origen.md).
