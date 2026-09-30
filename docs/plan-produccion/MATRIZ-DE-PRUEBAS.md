# Matriz de regresión y aceptación

Todos los escenarios usan datos de prueba aislados y navegación WhatsApp interceptada. Una prueba nunca envía mensajes a los números reales. Cada implementación registra resultado, commit y entorno en BITACORA. No están aprobadas por estar escritas aquí.

| ID | Acción / condición | Resultado exigido |
|---|---|---|
| R01 | Buffet principal + sillas y decoración | Responsable cocina; buffet identificado como principal y extras separados |
| R02 | Sillas principal + buffet y bartender | Responsable eventos/Jorge; no cambia por añadir comida |
| R03 | Bartender principal + regalos | Responsable cocina |
| R04 | Regalos solos | Responsable eventos; cantidad y opciones conservadas |
| R05 | Toldos solos | Responsable eventos; cotización sin obligar a contratar comida |
| R06 | Entró por sillas y cambia principal a buffet | Destino cocina; adquisición original sigue siendo sillas |
| R07 | Quita sólo un extra | Principal/destinatario intactos |
| R08 | Quita la línea principal | Pide seleccionar sustituta; no genera WhatsApp hasta elegir |
| R09 | Botón genérico de header/footer sin bolsa | Pide oferta principal; no usa teléfono global |
| R10 | Contacto de cocina null/inactivo | Guarda si procede con diagnóstico; no crea enlace ni envía a Jorge |
| R11 | Cambia teléfono central del mismo responsable | Todos los nuevos enlaces usan el nuevo dato; historial de propiedad preservado |
| R12 | Cliente falsifica teléfono, owner o precio | Servidor rechaza/ignora autoridad ajena y resuelve contra catálogo |
| R13 | Oferta despublicada después de agregarla | Error de esa línea y resto de bolsa conservado |
| R14 | Opción retirada o cantidad fuera de límites | Error asociado; no genera enlace con datos inválidos |
| R15 | Agrega misma oferta con mismas opciones | Una línea, cantidad fusionada dentro del máximo |
| R16 | Misma oferta con variantes diferentes | Dos líneas distinguibles; principal apunta a itemId exacto |
| R17 | Doble clic / timeout y reintento idéntico | Una fila y referencia; una conversión quote_saved |
| R18 | Mismo requestId con payload distinto | 409, sin sobrescribir solicitud previa |
| R19 | Cambia dueño en catálogo después de guardar | Reintento mantiene dueño acordado en snapshot; no reasigna historial |
| R20 | Vuelve de modal y navega/recarga | Bolsa y adquisición según TTL; PII sólo en memoria de interacción, no persistida |
| R21 | Storage corrupto, bloqueado o caducado | Recuperación segura; aplicación usable en memoria |
| R22 | UTM/referrer con teléfono, correo o URL peligrosa | Valor omitido/saneado; no llega PII a métricas ni mensaje |
| R23 | Rechaza analítica opcional | Bolsa y cotización funcionan; no se emiten eventos opcionales |
| R24 | Endpoint métricas falla o adblock | Botón sigue funcionando; no mostrar tasa como conteo exhaustivo de personas |
| R25 | Abre WhatsApp y cancela mensaje | Sólo whatsapp_open_clicked; nunca enviado/entregado/venta |
| R26 | Falla guardar en DB | Error genérico, datos en memoria conservados; sin falsa referencia ni enlace normal |
| R27 | Cotización anterior V1 | Sigue visible y exportable; origen desconocido, no inventado |
| R28 | Visita catálogo con pagina=2 o UTM | Canonical/política de índice conforme a tarea 17; UTM no vuelve noindex una landing útil |
| R29 | Modal con teclado y 320px | Foco contenido/retornado, cierre accesible, sin desbordes ni fondo interactivo |
| R30 | Prueba mutante apunta dominio productivo | Aborta antes de login/fetch/escritura |
| R31 | API de métricas/lista/detalle sin sesión | No filtra solicitudes ni datos operativos |
| R32 | Restaura backup en entorno aislado | Reaparecen registros e imágenes y mantienen referencias |
| R33 | Una oferta nueva tiene propietario y reglas en datos | Se integra a botones/bolsa/destino sin tocar componentes |
| R34 | Menú para parte de los invitados | Cantidad de línea e invitados generales se conservan sin igualarlos por suposición |
| R35 | Falla aviso interno/externo | Solicitud persistida y pendiente visible; no marca aviso entregado |

Relacionar cada test con su implementación real. Las pruebas puras se distribuyen entre02–09; UI y mensaje entre10–20; integración24/27. Publicación28 usa checks no destructivos y un ensayo humano acotado autorizado, nunca todo este conjunto sobre producción.
