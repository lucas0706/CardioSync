# CardioSync — Project Master Context

| Campo | Valor |
|-------|--------|
| Documento | 00_PROJECT_MASTER_CONTEXT.md |
| Tipo | Documento Maestro del Proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

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

CardioSync es una plataforma especializada para el registro, seguimiento y análisis de la presión arterial.

El proyecto evoluciona hacia un sistema de soporte clínico basado exclusivamente en guías clínicas y evidencia científica.

Su arquitectura está diseñada para permitir el crecimiento progresivo mediante módulos independientes sin comprometer la estabilidad del sistema.

---

# 3. Objetivos

## Objetivo principal

Construir una plataforma robusta para el seguimiento de pacientes con hipertensión arterial mediante una arquitectura moderna, mantenible y escalable.

## Objetivos técnicos

- Mantener una arquitectura modular.
- Reducir el acoplamiento.
- Centralizar la persistencia.
- Mantener el dominio independiente de la interfaz.
- Favorecer la reutilización.
- Mantener documentación sincronizada con el código.

## Objetivos funcionales

### ✅ Implementado

- Registro de mediciones.
- Historial.
- Dashboard.
- Motor de estadísticas.
- Persistencia local.

### 🚧 En desarrollo

- Refactorización del dominio.
- Consolidación del dominio clínico.

### 📐 Diseño aprobado

- Clinical Context.
- Clinical Rule Engine.
- Clinical Analysis Engine.
- Reportes clínicos.

### 📋 Planificado

- Integración Health Connect.
- Dashboard dinámico.
- Reportes PDF.

---

# 4. Alcance

Actualmente CardioSync implementa:

- Registro de presión arterial.
- Persistencia local.
- Procesamiento estadístico.
- Dashboard.
- Infraestructura inicial del dominio clínico.

Toda funcionalidad futura deberá respetar la arquitectura establecida en este documento.

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

## Clinical

🚧 En desarrollo

## Documentación

🚧 En construcción



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

Estado: 🚧 EN DESARROLLO

Responsable de la interpretación clínica basada en guías clínicas.



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

## Fase actual

### Refactorización del dominio

Estado: 🚧 EN DESARROLLO

Objetivo:

Simplificar el modelo de medición y preparar la evolución del dominio clínico.

## Próximas fases

- Clinical Domain
- Clinical Rule Engine
- Clinical Analysis Engine
- Reportes
- Integración Health Connect
- Dashboard dinámico

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

# 18. Conclusión

CardioSync se desarrolla como una plataforma modular especializada en hipertensión arterial.

Su evolución estará guiada por:

- Arquitectura consistente.
- Separación de responsabilidades.
- Evidencia científica.
- Guías clínicas oficialmente soportadas.
- Documentación sincronizada con el código.

La documentación constituye un componente oficial del proyecto y deberá evolucionar junto con la implementación.

