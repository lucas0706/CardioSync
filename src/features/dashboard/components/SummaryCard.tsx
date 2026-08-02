import { StyleSheet, View } from 'react-native'

import { Card, Text } from '@/components/ui'
import { theme } from '@/theme'

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
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.value}>{value}</Text>

        {subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
    minHeight: 112,
    justifyContent: 'center',
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  value: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },

  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
})
