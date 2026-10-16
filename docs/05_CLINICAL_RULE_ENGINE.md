# Motor de reglas clínicas

El motor de reglas clínicas evalúa información estructurada y genera hallazgos que después se reúnen en un análisis clínico. Las reglas se ejecutan en el dominio y no dependen de las pantallas que presentan los resultados.

## 1. Contrato de una regla

Las reglas implementan la interfaz `ClinicalRule`. Su método `evaluate(input, context)` recibe una entrada específica y un `ClinicalRuleContext`, y devuelve una lista de `ClinicalFinding`.

El contexto común contiene:

- `guideline`: guía clínica usada para la evaluación, cuando está disponible.
- `clinicalContext`: contexto del paciente, cuando corresponde.
- `evaluatedAt`: fecha y hora de evaluación.

Cada regla puede definir su propio tipo de entrada. Por ejemplo, la regla de clasificación recibe las medias sistólica y diastólica; la regla de objetivos terapéuticos recibe las estadísticas y el contexto del paciente.

Las reglas no modifican las mediciones ni acceden directamente a la base de datos.

## 2. Reglas que coordina el servicio

`ClinicalAnalysisDomainService` mantiene una composición de reglas para construir el análisis. La implementación actual incluye:

| Regla | Función |
|---|---|
| `HomeBloodPressureControlRule` | Evalúa el control de la presión arterial domiciliaria según los datos que recibe. |
| `TrendRule` | Analiza tendencias de las estadísticas. |
| `HypertensionLoadRule` | Evalúa la carga de hipertensión. |
| `TimeInTargetRule` | Calcula o interpreta el tiempo dentro del objetivo a partir de la información disponible. |
| `VariabilityRule` | Evalúa la variabilidad de la presión arterial. |
| `TherapeuticTargetRule` | Compara las medias con el objetivo terapéutico seleccionado. |
| `CardiovascularRiskRule` | Identifica antecedentes clínicos que el modelo relaciona con un nivel de riesgo aumentado. |
| `BloodPressureSafetyRule` | Genera advertencias de seguridad, incluida una advertencia para presión diastólica media inferior a 70 mmHg. |
| `BloodPressureClassificationRule` | Clasifica la presión arterial media usando `BloodPressureClassifier`. |

La presencia de una regla en esta composición describe el código de coordinación. Los datos necesarios para cada evaluación pueden no estar disponibles en todos los análisis.

## 3. Flujo de ejecución

El flujo principal se implementa en `ClinicalAnalysisDomainService.analyze()`:

1. Construye el contexto común con la guía y la fecha de evaluación.
2. Ejecuta las reglas con las entradas que corresponden a cada tipo.
3. Cuando faltan estadísticas requeridas, omite las reglas que dependen de ellas.
4. Combina los hallazgos devueltos por las reglas.
5. Llama a `buildClinicalAnalysisResult` para agrupar los hallazgos por categoría.
6. Devuelve el objeto `ClinicalAnalysis`.

El servicio no calcula las estadísticas a partir de las mediciones: consume el resumen estadístico que recibe en la entrada.

## 4. Hallazgos

Cada `ClinicalFinding` describe un resultado producido por una regla. Según el tipo de hallazgo, incluye un identificador, tipo, título, descripción, severidad, referencia a la guía y fecha de creación.

Una regla puede devolver una lista vacía cuando no se cumple su condición de generación o cuando la entrada necesaria no está disponible. La ausencia de hallazgos, por sí sola, no demuestra que una medición sea normal ni que se hayan evaluado todas las reglas.

## 5. Clasificación y objetivos terapéuticos

La clasificación utiliza `BloodPressureClassifier` y la regla `BloodPressureClassificationRule` genera el hallazgo correspondiente.

La evaluación de objetivos terapéuticos sigue otra ruta: `TherapeuticTargetRule` consulta `ClinicalTargetSelector`, que obtiene los objetivos asociados a la guía y selecciona uno según la población, las condiciones del contexto y la prioridad. Luego, `TargetRangeEvaluator` compara las medias con los rangos del objetivo seleccionado.

La selección de objetivo y la clasificación son procesos diferentes. Un resultado de clasificación no equivale a una evaluación de control terapéutico.

## 6. Trazabilidad de guías

Las reglas reciben el contexto de la guía y asocian su identificador a los hallazgos cuando corresponde. Los objetivos terapéuticos también incluyen un identificador de guía.

Las fuentes, las extracciones y el alcance conocido de las reglas se describen en [Registro de guías clínicas](clinical/09_CLINICAL_GUIDELINE.md) y en las fichas específicas de cada guía. La existencia de una fuente o de una regla no implica que todas las recomendaciones del documento estén cubiertas.

## 7. Límites de interpretación

El motor genera información estructurada para apoyar el seguimiento; no sustituye una evaluación médica. La salida depende de la calidad y completitud de las entradas, de la guía seleccionada y de las reglas que se ejecutan en esa versión.

Cuando se cambia una regla, deben revisarse su fuente clínica, sus consumidores y los casos límite relevantes. Los cambios de comportamiento deben acompañarse de pruebas automatizadas apropiadas.
