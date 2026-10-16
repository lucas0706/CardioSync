# Dominio clínico de CardioSync

El dominio clínico reúne los modelos y reglas que permiten interpretar las mediciones y sus estadísticas en función de la información clínica disponible. Está separado de la presentación y de la persistencia: las pantallas muestran los resultados, mientras que los servicios de dominio coordinan la evaluación.

## 1. Componentes principales

El código clínico se encuentra en `src/domain/clinical` y se organiza en:

| Área | Responsabilidad |
|---|---|
| `models` | Contexto del paciente, guía clínica, análisis y hallazgos. |
| `classification` | Clasificación de presión arterial. |
| `guidelines` | Metadatos de las guías incorporadas. |
| `rules` | Reglas de clasificación, seguridad, hipertensión y riesgo cardiovascular. |
| `targets` | Objetivos terapéuticos y selección según guía y contexto. |
| `services` | Coordinación del análisis y construcción de resultados. |
| `warnings` | Reglas y definiciones de advertencias clínicas. |

## 2. Contexto clínico del paciente

`ClinicalContext` representa información del paciente que puede influir en la interpretación, pero que no pertenece a una medición individual. Se mantiene separado de `BloodPressureRecord`.

El modelo actual admite los siguientes campos:

| Grupo | Campos |
|---|---|
| Identidad | `patientId`, `name` |
| Demografía | `age`, `sex` |
| Antropometría | `height`, `weight`, `bmi` |
| Factores de riesgo | `smoking`, `diabetes`, `dyslipidemia` |
| Antecedentes cardiovasculares | `cardiovascularDisease`, `heartFailure`, `strokeHistory`, `peripheralVascularDisease` |
| Antecedente renal | `chronicKidneyDisease` |

Salvo `patientId`, los campos del perfil son opcionales. La ausencia de un dato no equivale a que la condición sea falsa y las reglas deben tratar los valores desconocidos de forma explícita.

En la versión actual, el perfil V1 almacena información ingresada manualmente. Los datos provenientes de Health Connect se gestionan por separado y no se incorporan automáticamente a este modelo.

## 3. Mediciones y estadísticas

La medición de presión arterial es el dato registrado. Las estadísticas son valores derivados de un conjunto de mediciones, como los promedios sistólico y diastólico, tendencias y variabilidad.

El dominio clínico consume esos resultados para producir hallazgos; no reemplaza el registro original ni es responsable de calcular las estadísticas. Esta separación permite utilizar los mismos datos estadísticos en distintas vistas sin duplicar la interpretación clínica.

## 4. Guías clínicas

Las guías se representan mediante metadatos de `ClinicalGuideline`. La guía argentina de hipertensión de 2025 se registra en `ConsensoArgentinaHTA2025` y es la guía predeterminada del servicio de análisis cuando no se proporciona otra.

Los objetivos terapéuticos están definidos por guía y se consultan a través de `ClinicalTargetRepository`. La selección utiliza el contexto del paciente, la población definida para cada objetivo, sus condiciones y su prioridad.

La ficha de [Consenso Argentino de Hipertensión Arterial 2025](clinical/guidelines/ARGENTINA_2025.md) describe la fuente y las reglas relacionadas. No todas las recomendaciones de una guía deben considerarse implementadas por el hecho de que la guía esté registrada.

## 5. Reglas y hallazgos

Las reglas reciben datos específicos y un `ClinicalRuleContext`, y devuelven una lista de `ClinicalFinding`. Un hallazgo contiene información como tipo, título, descripción, severidad, identificador de guía y fecha de creación.

Una regla puede devolver cero hallazgos si no dispone de los datos requeridos o si el escenario no corresponde a su evaluación. Por eso, una lista vacía no debe interpretarse automáticamente como confirmación de que todo está normal.

Las reglas no deben modificar mediciones ni realizar operaciones de persistencia. Su función es interpretar la información recibida y comunicar el resultado mediante hallazgos estructurados.

## 6. Servicio de análisis

`ClinicalAnalysisDomainService` coordina el proceso:

1. Recibe el contexto clínico y las estadísticas disponibles.
2. Selecciona la guía indicada o usa la guía argentina predeterminada.
3. Ejecuta las reglas registradas en el servicio.
4. Reúne los hallazgos generados.
5. Construye el resultado agrupado y devuelve un `ClinicalAnalysis`.

El análisis conserva el identificador del paciente, la fecha de creación, la guía, las estadísticas disponibles, los hallazgos y un resultado estructurado.

## 7. Límites del dominio

El dominio clínico no sustituye una evaluación profesional ni convierte un resultado automático en un diagnóstico. La interpretación depende de los datos disponibles y de las reglas incorporadas en la versión de la aplicación.

La fuente clínica, la regla implementada y los escenarios cubiertos por pruebas son aspectos distintos. Las fuentes y el alcance de cada guía se documentan en [Guías clínicas](clinical/09_CLINICAL_GUIDELINE.md).
