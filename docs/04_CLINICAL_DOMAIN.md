# CardioSync — Clinical Domain

| Campo | Valor |
|-------|--------|
| Documento | 04_CLINICAL_DOMAIN.md |
| Tipo | Diseño del Dominio Clínico |
| Estado | Planificado |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento define el diseño conceptual del dominio clínico de CardioSync.

No contiene implementación.

Su finalidad es establecer la estructura del dominio clínico antes del desarrollo del Clinical Rule Engine y Clinical Analysis Engine.

---

# Principios del dominio clínico

El dominio clínico deberá mantenerse independiente de:

- React.
- React Native.
- Expo.
- SQLite.
- Componentes visuales.
- Fuentes externas de datos.

Su responsabilidad será representar información clínica disponible y permitir su evaluación mediante reglas basadas en guías clínicas.

---

# Principio fundamental

CardioSync continúa siendo una aplicación especializada en seguimiento de presión arterial.

Los datos externos no modifican el propósito principal del sistema.

Health Connect y otras fuentes externas únicamente proporcionan contexto adicional cuando esté disponible.

No son una dependencia obligatoria del funcionamiento principal.

---

# ClinicalContext

Estado: 📋 PLANIFICADO

ClinicalContext será el contenedor conceptual que reúne la información disponible para una evaluación clínica.

Su construcción será dinámica.

No todos los contextos estarán siempre presentes.

---

# Contextos obligatorios

## MeasurementContext

Estado: 📋 PLANIFICADO

Responsabilidad:

Representar la medición principal de presión arterial.

Este contexto constituye el núcleo de CardioSync.

Debe existir para realizar cualquier evaluación.

Incluye información relacionada con:

- Presión sistólica.
- Presión diastólica.
- Fecha y hora.
- Datos propios de la medición.

---

# Contextos opcionales

Los siguientes contextos podrán existir únicamente cuando exista información disponible.

La ausencia de estos datos no debe impedir el funcionamiento principal de CardioSync.

---

## StatisticsContext

Responsabilidad:

Representar resultados estadísticos derivados de las mediciones.

Ejemplos:

- Tendencias.
- Promedios.
- Variabilidad.
- Evolución temporal.

No realiza cálculos.

Consume resultados generados por Statistics.

---

## PatientContext

Responsabilidad:

Representar información estable del paciente.

---

## HistoryContext

Responsabilidad:

Representar información histórica necesaria para evaluaciones clínicas.

---

## SleepContext

Responsabilidad:

Representar información del sueño proveniente de fuentes externas como Health Connect.

Puede no existir.

Su ausencia no afecta el funcionamiento principal.

---

## ActivityContext

Responsabilidad:

Representar actividad física proveniente de fuentes externas.

Puede no existir.

---

## BodyCompositionContext

Responsabilidad:

Representar información corporal externa.

Ejemplos:

- Peso.
- Composición corporal.
- Masa muscular.
- Grasa corporal.

Puede no existir.

---

## VitalSignsContext

Responsabilidad:

Representar signos vitales adicionales.

Ejemplos:

- Frecuencia cardíaca.
- SpO2.
- Temperatura.
- Frecuencia respiratoria.

Puede no existir.

---

# Arquitectura conceptual

ClinicalContext

├── MeasurementContext (obligatorio)

├── StatisticsContext (opcional)

├── PatientContext (opcional)

├── HistoryContext (opcional)

├── SleepContext (opcional)

├── ActivityContext (opcional)

├── BodyCompositionContext (opcional)

└── VitalSignsContext (opcional)

---

# Relación con Health Connect

Health Connect no forma parte del dominio principal.

Su responsabilidad será únicamente alimentar contextos externos cuando exista información disponible.

Ejemplo:

Health Connect

↓

SleepContext

↓

ClinicalContext

↓

Clinical Analysis Engine

---

# Restricciones

- BloodPressureRecord no almacenará datos externos.
- Health Connect no modificará BloodPressureRecord.
- La ausencia de datos externos no debe bloquear una evaluación.
- Los contextos externos no reemplazan MeasurementContext.
- Cada contexto deberá mantener una responsabilidad única.

---

# Evolución prevista

La implementación del dominio clínico comenzará luego de completar la refactorización del dominio actual.

Orden previsto:

1. Finalizar refactorización de BloodPressureRecord.
2. Diseñar modelos clínicos definitivos.
3. Implementar ClinicalContext.
4. Implementar ClinicalRuleEngine.
5. Implementar ClinicalAnalysisEngine.


---

## Consolidación de clasificación

Clinical Analysis V1 utiliza una única regla activa para producir el finding `blood-pressure-classification`:

`BloodPressureClassificationRule`.

La antigua `ClinicalClassificationRule`, que adaptaba `ClinicalResult` proveniente del árbol histórico `src/clinical/engine`, fue retirada del dominio activo para evitar dos fuentes de verdad.

El árbol histórico `src/clinical/` permanece intacto por ahora.

---

