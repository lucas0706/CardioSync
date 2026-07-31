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
      systolic: 120,
      diastolic: 80,
    },
  })
}
