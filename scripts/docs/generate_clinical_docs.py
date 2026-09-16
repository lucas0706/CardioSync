from pathlib import Path


DOCUMENT = """
# ClinicalContext

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Este documento define el dominio ClinicalContext dentro de CardioSync.

ClinicalContext representa el conjunto de información clínica adicional asociada
a una medición específica de presión arterial, utilizada para mejorar su
interpretación.

No representa una historia clínica completa.

No representa un paciente.

No representa un diagnóstico.

---

# 2. Principio fundamental

CardioSync mantiene la medición como núcleo del dominio.

Flujo:

BloodPressureRecord

↓

ClinicalContext

↓

ClinicalAnalysis

↓

Statistics

---

# 3. Responsabilidades

ClinicalContext:

- describe el contexto de una medición;
- aporta información complementaria;
- permite análisis posteriores.

ClinicalContext NO:

- clasifica hipertensión;
- genera alertas;
- recomienda tratamientos;
- modifica mediciones.

---

# 4. Componentes previstos

ClinicalContext estará compuesto por:

- MeasurementContext
- Anthropometry
- VitalSigns
- LifestyleContext
- CardiovascularSymptoms
- Notes

Cada componente tendrá una especificación independiente.

---

# 5. Decisiones arquitectónicas

ADR-007

ClinicalContext representa exclusivamente el contexto clínico
de una medición.


ADR-008

ClinicalContext será un agregado compuesto.


ADR-009

El dominio será independiente del origen de datos.


ADR-010

ClinicalContext será construido mediante ClinicalContextBuilder.

---

# 6. Trazabilidad

Fuentes:

- Consenso Argentino de Hipertensión Arterial 2025
- ESC Guidelines 2024
- AHA/ACC Guideline 2025
- ISH Global Hypertension Practice Guidelines 2020

---

# Estado

Draft.
"""


def main():
    path = Path("docs/clinical/03_CLINICAL_CONTEXT.md")

    path.parent.mkdir(parents=True, exist_ok=True)

    path.write_text(
        DOCUMENT.strip() + "\n",
        encoding="utf-8"
    )

    print(f"Created {path}")


if __name__ == "__main__":
    main()
