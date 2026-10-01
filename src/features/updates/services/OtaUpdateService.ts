import { File, Paths } from 'expo-file-system'
import * as Updates from 'expo-updates'

type OtaState = {
  lastShownUpdateId: string
}

const OTA_STATE_FILE = new File(
  Paths.document,
  'ota-state.json',
)

class OtaUpdateService {
  async shouldShowUpdateBanner(): Promise<boolean> {
    const currentUpdateId =
      Updates.updateId

    if (!currentUpdateId) {
      return false
    }

    const previousUpdateId =
      await this.getLastShownUpdateId()

    if (
      previousUpdateId ===
      currentUpdateId
    ) {
      return false
    }

    await this.saveLastShownUpdateId(
      currentUpdateId,
    )

    return true
  }

  private async getLastShownUpdateId(): Promise<string | null> {
    try {
      if (!OTA_STATE_FILE.exists) {
        return null
      }

      const content =
        await OTA_STATE_FILE.text()

      const state =
        JSON.parse(content) as OtaState

      return (
        state.lastShownUpdateId ??
        null
      )
    } catch {
      return null
    }
  }

  private async saveLastShownUpdateId(
    updateId: string,
  ): Promise<void> {
    const state: OtaState = {
      lastShownUpdateId: updateId,
    }

    OTA_STATE_FILE.write(
      JSON.stringify(state),
    )
  }
}

export const otaUpdateService =
  new OtaUpdateService()
