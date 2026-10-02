# Catering Gladis: una mesa para todos

> Actualización 2026-10-02: el usuario autorizó la implementación. Ver [resultado, pruebas y límites](IMPLEMENTACION.md). Las menciones a archivos futuros y al estado anterior que siguen abajo corresponden a la auditoría original.

Propuesta de UX, UI y diseño frontend · revisión cerrada el 2026-10-02 · Base revisada: `63784cd`.

Estado: propuesta para revisión. No implementada en la aplicación. Este documento y `direccion-visual.html` son entregables de diseño, no evidencia de publicación ni de cumplimiento integral.

Entregable visual: [abrir lámina HTML](direccion-visual.html). Sus enlaces internos y recursos locales fueron comprobados. El navegador integrado bloqueó el protocolo `file:`, por lo que su renderizado no se marca como verificado. La lámina funciona como archivo independiente, utiliza fuentes locales de sustitución y no envía datos.

## 1. Decisión de diseño

Una marca de cocina cercana, presentada con orden y cuidado. La elegancia debe venir de la buena composición, la legibilidad y la calidad de las imágenes. La accesibilidad económica debe expresarse mediante libertad para elegir servicios y conversar sobre el presupuesto, sin clasificar personas por nivel social ni prometer precios que no existen.

Concepto: **Una mesa para todos**. Una mesa compartida será el elemento visual memorable; el resto de la interfaz será sencillo. Blanco dominante, verde jade, superficies suaves y comida con color natural. Evitar el negro con dorado, las palabras «exclusivo» o «VIP», y la apariencia de restaurante de lujo. Evitar también descuentos ficticios o una estética de oferta permanente.

Mensaje propuesto: **«Cocinamos para que disfrutes tu celebración.»**

Apoyo: «Buffet y servicios para eventos en todo Lima Metropolitana. Cuéntanos qué necesitas y qué presupuesto tienes en mente; conversemos sobre las opciones.»

Esta última frase invita a conversar: no garantiza que cualquier presupuesto cubra cualquier servicio. No prometer atención inmediata, mínimos, disponibilidad o cobertura fuera de Lima Metropolitana sin datos confirmados.

## 2. Qué se revisó y qué sabemos

- Código real: `components/public.tsx`, `components/quote.tsx`, `components/quote-cta.tsx`, `components/quote-cart-dialog.tsx`, `components/quote-cart-provider.tsx`, `components/photo.tsx`, `app/globals.css`, `data/demo.ts`, `data/defaults.ts` y `lib/whatsapp-message.ts`.
- Documentos de contexto, contratos, estado y bitácora del plan. La decisión de arquitectura estática y las últimas instrucciones del usuario prevalecen sobre referencias históricas a servidor o base de datos.
- Navegador local: portada, clic «Cotizar un buffet», formulario inicial y ficha de buffet. Inspección visual en escritorio de 1440 × 900 y formulario móvil de 390 × 844; también se observó la cabecera compacta en el ancho inicial del panel.
- No hay estudio con clientes, datos de abandono ni medición de conversiones. Las prioridades son una evaluación experta sustentada en código y observación, no porcentajes de mejora demostrados.
- No se probó el envío a WhatsApp ni la pertenencia de cuentas. No se realizó en este análisis una auditoría completa de accesibilidad, velocidad o dispositivos físicos.

## 3. Diagnóstico priorizado

P0: corregir antes de captar solicitudes con el recorrido nuevo. P1: parte de la primera entrega visual. P2: mejora posterior.

| ID | Prioridad / tipo | Hallazgo y evidencia | Propuesta y aceptación |
|---|---|---|---|
| UX01 | P0 / conversión | El hero dice «Cotizar un buffet», pero `Hero` no entrega `entryId` a `QuoteCta`. El clic local abrió `/cotizar` con «Necesito orientación». | El CTA de buffet selecciona ese servicio de forma explícita; el genérico pide elegir. Si ya existe otro principal, añadir buffet no lo reemplaza silenciosamente. |
| UX02 | P0 / coherencia | `quote.tsx` tiene selección y extras propios además de la bolsa. Con bolsa activa, `chosen` y `addons` usan la bolsa, aunque los selectores continúan editando el estado del formulario. | Una sola selección compartida. Cambiar servicio o complementos actualiza bolsa, resumen y destino de forma consistente. |
| UX03 | P0 / integridad | La bolsa edita cantidad y opciones; `WhatsAppMessageInput` sólo recibe títulos, invitados y datos generales. Las cantidades y opciones de cada línea no pasan al mensaje. | Mensaje y revisión muestran cada línea con cantidad, unidad y opciones. No perder elecciones ni confundir invitados con unidades. |
| UX04 | P0 / reglas | `add()` inicia en cantidad 1; buffet está configurado con mínimo 20. `canContinue` en el diálogo sólo exige principal y sus controles no están en un formulario con validación al continuar. | Estado inicial válido según reglas confirmadas; validación por línea antes del enlace final. No convertir mínimos simulados en barreras comerciales. |
| UX05 | P1 / móvil | Dos botones sólidos, «Cotizar mi evento» y «Revisar bolsa», apilan altura y compiten en la cabecera. Observado en móvil. | Cabecera compacta: marca, acceso discreto «Mi evento (n)» y menú. Una acción dominante en el contenido. |
| UX06 | P1 / información | El explorador enumera seis tipos del modelo, incluyendo cobertura y páginas; «Buffet y menús» enlaza únicamente a `/servicios`. | Navegación por necesidad del cliente; buffet y menú criollo visibles juntos, conservando URLs de fichas. |
| UX07 | P1 / lenguaje | «Continuar a datos de contacto» contradice el formulario sin contacto. Hay «Mínimo: 1 unidades», «Mínimo configurado» y textos sobre base de datos. | «Continuar con mi evento», unidades correctas y lenguaje de cliente. La arquitectura queda fuera del recorrido comercial. |
| UX08 | P1 / cierre | Revisión, «Revisar resumen», «Preparar conversación» y resultado repiten el cierre; el enlace de WhatsApp aparece también antes del resultado. | Una pantalla de revisión y una acción final «Abrir WhatsApp». Aclaración breve: el usuario decide si envía. |
| UI01 | P1 / identidad | Crema `#FAF8F1`, terracota `#A74326`, Georgia y fotografía nocturna de banquete dominan la portada. | Blanco, jade y una dirección fotográfica diurna y cotidiana. Hipótesis a validar: se percibirá más limpia y cercana. |
| UI02 | P1 / catálogo | Tres imágenes se reutilizan para nueve ofertas; una foto de detalles representa sillas, menaje, flores y polos. | Una imagen específica por familia o servicio. No hacer pasar una composición decorativa por foto de un producto concreto. |
| UI03 | P1 / confianza | El aviso global de IA está condicionado a `settings.demo`, actualmente falso. Los captions sólo se muestran donde la plantilla los renderiza, por ejemplo en galería. | Aviso «Imagen referencial» junto a las imágenes de IA usadas en portada y fichas, con explicación accesible. No basta con guardarlo en los datos. |
| UI04 | P1 / ficha | En la ficha móvil, el proceso extenso aparece antes del CTA específico; después se despliegan muchas relaciones como catálogos completos. | Propuesta y CTA temprano; inclusiones compactas; hasta tres recomendaciones pertinentes y enlace a más opciones. |
| UI05 | P2 / mantenimiento | CSS global, reglas de administración y múltiples sobrescrituras públicas comparten archivo; hay animaciones de entrada por tarjetas. | Tokens semánticos y estilos por componente; animación breve sólo para explicar acciones. Retirar CSS obsoleto después de inventariar usos. |
| UI06 | P1 / navegación | El footer mantiene «Administración» aunque el proyecto ya no usa CMS. | Retirar ese enlace del recorrido público; no añadir panel ni modificar la arquitectura. |

Conservar: catálogo versionado, separación de responsables, precios por consulta, enlaces explícitos de WhatsApp, estructura de encabezados, texto alternativo, foco visible, soporte de movimiento reducido y bolsa temporal.

## 4. Sistema visual especificado

### Paleta principal

| Token propuesto | Color | Uso |
|---|---|---|
| `--surface` | `#FFFFFF` | Fondo principal, formularios, espacio libre. Aproximadamente 70 % de las superficies. |
| `--surface-soft` | `#EDF5F1` | Bloques de proceso, resumen y cobertura. Aproximadamente 20 %. |
| `--brand` | `#176459` | CTA principal, enlaces y foco. Presencia contenida. |
| `--text` | `#203832` | Títulos y texto principal. |
| `--text-muted` | `#52655F` | Texto secundario legible; nunca gris excesivamente tenue. |
| `--accent` | `#F4D77A` | Pequeños detalles que recuerden el color de la comida. Sin texto blanco encima. |

Tokens funcionales adicionales: borde de campo `#758B83`, divisor decorativo `#D7E4DD`, error `#A32635`. El estado no dependerá sólo del color: también llevará texto o icono con nombre accesible.

Contrastes calculados sobre colores sólidos: jade/blanco 6.99:1; texto/blanco 12.55:1; secundario/blanco 6.20:1; texto/verde suave 11.32:1; texto/amarillo 8.87:1. No equivalen a una auditoría de todos los estados. Para texto normal se exigirá 4.5:1 y para texto grande 3:1, conforme a [W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### Tipografía

- **Lora 500**, títulos y marca: serenidad, presencia y un carácter editorial moderado. No usar cursiva para destacar una palabra suelta.
- **Source Sans 3 400/600**, cuerpo, navegación, precios y controles: lectura clara y ritmo cercano. Números y cantidades fáciles de distinguir.
- Implementación futura con archivos WOFF2 locales, licencia conservada, `font-display: swap` y subconjunto latino con español. Dos familias y pocos pesos; sin dependencia de Google Fonts en producción.
- La lámina usa Georgia y Arial como sustitutos locales: muestra composición y paleta, no una prueba exacta de las fuentes propuestas.

| Elemento | Escritorio | Móvil | Regla |
|---|---|---|---|
| H1 | 52–60 px / 1.10 | 34–38 px / 1.15 | Máximo tres líneas deseadas, sin cortes manuales rígidos. |
| H2 | 34–40 px / 1.20 | 27–30 px / 1.25 | Jerarquía consistente. |
| H3 | 22–24 px / 1.30 | 21–22 px / 1.30 | Título de servicio. |
| Cuerpo | 18 px / 1.60 | 16–18 px / 1.60 | 55–70 caracteres por línea. |
| Controles | 16 px / 1.40 | 16 px / 1.40 | Peso 600; etiquetas permanentes. |
| Ayuda | 14 px / 1.50 | 14 px / 1.50 | Reservada a información secundaria. |

Referencias de las familias: [Lora](https://fonts.google.com/specimen/Lora) y [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3).

### Composición y componentes

Ancho máximo 1200 px, márgenes 48 px en escritorio y 20 px en móvil. Ritmo de espacio 8/12/16/24/32/48/64/88 px. Párrafos y encabezados alineados a la izquierda; no justificar. Bordes de 8 px en controles y 12 px en imágenes, sin redondear todo como pastillas. Sombras sólo cuando expliquen superposición, como un diálogo.

Hero: texto y fotografía con protagonismo equilibrado. No superponer párrafos sobre comida. En móvil: título, explicación, CTA, foto. El botón debe aparecer antes de una imagen alta. Una fotografía de mesa compartida será el gesto distintivo, sin grandes arcos decorativos ni etiquetas flotantes.

Acción primaria sólida jade; secundaria con borde o enlace subrayado. No dos botones sólidos adyacentes con la misma importancia. En catálogo: «Ver detalles» y «Añadir a mi evento» con roles distintos. Una tarjeta seleccionada dice «Añadido» y ofrece revisar o quitar; no añade cantidades accidentalmente al repetir el clic.

## 5. Nueva arquitectura de la portada

1. **Cabecera:** Catering Gladis; Buffet y menús; Servicios para eventos; Cómo cotizar; Mi evento. La marca vuelve al inicio; Nosotros y cobertura pueden estar en el pie.
2. **Hero:** mensaje principal, Lima Metropolitana, precio por consulta, «Cotizar un buffet» y enlace «Ver servicios para eventos».
3. **Buffet y menús:** módulo protagonista con buffet y alternativa criolla; comida, modalidad a coordinar y acceso a ficha. Resolver la actual separación entre `/servicios` y `/menus` mediante una vista conjunta, sin inventar nuevas rutas en esta fase.
4. **Servicios para eventos:** tres familias visibles. Atención y bebidas: bartender y mozos. Alquileres: menaje y sillas. Detalles y personalizados: flores, recuerdos y polos. Son grupos de navegación, no responsables de WhatsApp.
5. **Cómo cotizar:** elegir, contar el evento, revisar y conversar. Tres pasos breves; no reserva ni pago automático.
6. **Celebraciones y cobertura:** cumpleaños/reuniones familiares, bodas y eventos de empresa con el mismo cuidado visual; todo Lima Metropolitana. No segmentar por nivel económico ni distritos supuestamente premium.
7. **Preguntas frecuentes:** precios, contratación independiente, disponibilidad y logística. Respuestas breves, sin promesas de mínimos inventadas.
8. **Cierre:** «Cuéntanos qué estás organizando» y «Armar mi evento». Pie con contacto por especialidad, privacidad e información real.

```text
ESCRITORIO
[Marca] [Buffet y menús] [Servicios] [Cómo cotizar] [Mi evento]
[Título / explicación / acción] [Mesa compartida luminosa]
[Buffet protagonista                     ] [Menú criollo]
[Atención y bebidas] [Alquileres] [Detalles y personalizados]
[Cómo cotizar: elegir / contar / conversar]
[Ocasiones y cobertura] [Preguntas]
[Invitación final] [Pie de página]

MÓVIL
[Marca] [Mi evento (n)] [Menú]
[Título]
[Explicación corta]
[Cotizar un buffet]
[Foto + aviso referencial]
[Buffet y menú criollo]
[Familias de servicios, una tras otra]
[Proceso / cobertura / preguntas / cierre]
```

Comparación resuelta: se descarta una portada con mosaico de nueve servicios al mismo nivel porque diluye el buffet; también se descarta el hero de lujo con vídeo porque encarece carga y puede sugerir exclusividad. Se elige buffet protagonista y complementos organizados por necesidad.

## 6. Recorrido de cotización propuesto

**Entrada específica:** el servicio ya aparece seleccionado. **Entrada genérica:** elegir servicio antes de pedir datos de evento. También debe ser posible cotizar sólo sillas o recuerdos; «complemento» no significa contratación obligatoria del buffet.

Tres etapas reales:

1. **Tu selección:** servicios, principal y extras, cantidades con unidades, opciones relevantes. Renombrar «bolsa» como «Mi evento». Explicar principal: «Este servicio determina quién coordinará tu consulta».
2. **Tu evento:** tipo, fecha, distrito e invitados cuando corresponda. Presupuesto opcional con ayuda «Nos ayuda a proponerte opciones». Renombrar el campo condicional «Cuéntanos qué celebras» para evitar dos etiquetas iguales. Proponer «Aún por definir» en fecha/cantidad sólo después de adaptar el contrato y acordar qué datos son imprescindibles; no fingir que ya está disponible.
3. **Revisa y conversa:** una revisión editable, nombres, cantidades y opciones exactos; área y teléfono destinatarios visibles; botón único «Abrir WhatsApp». Debajo: «Se abrirá un mensaje preparado. Tú decides si lo envías. La disponibilidad se confirma al conversar».

Resumen compacto y desplegable en móvil; a la derecha en escritorio. Sin precios calculados ni total S/ 0. Mostrar «Precio por consulta» una vez y las condiciones específicas donde sean necesarias.

Si el cliente aún no sabe qué servicio necesita, ofrecer dos áreas claramente descritas para que elija con quién conversar. No enviar automáticamente al teléfono global ni crear una oferta ficticia para resolver el vacío.

### Contratos que deben conservarse

| Principal | Destino configurado |
|---|---|
| Buffet, comida, bartender o menaje | Cocina, bartender y menaje: +51 902 843 481 |
| Mozos, sillas, flores, recuerdos o polos | Complementos y producción: +51 923 106 197 |

Los extras no cambian el destinatario. Cambiar el principal es explícito; retirarlo obliga a elegir otro. Los teléfonos siguen en `config/business-contacts.ts`, no copiados a componentes.

Conservar ruta de llegada, primer contenido/CTA de adquisición, UTM saneadas y último punto de interacción en la sesión. Cambiar de servicio no reescribe el origen inicial. No afirmar que esa atribución llega al operador o se guarda en servidor: cualquier ampliación del mensaje debe definirse expresamente y mantener saneamiento y privacidad.

Mensaje propuesto: evento, fecha, distrito, invitados, servicio principal, cada extra con su cantidad/unidad/opciones y presupuesto si se proporciona. Comparar texto visible y URL codificada; nunca abrir WhatsApp durante las pruebas automatizadas.

## 7. Fotografía, confianza y contenido

La imagen actual puede acompañar la transición; no es la dirección final recomendada. Preparar una foto hero horizontal de buffet diurno, vajilla blanca, comida reconocible y mesa bien cuidada en un entorno realista. Incluir escenas de reuniones familiares y empresa, además de bodas. No depender de salones lujosos para transmitir calidad.

Crear después imágenes específicas para bartender, mozos, menaje, sillas, flores, recuerdos y polos. No generar testimonios, personal identificado, locales propios, certificaciones, cifras de clientes o eventos realizados. Imágenes de IA: identificadas como referenciales; fotos propias autorizadas podrán sustituirlas progresivamente.

Para confianza inmediata usar hechos: cobertura, oferta clara, dos áreas de atención, proceso comprensible y condiciones antes de confirmar. No usar «para todos los bolsillos» si no existe garantía comercial. Copy sugerido: «Elige lo que necesitas para tu evento» y «Conversemos sobre tu idea y presupuesto».

## 8. Frontend y SEO: alcance de implementación futura

Archivos existentes a intervenir: `app/globals.css` (tokens y composición), `components/public.tsx` (cabecera, portada, fichas), `data/demo.ts` y `data/defaults.ts` (contenido y vocabulario), `components/quote-cta.tsx` y `components/quote-cart-provider.tsx` (selección coherente), `components/quote.tsx` y `components/quote-cart-dialog.tsx` (recorrido), `lib/whatsapp-message.ts` (líneas completas), `components/photo.tsx` (tratamiento y avisos), pruebas de comercio existentes.

Archivos sólo propuestos, todavía inexistentes: `components/event-selection.tsx`, `components/quote-review.tsx`, `components/service-family-nav.tsx` y `public/fonts/`. Extraer componentes sólo si reduce duplicación; no crear otra aplicación ni un CMS.

Conservar slugs actuales de servicios y enlaces compartidos. H1 único, títulos y descripciones por servicio y cobertura, canonical limpio, sitemap y robots coherentes con el dominio publicado. No crear decenas de páginas vacías por distrito. No generar ofertas de precio cero en datos estructurados ni dirección ficticia. Verificar SEO después del render, no sólo en configuración.

Imágenes con variantes reales (por ejemplo 480/768/1280), dimensiones y `sizes` acordes al diseño. Sólo hero con prioridad; resto diferido. La prueba actual de bytes es útil, pero no mide velocidad percibida: presupuestar imágenes, fuentes y JavaScript y medir sobre build de producción.

## 9. Plan para aplicar después

| Entrega | Contenido | Puerta de aceptación |
|---|---|---|
| A. Flujo fiable | UX01–04 y UX08, una selección compartida, mensaje completo y contactos | Buffet + sillas conserva cocina; sillas + buffet conserva complementos; cambio explícito funciona; opciones y cantidades llegan al texto; inválidos bloquean con explicación. |
| B. Identidad y cabecera | Paleta, fuentes locales, jerarquía, botones, móvil | Una acción dominante, cabecera compacta, lectura y foco comprobados. |
| C. Portada y catálogo | Orden propuesto, menú criollo accesible, nueve servicios descubribles | Cliente encuentra buffet y cualquier servicio independiente sin conocer el modelo editorial. |
| D. Fichas e imágenes | CTA temprano, contenido conciso, imágenes específicas y aviso IA | Identificación visual correcta; fallo de imagen no bloquea contacto; no promesas inventadas. |
| E. Cotizador y microcopy | Tres etapas, resumen único, estados vacíos/error/selección, unidades correctas | Texto del botón coincide con acción; sin pantallas redundantes ni referencias técnicas. |
| F. Verificación integral | Calidad, accesibilidad, SEO y rendimiento reproducible | Matriz cumplida y evidencia guardada; pendientes explícitos antes de actualizar 19, 27–29. |

No se necesita aprobar cada ajuste menor una vez autorizado el conjunto. La próxima acción propuesta es aplicar A–B, verificar y continuar C–F dentro del alcance que se autorice. Esta auditoría no altera los estados históricos HECHO: identifica regresiones o carencias que deberán revisarse en la implementación.

## 10. Qué significará «10 de 10»

Objetivo verificable, no una nota que se obtiene con una nueva paleta:

- Una persona entiende qué se ofrece, dónde y cómo consultar al ver la portada. Validación futura con cinco participantes de distintos niveles de familiaridad digital: al menos cuatro identifican esos tres puntos sin explicación.
- Los mismos participantes pueden seleccionar buffet o un servicio independiente, añadir un extra, revisar y localizar WhatsApp sin ayuda. Registrar fallos y corregir; no se han realizado estas sesiones.
- Recorridos por responsable, cambio de principal, borrador corrupto/vencido, almacenamiento bloqueado y regreso entre páginas conservan coherencia. Probar sin enviar mensajes.
- 320, 360, 390, 768, 1024 y 1440 px; zoom 200 %; teclado, foco inicial/retorno/Escape, lector de pantalla y movimiento reducido. Sin contenido tapado por controles fijos.
- Contraste WCAG 2.2 AA, etiquetas asociadas, errores concretos, foco visible. Objetivo propio de controles táctiles: 44 × 44 px. WCAG 2.2 AA establece 24 × 24 con excepciones; no confundir ambos criterios.
- Medición de laboratorio repetible: tres ejecuciones móviles en producción con misma configuración, registrar mediana y condiciones. Objetivos de proyecto: LCP ≤ 2.5 s y CLS ≤ 0.1; no declararlos logrados ni afirmar métricas de campo en esta propuesta.
- Tipos, lint, comercio, seguridad, imágenes y build pasan; pruebas visuales y de interacción completan lo que la suite no cubre. Indexación habilitada no garantiza posición en Google ni ventas.

Fuentes de accesibilidad: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [tamaño de objetivos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## 11. Autocrítica de la propuesta

Blanco y verde pueden recordar una clínica si la comida desaparece. Por eso la fotografía compartida y el lenguaje de cocina llevan la personalidad. Lora no debe ocupar formularios ni producir títulos excesivamente largos. El acento amarillo se reserva a detalles, sin adornar cada sección. La lámina no sustituye el futuro prototipo del cotizador ni las pruebas con personas. La percepción de cercanía y elegancia es una hipótesis de diseño que se deberá validar.

