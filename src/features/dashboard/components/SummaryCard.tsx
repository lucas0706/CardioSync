import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'

type Props = {
  title: string
  value: string
  subtitle?: string
}

export function SummaryCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },

  title: {
    fontSize: 14,
    opacity: 0.7,
  },

  value: {
    fontSize: 32,
    fontWeight: '700',
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
})
