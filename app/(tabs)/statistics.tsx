import { ScrollView, StyleSheet, View } from 'react-native'

import {
  Card,
  Screen,
  SectionTitle,
  Text,
} from '@/components/ui'
import { ClinicalChart } from '@/components/charts/ClinicalChart'
import { StatisticsService } from '@/features/dashboard/services/StatisticsService'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'
import { formatDateTime } from '@/utils/date'

export default function StatisticsScreen() {
  const { measurements } = useMeasurements()

  if (measurements.length === 0) {
    return (
      <Screen>
        <SectionTitle
          title="Estadísticas"
          subtitle="Resumen clínico"
        />

        <Card>
          <Text variant="title">
            Sin registros
          </Text>

          <Text>
            Registrá una medición para comenzar.
          </Text>
        </Card>
      </Screen>
    )
  }

  const stats = new StatisticsService(measurements)

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle
          title="Estadísticas"
          subtitle="Resumen clínico"
        />

        <Card style={styles.chartCard}>
          <Text variant="title">
            Evolución de la presión
          </Text>

          <ClinicalChart
            records={measurements}
          />
        </Card>

        <View style={styles.grid}>
          <Card style={styles.card}>
            <Text variant="caption">Registros</Text>
            <Text variant="h2">{stats.total}</Text>
          </Card>

          <Card style={styles.card}>
            <Text variant="caption">
              Presión promedio
            </Text>
            <Text variant="h2">
              {stats.averageSystolic}/{stats.averageDiastolic}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text variant="caption">
              Presión máxima
            </Text>
            <Text variant="h2">
              {stats.maxSystolic}/{stats.maxDiastolic}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text variant="caption">
              Presión mínima
            </Text>
            <Text variant="h2">
              {stats.minSystolic}/{stats.minDiastolic}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text variant="caption">
              FC promedio
            </Text>
            <Text variant="h2">
              {stats.averageHeartRate ?? '--'}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text variant="caption">
              Clasificación predominante
            </Text>
            <Text variant="title">
              {stats.predominantClassification}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text variant="caption">
              Registros normales
            </Text>
            <Text variant="h2">
              {stats.normalPercentage}%
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text variant="caption">
              Última medición
            </Text>
            <Text>
              {formatDateTime(
                measurements[0].dateTime,
              )}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  chartCard: {
    marginBottom: 20,
  },

  grid: {
    gap: 16,
    paddingBottom: 24,
  },

  card: {
    gap: 8,
  },
})
