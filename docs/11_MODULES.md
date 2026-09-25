# CardioSync — Modules Reference

| Campo | Valor |
|-------|--------|
| Documento | 11_MODULES.md |
| Tipo | Inventario de módulos |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

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

