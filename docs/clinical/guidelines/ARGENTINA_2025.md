# Consenso Argentino de Hipertensión Arterial 2025

| Campo | Valor |
|---|---|
| Estado documental | Fuente incorporada al repositorio y con reglas asociadas |
| Organizaciones registradas en código | Federación Argentina de Cardiología (FAC), Sociedad Argentina de Hipertensión Arterial (SAHA), Sociedad Argentina de Cardiología (SAC) |
| Año | 2025 |
| Referencia bibliográfica registrada en extracción | Rev Fed Arg Cardiol. 2025; 54 (Suplemento 6): 5-64 |
| Última revisión documental | 2026-10-15 |

## 1. Estado y alcance

CardioSync ya contiene una implementación que declara utilizar el Consenso Argentino de Hipertensión Arterial 2025. También existe un PDF fuente dentro de `docs/clinical/guidelines/source/argentina/` y documentos de extracción por tema en `docs/clinical/guidelines/extraction/argentina/consenso-2025/`.

Por tanto, esta guía no debe describirse como una referencia sin investigar. El trabajo pendiente consiste en comprobar la trazabilidad completa de cada regla, la correspondencia exacta con el documento primario y la validación técnica y clínica de los escenarios.

La presencia de código o de una extracción documental no certifica por sí sola que toda la guía esté implementada ni que cada regla haya sido validada.

## 2. Evidencia encontrada en el repositorio

### Clasificación de presión arterial

Archivo de implementación:

- `src/domain/clinical/classification/BloodPressureClassifier.ts`

El comentario de implementación identifica el Consenso Argentino de Hipertensión Arterial 2025 y señala que la clasificación es para presión arterial en consultorio en personas de 16 años o más. El código implementa categorías normal, limítrofe, HTA nivel 1, HTA nivel 2 e hipertensión sistólica aislada, con los umbrales expresados en el propio clasificador.

Documento de extracción relacionado:

- [Definición y clasificación de HTA](extraction/argentina/consenso-2025/002_definicion_y_clasificacion_hta.md)

La extracción identifica la página 10 y la tabla 1 del documento fuente. Para modificar umbrales o el orden de precedencia de las categorías, debe revisarse la tabla original y los casos límite del código; no basta con cambiar las etiquetas.

### Identificación de la guía

Archivo:

- `src/domain/clinical/guidelines/ConsensoArgentinaHTA2025.ts`

El modelo de guía registra el identificador `consenso-hta-argentina-2025`, las tres organizaciones indicadas, el año 2025, el área clínica de hipertensión y población `adult`.

### Regla que genera el hallazgo

Archivo:

- `src/domain/clinical/rules/blood-pressure/BloodPressureClassificationRule.ts`

La regla invoca `BloodPressureClassifier` y asocia el hallazgo al identificador de la guía recibido en el contexto de ejecución. La clasificación de este archivo no selecciona por sí sola una guía distinta para cada población: utiliza el clasificador central que se le importa.

### Objetivos terapéuticos

Archivo:

- `src/domain/clinical/targets/guidelines/ConsensoArgentinaHTA2025Targets.ts`

El archivo declara objetivos para población general adulta, buena tolerancia, enfermedad renal crónica, diabetes y mayores de 80 años. Estos valores deben mantenerse vinculados a las secciones exactas de la fuente primaria y a pruebas que verifiquen la selección de objetivos. Esta ficha no sustituye esa revisión.

## 3. Fuente y extracción

- [Índice de fuentes clínicas](source/INDEX.md)
- [Fuente argentina](source/argentina/README.md)
- [Índice de extracción del consenso 2025](extraction/argentina/consenso-2025/README.md)
- [Extracción: definición y clasificación](extraction/argentina/consenso-2025/002_definicion_y_clasificacion_hta.md)

El repositorio identifica la fuente como *Rev Fed Arg Cardiol. 2025; 54 (Suplemento 6): 5-64*. Antes de cambiar una regla, verificar directamente el PDF incluido, su página y tabla, y registrar la decisión derivada.

## 4. Límites y validación pendiente

Esta revisión estática confirma la presencia de archivos y la relación explícita que establece el código; no confirma que todos los escenarios hayan pasado pruebas.

Pendiente de verificar:

1. Que los límites y precedencias del clasificador coincidan exactamente con la fuente primaria, incluidos valores fronterizos y combinaciones discordantes de PAS/PAD.
2. Que el rango de edad y el contexto de medición se apliquen efectivamente en el flujo que invoca la clasificación, no solo en el comentario.
3. Que los objetivos terapéuticos correspondan a las secciones y poblaciones indicadas en el consenso.
4. Que `ClinicalGuideline` seleccionada en el contexto y los hallazgos generados conserven trazabilidad correcta.
5. Que existan pruebas automatizadas y pruebas de integración para estos escenarios y que su ejecución se documente.
6. Que las diferencias con otras guías se mantengan explícitas y no se mezclen umbrales entre fuentes.

## 5. Política de cambios

Cualquier cambio clínico relacionado con este consenso debe incluir:

- referencia de fuente primaria y sección/página;
- explicación del cambio respecto de la regla anterior;
- archivos de código afectados;
- casos de prueba para límites y combinaciones relevantes;
- revisión de los consumidores de la clasificación;
- estado de validación técnica y clínica por separado.

No utilizar este documento como consejo médico ni como sustituto de evaluación profesional.

## 6. Hallazgos de auditoría: objetivos terapéuticos

La comparación estática de `ConsensoArgentinaHTA2025Targets.ts`, `ClinicalTargetSelector.ts`, `ClinicalTargetMatcher.ts`, `TherapeuticTargetRule.ts` y la extracción `004_objetivos_terapeuticos_poblaciones.md` encontró diferencias que requieren resolver antes de afirmar cobertura completa.

### 6.1 Objetivo deseable condicionado a tolerancia

La lista de objetivos contiene `arg-hta-2025-adults-16-79-desirable`, condicionado por `buena_tolerancia`. Sin embargo, `ClinicalTargetMatcher.evaluateCondition()` devuelve actualmente `false` para esa condición en todos los casos. Por ello, el selector no puede elegir ese objetivo deseable mediante el flujo actual; cuando no encuentra un objetivo aplicable, devuelve el objetivo base de la población.

**Estado:** discrepancia de implementación identificada; requiere una decisión explícita sobre cómo se representa y obtiene la tolerancia del paciente. No debe asumirse buena tolerancia por defecto.

### 6.2 Hipertensión sistólica aislada en personas de 65 a 79 años

La extracción clínica documenta un objetivo específico que puede considerarse para pacientes de 65 a 79 años con hipertensión sistólica aislada, sujeto a tolerancia y precaución por PAD baja. En el arreglo de objetivos inspeccionado no se encontró un objetivo con esas condiciones y ese rango de edad.

**Estado:** cobertura no localizada en el arreglo revisado; comprobar si existe otra implementación antes de concluir que está ausente de toda la aplicación.

### 6.3 Fragilidad y decisiones individualizadas

La extracción documenta que los objetivos deben individualizarse en pacientes frágiles y menciona escenarios de desprescripción en mayores de 80 años. En el selector y el matcher revisados no aparece una condición de fragilidad. La selección actual divide la población principalmente por edad (80 años o más frente a menores de 80) y por diabetes, enfermedad renal crónica y tolerancia.

**Estado:** brecha potencial de representación del contexto y de cobertura de reglas. Requiere revisar el modelo de contexto y decidir alcance antes de implementar.

### 6.4 Protección ante valores bajos

`TherapeuticTargetRule` no genera un hallazgo de objetivo terapéutico cuando la media sistólica es menor de 120 mmHg o la diastólica menor de 70 mmHg. Este comportamiento evita evaluar el objetivo en ese escenario, pero no genera por sí mismo una explicación o alerta específica dentro de esta regla. La extracción argentina menciona precaución con PAD <70 mmHg y otros escenarios de presión baja; verificar qué regla de seguridad independiente cubre esos casos y si sus pruebas lo demuestran.

## 7. Decisión de auditoría y siguiente paso

Estos puntos son hallazgos estáticos, no una afirmación de error clínico confirmado. No se cambió código ni se modificaron umbrales durante esta auditoría documental.

Antes de implementar correcciones:

1. Contrastar cada caso con las tablas y secciones correspondientes del PDF primario.
2. Inspeccionar el modelo completo de `ClinicalContext` y el flujo que lo construye.
3. Definir cómo se representa la tolerancia y la fragilidad sin inferirlas de datos ausentes.
4. Añadir pruebas unitarias para selección por edad, diabetes, enfermedad renal crónica, tolerancia, hipertensión sistólica aislada y límites de seguridad.
5. Revisar cómo se comunica una evaluación omitida para que no se confunda con un resultado normal.
6. Documentar por separado la decisión clínica, el cambio técnico y el resultado de las pruebas.


## 8. Seguimiento del flujo de contexto y selección — 2026-10-15

### Flujo inspeccionado

- `ClinicalContext` permite que `age`, `diabetes` y `chronicKidneyDisease` estén ausentes.
- `ClinicalProfileService` delega la lectura y escritura al repositorio del perfil clínico; `useClinicalProfile` consulta el perfil local mediante `LOCAL_PROFILE_ID`.
- `ClinicalAnalysisDomainService` pasa `input.context` a las reglas y, si no se suministra otra guía, selecciona `ConsensoArgentinaHTA2025`.
- `TherapeuticTargetRule` utiliza `input.clinicalContext` y el identificador de guía para llamar a `ClinicalTargetSelector`.

### Riesgos de selección observados estáticamente

1. El selector considera población `mayores_80` solo cuando `age >= 80`; todos los demás valores, incluso edad ausente y edades menores de 16, se asignan a `adultos_16_79`. La validación del rango etario no se realiza en el selector inspeccionado.
2. Si ningún objetivo cumple todas sus condiciones, el selector devuelve el primer objetivo de la población como fallback. Esto explica el fallback al objetivo general cuando `buena_tolerancia` devuelve falso, pero necesita pruebas específicas con contextos incompletos.
3. Los objetivos de diabetes y enfermedad renal crónica tienen condiciones de comorbilidad, pero no incluyen `buena_tolerancia` en el arreglo `conditions`, aunque sus descripciones limitan el objetivo a cuando sea tolerado. La equivalencia con la fuente primaria está pendiente.
4. La regla de objetivo terapéutico no genera un hallazgo cuando la media PAS es <120 mmHg o PAD <70 mmHg. En esta revisión no se completó la trazabilidad de una posible regla de seguridad independiente para esos escenarios.

### Estado

Son riesgos y discrepancias de implementación observados en los archivos citados, no conclusiones de ausencia de cobertura en toda la aplicación ni recomendaciones clínicas nuevas. No se modificó código. Antes de corregir se debe revisar el formulario y repositorio del perfil, todos los consumidores del análisis, las reglas de seguridad y la fuente primaria, y agregar pruebas automatizadas para las condiciones y los casos límite.
