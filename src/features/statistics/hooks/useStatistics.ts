import {
  useCallback,
  useMemo,
  useState,
} from 'react'

import {
  useFocusEffect,
} from 'expo-router'

import {
  StatisticsDomainService,
} from '@/domain/statistics/services'

import type {
  StatisticsFilter,
} from '@/domain/statistics/models'

import {
  useMeasurements,
} from '@/features/measurements/hooks/useMeasurements'

const DEFAULT_STATISTICS_PERIOD:
  StatisticsFilter['period'] = '30d'

export function useStatistics() {
  const { measurements } =
    useMeasurements()

  const [filter, setFilter] =
    useState<StatisticsFilter>({
      period:
        DEFAULT_STATISTICS_PERIOD,
    })

  useFocusEffect(
    useCallback(() => {
      setFilter({
        period:
          DEFAULT_STATISTICS_PERIOD,
      })
    }, []),
  )

  const summary = useMemo(
    () =>
      StatisticsDomainService.getSummary(
        measurements,
        filter,
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
