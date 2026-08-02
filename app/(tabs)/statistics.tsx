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
          <Text variant="title">
            Sin datos
          </Text>

          <Text style={styles.subtitle}>
            Registrá tu primera medición para comenzar a visualizar estadísticas.
          </Text>
        </Card>
      </Screen>
    )
  }

  const count = measurements.length

  const avgSys = Math.round(
    measurements.reduce((a, m) => a + m.systolic, 0) / count,
  )

  const avgDia = Math.round(
    measurements.reduce((a, m) => a + m.diastolic, 0) / count,
  )

  const hrValues = measurements.filter(
    (m) => m.heartRate != null,
  )

  const avgHr =
    hrValues.length > 0
      ? Math.round(
          hrValues.reduce(
            (a, m) => a + (m.heartRate ?? 0),
            0,
          ) / hrValues.length,
        )
      : null

  const last = measurements[0]

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
          <Text variant="caption">
            FC promedio
          </Text>

          <Text variant="h2">
            {avgHr ?? '--'}
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text variant="caption">
            Última medición
          </Text>

          <Text variant="body">
            {last.dateTime}
          </Text>
        </Card>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },

  grid: {
    gap: 16,
  },

  card: {
    gap: 8,
  },
})
