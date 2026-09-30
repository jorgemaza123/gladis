# 08. Capturar origen inicial y contexto de cada CTA

Estado inicial: TODO. Este archivo prescribe implementación futura.
Anterior: [07. Crear bolsa de cotización persistente entre páginas](07-estado-carrito-persistente.md).
Siguiente: [09. Registrar eventos de CTA sin bloquear ventas](09-eventos-de-botones.md).

## Objetivo

Distinguir de dónde llegó, qué lo interesó primero y qué terminó solicitando.

## Antes de editar

- Trabajar desde `web/`, cuya ruta absoluta consta en [CONTEXTO](CONTEXTO.md).
- Leer [ESTADO](ESTADO.md), el traspaso anterior en [BITACORA](BITACORA.md) y [CONTRATOS](CONTRATOS.md): C6.
- Comprobar el resultado técnico de la tarea 07. Si falta un archivo de una tarea previa, verificar su ejecución; no inventar un import.
- Consultar los escenarios aplicables de [MATRIZ-DE-PRUEBAS](MATRIZ-DE-PRUEBAS.md) y registrar qué IDs se comprobaron en esta tarea. No marcar como verificado un escenario que aún dependa de una tarea futura.
- Confirmar los símbolos actuales con búsqueda/lectura. Los números de línea pueden cambiar. Si existe una implementación equivalente, adaptarla y documentarla antes de crear otra.
- No reemplazar el stack, rehacer el CMS, editar datos reales para probar ni agregar servicios externos no autorizados.

## Archivos existentes en la base que debes leer

- `app/layout.tsx`
- `components/public.tsx`
- `app/cotizar/page.tsx`
- `components/quote.tsx`

## Archivos que deben provenir de tareas anteriores

- `models/quote-v2.ts`
- `components/quote-cart-provider.tsx`

## Archivos POR CREAR en esta tarea

- `lib/attribution.ts`
- `components/attribution-provider.tsx`

Una migración necesaria debe ser nueva y generada desde el esquema verificado; su nombre se registra al crearla. No asumir que archivos futuros existen.

## Pasos en orden

1. Implementar AttributionV1 saneada y clasificación conservadora. Medir datos declarados; no afirmar conocer persona, palabra de búsqueda de Google o canal sin señales.
2. Preservar la página de entrada durante la sesión. `acquisitionEntryId` corresponde al primer CTA de una oferta con intención de consulta, no a cada visita de una ficha. `lastTouchPath` y `ctaPlacement` pueden cambiar; el cambio de principal no reescribe la adquisición.
3. UTM permitidas con límites y saneamiento de valores, paths sin query/hash, referrer sólo hostname. Evitar datos personales aun dentro de utm_campaign.
4. Separar contexto mínimo del formulario de consentimiento analítico opcional. Sin cookies externas, fingerprinting ni transmisión todavía.
5. Añadir helper para crear contexto de CTA; no cambiar selección principal como efecto de tracking.

## Aceptación obligatoria

- [ ] Entrar por una campaña de sillas conserva esa página de entrada. Pulsar primero un CTA de sillas y navegar después a buffet mantiene sillas como adquisición; visitar la ficha sin pulsar un CTA no inventa esa interacción.
- [ ] Principal cambia a buffet y origen original permanece.
- [ ] Referrer vacío→direct_unknown; correos/teléfonos/URLs en UTM se omiten; storage bloqueado no bloquea cotización.
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

Exports y placements fijados; payload saneado disponible para las tareas 09 y 12.
Al cerrar, añadir una entrada de BITACORA con archivos y exportaciones reales, payload vigente, migraciones, comandos ejecutados, resultados, pendientes y forma de reproducir/revertir.
Sólo con prerrequisitos satisfechos continuar con [09. Registrar eventos de CTA sin bloquear ventas](09-eventos-de-botones.md).
