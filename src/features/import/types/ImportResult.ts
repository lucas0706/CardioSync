import type { NormalizedImportRecord } from './NormalizedImportRecord'

export type ImportRecordError = {
  row: number
  message: string
}

export type ImportResult = {
  records: NormalizedImportRecord[]
  errors: ImportRecordError[]
  duplicateIndexes: number[]
  totalRows: number
}
