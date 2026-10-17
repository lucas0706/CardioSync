# Especificación de guía clínica

## Objetivo

Definir la representación conceptual de una guía clínica en CardioSync. Una guía representa conocimiento médico externo, versionado, trazable y aplicable bajo condiciones determinadas.

## Principio arquitectónico

Una guía clínica no es una medición, un diagnóstico almacenado ni una alerta directa. Es una fuente de conocimiento que permite interpretar datos del paciente mediante reglas explícitas.

## Fuente clínica activa

La única guía clínica utilizada actualmente por CardioSync es el **Consenso Argentino de Hipertensión Arterial 2025**.

Identificación documentada en el proyecto:

- Organizaciones registradas: Federación Argentina de Cardiología (FAC), Sociedad Argentina de Hipertensión Arterial (SAHA) y Sociedad Argentina de Cardiología (SAC).
- Año: 2025.
- Referencia bibliográfica registrada: *Rev Fed Arg Cardiol. 2025; 54 (Suplemento 6): 5-64*.

La referencia bibliográfica y la presencia de código no demuestran por sí solas que todas las recomendaciones estén implementadas o validadas.

## Información mínima y trazabilidad

Para cada regla clínica activa, conservar:

- nombre, organización, año y versión de la fuente;
- documento original y referencia bibliográfica;
- sección, tabla o página exacta;
- población y condiciones de aplicabilidad;
- interpretación clínica derivada;
- archivo y símbolo de implementación;
- pruebas, resultados y limitaciones conocidas.

## Relación con los modelos de CardioSync

### BloodPressureRecord

Proporciona los datos medidos. No contiene reglas clínicas.

### ClinicalContext

Proporciona características y condiciones de la persona que pueden determinar la aplicabilidad de una regla. Los datos ausentes deben tratarse explícitamente.

### ClinicalGuideline

Identifica la fuente clínica activa y su versión.

### ClinicalAnalysis

Consume mediciones, contexto y reglas asociadas con el Consenso Argentino de Hipertensión Arterial 2025 para producir los resultados que correspondan.

## Ejemplo conceptual

Entrada: medición de presión arterial y contexto clínico disponible.

Fuente: Consenso Argentino de Hipertensión Arterial 2025.

Resultado: análisis según las reglas de esa fuente que estén efectivamente implementadas y aplicables. No se debe inferir un resultado cuando faltan los datos necesarios.

## Versionado

Los cambios de fuente deben quedar versionados y trazables. Una futura actualización del consenso no debe sobrescribir el registro histórico de la versión anterior.

## Compatibilidad futura

La arquitectura podría admitir otras fuentes en el futuro. La mención de esa posibilidad no significa que AHA/ACC, ESC, ISH u otras guías estén activas en CardioSync. Incorporar una fuente adicional requiere aprobación explícita, revisión clínica, reglas identificables, pruebas y documentación actualizada.

## Decisión arquitectónica

Mantener separados datos, contexto, conocimiento clínico e interpretación. Las reglas clínicas no deben acoplarse a los componentes visuales.

## Estado

Especificación conceptual. No certifica cobertura integral ni validación clínica de todas las reglas existentes.
