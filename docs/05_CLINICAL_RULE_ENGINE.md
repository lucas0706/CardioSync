# CardioSync — Clinical Rule Engine

| Campo | Valor |
|-------|--------|
| Documento | 05_CLINICAL_RULE_ENGINE.md |
| Tipo | Diseño Conceptual |
| Estado | Planificado |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento define el diseño conceptual del Clinical Rule Engine de CardioSync.

No contiene implementación.

Su finalidad es establecer las responsabilidades, límites y funcionamiento esperado del motor de reglas clínicas antes de su desarrollo.

---

# Propósito

El Clinical Rule Engine será responsable de aplicar reglas clínicas basadas en guías clínicas oficialmente adoptadas por CardioSync.

Su objetivo será transformar datos clínicos estructurados en evaluaciones clínicas reproducibles y trazables.

---

# Principios fundamentales

El Clinical Rule Engine deberá:

- Utilizar reglas explícitas.
- Basarse en evidencia científica.
- Mantener trazabilidad hacia la guía clínica correspondiente.
- Separar reglas clínicas de la interfaz.
- Separar reglas clínicas de cálculos estadísticos.

No deberá:

- Realizar consultas SQL.
- Modificar mediciones.
- Reemplazar al profesional de salud.
- Crear interpretaciones sin respaldo documental.

---

# Entradas

El Clinical Rule Engine recibirá información proveniente del ClinicalContext.

Posibles entradas:

## MeasurementContext

Información principal:

- Presión arterial.
- Fecha y hora.
- Datos asociados a la medición.

Obligatorio.

---

## StatisticsContext

Información complementaria:

- Promedios.
- Tendencias.
- Variabilidad.
- Evolución temporal.

Opcional.

---

## PatientContext

Información del paciente cuando esté disponible.

Opcional.

---

## HistoryContext

Información histórica relevante.

Opcional.

---

## Contextos externos

Información proveniente de integraciones externas:

- SleepContext.
- ActivityContext.
- BodyCompositionContext.
- VitalSignsContext.

Opcionales.

---

# Salidas

El Clinical Rule Engine podrá generar:

## Clasificación clínica

Ejemplo:

- Categoría de presión arterial.
- Situaciones relevantes según guía clínica.

---

## Recomendaciones

Las recomendaciones deberán:

- Estar asociadas a una regla.
- Indicar la fuente clínica.
- Tener trazabilidad.

---

## Alertas clínicas

Podrá identificar situaciones que requieran atención adicional.

Ejemplo:

- Valores persistentemente elevados.
- Necesidad de repetir mediciones.
- Solicitud de información adicional.

---

# Relación con guías clínicas

Cada regla deberá registrar:

- Nombre de la guía.
- Versión.
- Fecha.
- Nivel de evidencia cuando corresponda.
- Clase de recomendación cuando corresponda.

No se implementarán reglas sin fuente documentada.

---

# Flujo conceptual

ClinicalContext

↓

Clinical Rule Engine

↓

Reglas clínicas

↓

Evaluación

↓

Recomendaciones / Clasificaciones / Alertas

---

# Solicitud de información adicional

El motor podrá detectar cuándo falta información necesaria.

Ejemplos:

- Síntomas no registrados.
- Contexto insuficiente.
- Mediciones insuficientes.

En esos casos podrá solicitar información adicional.

No deberá asumir datos faltantes.

---

# Restricciones

- No modifica BloodPressureRecord.
- No depende de Health Connect.
- No depende de React.
- No depende de SQLite.
- No realiza cálculos estadísticos.

---

# Evolución prevista

La implementación comenzará luego de:

1. Finalizar la refactorización del dominio.
2. Definir Clinical Domain.
3. Definir modelos clínicos definitivos.


---

## Eliminación de duplicidad de clasificación

Se eliminó `ClinicalClassificationRule` de la composición del Clinical Rule Engine y posteriormente del código activo.

La clasificación de presión arterial queda centralizada en:

`BloodPressureClassificationRule`.

Esto evita producir dos findings con el mismo tipo desde fuentes de clasificación diferentes.

---

