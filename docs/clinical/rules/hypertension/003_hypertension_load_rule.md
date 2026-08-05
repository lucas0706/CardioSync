# Clinical Rule 003 — Hypertension Load

## Purpose

Evaluate the proportion of elevated blood pressure measurements
within a home monitoring period.

This rule interprets an existing statistical indicator.

It does not calculate hypertension load.

---

## Input

StatisticsSummary:

- hypertensionLoad

---

## Logic

When hypertensionLoad indicates a relevant proportion
of elevated measurements, generate a clinical finding.

The calculation is performed by StatisticsEngine.

---

## Output

ClinicalFinding:

Type:

hypertension-load

Example:

"Alta carga de mediciones de presión arterial elevada"

---

## Limitations

This rule:

- does not establish hypertension diagnosis;
- does not replace clinical evaluation;
- depends on the measurement period and data quality.

---

## Traceability

Source:

Consenso Argentino de Hipertensión Arterial 2025

Related:

Statistics V2 HypertensionLoadCalculator
