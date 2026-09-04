# Clinical Rule 004 — Time In Target

## Purpose

Evaluate the percentage of time that home blood pressure
measurements remain within the expected target range.

This rule interprets an existing statistical indicator.

It does not calculate time in target.

---

## Input

StatisticsSummary:

- timeInTarget

---

## Logic

When timeInTarget indicates insufficient control,
generate a clinical finding.

The calculation is performed by StatisticsEngine.

---

## Output

ClinicalFinding:

Type:

time-in-target

Example:

"Tiempo en objetivo de presión arterial reducido"

---

## Limitations

This rule:

- does not establish hypertension diagnosis;
- depends on the configured clinical target;
- requires adequate measurement history.

---

## Traceability

Source:

Consenso Argentino de Hipertensión Arterial 2025

Related:

Statistics V2 TimeInTargetCalculator
