import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import {
  StatisticsDomainService,
} from '@/domain/statistics/services'

import type {
  StatisticsFilter,
} from '@/domain/statistics/models'

import {
  LOCAL_PROFILE_ID,
} from '@/features/profile/constants'

import {
  clinicalProfileService,
} from '@/features/profile/services'

import type { BloodPressureReport } from '../models/BloodPressureReport'

export class ReportService {
  build(
    records: BloodPressureRecord[],
    filter: StatisticsFilter,
  ): BloodPressureReport {
    const profile =
      clinicalProfileService.get(
        LOCAL_PROFILE_ID,
      )

    const filteredRecords =
      StatisticsDomainService.getFilteredRecords(
        records,
        filter,
      )

    const summary =
      StatisticsDomainService.getSummary(
        records,
        filter,
      )

    return {
      filter,

      patientName:
        profile?.name?.trim() || undefined,

      patientAge:
        profile?.age,

      summary,

      records: filteredRecords,
    }
  }
}

export const reportService =
  new ReportService()
