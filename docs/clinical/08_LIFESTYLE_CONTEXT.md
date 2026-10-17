# LifestyleContext

**Estado:** concepto documentado; no existe un modelo `LifestyleContext` en el dominio clínico actual (revisión del 17-10-2026).

## 1. Alcance conceptual

El sueño y la actividad física pueden ser datos complementarios para estudiar la evolución de la presión arterial. Su utilidad depende de su fuente, instante y relación temporal con las mediciones. No deben confundirse con un perfil longitudinal completo ni con recomendaciones terapéuticas.

## 2. Estado del código

CardioSync dispone de servicios y mapeadores de Health Connect para sueño, ejercicio, pasos y peso. También existen funciones de presentación de estado para sueño, pasos y ejercicio en `src/domain/health/HealthClinicalRules.ts`. Estas funciones producen etiquetas visuales a partir de umbrales; no constituyen un modelo clínico de contexto ni un motor de interpretación de presión arterial.

No existe actualmente `LifestyleContext`, `ClinicalContextBuilder` ni una integración confirmada que agregue automáticamente datos de Health Connect al `ClinicalContext` usado por `ClinicalAnalysisDomainService`.

## 3. Datos puntuales y perfil

El perfil clínico local conserva información estable del paciente, mientras que sueño y actividad son datos temporales obtenidos por flujos separados. No deben copiarse al perfil ni asociarse a cada medición sin una política explícita de temporalidad y procedencia.

## 4. Requisitos antes de integrarlo al análisis

- Definir ventanas temporales por tipo de dato.
- Conservar fuente e instante del dato.
- Distinguir ausencia de dato de un valor cero.
- Definir comportamiento ante datos antiguos, duplicados o inconsistentes.
- Validar clínicamente cualquier regla que use estos datos.

## 5. Límites

La presencia de sincronización con Health Connect no implica que el motor de análisis interprete sueño o actividad física. Las métricas de presentación no deben describirse como diagnósticos ni como una evaluación cardiovascular completa.