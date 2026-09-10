import * as Crypto from 'expo-crypto'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  bloodPressureRepository,
} from '@/core/database/BloodPressureRepository'

const TEST_NOTE = 'CardioSync TEST DATA'

function createDate(
  daysAgo: number,
  hour: number,
): string {
  const date = new Date()

  date.setDate(
    date.getDate() - daysAgo,
  )

  date.setHours(
    hour,
    0,
    0,
    0,
  )

  return date.toISOString()
}

function createRecord(
  daysAgo: number,
  hour: number,
  systolic: number,
  diastolic: number,
  heartRate: number,
): BloodPressureRecord {
  const dateTime = createDate(
    daysAgo,
    hour,
  )

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

export function seedReportTestData(): number {
  let inserted = 0

  for (
    let daysAgo = 29;
    daysAgo >= 0;
    daysAgo--
  ) {
    const progression =
      (29 - daysAgo) * 0.18

    const morningSystolic =
      Math.round(
        124 +
          progression +
          Math.sin(daysAgo) * 4,
      )

    const eveningSystolic =
      Math.round(
        128 +
          progression +
          Math.cos(daysAgo) * 5,
      )

    const morningDiastolic =
      Math.round(
        77 +
          Math.sin(daysAgo * 0.7) * 3,
      )

    const eveningDiastolic =
      Math.round(
        79 +
          Math.cos(daysAgo * 0.6) * 3,
      )

    const morningHeartRate =
      Math.round(
        68 +
          Math.sin(daysAgo) * 4,
      )

    const eveningHeartRate =
      Math.round(
        72 +
          Math.cos(daysAgo) * 5,
      )

    const morning =
      createRecord(
        daysAgo,
        8,
        morningSystolic,
        morningDiastolic,
        morningHeartRate,
      )

    const evening =
      createRecord(
        daysAgo,
        20,
        eveningSystolic,
        eveningDiastolic,
        eveningHeartRate,
      )

    bloodPressureRepository.create(
      morning,
    )

    bloodPressureRepository.create(
      evening,
    )

    inserted += 2
  }

  return inserted
}

export function removeReportTestData(): void {
  const records =
    bloodPressureRepository.getAll()

  for (const record of records) {
    if (record.notes === TEST_NOTE) {
      bloodPressureRepository.delete(
        record.id,
      )
    }
  }
}

export function countReportTestData(): number {
  return bloodPressureRepository
    .getAll()
    .filter(
      record =>
        record.notes === TEST_NOTE,
    ).length
}
