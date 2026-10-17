# BloodPressureRecord

**Estado:** modelo contrastado con `src/domain/measurements/BloodPressureRecord.ts` el 17-10-2026.

## 1. Responsabilidad

`BloodPressureRecord` representa una medición individual de presión arterial. Es el contrato utilizado por el dominio de mediciones, almacenamiento, estadísticas y flujos relacionados. No debe confundirse con un diagnóstico ni con un resultado de análisis.

## 2. Campos definidos actualmente

| Campo | Estado | Significado |
|---|---|---|
| `id` | Obligatorio | Identificador del registro |
| `createdAt`, `updatedAt` | Obligatorios | Marcas temporales de creación y modificación |
| `dateTime` | Obligatorio | Fecha/hora de la medición |
| `systolic`, `diastolic` | Obligatorios | PAS y PAD en mmHg |
| `heartRate` | Opcional | Frecuencia cardíaca asociada al registro |
| `arm`, `position` | Opcionales | Brazo y posición durante la medición |
| `origin` | Opcional | Procedencia del registro |
| `notes` | Opcional | Notas asociadas al evento |
| `weight`, `height`, `bmi` | Reservados | Campos heredados previstos para futura separación |
| `glucose`, `spo2`, `temperature`, `respiratoryRate`, `pain` | Reservados | Campos adicionales aún presentes en el contrato |
| `guideline` | Reservado | Campo opcional previsto para análisis futuro |

## 3. Separación arquitectónica: estado real

El código todavía mantiene dentro de `BloodPressureRecord` campos que conceptualmente pertenecen a contexto u otros dominios. No debe documentarse como si ya hubieran sido migrados a entidades independientes. La extracción de estos campos requiere una migración deliberada y compatibilidad con almacenamiento, importación/exportación y datos históricos.

El perfil clínico persistido en `clinical_profile` es independiente del registro de medición, aunque el contrato de medición conserve campos heredados.

## 4. Creación y persistencia

`createMeasurement` construye registros desde el formulario, asigna identificador y marcas temporales, y mapea fecha/hora, PAS, PAD, frecuencia cardíaca, brazo, posición y notas. `MeasurementService` delega operaciones al repositorio de presión arterial.

## 5. Reglas de integridad

- No sobrescribir los valores originales durante la interpretación clínica.
- No tratar campos reservados como si ya pertenecieran a un modelo separado.
- Mantener fecha/hora y procedencia cuando estén disponibles.
- Los cambios estructurales deben considerar compatibilidad de SQLite, importación, exportación y registros existentes.

## 6. Dependencias actuales

El modelo es consumido por estadísticas y por los flujos de registro e historial. La clasificación clínica se calcula mediante servicios/reglas separados; no es un campo obligatorio del registro.