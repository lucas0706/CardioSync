import {
  heartRateSyncService,
} from './HeartRateSyncService'

import {
  stepsSyncService,
} from './StepsSyncService'

import {
  sleepSyncService,
} from './SleepSyncService'

export class HealthConnectCoordinator {
  async syncHeartRate() {
    return heartRateSyncService
      .readLast30Days()
  }

  async syncSteps() {
    return stepsSyncService
      .readLast30Days()
  }

  async syncSleep() {
    return sleepSyncService
      .readLast30Days()
  }

  async syncAll() {
    const [
      heartRate,
      steps,
      sleep,
    ] = await Promise.all([
      this.syncHeartRate(),
      this.syncSteps(),
      this.syncSleep(),
    ])

    return {
      heartRate,
      steps,
      sleep,
    }
  }
}

export const
  healthConnectCoordinator =
    new HealthConnectCoordinator()
