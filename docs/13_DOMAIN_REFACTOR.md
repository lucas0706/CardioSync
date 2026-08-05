# Domain Refactor – Phase 5

## Objetivo

Preparar el dominio de CardioSync para la futura incorporación de:

- ClinicalContext
- ClinicalRuleEngine
- ClinicalAnalysisEngine
- Health Connect

Sin modificar todavía la funcionalidad existente.

---

# Estado inicial

Durante la auditoría se comprobó que:

- MeasurementFormData ya representa únicamente la medición.
- createMeasurement() ya construye únicamente el núcleo de la medición.
- BloodPressureRepository mantiene compatibilidad con un modelo histórico.
- SQLite conserva columnas heredadas para compatibilidad.

---

# Arquitectura actual

Actualmente existen cinco capas claramente diferenciadas:

MeasurementForm

↓

MeasurementFormData

↓

createMeasurement()

↓

BloodPressureRecord

↓

BloodPressureRepository

↓

SQLite

El formulario ya se encuentra desacoplado del modelo persistente.

---

# Hallazgos principales

## BloodPressureRecord

Actualmente contiene información perteneciente a distintos dominios:

- Medición
- Condiciones de medición
- Parámetros fisiológicos
- Contexto clínico
- Observaciones

La interfaz conserva propiedades históricas que ya no forman parte del flujo principal de captura.

---

# Estado de BloodPressureRecord

## Núcleo de medición

- id
- dateTime
- systolic
- diastolic
- heartRate
- arm
- position
- notes
- createdAt
- updatedAt

## Información clínica candidata a ClinicalContext

- weight
- height
- bmi
- glucose
- spo2
- temperature
- respiratoryRate
- pain
- medicationName
- medicationIds

## Campos pendientes de evaluación

- device
- cuffSize
- guideline

---

# SQLite

Durante esta fase:

- No se eliminan columnas.
- No se realizan migraciones destructivas.
- Se mantiene compatibilidad con versiones anteriores.

---

# Estrategia

La refactorización se divide en cuatro etapas:

1. Consolidación del dominio.
2. Consolidación de infraestructura.
3. Limpieza de código muerto.
4. Preparación para ClinicalContext.

---

# Decisiones arquitectónicas

- BloodPressureRecord continúa siendo el Aggregate Root de la medición.
- ClinicalContext NO se implementa en esta fase.
- ClinicalRuleEngine NO se implementa.
- ClinicalAnalysisEngine NO se implementa.
- Health Connect NO se implementa.
- No se agregan nuevas dependencias.
- Se mantiene compatibilidad con Expo SDK 57.
- Se mantiene TypeScript strict.

---

# Resultado esperado

Al finalizar la Fase 5:

- Dominio consolidado.
- Arquitectura consistente.
- Repositorios preparados para evolucionar.
- SQLite compatible.
- Proyecto compilando limpio.
- Documentación sincronizada.
