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

El controlador marca escenas iniciales o restauradas como asentadas, liquida saltos rápidos por encima y observa únicamente ramas añadidas o retiradas. Ya no vuelve a consultar todo el árbol ante cada mutación. El foco asienta la entrada del contenedor sin cancelar la profundidad decorativa compatible.

## Ritmo

| Momento | Duración o rango | Intención |
|---|---:|---|
| Apertura del hero | 340–820 ms | Presentar texto, acción y foto sin retrasar el CTA |
| Títulos de capítulo | 560 ms / 14 px | Marcar buffet y servicios |
| Títulos de apoyo | 420 ms / 9 px | Acompañar proceso y ocasión |
| Cortina fotográfica | 680 ms; 500 ms hasta 960 px | Descubrir la fotografía sin cubrir leyendas |
| Lente fotográfica | 820 ms; 540 ms hasta 960 px; 480 ms en móvil | Dar presencia sin un zoom largo |
| Reglas de menú | 620 ms | Conectar exploración y elección |
| Números del proceso | 440 ms | Explicar el recorrido de cotización |
| Dibujo final | 980 ms; 720 ms en móvil bajo | Cerrar con la firma gráfica |

En escritorio, las tres escenas de servicios usan View Timelines: plano fotográfico, desplazamiento interno de imagen y copia tienen capas independientes. En anchos de hasta 960 px no se ejecutan rotaciones 3D ni parallax continuo; quedan la cortina y el zoom corto. También se elimina el desfase entre familias.

Solo se animan `transform` y `opacity`, salvo el cambio puntual de color del número de proceso. No se animan tamaño, posición de layout, sombra, desenfoque ni radio de borde. `will-change` se limita a las cinco capas fotográficas con desplazamiento continuo.

## Accesibilidad y configuración

- El HTML permanece legible sin JavaScript y sin IntersectionObserver.
- Las fotografías futuras preparan la cortina cuando el controlador queda listo, evitando que la imagen aparezca antes de la máscara.
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
