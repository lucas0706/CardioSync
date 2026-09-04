import { database } from '@/core/database/database'

export type HealthConnectSettings = {
  enabled: boolean
  connectedAt: string | null
  updatedAt: string
}

type HealthConnectSettingsRow = {
  enabled: number
  connectedAt: string | null
  updatedAt: string
}

const SETTINGS_ID = 1

function ensureSettingsRow(): void {
  const existing =
    database.getFirstSync<HealthConnectSettingsRow>(
      `
        SELECT
          enabled,
          connectedAt,
          updatedAt
        FROM health_connect_settings
        WHERE id = ?
        LIMIT 1
      `,
      SETTINGS_ID,
    )

  if (existing) {
    return
  }

  database.runSync(
    `
      INSERT INTO health_connect_settings (
        id,
        enabled,
        connectedAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?)
    `,
    SETTINGS_ID,
    0,
    null,
    new Date().toISOString(),
  )
}

export function getHealthConnectSettings():
  HealthConnectSettings {
  ensureSettingsRow()

  const row =
    database.getFirstSync<HealthConnectSettingsRow>(
      `
        SELECT
          enabled,
          connectedAt,
          updatedAt
        FROM health_connect_settings
        WHERE id = ?
        LIMIT 1
      `,
      SETTINGS_ID,
    )

  if (!row) {
    throw new Error(
      'No se pudo obtener la configuración de Health Connect.',
    )
  }

  return {
    enabled: row.enabled === 1,
    connectedAt: row.connectedAt,
    updatedAt: row.updatedAt,
  }
}

export function setHealthConnectEnabled(
  enabled: boolean,
): HealthConnectSettings {
  ensureSettingsRow()

  database.runSync(
    `
      UPDATE health_connect_settings
      SET
        enabled = ?,
        connectedAt = ?,
        updatedAt = ?
      WHERE id = ?
    `,
    enabled ? 1 : 0,
    enabled
      ? new Date().toISOString()
      : null,
    new Date().toISOString(),
    SETTINGS_ID,
  )

  return getHealthConnectSettings()
}
