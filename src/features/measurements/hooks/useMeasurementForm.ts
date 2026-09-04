import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  measurementSchema,
  MeasurementFormData,
} from '../schema/measurement.schema'

export function useMeasurementForm(
  initialValues?: Partial<MeasurementFormData>,
) {
  return useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),

    defaultValues: {
      dateTime: new Date().toISOString(),
      systolic: undefined,
      diastolic: undefined,
      heartRate: undefined,
      notes: '',
      arm: undefined,
      position: undefined,
      ...initialValues,
    },
  })
}
