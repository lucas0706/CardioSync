# Clinical Domain Mapping Specification

## Objetivo

Definir la relación entre conceptos clínicos documentados en la
Clinical Knowledge Base y los modelos existentes de CardioSync.

Este documento establece qué información pertenece al dominio de datos,
qué información pertenece a interpretación clínica y qué información
corresponde a reglas futuras.

---

# Principio arquitectónico

CardioSync debe separar:

## Datos observados

Ejemplo:

- presión sistólica;
- presión diastólica;
- frecuencia cardíaca;
- peso.

Representan mediciones realizadas.

---

## Contexto clínico

Ejemplo:

- posición;
- brazo;
- dispositivo;
- antecedentes;
- factores de riesgo;
- estilo de vida.

Representan circunstancias del paciente y la medición.

---

## Interpretación clínica

Ejemplo:

- hipertensión sostenida;
- hipertensión oculta;
- riesgo cardiovascular;
- cumplimiento de objetivos.

Representan conocimiento aplicado.

---

# Mapeo principal

## BloodPressureRecord

Responsabilidad:

Representar una medición individual.

Incluye:

- PAS;
- PAD;
- frecuencia cardíaca;
- fecha/hora;
- datos asociados a la medición.

No debe contener:

- diagnóstico;
- riesgo;
- recomendaciones.

---

## MeasurementContext

Responsabilidad:

Representar las condiciones bajo las cuales fue realizada una medición.

Conceptos relacionados:

- método de medición;
- brazo;
- posición;
- dispositivo;
- tamaño de brazalete;
- origen del registro.

---

## ClinicalContext

Responsabilidad:

Representar características clínicas del paciente.

Incluye:

- antecedentes;
- enfermedades asociadas;
- factores de riesgo;
- poblaciones especiales.

---

## ClinicalGuideline

Responsabilidad:

Representar conocimiento externo basado en guías clínicas.

Debe incluir:

- fuente;
- organización;
- versión;
- población aplicable;
- recomendaciones.

Ejemplo:

Consenso Argentino de Hipertensión Arterial 2025.

---

## ClinicalAnalysis

Responsabilidad:

Interpretar datos combinando:

- mediciones;
- contexto;
- guías clínicas.

Ejemplos:

- clasificación del fenotipo hipertensivo;
- evaluación del control;
- identificación de patrones.

---

# Relación con motores futuros

## RiskEngine

Entrada:

- BloodPressureRecord;
- ClinicalContext;
- factores de riesgo.

Salida:

- estimación de riesgo.

---

## RecommendationEngine

Entrada:

- ClinicalAnalysis;
- ClinicalGuideline.

Salida:

- recomendaciones personalizadas.

---

## AlertEngine

Entrada:

- valores;
- tendencias;
- reglas clínicas.

Salida:

- alertas.

---

# Conceptos del Consenso HTA 2025 mapeados

| Concepto | Modelo |
|---|---|
| Presión arterial | BloodPressureRecord |
| Técnica de medición | MeasurementContext |
| MDPA | MeasurementContext + serie temporal |
| MAPA | futuro modelo específico |
| Fenotipos HTA | ClinicalAnalysis |
| Riesgo cardiovascular | RiskEngine |
| Objetivos terapéuticos | ClinicalGuideline |
| Estilo de vida | ClinicalContext |
| Poblaciones especiales | ClinicalContext |

---

# Decisión arquitectónica

Los documentos clínicos no deben convertirse directamente en código.

Flujo correcto:

Documento clínico

↓

Knowledge Base

↓

Especificación

↓

Modelo de dominio

↓

Implementación

---

Estado:

Documento de mapeo clínico creado.
