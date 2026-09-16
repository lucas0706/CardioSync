# Clinical Rule 005 — Blood Pressure Variability

## Purpose

Evaluate increased variability in home blood pressure measurements.

This rule interprets an existing statistical indicator.

It does not calculate variability.

---

## Input

StatisticsSummary:

- systolicVariability
- diastolicVariability

---

## Logic

When variability values indicate increased
blood pressure fluctuation, generate a clinical finding.

The calculation is performed by StatisticsEngine.

---

## Output

ClinicalFinding:

Type:

blood-pressure-variability

Example:

"Variabilidad elevada de presión arterial domiciliaria"

---

## Limitations

This rule:

- does not establish hypertension diagnosis;
- requires adequate measurement history;
- should be interpreted in clinical context.

---

## Traceability

Source:

Consenso Argentino de Hipertensión Arterial 2025

Related:

Statistics V2 VariabilityCalculator
