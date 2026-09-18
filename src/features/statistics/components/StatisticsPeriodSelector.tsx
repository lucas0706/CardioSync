import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

import type { StatisticsFilter } from '@/domain/statistics/models'

const OPTIONS: Array<{
  label: string
  value: StatisticsFilter['period']
  flex: number
}> = [
  {
    label: '7 días',
    value: '7d',
    flex: 0.8,
  },
  {
    label: '30 días',
    value: '30d',
    flex: 0.9,
  },
  {
    label: '90 días',
    value: '90d',
    flex: 0.9,
  },
  {
    label: 'Personalizado',
    value: 'custom',
    flex: 1.6,
  },
]

interface Props {
  value: StatisticsFilter['period']
  onChange: (
    period: StatisticsFilter['period'],
  ) => void
}

export function StatisticsPeriodSelector({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {OPTIONS.map(option => {
        const selected =
          value === option.value

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{
              selected,
            }}
            onPress={() =>
              onChange(option.value)
            }
            style={[
              styles.option,
              {
                flex: option.flex,
              },
              selected &&
                styles.selected,
            ]}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                selected &&
                  styles.selectedLabel,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor:
      theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },

  option: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal:
      theme.spacing.sm,
    borderRadius:
      theme.radius.sm,
  },

  selected: {
    backgroundColor:
      theme.colors.success,
  },

  label: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  selectedLabel: {
    color:
      theme.colors.white,
    fontFamily:
      theme.typography.semiBold,
  },
})
