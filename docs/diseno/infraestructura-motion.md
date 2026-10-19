# Infraestructura inmersiva compartida — Fase 2

Baseline de diseño/comercio: `80a8a3a`. No contiene escenas nuevas.

## Integración y alcance

`HomeMotion` devuelve `null`, al final de `HomeExperience`, sin wrapper ni cambio de layout.
Busca registros `[data-motion-section]`. Si no hay registros, no importa el controlador,
no crea observers y no añade listeners de movimiento. Actualmente Home normal no tiene
registros: Hero, C3, navbar y Lenis conservan sus controladores originales.

El módulo común es `lib/immersive-motion.ts`; no distingue entre scroll virtual/nativo:
lee `window.scrollY`, sin tocar wheel, touch, teclado, offsets o navegación.

## API para futuros capítulos

La integración declarativa futura será añadir `data-motion-section="nombre"` a la sección
real del capítulo. Eso no debe duplicar el DOM ni ocultar contenido.
Registrar el contenedor estructural sin transforms; animar hijos para no realimentar sus medidas.

También existe una API pequeña para configuración explícita, con **un solo owner Home**:

```ts
const motion = createImmersiveMotion(homeRoot);
const unregister = motion.register({
  element: chapter,
  range: (device) => ({
    start: device.breakpoint === 'mobile' ? 0.9 : 1,
    end: 0,
  }),
});
motion.refresh(); // Solo después de un cambio estructural que no detecte RO.
unregister();     // Desmontar ese capítulo.
motion.destroy(); // Abandonar Home; idempotente.
```

`range` puede ser un objeto o una función del estado compartido. No crear un controlador
o listener por capítulo. `onProgress(p, device)` es opcional; preferir CSS a renders React
por frame. `snapshot()` devuelve estado/soporte y registros, no referencias DOM.

## Progreso

Valores por defecto: `start = 1`, `end = 0`, fracciones del alto del viewport.

```text
inicio = topDocumento - altoViewport × start
final  = bottomDocumento - altoViewport × end
p      = clamp((scrollY - inicio) / max(1, final - inicio), 0, 1)
```

Pasa de 0 antes de la entrada a 1 al salir el borde inferior por el borde superior.
Retrocede al subir y se detiene cuando cesa el scroll. No hay temporizadores ni clock nuevo.
Se publica una sola variable: `--motion-progress`. Los rangos deben tener sentido físico;
`start`/`end` son coordenadas del viewport, no segundos.

## Activación, medidas y limpieza

- Un IntersectionObserver compartido, margen 200 px: activa/desactiva trabajo, no mide
  continuamente el progreso. Los saltos largos asientan también los endpoints omitidos.
- Un listener pasivo de scroll y como máximo un rAF pendiente; solo cuando hay registros
  próximos. Ningún bucle permanente ni listener por capa.
- Geometría cacheada. Scroll usa números; registro/resize/invalidación estructural hacen
  lecturas agrupadas antes de escribir CSS. Un ResizeObserver observa raíz y capítulos,
  nunca filas. Captura `toggle` para cambios de `details`, sin MutationObserver nuevo.
- `refresh()` invalida y agrupa cambios explícitos de layout. No llamarlo cada frame.
- Sin IO: un único listener pasivo mantiene el gate mediante geometría cacheada; no
  consulta rects por scroll ni agenda rAF lejos de los capítulos. Sin RO: resize, toggle
  y `refresh()` mantienen la invalidación estructural.
- Reduced Motion y documento oculto desconectan IO/RO, cancelan rAF y retiran scroll.
  Se conservan únicamente eventos de estado necesarios para reanudar/limpiar. Reduced
  publica progreso 1 y estado asentado; hidden congela y remide al volver visible.
- Al quitar el último registro/desmontar Home: retirar todos los eventos propios,
  desconectar observers, cancelar frame, limpiar registros y restaurar atributos/variable
  CSS preexistentes. Una importación tardía no crea controlador tras unmount.

## Estado compartido y capacidades

Una fuente de matchMedia para pointer fine/coarse, hover y reduced motion. El resize
actualiza dimensiones y breakpoint: mobile ≤760; tablet 761–960; desktop ≥961.
Esto **no** sustituye la condición de Lenis ni activa Smooth en touch.

Feature detection usa `CSS.supports` para `animation-timeline: scroll()/view()` y nombres
de scroll/view timeline. Se expone la capacidad; esta fase no crea timelines ni efectos.
No se asume compatibilidad universal y no se carga polyfill. El controlador JS funciona
sin esas propiedades. Ver [MDN animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline).

## Contrato CSS, foco y anchors

- HTML base visible y seleccionable. Nada de `opacity: 0` esperando hidratación.
- Los futuros efectos deben activarse solo con estado runtime válido; conservar composición
  estática completa si no hay JS, no hay soporte o está activo Reduced Motion.
- `data-motion-decoration` se reserva a una capa puramente visual, `aria-hidden`, sin
  enlaces/botones; aplica `pointer-events: none`. Nunca en el wrapper comercial.
- `data-motion-content` identifica contenido que debe asentarse ante foco/hash/reduced.
  La pequeña hoja `app/immersive-motion.css` elimina transform/máscaras/opacidad de ese
  contenido cuando su sección tiene `data-motion-safe`.
- No poner máscaras, clips o transforms que oculten contenido en ancestros comerciales:
  un hijo no puede deshacer el recorte de un padre. Limitar el efecto a decoración.
- Focus y hash marcan la sección como asentada inmediatamente. No se intercepta la
  navegación ni se reproduce una entrada desde cero. Al dejarla con teclado o continuar
  scroll, se conserva el progreso real; si el foco sigue dentro, mantiene la protección.

## Diagnóstico solo en desarrollo

Abrir `/?motionDebug=1` y recorrer C4 → Ocasiones → Empresas → Proceso → Cierre.
No hay overlay ni logs permanentes. Inspeccionar `<main id="contenido">`:

```js
JSON.parse(document.querySelector('#contenido').dataset.motionDebug)
```

Muestra breakpoint, pointer, hover, reduced, soporte, cinco registros, progreso, activo,
settled, listener/frame pendiente y estadísticas. Los elementos llevan la variable CSS
y atributos de estado, sin transformaciones. No registra Hero, C3 ni FAQ.

Con `/?motionDebug=1&scroll=native` se prueba la misma infraestructura con Native desktop.
En producción el parámetro no activa registros, importación del motor, UI ni estadísticas.

`p95ms` mide cálculo y escrituras del update, incluyendo remedir cuando hay invalidación;
excluye la serialización del propio diagnóstico. Ventana móvil de hasta 128 muestras,
reiniciada al recargar. No equivale a FPS, coste global de render, GPU, batería o INP.

## Validación y presupuesto

`npm run test:motion` conserva las 22 comprobaciones anteriores y Arrival, y añade
`immersive-motion-tests.mjs`: progreso, reversa, medidas, batching, IO/RO, fallback,
breakpoints/pointer, reduced desktop/mobile, hidden, foco/hash, unregister y route unmount.

No hay dependencias nuevas. Medir chunk gzip, coste real, altura y capturas antes/después.
Meta: <8 KB gzip, p95 update ≤2 ms; cero nuevos frames del motor lejos de los registros.
Antes de aplicar escenas, validar Desktop/Tablet/Mobile/Reduced y los contratos de
39 servicios, 38 fichas cotizables indexables, nueve familias y 88 URLs indexables.

No implementar C4-A, Ocasiones, Empresas, Proceso o cierre dentro de esta fase.
