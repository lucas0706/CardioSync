from pathlib import Path


CONTENT = r"""
# VitalSigns

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el componente VitalSigns dentro de ClinicalContext.

VitalSigns representa parámetros fisiológicos adicionales asociados temporalmente
a una medición de presión arterial.

No reemplaza la medición principal.

No genera diagnóstico.

No realiza interpretación clínica.

---

# 2. Principio fundamental

BloodPressureRecord registra la presión arterial obtenida.

VitalSigns aporta información complementaria del estado fisiológico del paciente
en un momento cercano a esa medición.

Separación:

BloodPressureRecord

↓

valor de presión arterial


VitalSigns

↓

estado fisiológico asociado

---

# 3. Componentes iniciales

## HeartRate

Representa la frecuencia cardíaca.

Unidad:

lpm (latidos por minuto)


Origen posible:

- ingreso manual;
- Health Connect;
- wearable;
- importación.

---

## OxygenSaturation

Representa saturación periférica de oxígeno.

Unidad:

%

Nombre de dominio:

SpO2


Origen posible:

- ingreso manual;
- Health Connect;
- dispositivos compatibles.

---

## RespiratoryRate

Representa frecuencia respiratoria.

Unidad:

respiraciones por minuto.


---

# 4. Modelo conceptual

VitalSigns

├── HeartRate

├── OxygenSaturation

└── RespiratoryRate


---

# 5. Relación temporal

Los signos vitales tienen alta sensibilidad temporal.

La utilidad contextual depende de la cercanía entre:

- momento de medición;
- momento de obtención del signo vital.


Ejemplo:

Frecuencia cardíaca obtenida durante la medición:

alta relevancia contextual.


Frecuencia cardíaca obtenida semanas antes:

sin utilidad para esa medición.


---

# 6. Integración con ClinicalContextBuilder

ClinicalContextBuilder será responsable de:

- buscar signos vitales disponibles;
- evaluar proximidad temporal;
- seleccionar valores adecuados;
- informar calidad y origen.


Flujo:

ClinicalDataProvider

↓

ClinicalContextBuilder

↓

VitalSigns

↓

ClinicalContext


---

# 7. Integración con Health Connect

Health Connect puede actuar como proveedor externo.

Ejemplo:

Health Connect

↓

HeartRate

↓

ClinicalDataProvider

↓

ClinicalContextBuilder

↓

VitalSigns


El dominio no conoce Health Connect.

---

# 8. Value Objects clínicos

Los signos vitales deben mantener metadata:

- valor;
- unidad;
- origen;
- fecha de medición;
- confianza.


Ejemplo conceptual:

ClinicalValue<number>

value

unit

source

measuredAt

confidence


---

# 9. Decisiones arquitectónicas

## ADR-016

Los signos vitales pertenecen a ClinicalContext y no a BloodPressureRecord.


## ADR-017

La relevancia de un signo vital depende de su proximidad temporal.


## ADR-018

Los proveedores externos nunca serán dependencias del dominio.


---

# 10. Riesgos

Evitar:

- mezclar signos vitales con presión arterial;
- usar datos antiguos sin evaluación;
- almacenar valores sin unidad;
- depender de un proveedor específico.


---

# 11. Impacto en CardioSync

Utilizado por:

- ClinicalContextBuilder;
- ContextQualityEngine;
- ClinicalAnalysisEngine;
- Health Connect;
- Exportación.


---

# 12. Estado

Draft.

Pendiente de integración con:

- LifestyleContext;
- CardiovascularSymptoms;
- ClinicalAnalysis.


"""


def main():
    output = Path("docs/clinical/06_VITAL_SIGNS.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
