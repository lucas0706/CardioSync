# Guideline Comparison

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir la estructura de comparación entre las guías clínicas utilizadas por
CardioSync.

Este documento no reemplaza las guías originales.

Su objetivo es identificar:

- conceptos comunes;
- diferencias relevantes;
- impacto arquitectónico;
- decisiones necesarias para soportar múltiples guías.

---

# 2. Guías consideradas

CardioSync considera inicialmente:

## Argentina

Consenso Argentino de Hipertensión Arterial 2025.


## Europa

ESC Guidelines 2024.


## Estados Unidos

AHA/ACC Guideline 2025.


## Internacional

ISH Global Hypertension Practice Guidelines 2020.


---

# 3. Principio fundamental

Las guías pueden diferir.

CardioSync no debe forzar una única interpretación clínica.

La arquitectura debe permitir:

Misma medición

+

Mismo contexto

+

Guía diferente

↓

Análisis diferente


---

# 4. Áreas de comparación

## 4.1 Definición de hipertensión

Comparar:

- umbrales diagnósticos;
- categorías;
- nomenclatura utilizada.


---

## 4.2 Objetivos terapéuticos

Comparar:

- valores objetivo;
- grupos especiales;
- criterios de seguimiento.


---

## 4.3 Medición domiciliaria y ambulatoria

Comparar:

- uso de MAPA;
- uso de MDPA;
- confirmación diagnóstica.


---

## 4.4 Estratificación de riesgo

Comparar:

- factores considerados;
- modelos utilizados;
- impacto sobre decisiones.


---

## 4.5 Seguimiento

Comparar:

- frecuencia de controles;
- evaluación longitudinal;
- criterios de reevaluación.


---

# 5. Modelo arquitectónico

ClinicalGuideline

↓

GuidelineRules

↓

ClinicalAnalysisEngine

↓

ClinicalAnalysis


Cada guía aporta reglas propias.

El motor permanece independiente.


---

# 6. Decisiones arquitectónicas

## ADR-046

Las diferencias entre guías serán modeladas mediante estrategias intercambiables.


## ADR-047

Nunca mezclar reglas de diferentes guías dentro de un mismo análisis.


## ADR-048

Cada análisis histórico debe conservar la guía utilizada.


## ADR-049

Las actualizaciones de guías deben generar nuevas versiones.


---

# 7. Riesgos

Evitar:

- sobrescribir versiones antiguas;
- ocultar diferencias entre guías;
- utilizar valores clínicos sin referencia;
- crear lógica duplicada por guía.


---

# 8. Impacto en CardioSync

Utilizado por:

- ClinicalGuideline;
- ClinicalAnalysisEngine;
- configuración del usuario;
- reportes;
- auditoría clínica.


---

# 9. Estado

Draft.

Pendiente:

- extracción detallada de cada guía;
- tablas comparativas;
- definición de reglas implementables.
