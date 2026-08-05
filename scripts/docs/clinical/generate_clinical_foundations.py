from pathlib import Path


CONTENT = r"""
# Clinical Foundations

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir los fundamentos clínicos que guían el diseño de CardioSync.

Este documento establece los principios utilizados para modelar:

- mediciones;
- contexto clínico;
- interpretación;
- seguimiento longitudinal.

---

# 2. Principio clínico principal

Una medición aislada de presión arterial representa un evento clínico puntual.

Su interpretación depende de:

- técnica de medición;
- condiciones del registro;
- características del paciente;
- contexto asociado;
- guía clínica utilizada.

---

# 3. Presión arterial como variable longitudinal

CardioSync no debe interpretar únicamente valores aislados.

El seguimiento longitudinal permite analizar:

- evolución temporal;
- tendencia;
- variabilidad;
- respuesta a cambios;
- patrones de comportamiento.

---

# 4. Registro versus interpretación

CardioSync separa:

## Registro

Dato observado.

Ejemplo:

120/80 mmHg.


## Interpretación

Significado clínico del dato.

Ejemplo:

clasificación según una guía seleccionada.


La interpretación nunca debe modificar el registro original.

---

# 5. Calidad de medición

La calidad de una medición depende de factores como:

- técnica correcta;
- posición adecuada;
- condiciones previas;
- dispositivo utilizado;
- repetición cuando corresponde.

Estos elementos pertenecen a MeasurementContext.

---

# 6. Contexto clínico

La misma medición puede tener diferentes interpretaciones dependiendo del
contexto.

Ejemplos:

- síntomas asociados;
- frecuencia cardíaca;
- peso;
- actividad reciente;
- sueño.

---

# 7. Guías clínicas

CardioSync debe soportar múltiples guías.

Cada guía puede definir:

- umbrales;
- categorías;
- objetivos;
- criterios de interpretación.

La guía utilizada debe quedar registrada.

---

# 8. Principios de seguridad clínica

CardioSync debe:

- informar;
- contextualizar;
- ayudar al seguimiento.

No debe:

- diagnosticar automáticamente;
- reemplazar evaluación profesional;
- indicar tratamientos.

---

# 9. Arquitectura derivada

Los principios clínicos generan la siguiente separación:

BloodPressureRecord

↓

ClinicalContext

↓

ClinicalAnalysis

↓

Statistics


---

# 10. Estado

Draft.

Pendiente:

- incorporación detallada de evidencia de guías;
- revisión clínica;
- aprobación.


"""


def main():
    output = Path("docs/clinical/01_CLINICAL_FOUNDATIONS.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
