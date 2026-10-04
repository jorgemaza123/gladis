# Implementación visual: Una mesa para todos

Fecha: 2026-10-02. Alcance autorizado por el usuario: aplicar toda la propuesta visual y añadir animaciones. Cambios locales sobre el working tree existente; sin commit, push ni despliegue.

## Resultado implementado

- Palo de rosa y jade (el fondo blanco inicial fue sustituido a petición del propietario), Lora para títulos y Source Sans 3 para lectura/controles, alojadas localmente con licencias OFL. Portada centrada en comida peruana, fotografía en arco y dibujo de vajilla. Una entrada animada en portada; respuesta en botones, FAQ y diálogo. `prefers-reduced-motion` desactiva las animaciones; el contenido no depende de IntersectionObserver para aparecer.
- Portada con buffet y menú criollo, tres familias de servicios, proceso, ocasiones, cobertura, preguntas y cierre. Los nueve servicios son descubribles. El catálogo de buffet incluye también menús; se conservan los slugs existentes.
- Cabecera con una acción «Mi evento», navegación móvil, fichas con CTA antes del proceso y fotografías específicas. No se muestran testimonios ni eventos ficticios. Todas las imágenes nuevas se identifican como referenciales IA.
- Cotización en tres etapas: selección compartida, datos del evento y revisión. Sin pantalla adicional de «conversación preparada». Cantidades y opciones llegan al mensaje; el número visible y el enlace provienen del principal. Eliminarlo requiere elegir otro, sin fallback.
- Estado compartido en el layout y navegación interna con Link para conservar la selección durante el recorrido. TTL de selección de 24 horas. Los datos del evento se restauran con un esquema propio, sin recoger nombre, teléfono ni correo.
- Se retiran mínimos comerciales simulados. Las cantidades son estimadas y el precio se consulta por WhatsApp. Fecha, distrito e invitados se exigen según la configuración de los servicios seleccionados.
- Origen inicial, adquisición y UTM saneado se conservan. El usuario puede revisar el texto completo, incluido ese origen, antes de abrir WhatsApp. El mensaje no se envía automáticamente.

## Archivos reales y decisiones

Nuevos: `components/home-experience.tsx`, `components/event-selection.tsx`, `lib/event-selection.ts`, `app/design.css`, `data/design-images.json`, `scripts/design-smoke.mjs`, `scripts/prepare-design-images.ps1`, fuentes locales y 24 JPEG en `public/images/mesa/`.

Modificados: layout y páginas de inicio, catálogo y cotización; componentes públicos, fotos, CTA, proveedores de selección y diálogo, recomendaciones y cotizador; catálogo estático, validación de navegación y constructor de WhatsApp; pruebas de comercio y activos.

No se crearon los componentes inicialmente propuestos `quote-review.tsx` ni `service-family-nav.tsx`: su contenido queda integrado en el cotizador y la portada. No se añadió CMS, base de datos ni API. La hoja `design.css` concentra la dirección pública nueva; `globals.css` conserva los estilos heredados y administrativos. Los cambios de contrato están registrados en `CONTRATOS.md`.

## Verificaciones ejecutadas

- `npm.cmd run quality`: typecheck, oxlint, comercio, seguridad estática, presupuesto de activos y build de producción. Exit 0 tras corregir los problemas encontrados. Registro completo en `evidencia/quality.log`.
- `node scripts/design-smoke.mjs`: 15 rutas locales HTTP 200, un H1 por página, títulos, canonical y noindex del cotizador. Tres mediciones HTTP del mismo servidor local, sin limitación de red/CPU. Resultados exactos en `evidencia/http-production.json`. **No equivalen a LCP, CLS o rendimiento móvil de campo.**
- Pruebas comerciales nuevas sobre los nueve servicios: cantidad inicial 1 válida con opciones completas, validación de cantidades y principal, descripción de opciones, teléfonos de cada servicio y rechazo del mensaje excesivo sin truncar silenciosamente. La suite conserva los casos previos de carrito, origen y datos restaurados.
- Navegador sobre build local: CTA de portada preselecciona buffet; opciones vacías impiden avanzar; buffet 30 personas + 35 sillas mantiene cocina; resumen incluye «Buffet servido» y «Criollo»; cambiar principal a sillas cambia destino; eliminar principal quita el enlace; consulta independiente de 12 sillas; recarga restaura selección y datos del evento. Se inspeccionaron enlaces, sin abrir ni enviar WhatsApp.
- Diálogo: foco inicial en cerrar, Escape cierra y devuelve foco al botón Mi evento. Fichas y portada revisadas visualmente en escritorio y móvil; se corrigieron la anchura heredada del botón de cabecera, el tamaño de imágenes de familias y su contenedor móvil.
- Se inspeccionaron anchos CSS de 320, 360, 390, 767 (próximo al corte de 768), 1024 y 1440. El navegador integrado tenía una escala del 90%; se ajustó el viewport y se leyó `innerWidth` para distinguir medidas solicitadas y efectivas. Evidencias visuales finales en esta carpeta.
- Activos: 8 composiciones, cada una con 480/768/1280 px. 24 JPEG: 2.356.956 bytes en total; hero 1280: 266.112 bytes. Fuentes WOFF2: 50.772 bytes en total. La prueba lee las dimensiones reales de las cabeceras JPEG y comprueba los bytes del manifiesto. Las visitas reciben variantes por `srcset`, no necesariamente todos estos archivos.

## Límites y aceptación pendiente

No se realizó estudio con cinco usuarios, prueba con lector de pantalla real, zoom 200% ni auditoría WCAG integral. El CSS incluye foco y movimiento reducido, pero falta la comprobación con esa preferencia activada en el sistema. No se ejecutó Lighthouse móvil ni se midieron LCP/CLS; las tres mediciones disponibles son HTTP local. No se simularon restricciones de almacenamiento en el navegador real durante esta sesión; las pruebas puras y el manejo de excepciones no sustituyen esa prueba. No se afirma «10/10», ventas, posición SEO ni aceptación comercial de terceros.

La implementación puede revisarse localmente. Estos límites no requieren una base de datos ni nuevos servicios: son aceptación de usuarios y mediciones adicionales. No se modifican como HECHO las tareas históricas bloqueadas por requisitos retirados o aceptación externa.

## Reproducción y traspaso

1. En `web`, ejecutar `npm.cmd run quality`.
2. En PowerShell: `$env:PORT='4173'; $env:HOST='127.0.0.1'; npm.cmd start`.
3. En otra terminal: `node scripts/design-smoke.mjs`.
4. Revisar portada, catálogo, ficha y cotizador; abrir el resumen de WhatsApp sin enviarlo. Verificar ambos responsables con un cambio explícito del principal.
5. Siguiente paso: revisión visual del propietario, pruebas humanas/accesibilidad y medición móvil reproducible. Publicar sólo cuando se solicite. No continuar con D1/CMS ni reejecutar tareas históricas retiradas.

Para revertir, seleccionar los cambios de esta implementación; no usar `git reset --hard` ni restaurar indiscriminadamente, porque ya existían documentos modificados antes de comenzar.

## Corrección de espacios y animaciones de portada — 2026-10-02

Revisión posterior solicitada por el propietario. Se encontraron cortes reales que la comprobación anterior de anchura del documento no detectaba, porque `overflow-x: clip` ocultaba el contenido desbordado.

- Se corrigieron las columnas de buffet y ocasiones: los tracks usan mínimos cero y las fotografías ya no combinan una altura fija con una relación de aspecto que imponga un ancho mínimo. La foto principal ocupa el ancho disponible también en móvil; su pie está en el flujo y reserva la altura real del texto.
- Se unificó el espaciado vertical con una escala de 56–96 px. Tablet (761–960 px) tiene composición propia: portada y proceso apilados, opciones de comida en dos columnas y familias de servicios con imagen y texto en paralelo. En escritorio las familias comparten filas de títulos, descripciones y enlaces.
- Se corrigió el footer ancho: el fondo puede ocupar la pantalla y el contenido conserva un máximo de 1200 px, sin padding calculado contra un contenedor limitado ni doble espacio superior. El menú móvil respeta 20 px laterales y aparece debajo de la cabecera.
- La entrada animada afecta solo a la foto, sin `clip-path` sobre el figure o su leyenda. Las animaciones terminan sin transformaciones/máscaras persistentes; el dibujo usa longitudes normalizadas y vuelve al trazo completo. Se mantiene la regla de movimiento reducido. Los títulos móviles conservan un espacio al ocultar sus saltos de línea.
- Archivos de producto de esta corrección: `app/design.css` y `components/home-experience.tsx`. No cambia el catálogo, las rutas, los responsables, la atribución ni la arquitectura estática.

Verificación local realizada:

1. `npm.cmd run quality`: exit 0 (tipos, lint, comercio, seguridad, activos y build). Registro: `evidencia/home-layout-quality.log`. Tras los últimos ajustes de margen móvil y espacios de títulos se compiló de nuevo: exit 0, `evidencia/home-layout-final-build.log`.
2. Geometría DOM del build final en 14 anchos CSS efectivos: **320, 360, 390, 600, 760, 761, 768, 900, 960, 961, 1024, 1440, 1920 y 2560 px**. Cero elementos de contenido fuera del viewport, cero desbordamientos detectados en textos hoja y cero intersecciones entre hermanos de las cuadrículas principales/cabecera. Se excluyen SVG decorativos y contenido de desplegables cerrados. Registro con medidas: `evidencia/home-layout-responsive.json`.
3. Navegador: menú móvil abierto/cerrado, ancla «Explorar los servicios», tres FAQ abiertas sin solaparse con el cierre, seis imágenes de portada cargadas. Registro: `evidencia/home-layout-interactions.json`. Capturas completas: `home-layout-movil.png`, `home-layout-tablet.png` y `home-layout-escritorio.png`, dentro de `evidencia/`.
4. Movimiento: se observó la transformación durante la entrada de la foto y su estado final sin máscara/transformación. La preferencia del navegador era movimiento normal; no se afirma una prueba de sistema con movimiento reducido activado. Registro final: `evidencia/home-layout-motion.json`.

Las capturas del navegador integrado pueden tener distinta escala de imagen; los anchos de la matriz se obtienen de `innerWidth`, no de las dimensiones del PNG. La revisión cubre la portada en este navegador, sin afirmar una matriz de dispositivos físicos o todos los motores. Continúan los límites de aceptación general descritos arriba. Sin push ni publicación.

### Ajuste del hero según la altura de escritorio

El propietario señaló que, en una ventana de aproximadamente 1366 × 650 px, la fotografía y su pie quedaban debajo del primer pantallazo. La revisión anterior comprobaba anchura y solapamientos, pero no exigía que la figura completa entrara en esa altura.

Se añadió en `app/design.css` una composición compacta para ancho ≥961 px y alto ≤820 px: conserva dos columnas, adapta la foto a `svh`, reduce márgenes y tamaño de título dentro de límites legibles y omite la nota decorativa secundaria. No fija ni oculta la altura del contenido. Móvil conserva la fotografía después del texto y desplazamiento natural.

`npm.cmd run build` terminó con exit 0 (`evidencia/hero-height-build.log`). Se midieron 1366×650, 1366×600, 1280×720, 1024×650, 961×650, 1440×820, 1440×900 y 390×650: en los siete tamaños de escritorio la figura completa y las acciones entran en el primer pantallazo; ninguno de los ocho casos presenta desbordamiento horizontal del hero. En 1366×650 la figura termina en y=544,48 px y los botones en y=501,22 px. Móvil se comprobó como composición apilada, sin exigir toda la foto en el primer pantallazo. Medidas exactas: `evidencia/hero-height-responsive.json`; captura: `evidencia/hero-height-escritorio.png`. Cambio local, sin push ni despliegue.

### Fondo palo de rosa — 2026-10-02

A petición del propietario, el fondo blanco se sustituye por palo de rosa suave `#EAD4D1`. Cabecera, fondo público y footer comparten ese tono; leyendas, menú y superficies de selección usan `#F6E8E5`. Se conserva el jade y las secciones verde suave. El texto secundario pasa a `#4E605A` para conservar legibilidad; campos de entrada y textos de botones mantienen sus colores funcionales.

Cambio de producto limitado a `app/design.css`. Build final exit 0 (`evidencia/palo-rosa-build.log`). Contraste calculado sobre el fondo: texto principal 8,87:1, secundario 4,72:1 y jade 4,94:1; sobre superficies claras todos superan 5,5:1. Son pares CSS comprobados, no una auditoría integral. Resultados en `palo-rosa-contraste.json`. Se confirmó el color computado de body, sitio, cabecera, footer, leyenda y texto secundario en el navegador; revisión visual en escritorio y captura `palo-rosa-portada.png`. La pestaña anterior dejó de responder y la comprobación se completó en una nueva pestaña del mismo navegador. Sin cambios de distribución, push ni publicación.

### Textos cercanos y animaciones de scroll — 2026-10-04

Se conservan los textos humanizados de portada, catálogo, preguntas frecuentes y cotizador: lenguaje cercano, servicios y Lima presentes, sin alterar H1, títulos SEO, rutas, precios a consulta, responsables ni atribución. La verificación anterior de textos quedó interrumpida por EPERM de Node y una limitación de Computer Use; no se toma su log como prueba aprobada. El conjunto actual sí pasó `quality` y el comprobador de 15 rutas.

Se incorpora la coreografía [La mesa se prepara](ANIMACIONES.md): telón dentro de las fotos, títulos, secuencia de familias, trazos de menú/proceso e ilustración final. La profundidad nativa es opcional y solo de escritorio; móvil conserva su distribución y acorta las entradas. Contenido visible sin JS, foco que termina los efectos, preferencia reducida reactiva y limpieza de observadores incluidos. Los efectos no cambian el modelo comercial ni añaden dependencias.

`npm.cmd run quality` exit 0, incluidas 12 pruebas nuevas de ciclo de vida; 15 rutas locales HTTP 200 con H1/metadatos válidos. Evidencias `evidencia/scroll-motion-quality.log` y `scroll-motion-http.json`. La revisión visual de este cambio aún no está verificada; no se afirma rendimiento de campo, aumento de cotizaciones ni aceptación móvil integral. Sin push ni despliegue.

En la revisión de CSS se corrigió la especificidad del tiempo móvil y se añadió duración positiva a las timelines nativas. Build final posterior exit 0 (`evidencia/scroll-motion-final-build.log`).
