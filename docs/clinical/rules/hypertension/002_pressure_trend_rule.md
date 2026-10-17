# Regla clínica 002 — Tendencia de presión arterial domiciliaria

## Estado

Implementada en `TrendRule`. La tendencia se calcula antes, mediante `TrendCalculator`, dentro del motor estadístico.

## Entrada y lógica

La regla recibe `StatisticsSummary.trend`:

- `up`: genera un hallazgo.
- `stable`: no genera hallazgo.
- `down`: no genera hallazgo.

La regla interpreta el valor recibido; no calcula la tendencia ni vuelve a analizar las mediciones individuales.

## Salida

- Tipo: `home-blood-pressure-trend`.
- Título: “Tendencia ascendente de presión arterial domiciliaria”.
- Severidad: `moderate`.
- Guía asociada: ID de la guía del contexto, si existe.

## Límites y trazabilidad

La regla no define un umbral clínico numérico ni establece diagnóstico. El resultado depende del algoritmo de `TrendCalculator` y de la cantidad/calidad de mediciones utilizadas por el motor estadístico.

La implementación no demuestra que esta interpretación sea una recomendación específica del Consenso Argentino 2025. La fuente clínica, si corresponde, debe documentarse por separado de la especificación técnica del algoritmo.

## Código de referencia

- `src/domain/clinical/rules/hypertension/TrendRule.ts`
- `src/domain/statistics/calculators/TrendCalculator.ts`
