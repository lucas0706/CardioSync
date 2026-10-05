import { database } from '@/core/database/database'

export type BackupFrequency = 'daily' | 'weekly'

export type BackupLastStatus = 'success' | 'error' | null

export type BackupSettings = {
  enabled: boolean
  frequency: BackupFrequency
  weekday: number
  time: string
  lastRunAt: string | null
  lastStatus: BackupLastStatus
  lastError: string | null
  lastSchedulerWakeAt: string | null
  updatedAt: string
}

type BackupSettingsRow = {
  enabled: number
  frequency: string
  weekday: number | null
  time1: string | null
  lastRunAt: string | null
  lastStatus: string | null
  lastError: string | null
  lastSchedulerWakeAt: string | null
  updatedAt: string
}

const SETTINGS_ID = 1

const DEFAULT_TIME = '03:00'

export function isValidBackupTime(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false
  }

  const match = /^(\d{2}):(\d{2})$/.exec(value)

  if (!match) {
    return false
  }

  const hour = Number(match[1])
  const minute = Number(match[2])

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59
}

function rowToSettings(row: BackupSettingsRow): BackupSettings {
  const frequency: BackupFrequency = row.frequency === 'weekly' ? 'weekly' : 'daily'

  const weekday =
    typeof row.weekday === 'number' && row.weekday >= 0 && row.weekday <= 6 ? row.weekday : 1

  const lastStatus: BackupLastStatus =
    row.lastStatus === 'success' || row.lastStatus === 'error' ? row.lastStatus : null

  return {
    enabled: row.enabled === 1,
    frequency,
    weekday,
    time: isValidBackupTime(row.time1) ? row.time1 : DEFAULT_TIME,
    lastRunAt: row.lastRunAt,
    lastStatus,
    lastError: row.lastError,
    lastSchedulerWakeAt: row.lastSchedulerWakeAt,
    updatedAt: row.updatedAt,
  }
}

function getDefaultSettings(): BackupSettings {
  return {
    enabled: false,
    frequency: 'daily',
    weekday: 1,
    time: DEFAULT_TIME,
    lastRunAt: null,
    lastStatus: null,
    lastError: null,
    lastSchedulerWakeAt: null,
    updatedAt: new Date().toISOString(),
  }
}

function ensureSettingsRow(): void {
  const existing = database.getFirstSync<BackupSettingsRow>(
    `
        SELECT
          enabled,
          frequency,
          weekday,
          time1,
          lastRunAt,
          lastStatus,
          lastError,
          lastSchedulerWakeAt,
          updatedAt
        FROM backup_settings
        WHERE id = ?
        LIMIT 1
      `,
    SETTINGS_ID,
  )

  if (existing) {
    return
  }

  const defaults = getDefaultSettings()

  database.runSync(
    `
      INSERT INTO backup_settings (
        id,
        enabled,
        frequency,
        weekday,
        time1,
        time2,
        time3,
        lastRunAt,
        lastStatus,
        lastError,
        lastSchedulerWakeAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    SETTINGS_ID,
    defaults.enabled ? 1 : 0,
    defaults.frequency,
    defaults.weekday,
    defaults.time,
    null,
    null,
    defaults.lastRunAt,
    defaults.lastStatus,
    defaults.lastError,
    defaults.lastSchedulerWakeAt,
    defaults.updatedAt,
  )
}

export function getBackupSettings(): BackupSettings {
  ensureSettingsRow()

  const row = database.getFirstSync<BackupSettingsRow>(
    `
        SELECT
          enabled,
          frequency,
          weekday,
          time1,
          lastRunAt,
          lastStatus,
          lastError,
          lastSchedulerWakeAt,
          updatedAt
        FROM backup_settings
        WHERE id = ?
        LIMIT 1
      `,
    SETTINGS_ID,
  )

  if (!row) {
    throw new Error('No se pudo obtener la configuración de copias programadas.')
  }

  return rowToSettings(row)
}

export function updateBackupSettings(
  settings: Partial<Pick<BackupSettings, 'enabled' | 'frequency' | 'weekday' | 'time'>>,
): BackupSettings {
  const current = getBackupSettings()

  const time = settings.time ?? current.time

  if (!isValidBackupTime(time)) {
    throw new Error('El horario de la copia debe tener formato HH:mm y ser válido.')
  }

  const next: BackupSettings = {
    ...current,
    ...settings,
    time,
    updatedAt: new Date().toISOString(),
  }

  database.runSync(
    `
      UPDATE backup_settings
      SET
        enabled = ?,
        frequency = ?,
        weekday = ?,
        time1 = ?,
        time2 = ?,
        time3 = ?,
        updatedAt = ?
      WHERE id = ?
    `,
    next.enabled ? 1 : 0,
    next.frequency,
    next.weekday,
    next.time,
    null,
    null,
    next.updatedAt,
    SETTINGS_ID,
  )

  return getBackupSettings()
}

export function recordBackupSuccess(executedAt: string = new Date().toISOString()): BackupSettings {
  ensureSettingsRow()

  database.runSync(
    `
      UPDATE backup_settings
      SET
        lastRunAt = ?,
        lastStatus = ?,
        lastError = ?,
        updatedAt = ?
      WHERE id = ?
    `,
    executedAt,
    'success',
    null,
    new Date().toISOString(),
    SETTINGS_ID,
  )

  return getBackupSettings()
}

export function recordBackupError(
  error: string,
  executedAt: string = new Date().toISOString(),
): BackupSettings {
  ensureSettingsRow()

  database.runSync(
    `
      UPDATE backup_settings
      SET
        lastRunAt = ?,
        lastStatus = ?,
        lastError = ?,
        updatedAt = ?
      WHERE id = ?
    `,
    executedAt,
    'error',
    error,
    new Date().toISOString(),
    SETTINGS_ID,
  )

  return getBackupSettings()
}

export function resetBackupExecutionStatus(): BackupSettings {
  ensureSettingsRow()

  database.runSync(
    `
      UPDATE backup_settings
      SET
        lastRunAt = ?,
        lastStatus = ?,
        lastError = ?,
        updatedAt = ?
      WHERE id = ?
    `,
    null,
    null,
    null,
    new Date().toISOString(),
    SETTINGS_ID,
  )

  return getBackupSettings()
}

export function recordSchedulerWake(executedAt: string = new Date().toISOString()): BackupSettings {
  ensureSettingsRow()

  database.runSync(
    `
      UPDATE backup_settings
      SET
        lastSchedulerWakeAt = ?,
        updatedAt = ?
      WHERE id = ?
    `,
    executedAt,
    new Date().toISOString(),
    SETTINGS_ID,
  )

  return getBackupSettings()
}
