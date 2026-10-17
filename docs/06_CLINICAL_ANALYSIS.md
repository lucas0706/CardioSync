# CardioSync — Clinical Analysis Engine

| Campo | Valor |
|-------|--------|
| Documento | 06_CLINICAL_ANALYSIS.md |
| Tipo | Diseño Conceptual |
| Estado | Implementación parcial; integración completa pendiente |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-10-17 |

---

# Estado de implementación — 2026-10-17

La implementación actual incluye `ClinicalAnalysisDomainService`, que coordina las reglas clínicas disponibles y produce hallazgos. La integración descrita en este documento como análisis integral de un `ClinicalContext` compuesto sigue siendo diseño objetivo: no debe asumirse que todos los contextos enumerados se construyen y consumen en producción.

## Alcance confirmado

- El servicio de dominio coordina reglas clínicas activas y consume resultados estadísticos para el período analizado.
- La selección del período pertenece a la capa de estadísticas, no al motor clínico.
- El perfil clínico opcional existe, pero no representa una historia clínica completa.
- La integración de producción de un contexto clínico integral permanece pendiente; escenarios de desarrollo no son fuente de contexto de producción.
- Los hallazgos no equivalen a diagnóstico ni a prescripción médica.

# Objetivo

Este documento define el diseño conceptual del Clinical Analysis Engine de CardioSync.

No contiene implementación.

Su finalidad es establecer cómo se integrarán los distintos contextos clínicos para generar una evaluación integral basada en reglas clínicas documentadas.

---

# Propósito

El Clinical Analysis Engine será responsable de combinar la información disponible dentro del ClinicalContext.

Su objetivo será transformar múltiples fuentes clínicas en una evaluación estructurada.

No reemplaza al Clinical Rule Engine.

El Rule Engine define reglas.

El Analysis Engine coordina e integra resultados.

---

# Responsabilidades

El Clinical Analysis Engine será responsable de:

- Construir una evaluación clínica integral.
- Integrar resultados provenientes de reglas clínicas.
- Priorizar información relevante.
- Organizar hallazgos.
- Preparar información para reportes clínicos.

---

# No responsabilidades

El Clinical Analysis Engine no deberá:

- Modificar mediciones.
- Acceder directamente a SQLite.
- Leer datos externos directamente.
- Implementar componentes visuales.
- Crear reglas clínicas sin documentación.
- Reemplazar guías clínicas.

---

# Entradas

La entrada principal será:

## ClinicalContext

Compuesto por:

- MeasurementContext.
- StatisticsContext.
- PatientContext.
- HistoryContext.
- Contextos externos disponibles.

---

# Flujo conceptual

ClinicalContext

↓

Clinical Rule Engine

↓

Resultados clínicos

↓

Clinical Analysis Engine

↓

Evaluación integrada

↓

Reportes / Dashboard / Visualización

---

# Integración con Clinical Rule Engine

El Clinical Analysis Engine utilizará los resultados generados por el Rule Engine.

Ejemplo:

MeasurementContext

↓

Regla clínica de clasificación

↓

Resultado:

- Categoría.
- Hallazgo.
- Recomendación.

↓

Clinical Analysis Engine

↓

Evaluación final.

---

# Priorización clínica

El motor deberá priorizar información según:

- Severidad clínica.
- Persistencia del hallazgo.
- Relevancia según guía clínica.
- Disponibilidad de información.

---

# Manejo de información faltante

La ausencia de información no deberá generar errores del sistema.

Ejemplos:

Sin SleepContext:

- Continúa evaluación de presión arterial.

Sin ActivityContext:

- No se generan análisis relacionados con actividad.

Sin BodyCompositionContext:

- No se evalúan parámetros corporales.

La evaluación deberá indicar qué información estuvo disponible.

---

# Relación con fuentes externas

Health Connect y otras fuentes externas alimentarán únicamente contextos especializados.

Ejemplo:

Health Connect

↓

SleepContext

↓

ClinicalContext

↓

Clinical Analysis Engine

Las fuentes externas no participan directamente en la lógica de análisis.

---

# Salidas esperadas

El Clinical Analysis Engine podrá generar:

## Resumen clínico

Información estructurada del estado actual.

---

## Hallazgos

Resultados relevantes derivados de reglas clínicas.

---

## Recomendaciones

Basadas en reglas clínicas documentadas.

---

## Información disponible

Debe indicar qué contextos fueron utilizados.

---

# Restricciones

- Basado en evidencia científica.
- Dependiente de reglas documentadas.
- Independiente de la interfaz.
- Independiente de la persistencia.
- Compatible con contextos opcionales.

---

# Evolución prevista

La implementación comenzará después de:

1. Finalizar refactorización del dominio.
2. Implementar Clinical Domain.
3. Implementar Clinical Rule Engine.


---

## Validación posterior a la consolidación

Después de retirar `ClinicalClassificationRule` de la composición activa, la validación histórica continuó produciendo los cuatro findings esperados:

- tendencia ascendente de presión arterial domiciliaria;
- carga elevada de mediciones de presión arterial;
- presión arterial por encima del objetivo terapéutico;
- presión arterial elevada.

La clasificación quedó representada por un único finding `blood-pressure-classification`.

---


---

## Integración con Statistics

Clinical Analysis V1 está diseñado para consumir el `StatisticsSummary` correspondiente al período analizado.

La selección del período no pertenece al Clinical Engine.

Statistics determina:

- registros filtrados;
- estadísticas correspondientes al período.

Clinical Analysis interpreta esos datos.

La integración de producción permanece pendiente porque todavía no existe una fuente persistente/runtime de `ClinicalContext`.

Los escenarios de `src/devtools/clinical/` no deben utilizarse como fuente de contexto para la aplicación.

---

