import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class ValidBloodPressureFilter {
  static apply(records: BloodPressureRecord[]): BloodPressureRecord[] {
    return records.filter(
      (record) => Number.isFinite(record.systolic) && Number.isFinite(record.diastolic),
    )
  }
}
