# Análisis clínico

El análisis clínico de CardioSync coordina reglas clínicas y reúne sus resultados en una evaluación estructurada. Se encuentra en el dominio clínico y no depende de componentes visuales ni realiza por sí mismo los cálculos estadísticos de las mediciones.

## Cómo funciona

La implementación principal es `ClinicalAnalysisDomainService`, en `src/domain/clinical/services/ClinicalAnalysisDomainService.ts`.

El servicio recibe un `ClinicalAnalysisInput`, que aporta el contexto clínico, estadísticas y, opcionalmente, una guía. Si no se proporciona una guía, utiliza `ConsensoArgentinaHTA2025`.

El flujo es:

1. Recibe el contexto clínico y las estadísticas disponibles.
2. Construye un `ClinicalRuleContext` con la guía, el contexto y la fecha de evaluación.
3. Ejecuta las reglas configuradas.
4. Reúne los hallazgos producidos por las reglas.
5. Usa `buildClinicalAnalysisResult` para construir el resultado general.
6. Devuelve un `ClinicalAnalysis` con identificador, paciente, fecha, guía, estadísticas, hallazgos, resultado y resumen.

## Reglas coordinadas

La composición actual del servicio incluye:

- `HomeBloodPressureControlRule`: control de presión arterial domiciliaria.
- `TrendRule`: tendencia de las mediciones.
- `HypertensionLoadRule`: carga de presión arterial elevada.
- `TimeInTargetRule`: tiempo dentro del objetivo.
- `VariabilityRule`: variabilidad.
- `TherapeuticTargetRule`: comparación con objetivos terapéuticos.
- `CardiovascularRiskRule`: evaluación de riesgo cardiovascular.
- `BloodPressureSafetyRule`: advertencias de seguridad.
- `BloodPressureClassificationRule`: clasificación de presión arterial.

Las reglas no reciben todas exactamente los mismos datos. El servicio pasa estadísticas a las reglas de seguridad y clasificación; estadísticas junto con contexto a riesgo cardiovascular y objetivos terapéuticos; y estadísticas a las demás reglas. Las reglas que necesitan estadísticas no se ejecutan cuando estas faltan.

## Estadísticas y análisis clínico

El cálculo estadístico se mantiene separado de la interpretación clínica. Las estadísticas resumen las mediciones del período seleccionado; el análisis clínico utiliza esos resultados y el contexto del paciente para generar hallazgos.

Por esta razón, la selección del período y la preparación de estadísticas corresponden al flujo que invoca el servicio, no a `ClinicalAnalysisDomainService`.

## Resultado

El objeto de análisis incluye:

- `id`: identificador de la evaluación.
- `patientId`: identificador del paciente asociado al contexto.
- `createdAt`: fecha y hora de creación.
- `guideline`: guía utilizada.
- `statistics`: estadísticas recibidas.
- `findings`: hallazgos devueltos por las reglas.
- `result`: resultado agregado construido por `buildClinicalAnalysisResult`.
- `summary`: resumen textual de si se generaron hallazgos.

El resumen técnico actual está en inglés: `Clinical findings generated.` o `No clinical findings detected.`.

## Relación con otros módulos

```text
Mediciones del período
        ↓
Estadísticas
        ↓
ClinicalAnalysisInput
        ↓
ClinicalAnalysisDomainService
        ↓
Reglas clínicas
        ↓
Hallazgos y resultado agregado
        ↓
Consumidores de la evaluación
```

El servicio no consulta SQLite directamente, no presenta interfaz y no reemplaza a las reglas individuales. La composición de reglas y sus condiciones de ejecución se mantienen centralizadas para que el análisis tenga un punto de entrada común.

## Archivos relacionados

- `src/domain/clinical/services/ClinicalAnalysisDomainService.ts`
- `src/domain/clinical/services/ClinicalAnalysisService.ts`
- `src/domain/clinical/services/ClinicalAnalysisResultBuilder.ts`
- `src/domain/clinical/rules/ClinicalRule.ts`
- `src/domain/clinical/rules/ClinicalRuleContext.ts`
- [Dominio clínico](04_CLINICAL_DOMAIN.md)
- [Motor de reglas clínicas](05_CLINICAL_RULE_ENGINE.md)
- [Reportes](07_REPORTS.md)

## Consideraciones de uso

La evaluación depende de los datos que recibe y de las reglas configuradas en la versión de la aplicación. Un hallazgo automatizado es información de seguimiento y no constituye, por sí solo, un diagnóstico médico.