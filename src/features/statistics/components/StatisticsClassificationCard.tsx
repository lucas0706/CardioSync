import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'
import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'
import type {
  BloodPressureCategory,
} from '@/domain/clinical/classification'

interface Props {
  distribution?: Record<string, number>
}

export function StatisticsClassificationCard({
  distribution,
}: Props) {
  if (!distribution) {
    return null
  }

  const entries = Object.entries(distribution)

  if (entries.length === 0) {
    return null
  }

  return (
    <Card style={styles.card}>
      <Text variant="caption">
        Distribución clínica
      </Text>

      {entries
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => {
          const classification =
            BloodPressureClassifier.getClassification(
              category as BloodPressureCategory,
            )

          return (
            <View
              key={category}
              style={styles.row}
            >
              <Text>
                {classification.label}
              </Text>

              <Text variant="title">
                {count}
              </Text>
            </View>
          )
        })}
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    marginBottom: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
