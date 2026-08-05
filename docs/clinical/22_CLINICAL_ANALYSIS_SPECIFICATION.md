# Clinical Analysis Specification

## Objetivo

Definir la capa de interpretación clínica de CardioSync.

ClinicalAnalysis transforma datos registrados y contexto clínico en
información interpretada utilizando conocimiento clínico versionado.

---

# Principio arquitectónico

ClinicalAnalysis NO almacena datos primarios.

No reemplaza:

- BloodPressureRecord;
- StatisticsEngine;
- ClinicalGuideline.

Su función es interpretar.

---

# Entradas

ClinicalAnalysis recibe:

## Mediciones

Desde:

BloodPressureRecord

Incluye:

- presión sistólica;
- presión diastólica;
- frecuencia cardíaca;
- fecha y hora;
- evolución temporal.

---

## Contexto clínico

Desde:

ClinicalContext

Incluye:

- antecedentes;
- factores de riesgo;
- enfermedades asociadas;
- estilo de vida;
- poblaciones especiales.

---

## Conocimiento clínico

Desde:

ClinicalGuideline

Incluye:

- clasificación;
- objetivos;
- recomendaciones;
- criterios específicos.

---

# Salidas

ClinicalAnalysis puede producir:

## Clasificación clínica

Ejemplos:

- hipertensión sostenida;
- hipertensión de guardapolvo blanco;
- hipertensión oculta.

---

## Evaluación del control

Ejemplos:

- control adecuado;
- fuera de objetivo;
- tendencia desfavorable.

---

## Hallazgos clínicos

Ejemplos:

- posible falta de control;
- necesidad de revisión;
- patrón relevante.

---

# Relación con StatisticsEngine

StatisticsEngine:

Calcula datos.

Ejemplos:

- promedio;
- tendencia;
- variabilidad.

ClinicalAnalysis:

Interpreta esos datos clínicamente.

Ejemplo:

StatisticsEngine:

Promedio PAS elevado.


ClinicalAnalysis:

Resultado:

Control insuficiente según guía aplicable.

---

# Relación con ClinicalGuideline

Las reglas clínicas deben venir desde:

ClinicalGuideline.

No deben estar codificadas directamente dentro de:

- componentes;
- pantallas;
- formularios.

---

# Relación con motores futuros

## RiskEngine

Entrada:

ClinicalAnalysis

Salida:

Evaluación de riesgo cardiovascular.

---

## RecommendationEngine

Entrada:

ClinicalAnalysis + ClinicalGuideline

Salida:

Recomendaciones personalizadas.

---

## AlertEngine

Entrada:

ClinicalAnalysis

Salida:

Alertas clínicas.

---

# Ejemplo conceptual

Datos:

BloodPressureRecord:

PAS 150

PAD 95


Contexto:

Diabetes.


Guía:

Consenso HTA 2025.


Proceso:

ClinicalAnalysis interpreta:

- clasificación;
- objetivo aplicable;
- necesidad de seguimiento.

---

# Decisiones arquitectónicas

## Separación de responsabilidades

Measurement:

¿Qué ocurrió?


Statistics:

¿Qué patrón matemático existe?


ClinicalAnalysis:

¿Qué significa clínicamente?


Recommendation:

¿Qué acción podría considerarse?


---

# Compatibilidad con arquitectura actual

Mantiene separación:

src/domain

- reglas y modelos clínicos.


src/features

- interacción con usuario.


src/components

- representación visual.


---

# Estado

Especificación conceptual creada.

