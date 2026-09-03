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
      heartRate,
      steps,
      sleep,
      exercise,
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

    const today =
      new Date()
        .toISOString()
        .slice(0, 10)

    const exerciseMinutesToday =
      exercise
        .filter(
          session =>
            session.startTime.startsWith(
              today,
            ),
        )
        .reduce(
          (
            total,
            session,
          ) =>
            total +
            session.durationMinutes,
          0,
        )

    const exerciseMinutes30Days =
      exercise.reduce(
        (
          total,
          session,
        ) =>
          total +
          session.durationMinutes,
        0,
      )

    const averageSleepHours30Days =
      sleep.length > 0
        ? Number(
            (
              sleep.reduce(
                (
                  total,
                  session,
                ) =>
                  total +
                  session.durationMinutes,
                0,
              ) /
              sleep.length /
              60
            ).toFixed(1),
          )
        : 0

    const averageHeartRate30Days =
      heartRate.length > 0
        ? Math.round(
            heartRate.reduce(
              (
                total,
                sample,
              ) =>
                total +
                sample.bpm,
              0,
            ) /
            heartRate.length,
          )
        : 0

    const daysWithSteps =
      new Set(
        steps.map(
          record =>
            record.startTime.slice(
              0,
              10,
            ),
        ),
      ).size

    const averageDailySteps30Days =
      daysWithSteps > 0
        ? Math.round(
            steps.reduce(
              (
                total,
                record,
              ) =>
                total +
                record.count,
              0,
            ) /
            daysWithSteps,
          )
        : 0

    console.log(
      '[HC SUMMARY]',
      {
        todaySteps,
        todayHeartRateAverage:
          averageHeartRate,
        averageSleepHours:
          lastSleepHours,
        exerciseMinutesToday,

        averageHeartRate30Days,
        averageDailySteps30Days,
        averageSleepHours30Days,
        exerciseMinutes30Days,
      },
    )

    return {
      todaySteps,

      todayHeartRateAverage:
        averageHeartRate,

      averageSleepHours:
        lastSleepHours,

      exerciseMinutesToday,

      averageHeartRate30Days,

      averageDailySteps30Days,

      averageSleepHours30Days,

      exerciseMinutes30Days,
    }
  }
}

export const
  healthSummaryBuilder =
    new HealthSummaryBuilder()
