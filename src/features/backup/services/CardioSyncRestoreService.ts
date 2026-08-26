import * as FileSystem from 'expo-file-system/legacy'
import * as SQLite from 'expo-sqlite'

import { database } from '@/core/database/database'

const CARDIOSYNC_DATABASE_NAME =
  'cardiosync.db'

const TEMP_RESTORE_DATABASE_NAME =
  'cardiosync_restore_temp.db'

type TableRow = {
  name: string
}

type IntegrityRow = {
  integrity_check: string
}

type CountRow = {
  count: number
}

export type CardioSyncRestoreValidation = {
  valid: boolean
  measurementCount: number
  hasBloodPressureRecords: boolean
  hasClinicalProfile: boolean
  integrityCheck: string
  error?: string
}

export type CardioSyncRestoreResult = {
  measurementCount: number
}

function getDatabaseDirectory(): string {
  const directory =
    FileSystem.documentDirectory

  if (!directory) {
    throw new Error(
      'No se pudo determinar el directorio de documentos de CardioSync.',
    )
  }

  return `${directory}SQLite/`
}

function getTemporaryRestoreUri(): string {
  return (
    getDatabaseDirectory() +
    TEMP_RESTORE_DATABASE_NAME
  )
}

async function deleteTemporaryRestoreDatabase(): Promise<void> {
  const uri =
    getTemporaryRestoreUri()

  const info =
    await FileSystem.getInfoAsync(uri)

  if (info.exists) {
    await FileSystem.deleteAsync(uri, {
      idempotent: true,
    })
  }
}

async function copySourceToTemporaryDatabase(
  sourceUri: string,
): Promise<void> {
  await deleteTemporaryRestoreDatabase()

  const destinationUri =
    getTemporaryRestoreUri()

  await FileSystem.copyAsync({
    from: sourceUri,
    to: destinationUri,
  })
}

async function validateDatabaseStructure(
  restoreDatabase: SQLite.SQLiteDatabase,
): Promise<{
  hasBloodPressureRecords: boolean
  hasClinicalProfile: boolean
}> {
  const tables =
    await restoreDatabase.getAllAsync<TableRow>(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
    `)

  const tableNames =
    new Set(
      tables.map(
        (table) => table.name,
      ),
    )

  return {
    hasBloodPressureRecords:
      tableNames.has(
        'blood_pressure_records',
      ),
    hasClinicalProfile:
      tableNames.has(
        'clinical_profile',
      ),
  }
}

async function validateTemporaryDatabase(): Promise<
  CardioSyncRestoreValidation
> {
  const restoreDatabase =
    await SQLite.openDatabaseAsync(
      TEMP_RESTORE_DATABASE_NAME,
    )

  try {
    const integrity =
      await restoreDatabase.getFirstAsync<IntegrityRow>(
        'PRAGMA integrity_check',
      )

    const integrityCheck =
      integrity?.integrity_check ?? ''

    const structure =
      await validateDatabaseStructure(
        restoreDatabase,
      )

    if (integrityCheck !== 'ok') {
      return {
        valid: false,
        measurementCount: 0,
        ...structure,
        integrityCheck,
        error:
          'La copia SQLite no superó la validación de integridad.',
      }
    }

    if (
      !structure.hasBloodPressureRecords
    ) {
      return {
        valid: false,
        measurementCount: 0,
        ...structure,
        integrityCheck,
        error:
          'El archivo seleccionado no contiene la tabla de mediciones de CardioSync.',
      }
    }

    if (!structure.hasClinicalProfile) {
      return {
        valid: false,
        measurementCount: 0,
        ...structure,
        integrityCheck,
        error:
          'El archivo seleccionado no contiene la estructura completa de CardioSync.',
      }
    }

    const count =
      await restoreDatabase.getFirstAsync<CountRow>(`
        SELECT COUNT(*) AS count
        FROM blood_pressure_records
      `)

    return {
      valid: true,
      measurementCount:
        count?.count ?? 0,
      ...structure,
      integrityCheck,
    }
  } finally {
    await restoreDatabase.closeAsync()
  }
}

export async function validateCardioSyncBackup(
  sourceUri: string,
): Promise<CardioSyncRestoreValidation> {
  try {
    await copySourceToTemporaryDatabase(
      sourceUri,
    )

    return await validateTemporaryDatabase()
  } catch (error) {
    return {
      valid: false,
      measurementCount: 0,
      hasBloodPressureRecords: false,
      hasClinicalProfile: false,
      integrityCheck: '',
      error:
        error instanceof Error
          ? error.message
          : 'No se pudo validar la copia de seguridad.',
    }
  } finally {
    await deleteTemporaryRestoreDatabase()
  }
}

export async function restoreCardioSyncBackup(
  sourceUri: string,
): Promise<CardioSyncRestoreResult> {
  await copySourceToTemporaryDatabase(
    sourceUri,
  )

  try {
    const validation =
      await validateTemporaryDatabase()

    if (!validation.valid) {
      throw new Error(
        validation.error ??
          'La copia de seguridad no es válida.',
      )
    }

    /*
     * La conexión global de CardioSync apunta a
     * cardiosync.db. La cerramos antes de sustituir
     * físicamente el archivo.
     */
    database.closeSync()

    await SQLite.deleteDatabaseAsync(
      CARDIOSYNC_DATABASE_NAME,
    )

    const destinationUri =
      getDatabaseDirectory() +
      CARDIOSYNC_DATABASE_NAME

    await FileSystem.moveAsync({
      from: getTemporaryRestoreUri(),
      to: destinationUri,
    })

    return {
      measurementCount:
        validation.measurementCount,
    }
  } catch (error) {
    /*
     * Si el archivo temporal todavía existe,
     * queda disponible para limpieza.
     *
     * No intentamos reabrir la base global aquí:
     * el proceso de restauración debe terminar
     * con un reinicio de la aplicación.
     */
    throw new Error(
      error instanceof Error
        ? error.message
        : 'No se pudo restaurar la copia de seguridad.',
    )
  }
}

export function getCardioSyncDatabaseName(): string {
  return CARDIOSYNC_DATABASE_NAME
}
