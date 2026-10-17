# Comparación de guías clínicas

**Estado:** documentación comparativa en desarrollo; soporte ejecutable contrastado el 17-10-2026.

## 1. Fuentes documentadas

La base documental contiene documentos para el Consenso Argentino de Hipertensión Arterial 2025, AHA/ACC 2025, ESC 2024 e ISH 2020. La existencia de un documento de una guía no implica que sus reglas estén implementadas en el motor.

## 2. Soporte que se observa en código

- `ConsensoArgentinaHTA2025` está registrado como guía predeterminada.
- `ClinicalTargetRepository` devuelve objetivos únicamente para `consenso-hta-argentina-2025`.
- `ConsensoArgentinaHTA2025Targets` define objetivos para población general, diabetes, enfermedad renal crónica y mayores de 80 años.
- `ClinicalTargetSelector` selecciona según edad, condiciones y prioridad.
- `BloodPressureClassifier` implementa cinco categorías; sus umbrales están codificados en la clase y no se seleccionan dinámicamente por guía.
- Las reglas de control domiciliario, carga y tiempo en objetivo usan umbrales fijos en sus calculadores.

No se encontró soporte ejecutable equivalente para AHA/ACC, ESC e ISH en los módulos inspeccionados.

## 3. Implicaciones

Actualmente no puede asumirse que la misma medición se evalúe correctamente bajo cualquiera de las cuatro guías. El servicio acepta un objeto `ClinicalGuideline`, pero eso no hace que todas las reglas cambien sus umbrales según dicha guía.

## 4. Requisitos para una comparación clínica válida

Cada comparación futura debe citar fuente y localización, identificar población y método de medición, separar umbrales diagnósticos de objetivos terapéuticos y describir diferencias sin mezclarlas en una única regla. Toda regla implementable requiere pruebas y revisión clínica.

## 5. Estado

Este documento describe el soporte observado, no certifica la equivalencia clínica ni la validación de todas las guías. Las actualizaciones de guía deberán versionarse y no sobrescribir silenciosamente los criterios usados por análisis anteriores.