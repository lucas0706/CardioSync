import { useMemo } from 'react'

import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

import { dashboardService } from '../services/DashboardService'

export function useDashboard() {
  const { measurements } =
    useMeasurements()

  const summary = useMemo(
    () =>
      dashboardService.build(
        measurements,
      ),
    [measurements],
  )

  return summary
}
