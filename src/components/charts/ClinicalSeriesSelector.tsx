import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import { Text } from '@/components/ui'

import { ClinicalSeries } from './types/ClinicalSeries'

type Props = {
  availableSeries: ClinicalSeries[]

  selectedSeries: ClinicalSeries[]

  onChange: (
    series: ClinicalSeries[],
  ) => void
}

export function ClinicalSeriesSelector({
  availableSeries,
  selectedSeries,
  onChange,
}: Props) {
  function toggleSeries(
    item: ClinicalSeries,
  ) {
    const exists =
      selectedSeries.some(
        (series) =>
          series.key === item.key,
      )

    if (exists) {
      onChange(
        selectedSeries.filter(
          (series) =>
            series.key !== item.key,
        ),
      )

      return
    }

    onChange([
      ...selectedSeries,
      item,
    ])
  }

  return (
    <View style={styles.container}>
      {availableSeries.map(
        (item) => {
          const active =
            selectedSeries.some(
              (series) =>
                series.key === item.key,
            )

          return (
            <Pressable
              key={item.key}
              onPress={() =>
                toggleSeries(item)
              }
              style={[
                styles.item,
                active &&
                  styles.active,
              ]}
            >
              <Text>
                {active ? '✓ ' : ''}
                {item.label}
              </Text>
            </Pressable>
          )
        },
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  item: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  active: {
    backgroundColor: '#E5E7EB',
  },
})
