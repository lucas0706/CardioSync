import * as DocumentPicker from 'expo-document-picker'
import { File, Paths } from 'expo-file-system'

import { parseDbImport } from '../parsers/DbImportParser'
import type { ImportPreview } from '../models/ImportPreview'
import type { ImportResult } from '../types/ImportResult'

export type DbImportSelection = {
  preview: ImportPreview
  result: ImportResult
  fileUri: string
}

function createTemporaryDatabaseName(
  originalName: string,
): string {
  const sanitizedName =
    originalName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.db$/i, '')

  return `cardiosync-import-${Date.now()}-${sanitizedName}.db`
}

export async function selectAndParseDb(
  onStatus?: (status: string) => void,
): Promise<DbImportSelection | null> {
  onStatus?.('Abriendo selector de archivos...')

  const selection =
    await DocumentPicker.getDocumentAsync({
      type: 'application/octet-stream',
      copyToCacheDirectory: true,
      multiple: false,
    })

  onStatus?.(
    `Selector cerrado. cancelado=${selection.canceled}`,
  )

  if (selection.canceled) {
    onStatus?.('Selección cancelada.')
    return null
  }

  const asset = selection.assets[0]

  if (!asset) {
    throw new Error(
      'El selector no devolvió ningún archivo.',
    )
  }

  onStatus?.(
    `Archivo seleccionado: ${asset.name}`,
  )

  const temporaryName =
    createTemporaryDatabaseName(asset.name)

  const sourceFile = new File(asset.uri)

  const temporaryFile =
    new File(Paths.cache, temporaryName)

  onStatus?.(
    'Preparando copia temporal de la base...',
  )

  sourceFile.copy(temporaryFile)

  try {
    onStatus?.(
      'Validando y leyendo la base SQLite...',
    )

    const result =
      await parseDbImport(
        temporaryName,
        Paths.cache.uri,
      )

    onStatus?.(
      `Base procesada: ${result.records.length} registros válidos.`,
    )

    const missingHeartRateCount =
      result.records.filter(
        (record) =>
          record.heartRate === undefined,
      ).length

    return {
      preview: {
        fileName: asset.name,
        totalRows: result.totalRows,
        validRecords: result.records.length,
        duplicateCount:
          result.duplicateIndexes.length,
        errorCount: result.errors.length,
        missingHeartRateCount,
      },
      result,
      fileUri: asset.uri,
    }
  } finally {
    if (temporaryFile.exists) {
      temporaryFile.delete()
    }
  }
}
