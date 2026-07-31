import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { MeasurementFormValues } from '@/features/measurements/models/MeasurementFormValues'

export function createMeasurement(
  values: MeasurementFormValues,
): BloodPressureRecord {
  const now = new Date().toISOString()

  return {
    ...values,

    id:
      Date.now().toString() +
      '-' +
      Math.random().toString(36).slice(2),

    createdAt: now,

    updatedAt: now,
  }
}
