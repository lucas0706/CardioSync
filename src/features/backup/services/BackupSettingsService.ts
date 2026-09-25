import { database } from '@/core/database/database'

export type BackupFrequency =
  | 'daily'
  | 'weekly'

export type BackupLastStatus =
  | 'success'
  | 'error'
  | null

export type BackupSettings = {
  enabled: boolean
  frequency: BackupFrequency
  weekday: number
  times: string[]
  lastRunAt: string | null
  lastStatus: BackupLastStatus
  lastError: string | null
  updatedAt: string
}

type BackupSettingsRow = {
  enabled: number
  frequency: string
  weekday: number | null
  time1: string | null
  time2: string | null
  time3: string | null
  lastRunAt: string | null
  lastStatus: string | null
  lastError: string | null
  updatedAt: string
}

const SETTINGS_ID = 1

const DEFAULT_TIME = '03:00'

function normalizeTimes(
  times: string[],
): string[] {
  return Array.from(
    new Set(
      times
        .filter(
          (time): time is string =>
            typeof time === 'string' &&
            /^\d{2}:\d{2}$/.test(time),
        )
        .slice(0, 3),
    ),
  ).sort()
}

function rowToSettings(
  row: BackupSettingsRow,
): BackupSettings {
  const frequency: BackupFrequency =
    row.frequency === 'weekly'
      ? 'weekly'
      : 'daily'

  const weekday =
    typeof row.weekday === 'number' &&
    row.weekday >= 0 &&
    row.weekday <= 6
      ? row.weekday
      : 1

  const times = normalizeTimes([
    row.time1 ?? '',
    row.time2 ?? '',
    row.time3 ?? '',
  ])

  const finalTimes =
    times.length > 0
      ? times
      : [DEFAULT_TIME]

  const lastStatus: BackupLastStatus =
    row.lastStatus === 'success' ||
    row.lastStatus === 'error'
      ? row.lastStatus
      : null

  return {
    enabled: row.enabled === 1,
    frequency,
    weekday,
    times: finalTimes,
    lastRunAt: row.lastRunAt,
    lastStatus,
    lastError: row.lastError,
    updatedAt: row.updatedAt,
  }
}

function getDefaultSettings(): BackupSettings {
  return {
    enabled: false,
    frequency: 'daily',
    weekday: 1,
    times: [DEFAULT_TIME],
    lastRunAt: null,
    lastStatus: null,
    lastError: null,
    updatedAt: new Date().toISOString(),
  }
}

function ensureSettingsRow(): void {
  const existing =
    database.getFirstSync<BackupSettingsRow>(
      `
        SELECT
          enabled,
          frequency,
          weekday,
          time1,
          time2,
          time3,
          lastRunAt,
          lastStatus,
          lastError,
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

  const defaults =
    getDefaultSettings()

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
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    SETTINGS_ID,
    defaults.enabled ? 1 : 0,
    defaults.frequency,
    defaults.weekday,
    defaults.times[0] ?? null,
    defaults.times[1] ?? null,
    defaults.times[2] ?? null,
    defaults.lastRunAt,
    defaults.lastStatus,
    defaults.lastError,
    defaults.updatedAt,
  )
}

export function getBackupSettings(): BackupSettings {
  ensureSettingsRow()

  const row =
    database.getFirstSync<BackupSettingsRow>(
      `
        SELECT
          enabled,
          frequency,
          weekday,
          time1,
          time2,
          time3,
          lastRunAt,
          lastStatus,
          lastError,
          updatedAt
        FROM backup_settings
        WHERE id = ?
        LIMIT 1
      `,
      SETTINGS_ID,
    )

  if (!row) {
    throw new Error(
      'No se pudo obtener la configuración de copias programadas.',
    )
  }

  return rowToSettings(row)
}

export function updateBackupSettings(
  settings: Partial<
    Pick<
      BackupSettings,
      'enabled' |
      'frequency' |
      'weekday' |
      'times'
    >
  >,
): BackupSettings {
  const current =
    getBackupSettings()

  const next: BackupSettings = {
    ...current,
    ...settings,
    times: normalizeTimes(
      settings.times ?? current.times,
    ),
    updatedAt:
      new Date().toISOString(),
  }

  if (next.times.length === 0) {
    next.times = [DEFAULT_TIME]
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
    next.times[0] ?? null,
    next.times[1] ?? null,
    next.times[2] ?? null,
    next.updatedAt,
    SETTINGS_ID,
  )

  return getBackupSettings()
}

export function recordBackupSuccess(
  executedAt: string =
    new Date().toISOString(),
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
    'success',
    null,
    new Date().toISOString(),
    SETTINGS_ID,
  )

  return getBackupSettings()
}

export function recordBackupError(
  error: string,
  executedAt: string =
    new Date().toISOString(),
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
