# Regla clínica 001 — Promedio de presión arterial domiciliaria

## Estado

Implementada en `HomeBloodPressureControlRule`.

## Entrada

La regla recibe un `StatisticsSummary` y utiliza:

- `averageSystolic`: promedio de presión sistólica.
- `averageDiastolic`: promedio de presión diastólica.

## Lógica implementada

Genera un hallazgo cuando se cumple cualquiera de estas condiciones:

- PAS promedio ≥ 135 mmHg; o
- PAD promedio ≥ 85 mmHg.

Si ambas condiciones son falsas, no genera hallazgo.

El umbral está codificado directamente en la regla. Aunque el hallazgo recibe el identificador de la guía seleccionada, el umbral no cambia dinámicamente según esa guía.

## Salida

- Tipo: `home-blood-pressure`.
- Título: “Presión arterial domiciliaria promedio elevada”.
- Severidad: `moderate`.
- Guía asociada: ID de la guía del contexto, si existe.

## Límites

- Es un hallazgo de seguimiento, no un diagnóstico.
- No reemplaza mediciones en consultorio, monitoreo ambulatorio ni evaluación médica.
- La regla no comprueba por sí misma cantidad mínima de mediciones ni duración del período.
- La fuente exacta, sección/página y población que respaldan el umbral deben documentarse antes de declarar trazabilidad clínica completa.

## Código de referencia

`src/domain/clinical/rules/hypertension/HomeBloodPressureControlRule.ts`
