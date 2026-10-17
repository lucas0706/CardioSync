# Fuente argentina: Consenso de Hipertensión Arterial 2025

## Uso actual en CardioSync

La guía se registra como `consenso-hta-argentina-2025` y es la guía predeterminada de `ClinicalAnalysisDomainService` cuando no se proporciona otra.

El código relacionado se encuentra en:

- `src/domain/clinical/guidelines/ConsensoArgentinaHTA2025.ts`: metadatos de la guía.
- `src/domain/clinical/classification/BloodPressureClassifier.ts`: clasificación con umbrales fijos.
- `src/domain/clinical/targets/guidelines/ConsensoArgentinaHTA2025Targets.ts`: objetivos terapéuticos configurados.
- `src/domain/clinical/rules/hypertension/HomeBloodPressureControlRule.ts`: hallazgo por promedio domiciliario elevado.
- `src/domain/statistics/calculators/HypertensionLoadCalculator.ts` y `TimeInTargetCalculator.ts`: cálculos con valores predeterminados de 135/85 mmHg.

## Límites de lo verificado

La presencia de estos archivos demuestra configuración y comportamiento de software, pero no prueba por sí sola que cada valor coincida con el texto oficial del consenso. No se ha registrado aquí una referencia exacta a sección/página para cada regla.

Antes de considerar la trazabilidad completa, completar:

- URL o identificador oficial del documento;
- edición, publicación y fecha de consulta;
- sección/página que respalda cada umbral;
- población y entorno de medición;
- regla/cálculo de CardioSync relacionado;
- pruebas de límites y revisión clínica.

## Observaciones de implementación

- El objetivo deseable de 130/80 mmHg está condicionado por `buena_tolerancia`, condición que actualmente siempre devuelve `false` en `ClinicalTargetMatcher`.
- Los cálculos de carga de hipertensión y tiempo en objetivo utilizan umbrales fijos de 135/85 mmHg y no el objetivo seleccionado.
- La regla de control domiciliario también usa 135/85 mmHg directamente.

Estas son observaciones técnicas del código, no conclusiones sobre la validez clínica de la recomendación fuente.
