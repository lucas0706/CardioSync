# Clinical Rule 001 — Home Blood Pressure Control

## Source

Guideline:

Consenso Argentino de Hipertensión Arterial 2025

Organizations:

- Federación Argentina de Cardiología (FAC)
- Sociedad Argentina de Hipertensión Arterial (SAHA)
- Sociedad Argentina de Cardiología (SAC)

---

## Purpose

Evaluate home blood pressure patterns using
aggregated measurements.

This rule does not establish diagnosis of hypertension.

It generates a clinical follow-up finding.

---

## Input

StatisticsSummary:

- averageSystolic
- averageDiastolic
- totalMeasurements

---

## Logic

A home blood pressure pattern is considered elevated when:

average systolic pressure >= 135 mmHg

OR

average diastolic pressure >= 85 mmHg

---

## Output

ClinicalFinding:

Type:

home-blood-pressure

Example:

"Presión arterial domiciliaria promedio elevada"

---

## Limitations

This rule does not replace:

- office blood pressure measurement;
- ambulatory monitoring;
- clinical diagnosis.

---

## Traceability

Source:

Consenso Argentino de Hipertensión Arterial 2025
