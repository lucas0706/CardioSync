# ClinicalAnalysis

**Estado:** implementación contrastada con `src/domain/clinical/services/ClinicalAnalysisDomainService.ts` el 17-10-2026.

## 1. Responsabilidad

`ClinicalAnalysisDomainService` coordina reglas clínicas que consumen un resumen estadístico, el contexto clínico opcional y una guía. No calcula las estadísticas ni modifica los registros originales.

## 2. Entrada efectiva

El contrato `ClinicalAnalysisInput` declara:

- `measurements: BloodPressureRecord[]`;
- `statistics?: StatisticsSummary`;
- `context: ClinicalContext`;
- `guideline?: ClinicalGuideline`.

La implementación actual no lee `measurements` directamente durante la evaluación: las reglas usan principalmente `statistics` y `context`. Si no se entrega `statistics`, se omiten las reglas que requieren ese resumen.

## 3. Orquestación implementada

El servicio ejecuta, por composición:

- `HomeBloodPressureControlRule`;
- `TrendRule`;
- `HypertensionLoadRule`;
- `TimeInTargetRule`;
- `VariabilityRule`;
- `TherapeuticTargetRule`;
- `CardiovascularRiskRule`;
- `BloodPressureSafetyRule`;
- `BloodPressureClassificationRule`.

La guía predeterminada es `ConsensoArgentinaHTA2025`. Los hallazgos se agrupan mediante `buildClinicalAnalysisResult` en clasificación, tendencias, objetivos, control, carga, variabilidad, seguridad y riesgo.

## 4. Modelo de salida

`ClinicalAnalysis` contiene identificador, `patientId`, fecha de creación, guía, estadísticas opcionales, lista de hallazgos, resultado estructurado y resumen textual. Cada `ClinicalFinding` incluye tipo, título, severidad opcional, fecha y posible `guidelineId`.

## 5. Límites relevantes

- El servicio no crea un registro persistido de análisis en el código inspeccionado.
- La salida no conserva una instantánea completa de todas las mediciones ni una versión del motor que garantice reproducibilidad histórica.
- No existe aquí un motor completo de recomendaciones ni un motor independiente de alertas.
- La regla de riesgo genera un hallazgo por determinados antecedentes; no calcula un porcentaje de riesgo cardiovascular validado.
- Las categorías y objetivos activos no equivalen a implementar todas las reglas de las guías documentadas.

## 6. Seguridad

El análisis es una ayuda de seguimiento, no un diagnóstico ni una prescripción. Los textos de hallazgos deben mantener el alcance exacto de las reglas que los generan.