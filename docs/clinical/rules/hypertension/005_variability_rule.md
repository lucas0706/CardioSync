# Regla clínica 005 — Variabilidad de presión arterial

## Estado

Implementada en `VariabilityRule`. Los indicadores se calculan en `VariabilityCalculator`.

## Cálculo estadístico

Para cada serie de presión sistólica y diastólica, el calculador obtiene:

```text
variabilidad (%) = desviación estándar / promedio × 100
```

Devuelve 0 cuando hay una o ninguna medición, o cuando el promedio es 0. La desviación estándar utiliza la implementación de `StandardDeviationCalculator`.

## Lógica clínica implementada

Genera un hallazgo si se cumple cualquiera de estas condiciones:

- variabilidad sistólica > 15 %; o
- variabilidad diastólica > 10 %.

Los límites 15 y 10 están codificados directamente en la regla. No se seleccionan según la guía clínica del contexto.

## Salida

- Tipo: `blood-pressure-variability`.
- Título: “Variabilidad elevada de presión arterial domiciliaria”.
- Severidad: `moderate`.

## Límites y trazabilidad

La regla interpreta un coeficiente de variación; no calcula la variabilidad ni evalúa la calidad de las mediciones. La fuente clínica y la justificación de los límites deben verificarse y registrarse antes de atribuirlos a una guía específica.

El hallazgo no diagnostica una condición clínica.

## Código de referencia

- `src/domain/clinical/rules/hypertension/VariabilityRule.ts`
- `src/domain/statistics/calculators/VariabilityCalculator.ts`
