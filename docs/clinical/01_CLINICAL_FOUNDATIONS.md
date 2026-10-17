# Fundamentos clínicos de CardioSync

Versión: 1.1
Estado: Documento conceptual
Última revisión: 2026-10-17

## 1. Objetivo

Definir los fundamentos clínicos que orientan el diseño de CardioSync: mediciones, contexto clínico, interpretación y seguimiento longitudinal.

## 2. Principio clínico principal

Una medición aislada de presión arterial representa un evento puntual. Su interpretación depende de la técnica de medición, las condiciones del registro, las características de la persona y la fuente clínica que corresponda.

La única guía clínica utilizada actualmente por CardioSync es el **Consenso Argentino de Hipertensión Arterial 2025**. La documentación de arquitectura no habilita por sí misma el uso de otras fuentes.

## 3. Presión arterial como variable longitudinal

El seguimiento longitudinal permite analizar evolución temporal, tendencias, variabilidad, respuesta a cambios y patrones de comportamiento. Estos análisis descriptivos deben distinguirse de la interpretación clínica basada en el consenso vigente.

## 4. Registro e interpretación

### Registro

Dato observado, por ejemplo, 120/80 mmHg. La interpretación no debe modificar el registro original.

### Interpretación

Significado clínico obtenido al aplicar las reglas activas del Consenso Argentino de Hipertensión Arterial 2025 cuando existen datos suficientes. No debe afirmarse que una recomendación está implementada sin localizar su código y pruebas.

## 5. Calidad de medición

La calidad depende de factores como técnica correcta, posición, condiciones previas, dispositivo y repetición cuando corresponda. Estos elementos pertenecen al contexto de medición.

## 6. Contexto clínico

La interpretación puede depender de síntomas, frecuencia cardíaca, peso, actividad reciente, sueño y otras características disponibles. La ausencia de un dato no debe interpretarse automáticamente como ausencia de una condición.

## 7. Fuente clínica

El Consenso Argentino de Hipertensión Arterial 2025 es la única fuente clínica activa del producto. Umbrales, categorías, objetivos y criterios de interpretación deben tener trazabilidad hacia esa fuente.

La arquitectura puede evolucionar en el futuro para representar otras fuentes, pero eso es una posibilidad de diseño, no una funcionalidad clínica activa. Cualquier incorporación requiere decisión explícita, revisión clínica, implementación separada y pruebas.

## 8. Principios de seguridad clínica

CardioSync debe informar, contextualizar y ayudar al seguimiento. No debe presentarse como sustituto de la evaluación profesional ni afirmar que diagnostica automáticamente o indica tratamientos.

## 9. Arquitectura conceptual

`BloodPressureRecord → ClinicalContext → ClinicalAnalysis → Statistics`

La fuente clínica y las reglas deben permanecer separadas de los componentes visuales.

## 10. Estado

Documento conceptual sujeto a revisión clínica. La cobertura de recomendaciones y la validación técnica deben comprobarse por separado.
