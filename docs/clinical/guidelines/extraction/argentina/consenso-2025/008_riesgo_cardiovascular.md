# Extracción 008 — Riesgo cardiovascular global en hipertensión arterial

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

# Sección

Estratificación del riesgo cardiovascular global.

---

# Clinical Statement

La evaluación del paciente con hipertensión arterial no debe limitarse
al valor de presión arterial.

Debe considerar el riesgo cardiovascular global incorporando:

- factores de riesgo;
- condiciones clínicas asociadas;
- lesiones de órgano blanco;
- modificadores de riesgo.

---

# Componentes del riesgo cardiovascular

## Factores de riesgo cardiovascular

La evaluación debe incluir:

- edad;
- tabaquismo;
- dislipidemia;
- obesidad;
- diabetes mellitus;
- antecedentes familiares;
- otros factores clínicos relevantes.

---

## Condiciones clínicas asociadas

La presencia de enfermedad cardiovascular establecida modifica el riesgo.

Debe considerarse:

- enfermedad coronaria;
- accidente cerebrovascular;
- insuficiencia cardíaca;
- enfermedad renal crónica;
- enfermedad vascular periférica.

---

## Lesión de órgano blanco

La hipertensión puede producir daño subclínico.

Debe evaluarse:

- hipertrofia ventricular izquierda;
- alteraciones renales;
- daño vascular;
- otras manifestaciones de órgano blanco.

---

# Clinical Meaning

Dos pacientes con igual presión arterial pueden presentar
riesgos cardiovasculares diferentes.

La interpretación requiere integrar:

Presión arterial

+

Factores individuales

+

Daño de órgano blanco

+

Enfermedades asociadas

---

# Impacto CardioSync

## ClinicalContext

Debe permitir almacenar información clínica adicional a la medición.

Ejemplos:

- antecedentes;
- factores de riesgo;
- enfermedades asociadas.

---

## RiskEngine

Debe recibir:

- datos de presión arterial;
- contexto clínico;
- antropometría;
- signos vitales;
- información metabólica.

---

## ClinicalAnalysis

No debe interpretar hipertensión solamente por umbral de presión.

Debe considerar riesgo global.

---

# Decisión arquitectónica

El riesgo cardiovascular no pertenece a BloodPressureRecord.

Debe construirse como una capa superior:

BloodPressureRecord

+

ClinicalContext

+

RiskFactors

↓

RiskAssessment

---

# Traceability

Fuente:

Consenso Argentino de Hipertensión Arterial 2025

Archivo:

Suplemento6+2025_consensoHTA+2B_avisos-5-64.pdf

