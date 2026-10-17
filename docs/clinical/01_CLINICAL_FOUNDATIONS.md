# Fundamentos clínicos de CardioSync

**Estado:** contrastado con el código de `feature/app-updates` el 17-10-2026.

## 1. Objetivo

Establecer los principios que separan las mediciones originales, los datos del perfil, las estadísticas derivadas y los hallazgos del análisis clínico.

## 2. Medición y contexto

`BloodPressureRecord` representa un evento de medición e incluye actualmente PAS, PAD, fecha/hora, identificadores, marcas temporales y campos opcionales como frecuencia cardíaca, brazo, posición, origen y notas. También conserva campos adicionales marcados como reservados para futuras separaciones. Por lo tanto, la separación entre registro y contexto es un objetivo arquitectónico parcial, no una extracción completa ya realizada.

`ClinicalContext` representa actualmente información opcional a nivel de paciente: edad, sexo, talla, peso de referencia, IMC, tabaquismo, diabetes, dislipidemia y determinados antecedentes cardiovasculares y renales. No es una historia clínica completa ni está asociado individualmente a cada medición.

## 3. Estadísticas e interpretación

`StatisticsDomainService` aplica filtros y delega el cálculo a `StatisticsEngine`. Entre los resultados están promedios, máximos, mínimos, frecuencia cardíaca media, presión de pulso, presión arterial media, desviación estándar, variabilidad, carga hipertensiva, tiempo en objetivo, adherencia, tendencia y distribución de clasificación.

`ClinicalAnalysisDomainService` consume el resumen estadístico y el contexto, ejecuta reglas y devuelve hallazgos. Aunque la entrada de su contrato incluye una lista de mediciones, la implementación actual de este servicio utiliza las estadísticas y el contexto para evaluar las reglas; no analiza directamente cada registro.

## 4. Guías y trazabilidad

La guía argentina 2025 es la predeterminada cuando no se proporciona otra. El hallazgo puede incluir el identificador de guía y una fecha de creación. El modelo actual no conserva por sí solo una instantánea inmutable de todos los datos y de la versión del motor que originaron cada análisis.

## 5. Seguridad clínica

Los resultados son información de seguimiento y no sustituyen la evaluación profesional. Las reglas implementadas deben documentarse con sus condiciones reales; no deben inferirse capacidades de diagnóstico, prescripción o motores futuros a partir de nombres conceptuales.

## 6. Estado de implementación

- **Implementado:** registro de presión arterial, perfil local, estadísticas y reglas de análisis descritas en `CLINICAL_ENGINE_RULES.md`.
- **Parcial:** separación de datos de medición y perfil clínico.
- **Pendiente:** modelos independientes para todos los componentes contextuales, versionado reproducible completo del análisis y motores autónomos de recomendaciones/alertas.

Este documento describe el código actual y no sustituye las fuentes clínicas originales.