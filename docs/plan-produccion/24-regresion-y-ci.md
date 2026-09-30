# 24. Automatizar calidad estática en CI

Estado inicial: TODO. Adaptada el 2026-09-30 a la [arquitectura estática](ARQUITECTURA-ESTATICA.md).
Anterior: [23. Preservar el contrato editorial estático](23-compatibilidad-editorial-minima.md).
Siguiente: [25. Preparar entorno de ensayo y procedimiento de recuperación](25-entorno-staging-y-recuperacion.md).

## Objetivo

Evitar regresiones en los contratos de responsable, origen, bolsa, privacidad y contenido estático mediante un pipeline reproducible desde una instalación limpia.

## Antes de editar

- Leer [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md), [ESTADO](ESTADO.md), [BITACORA](BITACORA.md), `package.json`, `package-lock.json`, `scripts/commerce-tests.mjs` y `scripts/security-tests.mjs`.
- Confirmar que no existe infraestructura de API, D1, R2, migraciones, pruebas mutantes ni servidor de integración que deba ejecutarse.
- No crear `scripts/commerce-integration.mjs` ni recuperar scripts retirados de API: el alcance de CI es estático.

## Alcance ejecutado

1. Crear el script `npm run quality`, que ejecuta tipos, lint, reglas comerciales, guardas de seguridad y build en ese orden.
2. Crear `.github/workflows/quality.yml` para pull requests y cambios a `main`: usa Node 22.13.0, `npm ci` y `npm run quality` en Ubuntu desde una copia limpia.
3. Mantener permisos mínimos de sólo lectura del contenido y un límite de diez minutos.
4. Hacer fallar el flujo cuando falle alguno de los comandos; no ocultar ni continuar tras fallos.
5. No ejecutar pruebas D1/R2, interfaz, WhatsApp, CORS o integraciones inexistentes.
6. Retirar `@cloudflare/workers-types` de `tsconfig.json`: era una referencia residual que impedía `npm ci` seguido de typecheck, pese a no existir esa dependencia ni bindings Cloudflare.

## Verificación

- Ejecutar localmente `npm.cmd ci` o su equivalente desde una instalación limpia y luego `npm.cmd run quality`.
- Confirmar que `npm.cmd run quality` cubre `typecheck`, `lint`, `test:commerce`, `test` y `build` con códigos de salida reales.
- Ejecutar `git diff --check`.
- La activación remota del workflow depende de que el cambio se integre en GitHub; no afirmar ejecución remota antes de ello.

## Límites

- El workflow no mide navegación real, teclado, viewports, Lighthouse, WhatsApp, métricas, base de datos, solicitudes ni autenticación.
- No se guardan secretos ni datos reales en el workflow. Las pruebas usan sólo datos ficticios incorporados en el repositorio.
- No se hizo push ni publicación al crear el archivo de CI.

## Traspaso exacto

La tarea 25 debe trabajar con el mismo `npm run quality` y no añadir un entorno de datos o despliegue sin autorización. Una ejecución de GitHub Actions sólo podrá registrarse después de que se envíe el cambio a la rama correspondiente.
