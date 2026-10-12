import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { MeasurementDateFilter } from '@/features/measurements/constants/dateFilters'
import { measurementService } from './MeasurementService'

type ResolvedRange =
  | {
      kind: 'all'
    }
  | {
      kind: 'invalid'
      startDate: Date | null
      endDate: Date | null
    }
  | {
      kind: 'range'
      startDate: Date
      endDate: Date
    }

function parseCustomDate(
  value: string,
  endOfDay = false,
): Date | null {
  const match =
    /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(
      value.trim(),
    )

  if (!match) {
    return null
  }

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  const date = new Date(
    year,
    month - 1,
    day,
  )

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  if (endOfDay) {
    date.setHours(
      23,
      59,
      59,
      999,
    )
  } else {
    date.setHours(
      0,
      0,
      0,
      0,
    )
  }

  return date
}

function getStartDate(
  filter: Exclude<MeasurementDateFilter, 'all' | 'custom'>,
  endDate: Date,
): {
  startDate: Date
  endDate: Date
} {
  const startDate = new Date(endDate)
  let rangeEndDate = new Date(endDate)

  switch (filter) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      break

    case 'week':
      startDate.setDate(
        startDate.getDate() - 7,
      )
      break

    case 'twoWeeks':
      startDate.setDate(
        startDate.getDate() - 14,
      )
      break

    case 'month':
      startDate.setDate(
        startDate.getDate() - 30,
      )
      break

    case 'ninetyDays':
      startDate.setDate(
        startDate.getDate() - 90,
      )
      break

    case 'oneHundredEightyDays':
      startDate.setDate(
        startDate.getDate() - 180,
      )
      break

    case 'threeHundredSixtyFiveDays':
      startDate.setDate(
        startDate.getDate() - 365,
      )
      break

    case 'calendarMonth':
      startDate.setDate(1)
      startDate.setHours(0, 0, 0, 0)
      break

    case 'previousYear':
      startDate.setFullYear(startDate.getFullYear() - 1, 0, 1)
      startDate.setHours(0, 0, 0, 0)
      rangeEndDate = new Date(
        startDate.getFullYear(),
        11,
        31,
        23,
        59,
        59,
        999,
      )
      break

    case 'sixMonths':
    case 'year':
      subtractCalendarMonths(startDate, filter === 'sixMonths' ? 6 : 12)
      break
  }

  return {
    startDate,
    endDate: rangeEndDate,
  }
}

function subtractCalendarMonths(date: Date, months: number): void {
  const dayOfMonth = date.getDate()
  const targetMonth = new Date(
    date.getFullYear(),
    date.getMonth() - months,
    1,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds(),
  )
  const finalDayOfTargetMonth = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0,
  ).getDate()

  targetMonth.setDate(Math.min(dayOfMonth, finalDayOfTargetMonth))
  date.setTime(targetMonth.getTime())
}

function resolveRange(
  filter: MeasurementDateFilter,
  customStart: string,
  customEnd: string,
): ResolvedRange {
  if (filter === 'all') {
    return { kind: 'all' }
  }

  if (filter === 'custom') {
    const startDate = parseCustomDate(customStart)
    const endDate = parseCustomDate(customEnd, true)

    if (!startDate || !endDate || startDate > endDate) {
      return {
        kind: 'invalid',
        startDate,
        endDate,
      }
    }

    return {
      kind: 'range',
      startDate,
      endDate,
    }
  }

  return {
    kind: 'range',
    ...getStartDate(
      filter,
      new Date(),
    ),
  }
}

function logFilterDuration(
  filter: MeasurementDateFilter,
  startedAt: number,
  records: BloodPressureRecord[],
): void {
  console.log(
    `[MeasurementFilter] ${filter}: ${(performance.now() - startedAt).toFixed(1)}ms (${records.length} records)`,
  )
}

export class MeasurementHistoryFilterService {
  getRecordsAndRange(
    filter: MeasurementDateFilter,
    customStart = '',
    customEnd = '',
  ): {
    records: BloodPressureRecord[]
    startDate: Date | null
    endDate: Date | null
  } {
    const startedAt = performance.now()
    const range = resolveRange(filter, customStart, customEnd)

    if (range.kind === 'all') {
      const records = measurementService.getAll()

      logFilterDuration(filter, startedAt, records)

      return {
        records,
        startDate: null,
        endDate: null,
      }
    }

    if (range.kind === 'invalid') {
      return {
        records: [],
        startDate: range.startDate,
        endDate: range.endDate,
      }
    }

    const records = measurementService.getByDateRange(
      range.startDate.toISOString(),
      range.endDate.toISOString(),
    )

    logFilterDuration(filter, startedAt, records)

    return {
      records,
      startDate: range.startDate,
      endDate: range.endDate,
    }
  }

  async getRecordsAndRangeAsync(
    filter: MeasurementDateFilter,
    customStart = '',
    customEnd = '',
  ): Promise<{
    records: BloodPressureRecord[]
    startDate: Date | null
    endDate: Date | null
  }> {
    const startedAt = performance.now()
    const range = resolveRange(filter, customStart, customEnd)

    if (range.kind === 'all') {
      const records = await measurementService.getAllAsync()
      logFilterDuration(filter, startedAt, records)

      return {
        records,
        startDate: null,
        endDate: null,
      }
    }

    if (range.kind === 'invalid') {
      return {
        records: [],
        startDate: range.startDate,
        endDate: range.endDate,
      }
    }

    const records = await measurementService.getByDateRangeAsync(
      range.startDate.toISOString(),
      range.endDate.toISOString(),
    )
    logFilterDuration(filter, startedAt, records)

    return {
      records,
      startDate: range.startDate,
      endDate: range.endDate,
    }
  }

  getRecords(
    filter: MeasurementDateFilter,
    customStart = '',
    customEnd = '',
  ): BloodPressureRecord[] {
    return this.getRecordsAndRange(filter, customStart, customEnd).records
  }
}

export const measurementHistoryFilterService = new MeasurementHistoryFilterService()
