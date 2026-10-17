# Glosario clínico de CardioSync

**Estado:** alineado con los modelos y servicios de `feature/app-updates` el 17-10-2026.

## BloodPressureRecord
Contrato de una medición individual con PAS, PAD, fecha/hora y metadata. También conserva campos opcionales y reservados heredados. No es un diagnóstico ni un análisis.

## ClinicalContext
Perfil clínico opcional a nivel de paciente. Incluye datos demográficos, antropométricos y determinados factores/antecedentes. No representa una historia clínica completa ni un contexto por medición.

## ClinicalGuideline
Metadatos de una fuente clínica: identificador, nombre, organización, versión, año y referencias opcionales. El modelo no ejecuta reglas por sí solo.

## ClinicalAnalysis
Resultado de la orquestación de reglas clínicas sobre estadísticas y contexto. Contiene hallazgos, guía opcional y resumen.

## ClinicalAnalysisDomainService
Servicio que compone las reglas clínicas. Usa el Consenso Argentino 2025 por defecto cuando no se proporciona guía. No calcula las estadísticas.

## ClinicalFinding
Hallazgo generado por una regla. Puede incluir tipo, título, descripción, severidad e identificador de guía.

## ClinicalRule / ClinicalRuleContext
Contrato de ejecución de una regla y contexto común con guía, contexto clínico y fecha de evaluación.

## ClinicalTarget
Definición de rango objetivo asociada a guía, población y condiciones. Actualmente hay objetivos definidos para el Consenso Argentino 2025.

## ClinicalTargetSelector
Selecciona un objetivo por guía, edad y condiciones del contexto. La implementación actual divide por edad en menor/mayor de 80 años y tiene límites de selección que deben tenerse en cuenta; no valida por sí sola toda la elegibilidad clínica.

## StatisticsSummary
Resumen derivado de múltiples mediciones: promedios, extremos, variabilidad, tendencia, carga, tiempo en objetivo y otras métricas.

## StatisticsEngine / StatisticsDomainService
El motor calcula métricas; el servicio aplica filtros y expone el resumen.

## ClinicalProfileService / ClinicalProfileRepository
Servicios de feature y repositorio SQLite que leen, guardan, eliminan y comprueban la existencia del perfil local.

## ClinicalAlert
Interfaz de datos en `src/clinical/alerts/ClinicalAlert.ts`. Su existencia no equivale a un motor completo de alertas.

## Conceptos todavía no implementados como modelos independientes
`MeasurementContext`, `Anthropometry`, `VitalSigns`, `LifestyleContext`, `CardiovascularSymptoms`, `ClinicalContextBuilder`, `ClinicalDataProvider`, `ContextQualityEngine`, `RecommendationEngine` y `RiskEngine` no deben describirse como componentes completos del dominio actual. Existen conceptos parciales relacionados, como la regla `CardiovascularRiskRule`.

## Convenciones de lenguaje
Usar “hallazgo” para `ClinicalFinding`; “estadística” para métricas calculadas; “perfil clínico” para `ClinicalContext`; y “factor asociado a riesgo” para el hallazgo de riesgo actual. Evitar “diagnóstico”, “prescripción” o “riesgo calculado” cuando el código no produce esos resultados.