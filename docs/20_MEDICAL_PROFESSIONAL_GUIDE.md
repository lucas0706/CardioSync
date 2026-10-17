# Guía para profesionales de la salud: cómo funciona CardioSync

## Propósito de esta guía

Esta guía explica cómo CardioSync registra y presenta mediciones de presión arterial, cómo asigna categorías, qué significan sus estadísticas y qué aspectos conviene revisar al interpretar un reporte.

Está dirigida a profesionales de la salud que reciben información de la aplicación. No requiere conocimientos de programación. Describe el comportamiento implementado en la versión de CardioSync tomada como referencia para esta documentación.

## 1. Qué es CardioSync

CardioSync es una aplicación Android para el registro y seguimiento personal de la presión arterial. Permite conservar mediciones, consultar el historial, visualizar la evolución en gráficos y revisar estadísticas de un período. La información puede utilizarse para preparar reportes y compartirlos con un profesional.

La aplicación ayuda a organizar los datos a lo largo del tiempo. No reemplaza la evaluación clínica, no confirma por sí sola un diagnóstico y no debe utilizarse como único criterio para decidir tratamientos o conductas urgentes.

Para interpretar sus resultados es necesario considerar la técnica de medición, la repetición de los registros, el período observado, los síntomas, los antecedentes, los tratamientos y las condiciones particulares de cada paciente.

## 2. Qué información contiene un registro

Una medición puede incluir:

- **Presión arterial sistólica (PAS):** presión registrada durante la contracción del corazón, expresada en mmHg.
- **Presión arterial diastólica (PAD):** presión registrada entre latidos, expresada en mmHg.
- **Fecha y hora:** permiten ubicar la medición en el tiempo.
- **Frecuencia cardíaca:** cuando está disponible.
- **Otros datos complementarios:** según la información registrada o la fuente de origen.

Los valores originales deben distinguirse de las interpretaciones que la aplicación calcula a partir de ellos. Una categoría, un color o un resumen estadístico es información derivada: no modifica los valores registrados ni demuestra por sí mismo que la medición se haya realizado correctamente.

Los datos pueden incorporarse de distintas maneras, por ejemplo mediante ingreso manual o integraciones disponibles. El contexto y los metadatos dependen del origen de cada registro y de los permisos configurados.

## 3. Cómo clasifica la presión arterial

La versión de referencia aplica una clasificación basada en el **Consenso Argentino de Hipertensión Arterial 2025**, para la clasificación de presión arterial en consultorio en personas de 16 años o más.

La categoría se determina a partir de la PAS y la PAD. La aplicación evalúa las condiciones en el orden siguiente:

| Orden de evaluación | Valores registrados | Categoría asignada |
|---|---|---|
| 1 | PAS ≥ 140 mmHg y PAD < 90 mmHg | Hipertensión sistólica aislada |
| 2 | PAS ≥ 160 mmHg o PAD ≥ 100 mmHg | Hipertensión arterial nivel 2 |
| 3 | PAS ≥ 140 mmHg o PAD ≥ 90 mmHg | Hipertensión arterial nivel 1 |
| 4 | PAS ≥ 130 mmHg o PAD ≥ 80 mmHg | Presión arterial limítrofe |
| 5 | Ninguna de las condiciones anteriores | Presión arterial normal |

La hipertensión sistólica aislada se evalúa primero. Por ese motivo, cuando se cumple esa condición, se asigna esa categoría antes de evaluar las siguientes.

La aplicación también genera una advertencia cuando la PAD es inferior a 70 mmHg. Esa advertencia es una señal para prestar atención al valor registrado; no equivale por sí sola a un diagnóstico.

Los colores utilizados en la interfaz sirven para distinguir visualmente las categorías. El color no aporta una evaluación clínica adicional.

### ¿Dónde aparece esta clasificación?

La clasificación se utiliza en más de un tipo de resultado:

- **En las mediciones individuales:** asigna una categoría a cada registro.
- **En la distribución estadística:** cuenta cuántos registros pertenecen a cada categoría y permite identificar la más frecuente.
- **En el resumen del panel principal:** se utiliza para calcular la categoría predominante y el porcentaje de registros clasificados como normales.
- **En el análisis clínico:** puede aplicarse a los valores medios de PAS y PAD recibidos por ese análisis.

Estos resultados responden preguntas diferentes. La categoría de una medición individual no necesariamente coincide con la categoría calculada a partir de dos promedios, ni con la categoría que aparece con mayor frecuencia en el período.

### Objetivos terapéuticos

CardioSync también contiene reglas de objetivos de presión arterial asociadas al consenso, con condiciones diferenciadas para determinados grupos, como población general de 16 a 79 años, personas con enfermedad renal crónica o diabetes, y mayores de 80 años. Algunos objetivos se expresan como deseables si son tolerados.

Un objetivo terapéutico y una categoría de clasificación no son lo mismo. Los objetivos deben interpretarse en función de la situación clínica, la tolerancia y el criterio del profesional. Antes de utilizar sus valores como transcripción normativa del consenso, corresponde contrastarlos con la publicación oficial vigente.

## 4. Cómo interpretar las estadísticas

Las estadísticas resumen los registros incluidos en un período seleccionado. En la configuración habitual, el período inicial es de 30 días, aunque el análisis depende del intervalo elegido por el usuario.

El sistema filtra las mediciones correspondientes al período y utiliza su orden cronológico para calcular la tendencia. Por lo tanto, las estadísticas describen los datos disponibles dentro del intervalo analizado, no necesariamente el estado clínico completo del paciente.

### Métricas principales

| Métrica | Qué representa | Consideración para la lectura clínica |
|---|---|---|
| Promedio de PAS, PAD y frecuencia cardíaca | La suma de los valores disponibles dividida por la cantidad de valores | No equivale necesariamente a un promedio diagnóstico definido por una guía clínica. |
| Valor máximo y mínimo | Los valores más alto y más bajo de la serie | Pueden estar influidos por valores atípicos, errores de registro o condiciones particulares de medición. |
| Desviación estándar | Cuánto se dispersan los valores alrededor del promedio | Describe dispersión estadística; no constituye por sí sola una conclusión clínica. |
| Variabilidad | Desviación estándar dividida por el promedio y multiplicada por 100 | Es el coeficiente de variación. No debe interpretarse automáticamente como un indicador clínico validado de variabilidad de presión arterial. |
| Carga hipertensiva | Porcentaje de registros con PAS ≥ 135 mmHg o PAD ≥ 85 mmHg | Utiliza estos umbrales específicos del cálculo. No son los mismos umbrales de la clasificación por categorías descrita antes. |
| Registros en objetivo | Porcentaje de registros con PAS < 135 mmHg y PAD < 85 mmHg | Es una proporción de mediciones que cumplen ambas condiciones, no una medición del tiempo real transcurrido dentro del objetivo. |
| Tendencia sistólica | Diferencia entre el último y el primer valor de PAS del período, ordenados cronológicamente | Una diferencia superior a 3 se considera ascendente; inferior a −3, descendente; entre ambos límites, estable. Es una regla sencilla basada en los extremos, no un análisis de regresión. |
| Distribución por categorías | Cantidad de registros asignados a cada categoría | La categoría predominante es la más frecuente y puede diferir de la categoría de un promedio. |

El sistema también presenta cálculos de presión de pulso y presión arterial media. Esas métricas deben interpretarse junto con sus valores de origen y el contexto clínico, no como conclusiones diagnósticas independientes.

### Cuando hay pocos datos o no hay datos

La utilidad de un resumen depende de la cantidad y distribución de las mediciones. Un período con pocos registros o con grandes intervalos sin mediciones puede no representar adecuadamente la evolución.

Cuando no hay registros, algunas métricas se muestran como cero y la distribución de categorías queda vacía. En ese contexto, un cero no significa que se haya registrado una presión de cero: debe leerse junto con el total de mediciones disponibles.

### Cómo leer los gráficos

Los gráficos permiten observar la evolución temporal de PAS, PAD y frecuencia cardíaca cuando esta última está disponible. Los puntos se ordenan cronológicamente.

Para mantener un rendimiento adecuado, la representación gráfica puede reducir la cantidad de puntos dibujados. Esa simplificación visual no cambia las mediciones guardadas ni debe confundirse con una reducción del historial original.

## 5. Diferencia entre medición, clasificación, estadísticas y análisis clínico

- **Medición:** informa qué valores se registraron y cuándo.
- **Clasificación:** asigna una categoría a los valores evaluados según las reglas disponibles.
- **Estadísticas:** resumen la distribución y evolución de los registros de un período.
- **Análisis clínico:** combina las entradas y las reglas disponibles para producir hallazgos estructurados.
- **Reporte:** presenta la información seleccionada para facilitar su consulta o intercambio.

Estas funciones son complementarias, pero no equivalentes. La existencia de una regla o de una guía dentro de la aplicación no significa que todas las recomendaciones de esa guía estén automatizadas, ni que los resultados hayan sido validados como sustituto del juicio clínico.

## 6. Recomendaciones al revisar un reporte

Al recibir información de CardioSync, puede ser útil:

1. Confirmar la identidad del paciente mediante los procedimientos habituales del servicio; no depender únicamente de la información incluida en un archivo.
2. Revisar las fechas y el intervalo que abarca el reporte.
3. Comprobar el número de mediciones y su distribución en el tiempo.
4. Examinar los valores originales de PAS y PAD, y la frecuencia cardíaca cuando esté disponible.
5. Considerar posibles registros atípicos, duplicados o períodos sin datos.
6. Interpretar las categorías, los colores y las estadísticas como información de apoyo, no como diagnóstico definitivo.
7. Si un resultado parece incoherente, contrastarlo con los valores originales y el contexto en que se realizó la medición.

## 7. Seguridad y límites clínicos

- No utilizar CardioSync como único criterio para diagnosticar o descartar una enfermedad, modificar medicación o decidir una conducta urgente.
- La ausencia de alertas o hallazgos no demuestra que todo sea normal; puede depender de los datos disponibles y de las reglas aplicadas.
- No asumir que todos los resúmenes responden a los mismos umbrales: una categoría individual, una estadística y un análisis clínico pueden evaluar los valores de maneras diferentes.
- No interpretar una estadística aislada sin revisar el período, la cantidad de mediciones y la calidad de los datos.
- Ante síntomas graves o una situación potencialmente urgente, no debe demorarse la atención para consultar la aplicación ni para generar un reporte.

## Alcance de la información

Esta guía describe las funciones y reglas identificadas en la versión de CardioSync tomada como referencia. Su propósito es ayudar a leer la información que presenta la aplicación; no constituye una validación clínica independiente, una certificación regulatoria ni una recomendación de tratamiento. La interpretación final corresponde al profesional de la salud, con los datos clínicos pertinentes y las guías vigentes.
