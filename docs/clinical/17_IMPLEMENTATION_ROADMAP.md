# Hoja de ruta de implementación clínica

**Estado:** actualizada a partir del código de `feature/app-updates` el 17-10-2026. Este documento separa el estado observado de posibles evoluciones; no constituye autorización para implementar funcionalidades.

## 1. Implementado

- Registro de presión arterial y campos opcionales de medición en `BloodPressureRecord`.
- Perfil clínico local mediante `ClinicalContext`, `ClinicalProfileService`, `ClinicalProfileRepository` y `ProfileScreen`.
- Cálculo de estadísticas y filtrado temporal mediante `StatisticsDomainService` y `StatisticsEngine`.
- Contrato de reglas clínicas y composición en `ClinicalAnalysisDomainService`.
- Hallazgos para clasificación, seguridad, control domiciliario, tendencia, carga hipertensiva, tiempo en objetivo, variabilidad, objetivo terapéutico y factores asociados al riesgo.
- Objetivos terapéuticos codificados para el Consenso Argentino de HTA 2025.
- Sincronización de varias clases de datos de salud mediante servicios de Health Connect, separada del modelo de perfil clínico.

## 2. Parcial o limitado

- `BloodPressureRecord` mantiene campos reservados que conceptualmente pertenecen a otros modelos.
- El perfil es local y utiliza el identificador fijo `local-user`.
- El análisis consume `StatisticsSummary` y contexto; su contrato declara mediciones, pero la implementación no las usa directamente al evaluar reglas.
- El identificador de guía se registra en hallazgos, pero no existe una instantánea completa que garantice reproducibilidad histórica.
- El soporte ejecutable de guías y objetivos se limita principalmente al Consenso Argentino 2025; algunas reglas estadísticas usan umbrales fijos.
- Hay un tipo `ClinicalAlert`, pero no un motor autónomo de alertas confirmado.

## 3. Pendiente de especificación/implementación

1. Definir y probar la migración de campos heredados del registro sin perder compatibilidad con datos históricos.
2. Decidir si se requieren modelos independientes para contexto de medición, signos vitales, antropometría, síntomas y estilo de vida.
3. Definir trazabilidad reproducible de análisis: entradas, guía, versión de reglas y fecha.
4. Unificar los umbrales estadísticos con una política clínica explícita, evitando presentarlos como configurables por guía cuando son constantes.
5. Implementar soporte de otras guías solo con fuentes, población, reglas, pruebas y revisión clínica.
6. Diseñar recomendaciones y alertas como componentes separados si se confirma el requisito.
7. Mantener pruebas de dominio para casos normales, límites, datos ausentes y contextos especiales.

## 4. Criterio de finalización

Cada etapa debe tener código, pruebas verificables y documentación actualizada. La existencia de un documento conceptual o de una pantalla no se considera por sí sola implementación completa.