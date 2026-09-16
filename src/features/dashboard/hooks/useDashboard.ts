import {
  useMemo,
  useSyncExternalStore,
} from 'react'

import { measurementStore } from '@/features/measurements/services/MeasurementStore'
import { measurementService } from '@/features/measurements/services/MeasurementService'

import {
  dashboardService,
} from '../services/DashboardService'

export function useDashboard() {
  const snapshot =
    useSyncExternalStore(
      measurementStore.subscribe.bind(
        measurementStore,
      ),
      measurementStore.getSnapshot.bind(
        measurementStore,
      ),
      measurementStore.getSnapshot.bind(
        measurementStore,
      ),
    )

  const metrics = useMemo(
    () =>
      measurementService.getDashboardMetrics(),
    [snapshot],
  )

  return useMemo(
    () =>
      dashboardService.build(metrics),
    [metrics],
  )
}
