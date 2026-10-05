import { syncBackupAlarms } from './AlarmScheduler'
import { executeBackup } from './BackupExecutionCoordinator'
import {
  getBackupSettings,
  isValidBackupTime,
  recordSchedulerWake,
  type BackupSettings,
} from './BackupSettingsService'

const SCHEDULE_WINDOW_MINUTES = 30

type DueSchedule = {
  scheduledAt: Date
}

function parseTime(value: string): {
  hour: number
  minute: number
} | null {
  if (!isValidBackupTime(value)) {
    return null
  }

  const [hour, minute] = value.split(':').map(Number)

  return {
    hour,
    minute,
  }
}

function createScheduleDate(date: Date, time: string): Date | null {
  const parsed = parseTime(time)

  if (!parsed) {
    return null
  }

  const scheduledAt = new Date(date)

  scheduledAt.setHours(parsed.hour, parsed.minute, 0, 0)

  return scheduledAt
}

function isScheduledDay(date: Date, settings: BackupSettings): boolean {
  return settings.frequency === 'daily' || date.getDay() === settings.weekday
}

function getRecentCandidateSchedules(now: Date, settings: BackupSettings): DueSchedule[] {
  const candidates: DueSchedule[] = []

  for (const offsetDays of [0, 1]) {
    const date = new Date(now)
    date.setDate(date.getDate() - offsetDays)

    if (!isScheduledDay(date, settings)) {
      continue
    }

    const scheduledAt = createScheduleDate(date, settings.time)

    if (!scheduledAt) {
      continue
    }

    const ageMinutes = (now.getTime() - scheduledAt.getTime()) / 60000

    if (ageMinutes >= 0 && ageMinutes <= SCHEDULE_WINDOW_MINUTES) {
      candidates.push({
        scheduledAt,
      })
    }
  }

  return candidates.sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime())
}

function getAlarmCandidateSchedule(
  now: Date,
  settings: BackupSettings,
  scheduledAtTimestamp: number,
): DueSchedule | null {
  if (!Number.isFinite(scheduledAtTimestamp) || scheduledAtTimestamp > now.getTime()) {
    return null
  }

  const scheduledAt = new Date(scheduledAtTimestamp)

  if (!isScheduledDay(scheduledAt, settings)) {
    return null
  }

  const configuredAt = createScheduleDate(scheduledAt, settings.time)

  const matchesConfiguredTime = configuredAt?.getTime() === scheduledAtTimestamp

  return matchesConfiguredTime
    ? {
        scheduledAt,
      }
    : null
}

function isAlreadyProcessed(settings: BackupSettings, candidate: DueSchedule): boolean {
  if (!settings.lastRunAt) {
    return false
  }

  const lastRunAt = new Date(settings.lastRunAt)

  if (Number.isNaN(lastRunAt.getTime())) {
    return false
  }

  return lastRunAt.getTime() >= candidate.scheduledAt.getTime()
}

function findDueSchedule(
  now: Date,
  settings: BackupSettings,
  scheduledAtTimestamp?: number,
): DueSchedule | null {
  const candidate =
    scheduledAtTimestamp === undefined
      ? (getRecentCandidateSchedules(now, settings)[0] ?? null)
      : getAlarmCandidateSchedule(now, settings, scheduledAtTimestamp)

  if (!candidate || isAlreadyProcessed(settings, candidate)) {
    return null
  }

  return candidate
}

export async function executeScheduledBackup(scheduledAtTimestamp?: number): Promise<boolean> {
  const settings = getBackupSettings()

  if (!settings.enabled) {
    return false
  }

  const dueSchedule = findDueSchedule(new Date(), settings, scheduledAtTimestamp)

  if (!dueSchedule) {
    return false
  }

  try {
    await executeBackup()
    return true
  } catch {
    return false
  }
}

export async function runPendingBackupCheck(scheduledAtTimestamp?: number): Promise<boolean> {
  try {
    return await executeScheduledBackup(scheduledAtTimestamp)
  } catch (error) {
    console.error('Scheduled backup check failed.', error)
    return false
  }
}

export async function runHeadlessScheduledBackup(scheduledAtTimestamp?: number): Promise<boolean> {
  recordSchedulerWake(new Date().toISOString())

  return runPendingBackupCheck(scheduledAtTimestamp)
}

export async function syncScheduledBackupAlarms(): Promise<void> {
  await syncBackupAlarms(getBackupSettings())
}

export async function runImmediateBackupTest(): Promise<void> {
  await executeBackup()
}
