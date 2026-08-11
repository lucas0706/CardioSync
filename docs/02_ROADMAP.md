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

---

# Roadmap operativo actual — 2026-08-11

Este bloque define el orden operativo vigente del proyecto. El contenido histórico anterior de este documento se conserva sin modificaciones.

## FASE 1 — Verificar edición

**Estado:** ✅ COMPLETADO

### Objetivo

Validar la edición de una medición existente sin crear un nuevo registro y comprobar la propagación de los cambios.

### Validaciones realizadas

- Precarga correcta del `MeasurementForm`.
- Edición de presión sistólica.
- Edición de presión diastólica.
- Frecuencia cardíaca opcional.
- Edición de registros sin frecuencia cardíaca.
- Persistencia de la modificación.
- Conservación de la fecha/hora de la medición.
- History actualizado.
- Dashboard actualizado.
- Statistics funcionando según su diseño agregado.
- Reports actualizado.
- TypeScript strict sin errores.
- `git diff --check` sin errores.

### Incidencia corregida

Las mediciones sin frecuencia cardíaca almacenan `NULL` en SQLite.

Al cargar una medición de este tipo para edición, `NULL` llegaba al formulario y Zod rechazaba el valor porque el esquema acepta `number | undefined`, pero no `null`.

La entrada al formulario fue normalizada mediante:

`record.heartRate ?? undefined`

SQLite continúa almacenando `NULL` cuando la frecuencia cardíaca está ausente.

No se modifica la regla de validación ni se inventa un valor de frecuencia cardíaca.

---

## FASE 2 — Importación de datos históricos

**Estado:** 📋 PRÓXIMA

### Objetivo

Importar correctamente los datos históricos exportados por la aplicación que actualmente utiliza el usuario.

### Regla principal

No implementar primero un importador genérico.

Primero se debe analizar el archivo real exportado por la aplicación de origen.

No asumir que el formato será CSV, XLSX o JSON.

### Flujo

Aplicación actual
↓
Exportar archivo
↓
CardioSync
↓
Detectar formato
↓
Analizar estructura
↓
Mapear campos
↓
Validar
↓
Normalizar
↓
Vista previa
↓
Confirmación del usuario
↓
SQLite
↓
Dashboard / History / Statistics / Reports

### Datos a analizar

- Formato.
- Columnas.
- Fechas.
- Hora.
- Sistólica.
- Diastólica.
- Frecuencia cardíaca.
- Notas.
- Otros campos disponibles.
- Unidades.
- Registros incompletos.
- Duplicados.
- Formato de fecha/hora.

No se inventará el esquema antes de estudiar el archivo real.

---

## FASE 3 — Soporte para gran volumen de datos

**Estado:** 📋 PLANIFICADO

Evaluar CardioSync con:

- 100 registros.
- 1.000 registros.
- 10.000 registros.
- 50.000+ registros cuando corresponda.

Revisar:

- SQLite.
- Índices.
- Transacciones.
- Inserción por lotes.
- Repository.
- Consultas.
- Memoria.
- History.
- Statistics.
- Dashboard.
- Reports.

Evitar cargar innecesariamente toda la base en memoria.

Evaluar paginación o consultas limitadas en History cuando sea necesario.

---

## FASE 4 — Validar flujo completo

**Estado:** 📋 PLANIFICADO

Validar:

Registrar
↓
Importar
↓
Editar
↓
Eliminar
↓
Dashboard
↓
History
↓
Statistics
↓
Reports

Las modificaciones y eliminaciones deberán propagarse correctamente a las áreas correspondientes.

---

## FASE 5 — UI / UX

**Estado:** 📋 PLANIFICADO

Después de estabilizar la funcionalidad:

- DM Sans.
- Consistencia visual.
- Botones.
- Colores.
- Estados de guardado.
- Feedback de importación.
- Validaciones.
- Errores.
- Empty states.
- Espaciado.
- Consistencia entre pantallas.

La estética no tendrá prioridad sobre la estabilidad funcional.

---

## FASE 6 — Checkpoint

**Estado:** 📋 PLANIFICADO

Antes de iniciar nuevas funcionalidades:

- `npx tsc --noEmit`.
- Pruebas funcionales.
- `git status`.
- `git diff --check`.
- `git diff`.
- Documentación sincronizada.
- ZIP completo del proyecto.

El ZIP deberá incluir:

- Código fuente.
- `docs/`.
- Configuración.
- Scripts.
- `package.json`.
- Lockfile.

No deberá incluir:

- `node_modules/`.
- `.git/`.
- Builds generados.
- Bases SQLite locales.
- Archivos temporales.

---

## FASE 7 — Health Connect

**Estado:** 📋 PLANIFICADO

Health Connect es una tarea independiente.

No iniciar hasta que la importación histórica, el soporte para grandes volúmenes y el flujo completo estén estabilizados.

---

## Fuera del alcance inmediato

No forman parte de las próximas fases:

- Sistema diagnóstico.
- Sistema de prescripción.
- Motor clínico complejo.
- Clinical Rule Engine como próximo desarrollo.
- Clinical Analysis Engine como próximo desarrollo.
- ClinicalContext como próximo desarrollo.
- Nueva arquitectura de Reports.

