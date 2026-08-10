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
  obesity: number | null
  familyHistoryCardiovascularDisease: number | null

  cardiovascularDisease: number | null
  heartFailure: number | null
  strokeHistory: number | null
  peripheralVascularDisease: number | null

  chronicKidneyDisease: number | null

  pregnancy: number | null
  olderAdult: number | null

  physicalActivityLevel: string | null
  alcoholConsumption: string | null
  dietaryPattern: string | null

  notes: string | null
}

function booleanToSql(value: boolean | undefined): number | null {
  if (value === undefined) {
    return null
  }

  return value ? 1 : 0
}

function sqlToBoolean(value: number | null): boolean | undefined {
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
    obesity: sqlToBoolean(row.obesity),
    familyHistoryCardiovascularDisease:
      sqlToBoolean(
        row.familyHistoryCardiovascularDisease,
      ),

    cardiovascularDisease:
      sqlToBoolean(row.cardiovascularDisease),
    heartFailure:
      sqlToBoolean(row.heartFailure),
    strokeHistory:
      sqlToBoolean(row.strokeHistory),
    peripheralVascularDisease:
      sqlToBoolean(row.peripheralVascularDisease),

    chronicKidneyDisease:
      sqlToBoolean(row.chronicKidneyDisease),

    pregnancy:
      sqlToBoolean(row.pregnancy),
    olderAdult:
      sqlToBoolean(row.olderAdult),

    physicalActivityLevel:
      row.physicalActivityLevel ?? undefined,
    alcoholConsumption:
      row.alcoholConsumption ?? undefined,
    dietaryPattern:
      row.dietaryPattern ?? undefined,

    notes:
      row.notes ?? undefined,
  }
}

export class ClinicalProfileRepository {
  getByPatientId(
    patientId: string,
  ): ClinicalContext | undefined {
    const row =
      database.getFirstSync<ClinicalProfileRow>(
        `
        SELECT *
        FROM clinical_profile
        WHERE patientId = ?
        `,
        [patientId],
      )

    if (!row) {
      return undefined
    }

    return mapRowToClinicalContext(row)
  }

  save(context: ClinicalContext): void {
    database.runSync(
      `
      INSERT OR REPLACE INTO clinical_profile (
        patientId,

        age,
        sex,

        height,
        weight,
        bmi,

        smoking,
        diabetes,
        dyslipidemia,
        obesity,
        familyHistoryCardiovascularDisease,

        cardiovascularDisease,
        heartFailure,
        strokeHistory,
        peripheralVascularDisease,

        chronicKidneyDisease,

        pregnancy,
        olderAdult,

        physicalActivityLevel,
        alcoholConsumption,
        dietaryPattern,

        notes
      )
      VALUES (
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?,
        ?, ?,
        ?, ?, ?,
        ?
      )
      `,
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
        booleanToSql(context.obesity),
        booleanToSql(
          context.familyHistoryCardiovascularDisease,
        ),

        booleanToSql(context.cardiovascularDisease),
        booleanToSql(context.heartFailure),
        booleanToSql(context.strokeHistory),
        booleanToSql(context.peripheralVascularDisease),

        booleanToSql(context.chronicKidneyDisease),

        booleanToSql(context.pregnancy),
        booleanToSql(context.olderAdult),

        context.physicalActivityLevel ?? null,
        context.alcoholConsumption ?? null,
        context.dietaryPattern ?? null,

        context.notes ?? null,
      ],
    )
  }

  delete(patientId: string): void {
    database.runSync(
      `
      DELETE FROM clinical_profile
      WHERE patientId = ?
      `,
      [patientId],
    )
  }

  exists(patientId: string): boolean {
    const row =
      database.getFirstSync<{ total: number }>(
        `
        SELECT COUNT(*) AS total
        FROM clinical_profile
        WHERE patientId = ?
        `,
        [patientId],
      )

    return (row?.total ?? 0) > 0
  }
}

export const clinicalProfileRepository =
  new ClinicalProfileRepository()
