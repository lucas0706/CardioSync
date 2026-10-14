import { database } from '@/core/database/database'

export type OtaPreferences = {
  automaticOtaEnabled: boolean
}

type OtaPreferencesRow = {
  automaticOtaEnabled: number
}

const SETTINGS_ID = 1

function ensureSettingsRow(): void {
  database.runSync(
    `
      INSERT OR IGNORE INTO app_update_settings (
        id,
        automaticOtaEnabled,
        updatedAt
      )
      VALUES (?, ?, ?)
    `,
    SETTINGS_ID,
    1,
    new Date().toISOString(),
  )
}

export function getOtaPreferences(): OtaPreferences {
  ensureSettingsRow()

  const row = database.getFirstSync<OtaPreferencesRow>(
    `
      SELECT automaticOtaEnabled
      FROM app_update_settings
      WHERE id = ?
      LIMIT 1
    `,
    SETTINGS_ID,
  )

  if (!row || (row.automaticOtaEnabled !== 0 && row.automaticOtaEnabled !== 1)) {
    throw new Error('No se pudo leer la preferencia de actualizaciones OTA.')
  }

  return {
    automaticOtaEnabled: row.automaticOtaEnabled === 1,
  }
}

export function setAutomaticOtaEnabled(enabled: boolean): OtaPreferences {
  ensureSettingsRow()

  database.runSync(
    `
      UPDATE app_update_settings
      SET automaticOtaEnabled = ?, updatedAt = ?
      WHERE id = ?
    `,
    enabled ? 1 : 0,
    new Date().toISOString(),
    SETTINGS_ID,
  )

  return getOtaPreferences()
}
