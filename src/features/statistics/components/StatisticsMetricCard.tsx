import { StyleSheet } from 'react-native'

import { Card, Text } from '@/components/ui'

interface StatisticsMetricCardProps {
  title: string
  value: string | number
  subtitle?: string
}

export function StatisticsMetricCard({
  title,
  value,
  subtitle,
}: StatisticsMetricCardProps) {
  return (
    <Card style={styles.card}>
      <Text variant="caption">
        {title}
      </Text>

      <Text variant="h2">
        {value}
      </Text>

      {subtitle ? (
        <Text variant="caption">
          {subtitle}
        </Text>
      ) : null}
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
  },
})
