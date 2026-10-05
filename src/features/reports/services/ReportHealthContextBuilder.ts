import type { ExerciseSessionRecord } from '@/domain/health/ExerciseSessionRecord'
import type { HeartRateSample } from '@/domain/health/HeartRateSample'
import type { SleepSessionRecord } from '@/domain/health/SleepSessionRecord'
import type { StepRecord } from '@/domain/health/StepRecord'
import {
  getHealthConnectSettings,
  healthConnectCoordinator,
  updateHealthConnectLastSync,
} from '@/features/healthConnect'

import type { ReportHealthContext, ReportHealthTrendPoint } from '../models/ReportHealthContext'

const REPORT_PERIOD_DAYS = 30

function getRecentDayKeys(): string[] {
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  return Array.from({ length: REPORT_PERIOD_DAYS }, (_, index) => {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - (REPORT_PERIOD_DAYS - index - 1))
    return date.toISOString().slice(0, 10)
  })
}

function getRecordDay(timestamp: string): string | null {
  if (!Number.isFinite(Date.parse(timestamp))) {
    return null
  }

  // Match the existing sleep grouping by source timestamp date, without local timezone conversion.
  return timestamp.slice(0, 10)
}

function aggregateDailyTotals(
  records: Array<{
    timestamp: string
    value: number
  }>,
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
  divisor = 1,
): ReportHealthTrendPoint[] {
  return days.map((date) => ({
    date,
    value: dailyValues.has(date) ? (dailyValues.get(date) ?? 0) / divisor : null,
  }))
}

function getObservedValues(series: ReportHealthTrendPoint[]): number[] {
  return series.flatMap((point) => (point.value === null ? [] : [point.value]))
}

function getAverage(values: number[]): number {
  return values.length > 0 ? values.reduce((total, value) => total + value, 0) / values.length : 0
}

function aggregateHeartRateByDay(samples: HeartRateSample[]): Map<string, number> {
  const samplesByDay = new Map<string, { total: number; count: number }>()

  for (const sample of samples) {
    const day = getRecordDay(sample.dateTime)

    if (day === null || !Number.isFinite(sample.bpm) || sample.bpm <= 0) {
      continue
    }

    const current = samplesByDay.get(day) ?? { total: 0, count: 0 }
    current.total += sample.bpm
    current.count += 1
    samplesByDay.set(day, current)
  }

  return new Map(Array.from(samplesByDay, ([day, values]) => [day, values.total / values.count]))
}

function getValidStepRecords(steps: StepRecord[]): Array<{ timestamp: string; value: number }> {
  return steps
    .filter((record) => Number.isFinite(record.count) && record.count >= 0)
    .map((record) => ({ timestamp: record.startTime, value: record.count }))
}

function getValidSessions(
  sessions: Array<SleepSessionRecord | ExerciseSessionRecord>,
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
      console.log('[REPORT HC] disabled')
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
      const heartRateDailyAverages = aggregateHeartRateByDay(heartRate)
      const sleepDailyTotals = aggregateDailyTotals(getValidSessions(sleep))
      const exerciseDailyTotals = aggregateDailyTotals(getValidSessions(exercise))
      const stepSeries = createDailySeries(days, stepDailyTotals)
      const heartRateSeries = createDailySeries(days, heartRateDailyAverages)
      const sleepSeries = createDailySeries(days, sleepDailyTotals, 60)
      const exerciseSeries = createDailySeries(days, exerciseDailyTotals)
      const dailyStepValues = getObservedValues(stepSeries)
      const dailyHeartRateValues = getObservedValues(heartRateSeries)
      const dailySleepValues = getObservedValues(sleepSeries)
      const dailyExerciseValues = getObservedValues(exerciseSeries)

      return {
        averageDailySteps30Days: Math.round(getAverage(dailyStepValues)),
        averageHeartRate30Days: Math.round(getAverage(dailyHeartRateValues)),
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
