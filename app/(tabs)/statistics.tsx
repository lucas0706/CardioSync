import { StyleSheet, View } from 'react-native'

import {
  Card,
  Screen,
  SectionTitle,
  Text,
} from '@/components/ui'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

export default function StatisticsScreen() {
  const { measurements } = useMeasurements()

  if (measurements.length === 0) {
    return (
      <Screen>
        <SectionTitle
          title="Estadísticas"
          subtitle="Resumen de tus mediciones"
        />

        <Card>
          <Text variant="title">Sin datos</Text>

          <Text style={styles.description}>
            Registrá tu primera medición para comenzar a visualizar estadísticas.
          </Text>
        </Card>
      </Screen>
    )
  }

  const count = measurements.length

  const avgSys = Math.round(
    measurements.reduce((sum, item) => sum + item.systolic, 0) / count,
  )

  const avgDia = Math.round(
    measurements.reduce((sum, item) => sum + item.diastolic, 0) / count,
  )

  const heartRates = measurements
    .map((item) => item.heartRate)
    .filter((value): value is number => value !== undefined)

  const avgHeartRate =
    heartRates.length > 0
      ? Math.round(
          heartRates.reduce((sum, value) => sum + value, 0) /
            heartRates.length,
        )
      : null

  const maxSys = Math.max(...measurements.map((m) => m.systolic))
  const minSys = Math.min(...measurements.map((m) => m.systolic))

  const maxDia = Math.max(...measurements.map((m) => m.diastolic))
  const minDia = Math.min(...measurements.map((m) => m.diastolic))

  const latest = measurements[0]

  return (
    <Screen>
      <SectionTitle
        title="Estadísticas"
        subtitle="Resumen de tus mediciones"
      />

      <View style={styles.grid}>
        <Card style={styles.card}>
          <Text variant="caption">Registros</Text>
          <Text variant="h2">{count}</Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="caption">Promedio</Text>
          <Text variant="h2">
            {avgSys}/{avgDia}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="caption">Máxima</Text>
          <Text variant="h2">
            {maxSys}/{maxDia}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="caption">Mínima</Text>
          <Text variant="h2">
            {minSys}/{minDia}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="caption">FC promedio</Text>
          <Text variant="h2">
            {avgHeartRate ?? '--'}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="caption">Última medición</Text>
          <Text variant="body">
            {latest.dateTime}
          </Text>
        </Card>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  grid: {
    gap: 16,
  },

  card: {
    gap: 8,
  },

  description: {
    marginTop: 8,
    opacity: 0.7,
    lineHeight: 22,
  },
})
