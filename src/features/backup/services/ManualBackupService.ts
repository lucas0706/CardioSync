import * as FileSystem from 'expo-file-system/legacy'

import {
  createSQLiteBackup,
  deleteTemporarySQLiteBackup,
} from './SQLiteBackupService'

const BACKUP_MIME_TYPE =
  'application/octet-stream'

export type ManualBackupResult = {
  fileName: string
  destinationUri: string
  sizeBytes: number
  measurementCount: number
}

function createBackupFileName(): string {
  const now = new Date()

  const year =
    now.getFullYear()

  const month =
    String(now.getMonth() + 1).padStart(
      2,
      '0',
    )

  const day =
    String(now.getDate()).padStart(
      2,
      '0',
    )

  const hour =
    String(now.getHours()).padStart(
      2,
      '0',
    )

  const minute =
    String(now.getMinutes()).padStart(
      2,
      '0',
    )

  const second =
    String(now.getSeconds()).padStart(
      2,
      '0',
    )

  return `CardioSync_backup_${year}-${month}-${day}_${hour}-${minute}-${second}.db`
}

async function writeBackupToAndroidDocument(
  sourceUri: string,
  destinationUri: string,
): Promise<void> {
  const base64 =
    await FileSystem.readAsStringAsync(
      sourceUri,
      {
        encoding:
          FileSystem.EncodingType.Base64,
      },
    )

  await FileSystem.writeAsStringAsync(
    destinationUri,
    base64,
    {
      encoding:
        FileSystem.EncodingType.Base64,
    },
  )
}

async function selectBackupDirectory(): Promise<string | null> {
  const initialDirectoryUri =
    FileSystem.StorageAccessFramework.getUriForDirectoryInRoot(
      'Download',
    )

  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
      initialDirectoryUri,
    )

  if (!permissions.granted) {
    return null
  }

  return permissions.directoryUri
}

async function createBackupFile(
  directoryUri: string,
  fileName: string,
): Promise<string> {
  return FileSystem.StorageAccessFramework.createFileAsync(
    directoryUri,
    fileName,
    BACKUP_MIME_TYPE,
  )
}

export async function saveManualSQLiteBackup(): Promise<
  ManualBackupResult | null
> {
  const backup =
    await createSQLiteBackup()

  const fileName =
    createBackupFileName()

  try {
    const directoryUri =
      await selectBackupDirectory()

    if (!directoryUri) {
      return null
    }

    const destinationUri =
      await createBackupFile(
        directoryUri,
        fileName,
      )

    await writeBackupToAndroidDocument(
      backup.databaseUri,
      destinationUri,
    )

    return {
      fileName,
      destinationUri,
      sizeBytes:
        backup.sizeBytes,
      measurementCount:
        backup.measurementCount,
    }
  } finally {
    await deleteTemporarySQLiteBackup()
  }
}
