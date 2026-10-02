# Contratos cerrados para todas las tareas

Versión del plan: 1. Las formas descritas aquí son OBJETIVO, salvo los archivos que CONTEXTO.md identifica como existentes. Cada tarea declara qué debe crear. No importar archivos futuros antes de su tarea. Toda modificación de contrato exige actualizar este documento y las tareas afectadas antes de continuar.

## C1. Contactos: una fuente de verdad

Crear en tarea 02 `config/business-contacts.ts`, módulo de configuración consumido por servidor:
- IDs estables de responsables: `cocina` y `eventos`; no confundirlos con el rol admin `owner`.
- cocina: etiqueta editable «Cocina y bar», whatsapp null hasta obtener número real.
- eventos: etiqueta editable «Jorge», whatsapp `51902843481`.
- Campos: `label: string; whatsapp: string | null; enabled: boolean`.
- El teléfono literal de Jorge aparece UNA vez en configuración de aplicación. Se admiten ejemplos documentales y fixtures aislados sin envíos. No duplicarlo en componentes, entradas o variables de entorno.
- Validar formato internacional de 8–15 dígitos sin +, espacios ni guiones. Para los números peruanos suministrados: código 51 + móvil de nueve dígitos. No afirmar que ese formato prueba que existe una cuenta WhatsApp.
- Cambiar ese campo y desplegar actualiza todos los NUEVOS enlaces del responsable y las futuras secciones que lo referencien. Un chat/mensaje ya abierto no cambia retroactivamente.
- `SiteSettings.whatsapp` queda sólo como dato legado durante transición y se retira de decisiones activas en tarea 12. Nunca fallback silencioso.
- La misma fuente alimenta teléfonos visibles y datos estructurados, además de enlaces. La tarea 17 eliminó toda lectura de `SiteSettings.whatsapp` en SEO. Mientras no exista un contacto principal del negocio confirmado, `businessData` omite `telephone`; no asigna por defecto ninguno de los responsables de servicio.
- Este plan elige configuración en código porque el usuario pidió modificar el número una sola vez en el código. No crear además contactos editables en D1 como segunda fuente. Una futura migración al CMS deberá reemplazar esa fuente, no duplicarla.

## C2. Ofertas y recomendaciones por datos

Extender ContentEntry en tarea 03, normalización y Zod al mismo tiempo:
`requestable: boolean`, `ownerId: 'cocina' | 'eventos' | null`, `prominence: 'primary' | 'secondary'`.
`quoteConfig: { quantityUnit: 'person' | 'unit' | 'event' | 'hour'; minimum: number; maximum: number; step: number; dateRequired: boolean; districtRequired: boolean; guestsRequired: boolean; options: Array<{id:string; label:string; required:boolean; values:Array<{id:string; label:string}>}> }`.
Configurar IDs, opciones y límites en datos; no deducirlos del título ni del slug. quantityUnit describe la unidad solicitada, no fuerza un precio. Precio real continúa en Price y nunca se calcula un total sin reglas verificadas.
Reglas de validación: minimum > 0, maximum >= minimum, step > 0; opciones con IDs únicos, máximo 8 grupos y 20 valores por grupo, etiquetas de hasta 80 caracteres. Validar incrementos con precisión decimal definida, sin comparar flotantes de forma ingenua. Configuración incompleta deja la oferta no cotizable. guestsRequired determina si hace falta el total de asistentes; no inferirlo por título. No obligar a que cada línea de menú tenga la misma cantidad que los asistentes: puede haber opciones para subconjuntos.
`recommendations: Array<{entryId:string; priority:number; eventTypeIds:string[]; reason:string}>`.
La tarea 15 añade campos editoriales opcionales y normalizados: `faqItems: Array<{id:string;question:string;answer:string}>`, `processSteps: Array<{title:string;description:string}>` y `externalCatalog: {url:string;label:string} | null`. Las listas antiguas se normalizan a `[]` y el catálogo a `null`. La URL externa sólo admite HTTPS sin usuario, contraseña ni parámetros agregados por el cliente; si es `null`, el enlace se oculta. Estos campos no atribuyen responsable, no hacen cotizable una entrada y no contienen datos de contacto del visitante.
La tarea 16 añade `coverageIds: string[]`, normalizado a `[]`. Cada ID debe referir una entrada de tipo `cobertura`; las condiciones confirmadas viven en `district`, `details` y `body` de esa entrada. Una cobertura ausente o un distrito escrito que no esté relacionado requiere coordinación: no es una promesa de disponibilidad ni una base para calcular precios.
`provider` existente describe propio/aliado; NO decide el teléfono.
Legacy: usar normalización conservadora requestable false, ownerId null si no hay asignación explícita. Un script de diagnóstico propone mapa; aplica sólo asignaciones confirmadas. No migrar un teléfono global desconocido a cocina.
Oferta publicada cotizable debe tener ownerId. Teléfono aún pendiente puede existir en desarrollo/demo con diagnóstico; bloquea lanzamiento de esa línea.
Documentos/páginas/eventos informativos no se convierten automáticamente en productos cotizables.
Campos editoriales nuevos de tareas 15/16 se especifican allí y permanecen datos normalizados.

## C3. Bolsa de cotización V2

Crear modelos y validación nuevos en tarea 04 sin romper V1.
`QuoteItemV2 = { itemId: string; entryId: string; quantity: number; optionValues: Record<string,string> }`.
itemId es UUID de línea; entryId es ID real de ContentEntry. Un máximo de 20 líneas por solicitud. Combinaciones entryId + opciones canónicas iguales se fusionan sin superar el máximo configurado. Distintas variantes permanecen líneas distintas.
`CartV2 = { schemaVersion: 2; items: QuoteItemV2[]; primaryItemId: string | null; updatedAt: number }`.
Principal debe ser una línea existente. Al agregar la primera oferta de una ficha puede ser principal; agregar otras no lo cambia. Cambiar principal es acción explícita que muestra el nuevo responsable. Eliminar principal exige escoger sustituto; no escogerlo por orden/precio.
El servicio de adquisición inicial nunca se reescribe por ese cambio.
Persistencia de bolsa en sessionStorage con versión y TTL 24h; no contiene nombre/teléfono/email. Si storage falla, funcionar en memoria. Mantener sólo DTO público necesario, no todo SiteContent.
`QuoteInputV2 = { schemaVersion:2; requestId:string; items:QuoteItemV2[]; primaryItemId:string; event:{typeId:string|null; typeOther:string; date:string|null; district:string; guests:number|null}; contact:{name:string; phone:string; email:string}; notes:string; consent:true; website:string; startedAt:number; attribution:AttributionV1 }`.
Límites V2: nombre entre 2 y 150 caracteres; teléfono de contacto entre 7 y 25 con caracteres telefónicos permitidos; email vacío o válido de hasta 200; notas hasta 2500; distrito hasta 120; typeOther hasta 150. IDs de contenido/opciones hasta 100 caracteres. Contacto obligatorio para una solicitud guardada recuperable; no confundir este teléfono del cliente con el destinatario comercial. El texto visible explica para qué se pide. No afirmar que un clic anónimo identifica a un cliente.
Fechas, distrito e invitados obligatorios sólo si alguna oferta los requiere mediante quoteConfig. Permitir «por confirmar» cuando no es obligatorio. Validar fecha calendario en zona Lima cuando se informa. Campos de contacto no van en métricas, URL de la web ni localStorage; mantenerlos en memoria durante esta interacción y conservarlos allí al fallar la red. No perderlos al cerrar y reabrir el modal de la misma página. Una recarga restaura la bolsa sin PII, con aviso de que deberá completar de nuevo el contacto.
requestId identifica un intento final: repetir mismo payload retorna misma referencia; payload distinto con mismo ID da 409. Una edición explícita después de guardado crea nuevo intento, nunca modifica el anterior.

## C4. Servidor, snapshots y compatibilidad

Validar todo contra catálogo publicado: requestable, ownerId, cantidades, opciones y relaciones. Rechazar campos de autoridad ajenos al esquema: teléfono destinatario, precio, título o owner enviados por cliente. Nunca confiar en ellos.
Resolver `recipientOwnerId` desde la línea principal, no desde la familia general del carrito. Extras no alteran responsable.
Persistir snapshot V2: primaryItemId; ownerId acordado; líneas con título, unidad, cantidad, opciones con etiquetas, ownerId de cada oferta y precio/condiciones si existen; contexto y origen saneados; texto/version de consentimiento. Mantener entrada y snapshot V1 legibles por API, seguimiento y CSV.
El repositorio ofrece proyección común para que consumidores existentes sigan compilando; V2 es aditiva durante transición. No usar `as any` para ocultar diferencias.
La respuesta pública contiene referencia e información necesaria del propio envío; no expone lista, IDs de otros clientes ni biblioteca privada.
Errores: 400 validación, 409 conflicto, 413 tamaño, 429 límite, 503 dependencia no disponible con mensaje genérico y registro sin PII. Mantener política de origen y lectura acotada.
Presupuesto HTTP V2: 32 KiB como máximo, acotando el stream antes de parsearlo; verificar además límites de cada colección/campo. La tarea 06 actualiza explícitamente el límite actual y sus pruebas. No ampliar límites en los endpoints de sesión o eventos. Nunca truncar silenciosamente líneas válidas para hacer que una petición pase.
No crear acceso público a una cotización por sólo conocer su referencia. Cualquier consulta de detalle permanece autenticada.
Las migraciones nuevas se generan desde el esquema real y se aplican primero en copia local. No suponer nombres ni números de migración.

## C5. WhatsApp después de guardar

`POST /api/quotes` reconoce V1 y V2 durante transición. Tras persistencia/idempotencia de V2, tarea 11 añade a la respuesta:
`{reference, demo, recipient:{ownerId,label,available}, whatsapp: {url,message} | null}`.
Construir el mensaje y wa.me en servidor usando snapshot y configuración vigente del propietario acordado. En reintento de mismo payload conservar propietario de snapshot aunque después cambie el ownerId del catálogo; resolver teléfono vigente de ese propietario. No actualizar silenciosamente propietario de solicitudes previas.
Si teléfono falta/inactivo: puede guardarse solicitud con responsable pendiente de contacto y respuesta whatsapp null, explicar que no se abrió WhatsApp. No enviarla al otro número. El lanzamiento exige responsables operativos.
Mostrar resumen/modal antes de guardar: principal, extras con cantidades, destinatario, contexto y origen legible. Tras guardar, mostrar referencia y enlace nativo «Abrir WhatsApp» con acción explícita del usuario; evita popup bloqueado después de fetch. Cerrar modal conserva bolsa; no enviar automáticamente ni abrir dos chats.
El enlace usa `https://wa.me/<numero>?text=<encodeURIComponent(message)>`. Mantener un único generador. Tamaño máximo de mensaje 2500 caracteres como presupuesto del producto, NO como supuesto límite oficial. Resumir notas largas sin perder referencia, principal ni líneas; limitar datos de entrada acordemente. No incluir correo/teléfono del cliente ni notas libres en el texto por defecto; dichos datos ya están en solicitud privada. Mostrar al visitante exactamente qué se compartirá.

Plantilla de ejemplo, rellena por datos:
«Solicitud {referencia}
Origen: {canal} · {ruta o etiqueta de entrada} · {ubicación del botón}
Interés inicial: {oferta de adquisición}
Servicio principal: {título} — {cantidad} {unidad}
También solicito información de:
• {extra} — {cantidad} {unidad} · {opciones}
Evento: {tipo}, {fecha o por confirmar}, {distrito}, {invitados si aplica}
Atiende: {etiqueta responsable}»
No imprimir IDs internos ni UTM crudas en ese mensaje; campaña puede representarse por etiqueta saneada. Responsable principal coordina extras del otro; no enviar automáticamente a ambos.

## C6. Origen y eventos: lo observable

`AttributionV1 = {schemaVersion:1; landingPath:string; acquisitionEntryId:string|null; lastTouchPath:string; referrerHost:string|null; channel:'organic'|'paid'|'social'|'referral'|'direct_unknown'; utm:{source?:string;medium?:string;campaign?:string}; ctaPlacement:string; capturedAt:string}`.
Capturar pathname, nunca query/hash completos. Referrer sólo hostname. UTM allowlist más saneamiento de valores (máx80, quitar controles, URLs, correos/teléfonos y valores sospechosos; ante duda omitir). Máx2000 bytes total. Datos de navegador son declarados, no prueba de identidad/canal; llamar directo/desconocido cuando no hay evidencia. No inventar keyword de Google.
Mantener first touch durante sesión; last touch y ubicación del botón pueden cambiar. acquisitionEntryId: primera oferta con interacción de intención, independiente de navegación posterior/principal final. Origen entregado con cotización forma parte del contexto mínimo; analítica opcional separada y respetando elección de privacidad.
Placements enumerados: hero, navigation, footer, catalog_card, service_detail, recommendation, cart, quote_form, external_catalog.
Eventos previstos: `cta_clicked`, `cart_item_added`, `primary_changed`, `quote_saved`, `whatsapp_open_clicked`, `external_catalog_clicked`.
Payload de eventos: eventId UUID, name permitido, placement, entryId opcional, ownerId server-resolved si aplica, attribution saneada cuando autorizada, timestamp de servidor. Nunca textos de contacto/notas ni URL wa.me. `quote_saved` se registra en servidor, una vez por requestId, no desde navegador.
Clicks no equivalen a personas únicas, WhatsApp enviado, reserva ni venta. Datos aceptados por endpoint pueden tener spam/adblock; rotular tasas con esta limitación. Sin consentimiento de analítica, cotización y WhatsApp funcionan igual y puede constar sólo el contexto del CTA de solicitud.
Endpoint de eventos aislado y acotado creado en tarea 09; error de métricas no impide CTA. Registro operativo de solicitud sí es obligatorio antes del enlace.
No perfilado, fingerprinting, seguimiento entre dominios automático ni GTM/GA añadidos sin decisión. No reutilizar tokens de autenticación para tracking.

## Ajuste UX autorizado — 2026-10-02

La implementación visual conserva la arquitectura estática y los contactos vigentes de `config/business-contacts.ts`. La interfaz llama **Mi evento** a la bolsa. Tres etapas: selección, datos del evento y revisión con un único enlace a WhatsApp. No se recogen datos de contacto ni se envía automáticamente el mensaje.

La consulta pública acepta cantidades orientativas enteras desde 1; el límite técnico es 100000 (el servicio por evento continúa 1). Se retiran mínimos comerciales simulados de 20/10 personas o unidades, que no constituían condiciones confirmadas. Fecha/distrito/invitados continúan según `quoteConfig`. No hay cálculo de precio ni garantía de disponibilidad. Abrir otra vez un CTA de un servicio ya seleccionado conserva su cantidad y opciones, en vez de sumar una unidad; el reducer conserva compatibilidad con variantes históricas.

Cada línea y sus opciones con etiquetas se incluyen en el resumen y el mensaje. El mensaje admite hasta 6000 caracteres: si se excede, no se construye un enlace truncado. El responsable procede exclusivamente del principal. Agregar extras conserva el principal; eliminarlo exige elegir otro. La selección de URL acepta también servicios independientes de tipo complemento. Se conserva el origen inicial y UTM saneado; el resumen muestra ese contexto antes de abrir WhatsApp. No se transmite a un servidor de la web.

La navegación permite el ancla exacta `/#como-cotizar`, además de rutas internas. El resto del validador de URL no se amplía. Las imágenes nuevas son ilustraciones IA identificadas como referenciales, con variantes JPEG y dimensiones/pesos reales en `data/design-images.json`. No representan eventos realizados.
