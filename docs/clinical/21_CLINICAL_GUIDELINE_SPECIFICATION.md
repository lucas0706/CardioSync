# Clinical Guideline Specification

## Objetivo

Definir la representación conceptual de una guía clínica dentro de
CardioSync.

Una guía clínica representa conocimiento médico externo versionado,
trazable y aplicable bajo determinadas condiciones.

---

# Principio arquitectónico

Una guía clínica NO es:

- una medición;
- un diagnóstico almacenado;
- una alerta directa.

Una guía clínica es una fuente de conocimiento que permite interpretar
datos del paciente.

---

# Modelo conceptual

ClinicalGuideline

Representa:

- origen del conocimiento;
- versión;
- población aplicable;
- reglas clínicas;
- recomendaciones.

---

# Información mínima

## Identificación

Debe contener:

- nombre de la guía;
- organización responsable;
- año;
- versión.

Ejemplo:

Consenso Argentino de Hipertensión Arterial 2025

Organizaciones:

- FAC
- SAHA
- SAC

---

## Fuente

Debe conservar:

- documento original;
- referencia bibliográfica;
- ubicación dentro del documento;
- trazabilidad.

Ejemplo:

Página 12-15.

---

## Población aplicable

Una recomendación puede depender de:

- edad;
- sexo;
- comorbilidades;
- situación clínica.

Ejemplo:

Paciente hipertenso con diabetes.

---

## Reglas clínicas

Una guía puede definir:

- umbrales;
- clasificaciones;
- objetivos;
- recomendaciones.

Ejemplos:

- clasificación de hipertensión;
- objetivos de presión arterial;
- criterios de riesgo.

---

# Relación con modelos CardioSync

## BloodPressureRecord

Proporciona:

- datos medidos.

No contiene reglas clínicas.

---

## ClinicalContext

Proporciona:

- características del paciente.

Permite determinar aplicabilidad.

---

## ClinicalGuideline

Proporciona:

- interpretación basada en evidencia.

---

## ClinicalAnalysis

Consume:

- mediciones;
- contexto;
- guía.

Produce:

- interpretación clínica.

---

# Ejemplo conceptual

Entrada:

BloodPressureRecord

PAS: 150 mmHg

PAD: 95 mmHg


Contexto:

Paciente con diabetes.


Guía:

Consenso HTA 2025.


Resultado:

ClinicalAnalysis determina clasificación
según reglas aplicables.

---

# Versionado

Las guías deben ser versionadas.

Ejemplo:

ClinicalGuideline:

Consenso HTA Argentina

Version:

2025

Una actualización futura no debe sobrescribir la anterior.

---

# Compatibilidad futura

El sistema debe permitir múltiples fuentes:

- Argentina;
- AHA;
- ESC;
- ISH.

La fuente debe formar parte del modelo.

---

# Decisión arquitectónica

Separar:

Datos

↓

Contexto

↓

Conocimiento clínico

↓

Interpretación

---

# Impacto futuro

Permite implementar:

- RecommendationEngine;
- RiskEngine;
- AlertEngine.

Sin acoplar reglas clínicas dentro de componentes visuales.

---

# Estado

Especificación conceptual creada.

