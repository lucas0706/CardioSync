# Constitución del proyecto CardioSync

| Campo | Valor |
|---|---|
| Tipo | Principios rectores del proyecto |
| Estado | Propuesta documental para revisión |
| Fecha | 2026-10-15 |
| Alcance | Arquitectura, calidad, seguridad y mantenimiento |

## 1. Propósito

CardioSync es una aplicación Android orientada al registro y seguimiento de mediciones de presión arterial y a la organización de información cardiovascular relacionada. Sus funciones incluyen historial, estadísticas, reportes, integración con Health Connect, importación y exportación de datos, y mecanismos de copia de seguridad y restauración.

Este documento fija principios de trabajo. No sustituye los requisitos de distribución, las especificaciones de cada función ni las decisiones clínicas respaldadas por fuentes.

## 2. Principios de arquitectura

1. **El dominio es explícito.** Las reglas de negocio deben residir en capas de dominio o servicios de aplicación adecuados, no duplicarse en componentes visuales.
2. **Las funciones están modularizadas.** Mantener la organización establecida en `src/core`, `src/domain`, `src/features` y `src/components`.
3. **La medición y su contexto no son conceptos intercambiables.** No añadir información contextual al modelo principal sin una decisión documentada y una revisión de compatibilidad.
4. **Las fuentes externas se adaptan.** Importaciones e integraciones deben transformar y validar sus datos antes de incorporarlos al modelo interno.
5. **La infraestructura no debe filtrarse al dominio.** Persistencia, APIs, sistema operativo y proveedores externos deben mantenerse detrás de interfaces o servicios apropiados cuando corresponda.
6. **Las decisiones relevantes son trazables.** Registrar el contexto, la decisión, sus consecuencias, alternativas y evidencia.
7. **No duplicar reglas.** La clasificación y las reglas de dominio deben tener una fuente de verdad identificable.

## 3. Calidad y cambios

- Mantener TypeScript en modo estricto y resolver errores de compilación antes de ampliar funcionalidades.
- Verificar compatibilidad con la versión de Expo SDK declarada por la rama que se modifica; no asumir que todas las ramas usan la misma versión.
- No añadir dependencias sin justificar necesidad, compatibilidad, mantenimiento, tamaño y efecto sobre la compilación nativa.
- Antes de modificar archivos, inspeccionar el estado real del repositorio, los consumidores y las pruebas existentes.
- Preferir cambios pequeños, revisables y coherentes con la arquitectura.
- No afirmar que una función está validada solo porque existe código para ella.
- Separar validación estática, pruebas automatizadas, pruebas en dispositivo y publicación.

## 4. Datos y seguridad

- Tratar los datos de salud como información sensible y minimizar su exposición.
- No afirmar cumplimiento normativo o de políticas de una tienda sin una evaluación específica y evidencia.
- Validar datos importados y restaurados antes de utilizarlos.
- Documentar claramente los efectos de restaurar una copia, incluida cualquier sustitución de datos existentes.
- No convertir datos ausentes en valores clínicos como cero.
- Distinguir los datos ingresados, los datos importados y los valores derivados.

## 5. Integraciones y distribución

- Health Connect y otros proveedores son fuentes externas sujetas a permisos, disponibilidad y restricciones del sistema.
- Una programación de backup representa una intención de ejecución, no una garantía de que la copia haya terminado correctamente.
- Las actualizaciones OTA solo son apropiadas para cambios compatibles con el runtime instalado. Cambios nativos, plugins, dependencias nativas o configuración que afecte el binario requieren evaluar una nueva build.
- Para distribución Android de producción, la preferencia del proyecto es generar APK, salvo que se solicite expresamente otro artefacto.
- Antes de publicar, verificar commit, estado de Git, versión, runtime, canal y tipo de cambio.

## 6. Evidencia y documentación

La documentación debe distinguir entre:

- **Diseñado:** existe una especificación o decisión.
- **Implementado:** el código contiene la funcionalidad.
- **Validado técnicamente:** hay evidencia de comprobaciones técnicas.
- **Validado en dispositivo:** los escenarios pertinentes fueron probados en un dispositivo o entorno equivalente.
- **Publicado:** existe evidencia de que la versión fue distribuida.

No usar estos estados como sinónimos. Toda regla clínica debe conservar la fuente, la versión y la trazabilidad entre recomendación, interpretación y comportamiento implementado.

## 7. Autoridad y mantenimiento

Este texto se propone como constitución documental y requiere revisión antes de considerarse una política formal aprobada. Los detalles operativos se mantienen en:

- [Arquitectura](01_ARCHITECTURE.md)
- [Decisiones arquitectónicas](03_DECISIONS.md)
- [Flujo de desarrollo y validación](17_DEVELOPMENT_WORKFLOW.md)
- [Versiones, actualizaciones y distribución Android](14_RELEASES_AND_UPDATES.md)
- [Brechas documentales](18_DOCUMENTATION_GAPS.md)

Cuando una decisión específica contradiga un principio general, registrar la excepción y su justificación en un ADR; no resolver el conflicto silenciosamente.
