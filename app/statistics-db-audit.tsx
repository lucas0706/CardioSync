import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import {
  Screen,
  Text,
} from '@/components/ui'

import {
  bloodPressureRepository,
} from '@/core/database/BloodPressureRepository'

import {
  StatisticsEngine,
} from '@/domain/statistics/engines/StatisticsEngine'

export default function StatisticsDbAuditScreen() {
  const records =
    bloodPressureRepository.getAll()

  const summary =
    StatisticsEngine.summarize(
      records,
      {
        period: '30d',
      },
    )

  const recordsWithHeartRate =
    records.filter(
      record =>
        record.heartRate !== undefined,
    ).length

  const recordsWithoutHeartRate =
    records.length -
    recordsWithHeartRate

  const measurementDays =
    new Set(
      records.map(record =>
        record.dateTime.slice(0, 10),
      ),
    ).size

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={
          styles.content
        }
      >
        <Text variant="h1">
          Statistics DB Audit
        </Text>

        <Text>
          Auditoría directa de los registros
          actualmente almacenados en SQLite.
        </Text>

        <View style={styles.section}>
          <Text variant="title">
            Base de datos
          </Text>

          <Text>
            Total de registros:{' '}
            {records.length}
          </Text>

          <Text>
            Con FC:{' '}
            {recordsWithHeartRate}
          </Text>

          <Text>
            Sin FC:{' '}
            {recordsWithoutHeartRate}
          </Text>

          <Text>
            Días con mediciones:{' '}
            {measurementDays}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="title">
            Período 30 días
          </Text>

          <Text>
            Total filtrado:{' '}
            {summary.totalMeasurements}
          </Text>

          <Text>
            PAS promedio:{' '}
            {summary.averageSystolic.toFixed(2)}
          </Text>

          <Text>
            PAD promedio:{' '}
            {summary.averageDiastolic.toFixed(2)}
          </Text>

          <Text>
            FC promedio:{' '}
            {summary.averageHeartRate?.toFixed(2) ?? '—'}
          </Text>

          <Text>
            PAS máxima:{' '}
            {summary.maximumSystolic}
          </Text>

          <Text>
            PAS mínima:{' '}
            {summary.minimumSystolic}
          </Text>

          <Text>
            PAD máxima:{' '}
            {summary.maximumDiastolic}
          </Text>

          <Text>
            PAD mínima:{' '}
            {summary.minimumDiastolic}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="title">
            Hemodinámica
          </Text>

          <Text>
            Presión de pulso promedio:{' '}
            {summary.pulsePressureAverage.toFixed(2)}
          </Text>

          <Text>
            MAP promedio:{' '}
            {summary.meanArterialPressureAverage.toFixed(2)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="title">
            Variabilidad
          </Text>

          <Text>
            SD sistólica:{' '}
            {summary.systolicStandardDeviation.toFixed(2)}
          </Text>

          <Text>
            SD diastólica:{' '}
            {summary.diastolicStandardDeviation.toFixed(2)}
          </Text>

          <Text>
            Variabilidad sistólica:{' '}
            {summary.systolicVariability.toFixed(2)}
          </Text>

          <Text>
            Variabilidad diastólica:{' '}
            {summary.diastolicVariability.toFixed(2)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="title">
            Indicadores
          </Text>

          <Text>
            Carga de hipertensión:{' '}
            {summary.hypertensionLoad.toFixed(2)}%
          </Text>

          <Text>
            Tiempo en objetivo:{' '}
            {summary.timeInTarget.toFixed(2)}%
          </Text>

          <Text>
            Adherencia:{' '}
            {summary.adherence.toFixed(2)}%
          </Text>

          <Text>
            Tendencia:{' '}
            {summary.trend}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="title">
            Clasificación
          </Text>

          <Text>
            Predominante:{' '}
            {summary.predominantClassification}
          </Text>

          <Text selectable>
            {JSON.stringify(
              summary.classificationDistribution,
              null,
              2,
            )}
          </Text>
        </View>

        <View style={styles.section}>
          <Text variant="title">
            Registros reales
          </Text>

          {records.map(record => (
            <Text
              key={record.id}
              selectable
            >
              {record.dateTime} —{' '}
              {record.systolic}/
              {record.diastolic}
              {record.heartRate !== undefined
                ? ` — FC ${record.heartRate}`
                : ' — sin FC'}
            </Text>
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 32,
  },

  section: {
    gap: 8,
  },
})
