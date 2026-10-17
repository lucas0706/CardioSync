# Constitución del proyecto CardioSync

| Campo | Valor |
|---|---|
| Tipo | Principios rectores y límites del proyecto |
| Estado | Activo |
| Última revisión | 2026-10-17 |

## Propósito

Esta constitución fija los principios estables que deben respetarse al diseñar, implementar, validar y mantener CardioSync. No sustituye la arquitectura detallada, las decisiones ADR, el roadmap ni las guías operativas; establece los criterios que esos documentos y los cambios de código deben respetar.

## Principios no negociables

1. **Seguridad y prudencia clínica.** CardioSync sirve para seguimiento personal de presión arterial y datos relacionados. Sus resultados no deben presentarse como diagnóstico autónomo ni como sustituto de un profesional sanitario.
2. **Evidencia trazable.** Las reglas clínicas deben declarar su fuente, alcance y limitaciones. No se atribuye soporte a una guía si no está respaldado por implementación verificable.
3. **Una fuente de verdad por responsabilidad.** Evitar reglas, modelos, cálculos o persistencias duplicados que produzcan resultados contradictorios.
4. **Separación arquitectónica.** Mantener las responsabilidades diferenciadas entre `src/core`, `src/domain`, `src/features` y `src/components`. La interfaz no debe absorber reglas de dominio ni la infraestructura definir criterios clínicos.
5. **Persistencia y recuperación responsables.** Las operaciones sobre datos de salud deben validar entradas, comunicar errores y documentar claramente los efectos de importación, backup y restauración.
6. **Compatibilidad de plataforma.** Antes de proponer cambios, verificar la compatibilidad con la versión Expo SDK 57 utilizada por el proyecto y con sus dependencias nativas.
7. **TypeScript estricto y mantenibilidad.** Preferir contratos explícitos, tipos seguros y soluciones mantenibles frente a atajos o supresiones de tipos.
8. **Cambios pequeños y trazables.** Los cambios documentales principales se presentan en PR independientes por documento. No se fusionan PR sin autorización explícita.
9. **Validación honesta.** Diferenciar código presente, integración funcional, pruebas automatizadas y validación en dispositivo. Un servicio existente no demuestra por sí solo que todo el flujo esté validado.
10. **No añadir complejidad innecesaria.** No incorporar dependencias nuevas sin justificar necesidad, compatibilidad, mantenimiento e impacto.

## Arquitectura de referencia

La estructura de responsabilidades del código es:

- `src/core`: infraestructura y servicios transversales.
- `src/domain`: modelos, reglas y servicios de dominio independientes de la interfaz.
- `src/features`: flujos funcionales y presentación por funcionalidad.
- `src/components`: componentes visuales reutilizables.

La estructura real del repositorio y las excepciones históricas se documentan en `docs/01_ARCHITECTURE.md` y `docs/12_FOLDER_STRUCTURE.md`. Esta constitución no autoriza migraciones estructurales por sí sola.

## Cambios clínicos

- La medición de presión arterial sigue siendo el núcleo del producto.
- Los datos de contexto son opcionales cuando así lo establece el modelo; su ausencia no debe inventar valores.
- Clasificaciones, estadísticas, hallazgos y recomendaciones son conceptos diferentes y deben describirse por separado.
- La guía clínica declarada como implementada debe coincidir con las reglas y objetivos que realmente ejecuta el código.
- Los documentos de diseño deben identificar explícitamente qué está implementado y qué permanece planificado o sin validar.

## Publicaciones y cambios nativos

Las actualizaciones OTA solo se utilizan cuando los cambios son compatibles con el runtime instalado y no requieren modificar código nativo, configuración nativa, plugins, dependencias nativas, Expo SDK o runtimeVersion. Si cambia alguno de esos elementos, se debe evaluar y generar una nueva APK de producción en lugar de publicar una OTA.

## Resolución de conflictos

En caso de discrepancia, aplicar este orden:

1. Evidencia reproducible del código y de las pruebas del commit revisado.
2. Decisiones arquitectónicas aprobadas y documentación operativa vigente.
3. Especificaciones de diseño, marcadas como tales.
4. Notas históricas y checkpoints, que no prueban por sí solos el estado actual.

Toda discrepancia relevante debe resolverse mediante un cambio revisable y trazable, no ocultarse con una afirmación general.

## Documentos relacionados

- `docs/00_PROJECT_MASTER_CONTEXT.md`
- `docs/01_ARCHITECTURE.md`
- `docs/03_DECISIONS.md`
- `docs/02_ROADMAP.md`
- `docs/99_DOCUMENTATION_GUIDELINES.md`
- `docs/14_RELEASES_AND_UPDATES.md`
