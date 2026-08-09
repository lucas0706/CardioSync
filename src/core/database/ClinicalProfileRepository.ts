import type { ClinicalContext } from '@/domain/clinical/models/ClinicalContext'

import { database } from './database'

type ClinicalProfileRow = {
  patientId: string

  age: number | null
  sex: 'male' | 'female' | null

  height: number | null
  weight: number | null
  bmi: number | null

  smoking: number | null
  diabetes: number | null
  dyslipidemia: number | null

  cardiovascularDisease: number | null
  heartFailure: number | null
  strokeHistory: number | null
  peripheralVascularDisease: number | null

  chronicKidneyDisease: number | null
}

function booleanToSql(
  value: boolean | undefined,
): number | null {
  if (value === undefined) {
    return null
  }

  return value ? 1 : 0
}

function sqlToBoolean(
  value: number | null,
): boolean | undefined {
  if (value === null) {
    return undefined
  }

  return value === 1
}

function mapRowToClinicalContext(
  row: ClinicalProfileRow,
): ClinicalContext {
  return {
    patientId: row.patientId,

    age: row.age ?? undefined,
    sex: row.sex ?? undefined,

    height: row.height ?? undefined,
    weight: row.weight ?? undefined,
    bmi: row.bmi ?? undefined,

    smoking: sqlToBoolean(row.smoking),
    diabetes: sqlToBoolean(row.diabetes),
    dyslipidemia: sqlToBoolean(row.dyslipidemia),

    cardiovascularDisease:
      sqlToBoolean(
        row.cardiovascularDisease,
      ),

    heartFailure:
      sqlToBoolean(row.heartFailure),

    strokeHistory:
      sqlToBoolean(row.strokeHistory),

    peripheralVascularDisease:
      sqlToBoolean(
        row.peripheralVascularDisease,
      ),

    chronicKidneyDisease:
      sqlToBoolean(
        row.chronicKidneyDisease,
      ),
  }
}

export class ClinicalProfileRepository {
  getByPatientId(
    patientId: string,
  ): ClinicalContext | undefined {
    const row =
      database.getFirstSync<ClinicalProfileRow>(
        `SELECT
          patientId,
          age,
          sex,
          height,
          weight,
          bmi,
          smoking,
          diabetes,
          dyslipidemia,
          cardiovascularDisease,
          heartFailure,
          strokeHistory,
          peripheralVascularDisease,
          chronicKidneyDisease
        FROM clinical_profile
        WHERE patientId = ?`,
        [patientId],
      )

    if (!row) {
      return undefined
    }

    return mapRowToClinicalContext(row)
  }

  save(context: ClinicalContext): void {
    database.runSync(
      `INSERT OR REPLACE INTO clinical_profile (
        patientId,

        age,
        sex,

        height,
        weight,
        bmi,

        smoking,
        diabetes,
        dyslipidemia,

        cardiovascularDisease,
        heartFailure,
        strokeHistory,
        peripheralVascularDisease,

        chronicKidneyDisease
      )
      VALUES (
        ?,
        ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?
      )`,
      [
        context.patientId,

        context.age ?? null,
        context.sex ?? null,

        context.height ?? null,
        context.weight ?? null,
        context.bmi ?? null,

        booleanToSql(context.smoking),
        booleanToSql(context.diabetes),
        booleanToSql(context.dyslipidemia),

        booleanToSql(
          context.cardiovascularDisease,
        ),

        booleanToSql(
          context.heartFailure,
        ),

        booleanToSql(
          context.strokeHistory,
        ),

        booleanToSql(
          context.peripheralVascularDisease,
        ),

        booleanToSql(
          context.chronicKidneyDisease,
        ),
      ],
    )
  }

  delete(patientId: string): void {
    database.runSync(
      `DELETE FROM clinical_profile
       WHERE patientId = ?`,
      [patientId],
    )
  }

  exists(patientId: string): boolean {
    const row =
      database.getFirstSync<{ total: number }>(
        `SELECT COUNT(*) AS total
         FROM clinical_profile
         WHERE patientId = ?`,
        [patientId],
      )

    return (row?.total ?? 0) > 0
  }
}

export const clinicalProfileRepository =
  new ClinicalProfileRepository()
