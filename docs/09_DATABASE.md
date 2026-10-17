# CardioSync — Database Architecture

| Campo | Valor |
|-------|--------|
| Documento | 09_DATABASE.md |
| Tipo | Documentación del Modelo de Datos |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-10-17 |

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

Estado: 🔄 PARCIALMENTE IMPLEMENTADO

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

---

# Estado de importación y exportación — 2026-10-17

La importación ya dispone de una feature en `src/features/import/`; por lo tanto, el estado general **PLANIFICADO** de la sección de importación/exportación es demasiado amplio y debe interpretarse como evolución pendiente, no como ausencia total de implementación.

## Capacidades identificadas en el código

- Importación CSV mediante `CsvImportParser.ts` y `CsvImportService.ts`.
- Importación de una base SQLite externa mediante `DbImportParser.ts` y `DbImportService.ts`.
- Normalización y persistencia mediante servicios dedicados.
- Pantalla de importación y modelo de vista previa con resultados.
- Exportación de reportes PDF documentada en `07_REPORTS.md`.

## Alcance que no debe inferirse

- La presencia de importadores CSV y SQLite no significa que se admitan Excel ni cualquier esquema SQLite arbitrario.
- No afirmar que la exportación CSV o Excel está disponible sin localizar y verificar sus implementaciones específicas.
- La importación de mediciones no equivale a restaurar una copia completa de CardioSync ni a migrar todas las tablas.
- Los detalles exactos de encabezados, rangos válidos, deduplicación y manejo de errores deben corresponder al parser y al validador de la versión que se esté documentando.

## Criterio de mantenimiento

Mantener separadas la restauración completa de una copia, la importación de mediciones y la exportación de reportes. Antes de cambiar el esquema SQLite, revisar compatibilidad con datos existentes, migraciones y servicios de backup/restauración.

Esta actualización se contrastó con la estructura de `src/features/import/`. No se ejecutaron pruebas de importación ni exportación durante esta revisión.
