import * as DocumentPicker from 'expo-document-picker'
import { File } from 'expo-file-system'

import { parseCsvImport } from '../parsers/CsvImportParser'
import type { ImportPreview } from '../models/ImportPreview'
import type { ImportResult } from '../types/ImportResult'

export type CsvImportSelection = {
  preview: ImportPreview
  result: ImportResult
  fileUri: string
}

export async function selectAndParseCsv(
  onStatus?: (status: string) => void,
): Promise<CsvImportSelection | null> {
  onStatus?.('Abriendo selector de archivos...')

  const selection =
    await DocumentPicker.getDocumentAsync({
      type: '*/*',
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

  onStatus?.(
    `URI: ${asset.uri}`,
  )

  const file = new File(asset.uri)

  onStatus?.(
    `Archivo creado. Existe=${file.exists}`,
  )

  onStatus?.('Leyendo contenido del archivo...')

  const content = await file.text()

  onStatus?.(
    `Archivo leído: ${content.length} caracteres.`,
  )

  onStatus?.('Procesando CSV...')

  const result = parseCsvImport(content)

  onStatus?.(
    `CSV procesado: ${result.records.length} registros válidos.`,
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
}
