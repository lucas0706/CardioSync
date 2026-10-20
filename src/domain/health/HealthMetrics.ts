import type { HeartRateSample } from './HeartRateSample'
import type { SleepInterval, SleepSessionRecord } from './SleepSessionRecord'

export const HEALTH_METRICS_PERIOD_DAYS = 30

export function getRecentDayKeys(
  periodDays = HEALTH_METRICS_PERIOD_DAYS,
  referenceDate = new Date(),
): string[] {
  if (!Number.isInteger(periodDays) || periodDays < 1) {
    return []
  }

  const today = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ),
  )

  return Array.from({ length: periodDays }, (_, index) => {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - (periodDays - index - 1))
    return date.toISOString().slice(0, 10)
  })
}

export function getValuesWithinDays(dailyValues: Map<string, number>, days: string[]): number[] {
  return days.flatMap((day) => {
    const value = dailyValues.get(day)

    return value !== undefined && Number.isFinite(value) ? [value] : []
  })
}

function getDayKey(timestamp: string): string | null {
  if (!Number.isFinite(Date.parse(timestamp))) {
    return null
  }

  return timestamp.slice(0, 10)
}

function getValidInterval(interval: SleepInterval): { start: number; end: number } | null {
  const start = Date.parse(interval.startTime)
  const end = Date.parse(interval.endTime)

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null
  }

  return { start, end }
}

export function sumNonOverlappingIntervalMinutes(intervals: SleepInterval[]): number {
  const validIntervals = intervals
    .map(getValidInterval)
    .filter((interval): interval is { start: number; end: number } => interval !== null)
    .sort((a, b) => a.start - b.start)

  if (validIntervals.length === 0) {
    return 0
  }

  let totalMilliseconds = 0
  let currentStart = validIntervals[0].start
  let currentEnd = validIntervals[0].end

  for (const interval of validIntervals.slice(1)) {
    if (interval.start <= currentEnd) {
      currentEnd = Math.max(currentEnd, interval.end)
      continue
    }

    totalMilliseconds += currentEnd - currentStart
    currentStart = interval.start
    currentEnd = interval.end
  }

  totalMilliseconds += currentEnd - currentStart

  return Math.round(totalMilliseconds / 60000)
}

export function getDailyHeartRateAverages(samples: HeartRateSample[]): Map<string, number> {
  const samplesByDay = new Map<string, { total: number; count: number }>()
  const seenSamples = new Set<string>()

  for (const sample of samples) {
    const day = getDayKey(sample.dateTime)

    if (day === null || !Number.isFinite(sample.bpm) || sample.bpm <= 0) {
      continue
    }

    const deduplicationKey = `${sample.dateTime}|${sample.bpm}`

    if (seenSamples.has(deduplicationKey)) {
      continue
    }

    seenSamples.add(deduplicationKey)

    const current = samplesByDay.get(day) ?? { total: 0, count: 0 }
    current.total += sample.bpm
    current.count += 1
    samplesByDay.set(day, current)
  }

  const dailyAverages = new Map<string, number>()

  for (const [day, values] of samplesByDay) {
    dailyAverages.set(day, values.total / values.count)
  }

  return dailyAverages
}

export function getAverage(values: number[]): number {
  const validValues = values.filter((value) => Number.isFinite(value))

  return validValues.length > 0
    ? validValues.reduce((total, value) => total + value, 0) / validValues.length
    : 0
}

export function getAverageHeartRateWithinDays(samples: HeartRateSample[], days: string[]): number {
  const allowedDays = new Set(days)
  const seenSamples = new Set<string>()
  const values: number[] = []

  for (const sample of samples) {
    const day = getDayKey(sample.dateTime)

    if (day === null || !allowedDays.has(day) || !Number.isFinite(sample.bpm) || sample.bpm <= 0) {
      continue
    }

    const deduplicationKey = `${sample.dateTime}|${sample.bpm}`

    if (seenSamples.has(deduplicationKey)) {
      continue
    }

    seenSamples.add(deduplicationKey)
    values.push(sample.bpm)
  }

  return getAverage(values)
}

export function getSleepHoursByWakeDay(sessions: SleepSessionRecord[]): Map<string, number> {
  const intervalsByWakeDay = new Map<string, SleepInterval[]>()

  for (const session of sessions) {
    const wakeDay = getDayKey(session.endTime)

    if (wakeDay === null || !Array.isArray(session.sleepIntervals)) {
      continue
    }

    const validIntervals = session.sleepIntervals.filter(
      (interval) => getValidInterval(interval) !== null,
    )

    if (validIntervals.length === 0) {
      continue
    }

    const dayIntervals = intervalsByWakeDay.get(wakeDay) ?? []
    dayIntervals.push(...validIntervals)
    intervalsByWakeDay.set(wakeDay, dayIntervals)
  }

  const dailyHours = new Map<string, number>()

  for (const [day, intervals] of intervalsByWakeDay) {
    const minutes = sumNonOverlappingIntervalMinutes(intervals)

    if (minutes > 0) {
      dailyHours.set(day, minutes / 60)
    }
  }

  return dailyHours
}
