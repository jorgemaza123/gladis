# La mesa se prepara — 2026-10-04

El recorrido de scroll acompaña la elección de buffet y servicios, hasta la consulta por WhatsApp. Se conserva la composición responsive y la identidad: palo de rosa `#EAD4D1`, superficie `#F6E8E5`, jade `#176459`, tinta `#203832` y verde suave `#EDF5F1`; Lora para títulos y Source Sans 3 para lectura y controles.

## Dirección y referencias

La fotografía es el momento protagonista: una cortina del mismo color de su sección se retira como un mantel que descubre la mesa. El resto acompaña con títulos, reglas y el dibujo de la mesa. No se cambian los tamaños de los contenedores, no se fijan secciones durante el scroll ni se impide llegar a los botones.

Referencias consultadas: [Home Page Scroll, Serhii Churilov / Awwwards](https://www.awwwards.com/inspiration/home-page-scroll-serhii-churilov) como referencia de recorrido; [Planetoño / Tubik](https://tubikstudio.com/works/planetono) como caso de narrativa al desplazarse en una propuesta de comida. Se adapta el principio de recorrido al catering; no se reproducen su interfaz, activos ni motores 3D.

La implementación prioriza transformaciones y opacidad siguiendo la [guía de rendimiento de web.dev](https://web.dev/articles/animations-guide). La preferencia de movimiento reducido se respeta al entrar y si cambia durante la sesión, según [W3C C39](https://www.w3.org/WAI/WCAG22/Techniques/css/C39). La profundidad vinculada al desplazamiento usa [CSS animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline) solo cuando el navegador declara soporte; el revelado funciona de forma independiente.

## Coreografía

| Momento | Movimiento | Intención |
|---|---|---|
| Títulos de sección | Entrada breve, 18 px y opacidad parcial | Introducir cada tema sin ocultar el texto de apoyo |
| Buffet y ocasiones | Cortina vertical dentro de la foto y acercamiento suave | Mostrar la comida y el ambiente manteniendo intactas leyendas y avisos IA |
| Familias de servicios | Fotografías escalonadas a 0/90/180 ms en escritorio | Hacer legibles las tres familias sin mover su cuadrícula |
| Opciones de menú | Regla que se traza sobre cada opción | Acompañar el paso de explorar a elegir |
| Cómo cotizar | Números y separadores; hilo de avance ligado al scroll si es compatible | Explicar las tres etapas reales |
| Invitación final | Dibujo del plato, título y flecha en secuencia | Destacar el CTA existente, siempre disponible |

Las fotos de buffet y ocasiones tienen una profundidad de ±3% únicamente desde 961 px y si hay soporte nativo. No hay listeners de rueda/touch, bucle JavaScript por frame, reproducción infinita, fuentes, imágenes ni dependencias adicionales. Las fotografías reservan la misma geometría. Por debajo de 961 px, la cortina dura 650 ms y se retira el desfase entre servicios.

## Comportamiento y accesibilidad

- El HTML inicial y el contenido pendiente de observar permanecen visibles. JavaScript añade efectos al entrar en pantalla; no añade `opacity: 0` a secciones pendientes.
- Elementos ya visibles al cargar o restaurar la posición quedan asentados, sin repetir la entrada. Cada entrada sucede una vez durante la vida de ese nodo.
- El foco dentro de una región termina su animación. Formularios, navegación, FAQ y botones no esperan a que termine un efecto.
- Cambiar a movimiento reducido cancela observadores y elimina la activación de efectos. Volver a movimiento normal no repite animaciones de elementos ya leídos.
- Cambios de ruta o de catálogo que insertan contenido en la misma raíz registran los nuevos nodos; los retirados se dejan de observar. El desmontaje limpia listeners y observadores.
- No se altera H1, metadata, canonical, rutas, responsables de WhatsApp ni origen del cliente. Los textos humanizados de la revisión anterior se conservan.

## Archivos y comprobación

`app/motion.css` contiene la coreografía; `lib/scroll-motion.ts` su activación y limpieza; `components/motion.tsx` la conecta a la raíz pública. `components/home-experience.tsx` identifica los momentos sin añadir contenedores a las cuadrículas. `app/layout.tsx` carga la hoja después de `design.css`.

`scripts/motion-tests.mjs` prueba los eventos y ciclo de vida del controlador con un DOM acotado; `test:motion` forma parte de `quality`. Estas pruebas no representan una medición de FPS, LCP/CLS ni una prueba de un iPhone físico. La aceptación visual y de rendimiento debe registrarse con el navegador y los tamaños realmente observados.

Verificación automatizada del 2026-10-04:

- `npm.cmd run quality`: exit 0. Incluye TypeScript, lint, 12 casos de movimiento, comercio, seguridad, presupuesto de activos y build. Registro: `evidencia/scroll-motion-quality.log`. Se corrigió un aviso de lint en el doble de eventos de las pruebas antes de la ejecución final.
- Comprobador existente `scripts/design-smoke.mjs`, ejecutado mediante una copia temporal que solo cambia el nombre de su informe: 15 rutas HTTP 200, un H1 por página, títulos, canonical y noindex del cotizador. Informe separado: `evidencia/scroll-motion-http.json`. No se modificó el informe HTTP anterior.
- Los activos siguen siendo 24 JPEG (2.356.956 bytes) y dos fuentes (50.772 bytes). No se añadieron dependencias.
- Revisión final de CSS: se igualó la especificidad de la duración móvil para aplicar realmente 650 ms y se declaró duración positiva en los dos efectos con timeline nativa. Build posterior exit 0: `evidencia/scroll-motion-final-build.log`.
- Vista previa del build iniciada en `http://127.0.0.1:4173/`. Revisión visual real de esta coreografía pendiente; los tests de DOM simulado no equivalen a scroll observado ni prueban todos los motores. No se declara incremento de conversiones ni métricas de campo.
