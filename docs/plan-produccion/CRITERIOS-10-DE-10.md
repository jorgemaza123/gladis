# Matriz de calidad y puertas de salida para la web estática

Una calificación sólo puede usar controles demostrados. Esta matriz no garantiza ausencia universal de errores, resultados SEO, envíos de WhatsApp ni una puntuación de Lighthouse. No se promedian controles pendientes para declarar una nota global.

| Área | Evidencia necesaria |
|---|---|
| Arquitectura estática | Fuente única de contenido y teléfonos; sin API, CMS, base de datos o datos de visitantes; validación y clon por lectura. |
| Responsables | La oferta principal decide el responsable; extras no lo cambian; contacto ausente no usa fallback; teléfonos sólo en configuración. |
| Cotizador | Bolsa temporal sin contacto personal; mensaje visible y enlace explícito; pérdida de almacenamiento no rompe la interfaz. |
| Contenido | Servicios, condiciones, cobertura, fotos y textos alternativos confirmados, sin contenido comercial inventado. |
| Diseño y accesibilidad | Revisión humana en navegador de teclado, foco, zoom, reflow, móvil, escritorio y movimiento reducido. |
| SEO | Dominio HTTPS confirmado, metadatos/canónicas/sitemap/robots revisados en el destino y autorización expresa de indexación. |
| Rendimiento | Medición reproducible de portada, ficha y cotizador con dispositivo/red/versiones; datos de campo sólo si existe una muestra suficiente. |
| Privacidad | No se recolecta ni transmite contacto innecesario; el mensaje se abre por decisión del visitante y se describen sus límites. |
| Operación | `npm ci` y `npm run quality` en copia limpia; runbook de recuperación; commit, URL y recuperación remota probados cuando exista destino. |

## Estado actual

Se han demostrado guardas estáticas, validación de reglas comerciales y compilación local en tareas anteriores. Permanecen pendientes los datos comerciales, la URL de ensayo, la evaluación humana de navegador, las mediciones y toda publicación. Por ello no corresponde una nota global ni afirmar 10/10.

## Límites de arquitectura

No hay solicitudes, referencias, analítica, conversión, paneles, avisos, autenticación, métricas persistentes, copias de registros ni restauración de conversaciones. No deben presentarse como fallos a corregir dentro de esta arquitectura ni como capacidades verificadas.
