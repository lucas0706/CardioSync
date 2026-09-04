# CardioSync — Roadmap

| Campo | Valor |
|-------|--------|
| Documento | 02_ROADMAP.md |
| Tipo | Roadmap Oficial del Proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-22 |

---

# Objetivo

Este documento registra la evolución oficial de CardioSync.

Cada fase del proyecto deberá actualizar este documento para reflejar exactamente el estado del desarrollo.

---

# Estados utilizados

| Estado | Significado |
|---------|-------------|
| ✅ COMPLETADO | Funcionalidad implementada, validada y documentada. |
| 🚧 EN DESARROLLO | Fase actualmente en ejecución. |
| 📋 PLANIFICADO | Fase prevista para futuras versiones. |

---

# Fases completadas

## Arquitectura Base

**Estado:** ✅ COMPLETADO

### Objetivo

Definir la arquitectura inicial del proyecto.

### Funcionalidades implementadas

- Organización del repositorio.
- Arquitectura modular.
- Infraestructura base.

---

## Measurements

**Estado:** ✅ COMPLETADO

### Objetivo

Implementar el registro y gestión de mediciones.

### Funcionalidades implementadas

- Captura de mediciones.
- Validación.
- Persistencia.
- Historial.
- Edición.
- Eliminación.
- Detalle de medición.
- Formulario V2.

---

## Dashboard

**Estado:** ✅ COMPLETADO

### Objetivo

Visualizar de forma clara el estado actual de las mediciones.

### Funcionalidades implementadas

- Dashboard principal.
- Última medición.
- PAS.
- PAD.
- FC.
- Clasificación.
- Resumen semanal.
- Indicadores visuales.
- FAB para nueva medición.
- Rediseño visual V2.

---

## Statistics

**Estado:** ✅ COMPLETADO

### Objetivo

Implementar el motor estadístico y su presentación.

### Funcionalidades implementadas

- Estadísticas.
- Tendencias.
- Promedios.
- Variabilidad.
- Métricas.
- Filtros temporales.
- Estadísticas V2.
- ClinicalChart.
- PAS, PAD y FC en un mismo gráfico.
- Zoom.
- Desplazamiento.
- Selección de series.

---

## Clinical Foundation

**Estado:** ✅ COMPLETADO

### Objetivo

Preparar la infraestructura del dominio clínico.

### Funcionalidades implementadas

- Organización del módulo Clinical.
- Modelos clínicos.
- Contextos clínicos.
- Tipos clínicos.
- Guías clínicas.
- Targets clínicos.
- Warnings clínicos.
- Infraestructura para reglas clínicas.
- Infraestructura para análisis clínico.

---

## Refactorización Final del Dominio

**Estado:** ✅ COMPLETADO

### Objetivo

Simplificar el modelo de dominio y separar los datos propios de la medición de la información clínica contextual.

### Resultado

- BloodPressureRecord representa principalmente la medición de presión arterial.
- Separación progresiva de contexto clínico.
- Menor acoplamiento.
- Base preparada para el Clinical Domain.

---

## Clinical Domain

**Estado:** ✅ COMPLETADO

### Objetivo

Implementar la estructura del dominio clínico de CardioSync.

### Funcionalidades implementadas

- Clasificación de presión arterial.
- Contextos clínicos.
- Targets clínicos.
- Fuentes de guías.
- Clinical Findings.
- Clinical Analysis.
- Clinical Analysis Result.
- Reglas clínicas.
- Warnings clínicos.

---

## Clinical Rule Engine

**Estado:** ✅ COMPLETADO

### Objetivo

Implementar un sistema de reglas clínicas desacoplado de la interfaz.

### Funcionalidades implementadas

- ClinicalRule.
- ClinicalRuleContext.
- Reglas de presión arterial.
- Reglas de seguridad.
- Reglas de hipertensión.
- Reglas de riesgo cardiovascular.
- Reglas de target terapéutico.
- Reglas de tiempo en objetivo.
- Reglas de carga hipertensiva.
- Reglas de tendencia.
- Reglas de variabilidad.
- Integración con Clinical Analysis.

### Resultado

Las reglas clínicas pueden ejecutarse de forma independiente de la presentación.

---

## Clinical Analysis Engine

**Estado:** ✅ COMPLETADO

### Objetivo

Construir una capa de análisis clínico basada en los resultados del Rule Engine y el contexto clínico seleccionado.

### Funcionalidades implementadas

- ClinicalAnalysisService.
- ClinicalAnalysisDomainService.
- ClinicalAnalysisResultBuilder.
- Integración con ClinicalTargetSelector.
- Integración con reglas clínicas.
- Generación de Clinical Findings.
- Clasificación clínica.
- Evaluación contextual.
- Targets terapéuticos.
- Warnings.

### Validación

Se validaron contextos clínicos y escenarios históricos.

Se verificó la ejecución de las reglas y la construcción de resultados clínicos.

---

## Clinical Classification

**Estado:** ✅ COMPLETADO

### Objetivo

Centralizar la clasificación de presión arterial.

### Categorías implementadas

- normal;
- borderline;
- grade-1;
- grade-2;
- isolated-systolic.

### Implementación

La clasificación se centraliza en:

`src/domain/clinical/classification/BloodPressureClassifier.ts`

La interfaz utiliza el resultado del dominio y no duplica las reglas clínicas.

---

## ClinicalChart V2

**Estado:** ✅ COMPLETADO

### Objetivo

Consolidar la visualización clínica de las principales mediciones.

### Funcionalidades implementadas

- PAS.
- PAD.
- FC.
- Ejes clínicos.
- Fechas.
- Valores.
- Leyenda.
- Múltiples series.
- Zoom.
- Desplazamiento.
- Selección de series.

---

## History V2

**Estado:** ✅ COMPLETADO

### Objetivo

Optimizar la consulta rápida del historial.

### Funcionalidades implementadas

- Tarjetas compactas.
- Clasificación semántica.
- Información secundaria compacta.
- Acceso al detalle.
- Edición.
- Eliminación.
- FAB para nueva medición.

---

## Visual Redesign V2

**Estado:** ✅ COMPLETADO

### Objetivo

Modernizar la interfaz de CardioSync sin alterar innecesariamente la lógica funcional.

### Áreas implementadas

- Sistema visual.
- Theme.
- Cards.
- Botones.
- FAB.
- Dashboard.
- History.
- Measurement.
- Statistics.
- Profile.
- Más.
- Configuración.
- Reportes.
- Navegación.

### Resultado

Se estableció el sistema visual V2 como referencia actual de la aplicación.

---

## Reports

**Estado:** ✅ COMPLETADO

### Objetivo

Generar y compartir reportes de presión arterial.

### Funcionalidades implementadas

- Selección de período.
- Construcción del reporte.
- HTML.
- Generación de PDF.
- Compartir.
- Nombre de archivo estructurado.
- Eliminación del archivo temporal después de compartir.

Los archivos temporales generados por CardioSync no se conservan como una colección permanente dentro de la aplicación.

---

# Fases completadas recientemente

## Refactorización Final del Dominio

**Estado:** ✅ COMPLETADO

### Objetivo

Simplificar el modelo de dominio y separar progresivamente los datos propios de la medición de la información clínica contextual.

### Resultado

- `BloodPressureRecord` representa la medición de presión arterial.
- Se redujo el acoplamiento entre mediciones y contexto clínico.
- Se establecieron bases para la evolución del Clinical Domain.

---

## Clinical Rule Engine

**Estado:** ✅ COMPLETADO

### Objetivo

Centralizar las reglas clínicas utilizadas por CardioSync.

### Resultado

- Reglas clínicas desacopladas de la interfaz.
- Clasificación de presión arterial centralizada.
- Consolidación de la fuente activa de clasificación.
- Compatibilidad con distintos contextos clínicos.

---

## Clinical Analysis Engine

**Estado:** ✅ COMPLETADO

### Objetivo

Procesar información clínica y generar resultados derivados a partir de las reglas y contexto disponibles.

### Resultado

- Clinical Analysis V2 implementado.
- Selección de objetivos clínicos mediante `ClinicalTargetSelector`.
- Soporte para contextos GENERAL, DIABETES, CKD y ELDERLY.
- Integración con reglas terapéuticas.
- Validación mediante registros históricos simulados.

---

## Statistics V2 / ClinicalChart

**Estado:** ✅ COMPLETADO

### Resultado

- PAS, PAD y FC integrados en un único gráfico.
- Zoom.
- Desplazamiento.
- Selección de series.
- Ejes y fechas.
- Leyenda.
- Integración con el período seleccionado.
- Rediseño visual del gráfico.

---

## Reports

**Estado:** ✅ COMPLETADO

### Resultado

- Generación de reportes PDF.
- Contenido estandarizado.
- Selección de período.
- Generación temporal del archivo.
- Compartir mediante el sistema nativo.
- Eliminación del archivo temporal después del proceso de compartir.

---

## Visual Redesign V2

**Estado:** ✅ COMPLETADO

### Objetivo

Modernizar la interfaz de CardioSync manteniendo la funcionalidad y arquitectura existentes.

### Resultado

- Sistema visual V2.
- Navegación `Inicio | Registros | Perfil | Más`.
- Dashboard rediseñado.
- Historial rediseñado.
- Detalle de medición reorganizado.
- Nueva medición reorganizada.
- Perfil reorganizado.
- Más / Configuración reorganizado.
- Estadísticas reorganizadas.
- Componentes visuales reutilizables.
- Estados visuales y microinteracciones.
- FAB para nueva medición.
- Eliminación de navegación redundante en Inicio.

---

# Fase actual

## Consolidación y Documentación

**Estado:** 🚧 EN DESARROLLO

### Objetivo

Consolidar la implementación actual y mantener toda la documentación oficial sincronizada con el código.

### Actividades

- Actualización del Project Master Context.
- Actualización del Roadmap.
- Actualización del Changelog.
- Revisión de decisiones arquitectónicas.
- Documentación final del Visual Redesign V2.
- Verificación de TypeScript strict.
- Preparación de próximos módulos.

---

# Próximas fases

## 1. Configuración e Integraciones

**Estado:** 🚧 EN DESARROLLO

### Implementado

- Importar registros.
- Exportar registros.
- Gestión de datos desde Configuración.
- Estructura de Configuración dentro de la navegación V2.

### Pendiente

- Consolidación final de Configuración.
- Health Connect.
- Gestión de integraciones externas.

---

## 2. Backup y recuperación

**Estado:** 📋 PLANIFICADO

### Objetivo

Implementar mecanismos seguros para preservar y recuperar los datos de CardioSync.

### Alcance previsto

- Backup local.
- Backup en nube.
- Google Drive.
- Recuperación de datos.
- Política de retención.
- Control de copias para evitar acumulación innecesaria.

La estrategia definitiva se establecerá después de evaluar las capacidades actuales de Expo, SQLite y las integraciones externas necesarias.

---

## 3. Health Connect

**Estado:** 📋 PLANIFICADO

### Objetivo

Integrar CardioSync con Health Connect para permitir el intercambio de datos compatibles con el ecosistema de salud de Android.

### Alcance previsto

- Gestión de permisos.
- Lectura de datos compatibles.
- Escritura de mediciones cuando corresponda.
- Sincronización.
- Recuperación de información compatible ante determinados escenarios de pérdida local.

La administración de Health Connect pertenece a:

`Más → Configuración → Health Connect`

No pertenece al Perfil.

---

## 4. Dashboard Dinámico

**Estado:** 📋 PLANIFICADO

### Objetivo

Evolucionar el Dashboard utilizando la infraestructura existente para permitir una presentación más dinámica de la información.

La evolución deberá mantener:

- jerarquía visual;
- claridad clínica;
- bajo acoplamiento;
- separación entre presentación y dominio.

---

## 5. Evolución de Clinical Context

**Estado:** 📋 PLANIFICADO

### Objetivo

Continuar la especialización y extensión de los contextos clínicos existentes sin incrementar el acoplamiento del dominio.

La evolución deberá respetar la separación entre:

- mediciones;
- contexto clínico;
- datos externos;
- resultados derivados.

No se deberá modificar `BloodPressureRecord` para incorporar información perteneciente a otros dominios.

---

## 6. Funcionalidades clínicas futuras

**Estado:** 📋 PLANIFICADO

Nuevas funcionalidades clínicas basadas en:

- Clinical Domain;
- Clinical Rule Engine;
- Clinical Analysis Engine;
- Clinical Targets;
- Clinical Findings;
- Warnings;
- guías clínicas documentadas.

Toda nueva funcionalidad clínica deberá mantener trazabilidad hacia las reglas y fuentes clínicas correspondientes.

---

# Línea temporal

Arquitectura Base

↓

Measurements

↓

Dashboard

↓

Statistics

↓

Clinical Foundation

↓

Refactorización Final del Dominio

↓

Clinical Domain

↓

Clinical Classification

↓

Clinical Rule Engine

↓

Clinical Analysis Engine

↓

Statistics V2 / ClinicalChart

↓

History V2

↓

Reports

↓

Importación

↓

Visual Redesign V2

↓

🚧 Configuración e Integraciones

↓

📋 Health Connect

↓

📋 Backup y recuperación

↓

📋 Dashboard Dinámico

↓

📋 Evolución de Clinical Context

↓

📋 Funcionalidades clínicas futuras
