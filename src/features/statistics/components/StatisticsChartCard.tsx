import { StyleSheet } from 'react-native'

import { ClinicalChartContainer } from '@/components/charts/ClinicalChartContainer'
import type { ClinicalSeriesKey } from '@/components/charts/ClinicalChart/types/ClinicalSeries'
import { Card, Text } from '@/components/ui'
import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

interface Props {
  records: BloodPressureRecord[]
}

const EXCLUDED_STATISTICS_SERIES: ClinicalSeriesKey[] = [
  'glucose',
  'temperature',
]

export function StatisticsChartCard({
  records,
}: Props) {
  return (
    <Card style={styles.card}>
      <Text>
        Evolución de la presión
      </Text>

      <ClinicalChartContainer
        records={records}
        excludedSeriesKeys={
          EXCLUDED_STATISTICS_SERIES
        }
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
})
