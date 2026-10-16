# Clinical Rule 002 — Home Blood Pressure Trend

## Purpose

Evaluate the temporal evolution of home blood pressure measurements.

This rule interprets an existing statistical trend.

It does not calculate trends.

---

## Input

StatisticsSummary:

- trend

Possible values:

- up
- down
- stable

---

## Logic

When:

trend = up

Generate a clinical finding indicating increasing
home blood pressure pattern.

When:

trend = stable

No finding is generated.

When:

trend = down

No finding is generated.

---

## Output

ClinicalFinding:

Type:

home-blood-pressure-trend

Example:

"Tendencia ascendente de presión arterial domiciliaria"

---

## Limitations

This rule:

- does not establish hypertension diagnosis;
- does not replace clinical evaluation;
- depends on the quality and quantity of measurements.

---

## Traceability

Source:

ClinicalAnalysis specification

Related:

Consenso Argentino de Hipertensión Arterial 2025
