# 28. Publicar sólo en destino autorizado y verificar captación

Estado: TODO. Los datos comerciales y SEO están preparados localmente; falta la aceptación de la tarea 27 y el despliegue autorizado del commit actual. Anterior: [27. Validar recorridos reales en el entorno de ensayo](27-aceptacion-integral.md). Siguiente: [29. Evaluar calidad demostrada y entregar operación](29-evaluacion-final-y-traspaso.md).

## Objetivo

Publicar la web estática únicamente después de disponer de una autorización explícita y evidencia revisable de que el contenido, los contactos y el ensayo son correctos.

## Puerta obligatoria antes de publicar

- Proveedor, URL HTTPS final y autorización del usuario para desplegar el commit actual.
- Commit concreto, copia recuperable y resultado vigente de `npm ci` seguido de `npm run quality`.
- Tarea 26 completada con datos comerciales, imágenes referenciales identificadas y teléfonos confirmados; sin contradicción entre documentación y configuración.
- Tarea 27 completada con un ensayo documentado en la URL autorizada.
- Revisión humana de `data/demo.ts`, `config/business-contacts.ts`, `robots.txt`, sitemap y canónicas. El destinatario de WhatsApp debe seguir saliendo exclusivamente de la oferta principal y no puede tener fallback.

El identificador de proyecto en `.openai/hosting.json` no es un destino ni una autorización. Un pedido de modificar documentación tampoco autoriza un despliegue.

## Procedimiento después de autorización

1. Usar el proveedor y método autorizados, siguiendo el [runbook](../operations/release-runbook.md). No buscar ni configurar otro alojamiento.
2. Publicar el commit aprobado en el destino indicado. No hay D1, CMS, API, migraciones, secretos operativos, panel privado ni registros persistentes que configurar o restaurar.
3. Verificar en la URL pública HTTPS las rutas, recursos, `robots.txt`, sitemap, canónicas e imágenes. Registrar commit, hora, URL y resultados sin incluir secretos o datos de visitantes.
4. Verificar que la indexación, `robots.txt`, sitemap y canónicas correspondan a la configuración comercial aprobada. El despliegue no equivale a envío de WhatsApp ni a una venta.
5. Para el enlace de WhatsApp, revisar visualmente destinatario y mensaje preparado; sólo probar el envío manual si el usuario lo autoriza de forma específica. Abrir o cancelar el enlace no prueba envío, entrega ni venta.
6. Si hay una incidencia, aplicar el procedimiento de recuperación del runbook con autorización para el mismo destino y volver a comprobar el resultado público.

## Criterios de aceptación

- [ ] Hay URL pública HTTPS autorizada, commit identificable y verificación posterior registrada.
- [ ] La publicación respeta la configuración de indexación autorizada y no presenta imágenes de muestra como contenido real.
- [ ] El enlace de WhatsApp muestra el responsable correcto, sin afirmar envío ni entrega.
- [ ] Existe una revisión recuperable del contenido versionado; no se alegan copias de solicitudes o métricas que la web no guarda.
- [ ] No se introducen teléfonos en componentes, API, CMS, base de datos ni analítica persistente.

## Bloqueo actual y traspaso

El despliegue existente no contiene el commit comercial actual. Falta realizar T27 y que el usuario ordene el despliegue de ese commit; entonces registrar la evidencia y continuar con [29. Evaluar calidad demostrada y entregar operación](29-evaluacion-final-y-traspaso.md).
