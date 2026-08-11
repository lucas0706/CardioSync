import { database } from './database'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

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

  create(record: BloodPressureRecord): void {
    database.runSync(
      `
      INSERT INTO blood_pressure_records (
        -- Core measurement
        id,
        dateTime,
        systolic,
        diastolic,
        heartRate,

        -- Legacy compatibility
        weight,
        height,
        bmi,
        glucose,
        spo2,
        temperature,
        respiratoryRate,
        pain,

        -- Measurement metadata
        notes,
        arm,
        position,

        -- Future analysis
        guideline,

        createdAt,
        updatedAt
      )
      VALUES (
        ?,?,?,?,?,
        ?,?,?,?,?,?,?,?,
        ?,?,?,?,
        ?,?
      )
      `,
      [
        // Core measurement
        record.id,
        record.dateTime,
        record.systolic,
        record.diastolic,
        record.heartRate ?? null,

        // Legacy compatibility
        record.weight ?? null,
        record.height ?? null,
        record.bmi ?? null,
        record.glucose ?? null,
        record.spo2 ?? null,
        record.temperature ?? null,
        record.respiratoryRate ?? null,
        record.pain ?? null,

        // Measurement metadata
        record.notes ?? null,
        record.arm ?? null,
        record.position ?? null,

        // Future analysis
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

  createMany(records: BloodPressureRecord[]): void {
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
    const row = database.getFirstSync<{ total: number }>(
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
