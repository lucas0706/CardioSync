# Mapeo del dominio clínico

**Estado:** mapeo contrastado con `feature/app-updates` el 17-10-2026.

## 1. Modelos implementados

| Concepto | Ubicación actual | Estado real |
|---|---|---|
| Registro de presión arterial | `src/domain/measurements/BloodPressureRecord.ts` | Implementado; conserva campos opcionales/reservados heredados |
| Perfil/contexto clínico | `src/domain/clinical/models/ClinicalContext.ts` | Implementado como perfil a nivel de paciente |
| Guía clínica | `src/domain/clinical/models/ClinicalGuideline.ts` | Implementado como metadata de fuente |
| Hallazgo clínico | `src/domain/clinical/models/ClinicalFinding.ts` | Implementado |
| Análisis clínico | `src/domain/clinical/models/ClinicalAnalysis.ts` | Implementado como resultado en memoria |
| Resultado estructurado | `src/domain/clinical/models/ClinicalAnalysisResult.ts` | Implementado; organiza hallazgos por tipo |
| Regla clínica | `src/domain/clinical/rules/` | Implementado mediante reglas concretas |
| Objetivos terapéuticos | `src/domain/clinical/targets/` | Implementados para la guía argentina 2025 |
| Estadísticas | `src/domain/statistics/` | Implementadas para métricas longitudinales |

## 2. Campos que siguen en BloodPressureRecord

Además de PAS, PAD, fecha/hora, FC, brazo, posición, origen y notas, el contrato conserva peso, talla, IMC, glucosa, SpO₂, temperatura, frecuencia respiratoria, dolor y una guía como campos opcionales reservados. Su presencia no demuestra que exista una separación de dominio completa.

## 3. Perfil clínico

El perfil local se guarda en SQLite en `clinical_profile`. Contiene nombre, edad, sexo, altura, peso, IMC, tabaquismo, diabetes, dislipidemia y antecedentes cardiovasculares/renales. El IMC se calcula en la pantalla del perfil a partir de altura y peso.

No contiene actualmente síntomas, sueño, actividad física ni signos vitales. Los servicios de Health Connect se mantienen en su feature y no hay un constructor general que los combine automáticamente con el perfil para el análisis clínico.

## 4. Flujo real de estadísticas y análisis

`BloodPressureRecord[]` → `StatisticsDomainService` → `StatisticsEngine` → `StatisticsSummary` → `ClinicalAnalysisDomainService` → reglas → `ClinicalFinding[]` y `ClinicalAnalysisResult`.

La interfaz de entrada del análisis incluye `measurements`, pero el servicio de dominio auditado no las consulta directamente al ejecutar las reglas. La interpretación se basa en el resumen estadístico, el contexto y la guía.

## 5. Reglas y guía

Las reglas actuales incluyen clasificación, seguridad, control domiciliario, tendencia, carga, tiempo en objetivo, variabilidad, objetivo terapéutico y factores asociados al riesgo. El identificador de guía se propaga a los hallazgos cuando está disponible.

La guía argentina 2025 es la predeterminada y la única con objetivos registrados en `ClinicalTargetRepository`. No asumir ejecución equivalente de AHA/ACC, ESC o ISH.

## 6. Conceptos futuros

No se encuentran modelos independientes de `MeasurementContext`, `Anthropometry`, `VitalSigns`, `LifestyleContext` o `CardiovascularSymptoms`, ni motores completos de recomendaciones y alertas. Su incorporación requiere diseño, persistencia, migraciones, pruebas y actualización documental.