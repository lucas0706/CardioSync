import {
  useSyncExternalStore,
} from 'react'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { measurementStore } from '@/features/measurements/services/MeasurementStore'

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

  useFocusEffect(
    useCallback(() => {
      measurementStore.initialize()
    }, []),
  )

  return {
    loading: false,
    measurements:
      measurements as BloodPressureRecord[],
    refresh:
      measurementStore.refresh.bind(
        measurementStore,
      ),
  }
}
