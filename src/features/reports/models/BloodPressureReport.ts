import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import type { StatisticsSummary } from '@/domain/statistics/models'
import type { StatisticsFilter } from '@/domain/statistics/models'

export interface BloodPressureReport {
  filter: StatisticsFilter

  patientName?: string
  patientAge?: number

  summary: StatisticsSummary

  records: BloodPressureRecord[]
}
