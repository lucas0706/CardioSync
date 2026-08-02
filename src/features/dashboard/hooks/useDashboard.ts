import { useMemo } from 'react'

import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

import {
  mapMeasurementsToClinicalChart,
} from '../mappers/mapMeasurementsToClinicalChart'

import {
  dashboardService,
} from '../services/DashboardService'

export function useDashboard() {
  const {
    measurements,
  } = useMeasurements()

  const summary = useMemo(
    () =>
      dashboardService.build(
        measurements,
      ),
    [
      measurements,
    ],
  )

  const chartData = useMemo(
    () =>
      mapMeasurementsToClinicalChart(
        measurements,
      ),
    [
      measurements,
    ],
  )

  return {
    ...summary,
    chartData,
  }
}
