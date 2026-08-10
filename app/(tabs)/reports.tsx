import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { useMemo, useState } from 'react'

import {
  Card,
  Screen,
  SectionTitle,
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
  reportService,
} from '@/features/reports/services/ReportService'

import {
  ReportPdfService,
} from '@/features/reports/services/ReportPdfService'

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

  const report = useMemo(
    () =>
      reportService.build(
        measurements,
        filter,
      ),
    [
      measurements,
      filter,
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
        contentContainerStyle={
          styles.content
        }
      >
        <View style={styles.header}>
          <Text variant="h1">
            Reportes
          </Text>

          <Text style={styles.subtitle}>
            Generá un informe de tus registros
            de presión arterial para compartir
            con tu médico.
          </Text>
        </View>

        <Card>
          <SectionTitle
            title="Período del reporte"
          />

          <StatisticsPeriodSelector
            value={filter.period}
            onChange={updatePeriod}
          />

          {filter.period === 'custom' ? (
            <StatisticsDateRangeSelector
              startDate={filter.startDate}
              endDate={filter.endDate}
              onChange={
                updateCustomRange
              }
            />
          ) : null}
        </Card>

        <Card>
          <SectionTitle
            title="Datos incluidos"
          />

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Nombre
            </Text>

            <Text>
              {report.patientName ??
                'No informado'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Edad
            </Text>

            <Text>
              {report.patientAge !==
              undefined
                ? `${report.patientAge} años`
                : 'No informada'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>
              Registros
            </Text>

            <Text>
              {report.records.length}
            </Text>
          </View>

          <Text
            variant="caption"
            style={styles.description}
          >
            El PDF incluirá el resumen
            estadístico y todos los registros
            del período seleccionado.
          </Text>
        </Card>

        {measurements.length === 0 ? (
          <Card>
            <Text variant="title">
              Sin registros
            </Text>

            <Text>
              Registrá una medición antes de
              generar un reporte.
            </Text>
          </Card>
        ) : null}

        {measurements.length > 0 &&
        report.records.length === 0 ? (
          <Card>
            <Text variant="title">
              Sin registros en este período
            </Text>

            <Text>
              Seleccioná otro período para
              generar el reporte.
            </Text>
          </Card>
        ) : null}

        {customRangeIncomplete ? (
          <Text
            variant="caption"
            style={styles.warning}
          >
            Seleccioná una fecha de inicio y
            una fecha de finalización para
            generar el reporte.
          </Text>
        ) : null}

        {error ? (
          <Card outlined>
            <Text style={styles.error}>
              {error}
            </Text>
          </Card>
        ) : null}

        <Button
          title={
            isGenerating
              ? 'Generando reporte...'
              : 'Generar y compartir PDF'
          }
          onPress={generateReport}
        />
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 32,
  },

  header: {
    gap: 6,
  },

  subtitle: {
    color: '#64748B',
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 6,
  },

  label: {
    fontWeight: '600',
  },

  description: {
    marginTop: 8,
    lineHeight: 18,
  },

  warning: {
    color: '#92400E',
    lineHeight: 18,
  },

  error: {
    color: '#B91C1C',
    lineHeight: 20,
  },
})
