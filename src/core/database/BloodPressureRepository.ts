import type { DashboardMetrics } from '@/domain/dashboard/DashboardMetrics'
import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import { database } from './database'

export class BloodPressureRepository {
  getAll(): BloodPressureRecord[] {
    const records =
      database.getAllSync<BloodPressureRecord>(
        `
        SELECT *
        FROM blood_pressure_records
        ORDER BY dateTime DESC
        `,
      )

    return records
  }

  getByDateRange(
    startDate: string,
    endDate?: string,
  ): BloodPressureRecord[] {
    if (endDate) {
      return database.getAllSync<BloodPressureRecord>(
        `
        SELECT *
        FROM blood_pressure_records
        WHERE datetime(dateTime) >= datetime(?)
          AND datetime(dateTime) <= datetime(?)
        ORDER BY datetime(dateTime) DESC
        `,
        [startDate, endDate],
      )
    }

    return database.getAllSync<BloodPressureRecord>(
      `
      SELECT *
      FROM blood_pressure_records
      WHERE datetime(dateTime) >= datetime(?)
      ORDER BY datetime(dateTime) DESC
      `,
      [startDate],
    )
  }

  getLatest(): BloodPressureRecord | null {
    return (
      database.getFirstSync<BloodPressureRecord>(
        `
        SELECT *
        FROM blood_pressure_records
        ORDER BY datetime(dateTime) DESC
        LIMIT 1
        `,
      ) ?? null
    )
  }

  getDashboardMetrics(): DashboardMetrics {
    const row =
      database.getFirstSync<{
        averageSystolic: number | null
        averageDiastolic: number | null
        averageHeartRate: number | null
        latestSystolic: number | null
        latestDiastolic: number | null
        latestDateTime: string | null
      }>(
        `
        SELECT
          (
            SELECT ROUND(AVG(systolic))
            FROM blood_pressure_records
            WHERE datetime(dateTime) >= datetime('now', '-7 days')
          ) AS averageSystolic,

          (
            SELECT ROUND(AVG(diastolic))
            FROM blood_pressure_records
            WHERE datetime(dateTime) >= datetime('now', '-7 days')
          ) AS averageDiastolic,

          (
            SELECT ROUND(AVG(heartRate))
            FROM blood_pressure_records
            WHERE datetime(dateTime) >= datetime('now', '-7 days')
              AND heartRate IS NOT NULL
          ) AS averageHeartRate,

          (
            SELECT systolic
            FROM blood_pressure_records
            ORDER BY datetime(dateTime) DESC
            LIMIT 1
          ) AS latestSystolic,

          (
            SELECT diastolic
            FROM blood_pressure_records
            ORDER BY datetime(dateTime) DESC
            LIMIT 1
          ) AS latestDiastolic,

          (
            SELECT dateTime
            FROM blood_pressure_records
            ORDER BY datetime(dateTime) DESC
            LIMIT 1
          ) AS latestDateTime
        `,
      )

    return {
      averageSystolic:
        row?.averageSystolic ?? null,
      averageDiastolic:
        row?.averageDiastolic ?? null,
      averageHeartRate:
        row?.averageHeartRate ?? null,
      latestSystolic:
        row?.latestSystolic ?? null,
      latestDiastolic:
        row?.latestDiastolic ?? null,
      latestDateTime:
        row?.latestDateTime ?? null,
    }
  }

  create(record: BloodPressureRecord): void {
    database.runSync(
      `
      INSERT INTO blood_pressure_records (
        id,
        dateTime,
        systolic,
        diastolic,
        heartRate,
        weight,
        height,
        bmi,
        glucose,
        spo2,
        temperature,
        respiratoryRate,
        pain,
        notes,
        arm,
        position,
        guideline,
        createdAt,
        updatedAt
      )
      VALUES (
        ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
      )
      `,
      [
        record.id,
        record.dateTime,
        record.systolic,
        record.diastolic,
        record.heartRate ?? null,
        record.weight ?? null,
        record.height ?? null,
        record.bmi ?? null,
        record.glucose ?? null,
        record.spo2 ?? null,
        record.temperature ?? null,
        record.respiratoryRate ?? null,
        record.pain ?? null,
        record.notes ?? null,
        record.arm ?? null,
        record.position ?? null,
        record.guideline ?? null,
        record.createdAt,
        record.updatedAt,
      ],
    )
  }

  existsByMeasurement(
    record: Pick<
      BloodPressureRecord,
      | 'dateTime'
      | 'systolic'
      | 'diastolic'
      | 'heartRate'
      | 'arm'
      | 'position'
      | 'notes'
    >,
  ): boolean {
    const row =
      database.getFirstSync<{ total: number }>(
        `
        SELECT COUNT(*) AS total
        FROM blood_pressure_records
        WHERE dateTime = ?
          AND systolic = ?
          AND diastolic = ?
          AND COALESCE(heartRate, -1) =
              COALESCE(?, -1)
          AND COALESCE(arm, '') =
              COALESCE(?, '')
          AND COALESCE(position, '') =
              COALESCE(?, '')
          AND COALESCE(notes, '') =
              COALESCE(?, '')
        `,
        [
          record.dateTime,
          record.systolic,
          record.diastolic,
          record.heartRate ?? null,
          record.arm ?? null,
          record.position ?? null,
          record.notes ?? null,
        ],
      )

    return (row?.total ?? 0) > 0
  }

  createMany(
    records: BloodPressureRecord[],
  ): void {
    database.withTransactionSync(() => {
      for (const record of records) {
        database.runSync(
          `
          INSERT INTO blood_pressure_records (
            id,
            dateTime,
            systolic,
            diastolic,
            heartRate,
            weight,
            height,
            bmi,
            glucose,
            spo2,
            temperature,
            respiratoryRate,
            pain,
            notes,
            arm,
            position,
            guideline,
            createdAt,
            updatedAt
          )
          VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
          )
          `,
          [
            record.id,
            record.dateTime,
            record.systolic,
            record.diastolic,
            record.heartRate ?? null,
            record.weight ?? null,
            record.height ?? null,
            record.bmi ?? null,
            record.glucose ?? null,
            record.spo2 ?? null,
            record.temperature ?? null,
            record.respiratoryRate ?? null,
            record.pain ?? null,
            record.notes ?? null,
            record.arm ?? null,
            record.position ?? null,
            record.guideline ?? null,
            record.createdAt,
            record.updatedAt,
          ],
        )
      }
    })
  }

  update(record: BloodPressureRecord): void {
    database.runSync(
      `
      UPDATE blood_pressure_records
      SET
        dateTime = ?,
        systolic = ?,
        diastolic = ?,
        heartRate = ?,
        notes = ?,
        arm = ?,
        position = ?,
        updatedAt = ?
      WHERE id = ?
      `,
      [
        record.dateTime,
        record.systolic,
        record.diastolic,
        record.heartRate ?? null,
        record.notes ?? null,
        record.arm ?? null,
        record.position ?? null,
        record.updatedAt,
        record.id,
      ],
    )
  }

  delete(id: string): void {
    database.runSync(
      `
      DELETE FROM blood_pressure_records
      WHERE id = ?
      `,
      [id],
    )
  }

  count(): number {
    const row =
      database.getFirstSync<{ total: number }>(
        `
        SELECT COUNT(*) AS total
        FROM blood_pressure_records
        `,
      )

    return row?.total ?? 0
  }

  clear(): void {
    database.runSync(
      `
      DELETE FROM blood_pressure_records
      `,
    )
  }
}

export const bloodPressureRepository =
  new BloodPressureRepository()
