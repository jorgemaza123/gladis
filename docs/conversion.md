# Conversión y contacto

- El CTA general del Hero abre `/cotizar` sin seleccionar servicios. Los CTA de fichas y escenas conservan su selección específica.
- El Hero y el menú abren un mismo buscador de los 39 servicios, con nueve familias y términos relacionados. El catálogo completo sigue enlazado en `/servicios`. El enlace de consulta inicial también está disponible antes del Capítulo 3 y en el footer.
- La consulta inicial no exige fecha, cantidades ni opciones. Si existen servicios en Mi evento, el principal determina el WhatsApp y se incluyen todos. El cotizador detallado conserva sus validaciones comerciales.
- No se envía ningún formulario a un backend: el visitante revisa el mensaje en WhatsApp y decide enviarlo.
- El diálogo de Mi evento y su backdrop se muestran por encima del encabezado.

## Buscador de servicios

`ServiceSearchProvider` recibe del catálogo público únicamente ID, nombre, ruta y familia. El panel se abre desde el Hero y los menús, sin añadir una sección al Home. Muestra cinco resultados inicialmente y permite ver el resto dentro del mismo panel. El catálogo existente conserva sus nombres y enlaces en HTML.

Corrección comercial del 19/10/2026: retirada la ficha `fotografia-video-eventos`, sus recomendaciones, selecciones y referencias comerciales en ocasiones, guías, metadatos y buscador. Quedan 39 servicios: 9 hacia Cocina y 30 hacia Eventos. Cabina y experiencia 360 conserva su ficha independiente; `/foto-video` mantiene su URL y describe únicamente esa experiencia. La antigua ficha de cobertura responde 404 y deja de aparecer en el sitemap. El historial de validación inferior corresponde al inventario anterior.

El foco del buscador se aplica ahora al contenedor completo con un único borde redondeado; el input interior no dibuja un rectángulo superpuesto. Los demás controles mantienen su foco de teclado.

Los términos relacionados están en `lib/service-search.ts` y apuntan únicamente a servicios reales. No hay búsqueda remota ni dependencias nuevas. Añadir/quitar y Cotizar utilizan el carrito y la atribución existentes; buscar o abrir una ficha no selecciona servicios. El principal y los responsables de WhatsApp no cambian.

El diálogo utiliza Base UI para bloquear el fondo, mantener el foco y permitir cierre con Escape. Su desplazamiento interno está excluido de Lenis. Al navegar a una ficha o al cotizador se cierra; al volver a abrirlo conserva la búsqueda dentro de la sesión de navegación.

El acceso del Hero se compone en `home-experience.tsx` y se pasa como contenido a `StoryHero`: mantiene la misma frontera de contexto en SSR e hidratación. El navbar conserva el acceso con lupa y nombre accesible «Buscar servicios» en todos los tamaños; en anchos compactos oculta únicamente su etiqueta visual.

## Activar las reseñas cuando exista el enlace

Editar únicamente `config/commercial-evidence.ts` y pegar la URL HTTPS pública y verificada en `COMMERCIAL_EVIDENCE.reviewsUrl`.

El Home y el footer mostrarán el enlace «Leer reseñas de clientes». Con el campo vacío o inválido no se muestra. No se inventan puntuaciones, testimonios ni datos estructurados de reseñas. Los enlaces externos se abren con `noopener noreferrer`.

La eficacia real debe medirse con visitas, consultas recibidas y ventas. La atribución actual aporta contexto al mensaje, pero no representa un embudo de analítica agregado ni confirma que el mensaje se envió.

## Registro de validación del buscador — 19/10/2026

- `npm run quality`: TypeScript, lint, 22 comprobaciones de movimiento, comercio, búsqueda, seguridad, activos y build aprobados.
- `test:seo`, `test:content` y `test:redirects` aprobados contra el build local: 89 URLs, titles/H1 únicos y 38 redirecciones directas.
- Navegador real: búsquedas por nombre/sinónimo, nueve familias, cinco resultados iniciales y ampliación, añadir/quitar, contador, principal y destinos WhatsApp de ambos equipos; no se enviaron mensajes.
- Revisados 360, 390, 768, 1024 y 1440 px: sin overflow, controles del panel de al menos 44 px, Escape, retorno y confinamiento del foco, navegación a ficha y vuelta, scroll interno y compatibilidad con Native/Lenis. Cero errores de consola tras corregir la hidratación.
- El buscador usa un portal fijo y no añade una sección al Home. Capítulo 3, Lenis y dependencias permanecen intactos. Capturas de validación guardadas fuera del repositorio. Sin commit ni push.

## Cierre de la retirada de fotografía y corrección de foco — 19/10/2026

- Inventario validado: 39 servicios, nueve familias, nueve servicios de Cocina y 30 de Eventos. Las 18 ocasiones conservan sus demás opciones.
- `quality`, `test:commerce`, `test:seo`, `test:content`, `test:redirects` y `git diff --check` aprobados. SEO: 88 URLs, titles y H1 únicos, 138 enlaces internos verificados; la ficha retirada responde 404 y no tiene enlaces internos ni entrada en sitemap. Las otras 36 fichas migradas conservan su 301 directo.
- El informe de contenido registra una URL con menos de 240 palabras tras reducir el hub a la experiencia de cabina; no se añadió relleno para compensar la retirada.
- Foco comprobado a 1440 y 390 px: un solo borde redondeado en el contenedor, sin outline visible en el input interior y sin overflow. La compilación de producción local no presentó errores de consola. Una advertencia de IDs durante HMR se verificó separadamente del build.
- En esta corrección el navbar quedó pendiente de implementación; la integración posterior se documenta a continuación. Capítulo 3 y Lenis permanecen intactos. Sin commit ni push.

## Navbar y orientación — 19/10/2026

- `SiteHeader` sustituye la navegación plana por Servicios, Ocasiones, Empresas y Cómo cotizar. Servicios abre nueve familias con sus cantidades reales y acceso al catálogo, al recorrido del Home y a Guías. En móvil Guías y Nosotros quedan en el menú secundario.
- Las familias se comparten con `ServiceExplorer` mediante `lib/service-navigation.ts`: los mismos IDs y metadatos evitan destinos divergentes. Un enlace de familia abre su `details` antes de desplazarse. Desde otras rutas lleva al Home con el hash correspondiente, que el explorador ya restaura.
- La barra es fija, marfil y jade, con Cotizar como único botón sólido. Buscar y Mi evento conservan sus proveedores y lógica; se componen como contenido desde el servidor para mantener la frontera de contexto durante SSR e hidratación.
- Hasta 1100 px se utiliza menú compacto; la lupa permanece visible sin abrirlo. En móvil Mi evento conserva icono, etiqueta y contador. `details/summary` mantiene Enter y Espacio nativos; Escape, salida de foco y pulsación exterior cierran los menús. Los diálogos quedan por encima de la barra y el scroll interno se excluye de Lenis.
- El indicador de sección usa un único IntersectionObserver propio, con la zona observada alineada con el umbral de lectura. No cambia observers, triggers ni transiciones del Capítulo 3. No hay listeners de scroll adicionales ni dependencias nuevas.
- La altura de la barra está limitada a 64–80 px y queda por encima del escenario sticky sin cubrirlo. Los anchors de navegación tienen margen propio; los anchors de las seis escenas permanecen intactos. El Home no recibe un espaciador adicional; las demás rutas sí reservan el alto del encabezado.
- Regresión de alturas exactas, antes y después: Capítulo 3 a 1440×900 = 4645.828125 px; 1024×768 = 4316.375 px; 390×844 = 4757.3125 px. No se modificó `design.css` en esta integración.
- Validación: `quality` y build aprobados; nueve familias y 39 servicios comprobados en las pruebas comerciales. SEO: 88 URLs y 138 enlaces internos; contenido y 37 redirects existentes aprobados. El aviso previo de una página con menos de 240 palabras permanece documentado, sin cambios de copy.
- Navegador real: 1440, 1280, 1024, 768, 390 y 360 px sin overflow; controles visibles del navbar de al menos 44 px. Probados familias Música, Personal y Decoración, navegación entre catálogo y Home, anchors con Smooth y `?scroll=native`, indicador activo, teclado, Escape y retorno de foco del buscador. Añadir DJ actualiza Mi evento y conserva el principal y el responsable Eventos; se retiró la selección de prueba.
- El escenario sticky queda a 81 px y el navbar a 76.5 px en 1440×900; se comprobó scroll hacia Menaje y retorno a Cocina. Cero errores de consola en el build local. Reduced motion se conserva en CSS y en las 22 pruebas de movimiento; no se cambió la preferencia del sistema durante esta verificación.
- Capturas fuera de Git. Capítulo 3, Lenis y dependencias intactos. Sin commit ni push.

## Servidor local

Vinext registra RSC con sus entradas existentes y `serverHandler: false`: Nitro atiende las peticiones. Así se evita que el manejador genérico de RSC intente utilizar `environment.runner` en el entorno de desarrollo de Nitro.

## Glass cálido y entrada del Home — 19/10/2026

- Navbar: marfil `rgba(251,248,243,.76)`, backdrop blur estático de 12 px y borde tenue; jade oscuro para texto y controles, Cotizar sólido. Los menús conservan fondo opaco para leer las familias. Sin soporte de backdrop o con transparencia reducida se utiliza el marfil sólido. No cambia la altura de la barra ni el espacio sobre el sticky.
- Secuencia de carga: vídeo/poster visible primero; tras 1600 ms, navbar y bloque de texto entran juntos durante 1050 ms con la curva `cubic-bezier(.25,.1,.25,1)`. Navbar desde arriba; texto desde 56 px a la derecha en desktop y 24 px en móvil. Descripción, enlaces y botones viajan con el texto, sin stagger. La guía inferior aparece durante el mismo tramo.
- `home-arrival.css` separa la entrada de carga de las salidas existentes del Hero al hacer scroll. Los dos wrappers no alteran la geometría del contenido ni la del capítulo siguiente. No se cambian el vídeo, su controlador, el copy ni los destinos.
- `observeHomeArrival` finaliza ante scroll, wheel, tacto, teclado, foco, pestaña oculta o reduced motion. Omite la espera con hash, restauración de scroll, foco previo o animación desactivada. Un marcador del documento evita repetirla al volver al Home; una recarga inicia una secuencia nueva. Limpia todos los listeners y el timeout, sin trabajo por frame.
- Sin JavaScript, la entrada CSS termina por sí sola; el foco de teclado puede asentarlo todo inmediatamente. Con reduced motion, el contenido aparece sin desplazamiento ni espera. No se ha cambiado la preferencia de movimiento del sistema en las pruebas de navegador.
- Primera versión validada con 700 ms; refinamiento posterior solicitado: entrada más gradual durante 1050 ms y recorrido del texto más corto. Durante la nueva entrada se midió opacity idéntica de `0.529014` en navbar y texto a 1440, y `0.360005` en ambos a 390. En reposo llegan a opacity 1 y el controlador marca complete, sin corte del fallback, ampliado a 3000 ms.
- Contraste calculado contra el fondo más oscuro posible bajo el glass: texto 6.66:1, foco 3.71:1; Cotizar blanco sobre jade 6.99:1. El hover mantiene el jade oscuro.
- Alturas del Capítulo 3 sin cambios a 1440, 1280, 1024, 768, 390 y 360 px; sin overflow. Comprobados foco temprano, hash directo a Cocina, buscador, menú de familias y vuelta desde el catálogo sin repetir la entrada. No se modifican Capítulo 3, Lenis, comercio ni dependencias. Sin commit ni push.
- Cierre: `quality` (incluidas 22 pruebas de movimiento y las nuevas pruebas del ciclo de entrada), build, `test:seo`, `test:content` y `git diff --check` aprobados. SEO conserva 88 URLs, titles/H1 únicos y 138 enlaces internos. Sigue únicamente el aviso de contenido breve previamente registrado.
- Build local comprobado en navegador sin errores de consola: fase inicial sin navbar, copy ni cápsula vacía; estado final legible en desktop y móvil. Capturas fuera del repositorio.
- Refinamiento de suavidad: `test:motion`, lint y diff check aprobados; comprobado en navegador a 1440 y 390, sin overflow ni errores de consola. No se repitió el build por este cambio puntual de parámetros.
- Ajuste móvil antes de publicación: el bloque del Hero sube 16 px por su anclaje inferior (98 frente a 82 px); su inicio sube 18.59 px a 390×844 al incluir el ajuste tipográfico. La frase superior pasa de 10 a 12 px y Mi evento de 11 a 12 px. En viewports de menos de 620 px de alto se conserva el anclaje anterior para proteger el espacio bajo el navbar. Revisados 430, 390, 375 y 360 px, además de alturas cortas: sin overflow y con el control Mi evento de 60×48 px. Desktop y tablet no cambian.
- Validación antes del commit de publicación: `quality` y build aprobados con los ajustes móviles; `test:seo`, `test:content`, `test:redirects` y diff check aprobados contra el build final. Continúan 88 URLs indexables y 37 redirects directos. No se incluyen capturas, temporales, archivos de servidor ni credenciales.
