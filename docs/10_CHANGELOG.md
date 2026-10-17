# CardioSync — Changelog

| Campo | Valor |
|-------|--------|
| Documento | 10_CHANGELOG.md |
| Tipo | Historial de cambios del proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-10-15 |

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

# 2026-10-15 — Flujo de desarrollo y validación

### Tipo

Documentación operativa

### Cambios realizados

- Añadida la guía `docs/17_DEVELOPMENT_WORKFLOW.md`.
- Documentado el flujo de inspección inicial, validación TypeScript, formato, pruebas en Development Build y cierre de checkpoints.
- Reforzada la separación entre implementación, validación técnica, pruebas en dispositivo y publicación.
- Corregido el formato de la tabla del índice documental y agregado el enlace a la nueva guía.

### Alcance

Cambios exclusivamente documentales. No se modificó código de la aplicación, dependencias, configuración nativa ni perfiles de compilación.

### Referencias

- [Flujo de desarrollo y validación](17_DEVELOPMENT_WORKFLOW.md)
- [Índice documental](README.md)


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


---

# 2026-09-09 — About Feature

### Tipo

Nueva funcionalidad / UX

### Cambios realizados

Se implementó la nueva pantalla **Acerca de CardioSync** como feature independiente.

### Arquitectura

- Creación del módulo `src/features/about`.
- Separación completa respecto de otras features.
- Integración mediante Expo Router usando la ruta `/about`.
- Acceso desde la pantalla **Más**.

### Contenido incorporado

#### Objetivos terapéuticos

- Inclusión de objetivos terapéuticos basados en el Consenso Argentino de Hipertensión Arterial 2025.
- Presentación de objetivos clínicos para distintos perfiles de pacientes.

#### Integración con Health Connect

- Descripción de la integración nativa con Android Health Connect.
- Sincronización de presión arterial.
- Sincronización de frecuencia cardíaca.
- Sincronización de peso corporal.
- Preparación de la arquitectura para futuras integraciones:
  - sueño,
  - actividad física,
  - pasos,
  - saturación de oxígeno.

#### Información de la aplicación

- Nombre de la aplicación.
- Versión instalada.
- Información general del proyecto.
- Estado actual de desarrollo.

#### Historial de cambios

- Incorporación de novedades visibles para el usuario.
- Preparación para futuras actualizaciones OTA mediante Expo Updates.

### Limpieza técnica

- Eliminado archivo duplicado:

  src/features/about/config/versionInfo.ts

- Conservado como fuente única:

  src/features/about/config/version-info.ts

### Validación

- TypeScript strict: limpio.
- Expo Router: validado.
- Navegación desde menú Más: validada.
- Compatibilidad Expo SDK 57: validada.

### Resultado

CardioSync dispone ahora de una pantalla institucional propia para informar:

- objetivos terapéuticos,
- capacidades de integración con Health Connect,
- versión instalada,
- novedades de cada lanzamiento.


---

# 2026-09-09 — About Screen y gestión de versión

### Tipo

UI / Documentación / Mantenimiento

### Cambios realizados

- Implementada la pantalla "Acerca de CardioSync".
- Incorporada navegación desde la sección "Más".
- Agregada sección de novedades de la versión actual.
- Documentados los objetivos terapéuticos basados en el Consenso Argentino de HTA 2025.
- Documentada la integración con Health Connect:
  - Presión arterial.
  - Frecuencia cardíaca.
  - Peso corporal.
  - Sincronización manual.
  - Permisos y estado de conexión.
- Unificada la configuración de versión de la aplicación.
- Eliminado archivo duplicado `versionInfo.ts`.
- Conservado `version-info.ts` como única fuente oficial de información de versión.

### Validación

- TypeScript strict sin errores.
- Navegación a `/about` validada.
- Sin duplicación de entradas en la pantalla "Más".
- Estructura compatible con Expo Router.

### Resultado

CardioSync dispone de una pantalla institucional centralizada para:

- Información de la aplicación.
- Historial de novedades.
- Capacidades actuales.
- Estado de integración Health Connect.
- Gestión futura de versiones mediante OTA Updates.


---

# 2026-09-09 — Splash Screen V1

### Tipo

UI / Experiencia de usuario

### Objetivo

Incorporar una pantalla de inicio propia de CardioSync para reemplazar la transición directa desde el splash nativo de Expo hacia la aplicación.

### Cambios realizados

- Creación del módulo Splash dentro de la arquitectura de Features.
- Implementación de pantalla Splash propia.
- Integración del logo institucional de CardioSync.
- Incorporación de tipografía DM Sans utilizada en el resto de la aplicación.
- Incorporación del subtítulo:

  Monitoreo inteligente de presión arterial.

- Implementación de componente ECG decorativo.
- Implementación de animación visual sobre el ECG.
- Integración con RootLayout.
- Coordinación con la carga de fuentes de la aplicación.

### Arquitectura

Nuevo módulo:

src/features/splash

Estructura:

- screens/SplashScreen.tsx
- components/EcgWave.tsx
- components/AnimatedEcg.tsx

### Decisiones

- No incorporar nuevas dependencias.
- Reutilizar react-native-svg ya presente en el proyecto.
- Mantener compatibilidad con Expo SDK 57.
- Mantener TypeScript strict.
- Mantener la Splash como pantalla liviana y de rápida carga.

### Validación

- TypeScript strict limpio.
- Compilación correcta.
- Ejecución correcta en Expo Development Build.
- Integración correcta con la carga de fuentes.

### Estado

✅ Completado


---

# 2026-09-09 — Splash Screen personalizada (Fase 1)

### Tipo

UI / Experiencia de usuario

### Cambios realizados

Se implementó la primera versión de la Splash Screen interna de CardioSync.

### Arquitectura

Se creó el feature independiente:

- src/features/splash

Con la siguiente estructura:

- components/AnimatedEcg.tsx
- components/EcgWave.tsx
- screens/SplashScreen.tsx

### UI

La pantalla incorpora:

- Logo de CardioSync.
- Título principal.
- Subtítulo descriptivo.
- Animación ECG personalizada.

### Diseño

Se reutilizan los colores definidos en:

- src/theme/colors.ts

Manteniendo consistencia visual con el resto de la aplicación.

### Arranque

Se modificó app/_layout.tsx para:

- Mantener la splash nativa de Expo durante la carga inicial.
- Esperar la carga de fuentes DM Sans.
- Inicializar SQLite.
- Mostrar la Splash Screen interna durante un breve intervalo.
- Continuar luego hacia la navegación principal.

### Validación

- TypeScript strict: limpio.
- Expo SDK 57: compatible.
- Sin dependencias nuevas.
- Sin cambios en dominio ni base de datos.


---

# 2026-09-XX — Infraestructura de distribución y actualizaciones

### Tipo

Infraestructura / Build

### Cambios realizados

Se incorporó la infraestructura necesaria para distribución y actualización remota de CardioSync.

Incluye:

- Configuración de Expo Updates (OTA).
- Incorporación de canal Beta para distribución controlada.
- Integración de Google Services en la configuración Android.
- Preparación de la aplicación para futuras actualizaciones remotas sin necesidad de generar una nueva APK para cada cambio.

### Resultado

CardioSync queda preparado para:

- Distribución Beta controlada.
- Actualizaciones OTA mediante Expo Updates.
- Integraciones Android dependientes de Google Services.
- Evolución futura del sistema de despliegue sin modificar la arquitectura de la aplicación.

### Commits relacionados

- build: add google services configuration
- build: remove google-services ignore
- build: configure OTA beta channel
- build: configure expo updates and beta channel


---

# 2026-09-05 — Infraestructura OTA y Google Services

### Tipo

Infraestructura

### Cambios realizados

- Configuración de Google Services para Android.
- Incorporación de `google-services.json`.
- Habilitación de Expo Updates (OTA).
- Configuración de canal Beta para distribución controlada.
- Preparación de la infraestructura de releases futuras.

### Resultado

CardioSync queda preparado para distribuir actualizaciones OTA y gestionar ciclos Beta sin necesidad de generar una nueva APK para cada corrección menor.

Checkpoint relacionado:

`17_CHECKPOINT_OTA_AND_GOOGLE_SERVICES_2026-09-05.md`



---

# 2026-10-15

## Auditoría y organización documental

- Creada una rama de trabajo independiente para la revisión documental.
- Añadido un índice documental y enlazado desde el README principal.
- Registradas discrepancias entre documentos y el código de la rama auditada.
- Actualizadas notas de vigencia en contexto maestro, arquitectura, roadmap, dominio clínico, reportes, Health Connect y base de datos.
- No se modificó código funcional, dependencias ni configuración nativa como parte de esta fase.
- Referencia: [auditoría documental inicial](00_DOCUMENTATION_AUDIT_2026-10-15.md).


# 2026-10-15 — Documentación funcional del producto

### Tipo

Documentación funcional

### Cambios realizados

- Se incorporó una guía de uso basada en las rutas y pantallas de la aplicación.
- Se documentaron navegación principal, registro y gestión de mediciones, perfil, estadísticas y reportes.
- Se describieron los accesos a importación, copias manuales y programadas, Health Connect y actualizaciones.
- Se separó la descripción del comportamiento previsto de la validación en dispositivos; no se modificó código funcional.

### Documentos relacionados

- `docs/00_PRODUCT_OVERVIEW.md`
- `docs/15_USER_GUIDE.md`
- `docs/README.md`


---

# 2026-10-15 — Guía de copias y recuperación

### Tipo

Documentación funcional y técnica

### Cambios realizados

- Documentado el flujo de copia manual SQLite, Google Drive y copias programadas.
- Explicado que la restauración reemplaza la base local completa y no combina registros.
- Documentadas las validaciones de integridad y tablas antes de restaurar.
- Diferenciada la restauración de una copia CardioSync de la importación de mediciones CSV o SQLite externa.
- Corregidas afirmaciones genéricas sobre formatos de importación y exportación para reflejar el código revisado.

### Documentos relacionados

- `docs/16_BACKUP_AND_RESTORE.md`
- `docs/09_DATABASE.md`
- `docs/15_USER_GUIDE.md`

### Alcance

Revisión estática del código en la rama de referencia. No se ejecutaron pruebas en dispositivo ni de Google Drive.

---

# 2026-10-15 — Plan de resolución de brechas documentales

### Tipo

Mantenimiento documental

### Cambios realizados

- Añadido un plan para resolver los 24 archivos vacíos identificados en la auditoría inicial.
- Clasificados los documentos por área y propuesta de tratamiento: completar, consolidar, mantener pendiente o retirar tras revisión.
- Añadidos criterios para evitar duplicidad de roadmaps y decisiones arquitectónicas.
- Establecida una regla explícita para no inventar contenido clínico ni atribuir validación funcional sin evidencia.
- Enlazado el plan desde el índice documental.

### Alcance

Solo documentación. No se modificaron código de aplicación, dependencias, configuración nativa ni reglas clínicas. No se ejecutaron compilaciones ni pruebas en dispositivo.

### Documento relacionado

- `docs/18_DOCUMENTATION_GAPS.md`

---

# 2026-10-15 — Revisión de arquitectura, reportes e importación

### Tipo

Auditoría y actualización documental

### Cambios realizados

- Actualizado el estado del dominio clínico para distinguir código presente de validación funcional integral.
- Corregido el estado del reporte del paciente para no describir como «en implementación» una funcionalidad que ya tiene servicios de construcción y generación PDF.
- Reescrita la referencia de base de datos para describir los formatos de importación que aparecen en los parsers inspeccionados: CSV con encabezados CardioSync y SQLite externa con tabla `tranx`.
- Retiradas afirmaciones no respaldadas por esos parsers sobre compatibilidad con Excel/XLS/XLSX.
- Corregida la estructura de la sección de persistencia, copias e intercambio en la documentación de base de datos.

### Alcance y límites

Cambios solo documentales. Se inspeccionaron archivos fuente de servicios y parsers en la rama documental; no se ejecutaron compilaciones, pruebas automatizadas ni pruebas en dispositivo. La presencia de código no se considera prueba de validación completa.

### Documentos relacionados

- `docs/01_ARCHITECTURE.md`
- `docs/07_REPORTS.md`
- `docs/09_DATABASE.md`

---

# 2026-10-15 — Health Connect y confiabilidad de copias programadas

### Tipo

Auditoría documental de integraciones

### Cambios realizados

- Documentados los servicios de Health Connect encontrados en la rama: inicialización/permisos, coordinación de lecturas recientes, ajustes locales, paginación, agregados y exportación de presión arterial.
- Aclarado que los permisos solicitados por el código no prueban que el usuario los haya concedido ni que existan datos disponibles.
- Añadida una advertencia para validar el alcance de la operación que elimina registros de presión arterial asociados a CardioSync.
- Documentada la dependencia de las copias programadas respecto del módulo nativo Android de alarmas, permisos del sistema y conexión de Google Drive.
- Aclarado que la configuración de una programación no garantiza una ejecución exitosa ni sustituye la comprobación del archivo remoto.

### Alcance y límites

Solo documentación. La revisión fue estática sobre la rama documental; no se probaron permisos, alarmas, sincronización, eliminación de registros ni restauraciones en un dispositivo. No se modificó código nativo ni configuración de compilación.

### Documentos relacionados

- `docs/08_HEALTH_CONNECT.md`
- `docs/16_BACKUP_AND_RESTORE.md`


---

# 2026-10-15 — Fundamentos documentales y alcance clínico

### Tipo

Documentación de arquitectura y dominio clínico

### Cambios realizados

- Añadida una constitución propuesta con principios de arquitectura, calidad, manejo de datos y trazabilidad.
- Añadida una introducción a la documentación clínica que separa fuentes publicadas, interpretación del proyecto, reglas implementadas y evidencia de validación.
- Actualizado el plan de brechas para registrar estos avances y el orden de trabajo siguiente.

### Alcance y límites

Cambios exclusivamente documentales. No se modificaron código de aplicación, dependencias, configuración nativa ni reglas clínicas. La constitución requiere revisión y aprobación; no se declara validación clínica ni cumplimiento normativo.

### Referencias

- [Constitución de CardioSync](00_CARDIOSYNC_CONSTITUTION.md)
- [Introducción a la documentación clínica](clinical/00_INTRODUCTION.md)
- [Brechas documentales](18_DOCUMENTATION_GAPS.md)


---

# 2026-10-15 — Borrador de ADR del dominio principal

### Tipo

Documentación arquitectónica

### Cambios realizados

- Redactado el ADR-001 como propuesta revisable sobre la medición de presión arterial como núcleo del dominio.
- Incluida la evidencia inspeccionada, las alternativas, los riesgos y los límites de validación.
- Conservados como pendientes los demás ADR que requieren comprobación específica.

### Alcance y límites

Cambio exclusivamente documental. El ADR-001 queda propuesto para revisión y no se considera una decisión formalmente aprobada. No se modificó código de la aplicación.

### Referencias

- [ADR-001](architecture/adr/ADR-001-blood-pressure-record-is-the-core.md)
- [Brechas documentales](18_DOCUMENTATION_GAPS.md)


---

# 2026-10-15 — Corrección del estado del Consenso Argentino 2025

### Tipo

Auditoría documental clínica

### Cambios realizados

- Revisados el clasificador, el modelo de guía, la regla de clasificación, los objetivos terapéuticos y la extracción de definición y clasificación.
- Actualizada la ficha `ARGENTINA_2025.md` para reflejar que existe implementación y documentación de extracción.
- Corregido el registro general de guías para separar implementación existente de validación pendiente.

### Alcance y límites

Cambio exclusivamente documental. No se modificaron reglas, umbrales, código de aplicación ni pruebas. La revisión estática no equivale a validación clínica integral.

### Referencias

- [Consenso Argentino 2025](clinical/guidelines/ARGENTINA_2025.md)
- [Registro de fuentes clínicas](clinical/09_CLINICAL_GUIDELINE.md)
- [Clasificación de presión arterial](../src/domain/clinical/classification/BloodPressureClassifier.ts)


---

# 2026-10-15 — Auditoría estática de objetivos terapéuticos argentinos

### Tipo

Auditoría de reglas clínicas y documentación

### Hallazgos

- Identificada una condición de buena tolerancia que el matcher evalúa siempre como falsa.
- Registrada la ausencia de un objetivo específico localizado para hipertensión sistólica aislada en personas de 65–79 años dentro del arreglo revisado.
- Señalada la necesidad de revisar la representación de fragilidad y el tratamiento de valores bajos.
- Vinculados los hallazgos a la extracción del consenso y a los archivos de implementación inspeccionados.

### Alcance y límites

Solo documentación y auditoría estática. No se modificó código ni se alteraron objetivos. Los hallazgos requieren contraste con la fuente primaria, revisión del contexto clínico y pruebas antes de corregir la implementación.

### Referencia

- [Consenso Argentino 2025 — objetivos y hallazgos](clinical/guidelines/ARGENTINA_2025.md)


---

# 2026-10-15 — Seguimiento del contexto clínico y selección de objetivos

### Tipo

Auditoría estática de arquitectura clínica

### Cambios realizados

- Trazado el flujo desde `ClinicalContext` y el perfil local hasta `ClinicalAnalysisDomainService` y `TherapeuticTargetRule`.
- Documentado que el selector asigna al grupo de 16–79 años los contextos con edad ausente o fuera del umbral de 80 años, sin validar el límite inferior en el selector.
- Documentado el fallback al primer objetivo de la población cuando ninguna condición coincide.
- Registrada la necesidad de revisar las condiciones de tolerancia de objetivos de diabetes y enfermedad renal crónica y la cobertura independiente de valores bajos.
- Definidos los próximos pasos de auditoría antes de proponer cambios de código.

### Alcance y límites

Solo documentación. La revisión fue estática en la rama `docs/documentation-audit`; no se ejecutaron pruebas ni se inspeccionó todavía cada consumidor de análisis, formulario de perfil o regla de seguridad. No se modificó código funcional ni se alteraron objetivos clínicos.

### Documentos relacionados

- `docs/18_DOCUMENTATION_GAPS.md`
- `docs/clinical/guidelines/ARGENTINA_2025.md`


---

# 2026-10-15 — Reorganización de la documentación para lectores del proyecto

### Tipo

Documentación de producto y arquitectura

### Cambios realizados

- Reorientado el índice para que una persona nueva empiece por el producto, la guía de uso, la arquitectura y las funcionalidades.
- Reescrita la arquitectura para explicar la organización real del código y el recorrido de la información.
- Reescritos los documentos de dominio clínico y motor de reglas para describir sus modelos, componentes y flujo de ejecución.
- Separados los documentos de mantenimiento interno de la documentación que explica cómo funciona la aplicación.

### Criterio editorial

La documentación principal debe responder qué hace cada parte, cómo se organiza y cómo interactúa con el resto del sistema. Los hallazgos de auditoría, las discrepancias y las tareas pendientes pertenecen a documentos internos específicos, no deben dominar la explicación de producto o arquitectura.

### Alcance

Cambios documentales. No se modificó código funcional, reglas clínicas, dependencias ni configuración de la aplicación.


---

# 2026-10-15 — Documentación funcional y técnica reader-first

### Tipo

Documentación de funcionamiento y arquitectura

### Cambios realizados

- Reescrito `06_CLINICAL_ANALYSIS.md` para explicar el flujo real del servicio de análisis clínico y la composición actual de reglas.
- Reescrito `07_REPORTS.md` para describir el flujo de reportes y el renderer SVG/HTML del gráfico PDF.
- Reescrito `08_HEALTH_CONNECT.md` para explicar la integración, sus componentes, permisos y flujo de datos.
- Reescrito `09_DATABASE.md` para explicar persistencia local, validación de restauración e importación CSV/SQLite.
- Reescrito `11_MODULES.md` y `12_FOLDER_STRUCTURE.md` para reflejar los módulos y directorios presentes en el árbol de código.
- Reescrito `14_RELEASES_AND_UPDATES.md` como guía de distribución Android, diferenciando APK y OTA y conservando las comprobaciones operativas necesarias.

### Criterio editorial

Los documentos explican qué hace cada módulo, dónde vive su implementación y cómo se relaciona con el resto de CardioSync. Las precauciones se mantienen donde afectan a la seguridad de datos, a la interpretación clínica o a la publicación de versiones; no sustituyen la explicación funcional.

### Alcance

Cambios documentales en la rama `docs/documentation-audit`. No se modificó código de la aplicación, dependencias ni configuración nativa.


---

# 2026-10-15 — Guías técnicas de funcionalidades y contexto del proyecto

### Cambios realizados

- Actualizado `00_PROJECT_MASTER_CONTEXT.md` para resumir el producto, las funcionalidades presentes, la arquitectura, los principios de desarrollo y los documentos de referencia.
- Reescritos `06_CLINICAL_ANALYSIS.md`, `07_REPORTS.md`, `08_HEALTH_CONNECT.md`, `09_DATABASE.md`, `11_MODULES.md` y `12_FOLDER_STRUCTURE.md` con un enfoque funcional y técnico.
- Reescrito `14_RELEASES_AND_UPDATES.md` como guía de distribución Android y diferencias entre APK y OTA.
- Conservadas las precauciones necesarias para interpretación clínica, protección de datos, permisos y publicación.

### Alcance

Documentación modificada en la rama `docs/documentation-audit`. No se modificó código de la aplicación ni configuración nativa.


---

# 2026-10-15 — Revisión de roadmap, decisiones y recuperación

- Actualizado `02_ROADMAP.md` para orientar al lector sobre la evolución del producto y separar el trabajo actual de las líneas futuras.
- Reorganizada la introducción de `03_DECISIONS.md` para presentar las decisiones como ADR de arquitectura y facilitar su lectura.
- Simplificada la introducción de `16_BACKUP_AND_RESTORE.md` para comenzar por las operaciones de copia y recuperación que ofrece CardioSync.
- Se mantiene la distinción entre código presente, validación en dispositivo y publicación; no se declaran pruebas que no se hayan ejecutado.

- Corrección del roadmap: Backup/recuperación y Health Connect figuran como implementados en el repositorio y en consolidación operativa, no como funcionalidades planificadas. Configuración e integraciones se ajustaron para reflejar los módulos presentes.

- Ajustado el criterio del roadmap: el estado de implementación refleja la presencia de la funcionalidad en el código. Las pruebas, la estabilidad y la compatibilidad se documentan por separado y no convierten una función implementada en trabajo planificado.

- Coherencia final: el roadmap define `IMPLEMENTADO` por presencia en código y reserva `PLANIFICADO` para funcionalidades aún inexistentes. Las comprobaciones y validaciones se documentan de forma independiente.
- Las normas documentales incorporan el mismo criterio para evitar que las pruebas pendientes se interpreten como funcionalidades sin implementar.


---

# 2026-10-17 — Auditoría de documentación de releases

### Tipo

Auditoría y corrección documental

### Cambios realizados

- Alineada la guía de versiones y actualizaciones con los archivos de configuración consultados en `main`.
- Registrados los valores declarados en `app.json`, `package.json` y `eas.json`, distinguiéndolos de la configuración efectiva de EAS.
- Retirada la afirmación de que el perfil `production-apk` existe en la configuración consultada.
- Aclarado que el runtime, el canal OTA y la versión remota de EAS deben verificarse antes de publicar.
- Reforzada la separación entre una build, una OTA publicada y una actualización efectivamente recibida en un dispositivo.

### Alcance y límites

Solo documentación. No se modificaron archivos de aplicación, dependencias, configuración nativa ni perfiles de build. No se ejecutaron Expo Config, EAS Build, publicaciones OTA ni pruebas en dispositivo. Los valores documentados reflejan los archivos consultados en la rama `main` el 2026-10-17.

### Documentos relacionados

- `docs/14_RELEASES_AND_UPDATES.md`
- `app.json`
- `package.json`
- `eas.json`


---

# 2026-10-17 — Inventario documental de seguimiento

### Tipo

Auditoría documental

### Cambios realizados

- Añadida una auditoría de seguimiento basada en la lectura de archivos de `main`.
- Registrados los 19 documentos vacíos confirmados en el conjunto inspeccionado.
- Añadida la referencia a la auditoría actual desde el índice documental, conservando el enlace a la auditoría histórica.
- Eliminado el título duplicado en la guía de copias y recuperación.

### Alcance y límites

Solo documentación. La revisión fue estática a través de los archivos disponibles en GitHub; no se ejecutaron comandos en Codespaces, compilaciones, pruebas automatizadas, publicaciones OTA ni pruebas en dispositivo. El inventario no se presenta como una inspección exhaustiva de todos los archivos del repositorio.

### Referencias

- `docs/21_DOCUMENTATION_AUDIT_2026-10-17.md`
- `docs/14_RELEASES_AND_UPDATES.md`
- `docs/16_BACKUP_AND_RESTORE.md`
