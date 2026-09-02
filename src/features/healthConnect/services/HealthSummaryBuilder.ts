import { HealthSummary } from '@/domain/health/HealthSummary'

import {
  healthConnectCoordinator,
} from './HealthConnectCoordinator'

export class HealthSummaryBuilder {
  async build(): Promise<
    HealthSummary
  > {
    const {
      heartRate,
      steps,
      sleep,
      exercise,
    } =
      await healthConnectCoordinator
        .syncAll()

    const averageRestingHeartRate =
      heartRate.length > 0
        ? Math.round(
            heartRate.reduce(
              (sum, item) =>
                sum + item.bpm,
              0,
            ) / heartRate.length,
          )
        : 0

    const averageDailySteps =
      steps.length > 0
        ? Math.round(
            steps.reduce(
              (sum, item) =>
                sum + item.count,
              0,
            ) / steps.length,
          )
        : 0

    const averageSleepHours =
      sleep.length > 0
        ? Number(
            (
              sleep.reduce(
                (sum, item) =>
                  sum +
                  item.durationMinutes,
                0,
              ) /
              sleep.length /
              60
            ).toFixed(1),
          )
        : 0

    const weeklyExerciseSessions =
      exercise.length

    return {
      averageRestingHeartRate,
      averageDailySteps,
      averageSleepHours,
      weeklyExerciseSessions,
    }
  }
}

export const
  healthSummaryBuilder =
    new HealthSummaryBuilder()
