# ClinicalContext

**Estado:** contrastado con `src/domain/clinical/models/ClinicalContext.ts` el 17-10-2026.

## 1. Responsabilidad actual

`ClinicalContext` representa información opcional a nivel de paciente utilizada como contexto para el análisis clínico. En la implementación actual funciona también como contrato del perfil local; no es un agregado compuesto por submodelos independientes ni un contexto vinculado individualmente a una medición.

## 2. Campos implementados

- Identidad: `patientId`, `name`.
- Demografía: `age`, `sex` (`male` o `female`).
- Antropometría: `height`, `weight`, `bmi`.
- Factores cardiovasculares: `smoking`, `diabetes`, `dyslipidemia`.
- Antecedentes: `cardiovascularDisease`, `heartFailure`, `strokeHistory`, `peripheralVascularDisease`.
- Condición renal: `chronicKidneyDisease`.

Los campos opcionales pueden estar ausentes. La persistencia SQLite convierte los booleanos a enteros y los recupera como booleanos.

## 3. Persistencia e interfaz

`ClinicalProfileService` delega las operaciones al `ClinicalProfileRepository`. El repositorio lee y guarda el perfil en la tabla `clinical_profile`. La pantalla `ProfileScreen` permite editar los datos enumerados y calcula el IMC a partir de talla y peso positivos.

El perfil local utiliza el identificador `local-user`. Esto no constituye todavía un modelo multiusuario o una historia clínica longitudinal.

## 4. Relación con el análisis

`ClinicalAnalysisDomainService` pasa el contexto a las reglas. La regla de riesgo cardiovascular utiliza antecedentes cardiovasculares, enfermedad renal crónica y diabetes para generar un hallazgo de factores asociados a riesgo aumentado. La selección de objetivos terapéuticos usa edad, diabetes y enfermedad renal crónica en las condiciones implementadas.

La presencia de un campo en el perfil no implica que todas las reglas clínicas lo utilicen.

## 5. Fuera del alcance actual

No están implementados como componentes de `ClinicalContext` independientes:

- `MeasurementContext`;
- `VitalSigns`;
- `LifestyleContext`;
- `CardiovascularSymptoms`;
- `ClinicalContextBuilder`;
- `ContextQualityEngine`;
- `ClinicalDataProvider`.

Health Connect dispone de flujos propios de sincronización, pero no se debe asumir que sus datos se combinan automáticamente con el perfil y se entregan al análisis clínico.

## 6. Restricciones

No copiar automáticamente el perfil a cada registro de presión arterial. No presentar campos del perfil como diagnóstico ni generar hallazgos únicamente porque exista información. Las ampliaciones deben mantener el contrato único y evitar modelos duplicados.