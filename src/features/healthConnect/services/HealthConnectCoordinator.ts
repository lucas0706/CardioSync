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

import {
  weightSyncService,
} from './WeightSyncService'

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

  async syncWeight() {
    return weightSyncService
      .readLast30Days()
  }

  async syncAll() {
    const [
      heartRate,
      steps,
      sleep,
      exercise,
      weight,
    ] = await Promise.all([
      this.syncHeartRate(),
      this.syncSteps(),
      this.syncSleep(),
      this.syncExercise(),
      this.syncWeight(),
    ])

    return {
      heartRate,
      steps,
      sleep,
      exercise,
      weight,
    }
  }
}

export const
  healthConnectCoordinator =
    new HealthConnectCoordinator()
