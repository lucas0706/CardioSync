# Copias de seguridad y recuperación de datos

# Copias de seguridad y recuperación de datos

CardioSync permite crear copias de su base SQLite local, guardar copias en una carpeta elegida o en Google Drive y restaurar una copia compatible. Esta guía describe las operaciones disponibles y las precauciones importantes para proteger el historial.

Los pasos de copia programada dependen de los permisos y las restricciones de Android. Después de una ejecución, conviene comprobar el resultado y la fecha de la última copia; activar la programación no garantiza por sí solo que se haya guardado una copia.

## 1. Qué contiene una copia

CardioSync utiliza una base SQLite local llamada `cardiosync.db`. El servicio de copia crea una copia SQLite de esa base, comprueba su integridad con `PRAGMA integrity_check` y registra la cantidad de filas de `blood_pressure_records`.

La copia es de la base de datos, no un archivo CSV ni un reporte PDF. Por eso puede conservar también información almacenada en otras tablas de esa misma base, como el perfil clínico y la configuración de copias. La lista exacta de tablas incluidas depende del esquema de la versión que genera la copia.

## 2. Copia manual en el dispositivo

Ruta: **Más → Configuración → Copias de seguridad**.

1. Elegir la acción de copia manual.
2. Android solicita seleccionar o autorizar una carpeta de destino. La pantalla propone la carpeta Descargas como ubicación inicial, pero se debe confirmar el destino en el selector del sistema.
3. CardioSync genera una copia temporal de SQLite, verifica su integridad y comprueba el archivo resultante.
4. La aplicación escribe el archivo en la carpeta elegida. El nombre sigue este patrón: `CardioSync_backup_AAAA-MM-DD_HH-MM-SS.db`.
5. La pantalla informa el resultado y la cantidad de mediciones incluida.

Si se cancela el permiso para la carpeta, la operación no guarda una copia manual. Después de copiar, comprobar que el archivo exista en la ubicación elegida. Para datos importantes, conservar otra copia fuera del dispositivo.

## 3. Copia en Google Drive

La copia en Google Drive requiere que la cuenta de Google esté conectada y que CardioSync pueda obtener un token válido.

El flujo identificado en el código es:

1. Generar y validar una copia SQLite temporal.
2. Buscar o crear la carpeta **CardioSync Backups** en Google Drive.
3. Subir un archivo con nombre `CardioSync_backup_AAAA-MM-DD_HH-MM-SS.db`.
4. Una vez aceptada la nueva copia por Drive, buscar las copias anteriores que coincidan con el prefijo de CardioSync en esa carpeta y eliminarlas.
5. Informar el resultado de la copia.

**Importante:** el comportamiento actual no constituye un historial de versiones. Después de una subida correcta, el servicio intenta eliminar las copias anteriores encontradas en esa carpeta y conservar la nueva. Si la subida falla antes de completarse, no inicia la eliminación de las copias anteriores. No usar esa carpeta como único archivo histórico si se necesitan varias versiones.

Desconectar Google Drive desde CardioSync no equivale a borrar la cuenta ni los archivos remotos.

## 4. Copias programadas

Ruta: **Más → Configuración → Copias programadas**.

La configuración permite:
- Activar o desactivar la programación.
- Elegir frecuencia diaria o semanal.
- Elegir el día de la semana cuando corresponde.
- Elegir la hora local.
- Consultar la última ejecución y su estado, si existen datos registrados.

La configuración inicial identificada en el servicio está desactivada, con frecuencia diaria y horario de las 03:00. El día semanal predeterminado es lunes. La programación guarda su estado en la base SQLite local.

La ejecución programada usa el mismo coordinador de copia de Google Drive; por lo tanto, requiere una conexión de Google válida. El servicio registra éxito o error e intenta mostrar una notificación. Android puede requerir autorización para alarmas exactas y notificaciones, y puede limitar tareas en segundo plano. Guardar una programación no garantiza que una copia se haya completado.

Para comprobarla:
1. Revisar que la programación esté activada y que el día/hora sean correctos.
2. Confirmar que Google Drive esté conectado.
3. Revisar el estado y la fecha de última ejecución que muestre la pantalla.
4. Si hubo error, revisar el mensaje disponible y volver a ejecutar una copia cuando las condiciones sean correctas.

## 4.1. Límites de la programación en Android

La implementación utiliza un módulo nativo Android llamado `AlarmScheduler` para sincronizar alarmas de copia. El servicio consulta si se pueden programar alarmas exactas y puede abrir la configuración del sistema correspondiente. Si el módulo nativo no está disponible, el código informa que es necesario reconstruir el cliente Android después del prebuild.

La ejecución programada valida la configuración y solo intenta ejecutar una copia cuando detecta una programación pendiente dentro de su ventana de tiempo. La ejecución requiere que Google Drive esté conectado y que se obtenga un token válido.

Por estos motivos:
- La hora configurada no constituye garantía de ejecución exacta en todos los dispositivos.
- Los permisos de alarmas exactas, las restricciones de batería y las políticas del fabricante pueden afectar la ejecución.
- Una copia programada fallida no debe considerarse una copia válida solo porque la programación esté activada.
- Revisar el último estado y la fecha de ejecución, y comprobar que el archivo remoto exista cuando se requiera certeza.

La existencia del servicio y del módulo nativo no sustituye pruebas reales tras instalar la APK de producción.

## 5. Validación antes de restaurar

Ruta: **Más → Configuración → Copias de seguridad → Restaurar copia**.

Al elegir un archivo, CardioSync lo copia a un archivo temporal y lo abre como base SQLite separada. Comprueba:
- Que `PRAGMA integrity_check` devuelva `ok`.
- Que exista la tabla `blood_pressure_records`.
- Que exista la tabla `clinical_profile`.
- La cantidad de mediciones que contiene.

Si no supera estas comprobaciones, la aplicación muestra un error y no ofrece confirmar esa restauración. Esta validación verifica integridad y estructuras esenciales; no demuestra que cada registro tenga datos clínicamente correctos ni que el archivo sea compatible con todas las versiones futuras.

## 6. Qué hace la restauración

Si la copia pasa la validación, CardioSync muestra una confirmación con la cantidad de mediciones e informa que **la restauración reemplazará la base de datos actual**.

Al confirmar, el servicio:
1. Cierra la conexión de la base de datos activa.
2. Elimina el archivo local `cardiosync.db`.
3. Mueve el archivo temporal validado a la ubicación de la base de datos activa.
4. Vuelve a abrir la conexión SQLite.

La restauración **no combina** los registros de la copia con los registros actuales. Reemplaza la base completa. Los datos creados o modificados después de la fecha de esa copia y que no estén incluidos en ella se perderán. No iniciar la restauración si se necesita conservar el estado actual sin haber creado otra copia recuperable.

El servicio vuelve a abrir la base cuando el reemplazo termina correctamente. Si ocurre un error durante la sustitución, el código devuelve un error; el procedimiento no debe considerarse recuperado hasta volver a abrir la aplicación y verificar los datos. Para datos críticos, conservar la copia original sin modificar y comprobar el historial después de la operación.

## 7. Importación de mediciones no es restauración

CardioSync también dispone de **Importar mediciones**, con opciones para seleccionar CSV o una base SQLite compatible con un esquema de origen específico.

| Operación | Resultado |
|---|---|
| Restaurar copia CardioSync | Reemplaza la base local completa por la copia validada. |
| Importar CSV | Valida, normaliza y agrega mediciones compatibles al historial existente. |
| Importar base SQLite externa | Lee la tabla de mediciones esperada por el adaptador y agrega las mediciones válidas al historial existente. |

La importación muestra una vista previa con filas totales, registros válidos, duplicados, errores y registros sin frecuencia cardíaca. Se excluyen duplicados detectados dentro del archivo y también registros que ya existen en CardioSync. La importación no es un método para restaurar perfiles o todas las tablas de una base externa.

### CSV admitido por el importador actual

El parser espera encabezados exactos: `Fecha`, `Sistólica`, `Diastólica`, `Pulso`, `Sitio`, `Posición` y `Nota`. La fecha debe poder normalizarse desde el formato de fecha y hora que espera el servicio. Valores fuera de los rangos definidos por el validador, fechas no reconocidas y valores de brazo o posición desconocidos se marcan como errores.

### Base SQLite externa

El adaptador de base externa busca una tabla `tranx` con las columnas `sys`, `dia`, `pulse`, `siteId`, `positionID`, `note`, `tranxDate` y `tranxTime`. No es un importador genérico de cualquier archivo SQLite ni de cualquier aplicación.

## 8. Recomendaciones para proteger los datos

- Crear una copia antes de restaurar, borrar datos o probar una migración.
- Mantener al menos una copia independiente del dispositivo.
- No asumir que una programación equivale a una copia exitosa.
- Comprobar la fecha, el tamaño y la ubicación del archivo manual.
- Después de restaurar, revisar varias mediciones antiguas y recientes, el perfil y las pantallas principales.
- Proteger los archivos de copia: pueden contener información personal y de salud.
- No compartir archivos de base de datos en canales públicos.

## 9. Referencias de implementación

Servicios principales:
- `src/features/backup/services/SQLiteBackupService.ts`
- `src/features/backup/services/ManualBackupService.ts`
- `src/features/backup/services/GoogleDriveService.ts`
- `src/features/backup/services/CardioSyncRestoreService.ts`
- `src/features/backup/services/ScheduledBackupService.ts`
- `src/features/backup/services/BackupSettingsService.ts`
- `src/features/backup/services/BackupExecutionCoordinator.ts`
- `src/features/import/parsers/CsvImportParser.ts`
- `src/features/import/parsers/DbImportParser.ts`
- `src/features/import/services/ImportPersistenceService.ts`

Documentación relacionada:
- [Guía de uso](15_USER_GUIDE.md)
- [Base de datos e importación](09_DATABASE.md)
- [Índice de documentación](README.md)

## Alcance y validación pendiente

Esta guía se redactó contrastando la interfaz y los servicios de la rama de referencia. No se ejecutaron restauraciones, copias programadas ni pruebas de Google Drive en un dispositivo durante esta revisión. Antes de distribuir una versión, validar con datos de prueba: copia manual, cancelación de permisos, subida a Drive, fallo de red, restauración de una copia válida, rechazo de un archivo inválido y comprobación posterior de los datos.
