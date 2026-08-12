import * as SQLite from 'expo-sqlite'

import {
  normalizeImportRecord,
  type RawImportRecord,
} from '../services/ImportNormalizer'

import type { NormalizedImportRecord } from '../types/NormalizedImportRecord'
import type {
  ImportRecordError,
  ImportResult,
} from '../types/ImportResult'

type TranxRow = {
  sys: number | null
  dia: number | null
  pulse: number | null
  siteId: number | null
  positionID: number | null
  note: string | null
  tranxDate: string | null
  tranxTime: string | null
}

type TableInfoRow = {
  name: string
}

const REQUIRED_TRANX_COLUMNS = [
  'sys',
  'dia',
  'pulse',
  'siteId',
  'positionID',
  'note',
  'tranxDate',
  'tranxTime',
]

function normalizeDateTime(
  date: string | null,
  time: string | null,
): string {
  if (!date || !time) {
    return ''
  }

  return `${date.trim()} ${time.trim()}`
}

function mapSiteId(
  siteId: number | null,
): string | undefined {
  if (siteId === 0) {
    return 'left'
  }

  if (siteId === 1) {
    return 'right'
  }

  return undefined
}

function mapPositionId(
  positionId: number | null,
): string | undefined {
  if (positionId === 0) {
    return 'sitting'
  }

  if (positionId === 1) {
    return 'standing'
  }

  if (positionId === 2) {
    return 'lying'
  }

  return undefined
}

function createRawRecord(
  row: TranxRow,
): RawImportRecord {
  return {
    dateTime: normalizeDateTime(
      row.tranxDate,
      row.tranxTime,
    ),
    systolic:
      row.sys == null
        ? Number.NaN
        : row.sys,
    diastolic:
      row.dia == null
        ? Number.NaN
        : row.dia,
    heartRate:
      row.pulse == null
        ? undefined
        : row.pulse,
    arm: mapSiteId(row.siteId),
    position: mapPositionId(
      row.positionID,
    ),
    notes:
      row.note == null
        ? undefined
        : row.note,
  }
}

function createDuplicateKey(
  record: NormalizedImportRecord,
): string {
  return [
    record.dateTime,
    record.systolic,
    record.diastolic,
    record.heartRate ?? '',
    record.arm ?? '',
    record.position ?? '',
    record.notes ?? '',
  ].join('|')
}

async function validateTranxTable(
  database: SQLite.SQLiteDatabase,
): Promise<void> {
  const tables =
    await database.getAllAsync<TableInfoRow>(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name = 'tranx'
    `)

  if (tables.length === 0) {
    throw new Error(
      'La base SQLite no contiene la tabla de mediciones "tranx".',
    )
  }

  const columns =
    await database.getAllAsync<{ name: string }>(`
      PRAGMA table_info(tranx)
    `)

  const availableColumns =
    new Set(
      columns.map(
        (column) => column.name,
      ),
    )

  const missingColumns =
    REQUIRED_TRANX_COLUMNS.filter(
      (column) =>
        !availableColumns.has(column),
    )

  if (missingColumns.length > 0) {
    throw new Error(
      `La tabla "tranx" no tiene las columnas requeridas: ${missingColumns.join(', ')}`,
    )
  }
}

export async function parseDbImport(
  databaseName: string,
  directory: string,
): Promise<ImportResult> {
  const errors: ImportRecordError[] = []
  const records: NormalizedImportRecord[] = []
  const duplicateIndexes: number[] = []
  const seen = new Set<string>()

  const database =
    await SQLite.openDatabaseAsync(
      databaseName,
      undefined,
      directory,
    )

  try {
    await validateTranxTable(database)

    const rows =
      await database.getAllAsync<TranxRow>(`
        SELECT
          sys,
          dia,
          pulse,
          siteId,
          positionID,
          note,
          tranxDate,
          tranxTime
        FROM tranx
        ORDER BY
          tranxDate ASC,
          tranxTime ASC
      `)

    for (
      let index = 0;
      index < rows.length;
      index += 1
    ) {
      const rowNumber = index + 1

      const raw =
        createRawRecord(
          rows[index],
        )

      const normalized =
        normalizeImportRecord(raw)

      if (!normalized.success) {
        errors.push({
          row: rowNumber,
          message: normalized.error,
        })

        continue
      }

      const duplicateKey =
        createDuplicateKey(
          normalized.record,
        )

      if (seen.has(duplicateKey)) {
        duplicateIndexes.push(
          rowNumber,
        )

        continue
      }

      seen.add(duplicateKey)

      records.push(
        normalized.record,
      )
    }

    return {
      records,
      errors,
      duplicateIndexes,
      totalRows: rows.length,
    }
  } finally {
    await database.closeAsync()
  }
}
