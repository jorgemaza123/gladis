# La mesa se prepara — revisión 2026-10-05

El movimiento acompaña la elección de buffet y servicios hasta la consulta por WhatsApp. Conserva la identidad palo de rosa, jade y verde suave, con Lora para títulos y Source Sans 3 para lectura y controles.

## Dirección

La portada se organiza en tres actos durante el recorrido:

1. El buffet abre la experiencia con una cortina breve y profundidad fotográfica ligada al scroll.
2. Los servicios se presentan como tres capítulos editoriales. La fotografía alterna de lado, avanza desde una profundidad máxima de 55 px y gira como máximo 3,5 grados hasta quedar frontal. El texto no se inclina.
3. La invitación final traza el dibujo de la mesa y presenta el CTA en una secuencia corta.

El hero tiene una apertura propia al cargar y una profundidad ligera al abandonar el viewport. El proceso conserva su hilo vertical. Ocasiones y FAQ funcionan como pausas visuales: la ocasión usa una entrada corta y FAQ no recibe reveal de scroll.

No hay carrusel automático, cursor personalizado, scroll bloqueado ni sección fijada durante varios viewports. Las transformaciones dependen del desplazamiento natural del visitante.

## Capas y compatibilidad

`Photo` separa tres responsabilidades:

- `.photo` reserva geometría, recorta bordes y contiene la cortina.
- `.photo-scene` recibe profundidad y movimiento continuo.
- `img` recibe el acercamiento óptico corto de entrada.

Esta separación corrige la competencia anterior: `mesa-lens` y `mesa-depth` ya no escriben `transform` sobre el mismo nodo. La profundidad usa `animation-timeline` solo cuando el navegador declara soporte. Los demás navegadores conservan una entrada por IntersectionObserver.

El controlador marca escenas ya recorridas o restauradas como asentadas, pero conserva observables las escenas que están entrando en el viewport. Liquida saltos rápidos por encima y observa únicamente ramas añadidas o retiradas. Ya no vuelve a consultar todo el árbol ante cada mutación. El foco asienta la entrada del contenedor sin cancelar la profundidad decorativa compatible.

## Ritmo

| Momento | Duración o rango | Intención |
|---|---:|---|
| Apertura del hero | 340–820 ms | Presentar texto, acción y foto sin retrasar el CTA |
| Títulos de capítulo | 560 ms / 14 px | Marcar buffet y servicios |
| Títulos de apoyo | 420 ms / 9 px | Acompañar proceso y ocasión |
| Cortina fotográfica | 920 ms; 760 ms hasta 960 px | Descubrir la fotografía con un velo translúcido perceptible |
| Lente fotográfica | 1.040 ms; 880 ms hasta 960 px; 820 ms en móvil | Dar presencia con una curva uniforme sin salto inicial |
| Reglas de menú | 620 ms | Conectar exploración y elección |
| Números del proceso | 440 ms | Explicar el recorrido de cotización |
| Dibujo final | 980 ms; 720 ms en móvil bajo | Cerrar con la firma gráfica |

En escritorio, las tres escenas de servicios usan View Timelines: plano fotográfico, desplazamiento interno de imagen y copia tienen capas independientes. En anchos de hasta 960 px no se ejecutan rotaciones 3D ni parallax continuo; quedan la cortina y el zoom corto. También se elimina el desfase entre familias.

Solo se animan `transform` y `opacity`, salvo el cambio puntual de color del número de proceso. No se animan tamaño, posición de layout, sombra, desenfoque ni radio de borde. `will-change` se limita a las cinco capas fotográficas con desplazamiento continuo.

## Accesibilidad y configuración

- El HTML permanece legible sin JavaScript y sin IntersectionObserver.
- Las fotografías futuras preparan una cortina al 76% de color cuando el controlador queda listo; la imagen permanece reconocible antes de activarse.
- Cada entrada se reproduce una vez durante la vida del nodo.
- El foco de teclado termina la entrada del contenedor antes de mostrar el control.
- `prefers-reduced-motion` desactiva animaciones y transiciones, también si cambia durante la sesión.
- `motionLevel: off` evita el observador, las entradas, las microinteracciones de FAQ y la transición del diálogo.
- Restaurar una página a mitad del recorrido no reproduce escenas ya leídas.
- No se alteran H1, metadata, rutas, destinatario de WhatsApp ni origen del cliente.

## Verificación actual

`npm.cmd run quality` aprobó TypeScript, lint, 12 casos del controlador, comercio, seguridad, presupuesto de activos y build. La suite cubre activación única, contenido restaurado, inserción y retiro incremental, foco, salto rápido, preferencia reducida, desmontaje y ausencia de APIs.

La coreografía se inspeccionó en el navegador integrado a 1280 × 720 y 390 × 844. En escritorio se comprobaron timelines y matrices 3D diferentes durante el recorrido; en móvil las tres escenas reportaron `animation: none` y `transform: none` para la capa 3D. A 390 px, documento y contenido midieron el mismo ancho; a 360 px el informe volvió a registrar cero desbordamiento horizontal.

Se ejecutó un recorrido automático de siete segundos sobre todo el documento, muestreando cada `requestAnimationFrame`. Resultados y método están en `evidencia/scroll-motion-browser-performance.json`. A 360 × 740, 390 × 844 y 1280 × 720 se observaron 59,8 FPS estimados, p95 de 16,8 ms, cero cuadros mayores de 34 ms, cero Long Animation Frames, cero tareas largas durante el recorrido y CLS 0.

La medición corresponde al Chromium integrado, sin limitación artificial de CPU ni dispositivo físico. No sustituye pruebas en teléfonos modestos, Core Web Vitals de campo, Lighthouse ni una matriz de motores. No se afirma mejora de conversiones.

## Archivos

- `app/motion.css`: coreografía y mejora progresiva.
- `app/design.css`: composición, capas fotográficas y apertura del hero.
- `components/home-experience.tsx`: capítulos y jerarquía de movimiento.
- `components/photo.tsx`: separación entre marco, escena e imagen.
- `lib/scroll-motion.ts`: ciclo de vida y observación incremental.
- `scripts/motion-tests.mjs`: pruebas aisladas del controlador.

## Apertura cinematográfica — 2026-10-07

La portada añade un acto previo a «La mesa se prepara». El video se reproduce automáticamente dentro de un hero de una pantalla. Al bajar, termina ese acto y la salida desemboca directamente en las ocasiones; desde allí las entradas, fotografías con profundidad, trazos y capítulos de servicios construyen el resto de la página.

El video usa reproducción nativa silenciosa, `playsInline` y bucle. Un `IntersectionObserver` lo pausa cuando el hero deja de estar visible y lo reanuda al volver, salvo pausa explícita. No intercepta la rueda ni modifica el tiempo del video según el scroll.

`prefers-reduced-motion` oculta la reproducción y conserva el poster y el contenido. El control permite pausar o reanudar en cualquier momento. Si JavaScript no se ejecuta, el poster y el HTML permanecen como contenido inicial legible.

La comprobación final observó avance autónomo, pausa manual sin cambio de fotograma, reanudación, pausa automática fuera del hero y salida limpia hacia la cuadrícula. Los primeros elementos de buffet adquirieron `arrived` al entrar, confirmando que la coreografía posterior continúa activa. Continúan pendientes las mediciones de FPS en un teléfono físico, consumo con red celular y compatibilidad visual en motores distintos de Chromium.

## Continuidad editorial después del video — 2026-10-07

El encabezado de ocasiones sube 34 px mientras aparece y las seis piezas fotográficas llegan con desplazamiento de 28 px, escala inicial de 0,975 y retardos de 0 a 140 ms. Cada imagen reutiliza la cortina y el acercamiento del sistema existente, por lo que el mosaico se compone por capas sin esconder contenido cuando JavaScript o IntersectionObserver no están disponibles.

Buffet conserva título, fotografía y reglas como movimientos principales. Los servicios mantienen la profundidad ligada al viewport en escritorio, ahora sobre composiciones abiertas sin caja. El proceso amplía la distancia vertical para que el hilo tenga tiempo de dibujarse. En móvil se acortan los efectos y la tarjeta de ocasión se reduce a imagen y título; no hay rotación 3D continua, scroll horizontal ni navegación secuestrada.

## Ritmo visible y capítulos alternados — 2026-10-07

Las superficies posteriores al video alternan palo de rosa y marfil cálido para que el avance entre ocasiones, buffet, servicios, proceso y preguntas se perciba como cambio de acto. La invitación verde conserva el cierre y no se añadió una transición decorativa entre colores: el corte coincide con el límite real de cada capítulo.

El observador exige una intersección del 18% y reserva el 10% inferior del viewport. La cortina dejó la curva de salida acelerada y usa `cubic-bezier(0.65, 0, 0.35, 1)`, de modo que la mayor parte del cambio sucede mientras la fotografía ya es visible. En la comprobación móvil, a 220 ms la cortina seguía en 0,855 y la lente en 1,048×; por ello el movimiento ya no se consume en el primer borde de la imagen.
