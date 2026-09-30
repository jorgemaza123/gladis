# Datos y decisiones que el código no debe inventar

Los faltantes no impiden desarrollar y probar con fixtures aislados; sí pueden impedir activar una línea o publicar. Ningún plazo transcurrido equivale a respuesta.

| Dato | Estado | Uso y puerta |
|---|---|---|
| Teléfono WhatsApp de cocina/bar | PENDIENTE | Necesario antes de activar contacto real de cocina en tareas 26–28. Nunca reutilizar Jorge por defecto. |
| Teléfono Jorge | REQUIERE CONFIRMACIÓN | El registro histórico indica 902843481, mientras `config/business-contacts.ts` activo contiene 51902843481. Confirmar un único número antes de activar oferta o publicación; no usar uno como fallback del otro. |
| Nombre/marca definitiva | Pospuesto por usuario | Mantener provisional en desarrollo; confirmar identidad pública antes de lanzamiento comercial. |
| Dominio y proveedor de alojamiento | PENDIENTE | Preparar runbook reversible; no contratar servicios ni publicar por crear estos documentos. |
| URL de web DTF/sublimación | PENDIENTE | Enlace configurable, no inventar dominio. tarea 15 funciona con enlace ausente. |
| Oferta por responsable | Cocina: comida/buffet/catering/bartender; Jorge: sillas/toldos/decoración/personalizados | Confirmar entradas existentes por ID y nuevas propuestas reales; no clasificar por búsqueda de palabras. |
| Modelos, cantidades mínimas, horarios, precios y logística | PENDIENTE | Datos de oferta, no promesas predeterminadas. Cotización a medida es válida. |
| Cobertura/traslado por zona | Intención: Lima Metropolitana | No afirmar entrega gratuita/disponibilidad incondicional ni añadir Callao sin confirmación. |
| Fotos propias y permiso de publicación | PENDIENTE | Sustituir demo; no usar imágenes generadas como prueba de trabajos reales. |
| Contacto de privacidad, conservación, aviso y responsabilidades | PENDIENTE | Validación comercial/legal aplicable; checkbox no demuestra cumplimiento completo. |
| Emails/servicio para avisos automáticos | PENDIENTE | Aviso in-app local primero; integración externa sólo configurada y probada. Enlaces wa.me no son notificación automática. |
| Presupuesto/credenciales del proveedor | PENDIENTE | No incluir secretos en Git, logs ni capturas. |
| Responsables de atención y tiempos prometidos | PENDIENTE | Acordar quién consulta solicitudes guardadas sin WhatsApp y coordina extras de la otra persona. |

Cuando llegue un dato, registrar fuente y fecha aquí. El ejecutor continúa tareas independientes; no activa un destino falso. Para pruebas WhatsApp sustituir navegación externa por stub; no mandar mensajes a teléfonos reales.
