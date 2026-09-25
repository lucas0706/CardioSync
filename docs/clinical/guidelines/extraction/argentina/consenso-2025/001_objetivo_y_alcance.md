# Extracción 001 — Objetivo y alcance del consenso

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

5

Sección:

Resumen

---

## Clinical Statement

El consenso indica que la hipertensión arterial constituye uno de los
principales factores de riesgo cardiovascular, con alta prevalencia en la
población adulta y una significativa carga de morbimortalidad.

Se destaca que un número considerable de pacientes permanece sin diagnóstico o
con control inadecuado de la presión arterial, incrementando el riesgo de
complicaciones cardiovasculares y daño de órgano blanco.

El documento tiene como objetivo unificar criterios de evaluación, diagnóstico
y tratamiento de la hipertensión arterial.

---

## Clinical Meaning

El documento establece que la evaluación de hipertensión arterial requiere:

- detección precoz;
- evaluación adecuada;
- criterios diagnósticos definidos;
- seguimiento del control de presión arterial.

---

## CardioSync Impact

Impacto en arquitectura:

### BloodPressureRecord

Debe conservar la medición original de presión arterial.

### ClinicalGuideline

Debe representar la guía utilizada para interpretar una medición.

### ClinicalAnalysis

Debe separar:

- dato registrado;
- interpretación clínica.

### Statistics

Debe permitir seguimiento longitudinal del control de presión arterial.

---

## Decision

CardioSync no debe almacenar únicamente valores aislados.

La arquitectura debe permitir:

Medición

↓

Contexto

↓

Interpretación según guía

↓

Seguimiento longitudinal

---

## Traceability

Fuente:

Consenso Argentino de Hipertensión Arterial 2025

Página:

5

Documento:

Suplemento6+2025_consensoHTA+2B_avisos-5-64.pdf
