# 28. Publicar sólo en destino autorizado y verificar captación

Estado: BLOQUEADO por falta de autorización comercial, dominio final y datos comerciales. Anterior: [27. Validar recorridos reales en el entorno de ensayo](27-aceptacion-integral.md). Siguiente: [29. Evaluar calidad demostrada y entregar operación](29-evaluacion-final-y-traspaso.md).

## Objetivo

Publicar la web estática únicamente después de disponer de una autorización explícita y evidencia revisable de que el contenido, los contactos y el ensayo son correctos.

## Puerta obligatoria antes de publicar

- Proveedor, dominio HTTPS, URL final y responsable que autoriza el despliegue por escrito.
- Commit concreto, copia recuperable y resultado vigente de `npm ci` seguido de `npm run quality`.
- Tarea 26 completada con datos comerciales, imágenes y teléfonos confirmados; sin contradicción entre documentación y configuración.
- Tarea 27 completada con un ensayo documentado en la URL autorizada.
- Revisión humana de `data/demo.ts`, `config/business-contacts.ts`, `robots.txt`, sitemap y canónicas. El destinatario de WhatsApp debe seguir saliendo exclusivamente de la oferta principal y no puede tener fallback.

El identificador de proyecto en `.openai/hosting.json` no es un destino ni una autorización. Un pedido de modificar documentación tampoco autoriza un despliegue.

## Procedimiento después de autorización

1. Usar el proveedor y método autorizados, siguiendo el [runbook](../operations/release-runbook.md). No buscar ni configurar otro alojamiento.
2. Publicar el commit aprobado en el destino indicado. No hay D1, CMS, API, migraciones, secretos operativos, panel privado ni registros persistentes que configurar o restaurar.
3. Verificar en la URL pública HTTPS las rutas, recursos, `robots.txt`, sitemap, canónicas e imágenes. Registrar commit, hora, URL y resultados sin incluir secretos o datos de visitantes.
4. Mantener `demo: true` e indexación bloqueada hasta que el responsable autorice expresamente activar contenido real e indexación. Publicar una demostración no equivale a habilitar su rastreo.
5. Para el enlace de WhatsApp, revisar visualmente destinatario y mensaje preparado; sólo probar el envío manual si el usuario lo autoriza de forma específica. Abrir o cancelar el enlace no prueba envío, entrega ni venta.
6. Si hay una incidencia, aplicar el procedimiento de recuperación del runbook con autorización para el mismo destino y volver a comprobar el resultado público.

## Criterios de aceptación

- [ ] Hay URL pública HTTPS autorizada, commit identificable y verificación posterior registrada.
- [ ] La publicación respeta la configuración de indexación autorizada y no presenta imágenes de muestra como contenido real.
- [ ] El enlace de WhatsApp muestra el responsable correcto, sin afirmar envío ni entrega.
- [ ] Existe una revisión recuperable del contenido versionado; no se alegan copias de solicitudes o métricas que la web no guarda.
- [ ] No se introducen teléfonos en componentes, API, CMS, base de datos ni analítica persistente.

## Bloqueo actual y traspaso

El despliegue de demostración en Vercel ya existe y permanece no indexable. Siguen faltando autorización comercial explícita, dominio final, datos comerciales y aceptación integral; por ello no se declara publicación comercial ni se cambia indexación. Cuando se cumplan esas puertas, registrar la evidencia y continuar con [29. Evaluar calidad demostrada y entregar operación](29-evaluacion-final-y-traspaso.md).
