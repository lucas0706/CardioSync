# Clinical Assessment Boundaries

## Objective

Define the separation between patient context, guideline targets and clinical interpretation.

## Principles

CardioSync does not perform medical diagnosis.

The system does not determine that a patient has a disease based only on measurements.

## Domain separation

### ClinicalContext

Contains clinical information already known or declared.

Examples:

- Diabetes history
- Chronic kidney disease history
- Cardiovascular disease history
- Age
- Lifestyle factors

ClinicalContext does not diagnose conditions.

---

### ClinicalTarget

Contains therapeutic objectives extracted from clinical guidelines.

Examples:

- Blood pressure target <140/90 mmHg
- Desirable target <130/80 mmHg
- Age-specific objectives

Targets represent guideline recommendations.

---

### ClinicalAssessment

Contains interpretation of measurements against configured targets.

Examples:

Valid:

"Measurement is above the configured therapeutic target."

Invalid:

"Patient has uncontrolled hypertension."

---

### ClinicalWarning

Contains safety considerations.

Examples:

- Avoid BP reduction below 120/70 mmHg
- Caution with diastolic pressure below 70 mmHg
- Individualize targets in frail patients

---

## Clinical flow

BloodPressureRecord

        |

        v

ClinicalContext

        |

        v

ClinicalTargetSelector

        |

        v

ClinicalAssessment

        |

        v

ClinicalWarning evaluation


## Current scope

CardioSync provides monitoring and interpretation support.

It does not replace clinical diagnosis or medical evaluation.
