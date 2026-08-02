import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'
import { ClinicalSeries } from './types/ClinicalSeries'

const SYMBOL = {
  square: '□',
  circle: '○',
  triangle: '△',
} as const

type Props = {
  available: ClinicalSeries[]
  selected: ClinicalSeries[]
  onToggle(series: ClinicalSeries): void
}

export function ClinicalLegend({
  available,
  selected,
  onToggle,
}: Props) {
  return (
    <View style={styles.container}>
      {available.map(item => {
        const active = selected.some(
          s => s.key === item.key,
        )

        return (
          <Pressable
            key={item.key}
            onPress={() => onToggle(item)}
            style={[
              styles.chip,
              {
                borderColor: item.color,
                opacity: active ? 1 : 0.45,
              },
            ]}
          >
            <Text style={{ color: item.color }}>
              {SYMBOL[item.symbol]} {item.label}
            </Text>

            <Text style={styles.unit}>
              {item.unit}
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
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.2,
    minWidth: 110,
  },

  unit: {
    fontSize: 11,
    opacity: 0.65,
    marginTop: 2,
  },
})
