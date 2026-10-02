# 25. Preparar ensayo y recuperación de la web estática

Estado: HECHO el 2026-10-01. Adaptada el 2026-09-30 a la [arquitectura estática](ARQUITECTURA-ESTATICA.md).
Anterior: [24. Automatizar calidad estática en CI](24-regresion-y-ci.md).
Siguiente: [26. Completar datos reales y validar la oferta antes de indexar](26-datos-reales-y-puerta-comercial.md).

## Objetivo

Dejar un procedimiento revisable para ensayar y recuperar una versión estática sin asumir proveedor, dominio ni autorización de despliegue.

## Antes de editar

- Leer [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md), [ESTADO](ESTADO.md), [BITACORA](BITACORA.md), `README.md`, `.openai/hosting.json`, `vite.config.ts` y `package.json`.
- Confirmar que no existen D1, R2, migraciones, solicitudes persistentes, CMS, imágenes subidas ni secretos de producción que respaldar.
- El identificador de proyecto de Sites no es una URL, dominio ni autorización para publicar.

## Alcance ejecutado

1. Crear [release-runbook](../operations/release-runbook.md) con precondiciones de ensayo autorizado, comprobaciones sin datos personales y pasos de recuperación desde un commit conocido.
2. Establecer `npm ci` y `npm run quality` como puerta local desde una copia limpia antes de cualquier ensayo.
3. Documentar que la recuperación restaura código y contenido versionado; no puede recuperar bolsas, atribución temporal ni conversaciones de WhatsApp.
4. Mantener `demo: true`, `indexable: false` y sin `origin` hasta tener URL HTTPS de ensayo confirmada.
5. No desplegar, configurar dominio, activar indexación, crear secrets ni contratar servicios.

## Ensayo verificado

El 2026-10-01 se verificó el despliegue HTTPS de demostración ya creado en Vercel: `https://gladis-vr6r.vercel.app`. Las rutas públicas, `robots.txt` y sitemap respondieron correctamente y la demo sigue fuera de índice. No se ejecutó una recuperación remota ni se configuró un dominio final; el runbook conserva el procedimiento para una recuperación autorizada desde un commit conocido.

## Verificación

- Verificar que el runbook no contiene URL, secreto o comando de publicación inventados.
- Ejecutar `npm.cmd run quality` para comprobar la puerta local.
- Ejecutar `git diff --check` y registrar avisos CRLF preexistentes.

## Traspaso exacto

T26 puede recopilar datos comerciales reales sin indexar ni publicar. La aceptación integral debe usar el ensayo Vercel actual o un destino posterior autorizado y registrar su evidencia real antes de considerar publicación comercial.
