# MeasurementContext

**Estado:** concepto arquitectónico parcialmente implementado; revisión del código de `feature/app-updates` del 17-10-2026.

## 1. Propósito conceptual

El contexto de medición describe las condiciones en las que se obtuvo una lectura: por ejemplo, brazo y posición. No representa el valor de presión arterial ni su interpretación clínica.

## 2. Representación actual

No existe un modelo de dominio independiente llamado `MeasurementContext`. Los campos `arm` y `position` están definidos directamente como opcionales en `BloodPressureRecord` y son mapeados por `createMeasurement` desde el formulario.

El contrato `BloodPressureRecord` también incluye `origin` y `notes`. No se encontraron en el modelo actual campos independientes para tipo de medición, dispositivo, tamaño del manguito, periodo de reposo o lecturas repetidas.

## 3. Relación con el análisis

El servicio de análisis recibe registros, estadísticas, contexto clínico y guía como entrada, pero la implementación de `ClinicalAnalysisDomainService` evalúa las reglas a partir de las estadísticas y el contexto. No utiliza directamente brazo o posición para modificar la interpretación.

## 4. Límite de implementación

Los conceptos de medición domiciliaria, consultorio y MAPA no deben describirse como un modelo ya persistido de `MeasurementContext`. El soporte futuro requerirá definir tipos, migraciones, importación/exportación y reglas de validación antes de separar estos campos del registro.

## 5. Principios

- Conservar el origen y los datos originales disponibles.
- No inferir técnica correcta a partir de la mera presencia de brazo o posición.
- No mezclar condiciones de medición con clasificación o diagnóstico.
- No introducir dependencias de proveedor en el dominio.