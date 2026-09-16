# CardioSync — Database Architecture

| Campo | Valor |
|-------|--------|
| Documento | 09_DATABASE.md |
| Tipo | Documentación del Modelo de Datos |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento describe el modelo actual de datos de CardioSync.

Su finalidad es documentar:

- Estructura de almacenamiento.
- Responsabilidad de entidades.
- Evolución prevista.
- Intercambio de datos.

---

# Importación y Exportación de Datos

Estado: 📋 PLANIFICADO

## Objetivo

Permitir la migración de históricos de presión arterial desde otras aplicaciones, dispositivos o registros personales hacia CardioSync.

También permitir la exportación de información propia del usuario.

---

# Importación de históricos

CardioSync podrá incorporar registros existentes mediante archivos externos.

Fuentes posibles:

- CSV.
- Excel.
- Exportaciones de otras aplicaciones.
- Registros personales del usuario.

---

# Flujo de importación

Archivo externo

↓

Parser

↓

Validación

↓

Normalización

↓

Mapper

↓

BloodPressureRecord

↓

Repository

↓

SQLite

---

# Principios de importación

- Los formatos externos no definen el modelo interno.
- CardioSync mantiene su propio dominio.
- Toda importación deberá validar los datos antes de almacenarlos.
- Los errores deberán detectarse antes de confirmar la importación.
- Los registros importados deberán conservar fecha y origen cuando sea posible.

---

# Exportación

CardioSync podrá exportar información propia del usuario.

Formatos previstos:

- CSV.
- Excel.
- PDF.

---

# Compatibilidad futura

Cuando se incorpore un nuevo formato externo, deberá crearse un adaptador específico.

Los formatos externos nunca deberán modificar:

- BloodPressureRecord.
- Measurement Domain.
- Arquitectura principal.
