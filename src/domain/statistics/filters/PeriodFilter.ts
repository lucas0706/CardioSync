import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import type { StatisticsFilter } from '../models'

export class PeriodFilter {
  static apply(
    records: BloodPressureRecord[],
    filter: StatisticsFilter,
  ): BloodPressureRecord[] {
    if (filter.period === 'custom') {
      if (!filter.startDate || !filter.endDate) {
        return records
      }

      const start = new Date(filter.startDate)
      start.setHours(0, 0, 0, 0)

      const endExclusive = new Date(filter.endDate)
      endExclusive.setHours(0, 0, 0, 0)
      endExclusive.setDate(endExclusive.getDate() + 1)

      return records.filter(record => {
        const date = new Date(record.dateTime)

        return (
          date >= start &&
          date < endExclusive
        )
      })
    }

    const now = new Date()

    const start = new Date(now)

    switch (filter.period) {
      case '7d':
        start.setDate(start.getDate() - 7)
        break

      case '30d':
        start.setDate(start.getDate() - 30)
        break

      case '90d':
        start.setDate(start.getDate() - 90)
        break
    }

    return records.filter(record => {
      return new Date(record.dateTime) >= start
    })
  }
}
