import { HealthSummary } from '@/domain/health/HealthSummary'

import {
  healthConnectCoordinator,
} from './HealthConnectCoordinator'

import {
  healthAggregateService,
} from './HealthAggregateService'

export class HealthSummaryBuilder {
  async build(): Promise<HealthSummary> {
    const {
      sleep,
    } =
      await healthConnectCoordinator
        .syncAll()

    const [
      todaySteps,
      averageHeartRate,
    ] =
      await Promise.all([
        healthAggregateService
          .getTodaySteps(),

        healthAggregateService
          .getTodayHeartRateAverage(),
      ])

    const latestSleep =
      sleep.length > 0
        ? sleep.sort(
            (a, b) =>
              new Date(
                b.endTime,
              ).getTime() -
              new Date(
                a.endTime,
              ).getTime(),
          )[0]
        : null

    const lastSleepHours =
      latestSleep
        ? Number(
            (
              latestSleep.durationMinutes /
              60
            ).toFixed(1),
          )
        : 0

    console.log(
      '[HC SUMMARY]',
      {
        averageDailySteps:
          todaySteps,
        averageRestingHeartRate:
          averageHeartRate,
        averageSleepHours:
          lastSleepHours,
      },
    )

    return {
      averageDailySteps:
        todaySteps,

      averageRestingHeartRate:
        averageHeartRate,

      averageSleepHours:
        lastSleepHours,
    }
  }
}

export const
  healthSummaryBuilder =
    new HealthSummaryBuilder()
