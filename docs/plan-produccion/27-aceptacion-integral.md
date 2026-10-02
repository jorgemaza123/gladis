# 27. Validar recorridos reales en el entorno de ensayo

Estado: TODO. Los datos comerciales ya están cargados localmente; falta desplegar este commit y realizar la aceptación humana. Anterior: [26. Completar datos reales y validar la oferta antes de indexar](26-datos-reales-y-puerta-comercial.md). Siguiente: [28. Publicar sólo en destino autorizado y verificar captación](28-publicacion-controlada.md).

## Objetivo

Documentar una aceptación humana de la web estática en una URL HTTPS de ensayo, sin publicar, enviar WhatsApps ni atribuir capacidades de servidor inexistentes.

## Alcance vigente

El sitio tiene contenido versionado, bolsa y atribución temporal por pestaña, y prepara un enlace de WhatsApp que la persona visitante decide abrir. No hay API, solicitudes guardadas, referencias, cuentas de operador, métricas persistentes, avisos, sincronización entre usuarios, recuperación de registros ni base de datos.

La [matriz histórica](MATRIZ-DE-PRUEBAS.md) sigue como antecedente de contrato, pero los escenarios que exigen servidor o persistencia (R12, R13, R17–R19, R23–R27, R30–R32 y R35) no son aplicables a esta arquitectura. No se deben simular ni marcar como aprobados.

## Prerrequisitos

- Tarea 25: URL HTTPS de ensayo, proveedor y autorización de despliegue.
- Tarea 26: identidad, contactos sin contradicción, oferta, imágenes referenciales identificadas y condiciones confirmadas.
- Un commit identificable que haya pasado `npm run quality`.
- Confirmación de que el destino de prueba contiene este commit y no contiene datos personales de visitantes.

## Recorrido de aceptación cuando estén disponibles

1. Ejecutar `npm ci` y `npm run quality` en una copia limpia; registrar commit y resultados.
2. En la URL HTTPS autorizada, revisar rutas públicas, `robots.txt`, sitemap, canónicas, imágenes y que la demostración no sea indexable.
3. Con datos de ensayo autorizados, comprobar la oferta principal, extras, cambio explícito de principal, mensaje visible y destinatario resuelto desde el responsable configurado. Interceptar la navegación de WhatsApp: no enviar mensajes reales ni inferir entrega por el clic.
4. Probar bolsa y origen en la misma pestaña, incluida recuperación segura si el almacenamiento está bloqueado o vencido. No afirmar persistencia entre usuarios ni recuperación de una solicitud.
5. Revisar navegación móvil/escritorio, teclado, foco del diálogo y consola. Registrar sólo resultados observados, URL, navegador/dispositivo, commit y limitaciones; no registrar PII, secretos ni conversaciones.
6. Si se detecta un defecto, volver a la tarea responsable, corregirlo y repetir las verificaciones afectadas. No avanzar a publicación si queda un defecto crítico.

## Criterios de aceptación

- [ ] La URL de ensayo HTTPS y el commit están documentados.
- [ ] Los datos comerciales y los destinatarios están confirmados y no hay imágenes demo usadas como producción.
- [ ] El destinatario depende exclusivamente de la oferta principal; extras no lo reemplazan y nunca hay fallback silencioso.
- [ ] La salida a WhatsApp es una acción explícita y no se declara envío o entrega.
- [ ] La demo permanece fuera del índice y no hay API, solicitudes ni métricas que afirmar como verificadas.
- [ ] Las observaciones de teclado, viewport y almacenamiento se registran con sus límites.

## Bloqueo actual y traspaso

El despliegue existente no contiene todavía este commit comercial. Después de desplegar el commit actual en la URL autorizada, ejecutar esta lista sin enviar WhatsApp y sólo entonces evaluar [28. Publicar sólo en destino autorizado y verificar captación](28-publicacion-controlada.md).
