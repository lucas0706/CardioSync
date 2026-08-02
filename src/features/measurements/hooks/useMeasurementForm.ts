import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  measurementSchema,
  MeasurementFormData,
} from '../schema/measurement.schema'

export function useMeasurementForm() {
  return useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),

    defaultValues: {
      systolic: undefined,
      diastolic: undefined,
      heartRate: undefined,
      weight: undefined,
      notes: '',
      arm: undefined,
      position: undefined,
    },
  })
}
