# Validación histórica del motor clínico V2

**Tipo de evidencia:** escenario de desarrollo con datos simulados. Revisión del código y del registro documental: 17-10-2026.

## 1. Objetivo

Comprobar el flujo estadístico y de reglas clínicas sobre una serie histórica simulada. Este escenario no utiliza un valor manual aislado y no constituye por sí mismo una prueba clínica validada ni una suite automatizada ejecutada en CI.

## 2. Escenario reproducible en código

`src/devtools/clinical/ClinicalHistoricalScenario.ts` construye 30 registros sintéticos de PAS/PAD distribuidos en fechas relativas a la ejecución. Calcula el resumen con `StatisticsDomainService.getSummary(records)` y pasa el resultado y el contexto a `ClinicalAnalysisDomainService.analyze()`.

Las medias derivadas de los 30 pares definidos en el escenario son:

- PAS media: aproximadamente **134,97 mmHg**.
- PAD media: aproximadamente **82,67 mmHg**.

El escenario imprime estadísticas, hallazgos y resultado estructurado en la consola.

## 3. Hallazgos registrados históricamente

La versión previa de este documento registró hallazgos de tendencia ascendente, carga hipertensiva, objetivo terapéutico y clasificación. Esos resultados describen una ejecución histórica del escenario; no garantizan que cualquier versión futura del código siga produciendo exactamente los mismos resultados.

La carga hipertensiva calculada por el motor usa los umbrales por defecto de PAS 135/PAD 85 mmHg. La tendencia usa la diferencia entre primer y último valor sistólico tras ordenar los registros por fecha.

## 4. Validación contextual registrada

El documento original registró cuatro escenarios:

| Escenario | Contexto | Objetivo esperado registrado |
|---|---|---|
| GENERAL | Edad 60 | Objetivo general para 16–79 |
| DIABETES | Edad 60, diabetes | Objetivo de diabetes |
| CKD | Edad 60, enfermedad renal crónica | Objetivo renal |
| ELDERLY | Edad 85 | Objetivo de mayores de 80 |

Estos escenarios corresponden al selector de objetivos implementado para el Consenso Argentino 2025. Deben volver a ejecutarse si cambian el selector, los objetivos o las reglas. La selección de objetivos tiene limitaciones documentadas en `21_CLINICAL_GUIDELINE_SPECIFICATION.md`.

## 5. Clasificación

El clasificador actual devuelve cinco categorías: `normal`, `borderline`, `grade-1`, `grade-2` e `isolated-systolic`. La versión anterior registró ejemplos de límites con resultado PASS, pero no se encontró evidencia en este escenario de que esos ejemplos se ejecuten automáticamente como pruebas unitarias.

## 6. Qué demuestra y qué no

Este escenario demuestra que existe un flujo de desarrollo para calcular estadísticas y generar hallazgos sobre datos simulados. No demuestra validez clínica, no sustituye revisión profesional, no prueba datos reales y no acredita por sí solo una suite automatizada. Para una garantía de regresión deben existir pruebas automatizadas versionadas y ejecutadas en el pipeline.