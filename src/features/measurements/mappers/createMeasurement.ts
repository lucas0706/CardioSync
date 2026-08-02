import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { MeasurementFormData } from '@/features/measurements/schema/measurement.schema'

export function createMeasurement(
  values: MeasurementFormData,
): BloodPressureRecord {
  const now = new Date().toISOString()

  return {
    id:
      Date.now().toString() +
      '-' +
      Math.random().toString(36).slice(2),

    dateTime: now,

    systolic: values.systolic,

    diastolic: values.diastolic,

    heartRate: values.heartRate,

    weight: values.weight,

    arm: values.arm,

    position: values.position,

    notes: values.notes,

    createdAt: now,

    updatedAt: now,
  }
}
