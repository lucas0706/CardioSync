# Clinical Historical Validation V2

## Objetivo

Validar Clinical Analysis usando múltiples registros históricos.

No se utilizó un valor manual.

## Escenario

Entrada:

30 BloodPressureRecord simulados

Flujo:

BloodPressureRecord[]
        |
        v
StatisticsDomainService
        |
        v
StatisticsSummary
        |
        v
ClinicalAnalysisDomainService
        |
        v
Clinical Findings


## Resultado

Statistics:

Average systolic:
134.96

Average diastolic:
82.66

Trend:
up

Hypertension load:
50


## Findings generados

- Tendencia ascendente de presión arterial domiciliaria
- Carga elevada de mediciones de presión arterial
- Presión arterial por encima del objetivo terapéutico
- Presión arterial elevada


## Conclusión

Clinical Engine validado con flujo histórico.

Próximas evoluciones:

- filtro temporal
- reportes
- integración futura con Health Connect


---

## Validación contextual V2

Se validaron cuatro escenarios: GENERAL, DIABETES, CKD y ELDERLY.

GENERAL → arg-hta-2025-adults-16-79 → dentro del objetivo terapéutico.

DIABETES → arg-hta-2025-diabetes → por encima del objetivo terapéutico.

CKD → arg-hta-2025-ckd → por encima del objetivo terapéutico.

ELDERLY → arg-hta-2025-elderly-80 → por encima del objetivo terapéutico.

La selección contextual de ClinicalTarget fue validada en runtime.


## Clasificación clínica V2

Categorías activas: normal, borderline, grade-1, grade-2, isolated-systolic.

Prueba funcional: 129/79 → normal; 130/80 → borderline; 139/89 → borderline; 140/89 → isolated-systolic; 140/90 → grade-1; 159/99 → grade-1; 160/100 → grade-2; 180/80 → isolated-systolic; 120/69 → normal.

Resultado: CLASSIFICATION TEST: PASS.
