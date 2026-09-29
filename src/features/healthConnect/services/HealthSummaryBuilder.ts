import { HealthSummary } from '@/domain/health/HealthSummary'

import {
  getHealthConnectSettings,
  updateHealthConnectLastSync,
} from './HealthConnectSettingsService'

import {
  healthConnectCoordinator,
} from './HealthConnectCoordinator'

import {
  healthAggregateService,
} from './HealthAggregateService'

import {
  profileWeightSyncService,
} from './ProfileWeightSyncService'

function getLocalDateString(): string {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    now.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export class HealthSummaryBuilder {
  async build(): Promise<HealthSummary> {
    await profileWeightSyncService
      .syncLatestWeight()

    const {
      heartRate,
      steps,
      sleep,
      exercise,
      weight,
    } =
      await healthConnectCoordinator
        .syncAll()

    updateHealthConnectLastSync()

    const {
      updatedAt,
    } = getHealthConnectSettings()

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
        ? [...sleep].sort(
            (a, b) =>
              new Date(
                b.endTime,
              ).getTime() -
              new Date(
                a.endTime,
              ).getTime(),
          )[0]
        : null

    let lastSleepHours = 0

    if (latestSleep) {
      const latestSleepDay =
        latestSleep.endTime.slice(
          0,
          10,
        )

      const latestSleepMinutes =
        sleep
          .filter(
            session =>
              session.endTime.slice(
                0,
                10,
              ) === latestSleepDay,
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

      lastSleepHours = Number(
        (
          latestSleepMinutes /
          60
        ).toFixed(1),
      )
    }

    const today =
      getLocalDateString()

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

    const sleepMinutesByDay =
      new Map<
        string,
        number
      >()

    sleep.forEach(
      session => {
        const day =
          session.startTime.slice(
            0,
            10,
          )

        sleepMinutesByDay.set(
          day,
          (
            sleepMinutesByDay.get(
              day,
            ) ?? 0
          ) +
            session.durationMinutes,
        )
      },
    )

    const averageSleepHours30Days =
      sleepMinutesByDay.size > 0
        ? Number(
            (
              Array.from(
                sleepMinutesByDay.values(),
              ).reduce(
                (
                  total,
                  minutes,
                ) =>
                  total +
                  minutes,
                0,
              ) /
              sleepMinutesByDay.size /
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

    const latestWeight =
      weight.length > 0
        ? [...weight].sort(
            (a, b) =>
              new Date(
                b.dateTime,
              ).getTime() -
              new Date(
                a.dateTime,
              ).getTime(),
          )[0]
        : undefined

    return {
      todaySteps,

      todayHeartRateAverage:
        averageHeartRate,

      averageSleepHours:
        lastSleepHours,

      exerciseMinutesToday,

      latestWeightKg:
        latestWeight?.weightKg,

      latestWeightDate:
        latestWeight?.dateTime,

      averageHeartRate30Days,

      averageDailySteps30Days,

      averageSleepHours30Days,

      exerciseMinutes30Days,

      lastSyncAt:
        updatedAt,
    }
  }
}

export const
  healthSummaryBuilder =
    new HealthSummaryBuilder()
