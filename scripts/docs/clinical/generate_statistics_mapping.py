from pathlib import Path


CONTENT = r"""
# Statistics Mapping

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir la relación entre el dominio Statistics de CardioSync y la arquitectura
clínica definida por:

- BloodPressureRecord;
- ClinicalContext;
- ClinicalAnalysis.

Este documento establece qué información pertenece al análisis estadístico y
qué información pertenece al análisis clínico.

---

# 2. Principio fundamental

Statistics y ClinicalAnalysis son dominios diferentes.

Statistics responde:

¿Cómo evolucionan las mediciones a lo largo del tiempo?

ClinicalAnalysis responde:

¿Qué significa clínicamente una medición según una guía determinada?

---

# 3. Separación de responsabilidades

## Statistics

Trabaja principalmente con:

- BloodPressureRecord;
- series temporales;
- tendencias;
- variabilidad;
- promedios;
- distribución de valores.


---

## ClinicalAnalysis

Trabaja con:

- BloodPressureRecord;
- ClinicalContext;
- ClinicalGuideline.


---

# 4. Flujo conceptual

Múltiples mediciones:

BloodPressureRecord

↓

StatisticsEngine

↓

Estadísticas longitudinales


Una medición:

BloodPressureRecord

+

ClinicalContext

+

ClinicalGuideline

↓

ClinicalAnalysis


---

# 5. Información estadística derivada

Ejemplos:

- promedio de presión sistólica;
- promedio de presión diastólica;
- tendencia temporal;
- variabilidad;
- carga hipertensiva;
- tiempo en rango objetivo.


---

# 6. Relación con ClinicalContext

ClinicalContext puede aportar información para análisis futuros.

Ejemplos:

- comparar mediciones con sueño;
- analizar relación con actividad física;
- estudiar cambios asociados a peso.


Pero Statistics no debe depender obligatoriamente de ClinicalContext.

---

# 7. Calidad de datos

Statistics debe considerar:

- mediciones incompletas;
- valores faltantes;
- duplicados;
- calidad temporal.


Estas reglas pertenecen al dominio estadístico.

---

# 8. Relación con ClinicalAnalysis

Un análisis clínico puede utilizar resultados estadísticos.

Ejemplo:

Statistics:

Promedio últimos 30 días elevado.


ClinicalAnalysis:

Interpretación según guía seleccionada.


---

# 9. Decisiones arquitectónicas

## ADR-042

StatisticsEngine permanecerá separado de ClinicalAnalysisEngine.


## ADR-043

Statistics trabajará principalmente sobre mediciones longitudinales.


## ADR-044

ClinicalContext será opcional para cálculos estadísticos básicos.


## ADR-045

Los resultados estadísticos no deben interpretarse como diagnóstico.


---

# 10. Riesgos

Evitar:

- mezclar clasificación clínica con estadísticas;
- usar promedios como diagnóstico;
- perder trazabilidad temporal;
- ocultar calidad de datos.


---

# 11. Impacto en CardioSync

Utilizado por:

- Dashboard;
- ClinicalChart;
- Reports;
- ClinicalAnalysis futuro.


---

# 12. Estado

Draft.

Pendiente:

- revisión con Statistics V2 existente;
- mapeo definitivo de métricas;
- integración con ClinicalAnalysis.


"""


def main():
    output = Path("docs/clinical/14_STATISTICS_MAPPING.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
