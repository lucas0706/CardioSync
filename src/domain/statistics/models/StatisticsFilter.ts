import type { StatisticsPeriod } from '../types/StatisticsPeriod'

export interface StatisticsFilter {
  period: StatisticsPeriod

  startDate?: Date

  endDate?: Date
}
