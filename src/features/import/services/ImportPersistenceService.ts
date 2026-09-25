import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { measurementService } from '@/features/measurements/services/MeasurementService'
import { measurementStore } from '@/features/measurements/services/MeasurementStore'

import type { NormalizedImportRecord } from '../types/NormalizedImportRecord'

function createImportId(): string {
  return (
    Date.now().toString() +
    '-' +
    Math.random().toString(36).slice(2)
  )
}

function mapToBloodPressureRecord(
  record: NormalizedImportRecord,
): BloodPressureRecord {
  const now = new Date().toISOString()

  return {
    id: createImportId(),
    dateTime: record.dateTime,
    systolic: record.systolic,
    diastolic: record.diastolic,
    heartRate: record.heartRate,
    arm: record.arm,
    position: record.position,
    notes: record.notes,
    createdAt: now,
    updatedAt: now,
  }
}

export class ImportPersistenceService {
  static findExistingCount(
    records: NormalizedImportRecord[],
  ): number {
    let count = 0

    for (const record of records) {
      if (
        measurementService.existsByMeasurement(
          record,
        )
      ) {
        count += 1
      }
    }

    return count
  }

  static filterNewRecords(
    records: NormalizedImportRecord[],
  ): NormalizedImportRecord[] {
    return records.filter(
      (record) =>
        !measurementService.existsByMeasurement(
          record,
        ),
    )
  }

  static import(
    records: NormalizedImportRecord[],
  ): number {
    if (records.length === 0) {
      return 0
    }

    const measurements = records.map(
      mapToBloodPressureRecord,
    )

    measurementStore.createMany(
      measurements,
    )

    return measurements.length
  }
}
