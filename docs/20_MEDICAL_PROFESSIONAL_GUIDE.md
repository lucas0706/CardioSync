# Guía para profesionales de la salud: cómo funciona CardioSync

**Público:** médicos y otros profesionales que revisan datos exportados o presentados por CardioSync.  
**Propósito:** explicar el registro, la clasificación de presión arterial y la lectura de estadísticas.  
**Alcance:** descripción funcional del comportamiento documentado en el repositorio; no es una guía de práctica clínica ni una validación médica del software.

## 1. Qué es y qué no es CardioSync

CardioSync es una aplicación Android orientada al registro y seguimiento personal de la presión arterial. Permite guardar mediciones, consultar el historial, visualizar datos en gráficos y estadísticas, y preparar reportes para compartir con un profesional.

La aplicación organiza información para facilitar el seguimiento longitudinal. **No debe tratarse como un dispositivo de diagnóstico autónomo**, ni una clasificación aislada debe interpretarse como diagnóstico de hipertensión, decisión terapéutica o evaluación de una urgencia.

La interpretación clínica requiere considerar técnica de medición, repetición de registros, período de observación, síntomas, antecedentes, tratamiento, comorbilidades y la guía clínica aplicable.

## 2. Qué representa una medición

Cada registro de presión arterial representa una observación individual. Los campos principales son:

- presión arterial sistólica (PAS), en mmHg;
- presión arterial diastólica (PAD), en mmHg;
- fecha y hora;
- cuando están disponibles, frecuencia cardíaca y otros datos complementarios.

El registro observado debe distinguirse de su interpretación. La categoría que muestra la aplicación es un resultado derivado de una regla de software; no reemplaza ni modifica los valores originales registrados.

El origen de los datos importa: una medición ingresada manualmente, una importación y un dato recibido desde una integración externa pueden tener diferente contexto y metadatos. La disponibilidad de datos externos depende de las fuentes y permisos configurados.

## 3. Clasificación de presión arterial según el código de desarrollo

En la rama `feature/app-updates`, el clasificador del dominio está implementado en `src/domain/clinical/classification/BloodPressureClassifier.ts`. Su comentario identifica expresamente el **Consenso Argentino de Hipertensión Arterial 2025** y dice que aplica la clasificación de presión arterial en consultorio para personas de 16 años o más.

La categoría se determina usando PAS y PAD. El código evalúa las condiciones en este orden:

| Orden | Condición | Categoría |
|---|---|---|
| 1 | PAS ≥ 140 y PAD < 90 | Hipertensión sistólica aislada |
| 2 | PAS ≥ 160 o PAD ≥ 100 | Hipertensión arterial nivel 2 |
| 3 | PAS ≥ 140 o PAD ≥ 90 | Hipertensión arterial nivel 1 |
| 4 | PAS ≥ 130 o PAD ≥ 80 | Presión arterial limítrofe |
| 5 | Ninguna condición anterior | Presión arterial normal |

La hipertensión sistólica aislada se evalúa primero. El resultado también informa qué presión determinó la categoría y agrega la advertencia `low-diastolic` si PAD < 70. Los colores solo distinguen visualmente las etiquetas.

### 3.1 Dónde se utiliza

En la rama de desarrollo se encontraron estos usos:

- `ClinicalClassificationCalculator` clasifica cada medición del período seleccionado y cuenta las categorías para obtener su distribución y la categoría predominante.
- `StatisticsService` del dashboard clasifica cada registro para calcular la categoría predominante y el porcentaje de registros normales.
- `BloodPressureClassificationRule` clasifica las medias sistólica y diastólica que recibe como entrada del análisis clínico.
- `ClinicalAnalysisDomainService` usa `ConsensoArgentinaHTA2025` como guía predeterminada cuando no se proporciona otra.

Estos resultados no son intercambiables: clasificar cada registro, clasificar dos promedios y elegir la categoría más frecuente son operaciones distintas.

### 3.2 Objetivos terapéuticos

El código también define objetivos asociados al consenso en `src/domain/clinical/targets/guidelines/ConsensoArgentinaHTA2025Targets.ts`, con reglas para población general de 16 a 79 años, objetivos deseables si se toleran, enfermedad renal crónica, diabetes y mayores de 80 años. Un objetivo terapéutico no es lo mismo que la categoría de una medición. Los valores deben contrastarse con la publicación oficial antes de presentarlos como una transcripción validada del consenso.

### 3.3 Alcance y versión

La rama de desarrollo consultada contiene esta implementación argentina. La versión de `main` consultada previamente contiene otros clasificadores con etiquetas y umbrales distintos. Por eso, la explicación debe asociarse a una versión concreta y no extrapolarse automáticamente a todas las versiones instaladas.

La clasificación automática no confirma por sí sola un diagnóstico, la calidad técnica de la medición ni el objetivo terapéutico individual. Ante valores inesperados, deben revisarse los valores originales, el contexto y las mediciones repetidas según el criterio profesional y las guías vigentes.

## 4. Cómo leer las estadísticas

### 4.1 Selección y preparación de los datos

En la rama de desarrollo, `useStatistics()` obtiene las mediciones mediante `useMeasurements()`, usa por defecto un período de 30 días y solicita el resumen a `StatisticsDomainService`. El motor aplica el filtro temporal, ordena cronológicamente una copia de los registros para calcular la tendencia y agrega las métricas.

El total corresponde a los registros que quedan después del filtro. Los resultados describen esos registros y deben leerse considerando el período, la frecuencia de medición y los datos faltantes.

### 4.2 Métricas y fórmulas encontradas

| Métrica | Cálculo en el código | Precaución |
|---|---|---|
| Promedio de PAS, PAD y frecuencia cardíaca | Suma dividida por cantidad de valores | No equivale necesariamente a un promedio diagnóstico definido por una guía. |
| Máximos y mínimos | Mayor o menor valor de la serie | Depende de los registros disponibles y de valores atípicos. |
| Desviación estándar | Raíz cuadrada de la media de las diferencias cuadráticas respecto de la media; divisor N | Es una medida estadística de dispersión. |
| Variabilidad | Desviación estándar / promedio × 100 | Es el coeficiente de variación; no equivale automáticamente a un indicador clínico validado de variabilidad de PA. |
| Carga hipertensiva | Porcentaje de registros con PAS ≥ 135 o PAD ≥ 85 | Esos son los umbrales predeterminados de este calculador; no son los umbrales de clasificación anteriores. |
| Tiempo en objetivo | Porcentaje de registros con PAS < 135 y PAD < 85 | El código calcula proporción de mediciones, no duración temporal continua. |
| Tendencia | Último menos primer valor sistólico en orden cronológico: > 3 = ascendente; < −3 = descendente; de lo contrario = estable | Regla simple de extremos, no regresión ni evaluación clínica validada. |
| Distribución de categorías | Clasifica cada registro y cuenta cada categoría | La predominante es la más frecuente; no necesariamente coincide con la categoría del promedio. |

El motor también calcula presión de pulso y presión arterial media a partir de las series calculadas por el agregador, y luego promedia esos valores. Para interpretar formalmente estas métricas debe verificarse la fórmula concreta de sus calculadores.

Si la serie está vacía, el motor devuelve cero para varias métricas y una distribución vacía. Por eso, un cero debe leerse junto con el total de registros: no siempre significa que exista una medición de cero.

### 4.3 Gráficos

El checkpoint de Statistics V2 documenta un gráfico temporal de PAS (mmHg), PAD (mmHg) y frecuencia cardíaca (lpm). Los datos se ordenan cronológicamente. El downsampling puede reducir los puntos dibujados por rendimiento; no modifica los registros originales y no constituye un cálculo clínico.

### 4.4 Interpretación

Antes de interpretar estadísticas, revisar el período exacto, la cantidad y distribución temporal de los registros, posibles duplicados o valores atípicos y las condiciones de medición. Estas métricas describen los datos disponibles; por sí solas no demuestran causalidad ni establecen un diagnóstico.

## 5. Diferencia entre clasificación, estadísticas y análisis clínico

| Componente | Pregunta que responde | Limitación principal |
|---|---|---|
| Registro | ¿Qué valores se guardaron y cuándo? | Depende de la calidad y el contexto de la medición. |
| Clasificación | ¿Qué categoría asigna una regla a los valores evaluados? | No constituye por sí sola un diagnóstico ni una evaluación integral. |
| Estadísticas | ¿Cómo se distribuyen o evolucionan los registros del período? | Depende del período, la cantidad y la calidad de datos. |
| Análisis clínico | ¿Qué hallazgos produce el motor con las entradas y reglas disponibles? | Depende de las reglas efectivamente ejecutadas, el contexto y la guía utilizada. |
| Reporte | ¿Cómo se presenta y comparte la información seleccionada? | No añade validez clínica a los datos de origen. |

En la arquitectura documentada, las estadísticas y el análisis clínico son responsabilidades diferentes. El análisis clínico puede consumir estadísticas y contexto, ejecutar reglas y producir hallazgos estructurados. Que exista una guía registrada en el software no significa que todas sus recomendaciones estén implementadas o validadas.

## 6. Qué revisar al recibir un reporte de CardioSync

Como práctica de lectura, se recomienda:

1. Confirmar la identidad del paciente por los procedimientos habituales del servicio, sin depender únicamente de la información del archivo.
2. Revisar el intervalo temporal y las fechas de las mediciones.
3. Comprobar la cantidad y distribución de registros y detectar posibles vacíos.
4. Leer los valores originales de PAS/PAD y la frecuencia cardíaca cuando esté disponible.
5. Tratar las etiquetas de color o categoría como resultados del software, no como diagnóstico definitivo.
6. Contrastar cualquier decisión clínica con la evaluación profesional, el contexto y las guías vigentes.
7. Si un resultado parece incoherente, confirmar qué pantalla o motor produjo la clasificación y revisar los valores originales.

## 7. Seguridad y límites clínicos

- No utilizar CardioSync como único criterio para diagnosticar, descartar una enfermedad, modificar medicación o decidir una conducta urgente.
- No interpretar ausencia de alertas o hallazgos como prueba de normalidad: puede depender de datos ausentes o de reglas que no se ejecutaron.
- No asumir que todos los motores de clasificación del repositorio aplican idénticos umbrales.
- No inferir una fórmula estadística que no esté especificada y verificada.
- Ante síntomas graves o una situación potencialmente urgente, la atención no debe demorarse para consultar una aplicación o generar un reporte.

## 8. Trazabilidad técnica

Esta guía se contrastó con código de la rama de desarrollo `feature/app-updates`, commit `c62b9106f7a1a720b274bb7f386111313d08403e`, especialmente:

- `src/domain/clinical/guidelines/ConsensoArgentinaHTA2025.ts`
- `src/domain/clinical/classification/BloodPressureClassifier.ts`
- `src/domain/clinical/rules/blood-pressure/BloodPressureClassificationRule.ts`
- `src/domain/clinical/services/ClinicalAnalysisDomainService.ts`
- `src/domain/clinical/targets/guidelines/ConsensoArgentinaHTA2025Targets.ts`
- `src/domain/statistics/engines/StatisticsEngine.ts`
- `src/domain/statistics/calculators/AverageCalculator.ts`
- `src/domain/statistics/calculators/StandardDeviationCalculator.ts`
- `src/domain/statistics/calculators/VariabilityCalculator.ts`
- `src/domain/statistics/calculators/HypertensionLoadCalculator.ts`
- `src/domain/statistics/calculators/TimeInTargetCalculator.ts`
- `src/domain/statistics/calculators/TrendCalculator.ts`
- `src/domain/statistics/calculators/ClinicalClassificationCalculator.ts`
- `src/features/dashboard/services/StatisticsService.ts`
- `src/features/statistics/hooks/useStatistics.ts`

La guía describe el comportamiento encontrado en el repositorio, pero no constituye una validación clínica independiente ni una certificación regulatoria. Las fórmulas estadísticas y la unificación entre rutas de clasificación requieren una revisión técnica y clínica específica antes de presentarlas como comportamiento uniforme del producto.
