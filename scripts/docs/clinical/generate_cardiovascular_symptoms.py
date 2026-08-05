from pathlib import Path


CONTENT = r"""
# CardiovascularSymptoms

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el componente CardiovascularSymptoms dentro de ClinicalContext.

CardiovascularSymptoms representa síntomas relacionados con el sistema
cardiovascular o posibles manifestaciones clínicas asociadas a una medición
de presión arterial.

No representa un diagnóstico.

No determina una emergencia clínica.

No reemplaza una evaluación médica.

---

# 2. Principio fundamental

Una medición de presión arterial debe poder interpretarse considerando
síntomas relevantes presentes alrededor del momento de la medición.

CardioSync separa:

Dato medido:

BloodPressureRecord

de:

Manifestaciones clínicas asociadas:

CardiovascularSymptoms

de:

Interpretación:

ClinicalAnalysis

---

# 3. Decisión de nomenclatura

No utilizar:

Symptoms

como nombre del componente.

Motivo:

Es demasiado amplio y puede incluir información no relacionada con el
objetivo cardiovascular de CardioSync.

Nombre definido:

CardiovascularSymptoms

---

# 4. Responsabilidad

CardiovascularSymptoms responde:

¿Qué síntomas cardiovasculares o asociados estaban presentes alrededor de
esta medición?

No responde:

¿Qué diagnóstico tiene el paciente?

No responde:

¿Qué tratamiento debe recibir?

---

# 5. Componentes iniciales

## ChestPain

Dolor torácico.

Información posible:

- presencia;
- intensidad;
- duración;
- características.


---

## Dyspnea

Disnea o dificultad respiratoria.

Información posible:

- presencia;
- intensidad;
- relación temporal.


---

## Palpitations

Sensación de palpitaciones.

Información posible:

- presencia;
- duración;
- frecuencia percibida.


---

## NeurologicalAssociatedSymptoms

Síntomas neurológicos asociados cuando sean relevantes para la interpretación.

Ejemplos:

- alteraciones visuales;
- déficit neurológico;
- síntomas compatibles con afectación aguda.


---

# 6. PainScale

Decisión CardioSync:

PainScale no será un componente independiente general.

Motivo:

El dolor es un síntoma subjetivo y su valor depende del contexto clínico.

Si se utiliza una escala de intensidad, deberá estar asociada al síntoma
correspondiente.

Ejemplo:

ChestPain

├── present

├── severity

└── duration


No:

PainScale aislado.


---

# 7. Modelo conceptual

CardiovascularSymptoms

├── ChestPain

├── Dyspnea

├── Palpitations

├── NeurologicalAssociatedSymptoms

└── AdditionalSymptoms


---

# 8. Relación temporal

Los síntomas tienen alta dependencia temporal.

La relevancia aumenta cuando:

- aparecen antes de la medición;
- están presentes durante la medición;
- continúan después de la medición.


Un síntoma histórico no debe asociarse automáticamente a una medición nueva.


---

# 9. Integración con ClinicalContextBuilder

ClinicalContextBuilder puede recibir síntomas desde:

- ingreso manual;
- cuestionarios;
- futuras integraciones.

No debe inferir síntomas automáticamente sin una fuente confiable.


Flujo:

Usuario / Provider

↓

ClinicalDataProvider

↓

ClinicalContextBuilder

↓

CardiovascularSymptoms

↓

ClinicalContext


---

# 10. Integración con ClinicalAnalysis

ClinicalAnalysis puede utilizar:

- presión arterial;
- signos vitales;
- síntomas;
- guía clínica seleccionada.

ClinicalContext solamente aporta información.

No interpreta.


---

# 11. Decisiones arquitectónicas

## ADR-019

Los síntomas cardiovasculares pertenecen a ClinicalContext y no a
BloodPressureRecord.


## ADR-020

Los síntomas se modelan por dominio clínico específico y no como una lista
genérica.


## ADR-021

La escala de dolor no será una entidad independiente.


---

# 12. Riesgos

Evitar:

- convertir síntomas en diagnósticos;
- mezclar antecedentes con síntomas actuales;
- crear reglas clínicas dentro del contexto;
- utilizar síntomas sin referencia temporal.


---

# 13. Impacto en CardioSync

Utilizado por:

- ClinicalContextBuilder;
- ClinicalAnalysisEngine;
- ContextAssistant;
- AlertEngine futuro.


---

# 14. Estado

Draft.

Pendiente de integración con:

- ClinicalGuideline;
- ClinicalAnalysis;
- AlertEngine.


"""


def main():
    output = Path("docs/clinical/07_CARDIOVASCULAR_SYMPTOMS.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
