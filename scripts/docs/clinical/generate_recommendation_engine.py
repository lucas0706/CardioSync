from pathlib import Path


CONTENT = r"""
# RecommendationEngine

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el dominio RecommendationEngine dentro de CardioSync.

RecommendationEngine representa el componente encargado de generar
recomendaciones derivadas de resultados clínicos previamente interpretados.

No realiza mediciones.

No clasifica presión arterial.

No reemplaza la evaluación profesional.

---

# 2. Principio fundamental

La arquitectura clínica mantiene separación estricta:

Registro:

BloodPressureRecord


Contexto:

ClinicalContext


Interpretación:

ClinicalAnalysis


Recomendaciones:

RecommendationEngine


---

# 3. Responsabilidad

RecommendationEngine responde:

¿Qué acciones generales pueden sugerirse considerando un análisis clínico
existente?

No responde:

- ¿Cuál fue la medición?
- ¿Cuál es la clasificación?
- ¿Qué tratamiento debe indicarse?


---

# 4. Flujo conceptual

BloodPressureRecord

+

ClinicalContext

↓

ClinicalAnalysis

↓

RecommendationEngine

↓

Recommendations


---

# 5. Modelo conceptual

Recommendation

├── id

├── type

├── description

├── priority

├── source

├── createdAt


---

# 6. Tipos posibles

Ejemplos conceptuales:

## FollowUpRecommendation

Sugerencias relacionadas con seguimiento.


## MeasurementRecommendation

Sugerencias relacionadas con calidad o repetición de mediciones.


## LifestyleRecommendation

Sugerencias generales relacionadas con hábitos saludables.


---

# 7. Separación clínica

RecommendationEngine no debe contener:

- diagnósticos;
- prescripciones;
- cambios de medicación;
- decisiones terapéuticas autónomas.

Las recomendaciones deben mantenerse dentro del alcance definido por
CardioSync.

---

# 8. Relación con ClinicalGuideline

Las recomendaciones pueden depender de:

- guía seleccionada;
- versión;
- resultado del análisis.

Debe existir trazabilidad:

Recommendation

↓

ClinicalAnalysis

↓

ClinicalGuideline


---

# 9. Inmutabilidad

Una recomendación generada debe conservar:

- fuente;
- fecha;
- versión de reglas utilizadas.


Cambiar una guía futura no debe alterar recomendaciones históricas.

---

# 10. Decisiones arquitectónicas

## ADR-033

Las recomendaciones serán generadas después del análisis clínico.


## ADR-034

RecommendationEngine permanecerá separado de ClinicalAnalysisEngine.


## ADR-035

Las recomendaciones deben mantener trazabilidad hacia la fuente clínica.


---

# 11. Riesgos

Evitar:

- generar recomendaciones sin contexto;
- mezclar diagnóstico y recomendación;
- crear lógica clínica dentro de la interfaz;
- presentar sugerencias como indicaciones médicas.


---

# 12. Impacto en CardioSync

Utilizado por:

- Dashboard;
- ClinicalAnalysis;
- ContextAssistant;
- Reportes;
- futuros módulos educativos.


---

# 13. Estado

Draft.

Pendiente:

- definición de reglas por guía;
- validación clínica;
- integración con ClinicalAnalysisEngine.


"""


def main():
    output = Path("docs/clinical/11_RECOMMENDATION_ENGINE.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
