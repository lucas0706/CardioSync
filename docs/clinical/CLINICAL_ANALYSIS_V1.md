# Clinical Analysis V1

**Estado:** documentación contrastada con `feature/app-updates` el 17-10-2026.

## Objetivo

El análisis clínico interpreta métricas longitudinales y contexto del perfil mediante reglas y genera hallazgos. No realiza un diagnóstico médico ni prescribe tratamientos.

## Flujo implementado

`BloodPressureRecord[]` → `StatisticsDomainService` / `StatisticsEngine` → `StatisticsSummary` → `ClinicalAnalysisDomainService` → reglas clínicas → `ClinicalFinding[]` → `ClinicalAnalysisResult`.

El contrato `ClinicalAnalysisInput` incluye mediciones, resumen estadístico, contexto y guía opcional. La implementación actual no consulta directamente la lista de mediciones al evaluar las reglas; utiliza el resumen estadístico y el contexto. Si no se proporciona guía, usa el Consenso Argentino de Hipertensión Arterial 2025.

## Reglas incluidas actualmente

- Clasificación de la media de PAS/PAD.
- Advertencia si la PAD media es inferior a 70 mmHg.
- Control domiciliario si el promedio alcanza PAS 135 o PAD 85 mmHg.
- Tendencia ascendente cuando la estadística indica `up`.
- Hallazgo de carga hipertensiva si la carga calculada es mayor que cero.
- Hallazgo de tiempo en objetivo cuando la proporción es inferior al 50%.
- Hallazgo de variabilidad cuando la variabilidad sistólica supera 15 o la diastólica supera 10.
- Comparación con objetivo terapéutico seleccionado para la guía argentina.
- Hallazgo por determinados antecedentes cardiovasculares o renales y diabetes.

Los umbrales anteriores describen el código; no certifican por sí mismos la validez clínica universal.

## Responsabilidades

**Statistics Domain:** calcula promedios, extremos, tendencias, variabilidad, carga, tiempo en objetivo y otras métricas.

**Clinical Domain:** ejecuta reglas sobre las métricas y el contexto y construye hallazgos con tipo, título, severidad opcional y referencia a la guía.

## Límites de V1

- No hay motor independiente de recomendaciones integrado.
- No hay motor autónomo completo de alertas.
- La regla de riesgo no calcula riesgo cardiovascular absoluto.
- Los objetivos ejecutables se encuentran registrados para la guía argentina 2025.
- El análisis se devuelve en memoria; no se confirmó persistencia del resultado en el flujo inspeccionado.
- No se guarda una instantánea completa de entradas ni versión del motor para reproducibilidad histórica.

## Escenarios de prueba

`src/devtools/clinical/ClinicalHistoricalScenario.ts` crea 30 registros simulados y ejecuta estadísticas y análisis. Es un escenario de desarrollo, no evidencia por sí solo de una suite automatizada de pruebas clínicas. Los resultados de una ejecución manual deben conservarse como referencia fechada y no confundirse con una garantía permanente.