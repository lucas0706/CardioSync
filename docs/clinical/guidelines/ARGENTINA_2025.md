# Consenso Argentino de Hipertensión Arterial 2025

## Estado en CardioSync

**Estado:** referencia bibliográfica principal incorporada. Los criterios implementados deben interpretarse según el alcance y las notas de la fuente primaria; las reglas adicionales se documentan por separado y no se atribuyen automáticamente al consenso.

La implementación identifica la guía con:

- ID: `consenso-hta-argentina-2025`
- Organizaciones declaradas: Federación Argentina de Cardiología (FAC), Sociedad Argentina de Hipertensión Arterial (SAHA) y Sociedad Argentina de Cardiología (SAC).
- Año/versionado declarado: 2025.
- Área: hipertensión.
- Población declarada: adultos.

La ficha de código es metadato de configuración; no constituye por sí misma una copia ni una validación de la guía publicada.

## Comportamiento asociado en el código

### Clasificación

`BloodPressureClassifier` implementa umbrales fijos y contiene un comentario que los atribuye al Consenso Argentino 2025:

| Categoría implementada | Condición |
|---|---|
| Hipertensión nivel 2 | PAS ≥ 160 mmHg o PAD ≥ 100 mmHg; se evalúa primero |
| Hipertensión sistólica aislada | PAS ≥ 140 mmHg y PAD < 90 mmHg, si no se activó nivel 2 |
| Hipertensión nivel 1 | PAS ≥ 140 mmHg o PAD ≥ 90 mmHg, si no se aplicó una categoría anterior |
| Presión limítrofe | PAS ≥ 130 mmHg o PAD ≥ 80 mmHg, si no se aplicó una categoría anterior |
| Normal | Ninguna de las condiciones anteriores |

La advertencia `low-diastolic` del clasificador se activa cuando la PAD evaluada es inferior a 60 mmHg. La regla independiente `BloodPressureSafetyRule` del análisis clínico conserva su umbral de PAD media inferior a 70 mmHg.

### Objetivos terapéuticos configurados

`ConsensoArgentinaHTA2025Targets` define objetivos por población y contexto:

- Población de 16 a 79 años: PAS máxima de 140 y PAD máxima de 90 mmHg.
- Objetivo deseable de 130/80 mmHg: existe en datos, pero su condición `buena_tolerancia` actualmente siempre devuelve `false` en `ClinicalTargetMatcher`; por lo tanto, ese objetivo no resulta seleccionable.
- Enfermedad renal crónica: PAS entre 120 y 129 mmHg y PAD máxima de 80 mmHg, según la configuración.
- Diabetes: PAS máxima de 130 y PAD máxima de 80 mmHg.
- Mayores de 80 años: PAS entre 140 y 150 mmHg y PAD máxima de 80 mmHg.

Estos valores describen la configuración existente en el código. No se afirma aquí que cada regla coincida fielmente con el texto oficial: falta completar la referencia exacta a documento, sección/página, población, recomendación y nivel de evidencia.

## Umbrales estadísticos que no son objetivos dinámicos de la guía

Los siguientes cálculos utilizan valores predeterminados fijos de 135/85 mmHg:

- `HypertensionLoadCalculator`: porcentaje de mediciones con PAS ≥ 135 o PAD ≥ 85.
- `TimeInTargetCalculator`: porcentaje de mediciones con PAS < 135 y PAD < 85.

La regla de control domiciliario genera un hallazgo cuando el promedio de PAS es ≥ 135 o el de PAD ≥ 85 mmHg. Estos umbrales no se obtienen dinámicamente del objetivo terapéutico seleccionado.

## Limitaciones y trabajo pendiente

1. Vincular cada regla con una fuente primaria oficial verificable, sección/página y fecha de consulta.
2. Validar clínicamente los umbrales y los grupos de población antes de atribuirles recomendación de la guía.
3. Resolver la condición `buena_tolerancia` para que el objetivo deseable pueda seleccionarse únicamente cuando exista una evaluación fiable de tolerancia.
4. Decidir si carga y tiempo en objetivo deben seguir umbrales domiciliarios fijos o recibir un objetivo explícito y versionado.
5. Añadir pruebas de límites y casos clínicos aprobados por revisión profesional.

## Seguridad

CardioSync ofrece información de seguimiento y no debe presentar estos resultados como diagnóstico ni como sustituto de una evaluación médica.


## Referencia bibliográfica primaria

Aquieri A, Rodríguez P, Vissani S, et al. **Consenso Argentino de
Hipertensión Arterial 2025**. Revista de la Federación Argentina de
Cardiología. 2025;54 (suplemento):5–64.

- Publicación oficial: https://www.revistafac.org.ar/ojs/index.php/revistafac/es/article/view/726
- PDF publicado por la Sociedad Argentina de Cardiología:
  https://www.sac.org.ar/wp-content/uploads/2025/08/COMPLETO-E-41.pdf
- Ficha institucional de la SAC:
  https://www.sac.org.ar/sac-consensos/consenso-de-hipertension-arterial-2025/

La tabla 1 corresponde a la clasificación de presión arterial en consultorio
para personas de 16 años o más. La nota de la tabla indica que, si la presión
sistólica y la diastólica corresponden a categorías distintas, se elige la
categoría más alta. La clasificación descrita en el documento se basa en el
promedio de tres lecturas de la visita inicial, con equipo y técnica
recomendados.

La referencia de esta sección identifica la publicación primaria. No implica
que todas las reglas de seguridad, los objetivos terapéuticos, los umbrales
estadísticos o las reglas domiciliarias del código hayan sido validados por
esa misma tabla. Cada regla requiere su propia correspondencia documental.
