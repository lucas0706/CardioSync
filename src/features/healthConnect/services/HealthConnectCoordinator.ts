import {
  heartRateSyncService,
} from './HeartRateSyncService'

import {
  stepsSyncService,
} from './StepsSyncService'

import {
  sleepSyncService,
} from './SleepSyncService'

import {
  exerciseSyncService,
} from './ExerciseSyncService'

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

  async syncExercise() {
    return exerciseSyncService
      .readLast30Days()
  }

  async syncAll() {
    const [
      heartRate,
      steps,
      sleep,
      exercise,
    ] = await Promise.all([
      this.syncHeartRate(),
      this.syncSteps(),
      this.syncSleep(),
      this.syncExercise(),
    ])

    return {
      heartRate,
      steps,
      sleep,
      exercise,
    }
  }
}

export const
  healthConnectCoordinator =
    new HealthConnectCoordinator()
