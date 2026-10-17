# Reglas del motor clínico

**Estado:** contrastado con las reglas de `src/domain/clinical/rules/` el 17-10-2026.

## Composición activa

`ClinicalAnalysisDomainService` compone estas reglas:

| Regla | Comportamiento observado |
|---|---|
| `BloodPressureClassificationRule` | Clasifica la media de PAS/PAD mediante `BloodPressureClassifier` |
| `BloodPressureSafetyRule` | Genera hallazgo si la PAD media es inferior a 70 mmHg |
| `HomeBloodPressureControlRule` | Genera hallazgo si PAS media ≥135 o PAD media ≥85 mmHg |
| `TrendRule` | Genera hallazgo cuando `StatisticsSummary.trend === 'up'` |
| `HypertensionLoadRule` | Genera hallazgo cuando `hypertensionLoad > 0` |
| `TimeInTargetRule` | Genera hallazgo cuando `timeInTarget < 50` |
| `VariabilityRule` | Genera hallazgo si variabilidad sistólica >15 o diastólica >10 |
| `TherapeuticTargetRule` | Selecciona objetivo por guía/contexto y compara promedios, salvo que PAS <120 o PAD <70 |
| `CardiovascularRiskRule` | Genera hallazgo por determinados antecedentes, enfermedad renal crónica o diabetes |

Las reglas que requieren estadísticas se omiten cuando `statistics` no está presente. Los hallazgos son generados en memoria y pueden llevar el identificador de guía.

## Clasificación de presión arterial

`BloodPressureClassifier` implementa cinco categorías para los valores evaluados:

- `normal`: por debajo de los umbrales de la categoría limítrofe.
- `borderline`: PAS ≥130 o PAD ≥80, salvo categorías superiores.
- `grade-1`: PAS ≥140 o PAD ≥90, salvo categoría superior o sistólica aislada.
- `grade-2`: PAS ≥160 o PAD ≥100, excepto la condición sistólica aislada evaluada antes.
- `isolated-systolic`: PAS ≥140 y PAD <90.

El orden de evaluación importa. El clasificador también añade la advertencia `low-diastolic` si la PAD evaluada es inferior a 70; la regla de seguridad del análisis genera un hallazgo separado usando la PAD media.

## Objetivos terapéuticos

Los objetivos están en `src/domain/clinical/targets/guidelines/ConsensoArgentinaHTA2025Targets.ts`. El repositorio solo proporciona objetivos para el Consenso Argentino de HTA 2025. El selector usa una división por edad en 80 años y evalúa condiciones registradas. Tiene limitaciones conocidas: no valida el límite inferior de edad, su fallback puede devolver el objetivo general aunque ninguna condición coincida, y `buena_tolerancia` no se considera verdadera en el matcher actual.

## Métricas estadísticas que consumen las reglas

Los calculadores de carga hipertensiva y tiempo en objetivo usan por defecto PAS 135/PAD 85 mmHg. La tendencia depende de la diferencia entre primer y último valor sistólico ordenado cronológicamente (>3 ascendente, <-3 descendente, en otro caso estable). La variabilidad es el coeficiente de variación porcentual.

## Riesgos y límites

- Los umbrales fijos no se cambian automáticamente al pasar otra guía.
- La severidad de un hallazgo no equivale a un riesgo absoluto calculado.
- No se implementan aquí recomendaciones terapéuticas ni un motor de alertas independiente.
- Las reglas requieren pruebas de límites y revisión clínica antes de ser tratadas como validadas para producción.