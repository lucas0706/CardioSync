import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type MetricCardProps = {
  label: string
  value: string
  unit?: string
  style?: StyleProp<ViewStyle>
}

export function MetricCard({
  label,
  value,
  unit,
  style,
}: MetricCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>

      {unit ? (
        <Text style={styles.unit}>
          {unit}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 108,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },

  label: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.label,
    color: theme.colors.textSecondary,
  },

  value: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.typography.bold,
    fontSize: theme.typography.metric,
    lineHeight: 42,
    color: theme.colors.text,
  },

  unit: {
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },
})
