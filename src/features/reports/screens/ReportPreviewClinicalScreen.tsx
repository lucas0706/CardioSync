import {
  useEffect,
  useState,
} from 'react'

import {
  ScrollView,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

import {
  Screen,
  Card,
  Text,
} from '@/components/ui'

import {
  ClinicalChart,
} from '@/components/charts/ClinicalChart'

import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'

import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

import {
  reportService,
} from '@/features/reports/services/ReportService'

import {
  reportHealthContextBuilder,
} from '@/features/reports/services/ReportHealthContextBuilder'

import type {
  ReportHealthContext,
} from '@/features/reports/models/ReportHealthContext'

import { theme } from '@/theme'

function formatHoursMinutes(
  hours?: number,
): string {
  if (
    hours === undefined ||
    !Number.isFinite(hours)
  ) {
    return '—'
  }

  const totalMinutes =
    Math.round(hours * 60)

  const hh =
    Math.floor(
      totalMinutes / 60,
    )

  const mm =
    totalMinutes % 60

  return `${hh} h ${mm} min`
}

export function ReportPreviewClinicalScreen() {
  const { measurements } =
    useMeasurements()

  const [
    healthContext,
    setHealthContext,
  ] = useState<
    ReportHealthContext | undefined
  >()

  useEffect(() => {
    console.log(
      '[REPORT SCREEN] mounted',
    )
    void (async () => {
      const context =
        await reportHealthContextBuilder.build()

      setHealthContext(
        context,
      )
    })()
  }, [])

  const report =
    reportService.build(
      measurements,
      {
        period: '30d',
      },
    )

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Reporte clínico
          </Text>

          <Text style={styles.subtitle}>
            Vista previa PDF médico
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              Registros
            </Text>

            <Text style={styles.metricValue}>
              {report.records.length}
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricLabel}>
              Promedio
            </Text>

            <Text style={styles.metricValue}>
              {Math.round(
                report.summary.averageSystolic,
              )}
              /
              {Math.round(
                report.summary.averageDiastolic,
              )}
            </Text>
          </Card>
        </View>

        <ClinicalChart
          records={report.records}
        />

        <Card style={styles.healthCard}>
          <Text style={styles.tableTitle}>
            Contexto fisiológico
          </Text>

          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <Text style={styles.metricLabel}>
                Pasos diarios promedio
              </Text>

              <Text style={styles.healthValue}>
                {
                  healthContext
                    ?.averageDailySteps30Days ??
                  '—'
                }
              </Text>
            </View>

            <View style={styles.healthItem}>
              <Text style={styles.metricLabel}>
                FC promedio
              </Text>

              <Text style={styles.healthValue}>
                {
                  healthContext
                    ?.averageHeartRate30Days ??
                  '—'
                } lpm
              </Text>
            </View>

            <View style={styles.healthItem}>
              <Text style={styles.metricLabel}>
                Sueño promedio
              </Text>

              <Text style={styles.healthValue}>
                {formatHoursMinutes(
                  healthContext
                    ?.averageSleepHours30Days,
                )}
              </Text>
            </View>

            <View style={styles.healthItem}>
              <Text style={styles.metricLabel}>
                Ejercicio acumulado
              </Text>

              <Text style={styles.healthValue}>
                {
                  healthContext
                    ?.exerciseMinutes30Days !=
                  null
                    ? formatHoursMinutes(
                        healthContext
                          .exerciseMinutes30Days /
                          60,
                      )
                    : '—'
                }
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.tableCard}>
          <Text style={styles.tableTitle}>
            Mediciones del período
          </Text>

          <View style={styles.tableHeader}>
            <Text
              style={[
                styles.headerCell,
                { flex: 1.7 },
              ]}
            >
              Fecha
            </Text>

            <Text
              style={[
                styles.headerCell,
                { flex: 1 },
              ]}
            >
              PA
            </Text>

            <Text
              style={[
                styles.headerCell,
                { flex: 0.7 },
              ]}
            >
              FC
            </Text>

            <Text
              style={[
                styles.headerCell,
                { flex: 1.8 },
              ]}
            >
              Clasificación
            </Text>
          </View>

          {report.records.map(
            (record, index) => {
              const classification =
                BloodPressureClassifier.classify(
                  record.systolic,
                  record.diastolic,
                )

              return (
                <View
                  key={record.id}
                  style={[
                    styles.row,
                    index % 2 === 0
                      ? styles.rowEven
                      : styles.rowOdd,
                  ]}
                >
                  <Text
                    style={[
                      styles.cell,
                      { flex: 1.7 },
                    ]}
                  >
                    {new Date(
                      record.dateTime,
                    ).toLocaleDateString()}
                  </Text>

                  <Text
                    style={[
                      styles.cellValue,
                      { flex: 1 },
                    ]}
                  >
                    {record.systolic}/
                    {record.diastolic}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      { flex: 0.7 },
                    ]}
                  >
                    {record.heartRate ??
                      '—'}
                  </Text>

                  <Text
                    style={[
                      styles.cell,
                      {
                        flex: 1.8,
                        color:
                          classification.color,
                      },
                    ]}
                  >
                    {classification.label}
                  </Text>
                </View>
              )
            },
          )}
        </Card>
      </ScrollView>
    </Screen>
  )
}

const styles: {
  content: ViewStyle
  header: ViewStyle
  title: TextStyle
  subtitle: TextStyle
  metricsRow: ViewStyle
  metricCard: ViewStyle
  metricLabel: TextStyle
  metricValue: TextStyle
  healthCard: ViewStyle
  healthGrid: ViewStyle
  healthItem: ViewStyle
  healthValue: TextStyle
  tableCard: ViewStyle
  tableTitle: TextStyle
  tableHeader: ViewStyle
  headerCell: TextStyle
  row: ViewStyle
  rowEven: ViewStyle
  rowOdd: ViewStyle
  cell: TextStyle
  cellValue: TextStyle
} = {
  content: {
    gap: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  header: {
    gap: 4,
  },

  title: {
    fontSize: 28,
    fontFamily:
      theme.typography.bold,
  },

  subtitle: {
    color:
      theme.colors.textSecondary,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  metricCard: {
    flex: 1,
  },

  metricLabel: {
    fontSize: 12,
    color:
      theme.colors.textSecondary,
  },

  metricValue: {
    marginTop: 6,
    fontSize: 24,
    fontFamily:
      theme.typography.bold,
  },

  healthCard: {
    padding: 16,
  },

  healthGrid: {
    gap: 12,
  },

  healthItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor:
      '#F8FAFC',
  },

  healthValue: {
    marginTop: 4,
    fontSize: 18,
    fontFamily:
      theme.typography.bold,
  },

  tableCard: {
    padding: 16,
  },

  tableTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontFamily:
      theme.typography.bold,
  },

  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor:
      theme.colors.border,
  },

  headerCell: {
    fontSize: 12,
    fontFamily:
      theme.typography.bold,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  rowEven: {
    backgroundColor:
      '#FFFFFF',
  },

  rowOdd: {
    backgroundColor:
      '#F8FAFC',
  },

  cell: {
    fontSize: 12,
  },

  cellValue: {
    fontSize: 13,
    fontFamily:
      theme.typography.bold,
  },
}
