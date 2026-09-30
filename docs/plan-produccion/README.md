# Plan secuencial para completar la web de eventos

> Arquitectura vigente: [web estática sin base de datos](ARQUITECTURA-ESTATICA.md). Esta decisión sustituye cualquier instrucción posterior del plan que mencione D1, Drizzle, R2, migraciones, CMS, APIs de administración o persistencia de solicitudes/eventos.

29 tareas pequeñas, con contratos y pruebas. Elaborado desde el código real el 2026-09-18. No se ha implementado ninguna función por generar esta carpeta.

## Cómo ejecutar

La raíz del repositorio es `C:/Users/jorge/Desktop/plataforma_web_catering_gladis/web`, no su carpeta superior.
1. Leer [CONTEXTO](CONTEXTO.md), [CONTRATOS](CONTRATOS.md), [ESTADO](ESTADO.md) y la tarea pendiente.
2. Ejecutar una tarea numerada por vez. Cada archivo es un encargo completo, con alcance y aceptación. No ejecutar todo el plan en una sola respuesta.
3. Inspeccionar archivos y exportaciones reales antes de editar. Una ruta POR CREAR es propuesta, no prueba de que ya existe.
4. Al terminar, actualizar [BITACORA](BITACORA.md) y ESTADO con comandos, resultados, interfaces reales y siguiente paso.
5. No avanzar si un prerrequisito técnico está roto. Un dato externo faltante permite trabajo independiente, pero no aprobar tareas dependientes ni cerrar producción.
6. El modelo/entorno elegido debe inspeccionar y probar; el plan reduce ambigüedad, no garantiza que un modelo específico sea infalible.

Prompt para empezar:
```text
Trabaja en web/. Lee docs/plan-produccion/README.md, CONTEXTO.md,
CONTRATOS.md y ESTADO.md. Ejecuta sólo la tarea 01 indicada en el índice.
Verifica el código existente antes de importar funciones. Cumple sus pruebas,
actualiza BITACORA.md y ESTADO.md y deja el traspaso a la siguiente tarea.
No implementes tareas futuras ni publiques por completar este encargo.
```
Prompt para continuar:
```text
Lee docs/plan-produccion/ESTADO.md y la última entrada de BITACORA.md.
Ejecuta la siguiente tarea cuyos prerrequisitos estén comprobados.
Lee sus contratos y archivos reales; conserva compatibilidad.
Registra las pruebas y entrega la siguiente tarea exacta. No inventes
archivos, APIs, datos del negocio ni resultados de pruebas.
```

## Regla del negocio

El servicio principal decide quién recibe TODO el mensaje. Los extras quedan identificados y no cambian el destinatario. Cocina/buffet/catering/bartender → cocina; alquileres/toldos/sillas/decoración/personalizados → Jorge. Asignación explícita por datos.
Teléfonos en una sola fuente de configuración futura; Jorge ya proporcionado, cocina pendiente. Detalle en CONTRATOS C1.
Esto es una bolsa de cotización, sin pagos ni reservas confirmadas automáticamente.

| Entrada y selección | Destino esperado | Origen conservado |
|---|---|---|
| Buffet principal + sillas + decoración | Cocina | Buffet |
| Sillas principal + buffet + bartender | Jorge | Sillas |
| Regalos principal + comida | Jorge | Regalos |
| Bartender principal + regalos | Cocina | Bartender |
| Entró por sillas, cambia expresamente principal a buffet | Cocina | Sillas |
| Añade buffet como extra sin cambiar sillas principal | Jorge | Sillas |
| Quita el principal | Sin enlace hasta escoger otro | Original |
| Cocina sin teléfono configurado | Sin enlace ni fallback a Jorge | Original |
| Botón genérico sin oferta | Elegir principal antes de continuar | Ruta/CTA inicial |
| Reintenta tras timeout | Misma solicitud, sin duplicar | Snapshot original |
| Abre WhatsApp y no envía | Sólo clic, no mensaje enviado | Contexto de clic |

## Secuencia

- [01. Fijar base reproducible y aislar pruebas mutantes](01-base-y-pruebas-seguras.md)
- [02. Centralizar los dos contactos comerciales](02-contactos-centralizados.md)
- [03. Modelar ofertas, propietarios y reglas por datos](03-ofertas-cotizables-y-responsables.md)
- [04. Añadir contrato V2 y lectura compatible de solicitudes](04-contrato-carrito-v2.md)
- [05. Resolver catálogo, compatibilidad y responsable en servidor](05-motor-validacion-y-destinatario.md)
- [06. Persistir solicitudes V2 con compatibilidad e idempotencia](06-persistencia-api-cotizacion-v2.md)
- [07. Crear bolsa de cotización persistente entre páginas](07-estado-carrito-persistente.md)
- [08. Capturar origen inicial y contexto de cada CTA](08-atribucion-origen.md)
- [09. Registrar eventos de CTA sin bloquear ventas](09-eventos-de-botones.md)
- [10. Construir modal de revisión de la bolsa](10-modal-bolsa-accesible.md)
- [11. Crear mensaje y salida WhatsApp después de guardar](11-mensaje-whatsapp-y-confirmacion.md)
- [12. Conectar todos los botones y formulario al recorrido V2](12-integracion-ctas-y-cotizador.md)
- [13. Recomendar servicios compatibles con tarjetas visuales](13-recomendaciones-visuales.md)
- [14. Clarificar portada, categorías y navegación comercial](14-portada-y-navegacion.md)
- [15. Completar fichas de servicios y conexión con personalizados](15-fichas-comerciales-y-personalizados.md)
- [16. Conectar ocasiones y cobertura de Lima Metropolitana](16-ocasiones-y-cobertura-lima.md)
- [17. Corregir SEO técnico y señales de indexación](17-seo-canonicos-rastreo.md)
- [18. Medir y optimizar rendimiento de la experiencia pública](18-imagenes-y-rendimiento.md)
- [19. Cerrar revisión de teclado, accesibilidad y móvil](19-accesibilidad-y-responsive.md)
- [20. Endurecer los nuevos puntos de entrada y privacidad](20-seguridad-privacidad-y-abuso.md)
- [21. Mostrar origen, responsable y embudo a los dos operadores](21-indicadores-y-seguimiento.md)
- [22. Evitar solicitudes guardadas sin atención](22-avisos-fiables-y-operacion.md)
- [23. Preservar autonomía de los datos sin ampliar el CMS](23-compatibilidad-editorial-minima.md)
- [24. Automatizar regresión y comprobaciones en CI](24-regresion-y-ci.md)
- [25. Preparar entorno de ensayo y procedimiento de recuperación](25-entorno-staging-y-recuperacion.md)
- [26. Completar datos reales y validar la oferta antes de indexar](26-datos-reales-y-puerta-comercial.md)
- [27. Validar recorridos reales en el entorno de ensayo](27-aceptacion-integral.md)
- [28. Publicar sólo en destino autorizado y verificar captación](28-publicacion-controlada.md)
- [29. Evaluar calidad demostrada y entregar operación](29-evaluacion-final-y-traspaso.md)

## Documentos de referencia

- [Contexto y archivos existentes](CONTEXTO.md)
- [Contratos de datos, responsables y tracking](CONTRATOS.md)
- [Datos pendientes del negocio](DATOS-PENDIENTES.md)
- [Criterios de calidad por ámbito](CRITERIOS-10-DE-10.md)
- [Matriz de 35 pruebas de aceptación](MATRIZ-DE-PRUEBAS.md)
- [Estado de ejecución](ESTADO.md)
- [Bitácora y plantilla de traspaso](BITACORA.md)

No hay nota final aprobada por anticipado. Un teléfono pendiente, destinatario incorrecto, fuga de datos o prueba fallida impide declarar el área 10/10. La publicación es una etapa condicionada a destino y autorización reales.
