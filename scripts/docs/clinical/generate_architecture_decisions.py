from pathlib import Path


CONTENT = r"""
# Architecture Decisions

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Documentar las principales decisiones arquitectónicas tomadas durante el diseño
del dominio clínico de CardioSync.

Estas decisiones establecen las reglas que deberán respetarse durante la
implementación.

---

# 2. ADR-007

## ClinicalContext representa el contexto de una medición

### Contexto

La medición de presión arterial necesita información adicional para su
interpretación.

### Decisión

ClinicalContext representa exclusivamente información asociada a una medición
específica.

### Consecuencias

Positivas:

- evita convertir CardioSync en una historia clínica completa;
- mantiene BloodPressureRecord como núcleo;
- facilita análisis reproducibles.

Negativas:

- algunos datos clínicos deberán modelarse en otros dominios futuros.

---

# 3. ADR-008

## ClinicalContext será un Aggregate compuesto

### Contexto

Los datos clínicos asociados tienen diferente naturaleza.

### Decisión

ClinicalContext se dividirá en componentes especializados:

- MeasurementContext;
- Anthropometry;
- VitalSigns;
- LifestyleContext;
- CardiovascularSymptoms.

### Consecuencias

Positivas:

- mejor separación de responsabilidades;
- mayor extensibilidad;
- menor acoplamiento.

---

# 4. ADR-009

## El dominio será independiente del origen de datos

### Contexto

CardioSync podrá obtener datos desde múltiples fuentes.

### Decisión

El dominio representa información clínica, no tecnologías.

Fuentes posibles:

- manual;
- Health Connect;
- importación;
- proveedores futuros.

### Consecuencias

Positivas:

- permite nuevas integraciones;
- evita dependencia tecnológica.

---

# 5. ADR-010

## ClinicalContext será construido mediante ClinicalContextBuilder

### Contexto

La construcción del contexto puede requerir combinar múltiples fuentes.

### Decisión

La creación del contexto será responsabilidad de un Builder dedicado.

### Consecuencias

Positivas:

- reglas centralizadas;
- mejor testabilidad;
- separación UI/dominio.

---

# 6. ADR-011

## MeasurementContext separado de BloodPressureRecord

### Decisión

Las condiciones de medición no forman parte del registro principal.

---

# 7. ADR-012

## El procedimiento de medición no se mezcla con interpretación clínica

### Decisión

MeasurementContext describe.

ClinicalAnalysis interpreta.

---

# 8. ADR-013

## Anthropometry pertenece a ClinicalContext

### Decisión

Peso, talla e IMC contextual no forman parte de BloodPressureRecord.

---

# 9. ADR-014

## BMI será un valor derivado

### Decisión

El IMC se calculará desde peso y talla.

No se permitirá inconsistencia entre valores.

---

# 10. ADR-016

## VitalSigns pertenece a ClinicalContext

### Decisión

FC, SpO2 y frecuencia respiratoria serán información contextual.

---

# 11. ADR-019

## Síntomas cardiovasculares como dominio específico

### Decisión

No utilizar un modelo genérico de síntomas.

---

# 12. ADR-022

## LifestyleContext representa factores recientes

### Decisión

Sueño y actividad física asociados a una medición pertenecen al contexto
cuando tengan relevancia temporal.

---

# 13. ADR-025

## ClinicalGuideline será una entidad independiente

### Decisión

Las guías son intercambiables.

---

# 14. ADR-026

## ClinicalAnalysisEngine no contiene reglas clínicas embebidas

### Decisión

Las reglas pertenecen a ClinicalGuideline.

---

# 15. ADR-029

## ClinicalAnalysis será una entidad independiente

### Decisión

Los resultados de interpretación deben conservar trazabilidad.

---

# 16. ADR-033

## RecommendationEngine separado de ClinicalAnalysis

### Decisión

Interpretar y recomendar son responsabilidades diferentes.

---

# 17. ADR-036

## AlertEngine no realiza diagnóstico

### Decisión

Las alertas comunican información relevante.

---

# 18. ADR-042

## Statistics separado de ClinicalAnalysis

### Decisión

El análisis estadístico y el clínico tienen objetivos diferentes.

---

# 19. Principios generales

CardioSync seguirá estos principios:

- registrar primero;
- enriquecer después;
- interpretar al final.

El dominio clínico debe permanecer:

- desacoplado;
- trazable;
- versionable;
- extensible.

---

# 20. Estado

Draft.

Pendiente:

- revisión clínica final;
- implementación;
- validación mediante pruebas.


"""


def main():
    output = Path("docs/clinical/16_ARCHITECTURE_DECISIONS.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
