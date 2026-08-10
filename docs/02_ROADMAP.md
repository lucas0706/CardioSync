# CardioSync — Roadmap

| Campo | Valor |
|-------|--------|
| Documento | 02_ROADMAP.md |
| Tipo | Roadmap Oficial del Proyecto |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

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

Implementar el registro de mediciones.

### Funcionalidades implementadas

- Captura de mediciones.
- Validación.
- Persistencia.
- Historial.

---

## Dashboard

**Estado:** ✅ COMPLETADO

### Objetivo

Visualizar la información del usuario.

### Funcionalidades implementadas

- Dashboard principal.
- Indicadores.
- Gráficos.

---

## Statistics

**Estado:** ✅ COMPLETADO

### Objetivo

Implementar el motor estadístico.

### Funcionalidades implementadas

- Estadísticas.
- Tendencias.
- Promedios.
- Variabilidad.
- Métricas.

---

## Clinical Foundation

**Estado:** ✅ COMPLETADO

### Objetivo

Preparar la infraestructura inicial del dominio clínico.

### Funcionalidades implementadas

- Organización inicial del módulo Clinical.
- Base para la futura evolución clínica.

---

# Fase actual

## Refactorización Final del Dominio

**Estado:** 🚧 EN DESARROLLO

### Objetivo

Simplificar completamente el modelo de dominio.

BloodPressureRecord deberá representar exclusivamente una medición de presión arterial.

Toda la información clínica será trasladada progresivamente a contextos especializados.

### Resultado esperado

- Dominio más simple.
- Menor acoplamiento.
- Base para el Clinical Domain.

---

# Próximas fases

## 1. Diseño del Clinical Domain

**Estado:** 📋 PLANIFICADO

---

## 2. Diseño del Clinical Rule Engine

**Estado:** 📋 PLANIFICADO

---

## 3. Diseño del Clinical Analysis Engine

**Estado:** 📋 PLANIFICADO

---

## 4. Pantalla de Configuración

**Estado:** 📋 PLANIFICADO

---

## 5. Diseño de Reportes

**Estado:** 📋 PLANIFICADO

---

## 6. Implementación del Clinical Rule Engine

**Estado:** 📋 PLANIFICADO

---

## 7. Implementación del Clinical Analysis Engine

**Estado:** 📋 PLANIFICADO

---

## 8. Implementación de Reportes PDF

**Estado:** 📋 PLANIFICADO

---

## 9. Integración Health Connect

**Estado:** 📋 PLANIFICADO

---

## 10. Dashboard Dinámico

**Estado:** 📋 PLANIFICADO

---

## 11. Funcionalidades V2

**Estado:** 📋 PLANIFICADO

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

🚧 Refactorización Final del Dominio

↓

📋 Clinical Domain

↓

📋 Clinical Rule Engine

↓

📋 Clinical Analysis Engine

↓

📋 Configuración

↓

📋 Reportes

↓

📋 Health Connect

↓

📋 Dashboard Dinámico

↓

📋 Funcionalidades V2

---

# Política de actualización

Este documento deberá actualizarse obligatoriamente al finalizar cada fase.

Una fase no podrá considerarse finalizada hasta que este roadmap refleje exactamente el estado real del proyecto.


---

## Decisión de períodos por módulo

Los períodos son independientes por feature.

### Historial

Su función principal es visualizar registros. Puede mostrar todos los registros sin filtro temporal o utilizar posteriormente filtros propios de navegación.

### Estadísticas

Mantiene su infraestructura actual:

- 7 días
- 30 días
- 90 días
- personalizado

Utiliza `StatisticsFilter` y `PeriodFilter`.

### Clinical Analysis

No tendrá un período global propio. Analizará los registros correspondientes al conjunto temporal que determine su consumidor.

### Reports

Tendrá posteriormente su propia selección temporal para generación de informes y exportaciones.

Ejemplo:

`Reports = últimos 30 días`

Esto no modifica el período seleccionado en Statistics ni el estado de History.

### Health Connect

Será una fuente adicional de datos. No conocerá ni dependerá de `PeriodFilter`.

---


---

## Clinical Context de producción

### Pendiente antes de integrar Clinical Analysis con Statistics

Crear una fuente de `ClinicalContext` de aplicación que permita proporcionar, cuando corresponda:

- patientId;
- edad;
- condiciones clínicas relevantes;
- factores de riesgo;
- contexto necesario para selección de objetivos.

No utilizar los escenarios de `devtools` como fuente de datos de producción.

Una vez disponible:

`Statistics filteredMeasurements + StatisticsSummary + ClinicalContext`

podrán alimentar `ClinicalAnalysisDomainService`.

---


## Checkpoint 2026-08-10 — Statistics V2

Statistics V2 queda en estado funcional para su gráfico clínico principal.

Completado en este checkpoint:

- gráfico de presión arterial;
- frecuencia cardíaca;
- múltiples series en un único gráfico;
- leyenda por serie;
- unidades visibles;
- eje temporal;
- etiquetas de fecha;
- valores del eje Y;
- colores diferenciados;
- integración con los registros de mediciones existentes.

El siguiente trabajo deberá partir de este checkpoint sin reintroducir gráficos separados para las variables principales salvo que exista una decisión explícita de producto.

