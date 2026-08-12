import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { useState } from 'react'

import {
  Screen,
  Text,
} from '@/components/ui'

import {
  selectAndParseCsv,
} from '../services/CsvImportService'

import {
  selectAndParseDb,
} from '../services/DbImportService'

import {
  ImportPersistenceService,
} from '../services/ImportPersistenceService'

import type { ImportPreview } from '../models/ImportPreview'

import type { NormalizedImportRecord } from '../types/NormalizedImportRecord'

export default function ImportScreen() {
  const [preview, setPreview] =
    useState<ImportPreview | null>(null)

  const [records, setRecords] =
    useState<NormalizedImportRecord[]>([])

  const [loading, setLoading] =
    useState(false)

  const [importing, setImporting] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState<string | null>(null)

  const [existingCount, setExistingCount] =
    useState(0)

  const [status, setStatus] =
    useState('Esperando archivo.')

  async function handleSelectCsv() {
    await handleSelectFile('csv')
  }

  async function handleSelectDb() {
    await handleSelectFile('db')
  }

  async function handleSelectFile(
    type: 'csv' | 'db',
  ) {
    setLoading(true)
    setError(null)
    setSuccess(null)
    setPreview(null)
    setRecords([])
    setExistingCount(0)
    setStatus('Iniciando importación...')

    try {
      const result =
        type === 'csv'
          ? await selectAndParseCsv(setStatus)
          : await selectAndParseDb(setStatus)

      if (!result) {
        return
      }

      const existing =
        ImportPersistenceService.findExistingCount(
          result.result.records,
        )

      setPreview(result.preview)
      setRecords(result.result.records)
      setExistingCount(existing)

      setStatus(
        'Archivo validado. Revisá la vista previa antes de importar.',
      )
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : 'No se pudo procesar el archivo.'

      setError(message)
      setStatus(
        'La importación se detuvo por un error.',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleImport() {
    if (records.length === 0) {
      return
    }

    setImporting(true)
    setError(null)
    setSuccess(null)
    setStatus('Guardando mediciones...')

    try {
      const importedCount =
        ImportPersistenceService.import(
          ImportPersistenceService.filterNewRecords(
            records,
          ),
        )

      setSuccess(
        `Se importaron ${importedCount} mediciones correctamente.`,
      )

      setStatus(
        'Importación completada correctamente.',
      )
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : 'No se pudieron guardar las mediciones.'

      setError(message)
      setStatus(
        'La importación no se completó.',
      )
    } finally {
      setImporting(false)
    }
  }

  const newRecordCount =
    Math.max(
      records.length - existingCount,
      0,
    )

  return (
    <Screen>
      <View style={styles.container}>
        <Text variant="h1">
          Importar mediciones
        </Text>

        <Text>
          Importá mediciones desde archivos
          exportados por otras aplicaciones.
        </Text>

        <Text>
          Se importarán fecha, presión arterial,
          frecuencia cardíaca, brazo, posición
          y notas.
        </Text>

        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.button}
            onPress={handleSelectCsv}
            disabled={
              loading ||
              importing
            }
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text>
                Seleccionar archivo CSV
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={handleSelectDb}
            disabled={
              loading ||
              importing
            }
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text>
                Seleccionar base de datos DB
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <Text variant="h2">
            Estado
          </Text>

          <Text>
            {status}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text variant="h2">
              Error
            </Text>

            <Text>
              {error}
            </Text>
          </View>
        ) : null}

        {success ? (
          <View style={styles.successCard}>
            <Text variant="h2">
              Importación completada
            </Text>

            <Text>
              {success}
            </Text>
          </View>
        ) : null}

        {preview ? (
          <View style={styles.previewCard}>
            <Text variant="h2">
              Vista previa
            </Text>

            <Text>
              Archivo: {preview.fileName}
            </Text>

            <Text>
              Registros encontrados:{' '}
              {preview.totalRows}
            </Text>

            <Text>
              Registros válidos:{' '}
              {preview.validRecords}
            </Text>

            <Text>
              Duplicados:{' '}
              {preview.duplicateCount}
            </Text>

            <Text>
              Errores:{' '}
              {preview.errorCount}
            </Text>

            <Text>
              Sin frecuencia cardíaca:{' '}
              {preview.missingHeartRateCount}
            </Text>

            <Text>
              Ya existentes en CardioSync:{' '}
              {existingCount}
            </Text>

            <Text>
              Nuevos para importar:{' '}
              {newRecordCount}
            </Text>

            <Text style={styles.warning}>
              Ningún dato fue guardado todavía.
            </Text>
          </View>
        ) : null}

        {preview &&
        records.length > 0 &&
        newRecordCount > 0 &&
        !success ? (
          <Pressable
            style={styles.importButton}
            onPress={handleImport}
            disabled={importing}
          >
            {importing ? (
              <ActivityIndicator />
            ) : (
              <Text>
                Importar {newRecordCount} registros
              </Text>
            )}
          </Pressable>
        ) : null}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  buttonGroup: {
    gap: 12,
  },

  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },

  importButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    gap: 8,
  },

  previewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    gap: 8,
  },

  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    gap: 8,
  },

  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    gap: 8,
  },

  warning: {
    marginTop: 8,
    fontWeight: '600',
  },
})
