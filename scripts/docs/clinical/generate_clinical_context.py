from pathlib import Path


CONTENT = r"""
# ClinicalContext

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el dominio ClinicalContext dentro de CardioSync.

ClinicalContext representa el conjunto de información clínica adicional asociado
a una medición específica de presión arterial.

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

# 3. Responsabilidad

ClinicalContext:

- describe el contexto de una medición;
- aporta información complementaria;
- permite interpretación posterior.

ClinicalContext NO:

- clasifica hipertensión;
- genera alertas;
- recomienda tratamientos;
- modifica mediciones.

---

# 4. Modelo conceptual

ClinicalContext es un Aggregate compuesto.

Componentes:

- MeasurementContext
- Anthropometry
- VitalSigns
- LifestyleContext
- CardiovascularSymptoms
- ClinicalNotes

---

# 5. Relación con BloodPressureRecord

BloodPressureRecord

1

↓

0..1

ClinicalContext


Una medición puede existir sin contexto adicional.

---

# 6. Relación con ClinicalAnalysis

ClinicalContext

↓

ClinicalAnalysis


ClinicalAnalysis interpreta.

ClinicalContext describe.

---

# 7. Independencia de fuentes

El dominio no depende del origen del dato.

Fuentes posibles:

- Manual
- Health Connect
- Importación
- Proveedores futuros

El dominio almacena información clínica, no tecnología.

---

# 8. Componentes internos

## MeasurementContext

Describe cómo se obtuvo la medición.

Incluye:

- tipo de medición;
- posición;
- brazo;
- condiciones del procedimiento.

---

## Anthropometry

Información corporal:

- peso;
- talla;
- IMC derivado.

---

## VitalSigns

Signos vitales:

- frecuencia cardíaca;
- SpO2;
- frecuencia respiratoria.

---

## LifestyleContext

Contexto reciente:

- sueño;
- actividad física;
- ejercicio.

---

## CardiovascularSymptoms

Síntomas relacionados:

- dolor torácico;
- disnea;
- palpitaciones;
- síntomas neurológicos asociados.

---

# 9. ClinicalContextBuilder

Responsabilidad:

Construir un ClinicalContext combinando:

- datos manuales;
- proveedores externos;
- reglas temporales;
- calidad del dato.

---

# 10. ClinicalDataProvider

Interfaz conceptual para obtener datos clínicos.

Implementaciones futuras:

- ManualProvider
- HealthConnectProvider
- ImportProvider

---

# 11. ContextQualityEngine

Evalúa:

- completitud;
- vigencia;
- consistencia;
- confianza.

---

# 12. ContextAssistant

Entrega sugerencias al usuario.

Ejemplos:

- datos encontrados automáticamente;
- datos faltantes;
- conflictos;
- advertencias.

---

# 13. ADR

## ADR-007

ClinicalContext representa exclusivamente el contexto clínico de una medición.

---

## ADR-008

ClinicalContext será un Aggregate compuesto.

---

## ADR-009

El dominio será independiente del origen de datos.

---

## ADR-010

ClinicalContext será construido mediante ClinicalContextBuilder.

---

# 14. Decisiones congeladas

- BloodPressureRecord continúa siendo el núcleo.
- ClinicalContext es opcional.
- ClinicalAnalysis permanece separado.
- Health Connect no será una dependencia del dominio.
- Los proveedores serán intercambiables.

---

# 15. Trazabilidad

Fuentes:

- Consenso Argentino de Hipertensión Arterial 2025.
- ESC Guidelines 2024.
- AHA/ACC Guideline 2025.
- ISH Global Hypertension Practice Guidelines 2020.

"""


def main():
    output = Path("docs/clinical/03_CLINICAL_CONTEXT.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
