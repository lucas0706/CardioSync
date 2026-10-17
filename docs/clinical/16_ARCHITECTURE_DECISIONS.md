# Decisiones de arquitectura clínica

**Estado:** decisiones conceptuales contrastadas con `feature/app-updates` el 17-10-2026.

Este documento resume decisiones y su grado de implementación. Los identificadores ADR históricos se conservan como referencias documentales, pero no implican que cada concepto esté implementado.

## 1. Registro separado del análisis

**Decisión:** el registro de presión arterial conserva los valores observados; la interpretación se produce en reglas y servicios separados.

**Estado:** parcialmente implementado. `BloodPressureRecord` y `ClinicalAnalysis` son contratos separados, pero el registro aún conserva campos reservados de contexto, signos vitales y guía.

## 2. Contexto clínico

**Decisión:** el perfil del paciente es opcional y no debe copiarse automáticamente en cada medición.

**Estado:** implementado para el perfil local. `ClinicalContext` incluye datos demográficos, antropométricos y determinados antecedentes. No es todavía un agregado compuesto por `MeasurementContext`, `VitalSigns`, `LifestyleContext` y `CardiovascularSymptoms`.

## 3. Independencia de fuentes

**Decisión:** los modelos de dominio no deben depender de Health Connect.

**Estado:** los servicios de Health Connect están en la capa de feature y existen modelos de dominio para datos de salud, pero no hay un `ClinicalDataProvider` común ni un constructor que combine automáticamente esas fuentes con el contexto del análisis.

## 4. Reglas clínicas

**Decisión:** las reglas deben ser unidades separadas, comprobables y trazables.

**Estado:** implementado mediante el contrato `ClinicalRule`, `ClinicalRuleContext` y reglas concretas en `src/domain/clinical/rules/`. Los hallazgos pueden registrar el identificador de guía, pero la trazabilidad completa a párrafo, versión de motor e instantánea de entradas no está modelada en cada hallazgo.

## 5. Guías y objetivos

**Decisión:** las guías son metadatos versionados y los objetivos se seleccionan por fuente y contexto.

**Estado:** parcial. La guía argentina 2025 y sus objetivos están registrados; el repositorio no proporciona objetivos ejecutables para todas las guías documentadas. Algunas reglas y calculadores mantienen umbrales fijos.

## 6. Estadísticas y análisis

**Decisión:** Statistics calcula métricas y Clinical Analysis genera hallazgos a partir de resultados estadísticos y contexto.

**Estado:** implementado. `StatisticsDomainService` delega a `StatisticsEngine`; `ClinicalAnalysisDomainService` coordina reglas y construye `ClinicalAnalysisResult`. El servicio de análisis no utiliza directamente la lista `measurements` de su entrada durante la evaluación.

## 7. Recomendaciones y alertas

**Decisión:** recomendaciones, hallazgos y alertas deben ser conceptos separados.

**Estado:** parcial. Hay hallazgos clínicos y un tipo de datos `ClinicalAlert`, pero no se encontraron motores independientes completos de recomendaciones y alertas.

## 8. Reglas de mantenimiento

- No describir diseños futuros como capacidades actuales.
- Toda modificación de reglas debe citar fuente, alcance, población y pruebas.
- Las migraciones de `BloodPressureRecord` deben preservar compatibilidad con datos guardados e importados.
- Los cambios de documentación no certifican por sí solos la validez clínica de una regla.