# Clinical Rule 006 — Blood Pressure Classification

## Purpose

Transform a blood pressure classification result into
a clinical finding.

This rule does not calculate classification.

Classification is provided by the selected clinical guide engine.

---

## Input

ClinicalResult:

- classification
- guideline

---

## Logic

When a classification result exists,
generate a clinical finding describing the classification.

---

## Output

ClinicalFinding:

Type:

blood-pressure-classification

Example:

"Clasificación de presión arterial: Hipertensión grado 1"

---

## Limitations

This rule:

- does not replace the selected guideline engine;
- depends on the configured clinical guide;
- does not perform diagnosis.

---

## Traceability

Source:

ClinicalGuideline selected by ClinicalEngine
