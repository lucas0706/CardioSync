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

## Campos pendientes de evaluación

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

---

# Estado y límites documentales — 2026-10-17

La separación entre medición y contexto clínico sigue siendo el principio rector. `BloodPressureRecord` debe representar la medición y no convertirse en una historia clínica general.

## Estado observado

- La clasificación clínica activa se centraliza en el dominio clínico.
- Existen servicios y modelos para Clinical Analysis y reglas clínicas.
- El árbol histórico `src/clinical/` debe distinguirse del dominio actual `src/domain/clinical/`; no asumir que ambos son equivalentes ni eliminarlos sin auditoría.
- La disponibilidad de tipos o servicios de contexto no demuestra que exista un flujo de producción completo para capturar, persistir y suministrar todo el contexto clínico.
- Cualquier migración de datos debe diseñarse y validarse antes de retirar campos o estructuras históricas.

## Criterios para continuar

1. Inspeccionar entidades, repositorios, esquema SQLite y migraciones antes de modificar el modelo.
2. Mantener compatibilidad con datos ya almacenados.
3. Evitar incorporar datos de Health Connect directamente a la entidad de medición.
4. Validar reglas clínicas con escenarios trazables y fuentes documentadas.
5. Ejecutar typecheck y pruebas relevantes antes de continuar con nuevas funcionalidades.

Esta nota actualiza el estado documental; no afirma que se haya ejecutado una nueva migración ni una prueba técnica en esta revisión.
