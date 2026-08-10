import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import type { ClinicalEngine } from '@/clinical/engine'

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
    clinicalEngine?: ClinicalEngine,
  ): StatisticsSummary {
    return StatisticsEngine.summarize(
      records,
      filter,
    )
  }
}
