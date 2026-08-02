import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'

import type { StatisticsFilter } from '@/domain/statistics/models'

const OPTIONS: Array<{
  label: string
  value: StatisticsFilter['period']
}> = [
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
  { label: '90 días', value: '90d' },
  { label: 'Personalizado', value: 'custom' },
]

interface Props {
  value: StatisticsFilter['period']
  onChange: (period: StatisticsFilter['period']) => void
}

export function StatisticsPeriodSelector({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {OPTIONS.map(option => (
        <Pressable
          key={option.value}
          style={[
            styles.chip,
            value === option.value && styles.selected,
          ]}
          onPress={() => onChange(option.value)}
        >
          <Text>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selected: {
    backgroundColor: '#2563EB',
  },
})
