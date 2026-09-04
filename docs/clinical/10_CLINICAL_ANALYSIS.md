# ClinicalAnalysis

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el dominio ClinicalAnalysis dentro de CardioSync.

ClinicalAnalysis representa el resultado de aplicar una interpretación clínica
sobre una medición de presión arterial utilizando:

- BloodPressureRecord;
- ClinicalContext;
- ClinicalGuideline.

No modifica los datos originales.

No reemplaza la medición.

No representa una historia clínica.

---

# 2. Principio fundamental

CardioSync separa tres conceptos:

## Registro

Lo que ocurrió.

BloodPressureRecord


## Contexto

Las circunstancias alrededor del registro.

ClinicalContext


## Interpretación

El significado clínico del registro.

ClinicalAnalysis


---

# 3. Flujo conceptual

BloodPressureRecord

+

ClinicalContext

+

ClinicalGuideline

↓

ClinicalAnalysis


---

# 4. Responsabilidad

ClinicalAnalysis responde:

¿Qué interpretación produce una guía clínica utilizando una medición y su
contexto?


No responde:

- ¿Qué datos fueron registrados?
- ¿Qué tratamiento debe recibir el paciente?
- ¿Cuál será la evolución futura?

---

# 5. Modelo conceptual

ClinicalAnalysis

├── id

├── bloodPressureRecordId

├── clinicalContextId

├── guidelineId

├── classification

├── riskAssessment

├── findings

├── recommendations

├── generatedAt

└── version


---

# 6. Inmutabilidad

Un análisis generado debe conservar:

- guía utilizada;
- versión de reglas;
- fecha de generación;
- datos evaluados.


Cambiar una guía no debe modificar análisis históricos.

---

# 7. Relación con ClinicalGuideline

ClinicalAnalysis siempre debe indicar qué guía fue utilizada.

Ejemplo:

Measurement

+

ClinicalContext

+

Consenso Argentino 2025

↓

Analysis Result


---

# 8. Relación con Statistics

Statistics analiza:

múltiples mediciones.


ClinicalAnalysis interpreta:

una medición específica.


Son dominios diferentes.

---

# 9. Motor clínico futuro

ClinicalAnalysis será generado por:

ClinicalAnalysisEngine


Arquitectura conceptual:

BloodPressureRecord

↓

ClinicalContext

↓

ClinicalGuideline

↓

ClinicalAnalysisEngine

↓

ClinicalAnalysis


---

# 10. Resultados posibles

Ejemplos conceptuales:

- clasificación de presión arterial;
- hallazgos relevantes;
- evaluación contextual;
- advertencias;
- recomendaciones generales.


Las reglas específicas dependerán de ClinicalGuideline.

---

# 11. Decisiones arquitectónicas

## ADR-029

ClinicalAnalysis será una entidad independiente.


## ADR-030

ClinicalAnalysis será reproducible utilizando los mismos datos y la misma
versión de guía.


## ADR-031

Los resultados clínicos no modificarán los datos originales.


## ADR-032

ClinicalAnalysisEngine será independiente de las guías.


---

# 12. Riesgos

Evitar:

- mezclar reglas clínicas con almacenamiento;
- modificar resultados históricos;
- ocultar la guía utilizada;
- generar recomendaciones sin trazabilidad.


---

# 13. Impacto en CardioSync

Utilizado por:

- Dashboard;
- Clinical Chart;
- Statistics;
- Reportes;
- Alert Engine futuro.


---

# 14. Estado

Draft.

Pendiente:

- implementación del motor clínico;
- reglas específicas por guía;
- validación clínica.
