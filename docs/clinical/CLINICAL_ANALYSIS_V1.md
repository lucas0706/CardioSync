# Clinical Analysis V1

## Objetivo

Clinical Analysis interpreta la evolución de registros de presión arterial.

No realiza diagnóstico médico.
Su función es analizar datos registrados y generar hallazgos interpretables.

## Flujo arquitectónico

BloodPressureRecord[]
        |
        v
StatisticsEngine
        |
        v
StatisticsSummary
        |
        v
ClinicalAnalysisDomainService
        |
        v
Clinical Rules
        |
        v
Clinical Findings

## Entrada

El motor recibe:

- registros de presión arterial
- estadísticas calculadas
- contexto clínico mínimo
- guideline seleccionada

Guideline actual:

Consenso Argentino de Hipertensión Arterial 2025

## Salida

El análisis genera:

- clasificación de presión arterial
- evaluación de objetivo terapéutico
- tendencias
- carga de hipertensión
- advertencias de seguridad

## Responsabilidades

Statistics Domain:
- promedio
- máximos
- mínimos
- variabilidad
- tendencia
- carga

Clinical Domain:
- interpretación
- reglas clínicas
- generación de findings

## Limitaciones V1

No incluye:

- diagnóstico de enfermedades
- recomendaciones terapéuticas
- riesgo cardiovascular avanzado
- daño de órgano blanco

El objetivo sigue siendo seguimiento de presión arterial.
