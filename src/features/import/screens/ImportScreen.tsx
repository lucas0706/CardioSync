import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { useState } from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'

import {
  Card,
  Screen,
  Text,
} from '@/components/ui'

import { theme } from '@/theme'

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

    setStatus(
      'Guardando mediciones...',
    )

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
      <ScrollView contentContainerStyle={styles.container}>
        <Card>
          <View style={styles.iconContainer}>
            <Ionicons
              name="download-outline"
              size={44}
              color={theme.colors.primary}
            />
          </View>

          <Text variant="h1">
            Importar mediciones
          </Text>

          <Text style={styles.description}>
            Importá registros exportados desde
            otras aplicaciones compatibles.
          </Text>

          <Text style={styles.warning}>
            Revisá cuidadosamente la vista previa
            antes de confirmar la importación.
          </Text>

          <View style={styles.buttonGroup}>
            <Pressable
              style={styles.actionButton}
              onPress={handleSelectCsv}
              disabled={loading || importing}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>
                  Seleccionar CSV
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={handleSelectDb}
              disabled={loading || importing}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>
                  Seleccionar DB
                </Text>
              )}
            </Pressable>
          </View>
        </Card>

        <Card>
          <View style={styles.statusHeader}>
            <Ionicons
              name={
                error
                  ? 'alert-circle'
                  : success
                  ? 'checkmark-circle'
                  : loading || importing
                  ? 'sync'
                  : 'hourglass-outline'
              }
              size={28}
              color={
                error
                  ? '#DC2626'
                  : success
                  ? '#16A34A'
                  : loading || importing
                  ? theme.colors.primary
                  : '#F59E0B'
              }
            />

            <Text variant="h2">
              Estado
            </Text>
          </View>

          <Text style={styles.cardText}>
            {status}
          </Text>
        </Card>

        {error ? (
          <Card>
            <View style={styles.errorHeader}>
              <Ionicons
                name="alert-circle"
                size={30}
                color="#DC2626"
              />

              <Text variant="h2">
                Error de importación
              </Text>
            </View>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </Card>
        ) : null}

        {success ? (
          <Card>
            <View style={styles.successHeader}>
              <Ionicons
                name="checkmark-circle"
                size={32}
                color="#16A34A"
              />

              <Text variant="h2">
                Importación completada
              </Text>
            </View>

            <Text style={styles.successText}>
              {success}
            </Text>
          </Card>
        ) : null}

                {preview ? (
          <Card>
            <Text variant="h2">
            Vista previa
            </Text>

            <Text style={styles.cardText}>
              {preview.fileName}
            </Text>

            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>
                  {preview.totalRows}
                </Text>

                <Text style={styles.metricLabel}>
                  Encontrados
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>
                  {preview.validRecords}
                </Text>

                <Text style={styles.metricLabel}>
                  Válidos
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>
                  {newRecordCount}
                </Text>

                <Text style={styles.metricLabel}>
                  Nuevos
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>
                  {existingCount}
                </Text>

                <Text style={styles.metricLabel}>
                  Existentes
                </Text>
              </View>
            </View>

            <Text style={styles.previewDetail}>
              Duplicados: {preview.duplicateCount}
            </Text>

            <Text style={styles.previewDetail}>
              Errores: {preview.errorCount}
            </Text>

            <Text style={styles.previewDetail}>
              Sin frecuencia cardíaca:{' '}
              {preview.missingHeartRateCount}
            </Text>
          </Card>
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
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.importButtonText}>
                Importar {newRecordCount} registros
              </Text>
            )}
          </Pressable>
        ) : null}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  description: {
    marginTop: theme.spacing.sm,
  },

  warning: {
    marginTop: theme.spacing.md,
    color: theme.colors.danger,
    marginBottom: theme.spacing.lg,
  },

  buttonGroup: {
    gap: theme.spacing.sm,
  },

  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },

  buttonText: {
    color: theme.colors.white,
  },

  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },


  statusTextSuccess: {
    color: "#16A34A",
  },

  statusTextError: {
    color: "#DC2626",
  },

  statusTextWarning: {
    color: "#F59E0B",
  },

  cardText: {
    marginTop: theme.spacing.sm,
  },


  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  errorText: {
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
  },

  importButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },

  importButtonText: {
    color: theme.colors.white,
    fontFamily: theme.typography.semiBold,
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },

  metricCard: {
    width: '47%',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },

  metricValue: {
    fontSize: 22,
    fontFamily: theme.typography.bold,
    color: theme.colors.primary,
  },

  metricLabel: {
    marginTop: 4,
    color: theme.colors.textSecondary,
  },

  qualitySection: {
    marginTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },

  detailValue: {
    fontFamily: theme.typography.bold,
    color: theme.colors.primary,
  },

  successHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  successText: {
    color: "#16A34A",
    fontFamily: theme.typography.semiBold,
  },


  previewDetail: {
    marginTop: 6,
  },
})
