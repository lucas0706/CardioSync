import {
  ScrollView,
  StyleSheet,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native'

import { useMemo, useState } from 'react'

import {
  Card,
  Screen,
  Text,
  Button,
} from '@/components/ui'

import {
  StatisticsDateRangeSelector,
  StatisticsPeriodSelector,
} from '@/features/statistics/components'

import type {
  StatisticsFilter,
} from '@/domain/statistics/models'

import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

import {
  useClinicalProfile,
} from '@/features/profile/hooks'

import {
  reportService,
} from '@/features/reports/services/ReportService'

import {
  ReportPdfService,
} from '@/features/reports/services/ReportPdfService'

import { theme } from '@/theme'

export default function ReportsScreen() {
  const {
    measurements,
  } = useMeasurements()

  const [filter, setFilter] =
    useState<StatisticsFilter>({
      period: '30d',
    })

  const [isGenerating, setIsGenerating] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const {
    profile,
  } = useClinicalProfile()

  const report = useMemo(
    () =>
      reportService.build(
        measurements,
        filter,
      ),
    [
      measurements,
      filter,
      profile,
    ],
  )

  const updatePeriod = (
    period: StatisticsFilter['period'],
  ) => {
    setError(null)

    setFilter(current => ({
      ...current,
      period,
      ...(period !== 'custom'
        ? {
            startDate: undefined,
            endDate: undefined,
          }
        : {}),
    }))
  }

  const updateCustomRange = (
    startDate: Date,
    endDate?: Date,
  ) => {
    setError(null)

    setFilter(current => ({
      ...current,
      startDate,
      endDate,
    }))
  }

  const customRangeIncomplete =
    filter.period === 'custom' &&
    (
      !filter.startDate ||
      !filter.endDate
    )

  const canGenerate =
    !isGenerating &&
    !customRangeIncomplete &&
    report.records.length > 0

  const generateReport = async () => {
    if (!canGenerate) {
      return
    }

    setError(null)
    setIsGenerating(true)

    try {
      await ReportPdfService.generateAndShare(
        report,
      )
    } catch (cause) {
      const message =
        cause instanceof Error
          ? cause.message
          : 'No se pudo generar el reporte.'

      setError(message)
    } finally {
      setIsGenerating(false)
    }
  }

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
            Reportes
          </Text>

          <Text style={styles.subtitle}>
            Generá un informe de tus registros
            de presión arterial para compartir
            con tu médico.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.overline}>
            PERÍODO
          </Text>

          <Card style={styles.card}>
            <StatisticsPeriodSelector
              value={filter.period}
              onChange={updatePeriod}
            />

            {filter.period === 'custom' ? (
              <View style={styles.customRange}>
                <StatisticsDateRangeSelector
                  startDate={filter.startDate}
                  endDate={filter.endDate}
                  onChange={
                    updateCustomRange
                  }
                />
              </View>
            ) : null}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.overline}>
            DATOS INCLUIDOS
          </Text>

          <Card style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Nombre
                </Text>

                <Text style={styles.infoValue}>
                  {report.patientName ??
                    'No informado'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Edad
                </Text>

                <Text style={styles.infoValue}>
                  {report.patientAge !==
                  undefined
                    ? `${report.patientAge} años`
                    : 'No informada'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  Registros
                </Text>

                <Text style={styles.infoValue}>
                  {report.records.length}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>
              El PDF incluirá el resumen
              estadístico y todos los registros
              del período seleccionado.
            </Text>
          </Card>
        </View>

        {measurements.length === 0 ? (
          <View style={styles.section}>
            <Text style={styles.overline}>
              ESTADO
            </Text>

            <Card style={styles.emptyCard}>
              <Text style={styles.stateTitle}>
                Sin registros
              </Text>

              <Text style={styles.stateDescription}>
                Registrá una medición antes de
                generar un reporte.
              </Text>
            </Card>
          </View>
        ) : null}

        {measurements.length > 0 &&
        report.records.length === 0 ? (
          <View style={styles.section}>
            <Text style={styles.overline}>
              ESTADO
            </Text>

            <Card style={styles.emptyCard}>
              <Text style={styles.stateTitle}>
                Sin registros en este período
              </Text>

              <Text style={styles.stateDescription}>
                Seleccioná otro período para
                generar el reporte.
              </Text>
            </Card>
          </View>
        ) : null}

        {customRangeIncomplete ? (
          <Text style={styles.warning}>
            Seleccioná una fecha de inicio y
            una fecha de finalización para
            generar el reporte.
          </Text>
        ) : null}

        {error ? (
          <Card
            outlined
            style={styles.errorCard}
          >
            <Text style={styles.error}>
              {error}
            </Text>
          </Card>
        ) : null}

        <View style={styles.actionSection}>
          <Button
            title={
              isGenerating
                ? 'Generando reporte...'
                : 'Generar y compartir PDF'
            }
            onPress={generateReport}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles: {
  content: ViewStyle
  header: ViewStyle
  title: TextStyle
  subtitle: TextStyle
  section: ViewStyle
  overline: TextStyle
  card: ViewStyle
  customRange: ViewStyle
  infoRow: ViewStyle
  infoContent: ViewStyle
  infoLabel: TextStyle
  infoValue: TextStyle
  divider: ViewStyle
  description: TextStyle
  emptyCard: ViewStyle
  stateTitle: TextStyle
  stateDescription: TextStyle
  warning: TextStyle
  errorCard: ViewStyle
  error: TextStyle
  actionSection: ViewStyle
} = {
  content: {
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  header: {
    gap: theme.spacing.xs,
  },

  title: {
    fontFamily:
      theme.typography.bold as string,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily:
      theme.typography.regular as string,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.textSecondary,
  },

  section: {
    gap: theme.spacing.sm,
  },

  overline: {
    fontFamily:
      theme.typography.semiBold as string,
    fontSize:
      theme.typography.overline,
    lineHeight: 16,
    letterSpacing: 0.8,
    color:
      theme.colors.textSecondary,
  },

  card: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  customRange: {
    paddingTop: theme.spacing.xs,
  },

  infoRow: {
    minHeight: 42,
    justifyContent: 'center',
  },

  infoContent: {
    gap: 2,
  },

  infoLabel: {
    fontFamily:
      theme.typography.regular as string,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  infoValue: {
    fontFamily:
      theme.typography.semiBold as string,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.text,
  },

  divider: {
    height:
      StyleSheet.hairlineWidth,
    backgroundColor:
      theme.colors.border,
  },

  description: {
    marginTop: theme.spacing.xs,
    fontFamily:
      theme.typography.regular as string,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },

  emptyCard: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },

  stateTitle: {
    fontFamily:
      theme.typography.semiBold as string,
    fontSize:
      theme.typography.title,
    lineHeight: 24,
    color:
      theme.colors.text,
  },

  stateDescription: {
    fontFamily:
      theme.typography.regular as string,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.textSecondary,
  },

  warning: {
    fontFamily:
      theme.typography.regular as string,
    fontSize:
      theme.typography.caption,
    lineHeight: 19,
    color:
      theme.colors.textSecondary,
  },

  errorCard: {
    padding: theme.spacing.md,
  },

  error: {
    fontFamily:
      theme.typography.regular as string,
    fontSize:
      theme.typography.caption,
    lineHeight: 19,
    color:
      theme.colors.text,
  },

  actionSection: {
    paddingTop: theme.spacing.xs,
  },
}

