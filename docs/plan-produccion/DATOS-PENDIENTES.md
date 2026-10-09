# Datos y decisiones que el código no debe inventar

Los faltantes no impiden desarrollar y probar con fixtures aislados; sí pueden impedir activar una línea o publicar. Ningún plazo transcurrido equivale a respuesta.

| Dato | Estado | Uso y puerta |
|---|---|---|
| Teléfono WhatsApp de cocina/bar/menaje | CORREGIDO Y CONFIRMADO 2026-10-09 por el usuario | Local `923106197`; la configuración usa `51923106197` para el enlace internacional de WhatsApp. Atiende comida, buffet, bartender y menaje; no se usa como fallback para otros servicios. |
| Teléfono WhatsApp de complementos y producción | CORREGIDO Y CONFIRMADO 2026-10-09 por el usuario | Local `902843481`; la configuración usa `51902843481` para el enlace internacional de WhatsApp. Atiende mozos, sillas, flores, recuerdos y polos; no se usa como fallback para cocina. |
| Nombre/marca definitiva | Confirmado: Gladys | El usuario confirmó el nombre público y entregó el logo oficial el 2026-10-06. |
| Dominio y proveedor de alojamiento | URL operativa confirmada | `https://gladis-vr6r.vercel.app` es la URL pública actual. Un dominio propio puede reemplazarla después sin cambiar el catálogo. |
| URL de web DTF/sublimación | PENDIENTE | Enlace configurable, no inventar dominio. tarea 15 funciona con enlace ausente. |
| Oferta por responsable | Cocina: comida/buffet/catering/bartender; Jorge: sillas/toldos/decoración/personalizados | Confirmar entradas existentes por ID y nuevas propuestas reales; no clasificar por búsqueda de palabras. |
| Modelos, cantidades mínimas, horarios, precios y logística | Cotización por WhatsApp | Todos los precios quedan «a consulta por WhatsApp». Se mantienen mínimos referenciales de catálogo y no se prometen horarios, traslado ni disponibilidad. |
| Cobertura/traslado por zona | CONFIRMADO 2026-10-01 por el usuario | Todo Lima Metropolitana. No se promete traslado gratuito ni disponibilidad incondicional; Callao no se incluye. |
| Fotos propias y permiso de publicación | PENDIENTE | Sustituir demo; no usar imágenes generadas como prueba de trabajos reales. |
| Contacto de privacidad, conservación, aviso y responsabilidades | PENDIENTE | Validación comercial/legal aplicable; checkbox no demuestra cumplimiento completo. |
| Emails/servicio para avisos automáticos | PENDIENTE | Aviso in-app local primero; integración externa sólo configurada y probada. Enlaces wa.me no son notificación automática. |
| Presupuesto/credenciales del proveedor | PENDIENTE | No incluir secretos en Git, logs ni capturas. |
| Responsables de atención y tiempos prometidos | PENDIENTE | Acordar quién consulta solicitudes guardadas sin WhatsApp y coordina extras de la otra persona. |

La asignación vigente de teléfonos fue corregida y confirmada por el usuario el 2026-10-09; cobertura y política de precios se confirmaron el 2026-10-01. Para pruebas WhatsApp se sustituye la navegación externa por un stub; no se mandan mensajes a teléfonos reales.
