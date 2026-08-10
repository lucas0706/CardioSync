import { StyleSheet, View } from 'react-native'

import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'
import type {
  BloodPressureCategory,
} from '@/domain/clinical/classification'
import type { StatisticsSummary } from '@/domain/statistics/models'

import { StatisticsMetricCard } from './StatisticsMetricCard'

interface Props {
  summary: StatisticsSummary
}

export function StatisticsSummaryGrid({
  summary,
}: Props) {
  return (
    <View style={styles.grid}>
      <StatisticsMetricCard
        title="Registros"
        value={summary.totalMeasurements}
      />

      <StatisticsMetricCard
        title="Promedio"
        value={`${Math.round(summary.averageSystolic)}/${Math.round(summary.averageDiastolic)}`}
      />

      <StatisticsMetricCard
        title="Frecuencia cardíaca"
        value={
          summary.averageHeartRate
            ? Math.round(summary.averageHeartRate)
            : '--'
        }
      />

      <StatisticsMetricCard
        title="MAP"
        value={Math.round(summary.meanArterialPressureAverage)}
      />

      <StatisticsMetricCard
        title="Presión de pulso"
        value={Math.round(summary.pulsePressureAverage)}
      />

      <StatisticsMetricCard
        title="Variabilidad PAS"
        value={`${summary.systolicVariability.toFixed(1)}%`}
      />

      <StatisticsMetricCard
        title="Variabilidad PAD"
        value={`${summary.diastolicVariability.toFixed(1)}%`}
      />

      <StatisticsMetricCard
        title="Máximo"
        value={`${summary.maximumSystolic}/${summary.maximumDiastolic}`}
      />

      <StatisticsMetricCard
        title="Mínimo"
        value={`${summary.minimumSystolic}/${summary.minimumDiastolic}`}
      />

      <StatisticsMetricCard
        title="Desvío estándar"
        value={summary.systolicStandardDeviation.toFixed(1)}
      />

      <StatisticsMetricCard
        title="Tendencia"
        value={summary.trend}
      />

      <StatisticsMetricCard
        title="Adherencia"
        value={`${summary.adherence.toFixed(0)}%`}
      />

      <StatisticsMetricCard
        title="Tiempo en objetivo"
        value={`${summary.timeInTarget.toFixed(0)}%`}
      />

      <StatisticsMetricCard
        title="Carga hipertensiva"
        value={`${summary.hypertensionLoad.toFixed(0)}%`}
      />

      <StatisticsMetricCard
        title="Clasificación predominante"
        value={
          summary.predominantClassification
            ? BloodPressureClassifier.getClassification(
                summary.predominantClassification as BloodPressureCategory,
              ).label
            : '--'
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    gap: 16,
    paddingBottom: 24,
  },
})
