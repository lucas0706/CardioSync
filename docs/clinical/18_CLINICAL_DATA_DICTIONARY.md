# Diccionario de datos clínicos

**Estado:** contrastado con los modelos y servicios de `feature/app-updates` el 17-10-2026.

Este diccionario describe los campos presentes en los contratos actuales. No implica que todos sean utilizados por el motor clínico.

## 1. BloodPressureRecord

| Campo | Tipo/Unidad | Uso actual |
|---|---|---|
| `id` | string | Identidad del registro |
| `dateTime` | string | Fecha/hora de la medición |
| `systolic`, `diastolic` | number, mmHg | PAS y PAD obligatorias |
| `heartRate` | number opcional, lpm | Frecuencia cardíaca; puede entrar en estadísticas |
| `arm` | `Arm` opcional | Brazo de medición |
| `position` | `Position` opcional | Posición |
| `origin` | `MeasurementOrigin` opcional | Procedencia |
| `notes` | string opcional | Nota del registro |
| `weight`, `height`, `bmi` | number opcional | Campos heredados/reservados |
| `glucose`, `spo2`, `temperature`, `respiratoryRate`, `pain` | number opcional | Campos heredados/reservados |
| `guideline` | string opcional | Campo reservado |

También contiene `createdAt` y `updatedAt` obligatorios.

## 2. ClinicalContext

El perfil clínico local utiliza:

- Identidad: `patientId`, `name`.
- Demografía: `age`, `sex`.
- Antropometría: `height`, `weight`, `bmi`.
- Factores: `smoking`, `diabetes`, `dyslipidemia`.
- Antecedentes: `cardiovascularDisease`, `heartFailure`, `strokeHistory`, `peripheralVascularDisease`, `chronicKidneyDisease`.

Los campos son opcionales salvo `patientId`. El perfil se guarda en SQLite por medio de `ClinicalProfileRepository`.

## 3. StatisticsSummary

Incluye total de mediciones; promedios, máximos y mínimos de PAS/PAD; media de FC opcional; registros máximo/mínimo; presión de pulso media; presión arterial media; desviaciones estándar; variabilidad; carga hipertensiva; tiempo en objetivo; adherencia; tendencia; clasificación predominante y distribución.

La carga y el tiempo en objetivo usan umbrales predeterminados de 135/85 mmHg en sus calculadores actuales.

## 4. ClinicalAnalysis y ClinicalFinding

`ClinicalAnalysis` agrupa identificador, paciente, fecha de creación, guía opcional, estadísticas opcionales, hallazgos, resultado estructurado, resumen y metadata opcional.

Cada `ClinicalFinding` contiene identificador, tipo, título, descripción opcional, severidad opcional, `guidelineId` opcional y fecha de creación.

## 5. Valores derivados

El IMC del perfil se calcula como peso en kg dividido por altura en metros al cuadrado, redondeado a un decimal. No es un valor introducido manualmente en la pantalla actual.

## 6. Campos y modelos no implementados como se describían

No existen modelos independientes actuales para `Anthropometry`, `VitalSigns`, `MeasurementContext`, `LifestyleContext` o `CardiovascularSymptoms` dentro de `src/domain/clinical/models`. Tampoco hay un `ClinicalValue` genérico con unidad, fuente, instante y confianza.

## 7. Reglas de calidad

Conservar unidades y procedencia cuando estén disponibles. Distinguir campos ausentes de ceros. No inferir que un campo opcional está validado, sincronizado o usado por reglas solo porque exista en una interfaz TypeScript.