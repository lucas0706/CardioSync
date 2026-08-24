import * as FileSystem from 'expo-file-system/legacy'
import * as SQLite from 'expo-sqlite'

import { database } from '@/core/database/database'

const TEMP_BACKUP_DATABASE_NAME =
  'cardiosync_backup_temp.db'

const BACKUP_MIME_TYPE =
  'application/octet-stream'

type IntegrityRow = {
  integrity_check: string
}

type CountRow = {
  count: number
}

export type SQLiteBackupResult = {
  databaseName: string
  databaseUri: string
  sizeBytes: number
  integrityCheck: string
  measurementCount: number
}

function getTemporaryDatabaseUri(): string {
  const documentDirectory =
    FileSystem.documentDirectory

  if (!documentDirectory) {
    throw new Error(
      'No se pudo determinar el directorio de documentos de CardioSync.',
    )
  }

  return (
    documentDirectory +
    'SQLite/' +
    TEMP_BACKUP_DATABASE_NAME
  )
}

async function removeExistingTemporaryBackup(): Promise<void> {
  const databaseUri =
    getTemporaryDatabaseUri()

  const info =
    await FileSystem.getInfoAsync(
      databaseUri,
    )

  if (info.exists) {
    await FileSystem.deleteAsync(
      databaseUri,
      {
        idempotent: true,
      },
    )
  }
}

export async function createSQLiteBackup(): Promise<SQLiteBackupResult> {
  await removeExistingTemporaryBackup()

  const backup =
    await SQLite.openDatabaseAsync(
      TEMP_BACKUP_DATABASE_NAME,
    )

  try {
    await SQLite.backupDatabaseAsync({
      sourceDatabase: database,
      sourceDatabaseName: 'main',
      destDatabase: backup,
      destDatabaseName: 'main',
    })

    const integrity =
      await backup.getFirstAsync<IntegrityRow>(
        'PRAGMA integrity_check',
      )

    if (
      integrity?.integrity_check !== 'ok'
    ) {
      throw new Error(
        `La copia SQLite no superó la validación de integridad: ${
          integrity?.integrity_check ??
          'sin resultado'
        }.`,
      )
    }

    const count =
      await backup.getFirstAsync<CountRow>(`
        SELECT COUNT(*) AS count
        FROM blood_pressure_records
      `)

    const databaseUri =
      getTemporaryDatabaseUri()

    const info =
      await FileSystem.getInfoAsync(
        databaseUri,
      )

    if (!info.exists) {
      throw new Error(
        'La copia SQLite fue creada pero no se encontró el archivo resultante.',
      )
    }

    return {
      databaseName:
        TEMP_BACKUP_DATABASE_NAME,
      databaseUri,
      sizeBytes:
        info.size ?? 0,
      integrityCheck:
        integrity.integrity_check,
      measurementCount:
        count?.count ?? 0,
    }
  } finally {
    await backup.closeAsync()
  }
}

export async function deleteTemporarySQLiteBackup(): Promise<void> {
  await removeExistingTemporaryBackup()
}

export function getBackupMimeType(): string {
  return BACKUP_MIME_TYPE
}
