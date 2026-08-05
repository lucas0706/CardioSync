from pathlib import Path


CONTENT = r"""
# Clinical Data Dictionary

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el diccionario conceptual de datos clínicos utilizados por CardioSync.

Este documento establece:

- significado clínico;
- ubicación dentro del dominio;
- unidad esperada;
- origen posible;
- relación con otros módulos.

No define todavía el esquema final de base de datos.

---

# 2. Principio fundamental

Los datos clínicos deben tener:

- significado explícito;
- unidad definida;
- origen trazable;
- contexto temporal;
- responsabilidad clara.

---

# 3. BloodPressureRecord

## systolic

Nombre:

Presión arterial sistólica.

Unidad:

mmHg.

Responsabilidad:

Medición principal.


---

## diastolic

Nombre:

Presión arterial diastólica.

Unidad:

mmHg.

Responsabilidad:

Medición principal.


---

## heartRate

Nombre:

Frecuencia cardíaca.

Unidad:

lpm.

Ubicación futura:

VitalSigns.

---

# 4. Anthropometry

## weight

Nombre:

Peso corporal.

Unidad:

kg.

Fuentes:

- manual;
- Health Connect;
- importación.


---

## height

Nombre:

Talla corporal.

Unidad:

cm o m.

---

## BMI

Nombre:

Índice de masa corporal.

Tipo:

Valor derivado.

Cálculo:

peso + talla.


---

# 5. VitalSigns

## oxygenSaturation

Nombre:

Saturación periférica de oxígeno.

Unidad:

%.


---

## respiratoryRate

Nombre:

Frecuencia respiratoria.

Unidad:

respiraciones/minuto.


---

# 6. LifestyleContext

## sleep

Nombre:

Información de sueño reciente.

Fuentes:

- manual;
- Health Connect.


---

## physicalActivity

Nombre:

Actividad física reciente.

Fuentes:

- manual;
- Health Connect;
- wearable.


---

# 7. CardiovascularSymptoms

## chestPain

Dolor torácico asociado temporalmente.


---

## dyspnea

Disnea asociada temporalmente.


---

## palpitations

Palpitaciones asociadas temporalmente.


---

# 8. Metadata común

Los valores clínicos pueden requerir:

## source

Origen:

- manual;
- health_connect;
- import;
- future_provider.


---

## measuredAt

Fecha y hora del dato.


---

## confidence

Nivel de confianza del dato.


---

# 9. Interoperabilidad futura

El modelo deberá permitir integración futura con:

- Health Connect;
- FHIR;
- LOINC;
- otros estándares clínicos.

---

# 10. Reglas

No almacenar:

- datos sin unidad;
- datos sin origen cuando sea relevante;
- valores derivados inconsistentes.

---

# 11. Estado

Draft.

Pendiente:

- mapeo completo FHIR;
- mapeo LOINC;
- validación final del dominio.


"""


def main():
    output = Path("docs/clinical/18_CLINICAL_DATA_DICTIONARY.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
