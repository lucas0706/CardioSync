# Relación entre Statistics y análisis clínico

**Estado:** contrastado con `src/domain/statistics/` y `src/domain/clinical/` el 17-10-2026.

## 1. Responsabilidades

Statistics calcula métricas a partir de registros longitudinales. Clinical Analysis consume el resumen estadístico y aplica reglas para generar hallazgos. Son capas distintas, aunque las métricas de clasificación y los umbrales actuales tienen decisiones clínicas embebidas que deben mantenerse visibles.

## 2. Flujo implementado

`StatisticsDomainService.getSummary(records, filter)` delega a `StatisticsEngine.summarize`. El motor filtra por periodo, agrega métricas y devuelve `StatisticsSummary`.

El resumen incluye total, promedios de PAS/PAD/FC, máximos y mínimos, registros extremos, presión de pulso media, presión arterial media, desviación estándar, variabilidad, carga hipertensiva, tiempo en objetivo, adherencia, tendencia y distribución de clasificación.

## 3. Cálculos y límites actuales

- La tendencia se calcula sobre la serie cronológica de PAS; la implementación clasifica como ascendente si el último valor supera al primero en más de 3, descendente si cae más de 3 y estable en los demás casos.
- La carga hipertensiva y el tiempo en objetivo utilizan por defecto umbrales de 135/85 mmHg en sus calculadores, independientemente de la guía entregada al análisis.
- La variabilidad se calcula como desviación estándar dividida por la media y multiplicada por 100.
- La clasificación de registros usa `BloodPressureClassifier`, que aplica cinco categorías implementadas en código.
- El objetivo terapéutico del análisis se evalúa por separado mediante `TherapeuticTargetRule` y `ClinicalTargetSelector`.

Estos cálculos no deben confundirse con reglas clínicas universales ni con valores configurables por todas las guías.

## 4. Relación con ClinicalAnalysis

`ClinicalAnalysisDomainService` recibe `StatisticsSummary` y ejecuta reglas que producen hallazgos. No calcula estadísticas por sí mismo. Aunque su contrato incluye una lista de mediciones, la implementación actual de las reglas se basa en el resumen y el contexto.

## 5. Uso y seguridad

Dashboard, gráficos y reportes pueden consumir estadísticas para seguimiento. Un promedio, una tendencia o un porcentaje descriptivo no es por sí solo un diagnóstico. La documentación de cambios en umbrales debe incluir fuente, pruebas y revisión clínica.