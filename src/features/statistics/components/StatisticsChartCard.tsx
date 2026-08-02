import { StyleSheet } from 'react-native'

import { ClinicalChartContainer } from '@/components/charts/ClinicalChartContainer'
import { Card, Text } from '@/components/ui'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

interface Props {
  records: BloodPressureRecord[]
}

export function StatisticsChartCard({
  records,
}: Props) {
  return (
    <Card style={styles.card}>
      <Text variant="title">
        Evolución de la presión
      </Text>

      <ClinicalChartContainer
        records={records}
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
})
