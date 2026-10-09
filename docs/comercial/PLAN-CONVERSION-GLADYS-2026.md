# Gladys — mapa de búsqueda y conversión para eventos en Lima

Fecha: 2026-10-09. Estado: **primera ola implementada y verificada localmente; publicación y medición pendientes**. Objetivo: que una persona que llega por una celebración, una necesidad empresarial o un servicio concreto encuentre una página útil, descubra los demás servicios y pueda pedir una cotización completa por WhatsApp desde allí. La web continúa estática y sin base de datos.

## Línea base comprobada antes de la implementación local

- La marca pública es Gladys Eventos & Experiencias. Ofrece servicios en toda Lima Metropolitana, con precios a consulta por WhatsApp. Disponibilidad, traslado, cantidades y condiciones se confirman en la conversación. No se prometen precios, paquetes cerrados ni reservas automáticas.
- Había seis páginas de ocasión: cumpleaños, bautizos/primeras comuniones, bodas/aniversarios, reuniones familiares, desayunos corporativos y eventos empresariales. Cada página permite reunir servicios y cotizar sin volver al catálogo. **En esa línea base aún no existían páginas propias de graduaciones ni fiestas de fin de año.**
- La portada ofrecía navegación por servicios, seis ocasiones, capítulos de servicios y CTA. La cabecera entonces enlazaba a buffet/menús, servicios y cómo cotizar; no ofrece un acceso directo a ocasiones. «Mi evento» abre la bolsa para revisar y configurar la selección.
- Las fichas, los catálogos, la bolsa, el cotizador y el mensaje de WhatsApp existen. El usuario elige un servicio principal; ese principal determina quién recibe el mensaje completo, aunque añada extras del otro equipo. El origen inicial y el último CTA se conservan en la sesión. Ningún clic demuestra que el cliente haya enviado el mensaje.
- Teléfono de comida, buffet, bartender y menaje: **923106197** (`51923106197`). Teléfono de mozos, sillas, flores, recuerdos y polos: **902843481** (`51902843481`). Los números viven en `config/business-contacts.ts`; la propuesta no duplica los literales en componentes.
- La URL pública actual configurada es `https://gladis-vr6r.vercel.app`. El 2026-10-09 se comprobaron HTTP 200, `robots.txt` con `Allow: /`, sitemap público y home con `index, follow`. El sitemap público comprobado en esa fecha contenía las seis ocasiones anteriores; el build local incluye ocho. Esto permite descubrimiento; no demuestra posiciones, tráfico ni ventas. La web local tiene cambios pendientes de publicación, por lo que se debe comparar cada despliegue con su commit.
- Las imágenes generadas sirven como referencia visual. No se presentan como fotografías de eventos ejecutados ni se inventan testimonios, clientes o años de trayectoria.

## Entrega local de esta primera ola

- Hay ocho páginas de ocasión en datos estáticos. Se añadieron graduaciones/promociones y fin de año de empresas, con título, descripción, FAQ, enlaces internos, canonical y sitemap locales. Cumpleaños, reuniones familiares, desayunos y eventos empresariales responden también a consultas más específicas sin crear páginas casi duplicadas.
- La portada, el índice de ocasiones, catálogos, páginas de ocasión y fichas muestran el selector compartido de diez servicios. Las tres primeras sugerencias dependen del contexto y las demás se expanden en grupos. Se puede añadir, quitar y escoger el servicio principal sin pasar por fichas adicionales. En una ficha, su propio servicio aparece primero.
- La cabecera da acceso a «Ocasiones» y a cotizar, mientras «Mi evento» conserva la bolsa con contador accesible. El pie enlaza celebraciones, empresas y servicios. Las páginas de ocasión muestran el CTA antes del párrafo largo y el cotizador dentro de la misma ruta.
- El responsable se muestra con su número según el principal: cocina/bartender/menaje al 923106197; complementos al 902843481. Los extras se mantienen en un solo pedido. La web prepara el borrador de WhatsApp; no lo envía por sí misma. Continúan los datos locales, sin base de datos ni backend de leads.
- Verificación local: `npm.cmd run quality` pasó el 2026-10-09 (TypeScript, lint, movimiento, comercio, seguridad, activos y build). Chrome en 320, 375, 768 y 1440 px mostró ancho sin desbordamiento, títulos y canonical correctos, diez opciones por módulo y cero excepciones de ejecución en las rutas comprobadas. En la ficha de buffet, el CTA añadió el servicio y llevó al selector en la misma página. Una prueba interactiva en graduaciones confirmó que cambiar el principal cambia el destinatario visible del pedido mixto.
- Pendiente fuera del build local: publicación autorizada, comprobación de las URL públicas y sitemap tras publicar, revisión de indexación en Search Console si se dispone de acceso, datos comerciales aún sin confirmar y medición de consultas reales. Las comprobaciones locales no prueban posiciones SEO, mensajes enviados ni ventas.

### Pauta breve de atención de consultas

Quien reciba el WhatsApp debe leer primero ocasión, servicio principal, extras, fecha, distrito e invitados enviados por el visitante. Responder reconociendo la combinación completa, confirmar sólo el dato que falte y después revisar disponibilidad, alcance y precio real. Si hay extras del otro equipo, quien recibe el principal coordina internamente la respuesta y evita pedir al cliente que repita el pedido. Antes de invertir en campaña, los dos equipos deben acordar quién cubre ausencias y en qué plazo real pueden responder; no publicar un plazo todavía.

## Decisión de producto

La prioridad es **una cotización útil y entendible antes de cualquier desplazamiento largo**. La home debe decir arriba qué hace Gladys, dar acceso a todas las familias de ocasiones y destacar las que se acercan: cumpleaños, graduaciones y fin de año. Debajo continúa el recorrido visual. Una persona llegada desde Google a una página concreta debe poder elegir cualquiera de los diez servicios publicados como principal, sumar extras, revisar fecha/distrito/invitados y preparar el mensaje sin navegar a más páginas.

Conservar «Mi evento» como bolsa con contador. Mejorar su significado cuando esté vacía, por ejemplo con un rótulo accesible «Mi evento: 0 servicios» y una salida clara hacia las opciones. Mantener el CTA principal de cotización separado de la bolsa cuando la cabecera tenga espacio; en móvil priorizar un solo CTA principal y acceso visible a la bolsa. El CTA no debe prometer envío automático: WhatsApp se abre con un borrador que el visitante decide enviar.

## Alcance de la demanda: muchas entradas, un recorrido corto

La búsqueda puede comenzar por una ocasión («fiesta de promoción»), un formato («desayuno para capacitación»), un servicio («alquiler de sillas») o una duda («qué incluye un buffet»). Cada intención debe llevar a un destino útil. **No se necesita una URL por cada variante de palabras.** Una página propia se justifica si cambia la pregunta del cliente, los servicios relevantes o la información necesaria para decidir; las variantes próximas se resuelven con secciones y preguntas en la página adecuada. Los ejemplos siguientes son hipótesis de intención, no volúmenes medidos.

| Intención que vale atender | Frases posibles de búsqueda | Destino recomendado | Estado |
|---|---|---|---|
| Cumpleaños familiar, infantil o de adultos | «catering para cumpleaños Lima», «buffet cumpleaños en casa», «comida para cumpleaños adultos» | Mejorar la página de cumpleaños con formatos y preguntas diferenciados. No sugerir bartender por defecto a fiestas infantiles. | Existe |
| Quinceañero | «catering para quinceañero Lima», «buffet fiesta de 15» | Empezar con una sección clara en cumpleaños. Página propia sólo si se confirma propuesta y contenido distinto. | Pregunta incluida en cumpleaños; página propia por evaluar |
| Graduación universitaria o fiesta de promoción escolar | «catering para graduación Lima», «buffet fiesta de promoción», «comida promoción colegio» | Página nueva de graduaciones con dos escenarios claros. Comida, mozos, menaje, sillas, flores, recuerdos y polos; bartender sólo cuando proceda. | Implementada localmente; publicación pendiente |
| Bautizo y primera comunión | «buffet para bautizo Lima», «comida primera comunión» | Mejorar la página existente, con preguntas específicas dentro de la misma ruta. | Existe |
| Baby shower | «catering baby shower Lima», «buffet baby shower» | Entrada contextual desde reuniones familiares; evaluar una página propia si se confirma formato de comida y material útil. | Pregunta incluida en reuniones familiares; página propia por evaluar |
| Boda civil, matrimonio, aniversario | «catering boda civil Lima», «buffet para matrimonio», «comida aniversario de bodas» | Página existente de bodas/aniversarios; subtítulos propios para variantes, no URLs duplicadas por ahora. | Existe |
| Almuerzo y celebración familiar | «buffet reunión familiar Lima», «comida para almuerzo familiar» | Página existente de reuniones familiares, con opciones para casa o local según logística a confirmar. | Existe |
| Navidad o Año Nuevo en familia | «catering cena navideña en casa Lima», «buffet año nuevo familiar» | Sección estacional en reuniones familiares **sólo si** menús y horarios son atendibles; no prometer cena especial aún. | Condicionada |
| Fiesta de fin de año de empresa | «catering fin de año empresa Lima», «buffet cierre de año corporativo» | Página nueva de fin de año empresa; distinguir desayuno, almuerzo y celebración según formatos reales. | Implementada localmente; publicación pendiente |
| Desayuno, coffee break o capacitación | «desayunos corporativos Lima», «coffee break capacitación», «catering reunión de trabajo» | Páginas existentes de desayuno como ocasión y como servicio, enlazadas sin competir por el mismo contenido. | Existen |
| Aniversario, integración, inauguración o lanzamiento empresarial | «catering aniversario empresa», «coffee break lanzamiento», «catering inauguración» | Secciones en eventos empresariales; página propia más tarde si aparecen preguntas y propuestas realmente diferentes. | Existe página madre |
| Congreso, seminario o feria | «coffee break congreso Lima», «desayuno seminario» | Empezar en desayunos/eventos empresariales. Confirmar capacidad y logística antes de prometer este formato en una ruta nueva. | Condicionada |
| Un servicio específico sin catering | «mozos para evento Lima», «alquiler menaje Lima», «sillas para evento», «recuerdos para bautizo», «polos promoción» | Ficha propia del servicio ya publicado, con ese servicio como posible principal y el resto como extras. No forzar a empezar por buffet. | Existen fichas |
| Dudas previas al precio | «cuánto cuesta catering para cumpleaños», «qué incluye buffet para eventos», «cuántos mozos necesito» | Respuestas útiles en ocasión/ficha y CTA para indicar fecha, distrito e invitados; ningún precio ficticio. | FAQ ampliadas; ajustar con consultas reales |

Las fichas actuales cubren los diez servicios cotizables: buffet, menú criollo, desayuno corporativo/coffee break, bartender, mozos, menaje, sillas, arreglos florales, recuerdos y polos estampados. El mapa cubre celebraciones privadas, empresas y búsquedas por servicio; **no implica que Gladys deba ofrecer tortas, DJ, local, fotografía, toldos, decoración o una producción integral**. La exploración de ofertas de Lima sugiere estas formas de preguntar, pero no confirma demanda cuantificada ni capacidad de Gladys para todos los formatos.

**Orden de páginas:** primera ola: graduaciones y fin de año de empresa, más cumpleaños mejorado; en paralelo, mejorar desayunos, eventos empresariales y fichas actuales. Segunda ola a evaluar: baby shower y quinceañero. Publicar una nueva página sólo con propuesta propia, contenido realmente distinto y servicio confirmado; en caso contrario, enriquecer la página madre. Los slugs del cuadro siguiente siguen siendo propuestas hasta que existan en código y en producción.

## Módulo de todos los servicios en cada página

Antes de esta implementación, las páginas de ocasión permitían elegir sus servicios y algunas fichas muestran recomendaciones. El trabajo definido fue una experiencia **compartida** para encontrar y añadir cualquiera de los diez servicios desde la portada, el índice de ocasiones, cada ocasión, los catálogos, cada ficha y la cotización. La página de privacidad conserva salida compacta por menú/pie; /admin queda fuera. Reutilizar la selección actual, sin crear una segunda bolsa ni obligar a navegar.

1. Mostrar primero tres sugerencias contextuales con una razón práctica. En una promoción escolar podrían ser mozos, menaje y recuerdos; en un desayuno de empresa, menaje, mozos y polos. No preseleccionar extras ni sugerir barra con alcohol a públicos infantiles/escolares.
2. «Ver todos los servicios» expande los diez, agrupados como **Comida y bebidas** (buffet, menú, desayuno, bartender), **Atención y alquiler** (mozos, menaje, sillas) y **Detalles** (flores, recuerdos, polos). Permitir añadir/quitar allí mismo; cada ítem conserva un enlace HTML «Ver detalles». En una ficha, el servicio actual se indica como seleccionado o destacado, no como un duplicado.
3. En una página de ocasión, ampliar su selector existente en vez de dibujar otro al lado. En catálogo, aprovechar las fichas actuales; en home, vista compacta antes del recorrido largo; en /cotizar, permitir sumar o quitar antes de abrir WhatsApp. Todo usa el mismo estado, cantidades y opciones.
4. En móvil, mostrar tres opciones iniciales y expansión accesible por teclado/tacto. El resumen y el CTA no deben tapar contenido. El bloque compartido no reemplaza la explicación específica de la página ni convierte todas las rutas en la misma plantilla.
5. El **principal elegido expresamente** fija el receptor del pedido completo. Si hay extras del otro equipo, mostrar a qué número irá todo y que Gladys coordinará internamente. Si el visitante cambia el principal, explicar el cambio de destinatario antes de WhatsApp. Nunca dividir el pedido sin que el cliente lo elija.
6. Mantener enlaces rastreables a las fichas para descubrimiento y respaldo cuando JavaScript no esté disponible. El módulo debe complementar el SEO de cada página, no ocultar los textos y enlaces importantes detrás de una interacción.

Así, quien llega por «flores para bautizo» puede cotizar flores como principal y añadir buffet. Quien llega por «buffet para empresa» puede sumar polos sin perder la ruta ni el origen inicial.
## Matriz de la primera ola

| Entrada buscada | Página y mensaje principal | Primer servicio sugerido | Complementos pertinentes | Cuidado comercial |
|---|---|---|---|---|
| «buffet para cumpleaños Lima» | Página actual `/tipos-evento/catering-cumpleanos-lima`, con alternativas para celebración familiar, infantil o de adultos | Buffet o menú criollo | Mozos, menaje, sillas, flores, recuerdos; bartender si corresponde al evento | No sugerir barra por defecto a una fiesta infantil |
| «catering para graduaciones Lima» / «fiesta de promoción» | Nueva página evergreen `/tipos-evento/catering-graduaciones-lima` | Buffet o menú criollo | Mozos, menaje, sillas, recuerdos, flores y polos; barra sólo cuando sea pertinente | Distinguir promoción escolar de graduación universitaria sin suponer bebidas alcohólicas |
| «catering para fiesta de fin de año de empresa Lima» | Nueva página evergreen `/tipos-evento/catering-fin-ano-empresas-lima` | Buffet o desayuno/coffee break según formato | Bartender, mozos, menaje, sillas, flores, recuerdos y polos | No llamar «paquete» a una combinación sin contenido/precio confirmado |
| «desayuno de fin de año para empresa Lima» | Sección propia dentro de la página de fin de año, enlazada a la ficha actual de desayunos corporativos | Desayuno/coffee break | Menaje, mozos, polos, flores | Evitar una página casi duplicada de la ficha corporativa actual |
| «alquiler de sillas/menaje», «bartender para eventos» | Fichas de servicio existentes, entrada directa a su propia cotización | El servicio buscado como principal | Sugerencias específicas y opcionales | Si el principal cambia, informar el nuevo responsable antes de WhatsApp |

Los slugs nuevos quedaron implementados en el build local; la publicación aún debe comprobarse. Confirmar los IDs y relaciones contra `data/demo.ts` y los modelos antes de implementar; no referenciar rutas inexistentes como si ya funcionaran. Toldos y decoración aparecen en el contexto histórico, pero no tienen una oferta cotizable publicada en el catálogo inspeccionado. Confirmar alcance, fotos y responsable antes de anunciarlos como servicio independiente.

## Plan por superficies

### 1. Cabecera y navegación — prioridad P0

- Añadir «Ocasiones» como acceso a /tipos-evento. Ordenar el menú por Celebraciones y Empresas: destacar cumpleaños, graduaciones y fin de año por cercanía de campaña, pero mantener visibles bodas, bautizos, reuniones familiares, desayunos y eventos empresariales. El acceso debe funcionar en móvil y escritorio sin ocultar buffet ni complementos. Enlazar sólo rutas publicadas; las nuevas aparecen al estar implementadas.
- Dar al CTA principal un verbo inequívoco: «Cotizar mi evento» o «Pedir una propuesta». «Mi evento» sigue siendo el resumen de lo elegido, con contador y foco accesible. No crear dos botones idénticos compitiendo en 320 px.
- Si se contempla una cabecera fija al desplazarse, prototipar y medir antes: la actual superpone el hero. Mantener altura baja y evitar que tape títulos, contenido o controles. No es requisito para la primera salida.

### 2. Home — prioridad P0

- Bajo el hero, colocar un acceso compacto a las ocasiones con campaña próxima —cumpleaños, graduaciones y fin de año— y «Ver todas las ocasiones». El índice ofrece también bodas, bautizos, familia, desayunos y eventos empresariales. No convertir la portada en un listado interminable ni reducir la oferta a tres fechas.
- Añadir una frase clara y temprana sobre la oferta completa: buffet, menús y desayunos; bartender, mozos, menaje, sillas, flores, recuerdos y polos. Ya aparece la lista en el hero, pero cada entrada debe llevar al servicio o la ocasión correspondiente. Integrar aquí la versión compacta del módulo compartido para seleccionar sin salir.
- Mostrar cerca de la primera decisión las tres respuestas que reducen dudas: Lima Metropolitana, precios a consulta y posibilidad de contratar un servicio o combinar varios. Sin urgencia ficticia ni disponibilidad inventada.
- Conservar el recorrido visual existente y sus CTA; distinguir «Ver ideas» de «Cotizar» para que el visitante sepa qué pasa al pulsar cada uno.

### 3. Páginas de ocasión — prioridad P0

- Crear las dos páginas prioritarias con contenido útil propio: para quién es la propuesta, formatos que Gladys confirme, servicios seleccionables, logística a definir, FAQ pertinente y cotización dentro de la misma página. Actualizar cumpleaños para resolver dudas reales de celebraciones infantiles, familiares y adultas, no para repetir palabras clave. Mejorar también las páginas existentes de desayunos y eventos empresariales para las búsquedas agrupadas en el mapa.
- Dejar el primer CTA visible sin esperar a bajar a todas las tarjetas. Ese CTA puede llevar al selector de la misma página y mantener la ocasión en el cotizador.
- Ordenar las ofertas por contexto. Inicio sugerido, nunca selección obligatoria: buffet para una graduación; buffet o coffee break para fin de año; buffet/menú para cumpleaños. Los extras se explican con la razón práctica de añadirlos y se pueden quitar.
- La interfaz debe indicar qué incluye la selección y qué se definirá en WhatsApp. Precio «a consulta», fecha, distrito e invitados aproximados visibles antes del paso final; no fingir que existe una reserva confirmada.
- Para enlaces desde anuncios, redes o WhatsApp, usar la URL de la ocasión como destino. Las campañas deben conservar UTM saneadas y origen inicial en el mensaje, sin convertir esos datos en texto comercial pesado.

### 4. Catálogos, fichas y bolsa — prioridad P1

- En /servicios y /complementos, abrir con una decisión simple: «Quiero comida», «Quiero atención/alquiler» o «Quiero detalles». Cada tarjeta mantiene su CTA con nombre de servicio y destino claro. Integrar el módulo compartido y permitir añadir sin entrar en cada ficha. Cualquier servicio puede ser principal.
- En las fichas, situar arriba beneficio, alcance y CTA específico; más abajo detalles, dudas y complementos. Las recomendaciones deben depender de la ocasión y no alterar automáticamente el principal.
- En «Mi evento», presentar el resumen con servicio principal, extras, cantidades, posibles datos faltantes y a quién llegará la consulta. Estado vacío: «Elige un servicio para empezar» con salida a ocasiones y servicios. Si el visitante cambia el principal, explicar que cambia el destinatario; nunca cambiarlo en silencio. En móvil, el resumen debe ser visible sin cubrir la pantalla.
- Revisar el lenguaje de los tres pasos del cotizador para separar «preparar mensaje», «abrir WhatsApp» y «enviar». Evitar pedir información que no cambie la propuesta; preservar las validaciones actuales hasta decidir con evidencia si alguna es excesiva.

### 5. Pie de página — prioridad P1

- Convertirlo en un mapa comercial corto: «Celebraciones» (cumpleaños, graduaciones, bodas, bautizos y reuniones familiares), «Empresas» (fin de año, desayunos y eventos empresariales) y «Servicios» (buffet, menú, bartender, mozos, menaje, sillas, flores, recuerdos y polos, agrupados sin saturar). No listar destinos que todavía no existan.
- Repetir un CTA de cotización y la cobertura real. Explicar con una frase que el presupuesto y la disponibilidad se confirman por WhatsApp. Mantener privacidad y marca; no añadir dirección, horarios, testimonios o redes no confirmadas.

### 6. Visibilidad y adquisición — prioridad P0/P1

- Cada nueva página tendrá title y H1 descriptivos, meta description propia, enlace interno desde home/categoría/footer, URL canónica coherente y presencia en sitemap. Mantener la página evergreen y actualizar ejemplos/FAQ de temporada cuando corresponda. No crear variantes de cada distrito con texto casi idéntico. No dividir «fiesta de promoción», «graduación» y «promoción escolar» en tres URLs si resuelven la misma necesidad. La cobertura real es Lima Metropolitana.
- Tras publicar el commit correspondiente, comprobar en la URL pública el HTML, canonical, `robots.txt`, sitemap y que las dos nuevas páginas devuelvan 200. Enviar sitemap y revisar indexación/consultas en Search Console, si el propietario tiene acceso. Google indica que el rastreo puede tardar días o semanas y que solicitarlo no garantiza aparecer de inmediato.
- Para demanda inmediata, preparar enlaces medibles hacia la página exacta de cada ocasión o servicio desde perfiles y publicaciones que el negocio controle. Usar mensajes y piezas que muestren combinaciones reales de servicios, no trabajos ficticios. No lanzar anuncios pagados sin decidir presupuesto y capacidad de respuesta.
- Considerar Google Business Profile sólo después de comprobar elegibilidad y datos operativos; si Gladys atiende en la ubicación del cliente, Google permite configurar área de servicio sin mostrar una dirección al público. Confirmar por separado cualquier restricción vinculada a bebidas alcohólicas antes de configurar categorías.

## Tono y operación que convierten la consulta en respuesta

Gladys debe sentirse cuidada y accesible para quien organiza una reunión pequeña, una fiesta familiar o un evento de empresa. Mantener el acabado editorial, pero usar frases que inviten a conversar: «Cuéntanos qué celebras y cuántas personas serán. Te ayudamos a elegir sólo lo que necesitas». Evitar «lujo», «exclusivo» o «para todos los presupuestos» si implican una promesa que el equipo no ha confirmado. El presupuesto puede preguntarse como dato opcional para orientar la propuesta, sin excluir a nadie.

Preparar para cada responsable una pauta manual de respuesta: reconocer la ocasión y los servicios que llegan en el borrador, confirmar fecha/distrito/invitados y hacer sólo la pregunta que falte; después acordar cuándo se entregará la propuesta real. Si el cliente combina equipos, quien recibe el servicio principal coordina internamente los extras: no pedirle al cliente que empiece otra conversación salvo que él elija cambiar el principal. Definir responsable de respaldo y tiempo de respuesta antes de promocionar masivamente; no publicar un plazo hasta poder cumplirlo.

Ejemplo de primer mensaje del **visitante** que debe producir el flujo, con datos ilustrativos y sin enviarlo: «Hola, quisiera cotizar una graduación en Lima. Será el [fecha] en [distrito] para [cantidad] personas. Me interesa el buffet y añadir mozos y menaje. ¿Podemos revisar opciones y disponibilidad?». El borrador final conservará además las cantidades/opciones y el origen de la consulta que realmente haya elegido el visitante.
## Orden de ejecución y puertas de aceptación

| Fase | Qué se entrega | Comprobación para cerrar |
|---|---|---|
| 0. Línea base | Mapa de rutas, CTAs, fuentes de datos y versión pública; recorrido real de un cliente de cumpleaños hasta borrador de WhatsApp | No hay rutas rotas, teléfono cruzado, CTA ambiguo ni diferencia inadvertida entre local y despliegue |
| 1. Descubrimiento global | Cabecera y pie por ocasiones/servicios, accesos de campaña en home, «Mi evento» claro y módulo compartido de los diez servicios | Desde cada página comercial se puede descubrir y añadir cualquier servicio sin salir; en 320/375/768/1440 px funcionan CTA, bolsa, teclado y tacto; principal y origen se conservan |
| 2. Intenciones fuertes | Graduaciones y fin de año, con selector y cotizador en la misma página; cumpleaños, desayunos y empresas mejorados | Entradas directas por URL, metadatos y sitemap; combinaciones de principal/extras abren el borrador al número correcto, sin mandar mensajes de prueba |
| 3. Fichas y fricción | CTA específico por servicio, bolsa, catálogos, FAQs pertinentes y fotos reales cuando existan | Servicio individual y pedido mixto funcionan; no se confunden consulta, disponibilidad y reserva; ningún testimonio o trabajo inventado |
| 4. Publicación y aprendizaje | Build, regresión, aceptación, despliegue autorizado y revisión de resultados | Checks técnicos, revisión móvil real, URLs públicas, Search Console si está disponible y seguimiento operativo de conversaciones |
| 5. Expansión basada en señales | Evaluar baby shower, quinceañeros u otras páginas diferenciadas | Oferta y capacidad confirmadas, contenido propio, consultas reales; no duplicar una página madre para cubrir sinónimos |

Las pruebas mínimas de cada fase incluyen `npm.cmd run quality`, navegación en los tamaños indicados, teclado, movimiento reducido, acceso directo desde buscador a páginas de ocasión, restauración de la selección y verificación del destinatario en los dos sentidos. Las comprobaciones visuales no sustituyen la prueba del mensaje completo ni la aceptación de los operadores.

## Medir sin backend

No introducir D1, CMS, API de leads ni analítica persistente. La web puede conservar ruta inicial, campaña y CTA sólo en la sesión y adjuntarlos de forma discreta al borrador de WhatsApp. Los responsables pueden llevar un conteo manual semanal: conversaciones recibidas, consultas con fecha/distrito/invitados suficientes, propuestas respondidas y servicios confirmados, separado por ocasión y por número receptor. Un clic o apertura de WhatsApp no equivale a mensaje enviado, cotización respondida ni venta.

No fijar porcentajes de mejora sin línea base. Si se decide medir tráfico en el futuro, elegir primero la herramienta y su tratamiento de privacidad antes de añadir scripts. Search Console permite comparar consultas, páginas, impresiones y clics desde Google; no mide todas las conversaciones ni las ventas. Revisar preguntas recibidas en WhatsApp para decidir si una nueva página resolvería algo distinto.

## Decisiones comerciales que no se inventan

- Menús concretos, capacidades, cantidades mínimas comerciales, tiempos de respuesta, disponibilidad y condiciones de traslado.
- Si los toldos y la decoración se anuncian como servicios independientes y qué material real se ofrece.
- Fotos de eventos ejecutados, testimonios y casos de empresa verificables.
- Presupuesto de publicidad, capacidad de atención en campaña y responsable de coordinar extras del otro equipo.

Estas decisiones pueden resolverse mientras se construyen rutas y flujos con ofertas confirmadas. Una página puede captar consultas con «precio a consulta» sin inventar tarifas ni prometer fechas libres.

## Fuentes y límites de la investigación

- [Google Search Central: contenido útil para personas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
- [Google Search Central: títulos descriptivos](https://developers.google.com/search/docs/appearance/title-link).
- [Google Search Central: páginas de entrada duplicadas](https://developers.google.com/search/blog/2015/03/an-update-on-doorway-pages).
- [Search Console: consultas, páginas, clics e impresiones](https://support.google.com/webmasters/answer/17010961).
- [Google Search Central: un sitemap no garantiza indexación ni posiciones](https://developers.google.com/search/help/crawling-index-faq).
- [Google Search Central: solicitar rastreo e indexación](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
- [Google Business Profile: áreas de servicio y direcciones](https://support.google.com/business/answer/9157481).

Se revisaron como referencias de lenguaje e intención páginas públicas de [promociones y graduaciones](https://www.tzabar.com.pe/catering-organizacion-fiesta-promocion.html), [coffee break corporativo](https://www.malvaeventos.com/), [eventos de fin de año de empresas](https://peruballoons.com/pages/corporativos) y [baby shower](https://www.miscelaneadulces.pe/products/70-pers-catering-baby-shower). No son datos de volumen, ni autorizan atribuir a Gladys la oferta o experiencia de otros negocios.

Estas fuentes orientan la estrategia; no prueban que las páginas nuevas posicionarán ni que el perfil sea elegible. La comprobación pública de robots/sitemap/home descrita arriba se realizó directamente el 2026-10-09.
