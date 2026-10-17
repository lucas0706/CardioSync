# CardioSync — Modules Reference

| Campo | Valor |
|-------|--------|
| Documento | 11_MODULES.md |
| Tipo | Inventario de módulos |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-10-17 |

---

# Objetivo

Este documento describe los módulos principales de CardioSync y sus responsabilidades.

Su finalidad es mantener una organización clara del sistema y evitar que diferentes dominios mezclen responsabilidades.

---

# Principio general

Cada módulo deberá:

- Tener una responsabilidad definida.
- Mantener bajo acoplamiento.
- Evitar depender directamente de módulos no relacionados.
- Mantener su lógica dentro de su dominio correspondiente.

---

# Módulos actuales

---

# Measurements

Estado:

✅ Implementado

Responsabilidad:

Gestionar mediciones de presión arterial.

Incluye:

- Registro de mediciones.
- Validación.
- Modelos relacionados.
- Persistencia.

No incluye:

- Interpretación clínica.
- Recomendaciones.
- Datos externos.

---

# Statistics

Estado:

✅ Implementado

Responsabilidad:

Procesamiento matemático de mediciones.

Incluye:

- Promedios.
- Tendencias.
- Variabilidad.
- Métricas.

No incluye:

- Diagnóstico.
- Recomendaciones clínicas.

---

# Dashboard

Estado:

✅ Implementado

Responsabilidad:

Visualización de información.

Incluye:

- Gráficos.
- Indicadores.
- Resúmenes.

No incluye:

- Lógica de negocio.
- Reglas clínicas.

---

# Clinical

Estado:

📋 Planificado

Responsabilidad:

Representar el dominio clínico.

Incluye futuro:

- ClinicalContext.
- ClinicalRuleEngine.
- ClinicalAnalysisEngine.

---

# Reports

Estado:

📋 Planificado

Responsabilidad:

Generación de reportes.

Incluye:

- Reporte paciente.
- Reporte médico.
- Exportaciones.

---

# Health Connect Integration

Estado:

📋 Planificado

Responsabilidad:

Obtener contexto adicional desde fuentes externas.

Incluye:

- SleepContext.
- ActivityContext.
- BodyCompositionContext.
- VitalSignsContext.

No forma parte del núcleo de mediciones.

---

# Import / Export

Estado:

📋 Planificado

Responsabilidad:

Migración e intercambio de datos.

Incluye:

- CSV.
- Excel.
- Otros formatos externos.

Utiliza:

- Parser.
- Validator.
- Mapper.

---

# Relaciones entre módulos

Measurements

↓

Statistics

↓

Dashboard


Measurements

↓

ClinicalContext

↓

ClinicalRuleEngine

↓

ClinicalAnalysisEngine

↓

Reports

---

# Restricciones

- Measurements no depende de Clinical.
- Statistics no genera interpretación clínica.
- Dashboard no contiene lógica de dominio.
- Health Connect no modifica Measurements.
- Importadores no modifican el modelo interno.

---

# Estado observado de módulos — 2026-10-17

Esta sección complementa el catálogo existente. Describe responsabilidades inferidas de la estructura y los servicios inspeccionados; no implica que todos los flujos hayan sido probados en dispositivo.

| Módulo | Responsabilidad observada | Estado conocido / límite |
|---|---|---|
| Measurements | Registro, consulta y mantenimiento de mediciones | Funcionalidad base presente; persistencia local SQLite. |
| Statistics | Resúmenes, filtros, métricas y gráfico clínico | Implementación presente; conservar la independencia del período por feature. |
| Clinical Domain | Clasificación, contextos, reglas, findings y análisis | Infraestructura de dominio presente; mantener trazabilidad clínica y validación continua. |
| Reports | Construcción y generación de reportes PDF | Flujo presente; el reporte médico ampliado permanece pendiente. |
| App Update | Consulta de releases, descarga y validación de APK | El instalador Android requiere confirmación del usuario; no es instalación silenciosa. |
| Updates / OTA | Preferencia de descarga automática, comprobación y descarga OTA | Aplicación de actualización separada; validar runtime y canal antes de publicar. |
| Backup | Copia SQLite, exportación manual, Google Drive y programación | Restauración integral y política de retención no deben darse por completadas sin validación específica. |
| Health Connect | Inicialización y solicitud de permisos | La lectura/escritura efectiva y sincronización requieren completar y validar la integración. |

## Límites entre módulos

- Los componentes visuales no deben duplicar reglas clínicas ni cálculos estadísticos.
- Las integraciones externas no deben alterar directamente el modelo de medición sin un flujo de dominio explícito.
- La persistencia y los servicios nativos deben aislarse de la presentación.
- La existencia de un servicio o una pantalla no sustituye las pruebas de integración.
