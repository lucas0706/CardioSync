# Evaluación de factores asociados al riesgo cardiovascular

**Estado:** regla parcial implementada; motor de riesgo completo no implementado (revisión del 17-10-2026).

## 1. Implementación actual

La regla `CardiovascularRiskRule` está en `src/domain/clinical/rules/cardiovascular/`. Consume el `ClinicalContext` y genera un `ClinicalFinding` cuando detecta determinados antecedentes:

- **Muy alto** (`very-high`): enfermedad cardiovascular, insuficiencia cardíaca, antecedente de ACV o enfermedad vascular periférica.
- **Alto** (`high`): enfermedad renal crónica o diabetes.
- Sin esos factores, la regla no genera hallazgo.

El hallazgo utiliza el tipo `cardiovascular-risk` y puede incluir el identificador de la guía seleccionada.

## 2. Qué significa el resultado

La regla identifica antecedentes asociados a riesgo cardiovascular aumentado. No calcula riesgo absoluto, porcentaje a diez años, ni un score validado. No usa actualmente todos los campos del perfil: tabaquismo y dislipidemia, por ejemplo, no participan en esta regla.

## 3. Ubicación en el análisis

`ClinicalAnalysisDomainService` incorpora la regla en su composición. El resultado se agrega al grupo `risk` de `ClinicalAnalysisResult`. Esto es una regla de hallazgos contextual, no un servicio autónomo `RiskEngine`.

## 4. Límites

- No presentar la severidad del hallazgo como una estimación cuantitativa de riesgo.
- No inferir ausencia de riesgo cuando no se genera un hallazgo.
- No afirmar que se calcula riesgo cardiovascular integral.
- La regla no reemplaza evaluación profesional ni indica tratamientos.

## 5. Evolución requerida

Un modelo de riesgo formal necesitaría especificar población, variables, fórmula, horizonte temporal, tratamiento de datos ausentes, fuente bibliográfica, versión, pruebas y validación clínica antes de su implementación.