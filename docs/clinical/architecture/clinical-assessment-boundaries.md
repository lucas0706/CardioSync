# Límites de la evaluación clínica

## Propósito

Describir los límites entre el contexto declarado por la persona, las guías clínicas disponibles, las estadísticas calculadas y los hallazgos producidos por CardioSync.

## Límites funcionales

- CardioSync ofrece seguimiento e interpretación de mediciones; no confirma diagnósticos médicos.
- `ClinicalContext` representa información declarada o conocida, no diagnósticos inferidos por la aplicación.
- `StatisticsEngine` calcula indicadores a partir de registros de presión arterial.
- `ClinicalAnalysisDomainService` coordina reglas clínicas y genera `ClinicalFinding[]` a partir de las estadísticas y el contexto.
- Si no se especifica una guía, el servicio selecciona `ConsensoArgentinaHTA2025` como guía predeterminada.
- `ClinicalTargetSelector` se usa en `TherapeuticTargetRule` para elegir objetivos terapéuticos registrados para una guía y población.
- La clasificación de presión arterial se realiza mediante `BloodPressureClassifier`. En el estado actual, sus umbrales están codificados en la implementación y no se seleccionan dinámicamente según `context.guideline`.

## Flujo implementado

```text
BloodPressureRecord[]
        |
        v
StatisticsEngine
        |
        v
StatisticsSummary
        |
        +--------------------------+
        |                          |
        v                          v
ClinicalContext             ClinicalGuideline
        |                          |
        +-------------+------------+
                      v
       ClinicalAnalysisDomainService
                      |
                      v
              ClinicalRule[]
                      |
                      v
            ClinicalFinding[]
                      |
                      v
        ClinicalAnalysisResultBuilder
```

El servicio de análisis recibe estadísticas ya calculadas; no calcula las estadísticas ni recibe directamente la lista de mediciones para ejecutar las reglas.

## Guías y objetivos

Actualmente, el repositorio de objetivos terapéuticos devuelve objetivos únicamente para el identificador `consenso-hta-argentina-2025`. La presencia de un identificador o un documento bibliográfico no implica que exista una implementación ejecutable de esa guía.

Los objetivos y umbrales deben distinguirse de los valores fijos que usan algunos calculadores o reglas. En particular, carga de hipertensión y tiempo en objetivo utilizan actualmente umbrales predeterminados de 135/85 mmHg; no consumen los objetivos elegidos por `ClinicalTargetSelector`.

## Advertencias y limitaciones

- La regla de seguridad actualmente genera un hallazgo si la presión diastólica promedio es inferior a 70 mmHg.
- La regla de objetivo terapéutico omite su hallazgo si la presión sistólica promedio es inferior a 120 mmHg o la diastólica inferior a 70 mmHg.
- Los hallazgos son indicadores para seguimiento y no deben presentarse como diagnósticos.
- Las reglas y sus umbrales requieren trazabilidad verificable hacia una fuente clínica primaria antes de atribuirles una recomendación concreta.

## Alcance

Esta documentación describe el comportamiento implementado en la rama auditada; no sustituye la revisión clínica profesional ni acredita por sí sola la validación médica de los umbrales.
