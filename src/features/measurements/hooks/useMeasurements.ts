import { useSyncExternalStore } from 'react'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { measurementStore } from '@/features/measurements/services/MeasurementStore'

measurementStore.initialize()

export function useMeasurements() {
  const measurements =
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

  return {
    loading: false,
    measurements:
      measurements as BloodPressureRecord[],
    refresh: measurementStore.refresh.bind(
      measurementStore,
    ),
  }
}
