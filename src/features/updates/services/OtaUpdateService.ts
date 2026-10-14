import { File, Paths } from 'expo-file-system'
import * as Updates from 'expo-updates'

import { getOtaPreferences } from './OtaPreferencesService'

type OtaState = {
  lastShownUpdateId: string
}

type AutomaticOtaResult = 'disabled' | 'unavailable' | 'none' | 'downloaded'

const OTA_STATE_FILE = new File(Paths.document, 'ota-state.json')

class OtaUpdateService {
  private automaticCheck?: Promise<AutomaticOtaResult>

  checkAndDownloadIfEnabled(): Promise<AutomaticOtaResult> {
    if (this.automaticCheck) {
      return this.automaticCheck
    }

    this.automaticCheck = this.runAutomaticCheck().finally(() => {
      this.automaticCheck = undefined
    })

    return this.automaticCheck
  }

  private async runAutomaticCheck(): Promise<AutomaticOtaResult> {
    const preferences = getOtaPreferences()

    if (!preferences.automaticOtaEnabled) {
      return 'disabled'
    }

    if (!Updates.isEnabled || __DEV__) {
      return 'unavailable'
    }

    const check = await Updates.checkForUpdateAsync()

    if (!check.isAvailable || check.isRollBackToEmbedded) {
      return 'none'
    }

    if (!getOtaPreferences().automaticOtaEnabled) {
      return 'disabled'
    }

    const download = await Updates.fetchUpdateAsync()

    return download.isNew && !download.isRollBackToEmbedded ? 'downloaded' : 'none'
  }

  async applyDownloadedUpdate(): Promise<void> {
    if (!Updates.isEnabled || __DEV__) {
      throw new Error('Las actualizaciones OTA no están disponibles en este entorno.')
    }

    await Updates.reloadAsync()
  }

  async shouldShowUpdateBanner(): Promise<boolean> {
    const currentUpdateId = Updates.updateId

    if (!currentUpdateId) {
      return false
    }

    const previousUpdateId = await this.getLastShownUpdateId()

    if (previousUpdateId === currentUpdateId) {
      return false
    }

    await this.saveLastShownUpdateId(currentUpdateId)

    return true
  }

  private async getLastShownUpdateId(): Promise<string | null> {
    try {
      if (!OTA_STATE_FILE.exists) {
        return null
      }

      const content = await OTA_STATE_FILE.text()

      const state = JSON.parse(content) as OtaState

      return state.lastShownUpdateId ?? null
    } catch {
      return null
    }
  }

  private async saveLastShownUpdateId(updateId: string): Promise<void> {
    const state: OtaState = {
      lastShownUpdateId: updateId,
    }

    OTA_STATE_FILE.write(JSON.stringify(state))
  }
}

export const otaUpdateService = new OtaUpdateService()
