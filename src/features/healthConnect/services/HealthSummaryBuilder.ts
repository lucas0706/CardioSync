import {
  getAverage,
  getDailyHeartRateAverages,
  getSleepHoursByWakeDay,
} from '@/domain/health/HealthMetrics'
import { HealthSummary } from '@/domain/health/HealthSummary'

import {
  getHealthConnectSettings,
  updateHealthConnectLastSync,
} from './HealthConnectSettingsService'

import { healthConnectCoordinator } from './HealthConnectCoordinator'

import { healthAggregateService } from './HealthAggregateService'

import { profileWeightSyncService } from './ProfileWeightSyncService'

function getLocalDateString(): string {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export class HealthSummaryBuilder {
  async build(): Promise<HealthSummary> {
    await profileWeightSyncService.syncLatestWeight()

    const { heartRate, steps, sleep, exercise, weight } = await healthConnectCoordinator.syncAll()

    updateHealthConnectLastSync()

    const { updatedAt } = getHealthConnectSettings()

    const [todaySteps, averageHeartRate] = await Promise.all([
      healthAggregateService.getTodaySteps(),
      healthAggregateService.getTodayHeartRateAverage(),
    ])

    const sleepHoursByWakeDay = getSleepHoursByWakeDay(sleep)
    const latestSleep = sleep
      .filter((session) => Number.isFinite(Date.parse(session.endTime)))
      .sort((a, b) => Date.parse(b.endTime) - Date.parse(a.endTime))[0]

    const averageSleepHours = latestSleep
      ? Number((sleepHoursByWakeDay.get(latestSleep.endTime.slice(0, 10)) ?? 0).toFixed(1))
      : 0

    const today = getLocalDateString()

    const exerciseMinutesToday = exercise
      .filter((session) => session.startTime.startsWith(today))
      .reduce((total, session) => total + session.durationMinutes, 0)

    const exerciseMinutes30Days = exercise.reduce(
      (total, session) => total + session.durationMinutes,
      0,
    )

    const dailyHeartRateAverages = getDailyHeartRateAverages(heartRate)
    const averageHeartRate30Days = Math.round(
      getAverage(Array.from(dailyHeartRateAverages.values())),
    )

    const averageSleepHours30Days = Number(
      getAverage(Array.from(sleepHoursByWakeDay.values())).toFixed(1),
    )

    const daysWithSteps = new Set(steps.map((record) => record.startTime.slice(0, 10))).size

    const averageDailySteps30Days =
      daysWithSteps > 0
        ? Math.round(steps.reduce((total, record) => total + record.count, 0) / daysWithSteps)
        : 0

    const latestWeight =
      weight.length > 0
        ? [...weight].sort((a, b) => Date.parse(b.dateTime) - Date.parse(a.dateTime))[0]
        : undefined

    return {
      todaySteps,
      todayHeartRateAverage: averageHeartRate,
      averageSleepHours,
      exerciseMinutesToday,
      latestWeightKg: latestWeight?.weightKg,
      latestWeightDate: latestWeight?.dateTime,
      averageHeartRate30Days,
      averageDailySteps30Days,
      averageSleepHours30Days,
      exerciseMinutes30Days,
      lastSyncAt: updatedAt,
    }
  }
}

export const healthSummaryBuilder = new HealthSummaryBuilder()
