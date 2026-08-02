import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

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

      return records.filter(record => {
        const date = new Date(record.dateTime)

        return (
          date >= filter.startDate! &&
          date <= filter.endDate!
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
