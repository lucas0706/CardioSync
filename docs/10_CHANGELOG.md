# CardioSync — Changelog

| Campo | Valor |
|-------|--------|
| Documento | 10_CHANGELOG.md |
| Tipo | Historial de cambios del proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento registra los cambios importantes realizados en CardioSync.

Su finalidad es:

- Mantener historial del proyecto.
- Conocer cuándo se realizaron cambios relevantes.
- Relacionar cambios con decisiones arquitectónicas.
- Facilitar diagnóstico de problemas futuros.

---

# Formato

Cada entrada deberá incluir:

- Fecha.
- Versión o fase.
- Tipo de cambio.
- Descripción.
- Documentos relacionados.

---

# Historial

---

# 2026-08-03

## Documentación arquitectónica inicial

### Tipo

Documentación

### Cambios realizados

Creación de la estructura inicial de documentación:

- Project Master Context.
- Architecture.
- Roadmap.
- Architecture Decisions.
- Clinical Domain.
- Clinical Rule Engine.
- Clinical Analysis Engine.
- Clinical Reports.
- Health Connect Integration.
- Database Architecture.

---

## Decisiones documentadas

Se establecieron principios arquitectónicos:

- Separación entre dominio y presentación.
- Separación entre mediciones y contexto clínico.
- Uso de contextos clínicos opcionales.
- Health Connect como fuente externa de contexto.
- Importación y exportación mediante adaptadores.

---

## Estado actual

Fase actual:

🚧 Refactorización Final del Dominio

Objetivo:

Separar completamente:

- Datos propios de medición.
- Datos clínicos.
- Datos externos.
- Resultados derivados.

---

# Próximas actualizaciones

Cada fase completada deberá agregar:

- Fecha.
- Funcionalidad implementada.
- Archivos principales afectados.
- Decisiones asociadas.
- Documentación actualizada.


---

# 2026-08-09 — Consolidación de clasificación clínica

### Cambios

- Identificada duplicidad entre `ClinicalClassificationRule` y `BloodPressureClassificationRule`.
- Retirada `ClinicalClassificationRule` del Clinical Domain.
- Eliminado su export del Rule Engine.
- Conservada `BloodPressureClassificationRule` como única fuente activa de clasificación.
- Validado el escenario histórico después de la consolidación.
- Preservado sin modificaciones el árbol histórico `src/clinical/`.

### Resultado

Clinical Analysis V1 mantiene los mismos cuatro findings históricos sin duplicar la clasificación.


---

# 2026-08-09 — Independencia de períodos por módulo

### Decisión

Se definió que Historial, Estadísticas, Clinical Analysis y Reports no compartirán un único estado global de período.

Se reutilizará infraestructura temporal cuando corresponda, evitando acoplar los modelos de cada feature.

`StatisticsFilter` y `PeriodFilter` permanecen dentro del dominio de Statistics.

No se introduce todavía una abstracción temporal global.

---

---

# 2026-08-10 — Clinical Analysis V2: validación contextual

### Tipo

Implementación / Validación clínica

### Cambios realizados

Se validó el flujo de Clinical Analysis con 30 registros históricos simulados y cuatro contextos clínicos.

Se validaron GENERAL, DIABETES, CKD y ELDERLY mediante ClinicalTargetSelector.

Se verificó la clasificación clínica V2 con cinco categorías: normal, borderline, grade-1, grade-2 e isolated-systolic.

Se verificó que TherapeuticTargetRule cambia su resultado según el ClinicalTarget seleccionado.

### Dashboard

Se centralizó el acceso a latestDateTime mediante useDashboard() y DashboardService.

Se eliminó la lectura duplicada de useMeasurements() desde HomeScreen.

### Validación técnica

- TypeScript strict: limpio.
- git diff --check: limpio.
- Expo Doctor: 20/20 checks.
- Runtime Clinical Test: validado.

### Checkpoint

8e18767 — fix: centralize dashboard measurement summary

## 2026-08-10 — Statistics V2 / ClinicalChart Checkpoint

### Statistics

- Consolidación de las series clínicas principales en un único gráfico.
- Integración de presión sistólica, presión diastólica y frecuencia cardíaca.
- Conservación del filtrado temporal existente.
- Integración con los registros obtenidos mediante `useMeasurements()`.

### ClinicalChart

- Corrección del renderizado de frecuencia cardíaca.
- Corrección del renderizado de múltiples series.
- Recuperación de las etiquetas de los ejes.
- Recuperación de las fechas del eje X.
- Recuperación de los valores numéricos del eje Y.
- Integración de la fuente utilizada por los ejes mediante `useClinicalChartFont`.
- Incorporación de leyenda con nombre y unidad.
- Unificación de las series principales dentro del mismo gráfico.

### Paleta Statistics

- Sistólica: `#388E3C` — verde.
- Diastólica: `#1976D2` — azul.
- Frecuencia cardíaca: `#D32F2F` — rojo.

### Validación

- TypeScript strict sin errores.
- `git diff --check` sin errores.

