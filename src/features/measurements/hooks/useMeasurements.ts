import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'

import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { measurementService } from '@/features/measurements/services/MeasurementService'

export function useMeasurements() {
  const [measurements, setMeasurements] = useState<BloodPressureRecord[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setLoading(true)

    try {
      setMeasurements(measurementService.getAll())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useFocusEffect(
    useCallback(() => {
      refresh()
    }, [refresh]),
  )

  return {
    loading,
    measurements,
    refresh,
  }
}
