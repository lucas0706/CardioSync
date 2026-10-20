import type { ExerciseSessionRecord } from '@/domain/health/ExerciseSessionRecord'
import {
  getAverage,
  getAverageHeartRateWithinDays,
  getDailyHeartRateAverages,
  getRecentDayKeys,
  getSleepHoursByWakeDay,
  getValuesWithinDays,
} from '@/domain/health/HealthMetrics'
import type { StepRecord } from '@/domain/health/StepRecord'
import {
  getHealthConnectSettings,
  healthConnectCoordinator,
  updateHealthConnectLastSync,
} from '@/features/healthConnect'

import type { ReportHealthContext, ReportHealthTrendPoint } from '../models/ReportHealthContext'

function getRecordDay(timestamp: string): string | null {
  if (!Number.isFinite(Date.parse(timestamp))) {
    return null
  }

  return timestamp.slice(0, 10)
}

function aggregateDailyTotals(
  records: Array<{ timestamp: string; value: number }>,
): Map<string, number> {
  const totals = new Map<string, number>()

  for (const record of records) {
    const day = getRecordDay(record.timestamp)

    if (day === null || !Number.isFinite(record.value)) {
      continue
    }

    totals.set(day, (totals.get(day) ?? 0) + record.value)
  }

  return totals
}

function createDailySeries(
  days: string[],
  dailyValues: Map<string, number>,
): ReportHealthTrendPoint[] {
  return days.map((date) => ({
    date,
    value: dailyValues.has(date) ? (dailyValues.get(date) ?? 0) : null,
  }))
}

function getObservedValues(series: ReportHealthTrendPoint[]): number[] {
  return series.flatMap((point) => (point.value === null ? [] : [point.value]))
}

function getValidStepRecords(steps: StepRecord[]): Array<{ timestamp: string; value: number }> {
  return steps
    .filter((record) => Number.isFinite(record.count) && record.count >= 0)
    .map((record) => ({
      timestamp: record.startTime,
      value: record.count,
    }))
}

function getValidExerciseSessions(
  sessions: ExerciseSessionRecord[],
): Array<{ timestamp: string; value: number }> {
  return sessions
    .filter((session) => Number.isFinite(session.durationMinutes) && session.durationMinutes >= 0)
    .map((session) => ({
      timestamp: session.startTime,
      value: session.durationMinutes,
    }))
}

export class ReportHealthContextBuilder {
  async build(): Promise<ReportHealthContext | undefined> {
    const settings = getHealthConnectSettings()

    if (!settings.enabled) {
      return undefined
    }

    try {
      const [heartRate, steps, sleep, exercise] = await Promise.all([
        healthConnectCoordinator.syncHeartRate(),
        healthConnectCoordinator.syncSteps(),
        healthConnectCoordinator.syncSleep(),
        healthConnectCoordinator.syncExercise(),
      ])

      updateHealthConnectLastSync()

      const days = getRecentDayKeys()
      const stepDailyTotals = aggregateDailyTotals(getValidStepRecords(steps))
      const heartRateDailyAverages = getDailyHeartRateAverages(heartRate)
      const sleepDailyTotals = getSleepHoursByWakeDay(sleep)
      const exerciseDailyTotals = aggregateDailyTotals(getValidExerciseSessions(exercise))
      const stepSeries = createDailySeries(days, stepDailyTotals)
      const heartRateSeries = createDailySeries(days, heartRateDailyAverages)
      const sleepSeries = createDailySeries(days, sleepDailyTotals)
      const exerciseSeries = createDailySeries(days, exerciseDailyTotals)
      const dailyStepValues = getObservedValues(stepSeries)
      const dailySleepValues = getValuesWithinDays(sleepDailyTotals, days)
      const dailyExerciseValues = getObservedValues(exerciseSeries)

      return {
        averageDailySteps30Days: Math.round(getAverage(dailyStepValues)),
        averageHeartRate30Days: Math.round(getAverageHeartRateWithinDays(heartRate, days)),
        averageSleepHours30Days: Number(getAverage(dailySleepValues).toFixed(1)),
        exerciseMinutes30Days: dailyExerciseValues.reduce((total, value) => total + value, 0),
        averageDailyExerciseMinutes30Days: getAverage(dailyExerciseValues),
        dailySteps30Days: stepSeries,
        dailyHeartRate30Days: heartRateSeries,
        dailySleepHours30Days: sleepSeries,
        dailyExerciseMinutes30Days: exerciseSeries,
      }
    } catch (error) {
      console.error('[REPORT HC ERROR]', error)
      return undefined
    }
  }
}

export const reportHealthContextBuilder = new ReportHealthContextBuilder()
