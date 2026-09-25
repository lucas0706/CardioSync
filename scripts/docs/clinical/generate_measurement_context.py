from pathlib import Path


CONTENT = r"""
# MeasurementContext

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el componente MeasurementContext dentro de ClinicalContext.

MeasurementContext describe las condiciones y características bajo las cuales
se obtuvo una medición de presión arterial.

No representa el valor de presión arterial.

No interpreta el resultado.

No realiza clasificación clínica.

---

# 2. Principio fundamental

Una medición de presión arterial no depende únicamente del valor obtenido.

La calidad e interpretación posterior dependen también de:

- método utilizado;
- condiciones de medición;
- posición;
- procedimiento seguido;
- repetición de mediciones.

MeasurementContext conserva esa información.

---

# 3. Responsabilidad

MeasurementContext responde:

¿Cómo fue obtenida esta medición?

No responde:

¿Qué significa clínicamente esta medición?

Eso pertenece a ClinicalAnalysis.

---

# 4. Relación con BloodPressureRecord

BloodPressureRecord:

Registra el resultado.

Ejemplo:

- PAS
- PAD
- fecha
- hora


MeasurementContext:

Describe el procedimiento.

Ejemplo:

- medición domiciliaria;
- posición sentada;
- brazo utilizado;
- mediciones repetidas.

---

# 5. Modelo conceptual

MeasurementContext forma parte de:

ClinicalContext

↓

MeasurementContext


Es opcional.

Una medición puede existir sin información adicional del procedimiento.

---

# 6. Componentes previstos

## MeasurementType

Define el tipo de medición.

Valores posibles:

- consultorio;
- domicilio;
- monitoreo ambulatorio.

---

## Position

Representa la posición durante la medición.

Ejemplos:

- sentado;
- de pie;
- acostado.

---

## Arm

Representa el brazo utilizado.

Ejemplos:

- izquierdo;
- derecho.

---

## RestPeriod

Representa el tiempo de reposo previo cuando esté disponible.

---

## RepeatedMeasurements

Representa si se realizaron múltiples lecturas.

Información posible:

- cantidad de lecturas;
- promedio utilizado;
- mediciones individuales.

---

# 7. Relación con guías clínicas

Las guías de hipertensión enfatizan que la técnica de medición influye en la interpretación de los valores obtenidos.

Por esta razón CardioSync separa:

Dato medido:

BloodPressureRecord

de:

Condiciones de medición:

MeasurementContext

---

# 8. Independencia tecnológica

MeasurementContext no debe depender de:

- fabricante del dispositivo;
- aplicación externa;
- Health Connect;
- modelo de tensiómetro.

El dominio representa el procedimiento clínico.

---

# 9. Decisiones arquitectónicas

## ADR-011

MeasurementContext será responsable exclusivamente de describir
cómo fue obtenida una medición.

---

## ADR-012

La información del procedimiento no debe almacenarse dentro de
BloodPressureRecord.

---

# 10. Riesgos

Evitar:

- mezclar interpretación clínica con procedimiento;
- almacenar información específica de un proveedor;
- duplicar datos existentes;
- convertir MeasurementContext en una historia clínica.

---

# 11. Impacto en CardioSync

Utilizado por:

- ClinicalContextBuilder;
- ClinicalAnalysisEngine;
- Statistics;
- Exportación.

---

# 12. Estado

Draft.

Pendiente de revisión conjunta con:

- Anthropometry;
- VitalSigns;
- ClinicalAnalysis.

"""


def main():
    output = Path("docs/clinical/04_MEASUREMENT_CONTEXT.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
