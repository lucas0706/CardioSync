# Base de datos, importación y persistencia

CardioSync conserva sus datos de seguimiento en SQLite local. La persistencia se mantiene separada de las pantallas para que las funcionalidades puedan leer y guardar información mediante los servicios y la infraestructura correspondientes.

## Base de datos local

El archivo de base de datos utilizado para las operaciones de restauración es `cardiosync.db`. El código de restauración reconoce, como mínimo, las tablas `blood_pressure_records` y `clinical_profile). Estas tablas identifican partes importantes de los datos de CardioSync, pero no constituyen un inventario completo del esquema.

La infraestructura compartida de base de datos se encuentra en `src/core/database`. Las pantallas deben utilizar los servicios de su feature y no ejecutar consultas SQLite directamente.

## Copias y restauración

La restauración de una copia de CardioSync y la importación de mediciones externas son operaciones distintas:

- **Restaurar una copia** reemplaza la base de datos local por una base validada.
- **Importar mediciones** procesa un archivo compatible y agrega registros a través del flujo de importación.

El servicio de restauración crea una copia temporal del archivo elegido, abre esa base y comprueba `PRAGMA integrity_check`. También verifica la presencia de las tablas requeridas y cuenta las mediciones antes de aceptar el archivo. Si pasa la validación, cierra la conexión activa, reemplaza el archivo local y reabre la base.

Consulta [Copias de seguridad y recuperación](16_BACKUP_AND_RESTORE.md) para el flujo de copia manual, programación y Google Drive.

## Importación de CSV

El parser CSV de la rama documentada espera estas columnas:

- `Fecha`
- `Sistólica`
- `Diastólica`
- `Pulso`
- `Sitio`
- `Posición`
- `Nota`

El parser convierte las filas al formato interno, normaliza los datos y comunica errores o duplicados según las validaciones implementadas. Para una importación correcta, el archivo debe respetar los encabezados y el formato que espera el parser.

## Importación desde SQLite

El parser SQLite externo busca una tabla `tranx` con estas columnas:

- `sys`
- `dia`
- `pulse`
- `siteId`
- `positionID`
- `note`
- `tranxDate`
- `tranxTime`

El parser transforma esos campos al modelo interno de CardioSync. No todos los archivos SQLite son compatibles: el archivo debe tener la estructura esperada por este importador.

## Flujo de importación

```text
Archivo seleccionado
       ↓
Parser CSV o SQLite
       ↓
Normalización y validación
       ↓
Resultado de importación
       ↓
Persistencia de mediciones
```

Los componentes relacionados se encuentran en:

- `src/features/import/parsers/CsvImportParser.ts`
- `src/features/import/parsers/DbImportParser.ts`
- `src/features/import/services/ImportPersistenceService.ts`

## Formatos y límites

La implementación descrita incluye parsers CSV y SQLite. No se debe asumir compatibilidad con Excel/XLS/XLSX ni con cualquier estructura SQLite si no existe un parser específico para ese formato.

Los reportes PDF son documentos de seguimiento y no equivalen a una exportación completa de la base de datos.

## Cambios en persistencia

Cuando se modifique el esquema o la importación, actualizar la documentación con las tablas y columnas reales, explicar cómo se validan los datos y aclarar si la operación agrega, reemplaza o combina información. Los flujos de restauración y borrado merecen especial cuidado porque pueden afectar datos existentes.

## Archivos relacionados

- `src/core/database`
- `src/features/backup/services/CardioSyncRestoreService.ts`
- `src/features/import/parsers/CsvImportParser.ts`
- `src/features/import/parsers/DbImportParser.ts`
- `src/features/import/services/ImportPersistenceService.ts`
- [Copias de seguridad y recuperación](16_BACKUP_AND_RESTORE.md)
- [Reportes](07_REPORTS.md)