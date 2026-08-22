import * as Crypto from 'expo-crypto'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { bloodPressureRepository } from '@/core/database/BloodPressureRepository'

const TEST_NOTE = 'CardioSync STATISTICS AUDIT'

function createDate(
  daysAgo: number,
  hour: number,
): string {
  const date = new Date()

  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, 0, 0, 0)

  return date.toISOString()
}

function createRecord(
  daysAgo: number,
  hour: number,
  systolic: number,
  diastolic: number,
  heartRate?: number,
): BloodPressureRecord {
  const dateTime = createDate(daysAgo, hour)

  return {
    id: Crypto.randomUUID(),
    dateTime,
    systolic,
    diastolic,
    heartRate,
    arm: 'left',
    position: 'sitting',
    notes: TEST_NOTE,
    createdAt: dateTime,
    updatedAt: dateTime,
  }
}

export function seedStatisticsAuditData(): number {
  removeStatisticsAuditData()

  const records: BloodPressureRecord[] = [
    createRecord(6, 8, 120, 80, 60),
    createRecord(6, 20, 130, 85, 70),

    createRecord(5, 8, 140, 90, 80),
    createRecord(5, 20, 150, 95),

    // Día 3: sin mediciones.

    createRecord(3, 8, 160, 100, 90),

    createRecord(2, 8, 110, 70, 55),
    createRecord(2, 20, 125, 75, 65),

    // Día 6: sin mediciones.

    createRecord(0, 8, 135, 85, 75),
    createRecord(0, 20, 145, 90),
  ]

  bloodPressureRepository.createMany(records)

  return records.length
}

export function removeStatisticsAuditData(): void {
  const records = bloodPressureRepository.getAll()

  for (const record of records) {
    if (record.notes === TEST_NOTE) {
      bloodPressureRepository.delete(record.id)
    }
  }
}

export function getStatisticsAuditData(): BloodPressureRecord[] {
  return bloodPressureRepository
    .getAll()
    .filter(record => record.notes === TEST_NOTE)
}
