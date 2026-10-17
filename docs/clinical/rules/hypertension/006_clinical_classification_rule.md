# Regla clínica 006 — Clasificación de presión arterial

## Estado

Implementada en `BloodPressureClassificationRule`. La clasificación se realiza en `BloodPressureClassifier`.

## Entrada

La regla recibe el promedio de presión sistólica y diastólica. No recibe ni consulta la guía para elegir los umbrales de clasificación.

## Lógica de clasificación implementada

El clasificador aplica este orden:

1. **Hipertensión sistólica aislada:** PAS ≥ 140 mmHg y PAD < 90 mmHg.
2. **Hipertensión nivel 2:** PAS ≥ 160 mmHg o PAD ≥ 100 mmHg.
3. **Hipertensión nivel 1:** PAS ≥ 140 mmHg o PAD ≥ 90 mmHg.
4. **Presión limítrofe:** PAS ≥ 130 mmHg o PAD ≥ 80 mmHg.
5. **Presión normal:** ninguna condición anterior.

La categoría se determina mediante los umbrales codificados, no mediante un motor que seleccione dinámicamente los criterios de la guía configurada. El código incluye un comentario que atribuye estos umbrales al Consenso Argentino de Hipertensión Arterial 2025; la referencia exacta a sección/página sigue pendiente de documentación.

## Advertencia de seguridad

El clasificador agrega `low-diastolic` a `safetyWarnings` cuando PAD < 70 mmHg. La regla clínica de clasificación no convierte esa advertencia en un diagnóstico.

## Salida

- Tipo: `blood-pressure-classification`.
- Título: etiqueta de la categoría calculada.
- Severidad: `low` si la categoría es `normal`; de lo contrario, `moderate`.
- Guía asociada: ID de la guía del contexto, si existe.

## Límites

La clasificación de valores promedio no equivale por sí sola a un diagnóstico clínico. La documentación debe diferenciar los umbrales de clasificación de consultorio de los umbrales de presión domiciliaria y los objetivos terapéuticos.

## Código de referencia

- `src/domain/clinical/rules/blood-pressure/BloodPressureClassificationRule.ts`
- `src/domain/clinical/classification/BloodPressureClassifier.ts`
