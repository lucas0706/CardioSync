# CardioSync — Clinical Reports

| Campo | Valor |
|-------|--------|
| Documento | 07_REPORTS.md |
| Tipo | Diseño Conceptual de Reportes |
| Estado | En implementación |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-10 |

---

# Objetivo

Este documento define el diseño conceptual del sistema de reportes de CardioSync.

No contiene implementación.

Su finalidad es establecer la estructura, objetivos y diferencias entre los distintos tipos de reportes que generará el sistema.

---

# Principios generales

Los reportes deberán:

- Utilizar información validada del sistema.
- Mantener trazabilidad de los datos.
- Diferenciar información clínica de información estadística.
- Indicar fuentes utilizadas.
- Reflejar los contextos disponibles.

Los reportes no deberán:

- Crear interpretaciones no respaldadas.
- Modificar datos originales.
- Reemplazar la evaluación profesional.

---

# Tipos de reportes

CardioSync tendrá dos tipos principales de reportes:

1. Reporte del Paciente.
2. Reporte Médico.

Cada uno tendrá objetivos y niveles de detalle diferentes.

---

# Reporte del Paciente

Estado: 🔄 EN IMPLEMENTACIÓN

## Objetivo

Proporcionar al usuario una visión clara y comprensible de su seguimiento de presión arterial.

Debe priorizar comprensión y seguimiento personal.

---

# Información incluida

## Resumen general

Puede incluir:

- Evolución de presión arterial.
- Cantidad de mediciones.
- Tendencias generales.
- Cumplimiento del seguimiento.

---

## Estadísticas

Información simplificada:

- Promedios.
- Evolución temporal.
- Cambios relevantes.

---

## Seguimiento

Puede incluir:

- Objetivos personales.
- Recordatorios.
- Recomendaciones generales.

---

## Información clínica

Cuando exista evaluación clínica disponible:

- Clasificación obtenida.
- Hallazgos relevantes.
- Recomendaciones basadas en reglas clínicas.

Siempre con lenguaje comprensible.


---

## Gráfico clínico de evolución

La implementación actual del reporte PDF incorpora un gráfico clínico de evolución temporal.

El gráfico representa conjuntamente:

- Presión sistólica.
- Presión diastólica.
- Frecuencia cardíaca.

Las series utilizadas son:

| Serie | Etiqueta | Unidad |
| ----- | -------- | ----- |
| `systolic` | Sistólica | mmHg |
| `diastolic` | Diastólica | mmHg |
| `heartRate` | Frecuencia cardíaca | lpm |

La definición de las series se mantiene centralizada en:

`src/components/charts/ClinicalChart/constants/clinicalSeries.ts`

El reporte PDF utiliza un renderer SVG/HTML específico porque el componente React Native `ClinicalChart` no puede insertarse directamente dentro del HTML procesado por `expo-print`.

La implementación específica se encuentra en:

`src/features/reports/services/ReportClinicalChartService.ts`

El renderer utiliza las mismas claves clínicas y la misma semántica visual de `ClinicalChart`.

La leyenda identifica las tres series y sus unidades.


---

# Reporte Médico

Estado: 📋 PLANIFICADO

## Objetivo

Proporcionar información técnica detallada para profesionales de salud.

Debe priorizar precisión y trazabilidad.

---

# Información incluida

## Datos de mediciones

- Historial completo.
- Fechas.
- Valores registrados.
- Evolución.

---

## Análisis estadístico

Puede incluir:

- Promedios.
- Variabilidad.
- Tendencias.
- Distribuciones.

---

## Evaluación clínica

Cuando esté disponible:

- Clasificaciones clínicas.
- Reglas aplicadas.
- Hallazgos.
- Evidencia utilizada.

---

## Contextos adicionales

Cuando existan:

- Sueño.
- Actividad física.
- Composición corporal.
- Signos vitales.

La ausencia de estos datos no debe impedir la generación del reporte.

---

## Implementación del gráfico PDF

El reporte utiliza un renderer SVG específico para representar Sistólica, Diastólica y Frecuencia cardíaca dentro del PDF, manteniendo las definiciones de series de ClinicalChart.

# Diferencias principales

| Característica | Paciente | Médico |
|---|---|---|
| Objetivo | Comprensión personal | Evaluación profesional |
| Lenguaje | Simple | Técnico |
| Detalle | Resumido | Completo |
| Estadísticas | Simplificadas | Detalladas |
| Reglas clínicas | Interpretadas | Trazables |

---

# Relación con Clinical Analysis Engine

Los reportes consumirán información proveniente del Clinical Analysis Engine.

Flujo:

ClinicalContext

↓

Clinical Rule Engine

↓

Clinical Analysis Engine

↓

Clinical Report

↓

Paciente / Médico

---

# Relación con Health Connect

Los datos externos podrán incorporarse cuando estén disponibles.

Ejemplo:

Health Connect

↓

SleepContext

↓

Clinical Analysis Engine

↓

Reporte

La ausencia de datos externos no bloqueará la generación del reporte.

---

# Restricciones

- Los reportes no modifican datos.
- Los reportes no ejecutan reglas clínicas.
- Los reportes no acceden directamente a SQLite.
- Los reportes utilizan resultados generados por otros módulos.

---

# Evolución prevista

La implementación de reportes comenzará después de:

1. Finalizar dominio clínico.
2. Implementar Clinical Rule Engine.
3. Implementar Clinical Analysis Engine.

