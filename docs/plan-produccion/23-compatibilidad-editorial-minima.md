# 23. Preservar el contrato editorial estático

Estado inicial: TODO. Adaptada el 2026-09-30 a la [arquitectura estática](ARQUITECTURA-ESTATICA.md).
Anterior: [22. Comunicar claramente la ausencia de solicitudes y avisos](22-avisos-fiables-y-operacion.md).
Siguiente: [24. Automatizar regresión y comprobaciones en CI](24-regresion-y-ci.md).

## Objetivo

Hacer que las ediciones de los archivos de contenido mantengan las relaciones y reglas comerciales declaradas, sin recuperar el CMS, cuentas ni guardado concurrente.

## Antes de editar

- Leer [ARQUITECTURA-ESTATICA](ARQUITECTURA-ESTATICA.md), [ESTADO](ESTADO.md), [BITACORA](BITACORA.md), [CONTRATOS](CONTRATOS.md), `data/defaults.ts`, `data/demo.ts`, `lib/validation.ts` y `repositories/site.ts`.
- Confirmar que el panel CMS, sus editores y guardado de API fueron retirados. No recrearlos.
- Mantener `data/demo.ts` como única fuente del contenido público y `config/business-contacts.ts` como única fuente de teléfonos.

## Alcance ejecutado

1. Mantener los valores conservadores de `emptyEntry`: oferta no cotizable, sin responsable, sin configuración de cantidad, relaciones vacías y catálogo externo nulo.
2. Conservar la normalización y validación de `requestable`, `ownerId`, `quoteConfig`, recomendaciones, FAQ, catálogo externo y cobertura, incluidas las referencias entre entradas.
3. Garantizar que `readSite()` devuelve un clon del contenido fuente, para que una lectura no mute el objeto editorial en memoria que utilizará otra ruta.
4. Documentar en `README.md` el procedimiento breve para editar una oferta y asignar responsable sólo mediante datos explícitos, sin copiar teléfonos a contenido o componentes.
5. Corregir afirmaciones obsoletas de README: el cotizador no solicita consentimiento ni se ha completado una auditoría visual aislada.

## Límites

- No hay editor, roles, historial, previsualización, publicación parcial ni guardado concurrente. Una edición requiere modificar archivos versionados, verificar y hacer un despliegue autorizado.
- La demostración no aporta una oferta nueva confirmada; no se agregan alquileres, precios, responsables ni relaciones para simular el proceso.
- Las validaciones V1/V2 históricas siguen siendo contratos y pruebas puras; no habilitan CMS ni persistencia.

## Verificación

- Ejecutar `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run test:commerce`, `npm.cmd test` y `npm.cmd run build`.
- `npm.cmd test` debe comprobar que el repositorio clona `demoContent` y que no hay API, base de datos ni envío de datos.
- Ejecutar `git diff --check` y registrar sólo avisos CRLF preexistentes.

## Traspaso exacto

T24 puede automatizar las verificaciones estáticas existentes, pero no debe crear CI remoto, CMS, API o flujos mutantes sin una nueva decisión del usuario. Para una futura edición comercial real, usar la guía de README y aportar datos confirmados antes de activar `requestable`.
