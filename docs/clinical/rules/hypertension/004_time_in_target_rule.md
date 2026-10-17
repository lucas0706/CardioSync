# Regla clínica 004 — Porcentaje de mediciones dentro del objetivo

## Estado

Implementada en `TimeInTargetRule`. El indicador se calcula en `TimeInTargetCalculator`, dentro de `StatisticsEngine`.

## Cálculo estadístico implementado

Una medición se considera dentro del objetivo si se cumplen ambas condiciones:

- PAS < 135 mmHg; y
- PAD < 85 mmHg.

El porcentaje es el número de mediciones dentro de ese rango dividido por el total. Con cero mediciones, el calculador devuelve 0.

Aunque el calculador permite pasar otros umbrales, el motor estadístico actual usa 135/85 mmHg por defecto. No usa el objetivo que `ClinicalTargetSelector` selecciona para el contexto clínico.

## Lógica clínica implementada

- Si `timeInTarget >= 50`, no genera hallazgo.
- Si `timeInTarget < 50`, genera un hallazgo de severidad `moderate`.

## Salida

- Tipo: `time-in-target`.
- Título: “Tiempo en objetivo de presión arterial reducido”.

## Límites

El indicador es porcentaje de mediciones, no tiempo cronológico real entre mediciones. Por eso, “porcentaje de mediciones dentro del rango” describe el cálculo con más precisión que “porcentaje de tiempo”.

El límite del 50 % es una constante de la regla; su justificación clínica y su fuente exacta no están trazadas en el código consultado. El hallazgo no constituye diagnóstico.

## Código de referencia

- `src/domain/clinical/rules/hypertension/TimeInTargetRule.ts`
- `src/domain/statistics/calculators/TimeInTargetCalculator.ts`
