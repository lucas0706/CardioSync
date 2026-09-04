# RiskEngine

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el dominio RiskEngine dentro de CardioSync.

RiskEngine representa el componente encargado de estimar o categorizar
información relacionada con riesgo cardiovascular utilizando datos clínicos
disponibles y reglas definidas.

No realiza diagnósticos.

No reemplaza una evaluación profesional.

No indica tratamientos.

---

# 2. Principio fundamental

El riesgo cardiovascular no depende únicamente de una medición aislada de
presión arterial.

Puede integrar:

- valores de presión arterial;
- contexto clínico;
- factores adicionales;
- guía clínica seleccionada.

---

# 3. Separación de responsabilidades

## BloodPressureRecord

Registra la medición.


## ClinicalContext

Aporta información complementaria.


## ClinicalAnalysis

Interpreta la medición según una guía.


## RiskEngine

Evalúa información relacionada con riesgo.


---

# 4. Flujo conceptual

BloodPressureRecord

+

ClinicalContext

+

ClinicalGuideline

↓

ClinicalAnalysis

↓

RiskEngine

↓

RiskAssessment


---

# 5. Modelo conceptual

RiskAssessment

├── id

├── category

├── factors

├── source

├── guidelineId

├── generatedAt

└── version


---

# 6. Factores de riesgo

Los factores de riesgo deben modelarse como información trazable.

Ejemplos conceptuales:

- factores antropométricos;
- factores cardiovasculares;
- factores clínicos disponibles.

La definición exacta dependerá de las reglas implementadas.

---

# 7. Relación con ClinicalGuideline

Cada evaluación de riesgo debe mantener referencia a:

- guía utilizada;
- versión;
- fecha de generación.

Cambiar una guía no debe modificar evaluaciones históricas.

---

# 8. Independencia del motor

RiskEngine no debe contener:

- reglas específicas embebidas;
- lógica de una sola guía;
- valores fijos difíciles de actualizar.

Las reglas deben pertenecer a ClinicalGuideline.

---

# 9. Decisiones arquitectónicas

## ADR-039

RiskEngine será independiente de ClinicalAnalysisEngine.


## ADR-040

Toda evaluación de riesgo tendrá trazabilidad hacia la fuente clínica.


## ADR-041

Los resultados históricos de riesgo serán inmutables.


---

# 10. Riesgos

Evitar:

- presentar riesgo como diagnóstico;
- calcular riesgo sin contexto suficiente;
- mezclar guías;
- modificar resultados históricos.


---

# 11. Impacto en CardioSync

Utilizado por:

- ClinicalAnalysis;
- Dashboard;
- Reportes;
- futuras herramientas de seguimiento.


---

# 12. Estado

Draft.

Pendiente:

- definición de modelos de riesgo;
- reglas específicas;
- validación clínica.
