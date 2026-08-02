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

    dateTime: values.dateTime ?? now,

    systolic: values.systolic,

    diastolic: values.diastolic,

    heartRate: values.heartRate,

    arm: values.arm ?? undefined,

    position: values.position ?? undefined,

    notes: values.notes,

    createdAt: now,

    updatedAt: now,
  }
}

export function updateMeasurement(
  values: MeasurementFormData,
  existingRecord: BloodPressureRecord,
): BloodPressureRecord {
  const now = new Date().toISOString()

  return {
    ...existingRecord,
    dateTime: values.dateTime ?? existingRecord.dateTime,
    systolic: values.systolic,
    diastolic: values.diastolic,
    heartRate: values.heartRate,
    arm: values.arm ?? undefined,
    position: values.position ?? undefined,
    notes: values.notes,
    updatedAt: now,
  }
}
