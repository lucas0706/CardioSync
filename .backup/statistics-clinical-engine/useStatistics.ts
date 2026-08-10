import { useMemo, useState } from 'react'

import {
  StatisticsDomainService,
} from '@/domain/statistics/services'

import type {
  StatisticsFilter,
} from '@/domain/statistics/models'

import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'
import { clinicalEngine } from '@/clinical/providers/ClinicalProvider'

export function useStatistics() {
  const { measurements } = useMeasurements()

  const [filter, setFilter] =
    useState<StatisticsFilter>({
      period: '30d',
    })

  const summary = useMemo(
    () =>
      StatisticsDomainService.getSummary(
        measurements,
        filter,
        clinicalEngine,
      ),
    [measurements, filter],
  )

  const updateFilter = (
    nextFilter: Partial<StatisticsFilter>,
  ) => {
    setFilter(current => ({
      ...current,
      ...nextFilter,
    }))
  }

  const filteredMeasurements =
    useMemo(
      () =>
        StatisticsDomainService.getFilteredRecords(
          measurements,
          filter,
        ),
      [measurements, filter],
    )

  return {
    measurements,
    filteredMeasurements,
    summary,
    filter,
    updateFilter,
  }
}
