# CardioSync — Project Master Context

| Campo | Valor |
|-------|--------|
| Documento | 00_PROJECT_MASTER_CONTEXT.md |
| Tipo | Documento Maestro del Proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-22 |

---

# 1. Propósito

Este documento constituye la referencia principal de CardioSync.

Su finalidad es proporcionar el contexto arquitectónico completo del proyecto y servir como punto de entrada al resto de la documentación oficial.

Toda modificación del proyecto deberá realizarse respetando los principios definidos en este documento.

El código representa la implementación.

La arquitectura define el diseño.

La documentación preserva el conocimiento del proyecto.

Los tres elementos deberán evolucionar de forma sincronizada.

---

# 2. Visión

CardioSync es una aplicación especializada para el registro, seguimiento y análisis de la presión arterial.

El proyecto cuenta con una base clínica estructurada mediante:

- clasificación de presión arterial;
- contexto clínico;
- targets clínicos;
- reglas clínicas;
- análisis clínico;
- warnings;
- resultados clínicos.

La arquitectura está diseñada para permitir el crecimiento progresivo mediante módulos independientes sin comprometer la estabilidad del sistema.

La interfaz utiliza actualmente el sistema Visual Redesign V2 como referencia visual oficial.

---

# 3. Objetivos

## Objetivo principal

Construir una plataforma robusta para el seguimiento de la presión arterial mediante una arquitectura moderna, mantenible y escalable, con capacidad de incorporar progresivamente funcionalidades clínicas e integraciones externas.

## Objetivos técnicos

- Mantener una arquitectura modular.
- Reducir el acoplamiento.
- Centralizar la persistencia.
- Mantener el dominio independiente de la interfaz.
- Favorecer la reutilización.
- Mantener TypeScript strict.
- Mantener compatibilidad con Expo SDK 57.
- Evaluar dependencias antes de incorporarlas.
- Mantener documentación sincronizada con el código.

## Objetivos funcionales

### ✅ Implementado

- Registro de mediciones.
- Validación.
- Persistencia local.
- Historial.
- Edición y eliminación.
- Detalle de medición.
- Dashboard.
- Resumen semanal.
- Motor de estadísticas.
- ClinicalChart V2.
- Clasificación clínica.
- Clinical Domain.
- Clinical Rule Engine.
- Clinical Analysis Engine.
- Targets clínicos.
- Warnings clínicos.
- Reportes PDF.
- Compartir reportes.
- Visual Redesign V2.
- Navegación V2.
- Sistema visual V2.

### 📋 Planificado

- Configuración consolidada.
- Integración Health Connect.
- Sistema de backup.
- Backup local.
- Backup en nube.
- Google Drive.
- Dashboard dinámico.
- Evolución futura de reportes.
- Nuevas funcionalidades V2.

---

# 4. Alcance

Actualmente CardioSync implementa:

- Registro de presión arterial.
- Persistencia local mediante SQLite.
- Historial de mediciones.
- Dashboard.
- Estadísticas.
- Visualización clínica mediante ClinicalChart.
- Clasificación de presión arterial.
- Infraestructura del dominio clínico.
- Clinical Rule Engine.
- Clinical Analysis Engine.
- Targets clínicos.
- Warnings clínicos.
- Generación y compartición de reportes PDF.
- Sistema visual V2.

Toda funcionalidad futura deberá respetar la arquitectura establecida en este documento.

Las funcionalidades clínicas deberán permanecer separadas de la presentación y utilizar las estructuras del dominio existentes.

---

# 5. Estado actual

## Arquitectura

✅ Implementada

## Measurements

✅ Implementado

## Statistics

✅ Implementado

## Dashboard

✅ Implementado

## History

✅ Implementado

## Clinical Domain

✅ Implementado

## Clinical Classification

✅ Implementado

## Clinical Rule Engine

✅ Implementado

## Clinical Analysis Engine

✅ Implementado

## ClinicalChart V2

✅ Implementado

## Reports

✅ Implementado

## Visual Redesign V2

✅ Implementado

## Configuración

📋 Planificado / en consolidación

## Health Connect

📋 Planificado

## Backup

📋 Planificado

## Documentación

🚧 En consolidación

La documentación existente está siendo sincronizada con el estado real de implementación del proyecto.

---

# 6. Stack tecnológico oficial

## Estado

✅ IMPLEMENTADO

El stack tecnológico constituye una decisión arquitectónica del proyecto.

Toda modificación deberá quedar documentada.

| Área | Tecnología |
|------|------------|
| Lenguaje | TypeScript |
| Framework | React Native |
| Plataforma | Expo |
| Navegación | Expo Router |
| Persistencia | SQLite (expo-sqlite) |
| Formularios | React Hook Form |
| Validación | Zod |
| UI nativa complementaria | @expo/ui |

## Principios tecnológicos

### TypeScript

Todo el código nuevo deberá escribirse en TypeScript.

El tipado estricto forma parte de la arquitectura.

El uso de `any` deberá evitarse.

### React Native

La interfaz deberá implementarse exclusivamente mediante React Native.

La lógica de negocio permanecerá fuera de la UI.

### Expo

Expo constituye la plataforma oficial del proyecto.

Las APIs oficiales deberán priorizarse frente a soluciones externas cuando cubran la necesidad.

### SQLite

Toda persistencia local utilizará SQLite.

El acceso deberá realizarse mediante la capa Repository.

### React Hook Form

Los formularios deberán implementarse utilizando React Hook Form.

### Zod

Toda validación deberá centralizarse mediante esquemas Zod.

---

# 7. Arquitectura general

## Estado

✅ IMPLEMENTADO

La arquitectura se organiza mediante separación de responsabilidades.

Capas principales:

- Core
- Domain
- Features
- Clinical
- Components
- Theme
- Services
- Hooks
- Store
- Utils
- Types

Cada módulo posee una responsabilidad claramente definida.

---

# 8. Organización del repositorio

La organización del proyecto busca mantener independencia entre los distintos dominios funcionales.

La documentación oficial reside en:

docs/

Toda modificación estructural deberá reflejarse también en esta carpeta.

---

# 9. Dominios principales

## Measurements

Estado: ✅ IMPLEMENTADO

Responsable del registro y gestión de las mediciones.

---

## Statistics

Estado: ✅ IMPLEMENTADO

Responsable del procesamiento matemático y estadístico.

No interpreta resultados clínicos.

---

## Dashboard

Estado: ✅ IMPLEMENTADO

Responsable de la visualización de información.

No implementa lógica de negocio.

---

## Clinical

Estado: ✅ IMPLEMENTADO

Responsable de la interpretación clínica basada en guías clínicas mediante:

- clasificación clínica;
- targets clínicos;
- reglas clínicas;
- análisis clínico;
- warnings;
- resultados clínicos.

La evolución posterior del dominio clínico continúa en desarrollo.



---

# 10. Principios arquitectónicos

## Estado

✅ IMPLEMENTADO

La arquitectura de CardioSync se basa en los siguientes principios:

- Separación de responsabilidades.
- Bajo acoplamiento.
- Alta cohesión.
- Dominio independiente de la interfaz.
- Persistencia encapsulada.
- Componentes reutilizables.
- Evolución incremental.
- Documentación sincronizada con el código.

---

# 11. Principios clínicos

## Estado

🚧 EN DESARROLLO

CardioSync implementará un sistema de soporte clínico basado exclusivamente en evidencia científica y guías clínicas oficialmente adoptadas.

Toda interpretación clínica deberá ser:

- Reproducible.
- Trazable.
- Basada en reglas explícitas.
- Respaldada por una guía clínica documentada.

No existirán recomendaciones cuyo origen no pueda identificarse.

---

# 12. Arquitectura objetivo

## Estado

📐 DISEÑO APROBADO

La evolución del proyecto contempla la separación del dominio clínico mediante contextos especializados.

La arquitectura objetivo comprende:

- ClinicalContext
- MeasurementContext
- StatisticsContext
- PatientContext
- HistoryContext
- VitalSignsContext
- SleepContext
- ActivityContext
- BodyCompositionContext

Cada contexto será responsable exclusivamente de su propio dominio.

La composición de estos contextos permitirá construir una evaluación clínica integral sin incrementar el acoplamiento del sistema.

---

# 13. Restricciones arquitectónicas

Las siguientes reglas forman parte de la arquitectura oficial del proyecto.

1. Toda lógica de negocio deberá permanecer fuera de la interfaz de usuario.

2. Toda lógica clínica deberá implementarse exclusivamente dentro del dominio Clinical.

3. Toda recomendación deberá estar respaldada por una guía clínica documentada.

4. Statistics nunca generará recomendaciones clínicas.

5. Dashboard nunca implementará lógica clínica.

6. Ningún componente React accederá directamente a SQLite.

7. Toda persistencia utilizará la capa Repository.

8. Toda modificación arquitectónica deberá registrarse en la documentación oficial.



---

# 14. Roadmap resumido

## Fases completadas

- Arquitectura inicial.
- Measurements.
- Dashboard.
- Statistics.
- Clinical Foundation.
- Clinical Domain.
- Clinical Rule Engine.
- Clinical Analysis Engine.
- Reports.
- Importación.
- Visual Redesign V2.

## Fase actual

### Refactorización final del dominio

Estado: 🚧 EN DESARROLLO

Objetivo:

Simplificar el modelo de medición y continuar la separación entre datos propios de la medición, contexto clínico, datos externos y resultados derivados.

## Próximas fases

- Configuración consolidada.
- Integración Health Connect.
- Sistema de backup.
- Backup local.
- Backup en nube / Google Drive.
- Dashboard dinámico.
- Evolución futura de reportes.
- Nuevas funcionalidades clínicas basadas en el dominio establecido.

---

# 15. Definition of Done

Una fase únicamente podrá considerarse finalizada cuando:

- El código compile correctamente.
- La funcionalidad esté validada.
- La arquitectura permanezca consistente.
- Las decisiones arquitectónicas estén documentadas.
- El Roadmap haya sido actualizado.
- El Changelog haya sido actualizado.
- La documentación específica haya sido revisada.
- No existan contradicciones entre código y documentación.

---

# 16. Política de documentación

La documentación forma parte del proyecto.

Toda fase deberá actualizar obligatoriamente:

- 00_PROJECT_MASTER_CONTEXT.md
- 02_ROADMAP.md
- 03_DECISIONS.md
- Documento específico afectado.
- 10_CHANGELOG.md

La documentación deberá reflejar exactamente el estado real del proyecto.

No deberán existir diferencias entre la arquitectura documentada y la implementación.

---

# 17. Referencias

La lectura recomendada para comprender CardioSync es:

1. 00_PROJECT_MASTER_CONTEXT.md
2. 01_ARCHITECTURE.md
3. 02_ROADMAP.md
4. 03_DECISIONS.md
5. Documentación específica del módulo correspondiente.

---

# 17.1 Estado UI/UX — Visual Redesign V2

## Estado

✅ IMPLEMENTADO

El Rediseño Visual V2 fue implementado y validado el 2026-08-22.

La implementación abarcó la evolución visual y estructural de las principales áreas de la aplicación, manteniendo la lógica funcional y la arquitectura existente.

El bloque de Measurements V2 fue completado y validado para los tres flujos principales:

- Nueva medición.
- Edición.
- Detalle.

### Elementos visuales consolidados

- Cards SIS / DIA.
- Card FC centrada y del mismo tamaño visual.
- Selector de fecha.
- Selector de hora.
- Selector visual de brazo.
- Selector visual de posición.
- Campo de notas.
- Clasificación clínica en detalle.
- Alertas clínicas condicionales.
- Confirmación antes de eliminar.

### Componentes V2 incorporados

- `MeasurementDateTimeField`
- `MeasurementMetricInputCard`
- `MeasurementOptionSelector`

### Regla de reutilización

Nueva medición, edición y detalle deberán mantener una jerarquía visual coherente.

La pantalla de detalle utiliza la misma representación visual de las métricas en modo lectura.

La edición reutiliza el mismo formulario visual de Nueva medición.

### Fecha y hora

La selección utiliza `@expo/ui`, manteniendo compatibilidad con Expo SDK 57.

### Checkpoint

`171ef4c feat: complete measurement create edit and detail UI`

---

# 18. Conclusión

CardioSync se desarrolla como una plataforma modular especializada en hipertensión arterial.

Su evolución estará guiada por:

- Arquitectura consistente.
- Separación de responsabilidades.
- Evidencia científica.
- Guías clínicas oficialmente soportadas.
- Documentación sincronizada con el código.

La documentación constituye un componente oficial del proyecto y deberá evolucionar junto con la implementación.

