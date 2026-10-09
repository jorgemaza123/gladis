# Diagnóstico y corrección de animaciones — 2026-10-08

## Alcance y protección

Corrección local de problemas comprobados en la portada de Gladys. Se conservan identidad, textos, fuentes, imágenes, video, rutas, catálogo, formularios, atribución, WhatsApp y metadatos. No se añaden dependencias ni backend. No se hizo commit, push ni despliegue.

La revisión comienza sobre la rama `audit/gladis-pre-optimizacion`, que ya contenía cambios de la optimización anterior. El checkpoint `3d0d63e` y esos cambios se preservan. Las copias inmediatamente anteriores a esta corrección están en `outputs/motion-audit/baseline/`; las copias TypeScript llevan extensión `.snapshot` para no entrar en la compilación.

Se leyeron y aplicaron **Taste / design-taste-frontend** y **UI UX Pro Max**: continuidad, mejora del proyecto existente, respeto a movimiento reducido y comprobación responsive. **Impeccable no tiene un SKILL.md operativo localizado** y no se le atribuye trabajo. Humanizer no corresponde a esta tarea. El sistema existente es CSS + IntersectionObserver; no usa Framer Motion, Motion ni GSAP.

## Problemas, causas y correcciones

| Prioridad | Problema comprobado | Causa raíz | Corrección acotada y evidencia |
|---|---|---|---|
| P1 | Las capas daban un salto al finalizar en móvil/tablet. | Se reutilizaba el último fotograma de profundidad, inclinado/desplazado, en una animación temporal con fill `backwards`; al terminar volvía a `transform: none`. | Entrada temporal `service-layer-enter` que termina exactamente en la posición de reposo. Se conservan los keyframes continuos de escritorio. Antes se midieron saltos de hasta 20,48 px a 375 y 41,15 px a 768; después no se detectaron discontinuidades mayores de 3 px después de los primeros 500 ms en el caso estacionario de menaje. |
| P1 | JavaScript tardío podía volver a cubrir una foto que el visitante ya estaba viendo. | El registro inicial sólo asentaba elementos situados en el primer 20 % del viewport. Al hidratar añadía la cortina a otras imágenes ya visibles. | Se asienta el contenido que ya está dentro del viewport; sólo lo situado más abajo recibe una entrada futura. Con scripts retenidos y la foto de ocasión en y=389,48/812, el controlador anterior produjo escala de cortina 1; la aplicación corregida mantuvo escala 0 y la posición de scroll. |
| P2 | El momento de entrada de los servicios dependía de la extensión del texto. | IntersectionObserver observaba el artículo completo, que contiene imagen, texto y opciones. | Se observa `.service-visual` y se aplica el estado a su artículo propietario. Se conserva el ciclo de vida, foco y limpieza de observadores, incluyendo reemplazo del nodo visual. La entrada habitual requiere 55 % de la ilustración; otros reveals conservan 18 %. |
| P2 | El título «Arma el evento…» quedaba fuera de la entrada de capítulos. | El selector exigía un h2 hijo directo; el componente tiene un div intermedio. | Selector limitado a `.garden-heading > div > h2`, usando la animación existente. Se registró una entrada del título en cada ancho, sin reinicios al volver arriba. |
| P1 | En tablet las capas alcanzaban el texto situado debajo. | Los recortes escalan con el ancho, pero su escenario conservaba una altura mínima fija de 430 px. | Se reserva un escenario proporcional mediante `aspect-ratio: 1` sólo para recortes entre 761 y 960 px. A 768 se midieron invasiones de 127,19 px (bartender), 71,63 px (menaje) y 143,83 px (atención). El build corregido deja separaciones de 70,22, 84 y 49,55 px, respectivamente. |
| P1 | En 768 × 375 la entrada del escenario alto podía quedar pendiente todo el recorrido. | El 55 % de una imagen de 689 px excedía el área observada disponible de 338 px. Se confirmó que seguía preparada incluso en el centro de la pantalla. | Si el 55 % es geométricamente inalcanzable se reutiliza el umbral observado de 18 %. La comprobación posterior activó menaje con su borde en y=200,25 y terminó en `transform: none`; se añadió una regresión específica. |

No se reconstruyó el sistema ni se añadió un bucle JavaScript de scroll a la aplicación. Las entradas temporales siguen ocurriendo una sola vez por nodo. El movimiento de profundidad de escritorio sigue la posición del scroll, por lo que es normal que retroceda al subir: no es un reinicio de la entrada.

Las hipótesis iniciales sobre un fallo general de `isIntersecting` o del margen porcentual no se utilizaron como causa raíz: no quedaron demostradas por sí solas en el navegador empleado.

## Archivos modificados en esta corrección

- `app/motion.css`: posición final coherente, preparación de capas futuras y selector del título.
- `lib/scroll-motion.ts`: objetivo visual de observación, hidratación tardía, ciclo de vida y umbral alcanzable en horizontal.
- `app/design.css`: únicamente la reserva proporcional del escenario de recortes en tablet respecto a la copia de inicio de esta tarea.
- `scripts/motion-tests.mjs`: regresiones del controlador; total actual de 22 verificaciones.
- Este informe, `docs/plan-produccion/ESTADO.md` y `docs/plan-produccion/BITACORA.md`: evidencia, alcance y limitaciones.

Los demás archivos sucios de Git ya contenían trabajo anterior. El diff contra HEAD incluye ese trabajo y no representa sólo esta intervención.

## Pruebas automáticas

`npm.cmd run quality` terminó con código 0 sobre el código final. Ejecuta los comandos reales del proyecto:

1. `npm run typecheck` — TypeScript, `tsc --noEmit`.
2. `npm run lint` — **oxlint**, no ESLint.
3. `npm run test:motion` — 22 comprobaciones de ciclo de vida, ratios, foco, mutaciones, limpieza y preferencias.
4. `npm run test:commerce` — catálogo, opciones, cantidades, contactos y reglas comerciales.
5. `npm test` — arquitectura estática y seguridad.
6. `npm run test:performance` — recursos, dimensiones y presupuestos; no mide Core Web Vitals.
7. `npm run build` — build de producción Vite/Vinext.

Registro: [quality-final.log](../../outputs/motion-audit/quality-final.log), evidencia local ignorada por Git. Persisten avisos de Vinext/Nitro sobre imports opcionales y clasificación estática de algunas rutas; el build terminó correctamente.

Dos intentos anteriores de typecheck incluyeron por error material de auditoría: un perfil de Edge con TypeScript de extensiones y una copia `.tsx`. El perfil se trasladó fuera de `web` y las copias se nombraron `.snapshot`, sin cambiar tsconfig ni ocultar errores del producto.

## Validación visual y funcional

Se usó **Microsoft Edge real en modo headless**, mediante CDP, contra el build local de producción en `http://127.0.0.1:4179/`. Se capturaron fotogramas renderizados durante el desplazamiento y se revisaron sus composiciones, además de registrar geometría, eventos de animación y consola. La herramienta integrada de navegador no estuvo disponible; no se simula haberla usado.

- Recorridos completos hacia el footer y vuelta arriba en **375 × 812, 768 × 1024 y 1440 × 900**, a 700 px/s y 11.000 px/s.
- Repetición posterior al ajuste horizontal, registrada en `outputs/motion-audit/verified/`: cero errores de consola, imágenes rotas o desbordamiento; 18 entradas de capas en móvil/tablet y una entrada del título en cada ancho. Se revisaron las tres láminas de fotogramas finales.
- Caso adicional **768 × 375**, que detectó y confirmó la corrección del umbral inalcanzable.
- Ningún reveal quedó pendiente al terminar los recorridos habituales; ninguna imagen rota ni desbordamiento horizontal del documento. En las muestras visibles no hubo opacidad menor a 0,2.
- Las 18 capas de móvil/tablet comenzaron su entrada una sola vez durante el recorrido completo, incluido el regreso. El escritorio conservó las View Timelines existentes.
- La comparación de fotogramas estacionarios en menaje confirmó que las capas se asientan sin el salto final reproducido antes.
- Saltos directos desde arriba al footer y a distintas escenas: sin entradas temporales tardías ni capas ocultas en los tres anchos.
- Cambio a `prefers-reduced-motion`: cero animaciones activas y video pausado. El contenido continúa visible.
- La prueba de hidratación tardía mantuvo la foto descubierta y la posición de scroll estable.
- Selección con clic en un servicio: contador **0 → 1**, sin cambiar URL. El diálogo abrió con foco dentro; Escape lo cerró y devolvió el foco al botón. No se envió ningún mensaje de WhatsApp.
- No se observaron excepciones JavaScript ni errores de hidratación. En una carga se registró un **404 previo de `/favicon.ico`**, ajeno al movimiento y no modificado en esta tarea.

Evidencia local, conservada en `outputs/motion-audit/` e ignorada por Git:

- `before/` y `after/`: reproducción inicial y primera comparación.
- `final/report.json`, `final/frame-report.json`: recorridos y medidas tras corregir tablet.
- `final/edge-cases.json`: hidratación retardada anterior/corregida, saltos y movimiento reducido.
- `final/interaction.json`: selección, foco y separaciones definitivas de tablet.
- `final/landscape-before.json`, `final/landscape-final.json`: caso horizontal antes/después.
- `final/tablet-bartender.png`: escena de tablet después de decodificar todas sus imágenes diferidas.
- `verified/report.json` y sus capturas: repetición sobre el último build.

Los scripts de comprobación están en ese mismo directorio local: `inspect.mjs`, `frames.mjs`, `edge-cases.mjs`, `interaction.mjs` y `landscape-final.mjs`. Requieren un navegador de prueba con CDP en 9230 y el servidor en 4179; no forman parte del runtime de la web.

## Límites y traspaso

Esta evidencia demuestra las correcciones descritas en el motor probado, no certifica todos los navegadores o dispositivos. Edge se ejecutó headless con GPU deshabilitada: no se midieron FPS en teléfono físico/modesto, Safari/iOS, Firefox, red móvil limitada ni Core Web Vitals de campo. En la última repetición, la suma sintética de entradas `layout-shift` fue 0,001345 a 375 px, 0,001477 a 768 px y 0,000589 a 1440 px; estos valores no equivalen al CLS de campo.

El alcance actual de corrección queda documentado y comprobado localmente. No se marca toda T19 como completa: lector de pantalla, zoom y las comprobaciones físicas/de campo conservan sus pendientes. Tampoco se reabren tareas retiradas por la arquitectura estática. El servidor de revisión permanece disponible en el puerto 4179; sin push ni publicación.
