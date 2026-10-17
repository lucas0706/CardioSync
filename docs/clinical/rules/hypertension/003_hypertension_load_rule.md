# Regla clínica 003 — Carga de mediciones elevadas

## Estado

Implementada en `HypertensionLoadRule`. El porcentaje se calcula en `HypertensionLoadCalculator`, dentro de `StatisticsEngine`.

## Cálculo estadístico

El calculador cuenta una medición como elevada si:

- PAS ≥ 135 mmHg; o
- PAD ≥ 85 mmHg.

La carga es el porcentaje de mediciones que cumplen al menos una de esas condiciones respecto del total. Con cero mediciones, devuelve 0. El calculador acepta umbrales como argumentos, pero el motor estadístico usa los valores predeterminados 135/85.

## Lógica clínica implementada

La regla genera un hallazgo cuando `statistics.hypertensionLoad > 0`. No aplica un umbral mínimo de carga clínicamente relevante: cualquier valor positivo genera el hallazgo.

## Salida

- Tipo: `hypertension-load`.
- Título: “Carga elevada de mediciones de presión arterial”.
- Severidad: `moderate`.

## Limitaciones y deuda documental

- La descripción “proporción relevante” no representa una condición adicional del código; el criterio real es mayor que cero.
- El umbral estadístico de 135/85 mmHg está fijo y no se deriva de la guía seleccionada.
- No se debe atribuir esta regla a una recomendación clínica concreta sin fuente primaria, sección/página y revisión.
- El hallazgo no diagnostica hipertensión.

## Código de referencia

- `src/domain/clinical/rules/hypertension/HypertensionLoadRule.ts`
- `src/domain/statistics/calculators/HypertensionLoadCalculator.ts`
