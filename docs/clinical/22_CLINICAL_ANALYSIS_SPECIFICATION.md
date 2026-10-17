# Especificación de Clinical Analysis

**Estado:** contrastado con los contratos y servicios de `feature/app-updates` el 17-10-2026.

## 1. Responsabilidad

El análisis clínico coordina reglas que convierten estadísticas y contexto del perfil en hallazgos. No calcula las estadísticas ni modifica las mediciones originales.

## 2. Entrada

`ClinicalAnalysisInput` declara:

- `measurements: BloodPressureRecord[]`;
- `statistics?: StatisticsSummary`;
- `context: ClinicalContext`;
- `guideline?: ClinicalGuideline`.

**Límite importante:** aunque `measurements` forma parte del contrato, `ClinicalAnalysisDomainService.analyze()` no usa esa lista al evaluar reglas. El servicio usa el resumen estadístico y el contexto. Las reglas que requieren estadísticas se omiten cuando `statistics` está ausente.

## 3. Proceso implementado

1. Usa la guía recibida o `ConsensoArgentinaHTA2025` como predeterminada.
2. Construye un `ClinicalRuleContext` con guía, contexto clínico y fecha de evaluación.
3. Ejecuta las reglas registradas en el servicio.
4. Reúne los `ClinicalFinding` producidos.
5. Agrupa los hallazgos en `ClinicalAnalysisResult` mediante `buildClinicalAnalysisResult`.
6. Devuelve un objeto `ClinicalAnalysis` en memoria.

Las reglas actuales cubren clasificación de la media de PAS/PAD, advertencia por PAD media inferior a 70, control domiciliario, tendencia, carga hipertensiva, tiempo en objetivo, variabilidad, objetivo terapéutico y factores asociados al riesgo.

## 4. Salida actual

`ClinicalAnalysis` contiene `id`, `patientId`, `createdAt`, guía opcional, estadísticas opcionales, hallazgos, resultado estructurado, resumen y metadata opcional. El resultado organiza hallazgos en clasificación, tendencias, objetivos, control, carga, variabilidad, seguridad y riesgo.

No se encontró persistencia de `ClinicalAnalysis` en el flujo inspeccionado. El identificador y la fecha se generan al ejecutar el servicio; el modelo no conserva una instantánea de entradas ni una versión del motor suficiente para garantizar reproducción histórica.

## 5. Límites funcionales

- No produce diagnósticos formales ni prescribe tratamientos.
- No existe un motor independiente de recomendaciones integrado en esta salida.
- El tipo `ClinicalAlert` no convierte este proceso en un sistema completo de alertas.
- La regla de riesgo identifica antecedentes; no calcula riesgo absoluto validado.
- La guía argentina es la única con objetivos registrados en el selector actual; algunas reglas usan umbrales fijos.

## 6. Separación de capas

`src/domain/clinical` contiene contratos, reglas y servicio de análisis. `src/domain/statistics` calcula las métricas. Las pantallas y componentes presentan información, pero no deben duplicar las reglas clínicas.

## 7. Criterios para cambios futuros

Cada regla debe tener fuente, población, condiciones, comportamiento ante datos ausentes y pruebas de límites. La trazabilidad debe permitir identificar qué regla y guía generaron un hallazgo. Toda nueva interpretación clínica requiere revisión clínica; esta especificación técnica no valida por sí misma los umbrales.