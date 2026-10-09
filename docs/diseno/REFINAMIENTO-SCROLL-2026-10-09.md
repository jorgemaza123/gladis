# Refinamiento de la presentación y el scroll — 2026-10-09

## Alcance y conservación

El propietario autorizó corregir los puntos de la evaluación visual anterior: repetición de escenas, objetos duplicados, entradas deslavadas, duración del recorrido y títulos demasiado fragmentados. Esta intervención mejora la presentación existente; no establece una calificación objetiva de 10/10.

Se conservaron la rama `audit/gladis-pre-optimizacion`, el checkpoint previo `3d0d63e` y todos los cambios existentes. Las copias inmediatamente anteriores a este refinamiento están en `outputs/scroll-presentation/baseline/`; las copias TSX/TS usan extensión `.snapshot` para no entrar en TypeScript. No se ejecutó reset, push ni despliegue.

Skills aplicadas: `design-taste-frontend` y `ui-ux-pro-max`, leídas antes de intervenir. Impeccable no tenía un `SKILL.md` operativo localizado. Humanizer no se necesitó porque no se reescribió contenido.

Archivos de implementación de esta intervención:

- `app/design.css`: composición, proporciones, tipografía y ritmo responsive de las escenas.
- `app/motion.css`: movimiento diferenciado por escena y eliminación de animación acumulada en el contenedor.
- `components/home-service-journey.tsx`: renderizado de una sola imagen en las composiciones que no requieren capas independientes.

El resto de cambios que muestra Git procede de intervenciones previas. `data/home-service-scenes.ts` coincide exactamente con el snapshot anterior a este trabajo. Se mantienen textos, fotos, video, paleta, tipografías, rutas, IDs, enlaces, parámetros de cotización, datos, origen de sesión, responsables, WhatsApp y SEO. No se añadieron dependencias ni backend.

## Hallazgos y correcciones

| Problema comprobado | Causa | Corrección aplicada |
|---|---|---|
| Repetición de bandas y movimientos similares | Cocina, Personalizados y Flores reutilizaban una fotografía en tres bandas; los otros servicios compartían movimientos genéricos | Una imagen completa para cada una de esas tres escenas. Los tres servicios de recortes conservan tres planos. Se renderizan 12 imágenes en vez de 18 |
| Herramientas repetidas en bartender y platos/cubiertos repetidos en menaje | Los recortes entregados contenían objetos coincidentes en las capas principal y secundaria | Máscaras CSS estáticas conservan botella/cítricos y servilleta en sus planos respectivos; se ajustan posición y escala sin alterar los archivos originales |
| Imágenes deslavadas durante la entrada | La opacidad de varias capas se multiplicaba con la del contenedor | Opacidad constante de las imágenes y su contenedor. El movimiento usa transformaciones, sin bloquear la visibilidad |
| Movimiento acumulado en la alternativa sin View Timelines | Dos reglas antiguas animaban `.service-visual` además de sus imágenes y tenían mayor especificidad | Se retiraron esas dos reglas. Las imágenes se animan; el contenedor queda estable |
| Recorrido monótono y largo | Alturas, proporciones y duración iguales para capítulos con distinta cantidad de contenido | Cocina conserva mayor peso fotográfico; las composiciones de recortes tienen proporciones propias; Flores usa un encuadre en arco. Atención, Personalizados y Flores cierran el recorrido con menor altura |
| Títulos fragmentados y demasiada separación en móvil/tablet | Tamaño y ancho del título, escenario mínimo alto y cascada del ancho de escenas pares | Tipografía y anchuras equilibradas, alturas según proporción, CTA adaptable y ancho máximo de 520 px para las composiciones de tablet, con excepciones fotográficas |

El movimiento conserva la jerarquía existente: Cocina tiene un acercamiento leve; bartender ensambla sus planos; menaje desplaza sus elementos con rotación moderada; atención mantiene el volumen de la bandeja; personalizados conserva toda su composición; flores cierra con un acercamiento discreto. En escritorio compatible se usa el progreso del scroll con una zona de reposo entre el 46 % y el 68 % de la animación. Las entradas temporales duran entre 520 y 660 ms, con retrasos de hasta 75 ms.

Móvil/tablet y la alternativa sin View Timelines usan una entrada única que termina exactamente en `transform: none`. Se conservaron las correcciones anteriores del observador, hidratación, saltos directos y movimiento reducido. No se añadió JavaScript por fotograma al producto.

## Comprobaciones ejecutadas

- `npm.cmd run quality`: exit 0. Incluye TypeScript, oxlint, 22 pruebas del ciclo de vida de animación, comercio, seguridad estática, presupuesto de activos y build.
- Después del último ajuste de especificidad del ancho de tablet: `npm.cmd run build`, exit 0.
- `git diff --check`: correcto.
- Persisten avisos no bloqueantes de Vinext/Nitro sobre imports, clasificación de rutas y dependencias opcionales; no se interpretan como errores del producto ni como nuevas funcionalidades.

### Navegador y evidencia visual

Microsoft Edge real en modo headless, con perfil de prueba aislado y CDP en 9230, contra el build de producción local en `http://127.0.0.1:4179/`. Se inspeccionaron capturas de viewport durante recorridos y composiciones completas. No se atribuye esta validación al navegador integrado de Codex.

- Recorridos de principio a footer y vuelta arriba a 700 y 11.000 px/s en **375 × 812, 768 × 1024 y 1440 × 900**. Sin imágenes rotas, desbordamiento, excepciones JavaScript ni revelados pendientes en esos recorridos.
- Las 12 imágenes iniciaron una sola entrada temporal en móvil/tablet, incluida la vuelta hacia arriba. Escritorio usa View Timelines, sin entradas temporales de las imágenes.
- Inspección adicional de layout a **320, 375, 760, 761, 768, 960, 961, 1024 y 1440 px**; el caso de 768 se comprobó en horizontal, con 375 px de alto. Sin invasión de imágenes sobre el texto, controles fuera de pantalla ni controles de las escenas con altura inferior a 44 px.
- Movimiento reducido: cero animaciones activas en los casos comprobados; imágenes legibles. Sin JavaScript: 12 imágenes visibles, transformaciones en reposo y fotografías completas sin bandas.
- Bartender, Menaje, Personalizados y Flores comprobados en móvil, escritorio nativo y alternativa sin View Timelines simulada mediante CSS en Edge. Opacidad efectiva de las imágenes: 1. Contenedor sin animación. Sin discontinuidades mayores de 3 px después de 600 ms en la ventana estacionaria muestreada. La simulación no constituye una prueba de Safari o Firefox.
- Clic real en «Añadir» de bartender: **0 → 1**, misma URL. Diálogo con foco interno; Escape cierra y devuelve el foco. No se envió WhatsApp.
- Una captura de sección completa mostró «Saltar al contenido» sobre la imagen. Se comprobó por separado en viewport y DOM: enlace sin foco, situado de y=-100 a y=-53,66, fuera de pantalla. Era un artefacto de captura fuera del viewport; se conservó el enlace de accesibilidad.

Comparación del recorrido de los seis servicios, sobre los informes de navegador anterior y final (alturas redondeadas):

| Ancho | Altura anterior | Altura final |
|---|---:|---:|
| 375 px | 6.322 px | 5.646 px |
| 768 px | 7.491 px | 6.910 px |
| 1440 px | 6.048 px | 5.400 px |

En móvil se reduce aproximadamente un 10,7 % el recorrido de servicios sin quitar información ni opciones de cotización. La suma sintética de eventos `layout-shift` en la última pasada fue 0,001345 a 375 px, 0,001477 a 768 px y 0,000662 a 1440 px; no es una medición de CLS de campo.

Evidencia local ignorada por Git en `outputs/scroll-presentation/`:

- `baseline/`: archivos anteriores a esta intervención.
- `quality.log` y `build-final.log`: comprobaciones del proyecto.
- `final/report.json`, `walk-frames.json` y `contact-*.png`: recorridos finales y fotogramas renderizados.
- `final/layout.json`, `scenes-*.png` y capturas individuales: composiciones en tres tamaños.
- `final/details.json`: nueve anchos, entradas, alternativa simulada y ausencia de JavaScript.
- `final/interaction.json` y `viewport-cocina-*.png`: selección, foco y comprobación del enlace de accesibilidad.

Los scripts locales `inspect.mjs`, `sheets.mjs`, `scenes.mjs`, `details.mjs` e `interaction.mjs` conservan los procedimientos; requieren el servidor y navegador de prueba indicados. No forman parte del runtime público. El primer intento de `details.mjs` falló por un salto de línea mal escapado del propio script de auditoría; se corrigió y la repetición completa terminó correctamente, generando `details.json`.

## Límites y entrega

Las mejoras descritas quedan implementadas y verificadas en el entorno local señalado. No se certifican FPS en teléfonos físicos, Safari/iOS, Firefox, red móvil limitada, lector de pantalla ni Core Web Vitals de campo. La revisión estética no permite garantizar una nota máxima universal.

Se mantienen los pendientes generales de T19 y la aceptación/publicación de T27–T29. No se reabren las tareas descartadas por la arquitectura estática. Servidor local activo en 4179. Sin push ni despliegue.
