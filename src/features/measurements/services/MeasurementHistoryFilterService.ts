import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { MeasurementDateFilter } from '@/features/measurements/constants/dateFilters'
import { measurementService } from './MeasurementService'

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
  filter: Exclude<
    MeasurementDateFilter,
    'all' | 'custom'
  >,
): Date {
  const now = new Date()

  switch (filter) {
    case 'week':
      now.setDate(
        now.getDate() - 7,
      )
      break

    case 'month':
      now.setDate(
        now.getDate() - 30,
      )
      break

    case 'sixMonths':
      now.setMonth(
        now.getMonth() - 6,
      )
      break

    case 'year':
      now.setFullYear(
        now.getFullYear() - 1,
      )
      break
  }

  return now
}

export class MeasurementHistoryFilterService {
  getRecords(
    filter: MeasurementDateFilter,
    customStart = '',
    customEnd = '',
  ): BloodPressureRecord[] {
    const startedAt = performance.now()

    if (filter === 'all') {
      const records = measurementService.getAll()

      console.log(
        `[MeasurementFilter] all: ${(performance.now() - startedAt).toFixed(1)}ms (${records.length} records)`,
      )

      return records
    }

    if (filter === 'custom') {
      const from =
        parseCustomDate(
          customStart,
        )

      const to =
        parseCustomDate(
          customEnd,
          true,
        )

      if (
        !from ||
        !to ||
        from > to
      ) {
        return []
      }

      const records =
        measurementService.getByDateRange(
          from.toISOString(),
          to.toISOString(),
        )

      console.log(
        `[MeasurementFilter] custom: ${(performance.now() - startedAt).toFixed(1)}ms (${records.length} records)`,
      )

      return records
    }

    const startDate =
      getStartDate(filter)

    const records =
      measurementService.getByDateRange(
        startDate.toISOString(),
      )

    console.log(
      `[MeasurementFilter] ${filter}: ${(performance.now() - startedAt).toFixed(1)}ms (${records.length} records)`,
    )

    return records
  }
}

export const measurementHistoryFilterService =
  new MeasurementHistoryFilterService()
