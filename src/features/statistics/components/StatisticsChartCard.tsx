import { StyleSheet } from 'react-native'

import {
  ClinicalChartV3,
} from '@/components/charts/ClinicalChartV3/ClinicalChartV3'

import {
  Card,
} from '@/components/ui'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

interface Props {
  records: BloodPressureRecord[]
  period: '7d' | '30d' | '90d'
}

export function StatisticsChartCard({
  records,
  period,
}: Props) {
  return (
    <Card style={styles.card}>
      <ClinicalChartV3
        records={records}
        period={period}
      />
    </Card>
  )
}

const styles =
  StyleSheet.create({
    card: {
      marginBottom: 20,
    },
  })
