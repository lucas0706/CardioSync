import { useMemo } from 'react'

import { measurementService } from '@/features/measurements/services/MeasurementService'

import {
  dashboardService,
} from '../services/DashboardService'

export function useDashboard() {
  const metrics = useMemo(
    () =>
      measurementService.getDashboardMetrics(),
    [],
  )

  return useMemo(
    () =>
      dashboardService.build(metrics),
    [metrics],
  )
}
