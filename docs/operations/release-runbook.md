# Runbook de ensayo y recuperación para la web estática

Este procedimiento no publica el sitio. El destino de ensayo, dominio y autorización de despliegue siguen pendientes.

## Alcance

La aplicación usa contenido versionado en `data/demo.ts`, contactos en `config/business-contacts.ts` y no tiene base de datos, CMS, solicitudes, imágenes subidas, sesiones ni métricas persistentes. Por tanto, no hay migraciones, volúmenes ni copias de datos operativos que restaurar.

El archivo `.openai/hosting.json` identifica un proyecto de Sites, pero no incluye un dominio ni autoriza un despliegue. No se debe inferir un destino desde ese identificador.

## Antes de un ensayo autorizado

1. Confirmar por escrito el proveedor, URL de ensayo y persona que autoriza la publicación.
2. Mantener la demostración con `demo: true`, `indexable: false` y `origin: ''` hasta disponer de una URL HTTPS de ensayo confirmada. No activar indexación ni usar datos comerciales reales sólo para probar el despliegue.
3. Registrar el commit exacto que se va a ensayar y conservar un commit conocido como recuperable.
4. Desde una copia limpia, ejecutar:

   ```powershell
   npm ci
   npm run quality
   ```

5. Revisar que los contactos provengan únicamente de `config/business-contacts.ts`, que no haya API o almacenamiento y que el mensaje de WhatsApp no se abra automáticamente.

## Verificación posterior a un ensayo autorizado

Sin introducir datos personales, comprobar la URL de ensayo, HTTPS, rutas públicas, `robots.txt`, `sitemap.xml`, imágenes disponibles y que la demostración permanezca fuera de indexación. No afirmar que se envió un WhatsApp por abrir un enlace.

Registrar URL, commit, hora, resultado de `npm run quality`, comprobaciones realizadas y cualquier incidencia. No registrar secretos, teléfonos de visitantes, mensajes ni capturas con datos personales.

## Recuperación

1. Detener cualquier publicación adicional y seleccionar el último commit conocido que pasó `npm run quality`.
2. Preparar una revisión que restaure ese commit o revierta el cambio afectado; no modificar datos inexistentes ni ejecutar migraciones.
3. Ejecutar de nuevo `npm ci` y `npm run quality` sobre la revisión de recuperación.
4. Solicitar autorización para desplegar la recuperación al mismo destino autorizado.
5. Después del despliegue autorizado, repetir las comprobaciones públicas anteriores y registrar el commit recuperado.

La recuperación no puede rescatar conversaciones de WhatsApp, bolsas de navegador ni atribución temporal: esos datos nunca se almacenan en el servidor.

## Bloqueos vigentes

- No hay URL ni dominio de ensayo autorizado.
- No hay evidencia de despliegue, HTTPS remoto, restauración remota o ejecución de GitHub Actions.
- No se publicará ni se configurará un destino hasta que exista autorización explícita.
