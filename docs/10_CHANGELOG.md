# CardioSync — Changelog

| Campo | Valor |
|-------|--------|
| Documento | 10_CHANGELOG.md |
| Tipo | Historial de cambios del proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-22 |

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

---

# 2026-08-11 — Fase 1: validación de edición

### Tipo

Corrección / Validación funcional

### Problema detectado

Las mediciones que no tenían frecuencia cardíaca almacenaban `NULL` en SQLite.

Al abrir una de estas mediciones para editarla, el valor `NULL` llegaba al formulario y la validación Zod rechazaba el registro porque el esquema acepta `number | undefined`, pero no `null`.

### Corrección

Se normalizó el valor al construir los valores iniciales del formulario:

`record.heartRate ?? undefined`

La base SQLite continúa utilizando `NULL` cuando la frecuencia cardíaca está ausente.

No se modificó la regla de validación ni se introdujeron valores artificiales.

### Validación funcional

Se verificó una medición existente:

- Antes: `110/77`.
- Frecuencia cardíaca: ausente.
- Fecha/hora: `10/08/2026 19:37`.
- Después de editar: `111/78`.
- Frecuencia cardíaca: continúa ausente.
- Fecha/hora: conservada.

También se verificó la propagación del cambio:

- History: actualizado.
- Dashboard: actualizado.
- Statistics: comportamiento esperado según su diseño agregado.
- Reports: actualizado.

### Validación técnica

- Expo SDK 57: mantenido.
- TypeScript strict: limpio.
- `git diff --check`: limpio.
- No se agregaron dependencias.
- No se modificó la arquitectura.

### Archivos afectados

`app/measurement/[id].tsx`

### Estado

Fase 1 — Verificar edición: ✅ COMPLETADA

---

# 2026-08-12 — Importación histórica SQLite

### Tipo

Implementación / Validación funcional

### Objetivo

Implementar la importación de datos históricos reales desde la base SQLite de BPTracker.

### Implementación

Se incorporaron:

- `src/features/import/parsers/DbImportParser.ts`
- `src/features/import/services/DbImportService.ts`

Se actualizó:

- `src/features/import/screens/ImportScreen.tsx`
- `docs/13_IMPORTATION_SPECIFICATION.md`

El parser:

- valida la existencia de la tabla `tranx`;
- valida las columnas requeridas;
- lee los registros mediante SQLite;
- combina fecha y hora;
- mapea presión sistólica;
- mapea presión diastólica;
- mapea frecuencia cardíaca;
- mapea brazo;
- mapea posición;
- conserva notas;
- reutiliza `ImportNormalizer`;
- detecta duplicados.

### Validación real

Se utilizó una base SQLite real de BPTracker con:

- 2.030 registros totales.
- 2.030 registros con sistólica válida.
- 2.030 registros con diastólica válida.
- 2.030 registros con pulso informado.
- 0 errores de normalización.
- 1 duplicado interno.
- 2.029 registros nuevos para CardioSync.

Resultado:

**2.029 mediciones importadas correctamente.**

### Persistencia

La importación utiliza:

`ImportPersistenceService`
→ `MeasurementStore`
→ `MeasurementService`
→ `BloodPressureRepository`
→ `SQLite`

La inserción masiva utiliza una transacción SQLite mediante `withTransactionSync()`.

### Validación posterior

Se eliminaron previamente las mediciones existentes de prueba.

Se importaron los 2.029 registros.

Después de recargar la aplicación:

- History mantuvo los registros.
- Dashboard mantuvo los datos.
- Statistics mantuvo los datos.
- La persistencia SQLite quedó confirmada.

### Seguridad y dependencias

Se evaluó la posibilidad de utilizar XLS/XLSX.

No se incorporó `xlsx`.

El formato XLS/XLSX queda fuera del alcance de la implementación de importación.

SQLite `.db` queda como formato histórico soportado.

### Archivos personales

Los archivos de prueba utilizados durante la validación fueron eliminados del proyecto.

`.gitignore` fue actualizado para evitar incorporar accidentalmente:

- `*.db`
- `*.xls`
- `*.csv`

### Validación técnica

- Expo SDK 57 mantenido.
- TypeScript strict: limpio.
- `git diff --check`: limpio.
- Sin dependencia `xlsx`.
- Sin modificaciones innecesarias de la arquitectura.

### Commit

`d9d379b feat(import): add SQLite historical import`

---

# 2026-08-13 — Cierre de checkpoint de importación y preparación del rediseño UI/UX

### Tipo

Documentación / Planificación

### Cambios

Se sincronizó el roadmap operativo con el estado real del proyecto.

La importación SQLite pasa oficialmente a:

**FASE 2 — COMPLETADA**

La validación de volumen real pasa a:

**FASE 3 — VALIDACIÓN INICIAL COMPLETADA**

El flujo completo de importación y persistencia pasa a:

**FASE 4 — COMPLETADA PARA EL FLUJO ACTUAL**

Se establece como próxima fase activa:

**FASE 5 — REDISEÑO UI / UX**

### Próximo objetivo

Realizar primero una auditoría visual del proyecto existente y posteriormente implementar un sistema visual coherente para:

- Dashboard.
- Measurement.
- History.
- Statistics.
- ClinicalChart.
- Import.

No se iniciará Health Connect hasta finalizar y validar el rediseño visual.

### Restricción

No se agregarán nuevos formatos de importación.

SQLite `.db` permanece como el formato histórico soportado.

### Documentos relacionados

- `docs/02_ROADMAP.md`
- `docs/10_CHANGELOG.md`
- `docs/13_IMPORTATION_SPECIFICATION.md`

---

# 2026-08-14 — Measurements V2: Nueva medición, Edición y Detalle

### Tipo

Implementación / UI / UX / Validación funcional

### Objetivo

Completar el rediseño visual del flujo principal de mediciones manteniendo la arquitectura funcional existente.

### Nueva medición

Se implementó y validó:

- Card SIS.
- Card DIA.
- Card FC centrada y del mismo tamaño visual.
- Fecha mediante selector.
- Hora mediante selector.
- Selector visual de brazo.
- Selector visual de posición.
- Campo de notas.
- Guardado de medición.

### Edición

Se reutilizó la misma estructura visual de Nueva medición.

Se validó:

- Precarga de datos.
- Edición de SIS.
- Edición de DIA.
- Edición de FC.
- Edición independiente de fecha y hora.
- Edición de brazo.
- Edición de posición.
- Edición de notas.
- Guardar cambios.
- Eliminación.

### Detalle

Se implementó una representación de lectura coherente con las cards de Nueva medición.

Incluye:

- SIS.
- DIA.
- FC.
- Clasificación.
- Alertas condicionales.
- Fecha.
- Hora.
- Brazo.
- Posición.
- Notas.
- Editar.
- Eliminar.

Las alertas no se muestran cuando no existen.

### Eliminación

Se incorporó confirmación explícita antes de eliminar una medición.

### Componentes nuevos

- `MeasurementDateTimeField.tsx`
- `MeasurementMetricInputCard.tsx`
- `MeasurementOptionSelector.tsx`

### Dependencias

Se incorporó:

`@expo/ui ~57.0.10`

La dependencia se instaló mediante:

`npx expo install @expo/ui`

manteniendo compatibilidad con Expo SDK 57.

### Validación

- TypeScript strict: limpio.
- Nueva medición: validada en dispositivo.
- Edición: validada en dispositivo.
- Detalle: validado en dispositivo.
- Eliminación con confirmación: validada.
- Estado del repositorio: limpio antes del checkpoint.

### Checkpoint

`171ef4c feat: complete measurement create edit and detail UI`

### Estado

Measurements V2: ✅ COMPLETADO

FASE 5 UI / UX: 🚧 EN DESARROLLO

Pendiente dentro de UI/UX:

- Dashboard.
- History.
- Statistics.
- ClinicalChart.
- Import.


---

---

# 2026-08-22 — Consolidación funcional y Visual Redesign V2

### Tipo

Implementación / Consolidación / Documentación

### Cambios realizados

Se consolidó el estado funcional actual de CardioSync y se sincronizó la documentación oficial con la implementación.

### Clinical Domain

Se confirmó como implementado el dominio clínico actual, incluyendo:

- Clasificación clínica.
- Contextos clínicos.
- Clinical Targets.
- Clinical Findings.
- Warnings.
- Reglas clínicas.
- Clinical Analysis.

### Clinical Rule Engine

Se confirmó como implementado:

- `ClinicalRule`.
- `ClinicalRuleContext`.
- Reglas de presión arterial.
- Reglas de seguridad.
- Reglas de hipertensión.
- Reglas de riesgo cardiovascular.
- Reglas de target terapéutico.
- Reglas de tiempo en objetivo.
- Reglas de carga hipertensiva.
- Reglas de tendencia.
- Reglas de variabilidad.

Las reglas permanecen desacopladas de la interfaz.

### Clinical Analysis Engine

Se confirmó como implementado:

- `ClinicalAnalysisService`.
- `ClinicalAnalysisDomainService`.
- `ClinicalAnalysisResultBuilder`.
- `ClinicalTargetSelector`.
- Evaluación contextual.
- Generación de Clinical Findings.
- Warnings.
- Integración con las reglas clínicas.

Se validaron los contextos:

- GENERAL.
- DIABETES.
- CKD.
- ELDERLY.

### Clinical Classification

Se consolidó la clasificación clínica en una única fuente activa:

`src/domain/clinical/classification/BloodPressureClassifier.ts`

Se mantuvieron las categorías:

- normal.
- borderline.
- grade-1.
- grade-2.
- isolated-systolic.

### Statistics V2 / ClinicalChart

Se confirmó la implementación de:

- PAS.
- PAD.
- FC.
- Múltiples series.
- Ejes.
- Fechas.
- Valores.
- Leyenda.
- Zoom.
- Desplazamiento.
- Selección de series.
- Integración con períodos.

### Reports

Se confirmó como implementado:

- Selección de período.
- Generación HTML.
- Generación PDF.
- Nombre de archivo estructurado.
- Compartir mediante el sistema nativo.
- Eliminación del archivo temporal después de compartir.

### Importación y exportación

Se confirmó la implementación de:

- Importación de registros.
- Exportación de registros.
- Gestión desde Configuración.

Los formatos externos continúan adaptándose mediante la arquitectura de importación definida en los ADR.

### Visual Redesign V2

Se completó e implementó el rediseño visual V2.

Áreas afectadas:

- Dashboard.
- History.
- Measurement.
- Statistics.
- Profile.
- Más.
- Configuración.
- Reports.
- Navegación.

Se consolidó la navegación:

`Inicio | Registros | Perfil | Más`

También se incorporaron y/o consolidaron componentes visuales reutilizables y la nueva jerarquía visual de las pantallas.

### Measurements V2

Se validaron los tres flujos principales:

- Nueva medición.
- Edición.
- Detalle.

Se consolidaron:

- Cards SIS / DIA.
- Card FC.
- Selector de fecha.
- Selector de hora.
- Selector de brazo.
- Selector de posición.
- Campo de notas.
- Clasificación clínica.
- Alertas clínicas condicionales.
- Confirmación antes de eliminar.

### Configuración

Se estableció la arquitectura funcional de Configuración.

La administración de integraciones externas, incluyendo Health Connect, deberá permanecer dentro de:

`Más → Configuración`

Health Connect no pertenece al Perfil.

### Documentación

Se actualizaron:

- `00_PROJECT_MASTER_CONTEXT.md`
- `02_ROADMAP.md`
- `03_DECISIONS.md`
- `14_VISUAL_REDESIGN_V2.md`

Se normalizaron los identificadores ADR y se documentaron las decisiones arquitectónicas correspondientes al rediseño visual y a la ubicación de Health Connect.

### Validación técnica

- TypeScript strict: limpio.
- `git diff --check`: limpio.
- Expo SDK 57: mantenido.
- No se incorporaron dependencias innecesarias.
- La arquitectura funcional existente se mantuvo.

### Estado resultante

CardioSync cuenta actualmente con:

- Measurements.
- History.
- Dashboard.
- Statistics.
- Clinical Domain.
- Clinical Classification.
- Clinical Rule Engine.
- Clinical Analysis Engine.
- ClinicalChart V2.
- Reports PDF.
- Importación.
- Exportación.
- Visual Redesign V2.

Pendiente para próximas fases:

- Configuración consolidada.
- Health Connect.
- Backup y recuperación.
- Backup local.
- Backup en nube / Google Drive.
- Dashboard dinámico.
- Evolución de Clinical Context.
- Nuevas funcionalidades clínicas.

### Documentos relacionados

- `00_PROJECT_MASTER_CONTEXT.md`
- `01_ARCHITECTURE.md`
- `02_ROADMAP.md`
- `03_DECISIONS.md`
- `14_VISUAL_REDESIGN_V2.md`

--------------------------------------------------

2026-09-03

HEALTH CONNECT

- Integración operativa completada.
- Exportación automática de mediciones.
- Sincronización manual desde Health Connect.
- Importación de presión arterial.
- Eliminación de registros exportados.
- Gestión de permisos y reconexión.
- Pantalla Health Connect integrada.
- Checkpoint Health Connect generado.

