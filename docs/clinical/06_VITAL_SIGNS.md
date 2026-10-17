# Signos vitales

**Estado:** contrastado con los modelos de CardioSync el 17-10-2026.

## 1. Campos presentes en el código

- `heartRate?: number`: frecuencia cardíaca opcional, actualmente parte de `BloodPressureRecord` y utilizada por el motor estadístico para calcular la media cuando hay valores.
- `spo2?: number`, `temperature?: number` y `respiratoryRate?: number`: campos reservados opcionales que siguen en el contrato de `BloodPressureRecord`.
- El perfil `ClinicalContext` no contiene signos vitales.

## 2. Integración con Health Connect

Existen servicios y mapeadores de Health Connect para frecuencia cardíaca, sueño, actividad física, pasos y peso. Esta sincronización está implementada como un flujo de feature; no demuestra por sí sola que esos datos se agreguen a un modelo `VitalSigns` o que se entreguen automáticamente al análisis clínico.

## 3. Modelo futuro frente al actual

No existe actualmente un modelo de dominio independiente `VitalSigns` ni un tipo común `ClinicalValue` con unidad, fuente, instante de medición y confianza. Por tanto, los campos reservados no deben documentarse como si tuvieran ya esas garantías de metadata.

## 4. Reglas de calidad

Los signos vitales son temporales: para asociar un dato a una medición futura deberá definirse una ventana de proximidad, conservarse su origen y evitar reutilizar silenciosamente datos antiguos. Esas reglas no están implementadas en un `ClinicalContextBuilder` en el estado auditado.

## 5. Seguridad

La disponibilidad de frecuencia cardíaca, SpO₂ o frecuencia respiratoria no debe convertirse por sí sola en un diagnóstico. Cualquier interpretación requiere reglas específicas, trazabilidad y validación clínica.