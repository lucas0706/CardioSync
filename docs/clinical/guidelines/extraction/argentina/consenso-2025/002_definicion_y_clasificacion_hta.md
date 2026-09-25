# Extracción 002 — Definición y clasificación de hipertensión arterial

## Fuente

Documento:

Consenso Argentino de Hipertensión Arterial 2025

Organizaciones:

- Federación Argentina de Cardiología (FAC)
- Sociedad Argentina de Hipertensión Arterial (SAHA)
- Sociedad Argentina de Cardiología (SAC)

Referencia:

Rev Fed Arg Cardiol. 2025; 54 (Suplemento 6): 5-64

---

## Ubicación

Página:

10

Sección:

Definición y Clasificación de la Hipertensión Arterial

Tabla relacionada:

Tabla 1. Clasificación de la presión arterial en consultorio en individuos con edad ≥16 años.

---

## Clinical Statement

El consenso establece que la hipertensión arterial es una enfermedad crónica
de etiología multifactorial, controlable, que disminuye la calidad y
expectativa de vida.

La presión arterial se relaciona de forma creciente, exponencial y continua
con el riesgo cardiovascular.

Los valores:

- presión arterial sistólica ≥140 mmHg
y/o
- presión arterial diastólica ≥90 mmHg

se consideran el umbral para el diagnóstico de hipertensión arterial.

---

## Clasificación de presión arterial en consultorio

Adultos ≥16 años:

| Categoría | Sistólica | Diastólica |
|---|---:|---:|
| PA Normal | <130 mmHg | <80 mmHg |
| PA Limítrofe | 130-139 mmHg | 80-89 mmHg |
| HTA nivel 1 | 140-159 mmHg | 90-99 mmHg |
| HTA nivel 2 | ≥160 mmHg | ≥100 mmHg |
| HTA sistólica aislada | ≥140 mmHg | <90 mmHg |

Criterio:

Basado en el promedio de tres lecturas obtenidas en la visita inicial con
equipo y técnica recomendada.

Cuando PAS y PAD corresponden a categorías diferentes, se selecciona la
categoría más alta.

---

## Clinical Meaning

La interpretación de una medición de presión arterial requiere:

- valores originales de PAS y PAD;
- contexto de medición;
- método utilizado;
- criterio diagnóstico aplicado.

Una medición aislada no debe confundirse automáticamente con diagnóstico.

---

## CardioSync Impact

### BloodPressureRecord

Debe almacenar:

- systolic;
- diastolic;
- fecha y hora;
- fuente de medición.

No debe almacenar directamente el diagnóstico.

---

### ClinicalGuideline

Debe contener reglas versionadas:

- umbral diagnóstico;
- clasificación;
- población aplicable.

---

### ClinicalAnalysis

Debe calcular la interpretación utilizando:

BloodPressureRecord

+

ClinicalGuideline

---

### Statistics

Debe permitir analizar:

- distribución de categorías;
- evolución temporal;
- control de presión arterial.

---

## Decision

CardioSync debe separar:

Dato registrado:

BloodPressureRecord

↓

Clasificación clínica:

ClinicalGuideline

↓

Interpretación:

ClinicalAnalysis

La clasificación no debe persistirse como dato primario de medición.

---

## Traceability

Fuente:

Consenso Argentino de Hipertensión Arterial 2025

Página:

10

Tabla:

Tabla 1

Archivo:

Suplemento6+2025_consensoHTA+2B_avisos-5-64.pdf
