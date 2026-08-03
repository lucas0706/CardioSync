# CardioSync — Clinical Reports

| Campo | Valor |
|-------|--------|
| Documento | 07_REPORTS.md |
| Tipo | Diseño Conceptual de Reportes |
| Estado | Planificado |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

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

Estado: 📋 PLANIFICADO

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

