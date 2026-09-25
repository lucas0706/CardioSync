# LifestyleContext

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el componente LifestyleContext dentro de ClinicalContext.

LifestyleContext representa factores recientes relacionados con el estilo de
vida que pueden aportar información adicional para interpretar una medición de
presión arterial.

No representa hábitos históricos completos.

No representa recomendaciones terapéuticas.

No determina riesgo cardiovascular por sí mismo.

---

# 2. Principio fundamental

Algunos factores relacionados con el estilo de vida pueden modificar
temporalmente el estado fisiológico del paciente y aportar contexto adicional
a una medición.

CardioSync diferencia:

Estado puntual:

LifestyleContext

de:

Evaluación clínica:

ClinicalAnalysis

---

# 3. Responsabilidad

LifestyleContext responde:

¿Qué factores recientes del estilo de vida pueden aportar contexto a esta
medición?

No responde:

¿Cuál es el estilo de vida global del paciente?

---

# 4. Componentes iniciales

## SleepContext

Representa información relacionada con el sueño reciente.

Ejemplos:

- duración del sueño;
- calidad percibida;
- periodo de sueño asociado.


Origen posible:

- ingreso manual;
- Health Connect;
- proveedores futuros.


---

## PhysicalActivityContext

Representa actividad física reciente.

Ejemplos:

- ejercicio realizado;
- duración;
- intensidad;
- tiempo desde la última actividad.


Origen posible:

- ingreso manual;
- Health Connect;
- wearable.


---

## RecentExercise

Representa ejercicio cercano temporalmente a la medición.

Ejemplo:

Ejercicio intenso realizado poco antes de tomar la presión.


---

# 5. Modelo conceptual

LifestyleContext

├── SleepContext

├── PhysicalActivityContext

└── RecentExercise


---

# 6. Integración con Health Connect

Health Connect puede proporcionar datos relacionados con:

- sueño;
- actividad física;
- ejercicio.


Flujo:

Health Connect

↓

ClinicalDataProvider

↓

ClinicalContextBuilder

↓

LifestyleContext


---

# 7. Vigencia temporal

Los datos de estilo de vida tienen una ventana temporal específica.

Ejemplos:

Sueño:

última noche.


Actividad física:

últimas horas.


Ejercicio reciente:

periodo cercano a la medición.


La definición exacta de ventanas temporales pertenece a:

ContextQualityEngine.


---

# 8. Diferencia entre contexto y hábitos

LifestyleContext no debe almacenar:

- promedio anual de actividad;
- historial deportivo completo;
- patrones de sueño de años.


Eso pertenece a futuros dominios longitudinales.

---

# 9. Decisiones arquitectónicas

## ADR-022

Los datos de estilo de vida pertenecen a ClinicalContext cuando tienen
relevancia temporal para una medición.


## ADR-023

LifestyleContext no representa hábitos históricos del paciente.


## ADR-024

Health Connect será un proveedor opcional de datos de estilo de vida.


---

# 10. Riesgos

Evitar:

- convertir LifestyleContext en un perfil personal completo;
- almacenar información sin relación temporal;
- inferir condiciones clínicas automáticamente;
- depender de un proveedor específico.


---

# 11. Impacto en CardioSync

Utilizado por:

- ClinicalContextBuilder;
- ContextQualityEngine;
- ClinicalAnalysisEngine;
- ContextAssistant;
- Health Connect.


---

# 12. Estado

Draft.

Pendiente de integración con:

- ClinicalContext completo;
- ContextQualityEngine;
- ClinicalAnalysis.
