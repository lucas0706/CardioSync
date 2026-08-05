import { database } from './database'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

export class BloodPressureRepository {
  getAll(): BloodPressureRecord[] {
    return database.getAllSync<BloodPressureRecord>(
      `
      SELECT *
      FROM blood_pressure_records
      ORDER BY datetime(dateTime) DESC
      `,
    )
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
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?
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
