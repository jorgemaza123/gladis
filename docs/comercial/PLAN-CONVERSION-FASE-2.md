# Gladys — siguiente mejora de conversión

Fecha: 2026-10-09. Estado: plan propuesto; esta fase no está implementada.

## Objetivo

Facilitar el paso de elegir servicios a consultar por WhatsApp, conservando ocasión, selección, responsable y origen del cliente. La web seguirá siendo estática, sin base de datos ni backend. Precio y disponibilidad se confirmarán por conversación. La primera ola está verificada localmente; su publicación y sus resultados comerciales aún requieren comprobación.

## Lo comprobado en el código

- El selector contextual deja elegir servicios desde las páginas comerciales, pero el primer paso del cotizador vuelve a mostrar los diez botones, incluso cuando ya existe una selección. Archivos: components/service-explorer.tsx y components/quote.tsx.
- Se pide «personas para este servicio» y después «invitados» para el evento. Esos valores pueden ser distintos; no se deben sincronizar sin una acción explícita. Archivos: components/event-selection.tsx y components/quote.tsx.
- La bolsa muestra una lista de errores en cuanto contiene una línea incompleta. Hay que verificar si ayuda o hace parecer que el usuario ya se equivocó. Archivo: components/quote-cart-dialog.tsx.
- Algunas opciones están marcadas como obligatorias por configuración. Hay que preguntar a los responsables cuáles son necesarias para una primera consulta antes de cambiarlas.
- El mensaje incluye evento, fecha, distrito, invitados, servicios, cantidades, presupuesto y origen/campaña. Se debe preservar esa información al mejorar su lectura. Archivos: lib/whatsapp-message.ts y components/quote.tsx.

Estos hallazgos describen el flujo actual. No prueban abandono ni una tasa de conversión.

## Fases propuestas

### 0. Línea base

Comparar el sitio público con la versión local antes de medir. Observar cinco recorridos móviles: cumpleaños con buffet; graduación con mozos y menaje; fin de año empresarial con desayuno; sillas como principal; y buffet con un extra del otro equipo. Registrar dudas, campos corregidos, tiempo hasta el borrador y destinatario. No enviar mensajes de prueba. Si Search Console está disponible, anotar consultas, páginas, impresiones y clics; registrar por separado conversaciones recibidas, propuestas respondidas y contrataciones.

### 1. Cotización más clara — P0

Con servicios elegidos, mostrar primero la selección editable y un control secundario «Añadir otro servicio». Con selección vacía, mantener a la vista el catálogo. El servicio principal y el equipo que recibe toda la consulta deben verse antes del CTA final. El cambio de principal actualizará el destino sin separar los extras.

Ofrecer «Usar este número como invitados» únicamente para un servicio medido por personas y sólo si el visitante lo solicita. Ambos valores quedan editables. Conservar la ocasión de la página de entrada, permitiendo corregirla. Mantener presupuesto opcional, cobertura de Lima Metropolitana y explicación clara de que WhatsApp abrirá un borrador revisable.

### 2. Campos y errores — P1

Mostrar ejemplos antes de validar y errores junto al campo sólo tras intentar continuar. Llevar el foco al primer campo pendiente sin borrar la selección. Preguntar a los dos responsables qué opciones son indispensables para el primer contacto y cuáles admiten «Aún no lo sé»; modificar obligatoriedad sólo después de esa confirmación. Probar fecha, cantidad vacía, límites, selección mixta y restauración de sesión.

### 3. Borrador y respuesta — P1

Ordenar el mensaje para leer primero la ocasión, fecha/lugar, invitados, principal y extras. Conservar detalles de cada línea y poner la atribución al final, legible para el equipo. Probar longitud y caracteres españoles con pedidos cortos y largos. Preparar una pauta manual: reconocer el pedido recibido, preguntar sólo lo faltante, coordinar extras internamente y responder con precio, disponibilidad y condiciones reales. No prometer plazos de respuesta no confirmados.

### 4. Nuevas entradas según demanda — P2

Usar consultas reales de Search Console y preguntas de WhatsApp para enriquecer primero páginas y FAQ existentes. Evaluar baby shower, quinceañeros y otras intenciones sólo cuando exista una oferta confirmada y contenido distinto. Crear una ruta nueva únicamente si resuelve una necesidad que la página actual no cubre. No duplicar páginas para variar palabras clave ni inventar testimonios, experiencia o fotos de trabajos.

## Aceptación

- Desde ocasión, ficha o portada se puede añadir, quitar y revisar sin perder el contexto ni el origen.
- Cantidad por servicio e invitados permanecen independientes salvo copia solicitada.
- Los errores se entienden, señalan el campo y conservan lo escrito; no aparecen como fallo inicial.
- Todo el pedido va al número del principal: buffet, comida, bartender y menaje al 902843481; mozos, sillas, flores, recuerdos y polos al 923106197.
- El borrador conserva todos los servicios, cantidades, opciones y origen. Abrir WhatsApp no equivale a enviar el mensaje.
- Tras implementar, ejecutar npm.cmd run quality y revisar en navegador real a 320, 375, 768 y 1440 px, con teclado, consola y ambos destinos. No declarar mejora de conversión sin una línea base comparable.

## Límites

No añadir backend, base de datos, CMS, pagos, reservas automáticas, analítica invasiva ni dependencias innecesarias. No cambiar diseño, rutas, fotografías o SEO sin una causa comprobada. Este plan no realiza push ni despliegue.

## Referencias

- Formularios y reintroducción de datos: https://web.dev/learn/forms/auto/
- Validación comprensible: https://web.dev/learn/forms/validation/
- Contenido útil para personas: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Search Console: https://developers.google.com/search/docs/monitor-debug/search-console-start
