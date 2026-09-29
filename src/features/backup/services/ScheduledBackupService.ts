import * as BackgroundTask from 'expo-background-task'
import * as TaskManager from 'expo-task-manager'

import {
  getBackupSettings,
  recordBackupError,
  recordBackupSuccess,
  type BackupSettings,
} from './BackupSettingsService'
import {
  showBackupErrorNotification,
  showBackupSuccessNotification,
} from './BackupNotificationService'
import { createGoogleDriveBackup } from './GoogleDriveService'

export const CARDIOSYNC_BACKUP_TASK =
  'cardiosync-scheduled-backup'

const BACKGROUND_TASK_MINIMUM_INTERVAL_SECONDS =
  15 * 60

const SCHEDULE_WINDOW_MINUTES = 90

let backupExecutionInProgress = false

type DueSchedule = {
  scheduledAt: Date
  time: string
}

function parseTime(
  value: string,
): {
  hour: number
  minute: number
} | null {
  const match =
    /^(\d{2}):(\d{2})$/.exec(value)

  if (!match) {
    return null
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null
  }

  return {
    hour,
    minute,
  }
}

function createScheduleDate(
  date: Date,
  time: string,
): Date | null {
  const parsed =
    parseTime(time)

  if (!parsed) {
    return null
  }

  const scheduledAt =
    new Date(date)

  scheduledAt.setHours(
    parsed.hour,
    parsed.minute,
    0,
    0,
  )

  return scheduledAt
}

function isScheduledDay(
  date: Date,
  settings: BackupSettings,
): boolean {
  if (settings.frequency === 'daily') {
    return true
  }

  return (
    date.getDay() ===
    settings.weekday
  )
}

function getCandidateSchedules(
  now: Date,
  settings: BackupSettings,
): DueSchedule[] {
  const candidates: DueSchedule[] = []

  const today =
    new Date(now)

  if (
    isScheduledDay(
      today,
      settings,
    )
  ) {
    for (const time of settings.times) {
      const scheduledAt =
        createScheduleDate(
          today,
          time,
        )

      if (!scheduledAt) {
        continue
      }

      const ageMinutes =
        (now.getTime() -
          scheduledAt.getTime()) /
        60000

      if (
        ageMinutes >= 0 &&
        ageMinutes <=
          SCHEDULE_WINDOW_MINUTES
      ) {
        candidates.push({
          scheduledAt,
          time,
        })
      }
    }
  }

  const yesterday =
    new Date(now)

  yesterday.setDate(
    yesterday.getDate() - 1,
  )

  if (
    isScheduledDay(
      yesterday,
      settings,
    )
  ) {
    for (const time of settings.times) {
      const scheduledAt =
        createScheduleDate(
          yesterday,
          time,
        )

      if (!scheduledAt) {
        continue
      }

      const ageMinutes =
        (now.getTime() -
          scheduledAt.getTime()) /
        60000

      if (
        ageMinutes >= 0 &&
        ageMinutes <=
          SCHEDULE_WINDOW_MINUTES
      ) {
        candidates.push({
          scheduledAt,
          time,
        })
      }
    }
  }

  return candidates.sort(
    (a, b) =>
      b.scheduledAt.getTime() -
      a.scheduledAt.getTime(),
  )
}

function isAlreadyProcessed(
  settings: BackupSettings,
  candidate: DueSchedule,
): boolean {
  if (!settings.lastRunAt) {
    return false
  }

  const lastRunAt =
    new Date(
      settings.lastRunAt,
    )

  if (
    Number.isNaN(
      lastRunAt.getTime(),
    )
  ) {
    return false
  }

  return (
    lastRunAt.getTime() >=
    candidate.scheduledAt.getTime()
  )
}

function findDueSchedule(
  now: Date,
  settings: BackupSettings,
): DueSchedule | null {
  const candidates =
    getCandidateSchedules(
      now,
      settings,
    )

  /*
   * Priorizamos la ventana más reciente.
   *
   * Esto evita ejecutar varias copias de golpe si
   * Android despierta tarde y encuentra más de una
   * ventana dentro del período de tolerancia.
   */
  const latestCandidate =
    candidates[0]

  if (!latestCandidate) {
    return null
  }

  if (
    isAlreadyProcessed(
      settings,
      latestCandidate,
    )
  ) {
    return null
  }

  return latestCandidate
}

function normalizeError(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message
  }

  if (
    typeof error === 'string'
  ) {
    return error
  }

  return 'No se pudo completar la copia programada.'
}

async function executeScheduledBackup(): Promise<boolean> {
  if (backupExecutionInProgress) {
    return false
  }

  backupExecutionInProgress = true

  const executedAt =
    new Date()

  try {
    const settings =
      getBackupSettings()

    if (!settings.enabled) {
      return false
    }

    const dueSchedule =
      findDueSchedule(
        executedAt,
        settings,
      )

    if (!dueSchedule) {
      return false
    }

    try {
      const result =
        await createGoogleDriveBackup()

      recordBackupSuccess(
        executedAt.toISOString(),
      )

      await showBackupSuccessNotification(
        result.measurementCount,
      )

      return true
    } catch (error) {
      const normalizedError =
        normalizeError(error)

      recordBackupError(
        normalizedError,
        executedAt.toISOString(),
      )

      await showBackupErrorNotification(
        normalizedError,
      )

      return false
    }
  } finally {
    backupExecutionInProgress = false
  }
}

TaskManager.defineTask(
  CARDIOSYNC_BACKUP_TASK,
  async () => {
    const success =
      await executeScheduledBackup()

    return {
      success,
    }
  },
)

export async function registerScheduledBackupTask(): Promise<void> {
  const settings =
    getBackupSettings()

  if (!settings.enabled) {
    await unregisterScheduledBackupTask()
    return
  }

  const isRegistered =
    await TaskManager.isTaskRegisteredAsync(
      CARDIOSYNC_BACKUP_TASK,
    )

  if (isRegistered) {
    return
  }

  await BackgroundTask.registerTaskAsync(
    CARDIOSYNC_BACKUP_TASK,
    {
      minimumInterval:
        BACKGROUND_TASK_MINIMUM_INTERVAL_SECONDS,
    },
  )
}

export async function unregisterScheduledBackupTask(): Promise<void> {
  const isRegistered =
    await TaskManager.isTaskRegisteredAsync(
      CARDIOSYNC_BACKUP_TASK,
    )

  if (!isRegistered) {
    return
  }

  await BackgroundTask.unregisterTaskAsync(
    CARDIOSYNC_BACKUP_TASK,
  )
}

export async function syncScheduledBackupTask(): Promise<void> {
  const settings =
    getBackupSettings()

  if (settings.enabled) {
    await registerScheduledBackupTask()
    return
  }

  await unregisterScheduledBackupTask()
}

export async function runScheduledBackupNowForTesting(): Promise<boolean> {
  return executeScheduledBackup()
}
