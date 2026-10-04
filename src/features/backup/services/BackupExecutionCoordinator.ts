import {
  recordBackupError,
  recordBackupSuccess,
} from './BackupSettingsService'

import {
  showBackupErrorNotification,
  showBackupSuccessNotification,
} from './BackupNotificationService'

import {
  createGoogleDriveBackup,
  type GoogleDriveBackupResult,
} from './GoogleDriveService'

let backupExecutionInProgress = false

function normalizeError(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'No se pudo completar la copia de seguridad.'
}

export function isBackupExecutionInProgress(): boolean {
  return backupExecutionInProgress
}

export async function executeBackup(): Promise<GoogleDriveBackupResult> {
  if (backupExecutionInProgress) {
    throw new Error(
      'Ya hay una copia de seguridad en ejecución.',
    )
  }

  backupExecutionInProgress = true

  const executedAt =
    new Date().toISOString()

  try {
    const result =
      await createGoogleDriveBackup()

    recordBackupSuccess(
      executedAt,
    )

    try {
      await showBackupSuccessNotification(
        result.measurementCount,
      )
    } catch {
      // Ignorar error de notificación
    }

    return result
  } catch (error) {
    const message =
      normalizeError(error)

    recordBackupError(
      message,
      executedAt,
    )

    try {
      await showBackupErrorNotification(
        message,
      )
    } catch {
      // Ignorar error de notificación
    }

    throw error instanceof Error
      ? error
      : new Error(message)
  } finally {
    backupExecutionInProgress = false
  }
}
