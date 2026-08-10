import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { StatisticsEngine } from '../engines'
import { PeriodFilter } from '../filters'
import type {
  StatisticsFilter,
  StatisticsSummary,
} from '../models'

export class StatisticsDomainService {
  static getFilteredRecords(
    records: BloodPressureRecord[],
    filter?: StatisticsFilter,
  ): BloodPressureRecord[] {
    if (!filter) {
      return records
    }

    return PeriodFilter.apply(
      records,
      filter,
    )
  }

  static getSummary(
    records: BloodPressureRecord[],
    filter?: StatisticsFilter,
  ): StatisticsSummary {
    return StatisticsEngine.summarize(
      records,
      filter,
    )
  }
}
