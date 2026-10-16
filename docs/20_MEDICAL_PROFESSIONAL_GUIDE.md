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

## 3. Cómo se realiza la clasificación de presión arterial

### 3.1 Principio de evaluación

La clasificación automática compara los valores de PAS y PAD con umbrales definidos en el código. La condición que se alcanza primero determina la categoría devuelta. Cuando una condición utiliza “o”, basta con que se cumpla el umbral sistólico **o** el diastólico.

La clasificación de una medición individual no es lo mismo que:
- diagnosticar hipertensión a partir de mediciones repetidas;
- determinar control terapéutico respecto de un objetivo individual;
- analizar el promedio de un período;
- valorar riesgo cardiovascular global;
- establecer una conducta urgente.

### 3.2 Clasificador usado en el flujo de mediciones

En el código de la interfaz de mediciones, la función `classifyBloodPressure(systolic, diastolic)` evalúa las condiciones en este orden:

| Orden | Condición del código | Categoría mostrada |
|---|---|---|
| 1 | PAS ≥ 140 y PAD < 90 | Hipertensión sistólica aislada |
| 2 | PAS ≥ 180 o PAD ≥ 110 | Hipertensión grado 3 |
| 3 | PAS ≥ 160 o PAD ≥ 100 | Hipertensión grado 2 |
| 4 | PAS ≥ 140 o PAD ≥ 90 | Hipertensión grado 1 |
| 5 | PAS ≥ 130 o PAD ≥ 85 | Normal alta |
| 6 | PAS ≥ 120 o PAD ≥ 80 | Normal |
| 7 | Si no se cumple ninguna condición anterior | Óptima |

La interfaz asigna colores a las categorías para distinguirlas visualmente. El color es una ayuda de presentación, no una medida adicional ni una recomendación terapéutica.

**Importante:** la primera condición se evalúa antes que las demás. Por ello, en este flujo, una PAS ≥ 140 con PAD < 90 se etiqueta como sistólica aislada antes de evaluar los demás rangos.

### 3.3 Existen rutas de clasificación distintas en el código

El repositorio también contiene motores de clasificación por guía. Por ejemplo, el clasificador identificado como ESC 2024 aplica grado 3 con PAS ≥ 180 o PAD ≥ 110, mientras que la clase interna denominada `CardioSyncGuide` usa PAS ≥ 180 o PAD ≥ 120 para la categoría “Emergencia hipertensiva”. La función de interfaz y esos motores no tienen exactamente las mismas categorías ni los mismos umbrales.

Por esta razón, no debe asumirse que toda pantalla, reporte o motor usa necesariamente el mismo clasificador. El contexto de la vista y la versión instalada deben verificarse cuando la categoría tenga relevancia clínica. Este documento hace explícita esa diferencia; no pretende armonizar ni validar clínicamente los umbrales.

### 3.4 Cómo interpretar la etiqueta

La etiqueta es una clasificación automatizada basada en valores numéricos y reglas programadas. No demuestra por sí sola:
- que la medición se haya realizado con técnica correcta;
- que el paciente tenga o no hipertensión sostenida;
- que el promedio domiciliario o ambulatorio sea equivalente;
- que se haya descartado un error de medición;
- que el paciente esté dentro o fuera de su objetivo terapéutico individual.

Ante valores inesperados, deben revisarse el registro original, el contexto y la repetición de las mediciones de acuerdo con el criterio profesional y las guías vigentes.

## 4. Cómo leer las estadísticas

### 4.1 Qué resumen ofrecen

Las estadísticas se construyen a partir de registros reales y del período seleccionado en la aplicación. La pantalla permite seleccionar períodos, incluidos rangos personalizados, y visualizar la evolución temporal de las variables disponibles.

El gráfico documentado representa principalmente:
- **PAS**, en mmHg;
- **PAD**, en mmHg;
- **frecuencia cardíaca**, en latidos por minuto (lpm).

Según los registros disponibles, pueden existir otros datos asociados, como peso, glucosa, saturación de oxígeno, temperatura o frecuencia respiratoria. La presencia de una serie depende de que haya datos y de que el flujo correspondiente la incluya.

Los datos del gráfico se ordenan cronológicamente por fecha y hora. Para mantener un rendimiento adecuado, la preparación visual documentada limita el conjunto de puntos representados mediante downsampling a un máximo de 500 puntos. Esto afecta la cantidad de puntos dibujados, no debe interpretarse como una regla clínica ni como un nuevo registro medido.

### 4.2 Qué significan y qué no significan

Las estadísticas describen el conjunto de registros incluidos en el período seleccionado. Debe comprobarse siempre:
- qué fechas abarca el período;
- cuántas mediciones están incluidas;
- si existen días o franjas horarias sin datos;
- si hay mediciones duplicadas o valores atípicos;
- si el método y las condiciones de medición fueron comparables;
- si se están comparando variables con unidades distintas.

Una gráfica de PAS, PAD y frecuencia cardíaca permite observar patrones temporales, pero no demuestra por sí sola causalidad ni establece una relación entre las variables.

### 4.3 Fórmulas y límites de esta documentación

El repositorio consultado confirma el filtrado por período, la ordenación cronológica y las series principales del gráfico. Sin embargo, esta guía **no certifica una fórmula clínica específica** para todos los indicadores estadísticos ni una definición universal de tendencia, variabilidad, carga hipertensiva o tiempo en rango. Esos indicadores deben documentarse y verificarse contra la implementación concreta antes de utilizarlos para una interpretación clínica.

No se debe inferir que un indicador está implementado porque aparezca en un documento conceptual o en una especificación. Del mismo modo, un promedio estadístico no equivale automáticamente a un promedio diagnóstico definido por una guía.

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

Esta guía se elaboró contrastando los documentos del repositorio con las siguientes implementaciones localizadas en `main`:

- `src/features/measurements/utils/classifyBloodPressure.ts`
- `src/features/measurements/constants/classification.ts`
- `src/clinical/esc2024/classification.ts`
- `src/clinical/cardiosync/classification.ts`
- `src/clinical/trends/TrendAnalysis.ts`
- `docs/13_CHECKPOINT_STATISTICS_V2_2026-08-10.md`

La guía describe el comportamiento encontrado en el repositorio, pero no constituye una validación clínica independiente ni una certificación regulatoria. Las fórmulas estadísticas y la unificación entre rutas de clasificación requieren una revisión técnica y clínica específica antes de presentarlas como comportamiento uniforme del producto.
