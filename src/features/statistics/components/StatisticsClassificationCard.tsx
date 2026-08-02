import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'

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
        .map(([label, count]) => (
          <View
            key={label}
            style={styles.row}
          >
            <Text>
              {label}
            </Text>

            <Text variant="title">
              {count}
            </Text>
          </View>
        ))}
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
