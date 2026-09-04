import type {
  ImportRecordError,
  ImportResult,
} from '../types/ImportResult'
import {
  normalizeImportRecord,
  type RawImportRecord,
} from '../services/ImportNormalizer'
import type { NormalizedImportRecord } from '../types/NormalizedImportRecord'

type CsvRow = Record<string, string>

const REQUIRED_COLUMNS = [
  'Fecha',
  'Sistólica',
  'Diastólica',
  'Pulso',
  'Sitio',
  'Posición',
  'Nota',
]

function splitCsvRecords(content: string): string[] {
  const records: string[] = []
  let current = ''
  let insideQuotes = false

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index]

    if (character === '"') {
      if (insideQuotes && content[index + 1] === '"') {
        current += '""'
        index += 1
        continue
      }

      insideQuotes = !insideQuotes
      current += character
      continue
    }

    if (
      (character === '\n' || character === '\r') &&
      !insideQuotes
    ) {
      if (character === '\r' && content[index + 1] === '\n') {
        index += 1
      }

      if (current.trim().length > 0) {
        records.push(current)
      }

      current = ''
      continue
    }

    current += character
  }

  if (current.trim().length > 0) {
    records.push(current)
  }

  return records
}

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let insideQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]

    if (character === '"') {
      if (insideQuotes && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        insideQuotes = !insideQuotes
      }

      continue
    }

    if (character === ',' && !insideQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += character
  }

  values.push(current.trim())

  return values
}

function parseCsvRows(content: string): CsvRow[] {
  const records = splitCsvRecords(content)

  if (records.length === 0) {
    return []
  }

  const headers = parseCsvLine(records[0])
  const rows: CsvRow[] = []

  for (let index = 1; index < records.length; index += 1) {
    const values = parseCsvLine(records[index])
    const row: CsvRow = {}

    headers.forEach((header, columnIndex) => {
      row[header] = values[columnIndex] ?? ''
    })

    rows.push(row)
  }

  return rows
}

function parseNumber(
  value: string | undefined,
): number | undefined {
  const normalized = value?.trim()

  if (!normalized) {
    return undefined
  }

  const parsed = Number(normalized)

  return Number.isFinite(parsed) ? parsed : undefined
}

function createRawRecord(row: CsvRow): RawImportRecord {
  return {
    dateTime: row['Fecha']?.trim() ?? '',
    systolic: parseNumber(row['Sistólica']) ?? Number.NaN,
    diastolic: parseNumber(row['Diastólica']) ?? Number.NaN,
    heartRate: parseNumber(row['Pulso']),
    arm: row['Sitio'],
    position: row['Posición'],
    notes: row['Nota'],
  }
}

function createDuplicateKey(
  record: RawImportRecord,
): string {
  return [
    record.dateTime.trim(),
    record.systolic,
    record.diastolic,
    record.heartRate ?? '',
    record.arm?.trim().toLowerCase() ?? '',
    record.position?.trim().toLowerCase() ?? '',
    record.notes?.trim() ?? '',
  ].join('|')
}

function validateColumns(headers: string[]): string[] {
  return REQUIRED_COLUMNS.filter(
    (column) => !headers.includes(column),
  )
}

export function parseCsvImport(
  content: string,
): ImportResult {
  const errors: ImportRecordError[] = []
  const records: NormalizedImportRecord[] = []
  const duplicateIndexes: number[] = []
  const seen = new Set<string>()

  const csvRecords = splitCsvRecords(
    content.replace(/^\\uFEFF/, ''),
  )

  if (csvRecords.length === 0) {
    return {
      records: [],
      errors: [
        {
          row: 1,
          message: 'El archivo CSV está vacío.',
        },
      ],
      duplicateIndexes: [],
      totalRows: 0,
    }
  }

  const headers = parseCsvLine(csvRecords[0])
  const missingColumns = validateColumns(headers)

  if (missingColumns.length > 0) {
    return {
      records: [],
      errors: [
        {
          row: 1,
          message: `Faltan columnas requeridas: ${missingColumns.join(', ')}`,
        },
      ],
      duplicateIndexes: [],
      totalRows: csvRecords.length - 1,
    }
  }

  for (let index = 1; index < csvRecords.length; index += 1) {
    const rowNumber = index + 1
    const values = parseCsvLine(csvRecords[index])

    if (values.length !== headers.length) {
      errors.push({
        row: rowNumber,
        message: `Cantidad de columnas inválida: se esperaban ${headers.length} y se encontraron ${values.length}.`,
      })
      continue
    }

    const row: CsvRow = {}

    headers.forEach((header, columnIndex) => {
      row[header] = values[columnIndex] ?? ''
    })

    const raw = createRawRecord(row)
    const normalized = normalizeImportRecord(raw)

    if (!normalized.success) {
      errors.push({
        row: rowNumber,
        message: normalized.error,
      })
      continue
    }

    const duplicateKey = createDuplicateKey(raw)

    if (seen.has(duplicateKey)) {
      duplicateIndexes.push(rowNumber)
      continue
    }

    seen.add(duplicateKey)
    records.push(normalized.record)
  }

  return {
    records,
    errors,
    duplicateIndexes,
    totalRows: csvRecords.length - 1,
  }
}
