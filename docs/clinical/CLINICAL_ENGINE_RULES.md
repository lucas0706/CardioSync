# Clinical Engine Rules V2

## Reglas implementadas

## BloodPressureClassificationRule

Clasifica valores promedio:

- presión arterial baja
- presión arterial elevada
- hipertensión arterial


## BloodPressureSafetyRule

Evalúa:

- presión diastólica baja
- situaciones de precaución


## TherapeuticTargetRule

Compara:

StatisticsSummary

contra:

Clinical Target

Genera:

- dentro del objetivo terapéutico
- por encima del objetivo terapéutico


## HomeBloodPressureControlRule

Evalúa control de presión domiciliaria.


## TrendRule

Evalúa evolución temporal:

- estable
- ascendente
- descendente


## HypertensionLoadRule

Evalúa proporción de mediciones fuera de rango.


## TimeInTargetRule

Evalúa tiempo dentro del rango esperado.


## VariabilityRule

Evalúa dispersión de valores.


## CardiovascularRiskRule

Estructura inicial para futuras evoluciones.


## Guideline

Consenso Argentino de Hipertensión Arterial 2025


---

## Validación V2

ClinicalTargetSelector fue validado con los escenarios GENERAL, DIABETES, CKD y ELDERLY.

TherapeuticTargetRule utiliza el ClinicalTarget seleccionado según ClinicalContext y guideline.

La clasificación activa utiliza cinco categorías: normal, borderline, grade-1, grade-2 e isolated-systolic.
