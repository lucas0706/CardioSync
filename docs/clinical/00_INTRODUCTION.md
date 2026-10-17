# Introducción al dominio clínico de CardioSync

**Estado:** documentación contrastada con el código de `feature/app-updates` el 17-10-2026.

## Propósito

CardioSync permite registrar y consultar mediciones de presión arterial, observar su evolución y generar hallazgos de seguimiento a partir de estadísticas y reglas clínicas implementadas. La aplicación no sustituye una evaluación profesional ni debe presentar sus resultados como diagnóstico.

## Alcance implementado

- Registro de presión sistólica y diastólica con fecha y hora.
- Datos opcionales de la medición: frecuencia cardíaca, brazo, posición, origen y notas.
- Perfil clínico local opcional, persistido en SQLite.
- Cálculo de estadísticas longitudinales mediante `StatisticsDomainService` y `StatisticsEngine`.
- Análisis mediante `ClinicalAnalysisDomainService`, reglas clínicas y hallazgos trazables a un identificador de guía.
- Selección de objetivos terapéuticos implementados para el Consenso Argentino de Hipertensión Arterial 2025.

## Límites actuales

No se debe asumir que existe un modelo completo de historia clínica. Los modelos independientes de síntomas, contexto del procedimiento, estilo de vida y signos vitales descritos en documentos históricos todavía no están consolidados como un único `ClinicalContext`. Tampoco se encuentran implementados motores autónomos completos de recomendaciones y alertas, ni soporte equivalente para ejecutar las cuatro guías documentadas.

## Arquitectura actual

- `src/domain/measurements/BloodPressureRecord.ts`: contrato del registro de presión arterial.
- `src/domain/clinical/models/ClinicalContext.ts`: perfil clínico opcional a nivel de paciente.
- `src/domain/clinical/rules/`: reglas que generan hallazgos.
- `src/domain/clinical/services/ClinicalAnalysisDomainService.ts`: orquestación del análisis.
- `src/domain/statistics/`: filtros, cálculos y resumen estadístico.
- `src/features/profile/` y `src/core/database/ClinicalProfileRepository.ts`: interfaz y persistencia del perfil.

## Principio de seguridad

Los valores registrados son datos observados; las estadísticas son cálculos derivados; los hallazgos son interpretaciones de reglas concretas. Ninguna de estas capas debe describirse como diagnóstico médico autónomo o prescripción.

## Mantenimiento

Este documento describe la implementación observada, no un diseño objetivo. Cada cambio relevante en los modelos o reglas debe reflejarse aquí y en las especificaciones relacionadas.