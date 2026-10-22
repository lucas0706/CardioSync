import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { StatisticsEngine } from '../engines'
import {
  PeriodFilter,
  ValidBloodPressureFilter,
} from '../filters'
import type {
  StatisticsFilter,
  StatisticsSummary,
} from '../models'

export class StatisticsDomainService {
  static getFilteredRecords(
    records: BloodPressureRecord[],
    filter?: StatisticsFilter,
  ): BloodPressureRecord[] {
    const periodRecords = filter
      ? PeriodFilter.apply(records, filter)
      : records

    return ValidBloodPressureFilter.apply(periodRecords)
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
