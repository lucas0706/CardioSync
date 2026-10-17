# RecommendationEngine

**Estado:** diseño conceptual; motor independiente no implementado en el código auditado el 17-10-2026.

## 1. Alcance previsto

Un futuro componente de recomendaciones podría presentar sugerencias generales de seguimiento basadas en hallazgos clínicos y fuentes documentadas. No debe prescribir medicamentos, indicar cambios de tratamiento ni reemplazar una evaluación profesional.

## 2. Estado actual

No se encontró una implementación independiente `RecommendationEngine`, un modelo `Recommendation` ni un servicio que genere recomendaciones clínicas desde `ClinicalAnalysis`. El modelo `ClinicalAnalysis` contiene hallazgos y resumen, pero no una colección de recomendaciones.

El motor clínico actual genera hallazgos mediante reglas como clasificación, seguridad, tendencia, carga, tiempo en objetivo, variabilidad, objetivo terapéutico y factores asociados al riesgo. Estos hallazgos no deben describirse como recomendaciones.

## 3. Requisitos de una futura implementación

- Consumir resultados clínicos explícitos, sin recalcular estadísticas ni duplicar clasificación.
- Registrar fuente, guía, fecha y versión de reglas relevantes.
- Separar recomendación educativa de prescripción o decisión terapéutica.
- No generar recomendaciones cuando falten entradas requeridas.
- Validar clínicamente el contenido y probar escenarios de seguridad.

## 4. Estado de documentación

Los tipos de recomendación enumerados en versiones anteriores son propuestas, no funcionalidades disponibles. Este documento debe actualizarse cuando exista un contrato de dominio, un servicio, consumidores reales y pruebas.